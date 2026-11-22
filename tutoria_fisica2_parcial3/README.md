# Física II (UTP): tercer parcial, corriente eléctrica continua

Material de tutoría para el tercer parcial (tema VII: conductividad y resistividad, fem,
caída de tensión, ley de Ohm, resistencias, reglas de Kirchhoff, ley de Joule-Lenz, potencia).

| Archivo | Contenido |
|---|---|
| `01_Guia_Fundamentos_y_Ruta.pdf` | Análisis del estilo del profesor (parciales 1 y 2), predicción del examen, ruta de aprendizaje en 3 etapas, técnicas de estudio, plan de sesión y teoría completa con deducciones (16 págs.). |
| `02_Simulacros_Enunciados.pdf` | 3 simulacros en el formato del profesor (20 preguntas, 4 grupos, se responde 1 por grupo): confianza, nivel del profesor y nivel superior (11 págs.). |
| `03_Solucionario.pdf` | Solución de las 60 preguntas y rúbrica de 25 puntos por pregunta (23 págs.). |

## Regenerar

Requiere TeX Live con `circuitikz` y `babel-spanish`.

```bash
cd fuente
for f in 01_guia_fundamentos 02_simulacros 03_solucionario; do pdflatex $f && pdflatex $f; done
```
