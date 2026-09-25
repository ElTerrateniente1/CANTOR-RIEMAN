"""Genera Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pdf y el archivo de
referencias que usa la presentación (referencias_temas_2_3.json).

Uso (desde la raíz del repositorio):
    bash documento/preparar_fuentes.sh   # una sola vez
    python3 documento/generar_pdf_temas_2_3.py
"""

import json
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Flowable, KeepTogether, SimpleDocTemplate, Spacer

from generar_pdf import (
    ANCHO, AZUL, GRIS, NARANJA, PAPEL, REGLA, TINTA, ConjuntoCantor, P, Toro,
    antetitulo, caja, cuerpo, destacado, etiqueta, h2, pie, referencia,
    seccion, subtitulo, tabla, titulo, vinetas,
)
from reportlab.lib import colors

AQUI = Path(__file__).resolve().parent
SALIDA = AQUI / "Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pdf"
SALIDA_REFS = AQUI / "referencias_temas_2_3.json"

VERDE = colors.HexColor("#1E6B66")        # Cauchy–Weierstrass
VERDE_CLARO = colors.HexColor("#E0EEEC")

# ------------------------------------------------------------- referencias
REFS = {
    "cours": ("Wikipedia (en). «Cours d'analyse».",
              "https://en.wikipedia.org/wiki/Cours_d%27analyse"),
    "criterio": ("Wikipedia (en). «Cauchy's convergence test».",
                 "https://en.wikipedia.org/wiki/Cauchy%27s_convergence_test"),
    "integral_rev": ("A historical review of the Cauchy-Riemann equations and the Cauchy Theorem. arXiv:2311.16649.",
                     "https://arxiv.org/abs/2311.16649"),
    "integral_wiki": ("Wikipedia (en). «Cauchy's integral theorem».",
                      "https://en.wikipedia.org/wiki/Cauchy%27s_integral_theorem"),
    "epsdelta": ("Encyclopedia MDPI. «(ε, δ)-Definition of Limit».",
                 "https://encyclopedia.pub/entry/35788"),
    "sinkevich": ("Sinkevich, G. I. «On the history of epsilontics». arXiv:1502.06942.",
                  "https://arxiv.org/abs/1502.06942"),
    "uniforme": ("Wikipedia (en). «Uniform convergence» (sección de historia).",
                 "https://en.wikipedia.org/wiki/Uniform_convergence"),
    "britannica_w": ("Encyclopaedia Britannica. «Karl Weierstrass».",
                     "https://www.britannica.com/biography/Karl-Weierstrass"),
    "bw": ("Wikipedia (en). «Bolzano–Weierstrass theorem».",
           "https://en.wikipedia.org/wiki/Bolzano%E2%80%93Weierstrass_theorem"),
    "quanta": ("Quanta Magazine (2025). «The Jagged, Monstrous Function That Broke Calculus».",
               "https://www.quantamagazine.org/the-jagged-monstrous-function-that-broke-calculus-20250123/"),
    "dirichlet": ("Wikipedia (en). «Dirichlet's principle».",
                  "https://en.wikipedia.org/wiki/Dirichlet%27s_principle"),
    "fantasias": ("«“Algebraic truths” vs “geometric fantasies”: Weierstrass' response to Riemann». arXiv:math/0305022.",
                  "https://arxiv.org/abs/math/0305022"),
    "borovik": ("Borovik, A. y Katz, M. G. (2012). «Who gave you the Cauchy–Weierstrass tale? The dual history of rigorous calculus». Foundations of Science, 17(3), 245–276. arXiv:1108.2885.",
                "https://arxiv.org/abs/1108.2885"),
    "mactutor_r": ("MacTutor History of Mathematics. «Bernhard Riemann» (biografía).",
                   "https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/"),
    "enc_r": ("Encyclopedia.com. «Riemann, Georg Friedrich Bernhard».",
              "https://www.encyclopedia.com/people/science-and-technology/mathematics-biographies/bernhard-riemann"),
    "riemann_1854": ("Riemann, B. (1854). «Über die Hypothesen, welche der Geometrie zu Grunde liegen». Texto en EMIS.",
                     "https://www.emis.de/classics/Riemann/Geom.pdf"),
    "aps": ("APS News (2013). «June 10, 1854: Riemann's classic lecture on curved space».",
            "https://www.aps.org/apsnews/2013/06/riemanns-curved-space"),
    "clebsch": ("Historia Mathematica (2020). «Are the genre and the Geschlecht one and the same number? An inquiry into Alfred Clebsch's Geschlecht».",
                "https://www.sciencedirect.com/science/article/pii/S0315086020300239"),
    "weibel": ("Weibel, C. A. «History of Homological Algebra».",
               "https://faculty.math.illinois.edu/K-theory/0245/"),
    "betti": ("Encyclopaedia Britannica. «Enrico Betti».",
              "https://www.britannica.com/biography/Enrico-Betti"),
    "enc_c": ("Encyclopedia.com. «Cantor, Georg (1845–1918)».",
              "https://www.encyclopedia.com/humanities/encyclopedias-almanacs-transcripts-and-maps/cantor-georg-1845-1918"),
    "mactutor_c": ("MacTutor History of Mathematics. «Georg Cantor» (biografía).",
                   "https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/"),
    "kechris": ("Kechris, A. S. «Set theory and uniqueness for trigonometric series». Caltech.",
                "https://www.pma.caltech.edu/documents/5627/uniqueness.pdf"),
    "cantor_1872": ("Cantor, G. (1872). «Über die Ausdehnung eines Satzes aus der Theorie der trigonometrischen Reihen». Mathematische Annalen, 5, 123–132 (EuDML).",
                    "https://eudml.org/doc/156562"),
    "mathdl": ("MathDL (MAA). «Georg Cantor at the Dawn of Point-Set Topology» (copia en Academia.edu).",
               "https://www.academia.edu/81674037/MathDL_Georg_Cantor_at_the_Dawn_of_Point_Set_Topology"),
    "enc_c2": ("Encyclopedia.com. «Georg Cantor» (construcción de los reales con «series fundamentales»).",
               "https://www.encyclopedia.com/people/science-and-technology/mathematics-biographies/georg-cantor"),
    "cantor_1874": ("Encyclopedia MDPI. «Georg Cantor's First Set Theory Article».",
                    "https://encyclopedia.pub/entry/32557"),
    "gouvea": ("Gouvêa, F. Q. (2011). «Was Cantor surprised?». The American Mathematical Monthly, 118(3).",
               "https://www.nku.edu/~longa/classes/mat115/days/resources/Infinity/AMM-March11_Cantor.pdf"),
    "utrecht": ("«Chapter 1: Sets and the continuum before 1907». Tesis, Universidad de Utrecht.",
                "https://dspace.library.uu.nl/bitstream/handle/1874/90/c1.pdf"),
    "cantor_set": ("«Descriptions of Cantor Sets: A Set-Theoretic Survey and Open Problems». arXiv:2506.13103.",
                   "https://arxiv.org/abs/2506.13103"),
    "euler": ("History of Information. «Leonhard Euler publishes the problem of the Königsberg bridges».",
              "https://historyofinformation.com/detail.php?id=3406"),
    "frechet": ("EBSCO Research Starters. «Fréchet introduces the concept of abstract space».",
                "https://www.ebsco.com/research-starters/history/frechet-introduces-concept-abstract-space"),
    "hausdorff": ("Encyclopaedia Britannica. «Grundzüge der Mengenlehre».",
                  "https://www.britannica.com/topic/Grundzuge-der-Mengenlehre"),
}

