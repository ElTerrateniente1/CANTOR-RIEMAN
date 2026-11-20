# Tema 2 — Ondas electromagnéticas en medios disipativos y el teorema de los residuos

| Archivo | Contenido |
|---|---|
| `tema2.tex` | Fuente LaTeX del trabajo (portada + 9 páginas). |
| `tema2.pdf` | PDF compilado. |
| `figuras/generar_figuras.py` | Genera `fig1_lorentz.pdf` y `fig3_kretschmann.pdf` y verifica numéricamente las cifras citadas en el texto. |

## Compilar

```bash
pip install numpy scipy matplotlib      # requiere LaTeX + cm-super para las figuras
python3 figuras/generar_figuras.py
pdflatex tema2.tex && pdflatex tema2.tex
```
