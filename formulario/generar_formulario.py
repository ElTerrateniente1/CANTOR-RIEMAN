#!/usr/bin/env python3
"""Genera Formulario_Irodov_Mecanica.pdf (ReportLab).

Cada tipo de problema = lista numerada de procedimientos; cada procedimiento
lleva su ley/formula generalizada encerrada en un rectangulo. Sin enunciados
ni desarrollos.
"""
import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.fonts import addMapping
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph,
                                Spacer, Table, TableStyle, KeepTogether,
                                PageBreak)

D = "/usr/share/fonts/truetype/dejavu/"
pdfmetrics.registerFont(TTFont("F", D + "DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("FB", D + "DejaVuSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("S", D + "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("SB", D + "DejaVuSans-Bold.ttf"))
addMapping("F", 0, 0, "F"); addMapping("F", 1, 0, "FB")
addMapping("F", 0, 1, "F"); addMapping("F", 1, 1, "FB")
addMapping("S", 0, 0, "S"); addMapping("S", 1, 0, "SB")
addMapping("S", 0, 1, "S"); addMapping("S", 1, 1, "SB")

COMPACT = "--compacto" in sys.argv
K = 0.65 if COMPACT else 1.0   # factor de tamano

INK = colors.HexColor("#1b2a41")
ACC = colors.HexColor("#0b5fa5")
BOXBG = colors.HexColor("#f3f7fb")

st_h1 = ParagraphStyle("h1", fontName="SB", fontSize=15*K, leading=19*K, textColor=colors.white)
st_h2 = ParagraphStyle("h2", fontName="SB", fontSize=10.5*K, leading=13*K, textColor=ACC,
                       spaceBefore=7*K, spaceAfter=3*K)
st_lbl = ParagraphStyle("lbl", fontName="S", fontSize=8.2*K, leading=10.2*K, textColor=INK)
st_frm = ParagraphStyle("frm", fontName="F", fontSize=9.6*K, leading=13.2*K, textColor=INK)
st_note = ParagraphStyle("note", fontName="S", fontSize=8, leading=10.5,
                         textColor=colors.HexColor("#444444"))
st_title = ParagraphStyle("t", fontName="SB", fontSize=22, leading=27, textColor=INK)
st_sub = ParagraphStyle("s", fontName="S", fontSize=10, leading=14, textColor=colors.HexColor("#444444"))

MG = 7 * mm if COMPACT else 14 * mm
GAP = 4 * mm
W = (A4[0] - 2 * MG - GAP) / 2 if COMPACT else A4[0] - 28 * mm
LR = 0.36 if COMPACT else 0.35


def step(n, label, formulas):
    """Un procedimiento: numero + etiqueta | rectangulo con la(s) formula(s)."""
    if isinstance(formulas, str):
        formulas = [formulas]
    left = Paragraph(f"<b>{n}.</b> {label}", st_lbl)
    right = [Paragraph(f, st_frm) for f in formulas]
    inner = Table([[right]], colWidths=[W * (1 - LR) - 2])
    inner.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1.1 * K, ACC),
        ("BACKGROUND", (0, 0), (-1, -1), BOXBG),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * K), ("RIGHTPADDING", (0, 0), (-1, -1), 6 * K),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * K), ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * K),
    ]))
    t = Table([[left, inner]], colWidths=[W * LR, W * (1 - LR)])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5 * K), ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5 * K),
    ]))
    return t


def tipo(titulo, pasos):
    items = [Paragraph(titulo, st_h2)]
    items += [step(i + 1, l, f) for i, (l, f) in enumerate(pasos)]
    items.append(Spacer(1, 3 * K))
    return items


def banner(texto):
    t = Table([[Paragraph(texto, st_h1)]], colWidths=[W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), INK),
                           ("LEFTPADDING", (0, 0), (-1, -1), 8 * K),
                           ("TOPPADDING", (0, 0), (-1, -1), 5 * K),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * K)]))
    return [t, Spacer(1, 3 * K)]


# Notacion: negrita = vector. v0 -> v<sub>0</sub>. Δ, ∫, ∑, ∇, φ, ω, α, μ, η, ρ, γ, β.
S_ = "<sub>{}</sub>".format
def sub(x): return f"<sub>{x}</sub>"
def sup(x): return f"<super>{x}</super>"

story = []
PB = Spacer(1, 4) if COMPACT else PageBreak()

# ------------------------------------------------------------------ portada
if COMPACT:
    story += [Paragraph("Formulario de Mecánica — Irodov (Mir) · versión compacta · <b>negrita = vector</b> · rangos número→bloque por confirmar con el libro", st_note), Spacer(1, 3)]
