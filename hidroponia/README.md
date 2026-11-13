# Análisis estadístico de la fase piloto (Raphanus sativus, LHS-1 y arena de río)

Análisis hecho únicamente con las tablas resumen (media ± DE) del manuscrito. Todo el cálculo está en R base.

## Documentos

| Archivo | Contenido |
|---|---|
| `pdf/Statistical_Analysis_Pilot_Phase_EN.pdf` | Informe entregable en inglés: métodos, resultados, interpretación, limitaciones y recomendaciones. |
| `pdf/Analisis_Estadistico_Fase_Piloto_ES.pdf` | El mismo informe en español. |
| `pdf/Fundamentos_Matematicos_y_Estadisticos_ES.pdf` | Documento de estudio: fórmulas, cálculos paso a paso y razones de cada decisión. |
| `latex/informe_en.tex`, `latex/informe_es.tex`, `latex/fundamentos_es.tex` | Fuentes LaTeX de los tres documentos. |
| `latex/tablas/` | Cada tabla como `tabular` independiente (inglés y español), más los títulos. |
| `latex/figuras/` | Figuras en PDF vectorial, usadas por los documentos. |
| `png/en/`, `png/es/` | Cada tabla y figura del informe en PNG (300 ppp), numeradas como en el informe. |
| `png/tecnico/` | Figuras propias del documento de estudio. |

## Código

| Archivo | Qué hace |
|---|---|
| `analisis_preliminar.R` | Control de calidad de las tablas, ANOVA factorial, análisis de germinación y contrastes exploratorios. |
| `prueba_hipotesis.R` | Prueba de la hipótesis del manuscrito (contrastes C1 y C2), sensibilidad y potencia. |
| `generar_tablas_figuras.R` | Genera las tablas `.tex` y las figuras a partir de los dos anteriores. |
| `construir.sh` | Reconstruye todo: tablas, figuras, los tres PDF y los PNG. |

## Reconstruir

```bash
./construir.sh
```

Requiere R, `pdflatex` (TeX Live con `babel-spanish`, `standalone` y `tocloft`) y `pdftoppm`.

## Supuestos del análisis

- Cinco unidades experimentales por combinación de sustrato y tratamiento, y cuatro semillas por unidad (deducido de 160 semillas, 40 unidades y 8 combinaciones).
- "Additive 5 %/10 %" es la proporción de sustrato ionitopónico y "Control" es el medio sin enmendar.
- Los conteos de germinación por unidad se reconstruyeron a partir de la media y la DE de cada grupo.
