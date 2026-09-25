"""Genera Cantor_Riemann_Topologia.pdf.

Uso:
    bash documento/preparar_fuentes.sh   # una sola vez
    python3 documento/generar_pdf.py

Requiere reportlab (y fonttools para preparar las fuentes).
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.fonts import addMapping

AQUI = Path(__file__).resolve().parent
FUENTES = AQUI / ".fuentes"
SALIDA = AQUI / "Cantor_Riemann_Topologia.pdf"

# ---------------------------------------------------------------- tipografía
for nombre, archivo in {
    "Garamond": "EBGaramond-Regular.ttf",
    "Garamond-It": "EBGaramond-Italic.ttf",
    "Garamond-SB": "EBGaramond-SemiBold.ttf",
    "Garamond-SBIt": "EBGaramond-SemiBoldItalic.ttf",
    "Plex": "IBMPlexSans-Regular.ttf",
    "Plex-SB": "IBMPlexSans-SemiBold.ttf",
}.items():
    pdfmetrics.registerFont(TTFont(nombre, str(FUENTES / archivo)))

addMapping("Garamond", 0, 0, "Garamond")
addMapping("Garamond", 0, 1, "Garamond-It")
addMapping("Garamond", 1, 0, "Garamond-SB")
addMapping("Garamond", 1, 1, "Garamond-SBIt")
addMapping("Plex", 0, 0, "Plex")
addMapping("Plex", 1, 0, "Plex-SB")
addMapping("Plex", 0, 1, "Plex")
addMapping("Plex", 1, 1, "Plex-SB")

# ------------------------------------------------------------------- paleta
PAPEL = colors.HexColor("#FBF9F4")
TINTE = colors.HexColor("#F1ECE2")
TINTA = colors.HexColor("#1F2A36")
TEXTO = colors.HexColor("#2A323C")
GRIS = colors.HexColor("#5F6773")
REGLA = colors.HexColor("#D9D3C7")
AZUL = colors.HexColor("#2F5D8A")        # Riemann
AZUL_CLARO = colors.HexColor("#E3EBF3")
NARANJA = colors.HexColor("#9A4E1B")     # Cantor (texto)
NARANJA_RELLENO = colors.HexColor("#B5652B")
NARANJA_CLARO = colors.HexColor("#F5E6D8")
GRIS_CLARO = colors.HexColor("#E7E4DD")  # Cauchy–Weierstrass

# ------------------------------------------------------------------- estilos
cuerpo = ParagraphStyle(
    "cuerpo", fontName="Garamond", fontSize=11.5, leading=15.6,
    textColor=TEXTO, alignment=TA_JUSTIFY, spaceAfter=7,
    hyphenationLang="es_ES", embeddedHyphenation=1, uriWasteReduce=0.3,
)
cuerpo_izq = ParagraphStyle("cuerpo_izq", parent=cuerpo, alignment=TA_LEFT)
antetitulo = ParagraphStyle(
    "antetitulo", fontName="Plex-SB", fontSize=8.5, leading=11,
    textColor=AZUL, spaceAfter=10,
)
titulo = ParagraphStyle(
    "titulo", fontName="Garamond-SB", fontSize=27, leading=31,
    textColor=TINTA, spaceAfter=6,
)
subtitulo = ParagraphStyle(
    "subtitulo", fontName="Garamond-It", fontSize=14, leading=18,
    textColor=GRIS, spaceAfter=14,
)
h1 = ParagraphStyle(
    "h1", fontName="Plex-SB", fontSize=14, leading=18, textColor=TINTA,
    spaceBefore=16, spaceAfter=8, keepWithNext=1,
)
h2 = ParagraphStyle(
    "h2", fontName="Garamond-SB", fontSize=12.8, leading=16, textColor=TINTA,
    spaceBefore=8, spaceAfter=4, keepWithNext=1,
)
etiqueta = ParagraphStyle(
    "etiqueta", fontName="Plex-SB", fontSize=8, leading=10.5, textColor=GRIS,
    spaceAfter=4,
)
pie = ParagraphStyle(
    "pie", fontName="Plex", fontSize=8.3, leading=11, textColor=GRIS,
    spaceBefore=4, spaceAfter=10,
)
celda = ParagraphStyle(
    "celda", fontName="Garamond", fontSize=10, leading=12.4, textColor=TEXTO,
)
celda_cab = ParagraphStyle(
    "celda_cab", fontName="Plex-SB", fontSize=8, leading=10, textColor=TINTA,
)
celda_plex = ParagraphStyle(
    "celda_plex", fontName="Plex", fontSize=8.3, leading=10.6, textColor=TEXTO,
)
destacado = ParagraphStyle(
    "destacado", fontName="Garamond-It", fontSize=14, leading=19,
    textColor=TINTA,
)
guion = ParagraphStyle(
    "guion", parent=cuerpo, fontSize=11.5, leading=16, spaceAfter=0,
)
referencia = ParagraphStyle(
    "referencia", fontName="Garamond", fontSize=10, leading=13,
    textColor=TEXTO, leftIndent=14, firstLineIndent=-14, spaceAfter=3,
)

ANCHO = A4[0] - 2 * 2.2 * cm


def P(texto, estilo=cuerpo):
    return Paragraph(texto, estilo)


def seccion(numero, texto, color=TINTA):
    if not numero:
        return P(texto, h1)
    return P(f'<font color="{color.hexval()}">{numero}</font>&nbsp;&nbsp;{texto}', h1)


def vinetas(items, estilo=cuerpo, color=TINTA):
    return ListFlowable(
        [ListItem(P(t, estilo), leftIndent=16) for t in items],
        bulletType="bullet", start="•", bulletFontName="Garamond",
        bulletFontSize=11, bulletColor=color, leftIndent=16, spaceAfter=6,
    )


def caja(contenido, fondo=TINTE, borde=None, relleno=12):
    t = Table([[contenido]], colWidths=[ANCHO])
    estilo = [
        ("BACKGROUND", (0, 0), (-1, -1), fondo),
        ("LEFTPADDING", (0, 0), (-1, -1), relleno + 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), relleno + 2),
        ("TOPPADDING", (0, 0), (-1, -1), relleno),
        ("BOTTOMPADDING", (0, 0), (-1, -1), relleno),
    ]
    if borde is not None:
        estilo.append(("LINEBEFORE", (0, 0), (0, -1), 3, borde))
    t.setStyle(TableStyle(estilo))
    return t


def tabla(filas, anchos, cabecera_fondo=TINTE, zebra=True):
    datos = [[P(c, celda_cab) for c in filas[0]]]
    for fila in filas[1:]:
        datos.append([c if isinstance(c, Flowable) else P(c, celda) for c in fila])
    t = Table(datos, colWidths=[a * ANCHO for a in anchos], repeatRows=1)
    estilo = [
        ("BACKGROUND", (0, 0), (-1, 0), cabecera_fondo),
        ("LINEBELOW", (0, 0), (-1, 0), 0.8, TINTA),
        ("LINEBELOW", (0, 1), (-1, -1), 0.4, REGLA),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    t.setStyle(TableStyle(estilo))
    return t


# ------------------------------------------------------------------ figuras
class Toro(Flowable):
    """Toro con los dos cortes cerrados a y b de Riemann."""

    def __init__(self, ancho=ANCHO, alto=150):
        super().__init__()
        self.width, self.height = ancho, alto

    def draw(self):
        c = self.canv
        cx, cy = self.width * 0.36, self.height / 2 + 2
        c.setLineCap(1)
        # superficie
        c.setFillColor(AZUL_CLARO)
        c.setStrokeColor(TINTA)
        c.setLineWidth(1.2)
        c.ellipse(cx - 130, cy - 62, cx + 130, cy + 62, stroke=1, fill=1)
        # agujero: «sonrisa» y «ceño»
        p = c.beginPath()
        p.moveTo(cx - 58, cy + 8)
        p.curveTo(cx - 24, cy - 22, cx + 24, cy - 22, cx + 58, cy + 8)
        p.curveTo(cx + 30, cy - 2, cx - 30, cy - 2, cx - 58, cy + 8)
        c.setFillColor(PAPEL)
        c.drawPath(p, stroke=0, fill=1)
        p = c.beginPath()
        p.moveTo(cx - 60, cy + 10)
        p.curveTo(cx - 24, cy - 22, cx + 24, cy - 22, cx + 60, cy + 10)
        c.drawPath(p, stroke=1, fill=0)
        p = c.beginPath()
        p.moveTo(cx - 44, cy - 1)
        p.curveTo(cx - 20, cy + 14, cx + 20, cy + 14, cx + 44, cy - 1)
        c.drawPath(p, stroke=1, fill=0)
        # corte b (longitud): rodea el agujero
        c.setStrokeColor(NARANJA_RELLENO)
        c.setLineWidth(2)
        c.ellipse(cx - 96, cy - 40, cx + 96, cy + 40, stroke=1, fill=0)
        # corte a (meridiano): rodea el tubo por delante
        c.setStrokeColor(AZUL)
        c.ellipse(cx - 11, cy - 62, cx + 11, cy - 15, stroke=1, fill=0)
        # rótulos
        c.setFont("Garamond-It", 15)
        c.setFillColor(AZUL)
        c.drawString(cx + 16, cy - 52, "a")
        c.setFillColor(NARANJA)
        c.drawString(cx + 98, cy + 22, "b")
        # leyenda
        x = cx + 158
        c.setFont("Plex-SB", 8.3)
        c.setFillColor(TINTA)
        c.drawString(x, cy + 34, "Toro: género p = 1")
        c.setFont("Plex", 8.3)
        c.setFillColor(TEXTO)
        lineas = [
            "Dos cortes cerrados (2p = 2) lo",
            "transforman en una superficie",
            "simplemente conexa: un rectángulo.",
            "",
            "Deformar el toro no cambia p:",
            "es un invariante topológico.",
        ]
        for i, linea in enumerate(lineas):
            c.drawString(x, cy + 20 - i * 11.5, linea)


class ConjuntoCantor(Flowable):
    """Primeras etapas del conjunto ternario."""

    def __init__(self, ancho=ANCHO, niveles=6):
        super().__init__()
        self.width = ancho
        self.niveles = niveles
        self.height = niveles * 17 + 6

    def draw(self):
        c = self.canv
        x0, largo = 44, self.width - 60
        intervalos = [(0.0, 1.0)]
        for n in range(self.niveles):
            y = self.height - 14 - n * 17
            c.setFont("Plex", 8)
            c.setFillColor(GRIS)
            c.drawString(0, y + 1, f"Etapa {n}")
            c.setFillColor(NARANJA_RELLENO)
            for a, b in intervalos:
                ancho = max((b - a) * largo, 0.6)
                c.rect(x0 + a * largo, y, ancho, 7, stroke=0, fill=1)
            nuevos = []
            for a, b in intervalos:
                t = (b - a) / 3
                nuevos += [(a, a + t), (b - t, b)]
            intervalos = nuevos
        c.setFont("Plex", 7.5)
        c.setFillColor(GRIS)
        c.drawString(x0, -4, "0")
        c.drawRightString(x0 + largo, -4, "1")
        c.drawCentredString(x0 + largo / 3, -4, "1/3")
        c.drawCentredString(x0 + 2 * largo / 3, -4, "2/3")


class Ramas(Flowable):
    """Diagrama: del rigor de Cauchy–Weierstrass a las dos ramas de la topología."""

    def __init__(self, ancho=ANCHO, alto=178):
        super().__init__()
        self.width, self.height = ancho, alto

    def _caja(self, x, y, w, h, fondo, borde, lineas, color_titulo):
        c = self.canv
        c.setFillColor(fondo)
        c.setStrokeColor(borde)
        c.setLineWidth(0.9)
        c.roundRect(x, y, w, h, 4, stroke=1, fill=1)
        total = len(lineas)
        base = y + h / 2 + (total - 1) * 5.4 - 3
        for i, linea in enumerate(lineas):
            if i == 0:
                c.setFont("Plex-SB", 8.2)
                c.setFillColor(color_titulo)
            else:
                c.setFont("Plex", 7.6)
                c.setFillColor(TEXTO)
            c.drawCentredString(x + w / 2, base - i * 10.8, linea)

    def _flecha(self, x1, y1, x2, y2, color):
        c = self.canv
        c.setStrokeColor(color)
        c.setFillColor(color)
        c.setLineWidth(1.1)
        c.line(x1, y1, x2 - 4, y2)
        p = c.beginPath()
        p.moveTo(x2, y2)
        p.lineTo(x2 - 6, y2 + 3)
        p.lineTo(x2 - 6, y2 - 3)
        p.close()
        c.drawPath(p, stroke=0, fill=1)

    def draw(self):
        c = self.canv
        H = self.height
        y_sup, y_inf, h = H - 62, 12, 50
        mid = H / 2
        # columna 0: Cauchy–Weierstrass
        self._caja(0, mid - 36, 92, 72, GRIS_CLARO, GRIS,
                   ["Cauchy · Weierstrass", "límite, continuidad,", "ε–δ, sucesiones de", "Cauchy, acumulación"], TINTA)
        # columnas de cada rama
        cols = [(116, 112), (246, 66), (330, 70), (418, ANCHO - 418)]
        sup = [
            ["Riemann 1851–1857", "superficies, conexión,", "género, variedades"],
            ["Betti", "1871"],
            ["Poincaré", "1895"],
            ["Topología", "algebraica"],
        ]
        inf = [
            ["Cantor 1872–1884", "puntos límite, cerrado,", "perfecto, continuo"],
            ["Fréchet", "1906"],
            ["Hausdorff", "1914"],
            ["Topología", "general"],
        ]
        for (x, w), lin in zip(cols, sup):
            self._caja(x, y_sup, w, h, AZUL_CLARO, AZUL, lin, AZUL)
        for (x, w), lin in zip(cols, inf):
            self._caja(x, y_inf, w, h, NARANJA_CLARO, NARANJA_RELLENO, lin, NARANJA)
        # flechas desde Cauchy–Weierstrass
        self._flecha(92, mid + 10, 116, y_sup + h / 2, AZUL)
        self._flecha(92, mid - 10, 116, y_inf + h / 2, NARANJA_RELLENO)
        for (x, w), (x2, _) in zip(cols[:-1], cols[1:]):
            self._flecha(x + w, y_sup + h / 2, x2, y_sup + h / 2, AZUL)
            self._flecha(x + w, y_inf + h / 2, x2, y_inf + h / 2, NARANJA_RELLENO)
        # convergencia: línea punteada entre ambas ramas, rótulo a su izquierda
        c.setStrokeColor(GRIS)
        c.setDash(2, 2)
        c.setLineWidth(0.8)
        xc = cols[3][0] + cols[3][1] / 2
        c.line(xc, y_sup, xc, y_inf + h)
        c.setDash()
        c.setFont("Plex-SB", 7.6)
        c.setFillColor(TINTA)
        c.drawRightString(xc - 8, mid + 1, "las ramas se entrelazan")
        c.setFont("Plex", 7.6)
        c.setFillColor(GRIS)
        c.drawRightString(xc - 8, mid - 10, "(p. ej., Brouwer, 1911)")


# ------------------------------------------------------------- página y pie
def fondo_pagina(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPEL)
    canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
    canvas.setFont("Plex", 8)
    canvas.setFillColor(GRIS)
    canvas.drawString(2.2 * cm, 1.2 * cm, "Cantor y Riemann · la topología a finales del siglo XIX")
    canvas.drawRightString(A4[0] - 2.2 * cm, 1.2 * cm, str(doc.page))
    canvas.setStrokeColor(REGLA)
    canvas.setLineWidth(0.5)
    canvas.line(2.2 * cm, 1.55 * cm, A4[0] - 2.2 * cm, 1.55 * cm)
    canvas.restoreState()


# ---------------------------------------------------------------- contenido
def contenido():
    h = []
    h.append(P("HISTORIA DE LA TOPOLOGÍA · SIGLO XIX", antetitulo))
    h.append(P("Cantor y Riemann: la forma y la textura del espacio", titulo))
    h.append(P("Sus aportes a la evolución de la topología a finales del siglo XIX", subtitulo))

    h.append(caja([
        P("RESUMEN", etiqueta),
        P("Durante el siglo XIX el análisis matemático ganó rigor gracias a Cauchy y Weierstrass, "
          "que precisaron qué significan límite, continuidad y convergencia. Sobre esa base, "
          "Bernhard Riemann (1826–1866) y Georg Cantor (1845–1918) abrieron dos caminos que "
          "confluirían en la topología moderna. Riemann estudió la <b>forma global</b> de superficies "
          "y espacios —cómo están conectados, cuántos «agujeros» tienen— y mostró que esas "
          "propiedades, que no dependen de medir distancias, gobiernan el comportamiento de las "
          "funciones. Cantor, al estudiar conjuntos de puntos de la recta, creó el vocabulario de la "
          "<b>estructura fina</b> del espacio: punto límite, conjunto derivado, cerrado, perfecto, "
          "denso; y con su correspondencia entre la recta y el plano obligó a preguntarse qué "
          "propiedades del espacio son realmente invariantes. Este documento resume esos aportes, "
          "su recepción a finales del siglo XIX y los matices necesarios para no exagerarlos.",
          ParagraphStyle("r", parent=cuerpo, spaceAfter=0)),
    ]))
    h.append(Spacer(1, 12))
    h.append(caja(P("Riemann preguntó por la forma del espacio; Cantor, por sus puntos. "
                    "La topología del siglo XX nació de reunir ambas preguntas.", destacado),
                  fondo=PAPEL, borde=AZUL, relleno=6))

    # 1 ------------------------------------------------------------------
    h.append(seccion("1", "Punto de partida: el rigor de Cauchy y Weierstrass", GRIS))
    h.append(P(
        "Cuando Riemann y Cantor comienzan a trabajar, el análisis ya dispone de un lenguaje preciso. "
        "Augustin-Louis Cauchy, en su <i>Cours d’analyse</i> (1821), definió límite y continuidad y "
        "formuló el criterio de convergencia que hoy lleva su nombre (anticipado por Bernard Bolzano "
        "en 1817). En 1825 demostró su teorema integral para funciones de variable compleja: si una "
        "función es holomorfa en la región comprendida entre dos caminos con los mismos extremos, la "
        "integral a lo largo de ambos es la misma. Karl Weierstrass, en sus lecciones de Berlín a partir "
        "de 1856, llevó ese rigor al lenguaje ε–δ, a la convergencia uniforme y al teorema de "
        "Bolzano–Weierstrass: todo conjunto infinito y acotado de números reales tiene al menos un "
        "punto de acumulación."))
    h.append(P(
        "Ese rigor, sin embargo, trabajaba sobre un escenario que se daba por sentado: la recta real o "
        "el plano. Quedaban preguntas abiertas. ¿Qué ocurre con el teorema de Cauchy cuando la región "
        "tiene «agujeros»? ¿Qué es exactamente un conjunto de puntos y cuándo merece llamarse "
        "«continuo»? Riemann y Cantor respondieron desde dos extremos: la forma global y la "
        "estructura fina. Se expone primero a Riemann por orden cronológico."))

    # 2 ------------------------------------------------------------------
    h.append(seccion("2", "Riemann: la forma global del espacio", AZUL))
    h.append(P("2.1 Superficies de Riemann (1851)", h2))
    h.append(P(
        "En su tesis doctoral de Gotinga, <i>Grundlagen für eine allgemeine Theorie der Functionen "
        "einer veränderlichen complexen Grösse</i> (1851), dirigida por Gauss, Riemann propuso "
        "representar una función «multivaluada» —como √z o log z— sobre una superficie formada por "
        "varias hojas superpuestas al plano, unidas a lo largo de líneas que parten de puntos de "
        "ramificación. Sobre esa superficie la función pasa a ser univaluada. Lo decisivo para la "
        "topología es que las propiedades relevantes de la superficie no son métricas: importa cómo "
        "están conectadas sus partes. Riemann distinguió regiones <b>simplemente conexas</b> de "
        "regiones <b>múltiplemente conexas</b> y usó cortes transversales (<i>Querschnitte</i>) para "
        "reducir las segundas a las primeras."))
    h.append(P("2.2 Variedades de n dimensiones (1854)", h2))
    h.append(P(
        "En su lección de habilitación del 10 de junio de 1854, <i>Über die Hypothesen, welche der "
        "Geometrie zu Grunde liegen</i>, Riemann introdujo el concepto de <b>variedad</b> "
        "(<i>Mannigfaltigkeit</i>) «n veces extendida» y separó dos niveles de estudio: las relaciones "
        "de extensión o de región —cómo se ubican y conectan las partes, sin medir— y las relaciones "
        "métricas, que exigen fijar una manera de medir distancias. Esa separación anticipa la "
        "distinción entre topología y geometría diferencial. La lección solo se publicó tras su muerte, "
        "editada por Dedekind en las <i>Abhandlungen</i> de Gotinga (volumen fechado en 1867, aparecido "
        "en 1868); desde entonces empezó a influir."))
    h.append(P("2.3 Conexión y género: un invariante numérico (1857)", h2))
    h.append(P(
        "En <i>Theorie der Abel’schen Functionen</i> (<i>Journal für die reine und angewandte "
        "Mathematik</i>, 1857) Riemann dedicó una sección a «teoremas de <i>analysis situs</i>», la "
        "expresión leibniziana para lo que hoy llamamos topología. Allí asigna a cada superficie un "
        "<b>orden de conexión</b>, fijado por el número de cortes necesarios para volverla simplemente "
        "conexa: una superficie cerrada con p «asas» requiere 2p cortes. Ese número p —al que Clebsch "
        "llamaría <b>género</b> en 1865— es un invariante: no cambia al deformar la superficie de forma "
        "continua. Y a la vez controla el análisis, pues coincide con el número de integrales abelianas "
        "de primera especie linealmente independientes. Fue uno de los primeros casos, y el más "
        "influyente, en que un número de naturaleza topológica gobernaba un problema del análisis."))
    h.append(KeepTogether([
        Toro(),
        P("Figura 1. Idea de Riemann aplicada al toro: los cortes cerrados <i>a</i> y <i>b</i> "
          "bastan para «desarmarlo» en una pieza simplemente conexa. El número de cortes (2p) no "
          "depende de la forma concreta de la superficie, solo de su conexión.", pie),
    ]))
    h.append(P("2.4 Recepción a finales del siglo XIX", h2))
    h.append(P(
        "Riemann murió en 1866, pero sus ideas topológicas maduraron en las décadas siguientes. "
        "Enrico Betti, que conversó con él en Pisa en 1863 sobre la conexión de los espacios, "
        "generalizó los números de conexión a espacios de cualquier dimensión (1871). Henri Poincaré, "
        "en <i>Analysis Situs</i> (1895) y sus complementos (1899–1904), convirtió esas ideas en una "
        "teoría: llamó «números de Betti» a esos invariantes, introdujo la homología y el grupo "
        "fundamental, y fundó lo que hoy es la topología algebraica. En paralelo, Weierstrass objetó en "
        "1870 el uso que Riemann hacía del principio de Dirichlet, lo que obligó a buscar "
        "demostraciones más sólidas; Hilbert lo rehabilitó en 1900."))

    # 3 ------------------------------------------------------------------
    h.append(seccion("3", "Cantor: la estructura fina del espacio", NARANJA))
    h.append(P("3.1 De las series trigonométricas a los puntos límite (1870–1872)", h2))
    h.append(P(
        "Cantor se doctoró en Berlín (1867), donde fue alumno de Weierstrass, Kummer y Kronecker. Ya "
        "en Halle, su colega Eduard Heine le planteó un problema: si una función se representa mediante "
        "una serie trigonométrica, ¿esa representación es única? Cantor lo demostró en 1870 para series "
        "que convergen en todos los puntos, apoyándose en resultados de la memoria de Riemann sobre "
        "series trigonométricas (1854, publicada en 1867). Luego quiso admitir excepciones, puntos "
        "donde no se exige convergencia. En 1872 (<i>Mathematische Annalen</i>, vol. 5) mostró que la "
        "unicidad se mantiene aun con infinitos puntos excepcionales, siempre que su conjunto P cumpla "
        "una condición precisa. Para formularla definió:"))
    h.append(vinetas([
        "<b>Punto límite</b> de P: un punto tal que todo entorno suyo contiene infinitos puntos de P "
        "(la idea de punto de acumulación de Bolzano–Weierstrass, ahora aplicada a conjuntos arbitrarios).",
        "<b>Conjunto derivado</b> P′: el conjunto de los puntos límite de P; al iterar, P″, P‴, …, "
        "P<super>(n)</super>.",
        "La condición: que algún derivado P<super>(n)</super> sea vacío.",
    ], color=NARANJA))
    h.append(P(
        "En el mismo artículo construyó los números reales a partir de «series fundamentales» de "
        "racionales, las que hoy llamamos <b>sucesiones de Cauchy</b>. Aquí la herencia de Cauchy y "
        "Weierstrass se convierte, de manera explícita, en una teoría de conjuntos de puntos."))
    h.append(P("3.2 Tamaños del infinito y el problema de la dimensión (1874–1878)", h2))
    h.append(P(
        "En 1874 Cantor probó que los números algebraicos pueden ponerse en correspondencia con los "
        "naturales (son numerables) mientras que los reales no. En 1877 fue más lejos: halló una "
        "correspondencia biunívoca entre los puntos de un segmento y los de un cuadrado —y, en general, "
        "de un espacio de n dimensiones—. «<i>Je le vois, mais je ne le crois pas</i>» («lo veo, pero no "
        "lo creo»), escribió a Dedekind el 29 de junio de 1877; lo publicó en 1878 (<i>Ein Beitrag zur "
        "Mannigfaltigkeitslehre</i>). Si la cantidad de puntos no distingue una recta de un plano, ¿qué "
        "es la dimensión?"))
    h.append(P(
        "Dedekind respondió de inmediato que la correspondencia de Cantor era necesariamente "
        "discontinua, y que la dimensión debía conservarse bajo correspondencias biunívocas "
        "<i>continuas</i>. Queda así planteada una pregunta típicamente topológica: qué propiedades se "
        "conservan por transformaciones continuas con inversa continua, lo que hoy llamamos "
        "homeomorfismos. Hubo pruebas parciales o defectuosas (Lüroth, Thomae, Netto, 1878–1879); la "
        "curva de Peano (1890) mostró que una aplicación continua puede llenar un cuadrado; y la "
        "invariancia de la dimensión solo se demostró en general con Brouwer, en 1911."))
    h.append(P("3.3 El vocabulario de la topología de conjuntos (1879–1884)", h2))
    h.append(P(
        "En la serie de seis artículos <i>Über unendliche, lineare Punktmannichfaltigkeiten</i> "
        "(<i>Mathematische Annalen</i>, 1879–1884) y en trabajos vecinos, Cantor sistematizó el "
        "estudio de conjuntos de puntos. De allí proceden nociones que siguen en cualquier curso de "
        "topología:"))
    h.append(tabla([
        ["NOCIÓN DE CANTOR", "IDEA", "HOY"],
        ["Denso en un intervalo (<i>überalldicht</i>)", "Hay puntos del conjunto en todo subintervalo", "Conjunto denso"],
        ["Aislado", "Ningún punto del conjunto es punto límite del propio conjunto", "Conjunto discreto"],
        ["Cerrado (<i>abgeschlossen</i>)", "Contiene todos sus puntos límite: P′ está contenido en P", "Conjunto cerrado"],
        ["Denso en sí (<i>in sich dicht</i>)", "Todo punto del conjunto es punto límite: P está contenido en P′", "Sin puntos aislados"],
        ["Perfecto (<i>perfekt</i>)", "Cerrado y denso en sí: P = P′", "Conjunto perfecto"],
        ["Derivados transfinitos", "P′, P″, …, P<super>(ω)</super>, P<super>(ω+1)</super>, …", "Ordinales transfinitos"],
    ], [0.32, 0.46, 0.22]))
    h.append(Spacer(1, 8))
    h.append(P(
        "Iterar la derivación más allá de lo finito llevó a Cantor a los números ordinales "
        "transfinitos. Y, junto con Ivar Bendixson (1883–1884), obtuvo un teorema de estructura: todo "
        "conjunto cerrado de la recta (o de R<super>n</super>) es la unión de un conjunto perfecto y "
        "de un conjunto numerable (teorema de Cantor–Bendixson)."))
    h.append(P("3.4 ¿Qué es un continuo? El conjunto ternario (1883)", h2))
    h.append(P(
        "En <i>Grundlagen einer allgemeinen Mannichfaltigkeitslehre</i> (1883) Cantor intentó definir "
        "el continuo solo con conceptos de conjuntos, sin apelar a la intuición del tiempo o del "
        "espacio: un <b>continuo</b> es un conjunto <b>perfecto</b> y <b>conexo</b>. Para mostrar que "
        "«perfecto» no basta presentó, en una nota, el hoy llamado conjunto de Cantor: se parte de "
        "[0, 1], se quita el tercio central abierto, luego el tercio central de cada pedazo restante, y "
        "así indefinidamente. Lo que queda es perfecto y no numerable, pero no contiene ningún "
        "intervalo: es «polvo» de puntos."))
    h.append(KeepTogether([
        Spacer(1, 4),
        ConjuntoCantor(),
        Spacer(1, 6),
        P("Figura 2. Primeras etapas del conjunto ternario. En el límite quedan infinitos puntos "
          "—tantos como en [0, 1]— sin que sobreviva un solo intervalo.", pie),
    ]))
    h.append(P(
        "Su noción de conexión —para cada par de puntos y cada ε &gt; 0 existe una cadena finita de "
        "puntos del conjunto con saltos menores que ε— no coincide en general con la moderna, pero sí "
        "para conjuntos cerrados y acotados."))
    h.append(P("3.5 Recepción: hacia la topología general", h2))
    h.append(P(
        "El lenguaje de Cantor fue adoptado con rapidez. Camille Jordan lo usó en su <i>Cours "
        "d’analyse</i> (1887; 2.ª ed., 1893), donde enunció el teorema de la curva cerrada; Émile Borel "
        "(1895) y René Baire (1899) lo aplicaron al análisis; Arthur Schoenflies publicó en 1900 un "
        "extenso informe sobre la teoría de conjuntos de puntos. Maurice Fréchet (1906) llevó las "
        "nociones de punto límite y compacidad a espacios cuyos elementos no son números (espacios "
        "métricos), y Felix Hausdorff, en <i>Grundzüge der Mengenlehre</i> (1914), definió los "
        "espacios topológicos mediante axiomas de entornos. Es la línea que conduce a la topología "
        "general o conjuntista."))

    # 4 ------------------------------------------------------------------
    h.append(seccion("4", "Dos tradiciones que convergen"))
    h.append(tabla([
        ["", "RIEMANN", "CANTOR"],
        ["<b>Pregunta</b>", "¿Cómo es el espacio en conjunto?", "¿De qué está hecho el espacio, punto a punto?"],
        ["<b>Objeto</b>", "Superficies y variedades", "Conjuntos de puntos de la recta y de R<super>n</super>"],
        ["<b>Conceptos</b>", "Conexión, cortes, género, variedad n-dimensional",
         "Punto límite, derivado, cerrado, perfecto, denso, continuo"],
        ["<b>Obras clave</b>", "1851, 1854, 1857", "1872, 1874, 1878, 1879–1884, 1883"],
        ["<b>Herencia de Cauchy–Weierstrass</b>", "Teorema integral de Cauchy llevado a superficies con agujeros",
         "Sucesiones de Cauchy; punto de acumulación de Bolzano–Weierstrass"],
        ["<b>Herederos</b>", "Betti (1871), Poincaré (1895)", "Jordan, Borel, Fréchet (1906), Hausdorff (1914)"],
        ["<b>Rama que inaugura</b>", "Topología algebraica (y geometría diferencial)", "Topología general o conjuntista"],
    ], [0.24, 0.38, 0.38]))
    h.append(Spacer(1, 12))
    h.append(KeepTogether([
        Ramas(),
        P("Figura 3. Esquema de las dos ramas. Es una simplificación didáctica: las ramas se "
          "entrelazaron pronto y hubo muchos otros actores (véase la sección 6).", pie),
    ]))

    # 5 ------------------------------------------------------------------
    h.append(seccion("5", "Cronología"))
    crono = [
        ["AÑO", "AUTOR", "HECHO", "IMPORTANCIA PARA LA TOPOLOGÍA"],
        ["1821", "Cauchy", "<i>Cours d’analyse</i>", "Límite y continuidad definidos con precisión"],
        ["1825", "Cauchy", "Teorema integral", "La integral depende de la región: germen de la idea de conexión"],
        ["1847", "Listing", "<i>Vorstudien zur Topologie</i>", "Acuña la palabra «topología»"],
        ["1851", "Riemann", "Tesis: superficies de Riemann", "Conexión simple y múltiple; cortes"],
        ["1854", "Riemann", "Lección de habilitación (publ. 1867–68)", "Variedades de n dimensiones"],
        ["1856–", "Weierstrass", "Lecciones en Berlín", "ε–δ, convergencia uniforme, Bolzano–Weierstrass"],
        ["1857", "Riemann", "Funciones abelianas", "Orden de conexión y género: invariante numérico"],
        ["1870", "Weierstrass", "Crítica al principio de Dirichlet", "Exige rigor a los argumentos de Riemann"],
        ["1871", "Betti", "Conexión en cualquier dimensión", "Los futuros «números de Betti»"],
        ["1872", "Cantor", "Puntos límite, derivados, reales", "Nace la topología de conjuntos de puntos"],
        ["1872", "Weierstrass", "Función continua sin derivada", "La intuición geométrica falla"],
        ["1874", "Cantor", "Numerabilidad", "Tamaños del infinito"],
        ["1877–78", "Cantor", "Biyección segmento–cuadrado", "Problema de la invariancia de la dimensión"],
        ["1879–84", "Cantor", "<i>Punktmannichfaltigkeiten</i>", "Cerrado, perfecto, denso; Cantor–Bendixson"],
        ["1883", "Cantor", "<i>Grundlagen</i>; conjunto ternario", "Definición conjuntista de continuo"],
        ["1895", "Poincaré", "<i>Analysis Situs</i>", "Homología y grupo fundamental"],
        ["1906", "Fréchet", "Espacios métricos abstractos", "Topología más allá de los números"],
        ["1911", "Brouwer", "Invariancia de la dimensión", "Responde la pregunta de 1877"],
        ["1914", "Hausdorff", "<i>Grundzüge der Mengenlehre</i>", "Axiomas de espacio topológico"],
    ]
    h.append(tabla(crono, [0.1, 0.14, 0.34, 0.42]))

    # 6 ------------------------------------------------------------------
    h.append(seccion("6", "Matices y cautelas"))
    h.append(vinetas([
        "<b>Cronología.</b> Riemann murió en 1866; sus trabajos topológicos son de 1851–1857. Lo que "
        "pertenece a «finales del siglo XIX» es su publicación póstuma y su recepción (Betti, Klein, "
        "Poincaré). Cantor, en cambio, trabaja de lleno entre 1870 y 1897.",
        "<b>Vocabulario.</b> Ninguno de los dos hablaba de «topología» en el sentido actual. La palabra "
        "la acuñó J. B. Listing (1847); Riemann decía <i>analysis situs</i> y Cantor "
        "<i>Mannigfaltigkeitslehre</i> o teoría de conjuntos de puntos. La topología como disciplina "
        "axiomática se consolida recién con Hausdorff (1914).",
        "<b>El esquema de dos ramas</b> (Riemann → topología algebraica; Cantor → topología general) es "
        "útil para exponer, no una genealogía exacta. Intervinieron muchos otros —Möbius, Listing, "
        "Jordan, Klein, Dedekind, Heine, Peano— y las ramas se entrelazaron pronto: la prueba de "
        "Brouwer de 1911 usa herramientas de ambas.",
        "<b>Rigor.</b> Parte de los argumentos de Riemann descansaba en el principio de Dirichlet, cuya "
        "validez general no estaba probada (Weierstrass, 1870). La clasificación rigurosa de las "
        "superficies llegó mucho después, ya en el siglo XX.",
        "<b>Prioridades.</b> Construcciones parecidas al conjunto ternario aparecen antes en H. J. S. "
        "Smith (1875) y después en Volterra (1881); el aporte de Cantor fue darle un papel teórico "
        "central.",
        "<b>La frase célebre.</b> «Lo veo, pero no lo creo» suele citarse como asombro ante el "
        "resultado; F. Q. Gouvêa (2011) sostiene que expresaba más bien duda sobre la corrección de la "
        "prueba, que Cantor pedía a Dedekind revisar.",
        "<b>Conceptos no idénticos a los actuales.</b> La «conexión» de Cantor no es la moderna: los "
        "números racionales son conexos en su sentido y no en el actual.",
    ]))

    # 7 ------------------------------------------------------------------
    h.append(seccion("7", "Transición para integrar con Cauchy–Weierstrass", GRIS))
    h.append(P(
        "Este bloque está pensado para insertarse al final de la exposición sobre Cauchy y "
        "Weierstrass, o como apertura de la de Riemann y Cantor. Incluye una versión breve para una "
        "diapositiva, un guion oral de alrededor de un minuto y los puentes concretos que justifican "
        "el paso de un tema al otro."))
    h.append(KeepTogether([
        caja([
            P("VERSIÓN BREVE (PARA UNA DIAPOSITIVA)", etiqueta),
            P("«Cauchy y Weierstrass definieron con precisión qué significa acercarse a un punto. "
              "Riemann y Cantor se preguntaron cómo es el espacio en el que uno se acerca».", destacado),
        ], fondo=PAPEL, borde=GRIS, relleno=8),
        Spacer(1, 10),
    ]))
    h.append(caja([
        P("GUION ORAL (≈ 1 MINUTO)", etiqueta),
        P("«Hasta aquí vimos cómo Cauchy y Weierstrass dieron al análisis un lenguaje exacto: límite, "
          "continuidad, convergencia; con Weierstrass, el ε–δ y la idea de punto de acumulación. Pero "
          "todo ese rigor trabajaba sobre un escenario que nadie cuestionaba: la recta y el plano. La "
          "pregunta siguiente era inevitable: ¿cómo es el espacio donde viven esos puntos y esas "
          "funciones? En la segunda mitad del siglo XIX dos matemáticos la atacaron desde extremos "
          "opuestos. Riemann miró la forma global: superficies con agujeros, cómo se conectan, cuántos "
          "cortes hacen falta para desarmarlas. Cantor miró la textura fina: conjuntos de puntos, puntos "
          "límite, conjuntos cerrados y perfectos. Y no es un salto arbitrario: Riemann llevó el teorema "
          "integral de Cauchy a superficies con agujeros, y Cantor fue alumno de Weierstrass en Berlín y "
          "construyó los números reales con sucesiones de Cauchy. Del rigor de Cauchy y Weierstrass "
          "nacen, así, las dos raíces de la topología».", guion),
    ]))
    h.append(Spacer(1, 12))
    h.append(KeepTogether([
        P("Puentes concretos entre ambos temas", h2),
        tabla([
            ["DE CAUCHY–WEIERSTRASS…", "…A RIEMANN–CANTOR"],
            ["Teorema integral de Cauchy (1825)",
             "Riemann: en superficies con agujeros la integral depende de cómo el camino rodea cada "
             "agujero; de ahí la conexión y el género (1851–1857)."],
            ["Sucesiones de Cauchy", "Cantor construye los números reales con «series fundamentales» (1872)."],
            ["Punto de acumulación (Bolzano–Weierstrass)", "Cantor define punto límite y conjunto derivado (1872)."],
            ["Weierstrass como maestro", "Cantor se formó con él en Berlín (doctorado en 1867)."],
            ["Crítica de Weierstrass al principio de Dirichlet (1870)",
             "Obliga a revisar con rigor los argumentos de Riemann."],
            ["Función continua sin derivada de Weierstrass (1872)",
             "Junto con la biyección de Cantor (1877), muestra que la intuición geométrica engaña: hace "
             "falta una teoría precisa del espacio."],
        ], [0.4, 0.6]),
    ]))

    # Referencias ---------------------------------------------------------
    h.append(seccion("", "Referencias"))
    h.append(P("FUENTES PRIMARIAS", etiqueta))
    for r in [
        "Riemann, B. (1851). <i>Grundlagen für eine allgemeine Theorie der Functionen einer veränderlichen complexen Grösse</i>. Tesis doctoral, Gotinga.",
        "Riemann, B. (1857). Theorie der Abel’schen Functionen. <i>Journal für die reine und angewandte Mathematik</i>, 54, 115–155.",
        "Riemann, B. (1868). Über die Hypothesen, welche der Geometrie zu Grunde liegen. <i>Abhandlungen der Königlichen Gesellschaft der Wissenschaften zu Göttingen</i>, 13 (lección de 1854).",
        "Cantor, G. (1872). Über die Ausdehnung eines Satzes aus der Theorie der trigonometrischen Reihen. <i>Mathematische Annalen</i>, 5, 123–132.",
        "Cantor, G. (1874). Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen. <i>Journal für die reine und angewandte Mathematik</i>, 77, 258–262.",
        "Cantor, G. (1878). Ein Beitrag zur Mannigfaltigkeitslehre. <i>Journal für die reine und angewandte Mathematik</i>, 84, 242–258.",
        "Cantor, G. (1879–1884). Über unendliche, lineare Punktmannichfaltigkeiten, partes I–VI. <i>Mathematische Annalen</i>.",
        "Cantor, G. (1883). <i>Grundlagen einer allgemeinen Mannichfaltigkeitslehre</i>. Leipzig: Teubner.",
    ]:
        h.append(P(r, referencia))
    h.append(Spacer(1, 6))
    h.append(P("ESTUDIOS HISTÓRICOS", etiqueta))
    for r in [
        "Dauben, J. W. (1979). <i>Georg Cantor: His Mathematics and Philosophy of the Infinite</i>. Harvard University Press.",
        "Ferreirós, J. (1999). <i>Labyrinth of Thought: A History of Set Theory and Its Role in Modern Mathematics</i>. Birkhäuser.",
        "Gouvêa, F. Q. (2011). Was Cantor surprised? <i>The American Mathematical Monthly</i>, 118(3), 198–209.",
        "James, I. M. (ed.) (1999). <i>History of Topology</i>. Elsevier.",
        "Johnson, D. M. (1979, 1981). The problem of the invariance of dimension in the growth of modern topology, partes I y II. <i>Archive for History of Exact Sciences</i>, 20 y 25.",
        "Laugwitz, D. (1999). <i>Bernhard Riemann 1826–1866: Turning Points in the Conception of Mathematics</i>. Birkhäuser.",
        "Moore, G. H. (2008). The emergence of open sets, closed sets, and limit points in analysis and topology. <i>Historia Mathematica</i>, 35(3), 220–241.",
    ]:
        h.append(P(r, referencia))
    return h


def main():
    doc = SimpleDocTemplate(
        str(SALIDA), pagesize=A4,
        leftMargin=2.2 * cm, rightMargin=2.2 * cm,
        topMargin=2.2 * cm, bottomMargin=2.3 * cm,
        title="Cantor y Riemann: la forma y la textura del espacio",
        subject="Aportes de Cantor y Riemann a la evolución de la topología a finales del siglo XIX",
        author="CANTOR-RIEMAN",
        lang="es",
    )
    doc.build(contenido(), onFirstPage=fondo_pagina, onLaterPages=fondo_pagina)
    print(f"PDF generado: {SALIDA}")


if __name__ == "__main__":
    main()