else:
    story += [Paragraph("Formulario de Mecánica — Irodov (Mir)", st_title),
              Paragraph("Problemas de Física General · Parte 1: Fundamentos físicos de la mecánica", st_sub),
              Spacer(1, 6),
              Paragraph(
                  "Cada tipo de problema se resuelve siguiendo los pasos numerados, en ese orden. "
                  "Cada rectángulo contiene la ley o fórmula generalizada del paso. "
                  "<b>Negrita = vector.</b> Convención: g = 9,8 m/s², G = 6,67·10"
                  + sup("−11") + " N·m²/kg², c = 3·10" + sup("8") + " m/s.", st_note),
              Spacer(1, 6)]
    
    idx = [["Rango indicado", "Bloque del formulario", "Estado"],
           ["1.1 – 1.13", "A. Cinemática", "según tu mensaje (“la primera”)"],
           ["1.200 – 1.228", "C. Conservación · D. Gravitación", "por confirmar con el libro"],
           ["1.244 – 1.248", "E. Mecánica del sólido", "por confirmar con el libro"],
           ["1.316 – 1.321", "F. Hidrodinámica", "por confirmar con el libro"],
           ["1.340 – 1.353, 1.355, 1.358", "G. Mecánica relativista (apoyo)", "por confirmar con el libro"],
           ["“Leyes de Newton”", "B. Dinámica (leyes de Newton)", "indicado en tu mensaje"]]
    t = Table([[Paragraph(c, st_lbl) for c in r] for r in idx],
              colWidths=[W * 0.27, W * 0.43, W * 0.30])
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.6, ACC),
                           ("BACKGROUND", (0, 0), (-1, 0), BOXBG),
                           ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
    story += [t, Spacer(1, 4),
              Paragraph(
                  "Aviso: no pude abrir el libro desde este entorno (red bloqueada), así que la asignación "
                  "número→bloque es una estimación a partir de la estructura habitual del Irodov y de tu lista de "
                  "temas; verifícala con el índice de tu edición. El formulario está organizado por <i>tipo de "
                  "problema</i>, por lo que sigue sirviendo aunque un rango cambie de bloque.", st_note)]

