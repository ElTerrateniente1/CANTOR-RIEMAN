#!/usr/bin/env python3
"""Narración de un nivel: sintetiza cada frase (Supertonic 3 vía sherpa-onnx), la
verifica con reconocimiento de voz (Whisper) y arma un WAV por paso.

  python3 narrar.py nivel1 [nivel2 ...] [--sin-asr]

Variables de entorno:
  VC_BUILD  carpeta de trabajo (por defecto ./build)
  VC_VOZ    carpeta con el modelo de voz (ver preparar_voz.sh)
  VC_ASR    carpeta del proyecto node con asr.mjs (ver preparar_voz.sh)

La síntesis es aleatoria (cada intento suena distinto). Para cada frase se
conserva la toma que el reconocedor transcribe mejor; las tomas quedan en caché.
"""
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
import wave

import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
BUILD = os.environ.get('VC_BUILD', os.path.join(AQUI, 'build'))
VOZ = os.environ.get('VC_VOZ', os.path.join(AQUI, 'build', 'voz_supertonic3'))
ASR = os.environ.get('VC_ASR', os.path.join(AQUI, 'build', 'asr'))
CACHE = os.path.join(BUILD, 'voz_cache')
SID, VELOCIDAD, PASOS_FM = 2, 1.0, 8          # voz F3, velocidad natural
UMBRAL, MAX_TOMAS = 0.86, 4                    # similitud mínima aceptable y reintentos
SR = 44100

_tts = None


def motor():
    global _tts
    if _tts is None:
        import sherpa_onnx
        d = VOZ + '/'
        cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
            supertonic=sherpa_onnx.OfflineTtsSupertonicModelConfig(
                duration_predictor=d + 'duration_predictor.onnx', text_encoder=d + 'text_encoder.onnx',
                vector_estimator=d + 'vector_estimator.onnx', vocoder=d + 'vocoder.onnx',
                tts_json=d + 'tts.json', unicode_indexer=d + 'unicode_indexer.bin', voice_style=d + 'voice.bin'),
            num_threads=4))
        _tts = sherpa_onnx.OfflineTts(cfg)
        assert _tts.sample_rate == SR
    return _tts


def sintetizar(texto):
    import sherpa_onnx
    g = sherpa_onnx.GenerationConfig()
    g.sid, g.speed, g.num_steps, g.extra = SID, VELOCIDAD, PASOS_FM, {'lang': 'es'}
    return np.asarray(motor().generate(texto, g).samples, dtype=np.float32)


def recortar(x, umbral=0.012, margen=0.03):
    """Quita el silencio inicial y final."""
    env = np.abs(x)
    idx = np.nonzero(env > umbral)[0]
    if len(idx) == 0:
        return x
    a, b = max(0, idx[0] - int(margen * SR)), min(len(x), idx[-1] + int(margen * SR))
    y = x[a:b].copy()
    n = int(0.008 * SR)
    y[:n] *= np.linspace(0, 1, n)
    y[-n:] *= np.linspace(1, 0, n)
    return y


def guardar(ruta, x):
    with wave.open(ruta, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def leer(ruta):
    with wave.open(ruta) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768


def frases(texto):
    """Divide en frases; las muy largas se parten en ';' o ':'."""
    partes = [p.strip() for p in re.split(r'(?<=[.!?…])\s+', texto) if p.strip()]
    salida = []
    for p in partes:
        if len(p) > 230:
            sub = [s.strip() for s in re.split(r'(?<=[;:])\s+', p) if s.strip()]
            salida.extend(sub)
        else:
            salida.append(p)
    return salida


# ---------- comparación texto esperado / transcripción ----------
LETRAS = {'z': 'zeta', 'x': 'equis', 'y': 'i', 'f': 'efe', 'g': 'ge', 'h': 'hache', 't': 'te', 'r': 'erre', 'v': 'uve',
          'b': 'be', 'c': 'ce', 'd': 'de', 'n': 'ene', 'm': 'eme', 'p': 'pi', 'k': 'ka', 'l': 'ele', 's': 'ese', 'w': 'dobleu',
          'q': 'cu', 'j': 'jota'}
NUM = {'0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho',
       '9': 'nueve', '10': 'diez', '11': 'once', '12': 'doce', '15': 'quince', '16': 'dieciseis', '18': 'dieciocho', '19': 'diecinueve',
       '20': 'veinte', '36': 'treintaiseis', '45': 'cuarentaicinco', '70': 'setenta', '100': 'cien'}
EQUIV = [('ye', 'i'), ('ve', 'uve'), ('theta', 'teta'), ('zeta', 'seta'), ('ceta', 'seta'), ('uno', 'un'), ('una', 'un'),
         ('mas', 'mas'), ('igual', 'igual')]


def canon(s):
    s = s.lower().replace('π', ' pi ').replace('+', ' mas ').replace('=', ' igual ').replace('²', ' cuadrado ')
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r'(\d)([a-z])', r'\1 \2', s)
    s = re.sub(r'([a-z])(\d)', r'\1 \2', s)
    toks = re.sub(r'[^a-z0-9 ]', ' ', s).split()
    out = []
    for t in toks:
        if t in NUM:
            out.append(NUM[t])
        elif t.isdigit():
            out.extend(NUM.get(c, c) for c in t)
        elif len(t) == 1 and t in LETRAS:
            out.append(LETRAS[t])
        elif len(t) <= 3 and not re.search(r'[aeiou]', t):
            out.extend(LETRAS.get(c, c) for c in t)
        else:
            out.append(t)
    r = ''.join(out)
    for a, b in EQUIV:
        r = r.replace(a, b)
    return r.replace('y', 'i').replace('v', 'b').replace('z', 's').replace('ce', 'se').replace('ci', 'si').replace('h', '')


