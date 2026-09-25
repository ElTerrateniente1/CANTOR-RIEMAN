# Cantor y Riemann: la topología a finales del siglo XIX

Material sobre los aportes de Georg Cantor y Bernhard Riemann a la evolución de la
topología, con una transición para enlazarlo con los aportes de Cauchy y Weierstrass.

| Archivo | Contenido |
|---|---|
| [`documento/Cantor_Riemann_Topologia.pdf`](documento/Cantor_Riemann_Topologia.pdf) | Documento de 8 páginas: contexto, Riemann, Cantor, comparación, cronología, matices historiográficos, transición y referencias. |
| [`transicion/Transicion_Cauchy-Weierstrass_a_Riemann-Cantor.md`](transicion/Transicion_Cauchy-Weierstrass_a_Riemann-Cantor.md) | Transición lista para integrar: versión breve, guion oral de ≈ 1 minuto y puentes concretos. |
| [`documento/Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pdf`](documento/Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pdf) | Documento breve (5 páginas) de los puntos 2 y 3: qué hizo cada uno (Cauchy, Weierstrass, Riemann, Cantor), con 33 fuentes numeradas y enlazadas. |
| [`presentacion/Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pptx`](presentacion/Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pptx) | Presentación PowerPoint (12 diapositivas, con notas del orador) basada en ese documento; mismas citas numeradas. |
| `documento/generar_pdf.py` | Genera el PDF con ReportLab. |
| `documento/generar_pdf_temas_2_3.py` | Genera el PDF de los puntos 2 y 3 y `referencias_temas_2_3.json`. |
| `presentacion/generar_pptx.js`, `presentacion/generar_toro.py` | Generan el .pptx (pptxgenjs) y la ilustración del toro. |
| `documento/preparar_fuentes.sh` | Descarga EB Garamond e IBM Plex Sans (SIL OFL 1.1) y crea las instancias estáticas. |

La presentación (3 diapositivas sobre el tema más 1 de transición, con notas del
orador) está publicada como Artifact de claude.ai y se descarga desde allí como .pptx o PDF.

## Regenerar los archivos

```bash
pip install -r requirements.txt
bash documento/preparar_fuentes.sh
python3 documento/generar_pdf.py
python3 documento/generar_pdf_temas_2_3.py
python3 presentacion/generar_toro.py
(cd presentacion && npm install && node generar_pptx.js)
```
