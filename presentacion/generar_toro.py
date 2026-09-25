"""Dibuja el toro con sus dos cortes (img/toro.png) para la presentación."""

from pathlib import Path

from PIL import Image, ImageDraw

ESCALA = 4
W, H = 560, 360
FONDO = (255, 255, 255, 255)


def bezier(p0, p1, p2, p3, n=80):
    puntos = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        x = u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]
        puntos.append((x * ESCALA, y * ESCALA))
    return puntos


def elipse(d, cx, cy, rx, ry, **kw):
    d.ellipse([(cx - rx) * ESCALA, (cy - ry) * ESCALA, (cx + rx) * ESCALA, (cy + ry) * ESCALA], **kw)


def main():
    img = Image.new("RGBA", (W * ESCALA, H * ESCALA), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    elipse(d, 280, 180, 256, 126, fill="#E3EBF3", outline="#1F2A36", width=3 * ESCALA)
    agujero = bezier((164, 164), (232, 224), (328, 224), (396, 164)) + \
        bezier((396, 164), (340, 184), (220, 184), (164, 164))
    d.polygon(agujero, fill=FONDO)
    d.line(bezier((160, 160), (232, 224), (328, 224), (400, 160)), fill="#1F2A36",
           width=3 * ESCALA, joint="curve")
    d.line(bezier((192, 182), (240, 152), (320, 152), (368, 182)), fill="#1F2A36",
           width=3 * ESCALA, joint="curve")
    elipse(d, 280, 180, 190, 80, outline="#B5652B", width=6 * ESCALA)
    elipse(d, 280, 257, 22, 47, outline="#2F5D8A", width=6 * ESCALA)
    salida = Path(__file__).resolve().parent / "img" / "toro.png"
    salida.parent.mkdir(exist_ok=True)
    img.resize((W * 2, H * 2), Image.LANCZOS).save(salida)
    print(f"Imagen generada: {salida}")


if __name__ == "__main__":
    main()