def similitud(esperado, oido):
    return difflib.SequenceMatcher(None, canon(esperado), canon(oido), autojunk=False).ratio()


def transcribir(rutas):
    if not rutas:
        return {}
    lista = os.path.join(CACHE, '_lote.json')
    json.dump(rutas, open(lista, 'w'))
    r = subprocess.run(['node', 'asr.mjs', '--lista', lista], cwd=ASR, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError('ASR falló: ' + r.stderr[-800:])
    return json.loads(r.stdout)


def clave(texto):
    return hashlib.sha1(f'{SID}|{VELOCIDAD}|{PASOS_FM}|{texto}'.encode()).hexdigest()[:16]


def narrar(ids, usar_asr=True):
    os.makedirs(CACHE, exist_ok=True)
    ruta_indice = os.path.join(CACHE, 'indice.json')
    indice = json.load(open(ruta_indice)) if os.path.exists(ruta_indice) else {}
    manifiestos = {i: json.load(open(os.path.join(BUILD, i, 'manifiesto.json'))) for i in ids}
    todas = []
    for i in ids:
        for p in manifiestos[i]['pasos']:
            p['frases'] = frases(p['voz'])
            for f in p['frases']:
                if re.search(r'\d', f):
                    print(f'  ⚠ dígitos en la narración ({i}): {f[:70]}')
                todas.append(f)
    pendientes = [f for f in dict.fromkeys(todas) if clave(f) not in indice or (usar_asr and indice[clave(f)].get('sim') is None)]
    print(f'{len(set(todas))} frases distintas; {len(pendientes)} por procesar')
    ronda = 0
    while pendientes and ronda < MAX_TOMAS:
        nuevas = []
        for n, f in enumerate(pendientes):
            k = clave(f)
            ent = indice.setdefault(k, {'texto': f, 'tomas': 0, 'mejor': None, 'sim': None, 'oido': None})
            ruta = os.path.join(CACHE, f'{k}_{ent["tomas"]}.wav')
            if not (ent['tomas'] == 0 and os.path.exists(ruta)):
                guardar(ruta, recortar(sintetizar(f)))
            nuevas.append((k, ent['tomas'], ruta))
            ent['tomas'] += 1
            if n % 25 == 24:
                print(f'   ronda {ronda + 1}: {n + 1}/{len(pendientes)}', flush=True)
        if not usar_asr:
            for k, t, _ in nuevas:
                indice[k]['mejor'] = indice[k]['mejor'] if indice[k]['mejor'] is not None else t
            pendientes = []
            break
        oidos = transcribir([r for _, _, r in nuevas])
        siguientes = []
        for k, t, ruta in nuevas:
            ent = indice[k]
            dur = len(leer(ruta)) / SR
            cps = len(ent['texto']) / max(dur, 0.1)
            s = similitud(ent['texto'], oidos[ruta])
            if not (9.0 <= cps <= 19.5) and len(ent['texto']) > 25:
                s = min(s, 0.5)   # ritmo anómalo: probable salto o repetición
            if ent['sim'] is None or s > ent['sim']:
                ent.update(mejor=t, sim=round(s, 3), oido=oidos[ruta], cps=round(cps, 1))
            if ent['sim'] < UMBRAL:
                siguientes.append(ent['texto'])
        json.dump(indice, open(ruta_indice, 'w'), ensure_ascii=False, indent=1)
        pendientes = siguientes
        ronda += 1
        print(f'  ronda {ronda}: {len(pendientes)} frases por debajo del umbral {UMBRAL}')
    json.dump(indice, open(ruta_indice, 'w'), ensure_ascii=False, indent=1)

    # ---- un WAV por paso + informe ----
    for i in ids:
        m = manifiestos[i]
        dir_a = os.path.join(BUILD, i, 'audio')
        os.makedirs(dir_a, exist_ok=True)
        dudosas = []
        for n, p in enumerate(m['pasos']):
            trozos, marcas, t = [], [], 0.0
            for j, f in enumerate(p['frases']):
                ent = indice[clave(f)]
                x = leer(os.path.join(CACHE, f'{clave(f)}_{ent["mejor"]}.wav'))
                pico = float(np.abs(x).max()) or 1.0
                x = x * min(0.85 / pico, 3.0)
                if j:
                    pausa = 0.34 if re.search(r'[.!?…]$', p['frases'][j - 1]) else 0.22
                    trozos.append(np.zeros(int(pausa * SR), dtype=np.float32)); t += pausa
                marcas.append({'texto': f, 'ini': round(t, 3), 'fin': round(t + len(x) / SR, 3)})
                trozos.append(x); t += len(x) / SR
                if usar_asr and ent.get('sim') is not None and ent['sim'] < UMBRAL:
                    dudosas.append((ent['sim'], f, ent['oido']))
            audio = np.concatenate(trozos) if trozos else np.zeros(0, dtype=np.float32)
            p['audio'] = f'p{n:03d}.wav'
            p['dur'] = round(len(audio) / SR, 3)
            p['marcas'] = marcas
            guardar(os.path.join(dir_a, p['audio']), audio)
        json.dump(m, open(os.path.join(BUILD, i, 'manifiesto_voz.json'), 'w'), ensure_ascii=False, indent=1)
        total = sum(p['dur'] for p in m['pasos'])
        print(f'{i}: {total / 60:.1f} min de narración; {len(dudosas)} frases dudosas')
        for s, f, o in sorted(dudosas)[:40]:
            print(f'   [{s:.2f}] {f}\n          oído: {o}')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    narrar(args, usar_asr='--sin-asr' not in sys.argv)
