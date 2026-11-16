#!/usr/bin/env python3
"""Ensambla el video de un nivel: cuadros + narración → MP4 (H.264 + AAC),
con fundidos entre pasos, capítulos por escena y subtítulos en español.

  python3 ensamblar.py nivel1 [nivel2 ...] [--salida carpeta] [--alto 1080]
"""
import json
import os
import re
import subprocess
import sys
import unicodedata
import wave

import numpy as np
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
BUILD = os.environ.get('VC_BUILD', os.path.join(AQUI, 'build'))
FPS, SR = 30, 44100
MPC = SR // FPS                       # muestras de audio por cuadro
ENTRADA = 0.32                        # s entre que aparece el paso y empieza la voz
COLA, COLA_ESCENA, COLA_FINAL = 0.55, 1.0, 2.0
F_PASO, F_ESCENA, F_INICIO = 8, 14, 15  # cuadros de fundido


def a_yuv(ruta, tam):
    """PNG → planos YUV 4:2:0 (BT.709, rango limitado) como un vector uint8."""
    img = Image.open(ruta).convert('RGB')
    if img.size != tam:
        img = img.resize(tam, Image.LANCZOS)
    a = np.asarray(img, dtype=np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    cb, cr = (b - y) / 1.8556, (r - y) / 1.5748
    h, w = y.shape
    sub = lambda c: c.reshape(h // 2, 2, w // 2, 2).mean(axis=(1, 3))
    planos = [16 + y * 219 / 255, 128 + sub(cb) * 224 / 255, 128 + sub(cr) * 224 / 255]
    return np.concatenate([np.clip(np.rint(p), 0, 255).astype(np.uint8).ravel() for p in planos])


def mezclar(a, b, t):
    k = int(round(t * 256))
    return ((a.astype(np.uint16) * (256 - k) + b.astype(np.uint16) * k) >> 8).astype(np.uint8)


def leer_wav(ruta):
    with wave.open(ruta) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2')


def hms(t, sep=','):
    ms = int(round(t * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d}{sep}{ms % 1000:03d}'


def trocear(texto, maximo=84):
    """Parte una frase larga en trozos legibles como subtítulo."""
    palabras, trozos, actual = texto.split(), [], ''
    for p in palabras:
        if actual and len(actual) + 1 + len(p) > maximo:
            trozos.append(actual); actual = p
        else:
            actual = (actual + ' ' + p).strip()
        if actual.endswith((',', ';', ':')) and len(actual) > maximo * 0.6:
            trozos.append(actual); actual = ''
    if actual:
        if trozos and len(actual) < 14:
            trozos[-1] += ' ' + actual
        else:
            trozos.append(actual)
    return trozos


def dos_lineas(t):
    if len(t) <= 44:
        return t
    medio, mejor = len(t) // 2, None
    for m in re.finditer(' ', t):
        if mejor is None or abs(m.start() - medio) < abs(mejor - medio):
            mejor = m.start()
    return t if mejor is None else t[:mejor] + '\n' + t[mejor + 1:]


def nombre_archivo(m):
    s = ''.join(c for c in unicodedata.normalize('NFD', m['titulo']) if unicodedata.category(c) != 'Mn')
    return f"Nivel_{m['id'].replace('nivel', '')}_{re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_')}"


def ensamblar(idn, salida, alto):
    d = os.path.join(BUILD, idn)
    m = json.load(open(os.path.join(d, 'manifiesto.json')))
    mv = json.load(open(os.path.join(d, 'manifiesto_voz.json')))
    assert len(m['pasos']) == len(mv['pasos']), 'la narración no corresponde a los cuadros: vuelve a ejecutar narrar.py'
    for a, b in zip(m['pasos'], mv['pasos']):
        assert a['voz'] == b['voz'], 'la narración está desactualizada: vuelve a ejecutar narrar.py'
        a.update(audio=b['audio'], dur=b['dur'], marcas=b['marcas'])
    pasos = m['pasos']
    tam = (alto * 16 // 9, alto)
    base = nombre_archivo(m)
    os.makedirs(salida, exist_ok=True)
    mp4 = os.path.join(salida, base + '.mp4')
    wav_tmp, meta_tmp, srt = os.path.join(d, 'pista.wav'), os.path.join(d, 'capitulos.txt'), os.path.join(salida, base + '.srt')

    # ---- línea de tiempo ----
    plan, n_total = [], 0
    for i, p in enumerate(pasos):
        fin_escena = i == len(pasos) - 1 or pasos[i + 1]['e'] != p['e']
        cola = COLA_FINAL if i == len(pasos) - 1 else COLA_ESCENA if fin_escena else COLA
        cuerpo = ENTRADA + p['dur'] if p['dur'] > 0 else 0.9
        n = int(round((max(cuerpo, len(p['anim']) / FPS) + cola) * FPS))
        plan.append((n_total, n)); n_total += n
    dur_total = n_total / FPS

    # ---- audio, subtítulos y capítulos ----
    pista = np.zeros(n_total * MPC, dtype=np.int16)
    subs, caps = [], []
    for (ini, n), p in zip(plan, pasos):
        if p['p'] == 0:
            caps.append((ini / FPS, m['escenas'][p['e']]))
        if p['dur'] > 0:
            x = leer_wav(os.path.join(d, 'audio', p['audio']))
            a = ini * MPC + int(ENTRADA * SR)
            pista[a:a + len(x)] = x[:len(pista) - a]
            t0 = ini / FPS + ENTRADA
            for mk in p['marcas']:
                trozos = trocear(mk['texto'])
                largo, t = sum(len(s) for s in trozos), t0 + mk['ini']
                for s in trozos:
                    dt = (mk['fin'] - mk['ini']) * len(s) / largo
                    subs.append((t, t + dt, s)); t += dt
    with wave.open(wav_tmp, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pista.tobytes())
    with open(srt, 'w', encoding='utf-8') as f:
        for k, (a, b, s) in enumerate(subs, 1):
            b = min(b + 0.12, subs[k][0] - 0.02) if k < len(subs) else b + 0.12
            f.write(f'{k}\n{hms(a)} --> {hms(b)}\n{dos_lineas(s)}\n\n')
    with open(os.path.join(salida, base + '.vtt'), 'w', encoding='utf-8') as f:
        f.write('WEBVTT\n\n')
        for k, (a, b, s) in enumerate(subs, 1):
            b = min(b + 0.12, subs[k][0] - 0.02) if k < len(subs) else b + 0.12
            f.write(f'{hms(a, ".")} --> {hms(b, ".")}\n{dos_lineas(s)}\n\n')
    with open(meta_tmp, 'w', encoding='utf-8') as f:
        f.write(f";FFMETADATA1\ntitle={m['etiqueta'].title()} · {m['titulo']}\nalbum=Variable compleja: curso intensivo por niveles\nlanguage=spa\n")
        for k, (t, tit) in enumerate(caps):
            fin = caps[k + 1][0] if k + 1 < len(caps) else dur_total
            tit = tit.replace('=', r'\=').replace(';', r'\;').replace('#', r'\#')
            f.write(f'[CHAPTER]\nTIMEBASE=1/1000\nSTART={int(t * 1000)}\nEND={int(fin * 1000)}\ntitle={tit}\n')

    # ---- video ----
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', f'{tam[0]}x{tam[1]}', '-r', str(FPS), '-i', 'pipe:0',
           '-i', wav_tmp, '-i', meta_tmp, '-i', srt, '-map', '0:v', '-map', '1:a', '-map', '3:s', '-map_metadata', '2', '-map_chapters', '2',
           '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-x264-params', 'keyint=300:min-keyint=30', '-pix_fmt', 'yuv420p',
           '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
           '-c:a', 'aac', '-b:a', '96k', '-ar', str(SR), '-af', 'loudnorm=I=-17:TP=-1.5:LRA=11',
           '-c:s', 'mov_text', '-metadata:s:s:0', 'language=spa', '-metadata:s:a:0', 'language=spa',
           '-movflags', '+faststart', mp4]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    negro = a_yuv_negro(tam)
    previo = negro
    for i, ((ini, n), p) in enumerate(zip(plan, pasos)):
        final = a_yuv(os.path.join(d, 'cuadros', p['cuadro']), tam)
        anim = [a_yuv(os.path.join(d, 'cuadros', f), tam) for f in p['anim']]
        nf = F_INICIO if i == 0 else F_ESCENA if p['p'] == 0 else F_PASO
        fb = final.tobytes()
        for k in range(n):
            cuadro = anim[k] if k < len(anim) else final
            if k < nf:
                proc.stdin.write(mezclar(previo, cuadro, (k + 1) / (nf + 1)).tobytes())
            elif k < len(anim):
                proc.stdin.write(cuadro.tobytes())
            else:
                proc.stdin.write(fb)
        previo = final
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError('ffmpeg falló')
    mb = os.path.getsize(mp4) / 1e6
    print(f'{idn}: {mp4}  {dur_total / 60:.1f} min  {mb:.1f} MB  ({mb * 8000 / dur_total:.0f} kb/s)')
    return mp4


def a_yuv_negro(tam):
    w, h = tam
    return np.concatenate([np.full(w * h, 16, np.uint8), np.full(w * h // 2, 128, np.uint8)])


if __name__ == '__main__':
    args = sys.argv[1:]
    salida = os.path.join(AQUI, '..', 'videos')
    alto = 1080
    if '--salida' in args:
        salida = args[args.index('--salida') + 1]; del args[args.index('--salida'):args.index('--salida') + 2]
    if '--alto' in args:
        alto = int(args[args.index('--alto') + 1]); del args[args.index('--alto'):args.index('--alto') + 2]
    for a in args:
        ensamblar(a, os.path.abspath(salida), alto)