# ------------------------------------------------------------------ A. Cinemática
story += [PB] + banner("A. Cinemática (1.1 – 1.13)")
story += tipo("A1 · Movimiento con aceleración dada / trayectoria dada", [
    ("Sistema de referencia, origen, sentidos (+)", "<b>r</b>(t) = x<b>i</b> + y<b>j</b> + z<b>k</b>"),
    ("Velocidad y aceleración (derivar)", "<b>v</b> = d<b>r</b>/dt ;  <b>a</b> = d<b>v</b>/dt = d" + sup("2") + "<b>r</b>/dt" + sup("2")),
    ("Problema inverso (integrar con condiciones iniciales)",
     "<b>v</b> = <b>v</b>" + sub("0") + " + ∫<b>a</b> dt ;  <b>r</b> = <b>r</b>" + sub("0") + " + ∫<b>v</b> dt"),
    ("Si a depende de x:", "v dv = a(x) dx   ⇒   v" + sup("2") + "/2 = v" + sub("0") + sup("2") + "/2 + ∫a dx"),
    ("MRUA (a = cte)", ["v = v" + sub("0") + " + a t ;  x = x" + sub("0") + " + v" + sub("0") + "t + a t" + sup("2") + "/2",
                        "v" + sup("2") + " − v" + sub("0") + sup("2") + " = 2a(x − x" + sub("0") + ")"]),
    ("Camino recorrido (no confundir con desplazamiento)", "s = ∫|<b>v</b>| dt ;  v̄ = s/Δt ;  <b>v</b>" + sub("med") + " = Δ<b>r</b>/Δt"),
    ("Condición de encuentro / alcance", "<b>r</b>" + sub("1") + "(t) = <b>r</b>" + sub("2") + "(t) ;  extremo: dx/dt = 0"),
])
story += tipo("A2 · Velocidad relativa (bote–río, viento, observadores)", [
    ("Identificar marcos: cuerpo K, medio K′, suelo", "<b>v</b> = <b>v′</b> + <b>V</b>   (<b>v′</b>: respecto al medio, <b>V</b>: del medio)"),
    ("Aceleración relativa", "<b>a</b>" + sub("12") + " = <b>a</b>" + sub("1") + " − <b>a</b>" + sub("2") + " ;  <b>v</b>" + sub("12") + " = <b>v</b>" + sub("1") + " − <b>v</b>" + sub("2")),
    ("Mínima distancia de aproximación (trayectorias rectas)",
     "<b>r</b>" + sub("rel") + "(t) = <b>r</b>" + sub("0") + " + <b>v</b>" + sub("rel") + "t ;  d/dt|<b>r</b>" + sub("rel") + "|" + sup("2") + " = 0 ⇒ t* = −<b>r</b>" + sub("0") + "·<b>v</b>" + sub("rel") + "/v" + sub("rel") + sup("2")),
    ("Rumbo para cruzar / interceptar", "componentes: v′ sinθ = V (anular deriva) ;  t = d/(v′ cosθ)"),
])
story += tipo("A3 · Tiro parabólico", [
    ("Descomponer v" + sub("0") + " (ángulo α sobre la horizontal)", "v" + sub("0x") + " = v" + sub("0") + " cosα ;  v" + sub("0y") + " = v" + sub("0") + " sinα"),
    ("Ecuaciones de movimiento", ["x = v" + sub("0") + " cosα · t ;  y = y" + sub("0") + " + v" + sub("0") + " sinα · t − g t" + sup("2") + "/2",
                                   "v" + sub("x") + " = v" + sub("0") + " cosα ;  v" + sub("y") + " = v" + sub("0") + " sinα − g t"]),
    ("Trayectoria", "y = x tanα − g x" + sup("2") + "/(2 v" + sub("0") + sup("2") + " cos" + sup("2") + "α)"),
    ("Tiempo de vuelo, altura máx., alcance (y₀ = 0)",
     ["t = 2v" + sub("0") + " sinα/g ;  H = v" + sub("0") + sup("2") + " sin" + sup("2") + "α/(2g)",
      "L = v" + sub("0") + sup("2") + " sin2α/g   (máx. en α = 45°)"]),
    ("Impacto en plano inclinado / curva de seguridad", "sustituir y(x) = x tanβ ;  envolvente: y = v" + sub("0") + sup("2") + "/(2g) − g x" + sup("2") + "/(2v" + sub("0") + sup("2") + ")"),
])
story += tipo("A4 · Movimiento curvilíneo y circular", [
    ("Componentes intrínsecas", "a" + sub("t") + " = dv/dt ;  a" + sub("n") + " = v" + sup("2") + "/R ;  a = √(a" + sub("t") + sup("2") + " + a" + sub("n") + sup("2") + ")"),
    ("Radio de curvatura", "R = v" + sup("2") + "/a" + sub("n") + " = v" + sup("3") + "/|<b>v</b>×<b>a</b>|"),
    ("Cinemática angular", "ω = dφ/dt ;  β = dω/dt ;  <b>v</b> = <b>ω</b>×<b>r</b> ;  v = ωR"),
    ("Relación lineal–angular", "a" + sub("t") + " = βR ;  a" + sub("n") + " = ω" + sup("2") + "R"),
    ("MCUA", "ω = ω" + sub("0") + " + βt ;  φ = ω" + sub("0") + "t + βt" + sup("2") + "/2 ;  N vueltas = φ/2π"),
    ("Coordenadas polares (si r, φ dependen de t)", "v" + sub("r") + " = ṙ ;  v" + sub("φ") + " = rφ̇ ;  a" + sub("r") + " = r̈ − rφ̇" + sup("2") + " ;  a" + sub("φ") + " = rφ̈ + 2ṙφ̇"),
])

