#!/usr/bin/env bash
# Reconstruye todo: tablas y figuras (R), los tres PDF (pdflatex) y los PNG de cada tabla y figura.
# Requisitos: R, pdflatex (texlive con babel-spanish y standalone) y pdftoppm (poppler-utils).
set -euo pipefail
cd "$(dirname "$0")"

# 1. Tablas (.tex) y figuras (.pdf / .png) desde R
rm -rf png && mkdir -p png/en png/es png/tecnico pdf latex/build
LC_ALL=C.utf8 Rscript generar_tablas_figuras.R

# 2. Figuras PNG: nombres numerados como en el informe
n=0
for letra in A B C D E; do
  n=$((n + 1))
  for lang in en es; do
    for f in png/fig${letra}_*_${lang}.png; do
      base=$(basename "$f" .png); mv -f "$f" "png/${lang}/figura${n}_${base#fig${letra}_}.png"
    done
  done
done
mv -f png/figT1_distribucion_t_es.png png/tecnico/figura1_distribucion_t_es.png
mv -f png/figT2_permutacion_es.png    png/tecnico/figura2_permutacion_es.png

# 3. Documentos
cd latex
for doc in informe_en informe_es fundamentos_es; do
  pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build "$doc.tex" > /dev/null
  pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build "$doc.tex" > /dev/null
done
cp build/informe_en.pdf     ../pdf/Statistical_Analysis_Pilot_Phase_EN.pdf
cp build/informe_es.pdf     ../pdf/Analisis_Estadistico_Fase_Piloto_ES.pdf
cp build/fundamentos_es.pdf ../pdf/Fundamentos_Matematicos_y_Estadisticos_ES.pdf

# 4. Cada tabla como PNG (misma tipografia y contenido que en el informe)
for lang in en es; do
  if [ "$lang" = en ]; then babel="english"; rotulo="Table"; else babel="spanish,es-nodecimaldot,es-tabla"; rotulo="Tabla"; fi
  n=0
  for letra in A B C D E F G H I; do
    n=$((n + 1))
    f=$(ls tablas/tab${letra}_*_${lang}.tex); base=$(basename "$f" .tex)
    cat > "build/png_${base}.tex" <<EOF
\\documentclass[border=10pt,varwidth=16.6cm]{standalone}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[${babel}]{babel}
\\usepackage{amsmath,amssymb,array}
\\renewcommand{\\arraystretch}{1.25}
\\input{tablas/captions_${lang}}
\\begin{document}
\\begin{minipage}{16.6cm}
{\\small\\textbf{${rotulo} ${n}:} \\capTab${letra}\\par}\\vspace{6pt}
\\centering\\small\\setlength{\\tabcolsep}{4.5pt}\\input{tablas/${base}}
\\end{minipage}
\\end{document}
EOF
    pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build "build/png_${base}.tex" > /dev/null
    pdftoppm -r 300 -png -singlefile "build/png_${base}.pdf" "../png/${lang}/tabla${n}_${base#tab${letra}_}"
  done
done
cd ..
echo "PDF: $(ls pdf | wc -l) | PNG en: $(ls png/en | wc -l) | PNG es: $(ls png/es | wc -l) | PNG tecnico: $(ls png/tecnico | wc -l)"
