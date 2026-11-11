"""Construye el video explicativo a partir de guion.py.

Pasos:  diapositivas (beamer -> PDF -> PNG 1920x1080)  +  voz (pico2wave, es-ES)
        -> ffmpeg (H.264 + AAC) con subtítulos incrustados como pista opcional.

Requisitos (Ubuntu):  texlive-latex-extra texlive-lang-spanish libttspico-utils sox ffmpeg
                      y el paquete de Python pypdfium2.
Uso:  python3 construir_video.py [--solo-diapositivas]
"""
import os
import re
import subprocess
import sys

import pypdfium2 as pdfium

from guion import CUADROS

AQUI = os.path.dirname(os.path.abspath(__file__))
TMP = os.path.join(AQUI, "tmp")
SALIDA = os.path.join(AQUI, "..", "Video_Explicacion_Taller2_Topologia.mp4")
SRT = os.path.join(AQUI, "..", "Video_Explicacion_Taller2_Topologia.srt")
ANCHO, ALTO = 1920, 1080
PAUSA_FRASE = 0.42      # silencio entre frases de un mismo paso
PAUSA_INICIO = 0.45     # silencio antes de hablar en cada paso
PAUSA_FINAL = 0.90      # silencio al terminar cada paso
VELOCIDAD = 100         # nivel de velocidad de pico2wave (100 = normal)


def sh(cmd, **kw):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, **kw)
    if r.returncode != 0:
        print(r.stdout[-3000:])
        raise SystemExit(f"falló: {' '.join(cmd[:4])} ...")
    return r.stdout


# ------------------------------------------------------------ diapositivas
def escribir_tex():
    L = [r"\documentclass[aspectratio=169,11pt]{beamer}", r"\input{../preambulo_video}", r"\begin{document}"]
    for c in CUADROS:
        n = len(c["voz"])
        L.append(r"\renewcommand{\bloque}{%s}" % c["bloque"])
        if c["titulo"]:
            # \frametitle aparte: si el cuerpo empieza con «{», beamer lo tomaría como subtítulo
            L.append(r"\begin{frame}[t]")
            L.append(r"\frametitle{%s}" % c["titulo"])
            L.append(r"\vspace{2.5mm}")
        else:
            L.append(r"\begin{frame}[plain]")
        L.append(c["tex"])
        L.append(r"\only<%d>{}" % n)
        L.append(r"\end{frame}")
    L.append(r"\end{document}")
    with open(os.path.join(TMP, "diapositivas.tex"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(L) + "\n")


def compilar():
    for _ in range(2):
        r = subprocess.run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "diapositivas.tex"],
                           cwd=TMP, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace")
        if r.returncode != 0:
            log = r.stdout
            i = log.find("\n!")
            print(log[i:i + 1500])
            raise SystemExit("LaTeX falló")
    log = open(os.path.join(TMP, "diapositivas.log"), errors="replace").read()
    for m in re.finditer(r"Overfull \\[hv]box \(([\d.]+)pt too (wide|high)\)[^\n]*", log):
        if float(m.group(1)) > 3:
            print("   aviso:", m.group(0)[:110])


def rasterizar():
    pdf = pdfium.PdfDocument(os.path.join(TMP, "diapositivas.pdf"))
    total = sum(len(c["voz"]) for c in CUADROS)
    if len(pdf) != total:
        raise SystemExit(f"el PDF tiene {len(pdf)} páginas y el guion {total} pasos")
    for i in range(len(pdf)):
        pag = pdf[i]
        w, _ = pag.get_size()
        im = pag.render(scale=ANCHO / w).to_pil().convert("RGB")
        if im.size != (ANCHO, ALTO):
            im = im.resize((ANCHO, ALTO))
        im.save(os.path.join(TMP, f"d{i + 1:03d}.png"))
    return total


# ------------------------------------------------------------------- voz
def frases(texto):
    partes = re.split(r"(?<=[.?!:;])\s+", texto.strip())
    return [p for p in partes if p]


