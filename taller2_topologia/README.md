# Topología — Taller 2 (módulo 2)

Material preparado a partir del enunciado «Taller Módulo 2 de Topología» (Universidad de Panamá, FACINET,
Licenciatura en Matemática).

| Archivo | Contenido |
|---|---|
| [`Taller2_Topologia_Solucion.pdf`](Taller2_Topologia_Solucion.pdf) | Solución desarrollada de las cuatro partes (31 páginas). Incluye las dos topologías válidas de la Parte I, las dos de la Parte II, los 13 problemas de la Parte III y los 4 de la Parte IV, más una sugerencia de qué entregar. |
| [`Guia_de_Estudio_Taller2_Topologia.pdf`](Guia_de_Estudio_Taller2_Topologia.pdf) | Guía de estudio para el parcial (31 páginas): teoría, demostraciones cortas, métodos paso a paso, ejemplos del taller, recetario, errores frecuentes, autoevaluación con respuestas y 27 fuentes. |
| [`Video_Explicacion_Taller2_Topologia.mp4`](Video_Explicacion_Taller2_Topologia.mp4) | Video narrado en español (≈ 23 min, 1080p) con la explicación de la teoría y de los ejercicios. Lleva subtítulos como pista opcional. |
| [`Video_Explicacion_Taller2_Topologia.srt`](Video_Explicacion_Taller2_Topologia.srt) | Los mismos subtítulos en archivo aparte (sirven también como transcripción). |

## Supuestos y erratas del enunciado

El enunciado tiene puntos ambiguos o con errores de tipeo. Están explicados en la sección 1 de la solución; en resumen:

- `σ(J)` se interpretó como la **frontera** (no es una notación estándar: conviene confirmarla).
- «Vecindad» se tomó en el sentido de Lipschutz/Kelley (no necesariamente abierta); también se dan las abiertas.
- Parte II, τ₁: el término `{ ,2}` se leyó como `{2}`.
- III.7: a la familia `{A ⊂ ℝ : 0 ∈ A}` le falta el vacío para ser topología.
- III.10: no se dice cuál es `τ_X`; se resolvió para dos lecturas.
- III.12: la conclusión impresa repite la hipótesis; se demostró que `𝔅₁` es base.
- IV.3: la colección τ₁ no es cerrada bajo intersecciones, y `X ≅ Y` es falso con los datos impresos.

## Cómo se verificó

`verificacion/` contiene programas en Python que calculan, directamente desde las definiciones, cada respuesta
sobre conjuntos finitos (cerrados, derivado, clausura, interior, frontera, vecindades, topología relativa, topología
generada, continuidad, funciones abiertas y cerradas, homeomorfismos) y enumeran todas las topologías sobre
conjuntos de hasta 5 puntos (29, 355 y 6942 para 3, 4 y 5 puntos).

```bash
cd verificacion
python3 verificar_taller.py        # informe completo
python3 contar_topologias.py 5     # 6942 topologías, 139 clases de homeomorfismo
python3 generar_tablas.py          # regenera fuente/gen/*.tex
```

## Regenerar los PDF y el video

```bash
# Ubuntu: paquetes necesarios
apt-get install -y texlive-latex-extra texlive-lang-spanish texlive-pictures texlive-fonts-recommended \
                   tex-gyre lmodern cm-super libttspico-utils sox ffmpeg
pip install pypdfium2 pillow

cd fuente && mkdir -p build
pdflatex -output-directory=build solucion.tex   # repetir 2 o 3 veces
pdflatex -output-directory=build guia.tex

cd ../video
python3 construir_video.py                      # diapositivas + voz + montaje
```

El guion del video está en `video/guion.py` (cada paso tiene su diapositiva y su narración). La voz es sintética
(SVOX Pico, español), generada sin conexión.
