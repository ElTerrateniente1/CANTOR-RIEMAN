#!/usr/bin/env python3
"""Genera los problemas resueltos de Irodov en dos versiones:
   python3 generar_resueltos.py            -> cuadros grandes
   python3 generar_resueltos.py --compacto -> version comprimida (2 columnas)
"""
import os
import re
import sys

from reportlab.lib import colors
from reportlab.lib.fonts import addMapping
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, KeepTogether, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from problemas_resueltos import P, SECCIONES  # noqa: E402

D = "/usr/share/fonts/truetype/dejavu/"
for n, f in [("F", "DejaVuSerif.ttf"), ("FB", "DejaVuSerif-Bold.ttf"),
             ("S", "DejaVuSans.ttf"), ("SB", "DejaVuSans-Bold.ttf")]:
    pdfmetrics.registerFont(TTFont(n, D + f))
for fam, r, b in [("F", "F", "FB"), ("S", "S", "SB")]:
    addMapping(fam, 0, 0, r); addMapping(fam, 1, 0, b)
    addMapping(fam, 0, 1, r); addMapping(fam, 1, 1, b)

COMPACT = "--compacto" in sys.argv
K = 0.62 if COMPACT else 1.18
INK = colors.HexColor("#1b2a41")
ACC = colors.HexColor("#0b5fa5")
BOXBG = colors.HexColor("#f3f7fb")
ANS = colors.HexColor("#fff4d6")
ANSB = colors.HexColor("#b8860b")

MG = 7 * mm if COMPACT else 15 * mm
GAP = 4 * mm
W = (A4[0] - 2 * MG - GAP) / 2 if COMPACT else A4[0] - 2 * MG
LR = 0.34 if COMPACT else 0.30


def M(s):
    s = re.sub(r"_\{([^}]*)\}", r"<sub>\1</sub>", s)
    s = re.sub(r"\^\{([^}]*)\}", r"<super>\1</super>", s)
    return s


st_t = ParagraphStyle("t", fontName="SB", fontSize=9.6 * K, leading=12.5 * K, textColor=colors.white)
st_lbl = ParagraphStyle("l", fontName="S", fontSize=8 * K, leading=10.2 * K, textColor=INK)
st_frm = ParagraphStyle("f", fontName="F", fontSize=9.4 * K, leading=12.8 * K, textColor=INK)
st_ans = ParagraphStyle("a", fontName="FB", fontSize=9.8 * K, leading=13 * K, textColor=INK)
st_note = ParagraphStyle("n", fontName="S", fontSize=7.4 * K, leading=9.6 * K, textColor=colors.HexColor("#7a4b00"))
st_h1 = ParagraphStyle("h1", fontName="SB", fontSize=13 * K, leading=17 * K, textColor=colors.white)
st_big = ParagraphStyle("big", fontName="SB", fontSize=20 * K, leading=24 * K, textColor=INK)
st_txt = ParagraphStyle("tx", fontName="S", fontSize=8.4 * K, leading=11.2 * K, textColor=INK)


def box(content, bg, border, width, bw=1.0):
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), bw * K, border), ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * K), ("RIGHTPADDING", (0, 0), (-1, -1), 6 * K),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2 * K), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2 * K)]))
    return t


def step(n, label, formula):
    left = Paragraph(f"<b>{n}.</b> {M(label)}", st_lbl)
    right = box(Paragraph(M(formula), st_frm), BOXBG, ACC, W * (1 - LR) - 2)
    t = Table([[left, right]], colWidths=[W * LR, W * (1 - LR)])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                           ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                           ("TOPPADDING", (0, 0), (-1, -1), 1.6 * K), ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6 * K)]))
    return t


def problema(num, tema, pasos, resp, nota):
    h = Table([[Paragraph(f"Problema {num} <font size={7.5*K:.1f}>· {M(tema)}</font>", st_t)]], colWidths=[W])
    h.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), INK),
                           ("LEFTPADDING", (0, 0), (-1, -1), 6 * K), ("TOPPADDING", (0, 0), (-1, -1), 3 * K),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * K)]))
    items = [h, Spacer(1, 2 * K)]
    items += [step(i + 1, l, f) for i, (l, f) in enumerate(pasos)]
    items.append(Spacer(1, 2 * K))
    items.append(box(Paragraph("<b>Respuesta:</b> " + M(resp), st_ans), ANS, ANSB, W, 1.6))
    if nota:
        items.append(Spacer(1, 1.5 * K))
        items.append(Paragraph("Nota: " + M(nota), st_note))
    items.append(Spacer(1, 9 * K if not COMPACT else 6 * K))
    return KeepTogether(items)


def banner(txt):
    t = Table([[Paragraph(txt, st_h1)]], colWidths=[W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACC), ("LEFTPADDING", (0, 0), (-1, -1), 7 * K),
                           ("TOPPADDING", (0, 0), (-1, -1), 4 * K), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * K)]))
    return [t, Spacer(1, 4 * K)]


PEND = ("<b>Pendientes (faltan en las fotos):</b> 1.4 (falta la gráfica de la Fig. 1.1), 1.5, 1.6 y 1.7 "
        "(página 12 completa), y el rango de <i>leyes de Newton</i> que no se indicó. "
        "También 1.321 está cortado al final. Con eso los agrego sin tocar lo demás. "
        "<b>Resultados no contrastados con las respuestas del libro</b> (no estaban en las fotos): "
        "verifica con la sección de respuestas.")

story = []
if COMPACT:
    story += [Paragraph("Irodov (Mir) — problemas resueltos · versión comprimida", st_h1.clone("x", textColor=INK)),
              Paragraph(PEND, st_txt), Spacer(1, 4)]
else:
    story += [Paragraph("Problemas resueltos — Irodov (Mir)", st_big),
              Paragraph("Mecánica · procedimiento en pasos, fórmulas en rectángulos y respuesta final", st_txt),
              Spacer(1, 8), box(Paragraph(PEND, st_txt), ANS, ANSB, W, 1.2), Spacer(1, 10)]

dic = {p[0]: p for p in P}
for titulo, nums in SECCIONES:
    story.append(KeepTogether(banner(titulo) + [problema(*dic[nums[0]])]))
    for n in nums[1:]:
        story.append(problema(*dic[n]))

nombre = "Irodov_Resueltos_Compacto.pdf" if COMPACT else "Irodov_Resueltos_Cuadros_Grandes.pdf"
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), nombre)


def footer(c, d):
    c.saveState(); c.setFont("S", 7); c.setFillColor(colors.HexColor("#666666"))
    y = 4 * mm if COMPACT else 8 * mm
    c.drawString(MG, y, "Irodov (Mir) · problemas resueltos")
    c.drawRightString(A4[0] - MG, y, f"Pág. {d.page}")
    c.restoreState()


if COMPACT:
    TM, BM = 6 * mm, 8 * mm
    frames = [Frame(MG + i * (W + GAP), BM, W, A4[1] - TM - BM, leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0) for i in range(2)]
else:
    TM, BM = 14 * mm, 15 * mm
    frames = [Frame(MG, BM, W, A4[1] - TM - BM, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)]
doc = BaseDocTemplate(out, pagesize=A4, leftMargin=MG, rightMargin=MG, topMargin=TM, bottomMargin=BM,
                      title="Irodov (Mir) — problemas resueltos")
doc.addPageTemplates([PageTemplate(id="p", frames=frames, onPage=footer)])
doc.build(story)
print(out)
