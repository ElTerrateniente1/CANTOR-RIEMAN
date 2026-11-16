# Variable compleja: curso intensivo por niveles

Preparación para un parcial de variable compleja a partir de seis listas de ejercicios
(derivación compleja, integrales sobre curvas, fórmula integral de Cauchy, residuos,
integrales trigonométricas e integrandos con singularidades reales).

El material está organizado en **seis niveles y un simulacro**. En cada nivel se mira el video,
se repasan los apuntes y se resuelve la práctica; **con 70 % o más se desbloquea el nivel siguiente**.

## Los tres entregables

| Entregable | Dónde | Qué es |
|---|---|---|
| **Videos** | [`videos/`](videos/) | Un video por nivel (1080p, voz en español, capítulos por escena y subtítulos `.srt`/`.vtt`). |
| **Documento** | [`documento/Guia_Variable_Compleja.pdf`](documento/Guia_Variable_Compleja.pdf) | Guía de estudio con todo el material de los videos (teoría, ejemplos resueltos, notas), las respuestas de los 60 ejercicios de las listas y un formulario. |
| **Prácticas** | [`practicas/index.html`](practicas/index.html) · [`practicas/Practicas_Variable_Compleja.pdf`](practicas/Practicas_Variable_Compleja.pdf) | Página interactiva con la ruta completa (video, apuntes y práctica por nivel, con desbloqueo progresivo) y versión imprimible con soluciones. |

<!-- VIDEOS -->
| Nivel | Video | Duración | Tamaño | Escenas |
|---|---|---|---|---|
| 1 · Derivación compleja | [`Nivel_1_Derivacion_compleja.mp4`](videos/Nivel_1_Derivacion_compleja.mp4) | 17 min | 19 MB | 17 |
| 2 · Integrales sobre curvas | [`Nivel_2_Integrales_sobre_curvas.mp4`](videos/Nivel_2_Integrales_sobre_curvas.mp4) | 12 min | 14 MB | 14 |
| 3 · Teorema y fórmula integral de Cauchy | [`Nivel_3_Teorema_y_formula_integral_de_Cauchy.mp4`](videos/Nivel_3_Teorema_y_formula_integral_de_Cauchy.mp4) | 14 min | 16 MB | 16 |
| 4 · Teorema de los residuos | [`Nivel_4_Teorema_de_los_residuos.mp4`](videos/Nivel_4_Teorema_de_los_residuos.mp4) | 13 min | 15 MB | 15 |
| 5 · Integrales trigonométricas | [`Nivel_5_Integrales_trigonometricas.mp4`](videos/Nivel_5_Integrales_trigonometricas.mp4) | 11 min | 13 MB | 11 |
| 6 · Integrales impropias y singularidades reales | [`Nivel_6_Integrales_impropias_y_singularidades_reales.mp4`](videos/Nivel_6_Integrales_impropias_y_singularidades_reales.mp4) | 15 min | 17 MB | 14 |

Duración total: 82 minutos.
<!-- /VIDEOS -->

## Cómo usarlo

1. Descarga la carpeta `variable-compleja/` completa (o clona el repositorio) y abre `practicas/index.html`
   en el navegador. La página reproduce los videos de `videos/`, muestra los apuntes y corrige las prácticas.
2. El progreso se guarda en el navegador, por perfil. Se pueden crear varios perfiles; el «modo repaso»
   abre todos los niveles sin marcarlos como aprobados.
3. Cada práctica tiene 10 preguntas y se aprueba con 7. Al fallar, la página indica qué apartados repasar
   y muestra la solución paso a paso de cada pregunta.
4. Tras el Nivel 6 se abre el simulacro (10 preguntas que mezclan todos los temas). Como práctica adicional
   quedan las seis listas originales: sus respuestas están en el Apéndice A de la guía.

## Qué está comprobado y qué no

- Las respuestas de los **60 ejercicios** de las listas y de las **58 preguntas de cálculo** de las prácticas
  se compararon con integración numérica o cálculo simbólico independientes
  (`verificacion/verificar_listas.py`, 77 comprobaciones; `verificacion/verificar_practicas.py`, 58).
  Eso detecta errores de signo, de residuos o de polos mal ubicados; no es una demostración ni reemplaza
  la revisión del docente.
- Las 12 preguntas conceptuales y los enunciados teóricos no admiten esa comprobación automática.
- La narración es **voz sintética**. Cada frase se verificó con un reconocedor de voz automático para
  descartar saltos o repeticiones, pero nadie la ha escuchado completa: puede haber pronunciaciones raras
  (sobre todo en nombres propios y símbolos). Los subtítulos y la guía contienen el texto exacto.
- Supuestos al interpretar las listas (detallados en la guía, «Cómo usar este material»):
  en Cauchy 8–9 se tomó como segmento el diámetro `[-2|w|, 2|w|]`; en Curvas 7, el arco y no el contorno
  cerrado; en Curvas 9, `f(z) = z√z` con la rama principal; en Derivación 9, el logaritmo principal es
  analítico en `ℂ \ (−∞, 0]`; con polos reales, las integrales se entienden como valor principal.

## Cómo se generó (carpeta `fuente/`)

Todo sale de una sola fuente: `fuente/contenido/nivelN.mjs` (escenas con fórmulas, figuras y narración)
y `fuente/contenido/practicas.mjs` (banco de preguntas).

```bash
cd fuente && npm install
bash herramientas/preparar_voz.sh            # voz (Supertonic 3) y reconocedor (Whisper), desde npm
export VC_VOZ=build/voz_supertonic3 VC_ASR=build/asr
node construir_cuadros.mjs nivel1 … nivel6   # cuadros 1920×1080 de cada paso (Chromium + KaTeX)
python3 narrar.py nivel1 … nivel6            # narración por frases, verificada con reconocimiento de voz
python3 ensamblar.py nivel1 … nivel6         # MP4 con fundidos, capítulos y subtítulos (ffmpeg)
node construir_documento.mjs                 # guía en PDF
node construir_practicas.mjs                 # página de prácticas y PDF imprimible
python3 ../verificacion/verificar_listas.py && python3 ../verificacion/verificar_practicas.py
```

Requisitos: Node 22 con Playwright/Chromium, Python 3 (`numpy`, `pillow`, `mpmath`, `sympy`, `pymupdf`,
`sherpa-onnx`) y `ffmpeg`.

Licencias de terceros: tipografías IBM Plex Sans y Source Serif 4 (SIL OFL 1.1), KaTeX (MIT),
voz Supertonic 3 de Supertone (OpenRAIL-M; solo se usa para generar el audio, no se redistribuye el modelo).
