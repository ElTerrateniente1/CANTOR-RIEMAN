# Álgebra 2 · Paquete de preparación para el parcial (Módulos 2 y 3)

Serie **AL2-M23** (versión 2.0, 24 de noviembre de 2026): material para preparar el parcial de
**dominios enteros** (Módulo 2) e **ideales** (Módulo 3), basado en el folleto *Álgebra 2: Anillos*.
La numeración de definiciones y teoremas coincide con la del folleto. Los resultados que no aparecen
en él se marcan como *complementarios* y se incluyen con demostración.

## Entregables

| Código | Archivo | Contenido |
|---|---|---|
| AL2-M23-01 | [`entregables/AL2-M23-01_Guia_de_estudio.pdf`](entregables/AL2-M23-01_Guia_de_estudio.pdf) | Guía de estudio (36 págs.): preliminares, Módulo 2, Módulo 3 y preparación para el parcial. 36 resultados con 34 demostraciones, 28 ejemplos resueltos, 18 métodos, 21 errores frecuentes, 31 ejercicios graduados, mapa conceptual, formulario, plan de estudio y tablas de ℤₙ. |
| AL2-M23-02 | [`entregables/AL2-M23-02_Practica_de_parcial.pdf`](entregables/AL2-M23-02_Practica_de_parcial.pdf) | Práctica en formato de examen (13 págs., Forma A): 120 min, 100 pts + 5 de bonificación. Parte I verdadero/falso (20), II cálculo (30), III problemas (30), IV demostraciones (20). Con espacio de respuesta. |
| AL2-M23-03 | [`entregables/AL2-M23-03_Solucionario_y_rubrica.pdf`](entregables/AL2-M23-03_Solucionario_y_rubrica.pdf) | Solucionario (17 págs.): clave rápida, soluciones desarrolladas, rúbrica de puntaje parcial y errores frecuentes por ítem; diagnóstico ítem → sección de la guía → capítulo del video; respuestas de los 31 ejercicios de la guía. |
| AL2-M23-04 | [`entregables/AL2-M23-04_Video_Dominios_enteros_e_ideales.mp4`](entregables/AL2-M23-04_Video_Dominios_enteros_e_ideales.mp4) | Video narrado de 21:40, 1920×1080, 11 capítulos navegables y subtítulos en español incrustados. |
| AL2-M23-04 | [`entregables/AL2-M23-04_Guion_del_video.pdf`](entregables/AL2-M23-04_Guion_del_video.pdf) | Ficha técnica, índice de capítulos con marcas de tiempo y guion completo (pantalla + narración) (17 págs.). |
| AL2-M23-04 | [`entregables/AL2-M23-04_Subtitulos_es.srt`](entregables/AL2-M23-04_Subtitulos_es.srt) | Subtítulos en español como archivo independiente. |

**Orden de uso recomendado:** video completo → guía con ejercicios → práctica cronometrada →
corrección con el solucionario → repaso dirigido según su Apéndice A.

## Limitaciones conocidas

- La narración del video es una **voz sintética** (Piper TTS, voz `es_MX-claude-high`, licencia
  Apache-2.0). Las expresiones matemáticas se leen en palabras («zeta sub ene»). La pronunciación
  no se revisó escuchando el audio completo; se verificaron la sincronía, los niveles y las marcas.
- Las soluciones y rúbricas se verificaron paso a paso, pero conviene confirmar con el docente las
  convenciones del curso (por ejemplo, si el Teorema 3.23 se evalúa con demostración).
- Los rangos de interpretación del puntaje son orientativos y no corresponden a una escala oficial.

## Regenerar los archivos

Requisitos: Node 18+ con Playwright y Chromium, Python 3.10+, `ffmpeg`.

```bash
cd algebra2_modulos_2_3
npm install                                   # KaTeX y tipografías Source Serif 4 / Source Sans 3
pip install pypdf numpy piper-tts

# Documentos (guía, práctica, solucionario)
node fuentes/render_pdf.js guia practica solucionario

# Voz para la narración (se descarga una vez, ~110 MB)
mkdir -p .voces && curl -L -o .voces/voz.tar.bz2 \
  https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_MX-claude-high.tar.bz2
tar xjf .voces/voz.tar.bz2 -C .voces

# Video (≈6 min): narración, capturas, subtítulos, capítulos; escribe fuentes/video/tiempos.js
python3 fuentes/video/generar_video.py --voz .voces/vits-piper-es_MX-claude-high/es_MX-claude-high.onnx

# Guion del video (usa tiempos.js, por eso va después del video)
node fuentes/render_pdf.js guion
```

## Estructura de las fuentes

| Archivo | Función |
|---|---|
| `fuentes/estilos.css`, `fuentes/comun.js` | Sistema de diseño común: portada de la serie, índice paginado automático, macros KaTeX. |
| `fuentes/render_pdf.js`, `fuentes/pdf_util.py` | HTML → PDF con Chromium: dos pasadas para paginar el índice, marcadores PDF y metadatos. |
| `fuentes/guia.html`, `practica.html`, `solucionario.html` | Contenido de los documentos 01–03. |
| `fuentes/video/escenas.js` | Guion del video: capítulos, diapositivas, pasos (pantalla + narración). Fuente única del video, los subtítulos y el guion PDF. |
| `fuentes/video/diapositiva.html`, `capturar.js` | Plantilla 1920×1080 y captura de cada plano. |
| `fuentes/video/generar_video.py` | Síntesis de voz, ensamblaje con sincronía exacta por fotograma, subtítulos, capítulos y MP4 final. |
| `fuentes/video/guion.html`, `tiempos.js` | Documento del guion y tiempos de cada plano. |
