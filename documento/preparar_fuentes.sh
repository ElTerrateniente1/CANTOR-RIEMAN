#!/usr/bin/env bash
# Descarga EB Garamond e IBM Plex Sans (licencia SIL OFL 1.1) desde el
# repositorio google/fonts y genera las instancias estáticas que usa
# generar_pdf.py. Las fuentes no se versionan: se crean en documento/.fuentes/.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)/.fuentes"
BASE="https://raw.githubusercontent.com/google/fonts/main/ofl"
mkdir -p "$DIR"
cd "$DIR"

curl -sSLf -o garamond-var.ttf        "$BASE/ebgaramond/EBGaramond%5Bwght%5D.ttf"
curl -sSLf -o garamond-italic-var.ttf "$BASE/ebgaramond/EBGaramond-Italic%5Bwght%5D.ttf"
curl -sSLf -o plex-var.ttf            "$BASE/ibmplexsans/IBMPlexSans%5Bwdth,wght%5D.ttf"

fonttools varLib.instancer garamond-var.ttf        wght=400 --update-name-table -q -o EBGaramond-Regular.ttf
fonttools varLib.instancer garamond-var.ttf        wght=600 --update-name-table -q -o EBGaramond-SemiBold.ttf
fonttools varLib.instancer garamond-italic-var.ttf wght=400 --update-name-table -q -o EBGaramond-Italic.ttf
fonttools varLib.instancer garamond-italic-var.ttf wght=600 --update-name-table -q -o EBGaramond-SemiBoldItalic.ttf
fonttools varLib.instancer plex-var.ttf wght=400 wdth=100 --update-name-table -q -o IBMPlexSans-Regular.ttf
fonttools varLib.instancer plex-var.ttf wght=600 wdth=100 --update-name-table -q -o IBMPlexSans-SemiBold.ttf

rm -f garamond-var.ttf garamond-italic-var.ttf plex-var.ttf
echo "Fuentes listas en $DIR"