# ------------------------------------------------------------------ B. Newton
story += [PB] + banner("B. Dinámica — Leyes de Newton")
story += tipo("B1 · Problema general de fuerzas (traslación)", [
    ("Aislar cada cuerpo: diagrama de cuerpo libre", "fuerzas: m<b>g</b>, <b>N</b>, <b>T</b>, <b>f</b>, <b>F</b>" + sub("el") + ", <b>F</b>" + sub("res")),
    ("Ejes: uno a lo largo de la aceleración", "Si trayectoria curva: ejes tangencial (τ) y normal (n)"),
    ("2.ª ley de Newton (por componentes)", ["∑<b>F</b> = m<b>a</b>",
                                              "∑F" + sub("x") + " = m a" + sub("x") + " ;  ∑F" + sub("y") + " = m a" + sub("y")]),
    ("Leyes de fuerza", ["P = mg ;  F" + sub("el") + " = −kx ;  f" + sub("cin") + " = μN ;  f" + sub("est") + " ≤ μ" + sub("s") + "N",
                         "arrastre: F = −k" + sub("1") + "v  ó  −k" + sub("2") + "v" + sup("2")]),
    ("3.ª ley y ligaduras", ["<b>F</b>" + sub("12") + " = −<b>F</b>" + sub("21") + " ;  cuerda inextensible: ∑l" + sub("i") + " = cte ⇒ ∑a" + sub("i") + " = 0 (con signos)",
                              "polea fija: |a" + sub("1") + "| = |a" + sub("2") + "| ;  polea móvil: a" + sub("pol") + " = (a" + sub("1") + " + a" + sub("2") + ")/2"]),
    ("Resolver el sistema de ecuaciones", "incógnitas: a, T, N, f ;  verificar signo de f y N ≥ 0"),
    ("Si F depende de t, x o v: integrar", ["dv/dt = F(t)/m ⇒ v = v" + sub("0") + " + (1/m)∫F dt",
                                            "v dv/dx = F(x)/m ;  dv/dt = F(v)/m ⇒ ∫dv/F(v) = t/m"]),
])
story += tipo("B2 · Plano inclinado, rozamiento y movimiento circular", [
    ("Descomponer el peso", "P" + sub("∥") + " = mg sinθ ;  P" + sub("⊥") + " = mg cosθ ;  N = mg cosθ (sin otras fuerzas ⊥)"),
    ("Aceleración con rozamiento", "a = g(sinθ − μ cosθ) ;  reposo si tanθ ≤ μ" + sub("s")),
    ("Dinámica circular", "∑F" + sub("n") + " = m v" + sup("2") + "/R = mω" + sup("2") + "R ;  ∑F" + sub("τ") + " = m dv/dt"),
    ("Curva peraltada / límite de deslizamiento", "tanθ = v" + sup("2") + "/(gR) ;  con fricción: v" + sup("2") + "/(gR) = (tanθ + μ)/(1 − μ tanθ)"),
    ("Péndulo cónico y similares", "T cosθ = mg ;  T sinθ = mω" + sup("2") + "R ;  ω" + sup("2") + " = g/(l cosθ)"),
])
story += tipo("B3 · Sistemas no inerciales y masa variable", [
    ("Marco K′ con aceleración <b>a</b>" + sub("0") + " (traslación)", "m<b>a′</b> = <b>F</b> − m<b>a</b>" + sub("0") + "   (fuerza de inercia −m<b>a</b>" + sub("0") + ")"),
    ("Marco en rotación uniforme", "m<b>a′</b> = <b>F</b> + mω" + sup("2") + "<b>R</b> + 2m<b>v′</b>×<b>ω</b>   (centrífuga + Coriolis)"),
    ("Ecuación de Meshchersky (masa variable)", "m d<b>v</b>/dt = <b>F</b> + (d m/dt)<b>u</b>   (u: velocidad relativa del material que sale/entra)"),
    ("Cohete (F = 0, u = cte)", "v = u ln(m" + sub("0") + "/m) ;  con gravedad: v = u ln(m" + sub("0") + "/m) − g t"),
    ("Impulso", "∫<b>F</b> dt = Δ<b>p</b> = Δ(m<b>v</b>)"),
])

