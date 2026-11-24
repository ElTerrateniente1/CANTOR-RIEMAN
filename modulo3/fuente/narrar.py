"""Narra build/narracion.json con Kokoro (voz en español) y monta el video.

Uso: python3 narrar.py CLASE RUTA_MODELOS   (CLASE = carpeta de clases/; RUTA_MODELOS = carpeta con kokoro-v1.0.onnx y voices-v1.0.bin,
descargables de github.com/thewh1teagle/kokoro-onnx/releases, etiqueta model-files-v1.0)
"""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

AQUI = Path(__file__).resolve().parent
CLASE = sys.argv[1]
BUILD = AQUI / "build" / CLASE
NOMBRE = json.loads((AQUI / "clases.json").read_text())[CLASE]["nombre"]
modelos = Path(sys.argv[2])
VOZ, VELOCIDAD, SR = "ef_dora", 0.95, 24000

kokoro = Kokoro(str(modelos / "kokoro-v1.0.onnx"), str(modelos / "voices-v1.0.bin"))
silencio = lambda s: np.zeros(int(SR * s), dtype=np.float32)

def hablar(texto):
    partes = []
    for frase in re.split(r"(?<=[.?!:])\s+", texto):
        if not frase.strip():
            continue
        audio, sr = kokoro.create(frase, voice=VOZ, speed=VELOCIDAD, lang="es")
        assert sr == SR
        partes += [audio.astype(np.float32), silencio(0.35)]
    return np.concatenate(partes)

def marca(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02}:{int(m):02}:{int(s):02},{int((s % 1) * 1000):03}"

pasos = json.loads((BUILD / "narracion.json").read_text())
pista, lista, srt, t = [], [], [], 0.0
for i, p in enumerate(pasos, 1):
    audio = np.concatenate([silencio(0.5), hablar(p["texto"]), silencio(1.1 if p["finDiapositiva"] else 0.4)])
    dur = len(audio) / SR
    pista.append(audio)
    lista += [f"file 'frames/{p['frame']}'", f"duration {dur:.6f}"]
    srt.append(f"{i}\n{marca(t + 0.5)} --> {marca(t + dur - 0.2)}\n{p['texto']}\n")
    t += dur
    print(f"{p['frame']}  {dur:5.1f}s", flush=True)
lista.append(f"file 'frames/{pasos[-1]['frame']}'")  # el demuxer concat exige repetir el último
sf.write(BUILD / "audio.wav", np.concatenate(pista), SR)
(BUILD / "frames.txt").write_text("\n".join(lista) + "\n")
(AQUI.parent / f"{NOMBRE}.srt").write_text("\n".join(srt), encoding="utf-8")

subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "frames.txt", "-i", "audio.wav",
    "-vf", "fps=25,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-tune", "stillimage",
    "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-movflags", "+faststart", "-shortest",
    str(AQUI.parent / f"{NOMBRE}.mp4"),
], cwd=BUILD, check=True)
print(f"Duración total: {t / 60:.1f} min")
