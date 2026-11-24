"""Utilidades PDF para render_pdf.js.

  marcas <pdf>                    -> JSON {indice_titulo: pagina} a partir de las marcas QQM<n>QQ
  unir <portada> <cuerpo> <dest> <titulo>  -> une portada + cuerpo, conserva marcadores y fija metadatos
  paginas <pdf>                   -> número de páginas
"""
import json
import re
import sys

from pypdf import PdfReader, PdfWriter


def marcas(ruta):
    res = {}
    for n, pag in enumerate(PdfReader(ruta).pages, start=1):
        for m in re.findall(r"QQM(\d+)QQ", (pag.extract_text() or "").replace(" ", "")):
            res.setdefault(int(m), n)
    print(json.dumps(res))


def unir(portada, cuerpo, destino, titulo):
    w = PdfWriter()
    w.append(PdfReader(portada))
    w.append(PdfReader(cuerpo), import_outline=True)
    w.add_metadata({"/Title": titulo, "/Subject": "Álgebra 2: Módulos 2 y 3 (dominios enteros e ideales)",
                    "/Keywords": "anillos, dominio entero, ideal, ideal primo, ideal maximal, característica",
                    "/Creator": "Paquete AL2-M23 v2.0"})
    w.page_mode = "/UseOutlines"
    with open(destino, "wb") as f:
        w.write(f)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "marcas":
        marcas(sys.argv[2])
    elif cmd == "unir":
        unir(*sys.argv[2:6])
    elif cmd == "paginas":
        print(len(PdfReader(sys.argv[2]).pages))