# ------------------------------------------------------------------ C. Conservación
story += [PB] + banner("C. Principios de conservación (momento, energía, momento angular)")
story += tipo("C1 · Energía y trabajo", [
    ("Definir estados inicial (1) y final (2)", "sistema, fuerzas conservativas / no conservativas, nivel de U = 0"),
    ("Trabajo y teorema de la energía cinética", "A = ∫<b>F</b>·d<b>r</b> ;  A" + sub("total") + " = ΔT ;  T = mv" + sup("2") + "/2"),
    ("Energías potenciales", "U = mgh ;  U = kx" + sup("2") + "/2 ;  U = −GMm/r ;  <b>F</b> = −∇U"),
    ("Conservación de la energía mecánica", "T" + sub("1") + " + U" + sub("1") + " = T" + sub("2") + " + U" + sub("2")),
    ("Con fuerzas no conservativas", "(T + U)" + sub("2") + " − (T + U)" + sub("1") + " = A" + sub("nc") + "   (A" + sub("fric") + " = −μN s)"),
    ("Potencia", "P = dA/dt = <b>F</b>·<b>v</b> ;  P" + sub("med") + " = A/Δt"),
    ("Equilibrio y estabilidad", "F" + sub("x") + " = −dU/dx = 0 ;  estable si d" + sup("2") + "U/dx" + sup("2") + " > 0"),
])
story += tipo("C2 · Momento lineal, centro de masa y choques", [
    ("Verificar si el sistema es cerrado (o ∑F" + sub("ext,x") + " = 0 en una dirección)", "<b>p</b> = ∑m" + sub("i") + "<b>v</b>" + sub("i")),
    ("Conservación del momento", "∑m" + sub("i") + "<b>v</b>" + sub("i") + " (antes) = ∑m" + sub("i") + "<b>v′</b>" + sub("i") + " (después)"),
    ("Centro de masa", ["<b>r</b>" + sub("cm") + " = ∑m" + sub("i") + "<b>r</b>" + sub("i") + "/∑m" + sub("i") + " ;  <b>v</b>" + sub("cm") + " = <b>p</b>/M",
                        "M<b>a</b>" + sub("cm") + " = ∑<b>F</b>" + sub("ext")]),
    ("Choque perfectamente inelástico", "v = (m" + sub("1") + "v" + sub("1") + " + m" + sub("2") + "v" + sub("2") + ")/(m" + sub("1") + " + m" + sub("2") + ") ;  ΔT = −μ" + sub("r") + "v" + sub("rel") + sup("2") + "/2"),
    ("Choque elástico central (se conservan p y T)",
     ["v" + sub("1") + "′ = [(m" + sub("1") + " − m" + sub("2") + ")v" + sub("1") + " + 2m" + sub("2") + "v" + sub("2") + "]/(m" + sub("1") + " + m" + sub("2") + ")",
      "v" + sub("2") + "′ = [(m" + sub("2") + " − m" + sub("1") + ")v" + sub("2") + " + 2m" + sub("1") + "v" + sub("1") + "]/(m" + sub("1") + " + m" + sub("2") + ")"]),
    ("Choque parcialmente elástico", "k = −(v" + sub("2") + "′ − v" + sub("1") + "′)/(v" + sub("2") + " − v" + sub("1") + ") ;  0 ≤ k ≤ 1"),
    ("Choque no central elástico (masas iguales)", "ángulo entre velocidades finales = 90° ;  masa reducida μ" + sub("r") + " = m" + sub("1") + "m" + sub("2") + "/(m" + sub("1") + " + m" + sub("2") + ")"),
    ("Sistema del centro de masa (König)", "T = M v" + sub("cm") + sup("2") + "/2 + T̃ ;  T̃ = μ" + sub("r") + "v" + sub("rel") + sup("2") + "/2"),
])
story += tipo("C3 · Momento angular", [
    ("Escoger el punto O respecto al cual calcular", "<b>L</b> = <b>r</b>×<b>p</b> ;  L = r m v sinθ = m v d (brazo d)"),
    ("Ecuación del momento angular", "d<b>L</b>/dt = <b>M</b> = <b>r</b>×<b>F</b> ;  M = F d"),
    ("Si M = 0 (fuerza central): conservación", "<b>L</b> = cte ⇒ r" + sub("1") + "v" + sub("1") + " sinθ" + sub("1") + " = r" + sub("2") + "v" + sub("2") + " sinθ" + sub("2")),
    ("Complementar con energía", "mv" + sub("1") + sup("2") + "/2 + U(r" + sub("1") + ") = mv" + sub("2") + sup("2") + "/2 + U(r" + sub("2") + ")"),
    ("Sistema de partículas", "<b>L</b> = <b>L</b>" + sub("cm") + " + <b>L</b>" + sub("propio") + " ;  <b>L</b>" + sub("cm") + " = <b>r</b>" + sub("cm") + "×M<b>v</b>" + sub("cm")),
])

