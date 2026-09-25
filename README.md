# Cantor y Riemann: la topología a finales del siglo XIX

Material sobre los aportes de Georg Cantor y Bernhard Riemann a la evolución de la
topología, con una transición para enlazarlo con los aportes de Cauchy y Weierstrass.

| Archivo | Contenido |
|---|---|
| [`documento/Cantor_Riemann_Topologia.pdf`](documento/Cantor_Riemann_Topologia.pdf) | Documento de 8 páginas: contexto, Riemann, Cantor, comparación, cronología, matices historiográficos, transición y referencias. |
| [`transicion/Transicion_Cauchy-Weierstrass_a_Riemann-Cantor.md`](transicion/Transicion_Cauchy-Weierstrass_a_Riemann-Cantor.md) | Transición lista para integrar: versión breve, guion oral de ≈ 1 minuto y puentes concretos. |
| `documento/generar_pdf.py` | Genera el PDF con ReportLab. |
| `documento/preparar_fuentes.sh` | Descarga EB Garamond e IBM Plex Sans (SIL OFL 1.1) y crea las instancias estáticas. |

La presentación (3 diapositivas sobre el tema más 1 de transición, con notas del
orador) está publicada como Artifact de claude.ai y se descarga desde allí como .pptx o PDF.

## Regenerar el PDF

```bash
pip install -r requirements.txt
bash documento/preparar_fuentes.sh
python3 documento/generar_pdf.py
```
