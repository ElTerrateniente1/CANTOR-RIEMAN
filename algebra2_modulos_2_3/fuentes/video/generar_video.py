"""Genera el video AL2-M23-04 a partir de escenas.js.

Pasos: (1) lista de planos, (2) narración con piper (voz es_MX-claude-high),
(3) capturas PNG con Playwright, (4) pista de video con la duración exacta de cada
plano (redondeada a fotogramas para evitar desfases), (5) audio completo normalizado,
(6) subtítulos SRT y capítulos, (7) multiplexado final en MP4.

Uso: python3 fuentes/video/generar_video.py --voz /ruta/es_MX-claude-high.onnx
"""
import argparse
import json
import math
import re
import subprocess
import wave
from pathlib import Path

import numpy as np

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
TMP = RAIZ / ".tmp" / "video"
SAL = RAIZ / "entregables"
FPS = 25
PAUSA_ANTES, PAUSA_DESPUES = 0.35, 0.65
PAUSA_TARJETA = 1.2


def cargar_escenas():
    js = "console.log(JSON.stringify(require(process.argv[1])))"
    return json.loads(subprocess.check_output(["node", "-e", js, str(AQUI / "escenas.js")]))


def planos_de(escenas):
    planos = []
    for ci, cap in enumerate(escenas):
        if ci > 0:
            planos.append({"id": f"c{ci:02d}_t", "c": ci, "s": "tarjeta", "p": 0, "cap": ci, "voz": cap["vt"], "tarjeta": True})
        for si, sl in enumerate(cap["slides"]):
            for pi, paso in enumerate(sl["pasos"]):
                planos.append({"id": f"c{ci:02d}_s{si:02d}_p{pi:02d}", "c": ci, "s": si, "p": pi, "cap": ci,
                               "voz": paso["v"], "titulo": sl["t"], "tarjeta": False})
    return planos


def sintetizar(planos, modelo, escala):
    from piper import PiperVoice, SynthesisConfig
    voz = PiperVoice.load(str(modelo), config_path=str(modelo) + ".json")
    cfg = SynthesisConfig(length_scale=escala)
    sr = None
    for pl in planos:
        ruta = TMP / "audio" / f"{pl['id']}.wav"
        if not ruta.exists():
            with wave.open(str(ruta), "wb") as w:
                voz.synthesize_wav(pl["voz"], w, syn_config=cfg)
        with wave.open(str(ruta), "rb") as w:
            sr = w.getframerate()
            pl["muestras"] = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return sr