# ------------------------------------------------------------------ D. Gravitación
story += [PB] + banner("D. Gravitación universal")
story += tipo("D1 · Campo y potencial gravitatorio", [
    ("Ley de gravitación", "F = G m" + sub("1") + "m" + sub("2") + "/r" + sup("2") + " ;  G = 6,67·10" + sup("−11") + " N·m²/kg²"),
    ("Intensidad y potencial (masa puntual / esfera, r ≥ R)", "<b>g</b> = −GM<b>r</b>/r" + sup("3") + " ;  φ = −GM/r ;  U = mφ ;  <b>g</b> = −∇φ"),
    ("Superposición (varias masas)", "<b>g</b> = ∑<b>g</b>" + sub("i") + " ;  φ = ∑φ" + sub("i")),
    ("Cuerpo extenso: elemento dm", "d<b>g</b> = −G dm <b>r</b>/r" + sup("3") + " ;  dm = ρ dV  (λ dl, σ dS) ;  usar simetría"),
    ("Teorema de Gauss gravitatorio (simetría esférica, cilíndrica, plana)", "∫" + sub("S") + "<b>g</b>·d<b>S</b> = −4πG M" + sub("int")),
    ("Esfera homogénea", ["r ≥ R: g = GM/r" + sup("2") + " ;  φ = −GM/r",
                          "r ≤ R: g = GMr/R" + sup("3") + " = (4/3)πGρ r ;  φ = −GM(3R" + sup("2") + " − r" + sup("2") + ")/(2R" + sup("3") + ")"]),
    ("Cáscara esférica", "dentro: g = 0, φ = −GM/R ;  fuera: como masa puntual"),
    ("Variación de g con altura / latitud", "g(h) = g" + sub("0") + "R" + sup("2") + "/(R + h)" + sup("2") + " ;  g" + sub("φ") + " ≈ g" + sub("0") + " − ω" + sup("2") + "R cos" + sup("2") + "φ"),
])
story += tipo("D2 · Órbitas, Kepler y velocidades cósmicas", [
    ("Órbita circular: gravedad = fuerza centrípeta", "GMm/r" + sup("2") + " = mv" + sup("2") + "/r ⇒ v = √(GM/r) ;  T = 2πr/v"),
    ("3.ª ley de Kepler", "T" + sup("2") + "/a" + sup("3") + " = 4π" + sup("2") + "/(GM) ;  (T" + sub("1") + "/T" + sub("2") + ")" + sup("2") + " = (a" + sub("1") + "/a" + sub("2") + ")" + sup("3")),
    ("2.ª ley de Kepler (velocidad areolar)", "dS/dt = L/(2m) = r" + sup("2") + "φ̇/2 = cte ;  r" + sub("min") + "v" + sub("max") + " = r" + sub("max") + "v" + sub("min")),
    ("Energía en órbita", "E = mv" + sup("2") + "/2 − GMm/r ;  E = −GMm/(2a) ;  v" + sup("2") + " = GM(2/r − 1/a)"),
    ("Conservación entre dos puntos", "r" + sub("1") + "v" + sub("1") + " = r" + sub("2") + "v" + sub("2") + " ;  v" + sub("1") + sup("2") + "/2 − GM/r" + sub("1") + " = v" + sub("2") + sup("2") + "/2 − GM/r" + sub("2")),
    ("Velocidades cósmicas", "v" + sub("1") + " = √(gR) = √(GM/R) ;  v" + sub("2") + " = √(2GM/R) = √2·v" + sub("1")),
    ("Forma de la órbita", "r = p/(1 + e cosφ) ;  p = L" + sup("2") + "/(GMm" + sup("2") + ") ;  E < 0 elipse, E = 0 parábola, E > 0 hipérbola"),
    ("Sistema de dos cuerpos", "μ" + sub("r") + " = m" + sub("1") + "m" + sub("2") + "/(m" + sub("1") + " + m" + sub("2") + ") ;  T" + sup("2") + " = 4π" + sup("2") + "a" + sup("3") + "/[G(m" + sub("1") + " + m" + sub("2") + ")]"),
])

