"""Herramientas numéricas compartidas por los verificadores (mpmath)."""
import mpmath as mp

mp.mp.dps = 30
pi, e, I = mp.pi, mp.e, mp.mpc(0, 1)


def circ(f, c, r, n=16):
    """Integral de f sobre |z-c|=r, sentido antihorario."""
    g = lambda t: f(c + r * mp.expj(t)) * I * r * mp.expj(t)
    return mp.quad(g, mp.linspace(0, 2 * pi, n + 1))


def camino(f, alfa, dalfa, a, b, cortes=()):
    g = lambda t: f(alfa(t)) * dalfa(t)
    return mp.quad(g, [a, *cortes, b])


def segmento(f, z0, z1):
    return camino(f, lambda t: z0 + t * (z1 - z0), lambda t: (z1 - z0), 0, 1)


def vp(f, polos, colas, delta=mp.mpf(1) / 4, L=None):
    """Valor principal de Cauchy sobre toda la recta real.

    f: integrando real;  polos: polos reales simples (ordenados);
    colas: lista de (g, omega) con f = suma de g para |x| grande; omega=None si
    g no oscila (decae al menos como 1/x^2) u omega = frecuencia de g.
    """
    polos = sorted(polos)
    total = mp.mpf(0)
    # vecindades simétricas de cada polo: la suma f(p+t)+f(p-t) es regular
    # (Gauss-Legendre: sus nodos no se acumulan en t=0, donde f(p+t) y f(p-t)
    #  se cancelan y la aritmética pierde todas las cifras)
    for p in polos:
        total += mp.quad(lambda t: f(p + t) + f(p - t), [0, delta], method='gauss-legendre')
    # tramos intermedios
    L = L or (max(abs(polos[0]), abs(polos[-1])) + 2 if polos else 2)
    bordes = [-L] + [x for p in polos for x in (p - delta, p + delta)] + [L]
    for a, b in zip(bordes[0::2], bordes[1::2]):
        total += mp.quad(f, mp.linspace(a, b, 9))
    # colas
    for g, om in colas:
        if om is None:
            total += mp.quad(g, [L, mp.inf]) + mp.quad(g, [-mp.inf, -L])
        else:
            # se traslada el origen a L: quadosc ubica mal los ceros si el
            # intervalo no empieza en 0 y el integrando tiene polos antes de L
            total += mp.quadosc(lambda s: g(L + s), [0, mp.inf], omega=om)
            total += mp.quadosc(lambda s: g(-L - s), [0, mp.inf], omega=om)
    return total