ORDEN = []


def c(*claves):
    """Cita numerada, en orden de primera aparición, enlazada a la lista final."""
    numeros = []
    for k in claves:
        if k not in ORDEN:
            ORDEN.append(k)
        numeros.append(ORDEN.index(k) + 1)
    enlaces = ", ".join(f'<a href="#ref{n}">{n}</a>' for n in numeros)
    return f'<super><font color="{GRIS.hexval()}">[{enlaces}]</font></super>'


interpretacion = ParagraphStyle("interp", parent=cuerpo, spaceAfter=0)
ref_compacta = ParagraphStyle("ref_compacta", parent=referencia, fontSize=9.4, leading=11.8, spaceAfter=2)


def lectura(texto, color):
    return caja([P("LECTURA EPISTEMOLÓGICA (INTERPRETACIÓN, NO DATO)", etiqueta),
                 P(texto, interpretacion)], fondo=PAPEL, borde=color, relleno=8)


def ficha(nombre, fechas, color):
    return P(f'<font color="{color.hexval()}">{nombre}</font> '
             f'<font name="Garamond-It" color="{GRIS.hexval()}">({fechas})</font>', h2)


# ------------------------------------------------------------------ figura
class Hoja(Flowable):
    """Hoja de ruta de la presentación: los cinco puntos, con 2 y 3 resaltados."""

    PUNTOS = [
        ("1", "Euler, 1736", "Puentes de", "Königsberg", False),
        ("2", "Siglo XIX", "Cauchy y", "Weierstrass", True),
        ("3", "Fines del XIX", "Riemann y", "Cantor", True),
        ("4", "1906", "Fréchet:", "esp. métricos", False),
        ("5", "1914", "Hausdorff: esp.", "topológicos", False),
    ]

    def __init__(self, ancho=ANCHO, alto=70):
        super().__init__()
        self.width, self.height = ancho, alto

    def draw(self):
        cv = self.canv
        n = len(self.PUNTOS)
        hueco = 14
        w = (self.width - hueco * (n - 1)) / n
        for i, (num, fecha, l1, l2, activo) in enumerate(self.PUNTOS):
            x = i * (w + hueco)
            if activo:
                cv.setFillColor(VERDE if num == "2" else AZUL)
                cv.setStrokeColor(VERDE if num == "2" else AZUL)
            else:
                cv.setFillColor(PAPEL)
                cv.setStrokeColor(REGLA)
            cv.setLineWidth(1)
            cv.roundRect(x, 0, w, self.height, 5, stroke=1, fill=1)
            claro = colors.HexColor("#F3EFE6")
            cv.setFillColor(claro if activo else GRIS)
            cv.setFont("Plex-SB", 8)
            cv.drawString(x + 8, self.height - 15, f"{num} · {fecha}")
            cv.setFillColor(claro if activo else TINTA)
            cv.setFont("Plex-SB" if activo else "Plex", 9.2)
            cv.drawString(x + 8, self.height - 36, l1)
            cv.drawString(x + 8, self.height - 49, l2)
            if i < n - 1:
                cv.setFillColor(GRIS)
                y = self.height / 2
                xa = x + w + 3
                p = cv.beginPath()
                p.moveTo(xa, y + 4)
                p.lineTo(xa + 8, y)
                p.lineTo(xa, y - 4)
                p.close()
                cv.drawPath(p, stroke=0, fill=1)