# ------------------------------------------------------------------ E. Sólido
story += [PB] + banner("E. Mecánica del sólido (rotación, rodadura, elasticidad)")
story += tipo("E1 · Dinámica de rotación y rodadura", [
    ("Tipo de movimiento: eje fijo / plano (rodadura) / con traslación", "elegir eje z y sentido positivo de rotación"),
    ("Momento de inercia (definición)", "I = ∑m" + sub("i") + "r" + sub("i") + sup("2") + " = ∫r" + sup("2") + " dm"),
    ("Teoremas de Steiner y de ejes perpendiculares", "I = I" + sub("cm") + " + m a" + sup("2") + " ;  placa plana: I" + sub("z") + " = I" + sub("x") + " + I" + sub("y")),
    ("Valores tabulados (eje por el centro)", ["aro: mR" + sup("2") + " ;  disco/cilindro: mR" + sup("2") + "/2 ;  esfera maciza: 2mR" + sup("2") + "/5 ;  cáscara esf.: 2mR" + sup("2") + "/3",
                                               "varilla (centro): ml" + sup("2") + "/12 ;  varilla (extremo): ml" + sup("2") + "/3 ;  placa a×b: m(a" + sup("2") + " + b" + sup("2") + ")/12"]),
    ("Ecuación de la dinámica de rotación", "I β = M" + sub("z") + " = ∑ r F sinθ ;  d<b>L</b>/dt = <b>M</b> ;  <b>L</b> = I<b>ω</b>"),
    ("Traslación del centro de masa", "M<b>a</b>" + sub("cm") + " = ∑<b>F</b>" + sub("ext")),
    ("Condición de rodadura sin deslizar", "v" + sub("cm") + " = ωR ;  a" + sub("cm") + " = βR ;  f" + sub("est") + " ≤ μ" + sub("s") + "N"),
    ("Energía cinética", ["eje fijo: T = Iω" + sup("2") + "/2",
                          "movimiento plano: T = mv" + sub("cm") + sup("2") + "/2 + I" + sub("cm") + "ω" + sup("2") + "/2"]),
    ("Trabajo y potencia en rotación", "A = ∫M dφ ;  P = Mω ;  A" + sub("total") + " = ΔT"),
])
story += tipo("E2 · Conservación en el sólido, péndulos y giroscopio", [
    ("Si M" + sub("z") + " = 0: conservación del momento angular", "I" + sub("1") + "ω" + sub("1") + " = I" + sub("2") + "ω" + sub("2") + "  (varía I ⇒ varía ω)"),
    ("Si solo actúan fuerzas conservativas / sin deslizamiento", "T + U = cte (la fricción estática no disipa)"),
    ("Impacto contra un sólido (bola–barra)", "L respecto al eje/punto de impacto antes = después ;  + energía si elástico"),
    ("Péndulo físico", "ω" + sub("0") + " = √(m g l/I) ;  T = 2π√(I/(m g l)) ;  longitud reducida l" + sub("r") + " = I/(m l)"),
    ("Giroscopio y precesión", "ω" + sub("prec") + " = M/(L sinθ) = m g l/(Iω) ;  <b>M</b> = <b>ω</b>" + sub("prec") + "×<b>L</b>"),
    ("Vuelco / deslizamiento (límite)", "∑M" + sub("cm") + " = 0 con N desplazada ;  condición: μ ≥ tanθ (desliza) ó x ≤ b/2 (vuelca)"),
])
story += tipo("E3 · Deformaciones elásticas", [
    ("Esfuerzo y deformación unitaria", "σ = F/S ;  ε = Δl/l"),
    ("Ley de Hooke y constante del cuerpo", "σ = Eε ;  F = (ES/l)Δl = kΔl"),
    ("Coeficiente de Poisson", "ε′ = −νε ;  Δd/d = −νΔl/l"),
    ("Deformación por cizalladura y torsión", "τ = Gγ ;  M = fφ ;  f = πGr" + sup("4") + "/(2l) (varilla maciza)"),
    ("Energía elástica", "u = σε/2 = Eε" + sup("2") + "/2 (por unidad de volumen) ;  U = kΔl" + sup("2") + "/2"),
    ("Peso propio / aceleración (varilla)", "σ(x) = ρ(g + a)x  ⇒  Δl = ρ(g + a)l" + sup("2") + "/(2E)"),
    ("Compresión hidrostática", "Δp = −K ΔV/V ;  K = E/[3(1 − 2ν)]"),
])

# ------------------------------------------------------------------ F. Hidrodinámica
story += [PB] + banner("F. Hidrodinámica")
story += tipo("F1 · Fluido en reposo y fluido ideal en movimiento", [
    ("Presión hidrostática", "p = p" + sub("0") + " + ρ g h ;  Pascal: Δp se transmite íntegra"),
    ("Empuje (Arquímedes) y flotación", "F" + sub("A") + " = ρ" + sub("liq") + " g V" + sub("sum") + " ;  flota: ρ" + sub("cuerpo") + " V = ρ" + sub("liq") + " V" + sub("sum")),
    ("Continuidad (incompresible)", "S" + sub("1") + "v" + sub("1") + " = S" + sub("2") + "v" + sub("2") + " = Q ;  (general: ρSv = cte)"),
    ("Ecuación de Bernoulli (línea de corriente)", "p + ρv" + sup("2") + "/2 + ρ g h = cte"),
    ("Salida por orificio (Torricelli)", "v = √(2gh) ;  Q = s v ;  vaciado: S dh/dt = −s√(2gh)"),
    ("Tubo de Venturi / Pitot", "p" + sub("1") + " − p" + sub("2") + " = ρ(v" + sub("2") + sup("2") + " − v" + sub("1") + sup("2") + ")/2 ;  Pitot: v = √(2Δp/ρ)"),
    ("Alcance del chorro horizontal", "t = √(2H/g) ;  x = v t = 2√(h(H − h))"),
])
story += tipo("F2 · Fuerzas del fluido, rotación y viscosidad", [
    ("Fuerza del chorro / reacción (teorema del impulso)", "<b>F</b> = (dm/dt)(<b>v</b>" + sub("2") + " − <b>v</b>" + sub("1") + ") = ρ Q(<b>v</b>" + sub("2") + " − <b>v</b>" + sub("1") + ")"),
    ("Fluido en rotación (marco no inercial)", "p = p" + sub("0") + " + ρω" + sup("2") + "r" + sup("2") + "/2 ;  superficie libre: z = ω" + sup("2") + "r" + sup("2") + "/(2g)"),
    ("Recipiente acelerado (a horizontal)", "tanθ = a/g ;  p = p" + sub("0") + " + ρ(g" + sub("ef") + ")h con <b>g</b>" + sub("ef") + " = <b>g</b> − <b>a</b>"),
    ("Viscosidad (Newton)", "F = η S dv/dx"),
    ("Flujo laminar en tubo (Poiseuille)", "Q = πR" + sup("4") + "Δp/(8ηl) ;  v" + sub("máx") + " = Δp R" + sup("2") + "/(4ηl)"),
    ("Resistencia de Stokes y velocidad límite", "F = 6πηrv ;  v" + sub("lím") + " = 2r" + sup("2") + "(ρ − ρ" + sub("0") + ")g/(9η)"),
    ("Régimen: número de Reynolds", "Re = ρ v l/η ;  laminar si Re < ~10" + sup("3") + " (tubo)"),
])