def ensamblar_audio(planos, sr):
    t = 0.0
    partes = []
    for pl in planos:
        voz = pl["muestras"]
        antes = PAUSA_TARJETA if pl["tarjeta"] else PAUSA_ANTES
        despues = PAUSA_TARJETA if pl["tarjeta"] else PAUSA_DESPUES
        bruto = antes + len(voz) / sr + despues
        dur = math.ceil(bruto * FPS) / FPS              # múltiplo exacto de un fotograma
        n_total = round(dur * sr)
        seg = np.zeros(n_total, dtype=np.int16)
        i0 = round(antes * sr)
        seg[i0:i0 + len(voz)] = voz
        partes.append(seg)
        pl.update(inicio=t, dur=dur, voz_ini=t + antes, voz_fin=t + antes + len(voz) / sr)
        t += dur
    audio = np.concatenate(partes)
    with wave.open(str(TMP / "narracion.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(audio.tobytes())
    return t


def fmt(t, sep=","):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}"


def trozos(texto, maximo=84):
    frases = [f.strip() for f in re.split(r"(?<=[.:;?!])\s+", texto) if f.strip()]
    res = []
    for f in frases:
        while len(f) > maximo:
            corte = f.rfind(", ", 0, maximo)
            corte = corte + 1 if corte > 30 else f.rfind(" ", 0, maximo)
            res.append(f[:corte].strip()); f = f[corte:].strip()
        res.append(f)
    return res


def subtitulos(planos):
    lineas, n = [], 1
    for pl in planos:
        ts = trozos(pl["voz"])
        total = sum(len(x) for x in ts)
        t = pl["voz_ini"]
        for x in ts:
            d = (pl["voz_fin"] - pl["voz_ini"]) * len(x) / total
            # dos líneas como máximo: partir por la mitad en un espacio
            if len(x) > 44:
                m = x.rfind(" ", 0, len(x) // 2 + 8)
                x = x[:m] + "\n" + x[m + 1:]
            lineas.append(f"{n}\n{fmt(t)} --> {fmt(t + d)}\n{x}\n")
            n += 1; t += d
    (TMP / "subtitulos.srt").write_text("\n".join(lineas), encoding="utf-8")


def capitulos(planos, escenas, total):
    inicios = {}
    for pl in planos:
        inicios.setdefault(pl["cap"], pl["inicio"])
    txt = [";FFMETADATA1", "title=AL2-M23-04 Dominios enteros e ideales (Álgebra 2, Módulos 2 y 3)",
           "artist=Paquete AL2-M23", "language=spa"]
    caps = sorted(inicios.items())
    for k, (ci, ini) in enumerate(caps):
        fin = caps[k + 1][1] if k + 1 < len(caps) else total
        nombre = re.sub(r"\\\(|\\\)", "", escenas[ci]["titulo"]).replace("\\Z", "Z")
        txt += ["[CHAPTER]", "TIMEBASE=1/1000", f"START={int(ini * 1000)}", f"END={int(fin * 1000)}",
                f"title={escenas[ci]['n']}. {nombre}"]
    (TMP / "capitulos.txt").write_text("\n".join(txt) + "\n", encoding="utf-8")
    return [(escenas[ci]["n"], ini) for ci, ini in caps]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voz", required=True, help="modelo piper .onnx (con su .onnx.json al lado)")
    ap.add_argument("--escala", type=float, default=1.06, help="length_scale de piper (>1 = más pausado)")
    a = ap.parse_args()
    for d in ("audio", "png"):
        (TMP / d).mkdir(parents=True, exist_ok=True)
    SAL.mkdir(exist_ok=True)

    escenas = cargar_escenas()
    planos = planos_de(escenas)
    print(f"{len(escenas)} capítulos, {len(planos)} planos")
    sr = sintetizar(planos, a.voz, a.escala)
    total = ensamblar_audio(planos, sr)
    print(f"duración total: {fmt(total, '.')}")

    lista = [{k: pl[k] for k in ("id", "c", "s", "p")} for pl in planos]
    (TMP / "planos.json").write_text(json.dumps(lista), encoding="utf-8")
    subprocess.run(["node", str(AQUI / "capturar.js"), str(TMP / "planos.json"), str(TMP / "png")], check=True)

    # pista de video: concat demuxer con la duración de cada imagen
    with open(TMP / "imagenes.txt", "w") as f:
        for pl in planos:
            f.write(f"file '{TMP / 'png' / (pl['id'] + '.png')}'\nduration {pl['dur']:.2f}\n")
        f.write(f"file '{TMP / 'png' / (planos[-1]['id'] + '.png')}'\n")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(TMP / "imagenes.txt"),
                    "-vf", f"fps={FPS},format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-tune", "stillimage",
                    "-crf", "20", "-t", f"{total:.3f}", str(TMP / "video_mudo.mp4")], check=True)

    subtitulos(planos)
    marcas = capitulos(planos, escenas, total)
    destino = SAL / "AL2-M23-04_Video_Dominios_enteros_e_ideales.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(TMP / "video_mudo.mp4"), "-i", str(TMP / "narracion.wav"),
                    "-i", str(TMP / "subtitulos.srt"), "-i", str(TMP / "capitulos.txt"),
                    "-map", "0:v", "-map", "1:a", "-map", "2:s", "-map_metadata", "3", "-map_chapters", "3",
                    "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "128k",
                    "-c:s", "mov_text", "-metadata:s:s:0", "language=spa", "-metadata:s:a:0", "language=spa",
                    "-movflags", "+faststart", "-t", f"{total:.3f}", str(destino)], check=True)
    (SAL / "AL2-M23-04_Subtitulos_es.srt").write_text((TMP / "subtitulos.srt").read_text(encoding="utf-8"), encoding="utf-8")

    # datos para el guion en PDF
    tiempos = {"total": total, "capitulos": marcas,
               "planos": [{k: pl.get(k) for k in ("id", "c", "s", "p", "inicio", "dur", "tarjeta")} for pl in planos]}
    (AQUI / "tiempos.js").write_text("var TIEMPOS = " + json.dumps(tiempos) + ";\n", encoding="utf-8")
    print("✔", destino.name, f"({destino.stat().st_size / 1e6:.1f} MB)")
    for n, ini in marcas:
        print(f"   capítulo {n:2d}: {fmt(ini, '.')[:8]}")


if __name__ == "__main__":
    main()