def sintetizar(i, texto):
    """Devuelve la duración en segundos del audio del paso i (WAV 44,1 kHz mono)."""
    trozos = []
    silencio = os.path.join(TMP, "sil.wav")
    if not os.path.exists(silencio):
        sh(["sox", "-n", "-r", "16000", "-c", "1", "-b", "16", silencio, "trim", "0", str(PAUSA_FRASE)])
    for j, fr in enumerate(frases(texto)):
        w = os.path.join(TMP, f"v{i:03d}_{j:02d}.wav")
        bruto = os.path.join(TMP, "_bruto.wav")
        sh(["pico2wave", "-l", "es-ES", "-w", bruto, f'<speed level="{VELOCIDAD}">{fr}</speed>'])
        # pico2wave deja silencio al principio y al final de cada frase: se recorta y
        # las pausas se controlan aquí (PAUSA_FRASE)
        sh(["sox", bruto, w, "silence", "1", "0.02", "0.2%", "reverse", "silence", "1", "0.02", "0.2%", "reverse"])
        if trozos:
            trozos.append(silencio)
        trozos.append(w)
    out = os.path.join(TMP, f"a{i:03d}.wav")
    sh(["sox"] + trozos + ["-r", "44100", out, "pad", str(PAUSA_INICIO), str(PAUSA_FINAL), "norm", "-2"])
    return float(sh(["soxi", "-D", out]).strip())


def marca(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"


def trocear_subtitulo(texto, maxc=84):
    """Parte el texto en renglones de subtítulo de longitud razonable."""
    out, actual = [], ""
    for palabra in texto.split():
        if len(actual) + len(palabra) + 1 > maxc and actual:
            out.append(actual)
            actual = palabra
        else:
            actual = (actual + " " + palabra).strip()
    if actual:
        out.append(actual)
    return out


def main():
    os.makedirs(TMP, exist_ok=True)
    print("1) diapositivas")
    escribir_tex()
    compilar()
    total = rasterizar()
    print(f"   {total} pasos, {len(CUADROS)} cuadros")
    if "--solo-diapositivas" in sys.argv:
        return

    print("2) voz")
    voces = [v for c in CUADROS for v in c["voz"]]
    duraciones = [sintetizar(i + 1, v) for i, v in enumerate(voces)]
    print(f"   duración total: {sum(duraciones) / 60:.1f} min")

    print("3) montaje")
    with open(os.path.join(TMP, "audios.txt"), "w") as fh:
        for i in range(total):
            fh.write(f"file 'a{i + 1:03d}.wav'\n")
    with open(os.path.join(TMP, "cuadros.txt"), "w") as fh:
        for i, d in enumerate(duraciones):
            fh.write(f"file 'd{i + 1:03d}.png'\nduration {d:.3f}\n")
        fh.write(f"file 'd{total:03d}.png'\n")
    # subtítulos: cada paso se reparte en renglones proporcionales a su longitud
    t0, n, srt = 0.0, 1, []
    for d, v in zip(duraciones, voces):
        renglones = trocear_subtitulo(v)
        util = d - PAUSA_INICIO - PAUSA_FINAL * 0.5
        pesos = [len(r) for r in renglones]
        t = t0 + PAUSA_INICIO
        for r, p in zip(renglones, pesos):
            dt = util * p / sum(pesos)
            srt.append(f"{n}\n{marca(t)} --> {marca(t + dt)}\n{r}\n")
            t += dt
            n += 1
        t0 += d
    with open(SRT, "w", encoding="utf-8") as fh:
        fh.write("\n".join(srt))
    sh(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "audios.txt", "-c:a", "pcm_s16le", "voz.wav"], cwd=TMP)
    sh(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "cuadros.txt", "-i", "voz.wav", "-i", SRT,
        "-map", "0:v", "-map", "1:a", "-map", "2:s",
        "-vf", "fps=12,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-tune", "stillimage", "-crf", "22",
        "-g", "120", "-c:a", "aac", "-b:a", "96k", "-ac", "1", "-c:s", "mov_text",
        "-metadata:s:s:0", "language=spa", "-metadata:s:a:0", "language=spa",
        "-metadata", "title=Topología — Taller 2: explicación para el parcial",
        "-movflags", "+faststart", "-shortest", os.path.abspath(SALIDA)], cwd=TMP)
    print("   listo:", os.path.abspath(SALIDA))


if __name__ == "__main__":
    main()