# ------------------------------------------------------------------ G. Relativista
story += [PB] + banner("G. Mecánica relativista (apoyo; rango 1.340–1.358 por confirmar)")
story += tipo("G1 · Cinemática y dinámica relativistas", [
    ("Factor de Lorentz", "β = v/c ;  γ = 1/√(1 − β" + sup("2") + ")"),
    ("Transformaciones de Lorentz (K′ se mueve con V en x)", "x′ = γ(x − Vt) ;  t′ = γ(t − Vx/c" + sup("2") + ") ;  y′ = y ;  z′ = z"),
    ("Contracción y dilatación", "l = l" + sub("0") + "/γ ;  Δt = γΔτ (τ: tiempo propio)"),
    ("Suma de velocidades", "u = (u′ + V)/(1 + u′V/c" + sup("2") + ")"),
    ("Intervalo invariante", "s" + sup("2") + " = c" + sup("2") + "t" + sup("2") + " − x" + sup("2") + " = cte en todo marco"),
    ("Momento y energía", "<b>p</b> = γm<b>v</b> ;  E = γmc" + sup("2") + " ;  T = (γ − 1)mc" + sup("2") + " ;  E" + sup("2") + " = p" + sup("2") + "c" + sup("2") + " + m" + sup("2") + "c" + sup("4") + " ;  v = pc" + sup("2") + "/E"),
    ("Conservación en reacciones / choques", "∑E" + sub("antes") + " = ∑E" + sub("después") + " ;  ∑<b>p</b>" + sub("antes") + " = ∑<b>p</b>" + sub("después")),
    ("Invariante y umbral de reacción", "(∑E)" + sup("2") + " − (∑p)" + sup("2") + "c" + sup("2") + " = invariante ;  T" + sub("umbral") + " = [(∑m" + sub("fin") + ")" + sup("2") + " − (∑m" + sub("ini") + ")" + sup("2") + "]c" + sup("2") + "/(2m" + sub("blanco") + ")"),
    ("Fuerza relativista", "<b>F</b> = d<b>p</b>/dt ;  A = ΔE"),
])


# ------------------------------------------------------------------ build
def footer(c, d):
    c.saveState()
    c.setFont("S", 7.5)
    c.setFillColor(colors.HexColor("#666666"))
    c.drawString(MG, 8 * mm if not COMPACT else 4 * mm, "Formulario de Mecánica — Irodov (Mir) · fórmulas generalizadas, sin enunciados")
    c.drawRightString(A4[0] - MG, 8 * mm if not COMPACT else 4 * mm, f"Pág. {d.page}")
    c.restoreState()


nombre = "Formulario_Irodov_Mecanica_Compacto.pdf" if COMPACT else "Formulario_Irodov_Mecanica.pdf"
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), nombre)
if COMPACT:
    TM, BM = 6 * mm, 8 * mm
    H = A4[1] - TM - BM
    frames = [Frame(MG + i * (W + GAP), BM, W, H, id=f"f{i}", leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0) for i in range(2)]
else:
    TM, BM = 13 * mm, 15 * mm
    frames = [Frame(14 * mm, 15 * mm, W, A4[1] - 28 * mm, id="f", leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0)]
doc = BaseDocTemplate(out, pagesize=A4, leftMargin=MG, rightMargin=MG, topMargin=TM, bottomMargin=BM,
                      title="Formulario de Mecánica — Irodov (Mir)")
doc.addPageTemplates([PageTemplate(id="p", frames=frames, onPage=footer)])
doc.build(story)
print(out)