def fondo_pagina(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPEL)
    canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
    canvas.setFont("Plex", 8)
    canvas.setFillColor(GRIS)
    canvas.drawString(2.2 * cm, 1.2 * cm, "Del límite al espacio · puntos 2 y 3")
    canvas.drawRightString(A4[0] - 2.2 * cm, 1.2 * cm, str(doc.page))
    canvas.setStrokeColor(REGLA)
    canvas.setLineWidth(0.5)
    canvas.line(2.2 * cm, 1.55 * cm, A4[0] - 2.2 * cm, 1.55 * cm)
    canvas.restoreState()


# --------------------------------------------------------------- contenido
def contenido():
    h = []
    h.append(P("GÉNESIS DE LA MATEMÁTICA · PUNTOS 2 Y 3 DE LA PRESENTACIÓN", antetitulo))
    h.append(P("Del límite al espacio", titulo))
    h.append(P("Cauchy y Weierstrass (siglo XIX) · Riemann y Cantor (finales del siglo XIX)", subtitulo))
    h.append(Hoja())
    h.append(P("Figura 1. Lugar de este documento en la presentación: los puntos 2 y 3 enlazan la "
               "intuición de Euler con la abstracción de Fréchet y Hausdorff.", pie))
    h.append(caja(P("Cauchy y Weierstrass precisaron qué significa <i>acercarse</i> a un punto; "
                    "Riemann y Cantor se preguntaron <i>cómo es el espacio</i> en el que uno se acerca.",
                    destacado), fondo=PAPEL, borde=VERDE, relleno=6))
    h.append(Spacer(1, 8))
    h.append(P(
        "<b>Cómo leer este documento.</b> Cada dato histórico lleva un número entre corchetes que "
        "remite a una fuente consultable en línea (lista final, con enlaces). Los recuadros "
        "«Lectura epistemológica» son interpretación didáctica, no datos, y se marcan como tales."))

    # ---------------------------------------------------------- tema 2
    h.append(seccion("2", "Siglo XIX: Cauchy y Weierstrass, el rigor del análisis", VERDE))
    h.append(P(
        "A comienzos del siglo XIX el cálculo funcionaba, pero sus fundamentos descansaban en la "
        "intuición geométrica y en lo que Cauchy llamó «la generalidad del álgebra»" + c("cours") +
        ". El programa de ambos matemáticos fue reemplazar esa intuición por definiciones."))

    h.append(ficha("Augustin-Louis Cauchy", "1789–1857", VERDE))
    h.append(vinetas([
        "<b>Cours d’analyse (1821).</b> Nace de su curso en la École Polytechnique. En el prefacio "
        "declara buscar «todo el rigor que se exige en geometría», sin apoyarse en la generalidad "
        "del álgebra" + c("cours") + ".",
        "<b>Límite.</b> Lo define así: cuando los valores atribuidos sucesivamente a una variable se "
        "aproximan indefinidamente a un valor fijo, hasta diferir de él tan poco como se quiera, ese "
        "valor es «el límite» de los demás. Un <i>infinitésimo</i> es una variable cuyo límite es cero, "
        "y con esa noción formula la continuidad" + c("cours") + ".",
        "<b>Criterio de convergencia (1821).</b> Publicado en el <i>Cours d’analyse</i>; de él proviene "
        "lo que hoy llamamos <i>sucesión de Cauchy</i>" + c("criterio") + ".",
        "<b>Teorema integral (1825).</b> En su memoria sobre integrales entre límites imaginarios: para "
        "una función holomorfa, la integral depende solo de los extremos del camino. Había tratado el "
        "caso de un rectángulo en 1814; la primera prueba completa, sin hipótesis extra, es de Goursat"
        + c("integral_rev", "integral_wiki") + ".",
        "<b>Matiz.</b> Cauchy no dio una definición ε–δ formal, aunque usó ε y δ en algunas pruebas"
        + c("epsdelta") + ". Su teorema de 1821 sobre la continuidad de una suma de funciones continuas "
        "recibió objeciones de Abel en 1826" + c("uniforme") + ".",
    ], color=VERDE))

    h.append(ficha("Karl Weierstrass", "1815–1897", VERDE))
    h.append(vinetas([
        "<b>Berlín, desde 1856.</b> Enseñó en el Gewerbeinstitut y en la Universidad. Publicó poco: "
        "su obra circuló sobre todo a través de sus lecciones" + c("britannica_w") + ".",
        "<b>Aritmetización del análisis.</b> Programa que funda el análisis en un desarrollo riguroso "
        "de los números reales y reduce su dependencia de la geometría" + c("britannica_w") + ".",
        "<b>ε–δ (1861).</b> En sus lecciones de ese año, conservadas en notas de H. A. Schwarz, aparece "
        "la definición de límite en su forma actual; Bolzano la había anticipado en 1817"
        + c("epsdelta", "sinkevich") + ".",
        "<b>Convergencia uniforme.</b> Acuñó el término <i>gleichmäßig konvergent</i> en un trabajo de "
        "1841, publicado en 1894; su maestro Gudermann había observado el fenómeno en 1838"
        + c("uniforme") + ".",
        "<b>Bolzano–Weierstrass.</b> Todo conjunto infinito y acotado de números reales tiene un punto "
        "límite (Bolzano lo había probado en 1817)" + c("bw") + ".",
        "<b>18 de julio de 1872.</b> Presenta ante la Academia de Berlín una función continua que no "
        "es derivable en ningún punto" + c("quanta") + ".",
        "<b>1870.</b> Muestra con un contraejemplo que el principio de Dirichlet, usado por Riemann, no "
        "está garantizado en general" + c("dirichlet", "fantasias") + ".",
    ], color=VERDE))
    h.append(lectura(
        "El rigor se gana cuando la intuición falla. La función de Weierstrass muestra que "
        "«continuo» no implica «liso»: la imagen geométrica ya no basta para decidir qué es verdad. "
        "Una cautela historiográfica: el relato lineal «Cauchy prepara, Weierstrass culmina» es "
        "discutido; Borovik y Katz sostienen que leer a Cauchy «como si ya hubiera leído a "
        "Weierstrass» es anacrónico, porque Cauchy razonaba con infinitésimos" + c("borovik") + ".",
        VERDE))

    # ---------------------------------------------------------- transición
    h.append(seccion("", "Transición al punto 3"))
    h.append(P(
        "Todo ese rigor trabajaba sobre un escenario que se daba por sentado: la recta y el plano. "
        "El paso siguiente fue preguntar por el propio espacio. Hay puentes documentados: Cantor se "
        "formó en Berlín con Weierstrass" + c("enc_c") + " y construyó los números reales con "
        "sucesiones de Cauchy" + c("enc_c2") + ", y Weierstrass exigió rigor a los argumentos de "
        "Riemann" + c("fantasias") + ". Y hay un puente conceptual (interpretación): el teorema "
        "integral de Cauchy depende de la región donde la función es holomorfa" + c("integral_wiki") +
        "; Riemann convirtió la forma de esa región, su conectividad, en objeto de estudio"
        + c("mactutor_r") + "."))

    # ---------------------------------------------------------- punto 3
    h.append(seccion("3", "Finales del siglo XIX: Riemann y Cantor", AZUL))
    h.append(ficha("Bernhard Riemann", "1826–1866", AZUL))
    h.append(vinetas([
        "<b>Tesis doctoral (1851).</b> Escrita en Gotinga bajo la supervisión formal de Gauss. Define las "
        "superficies que llevan su nombre para estudiar funciones de variable compleja, examina la "
        "<i>conectividad</i> de las superficies e introduce así métodos topológicos en la teoría de "
        "funciones" + c("enc_r", "mactutor_r") + ".",
        "<b>Lección de habilitación (10 de junio de 1854).</b> <i>Über die Hypothesen, welche der "
        "Geometrie zu Grunde liegen</i>: introduce la noción de variedad (<i>Mannigfaltigkeit</i>) de "
        "varias dimensiones" + c("riemann_1854", "aps") + ".",
        "<b>Funciones abelianas (1857).</b> Mide la conectividad de una superficie mediante cortes; de "
        "ahí sale el número que Clebsch llamó <i>género</i> en 1865" + c("clebsch") + ". Con Betti "
        "(1871) y Poincaré (1895) esos «números de conexión» se convierten en los números de Betti"
        + c("weibel") + ".",
        "<b>Influencia directa.</b> Sus conversaciones con Betti en Pisa (1863) orientaron el trabajo "
        "topológico de este; Poincaré dio luego el nombre de «números de Betti»" + c("betti") + ".",
        "<b>Matiz cronológico.</b> Riemann murió en 1866: su obra es de mediados de siglo; lo que "
        "pertenece a «finales del siglo XIX» es su recepción (Betti, Poincaré)" + c("mactutor_r", "weibel") + ".",
    ], color=AZUL))
    h.append(KeepTogether([
        Toro(alto=140),
        P("Figura 2. Ilustración didáctica (no tomada de Riemann): en un toro, dos cortes cerrados "
          "bastan para obtener una pieza simplemente conexa. Lo que cuenta es la conexión, no las "
          "distancias.", pie),
    ]))

    h.append(ficha("Georg Cantor", "1845–1918", NARANJA))
    h.append(vinetas([
        "<b>Formación.</b> Estudió en Berlín con Kronecker, Kummer y Weierstrass" + c("enc_c") + ".",
        "<b>El problema de origen (1870).</b> Heine le propuso estudiar si la representación de una "
        "función por una serie trigonométrica es única. Cantor lo probó hacia abril de 1870"
        + c("mactutor_c") + ", usando dos resultados de la memoria de Riemann sobre series "
        "trigonométricas (1854)" + c("kechris") + ".",
        "<b>1872: punto límite y conjunto derivado.</b> Para admitir infinitos puntos excepcionales "
        "define el punto límite de un conjunto P (todo entorno contiene infinitos puntos de P) y el "
        "conjunto derivado P′, luego P″, etc." + c("cantor_1872", "mathdl") + " En el mismo trabajo "
        "construye los números reales con «series fundamentales», hoy llamadas sucesiones de Cauchy"
        + c("enc_c2") + ".",
        "<b>1874.</b> Los números algebraicos reales son numerables; los reales no lo son"
        + c("cantor_1874") + ".",
        "<b>1877–1878: el problema de la dimensión.</b> Encuentra una biyección entre un segmento y un "
        "cuadrado; «<i>Je le vois, mais je ne le crois pas</i>», escribe a Dedekind el 29 de junio de "
        "1877" + c("gouvea") + ". Dedekind responde que la dimensión solo puede conservarse bajo "
        "biyecciones <i>continuas</i>; Brouwer lo demostró en 1911" + c("utrecht") + ".",
        "<b>1879–1884: conjuntos de puntos.</b> En la serie <i>Über unendliche, lineare "
        "Punktmannichfaltigkeiten</i> define el continuo como conjunto perfecto y conexo, y presenta "
        "(1883) el conjunto ternario: perfecto pero sin intervalos. H. J. S. Smith había publicado "
        "una construcción parecida en 1875" + c("cantor_set") + ".",
    ], color=NARANJA))
    h.append(KeepTogether([
        Spacer(1, 4), ConjuntoCantor(niveles=5), Spacer(1, 6),
        P("Figura 3. Primeras etapas del conjunto ternario: se quita siempre el tercio central.", pie),
    ]))
    h.append(lectura(
        "Los conceptos topológicos no nacieron buscando una «topología», sino resolviendo problemas "
        "del análisis: funciones multivaluadas e integrales abelianas en Riemann, unicidad de series "
        "trigonométricas en Cantor. El concepto general (conectividad, conjunto derivado) aparece "
        "primero como herramienta y después se independiza del problema que lo originó. Riemann "
        "mira la forma global del espacio; Cantor, su estructura punto a punto.", AZUL))

    # ---------------------------------------------------------- síntesis
    h.append(seccion("", "Síntesis: qué hizo cada uno"))
    h.append(tabla([
        ["QUIÉN", "QUÉ HIZO (SELECCIÓN)", "POR QUÉ IMPORTA PARA LA TOPOLOGÍA"],
        ["<b>Cauchy</b>", "Límite, infinitésimo y continuidad (1821); criterio de convergencia; teorema integral (1825)",
         "Da el lenguaje de la convergencia y muestra que la integral depende de la región"],
        ["<b>Weierstrass</b>", "ε–δ (1861); convergencia uniforme; Bolzano–Weierstrass; función sin derivada (1872)",
         "Aritmetiza el análisis y separa la verdad de la intuición geométrica"],
        ["<b>Riemann</b>", "Superficies y conectividad (1851); variedades (1854); cortes y género (1857)",
         "Estudia la forma global; raíz de la topología algebraica (Betti, Poincaré)"],
        ["<b>Cantor</b>", "Punto límite y conjunto derivado (1872); numerabilidad (1874); dimensión (1877); continuo (1883)",
         "Crea el vocabulario de la topología de conjuntos que abstraen Fréchet y Hausdorff"],
    ], [0.16, 0.44, 0.40]))

    h.append(seccion("", "Enlace con los puntos 1, 4 y 5"))
    h.append(vinetas([
        "<b>Euler (1736)</b> resolvió el problema de los puentes de Königsberg atendiendo solo a la "
        "conexión, no a las longitudes; su trabajo se cita como la primera publicación sustancial de "
        "topología y teoría de grafos" + c("euler") + ".",
        "<b>Fréchet (1906)</b>, en su tesis <i>Sur quelques points du calcul fonctionnel</i>, introdujo "
        "los espacios métricos abstractos y la noción abstracta de compacidad" + c("frechet") + ".",
        "<b>Hausdorff (1914)</b>, en <i>Grundzüge der Mengenlehre</i>, axiomatizó el espacio "
        "topológico mediante entornos" + c("hausdorff") + ".",
    ]))

    # ---------------------------------------------------------- referencias
    h.append(seccion("", "Fuentes (con enlace)"))
    for n, k in enumerate(ORDEN, start=1):
        texto, url = REFS[k]
        h.append(P(f'<a name="ref{n}"/>[{n}] {texto} '
                   f'<link href="{url}" color="{AZUL.hexval()}">{url}</link>', ref_compacta))
    return h


def main():
    historia = contenido()
    doc = SimpleDocTemplate(
        str(SALIDA), pagesize=A4,
        leftMargin=2.2 * cm, rightMargin=2.2 * cm,
        topMargin=2.2 * cm, bottomMargin=2.3 * cm,
        title="Del límite al espacio: Cauchy, Weierstrass, Riemann y Cantor",
        subject="Puntos 2 y 3: el rigor del análisis y los orígenes de la topología",
        author="CANTOR-RIEMAN",
        lang="es",
    )
    doc.build(historia, onFirstPage=fondo_pagina, onLaterPages=fondo_pagina)
    SALIDA_REFS.write_text(json.dumps(
        [{"n": n, "texto": REFS[k][0], "url": REFS[k][1], "clave": k}
         for n, k in enumerate(ORDEN, start=1)],
        ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"PDF generado: {SALIDA}")
    print(f"Referencias: {SALIDA_REFS}")


if __name__ == "__main__":
    main()
