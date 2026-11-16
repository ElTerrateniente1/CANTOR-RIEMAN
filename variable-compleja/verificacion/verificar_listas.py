#!/usr/bin/env python3
"""Verificación numérica de las respuestas a las seis listas de referencia.

Cada resultado en forma cerrada (obtenido a mano con Cauchy-Riemann, la fórmula
integral de Cauchy o el teorema de los residuos) se compara con una integración
numérica independiente (mpmath). No sustituye a una demostración: detecta
errores de signo, de residuos y de polos mal ubicados.

Uso:  python3 verificar_listas.py
"""
import mpmath as mp

mp.mp.dps = 30
pi, e, I = mp.pi, mp.e, mp.mpc(0, 1)
RESULTADOS = []


def registrar(nombre, exacto, numerico, tol=1e-12):
    err = abs(mp.mpc(exacto) - mp.mpc(numerico))
    ok = err < tol * max(1, abs(mp.mpc(exacto)))
    RESULTADOS.append((nombre, ok))
    print(f"{'OK ' if ok else 'FALLA'} {nombre:<34} exacto={mp.nstr(mp.mpc(exacto), 12):<38} "
          f"numérico={mp.nstr(mp.mpc(numerico), 12):<38} |dif|={mp.nstr(err, 3)}")


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


print("=== Integrales sobre curvas ===")
registrar("C1  z^2, α=cos t", mp.mpf(-1) / 3,
          camino(lambda z: z**2, mp.cos, lambda t: -mp.sin(t), 0, pi / 2))
registrar("C2  1/z, arco 0..π/4", I * pi / 4,
          camino(lambda z: 1 / z, mp.expj, lambda t: I * mp.expj(t), 0, pi / 4))
registrar("C3  Re²z+1, t+i·arctan t", mp.mpf(4) / 3 + I,
          camino(lambda z: mp.re(z)**2 + 1, lambda t: t + I * mp.atan(t),
                 lambda t: 1 + I / (1 + t**2), 0, 1))
registrar("C4  e^{iz}, t²+i|t|", 0,
          camino(lambda z: mp.exp(I * z), lambda t: t**2 + I * abs(t),
                 lambda t: 2 * t + I * mp.sign(t), -1, 1, cortes=(0,)))
registrar("C5  Log z, segmento 1→i", (1 - pi / 2) - I, segmento(mp.log, 1, I))
registrar("C6  conj z, cuarto de círculo", I * pi / 2,
          camino(mp.conj, mp.expj, lambda t: I * mp.expj(t), 0, pi / 2))
registrar("C7  1/(z²+4), semicírc. sup.", -mp.atan(mp.mpf(1) / 2),
          camino(lambda z: 1 / (z**2 + 4), mp.expj, lambda t: I * mp.expj(t), 0, pi))
f8 = lambda z: mp.exp(I * z)
registrar("C8  e^{iz}, triángulo 0,1,i", 0,
          segmento(f8, 0, 1) + segmento(f8, 1, I) + segmento(f8, I, 0))
registrar("C9  z·√z, parábola x=y²", mp.mpf(4) / 5 * 2**mp.mpf(1.25) * mp.sin(5 * pi / 8) * I,
          camino(lambda z: z * mp.sqrt(z), lambda t: t**2 + I * t, lambda t: 2 * t + I, -1, 1,
                 cortes=(0,)))
registrar("C10 Im z+i·Re z, i→1+2i", 1 + 2 * I,
          segmento(lambda z: mp.im(z) + I * mp.re(z), I, 1 + 2 * I))

print("\n=== Fórmula integral de Cauchy ===")
registrar("K1", pi / 2 * mp.cosh(4), circ(lambda z: mp.cos(2 * z) / (z**2 + 4), 2 * I, 2))
registrar("K2", -2 * pi, circ(lambda z: mp.exp(I * z) / (z**2 - I * z), 0, mp.mpf(1) / 2))
registrar("K3", pi * I / 6, circ(lambda z: z / (z**4 + 2 * z**2 - 8), mp.sqrt(2), 1))
registrar("K4", I * mp.sinh(pi), circ(lambda z: mp.sin(z) / (z**2 + pi**2), -pi * I, 1))
registrar("K5", -pi * e * I, circ(lambda z: mp.exp(I * z) / (z + I)**3, -I, 1))
registrar("K6", 2 * pi * I / (mp.log(2) + I * pi / 2)**2,
          circ(lambda z: 1 / (mp.log(z)**2 * (z - 2 * I)), 2 * I, 1))


def semidisco(f, R):
    """Semicircunferencia superior de radio R más el segmento [-R, R] (antihorario)."""
    arco = camino(f, lambda t: R * mp.expj(t), lambda t: I * R * mp.expj(t), 0, pi, cortes=(pi / 4, pi / 2, 3 * pi / 4))
    seg = mp.quad(f, mp.linspace(-R, R, 9))
    return arco + seg


for w in (mp.mpc(1, 0.5), mp.mpc(-0.7, 1.2), mp.mpc(2, -1)):
    etiqueta = f"w={mp.nstr(w, 3)}"
    registrar(f"K7  {etiqueta}", pi * I / w, circ(lambda z: 1 / (z**2 - w**2), w, abs(w)))
    s = 1 if mp.re(w) > 0 else -1
    registrar(f"K8  {etiqueta}", pi * (s + I),
              semidisco(lambda z: (z + w) / (z**2 + w**2), 2 * abs(w)))
    registrar(f"K9  {etiqueta}", s * pi / (2 * w**2),
              semidisco(lambda z: (z + w) / (z**2 + w**2)**2, 2 * abs(w)))
    registrar(f"R7  {etiqueta}", 0, circ(lambda z: 1 / (z**2 - w**2), 0, 2 * abs(w)))
    registrar(f"R8  {etiqueta}", 2 * pi * I, circ(lambda z: (z + w) / (z**2 + w**2), w, 3 * abs(w)))
    registrar(f"R9  {etiqueta}", 0, circ(lambda z: (z + w) / (z**2 + w**2)**2, w, 3 * abs(w)))
registrar("K10", pi / 18, circ(lambda z: 1 / ((z**2 + 4) * (z**2 + 1)**2), I, mp.mpf(1) / 2))

print("\n=== Teorema de los residuos ===")
registrar("R1", pi * I * mp.atan(mp.mpf(1) / 2), circ(lambda z: mp.log(z + 4) / (z**2 + 4), 0, 3))
registrar("R2", -pi * I, circ(lambda z: 1 / (z**3 - z), 1, mp.mpf(3) / 2))
registrar("R3", 2 * pi * I, circ(lambda z: mp.exp(z) / (mp.exp(z) - 1), 0, 1))
registrar("R4", -4 * pi * I, circ(mp.tan, 0, 2, n=32))
registrar("R5", pi * (e - 2), circ(lambda z: mp.exp(I * z) / (z * (z + I)**3), I, 3, n=32))
registrar("R6", pi * I, circ(lambda z: (z + 2) / (z**2 + 4 * z + 7), mp.sqrt(3) * I, 3, n=32))
registrar("R10", pi / 9, circ(lambda z: 1 / ((z**2 + 4) * (z**2 + 1)**2), I, mp.sqrt(3), n=32))

print("\n=== Integrales racionales de senos y cosenos ===")
s, c = mp.sin, mp.cos
q = lambda f, a, b, n=16: mp.quad(f, mp.linspace(a, b, n + 1))
registrar("T1", 2 * pi / mp.sqrt(7), q(lambda x: 1 / (c(x) + s(x) + 3), 0, 2 * pi))
registrar("T2", 4 * pi / mp.sqrt(35), q(lambda x: 1 / (c(x) * s(x) + 3), 0, 2 * pi))
registrar("T3", pi * (mp.sqrt(3) - 1), q(lambda x: s(x / 2)**2 / (c(x) + 2), 0, 2 * pi))
registrar("T4", 4 * pi / (3 * mp.sqrt(3)), q(lambda x: (s(x) * c(x) + 1) / (c(x) + 2)**2, 0, 2 * pi))
registrar("T5", 0, q(lambda x: c(2 * x) / (3 * s(2 * x) - 5), -pi, pi))
registrar("T6", 2 * pi / mp.sqrt(7), q(lambda x: (s(x) * c(x) + 1) / (3 * c(x) + 4), -pi, pi))
registrar("T7", pi / 8, mp.quad(lambda x: s(4 * x)**2 / (4 + 4 * c(4 * x)), [0, pi / 8, pi / 4 - mp.mpf('1e-9')])
          + mp.quad(lambda x: s(4 * x)**2 / (4 + 4 * c(4 * x)), [pi / 4 + mp.mpf('1e-9'), 3 * pi / 8, pi / 2]), tol=1e-8)
registrar("T8", 2 * pi / mp.sqrt(3), q(lambda x: 1 / ((c(x) + s(x))**2 + 1), -pi, pi))
for a in (mp.mpf(2), mp.mpf(-3), mp.mpf('1.25')):
    registrar(f"T9  a={a}", 2 * pi * mp.sign(a) / mp.sqrt(a**2 - 1), q(lambda x: 1 / (a + c(x)), 0, 2 * pi))
    registrar(f"T10 a={a}", 2 * pi / (abs(a) * mp.sqrt(a**2 + 1)), q(lambda x: 1 / (a**2 + c(x)**2), 0, 2 * pi))

print("\n=== Integrandos con singularidades reales (valor principal) ===")
r3 = mp.sqrt(3)
f1 = lambda x: (x + 2) / ((2 - x) * (x**2 + 4 * x + 7))
registrar("S1", -pi * r3 / 19, vp(f1, [2], [(f1, None)]))
f2 = lambda x: x / (x**3 + 1)
registrar("S2", pi / r3, vp(f2, [-1], [(f2, None)]))
f3 = lambda x: c(pi * x) / (x**3 + 1)
registrar("S3", pi / 3 * mp.exp(-r3 * pi / 2), vp(f3, [-1], [(f3, pi)]))
f4 = lambda x: s(pi * x) / (x**3 + 1)
registrar("S4=S5", pi / 3 * (r3 * mp.exp(-r3 * pi / 2) - 1), vp(f4, [-1], [(f4, pi)]), tol=1e-10)
a6 = pi * mp.sqrt(2)
f6 = lambda x: s(a6 * x) / (x**5 + x)
registrar("S6", pi * (1 + mp.exp(-pi)), vp(f6, [0], [(f6, a6)]), tol=1e-10)
f7 = lambda x: (x + 1) / ((x - 2) * (x**2 + 1))
registrar("S7", -pi / 5, vp(f7, [2], [(f7, None)]))
f8 = lambda x: c(5 * x) / (x**2 + 2 * x + 5)
registrar("S8=S9", pi / 2 * mp.exp(-10) * c(5), vp(f8, [], [(f8, 5)], L=4), tol=1e-10)
f10 = lambda x: c(pi * x)**2 / (1 - x**4)
registrar("S10", pi / 4 * (1 + mp.exp(-2 * pi)),
          vp(f10, [-1, 1], [(lambda x: mp.mpf(1) / 2 / (1 - x**4), None),
                            (lambda x: c(2 * pi * x) / 2 / (1 - x**4), 2 * pi)]), tol=1e-10)

print("\n=== Derivación compleja (comprobaciones simbólicas) ===")
import sympy as sp
x, y, a = sp.symbols('x y a', real=True)
z = x + sp.I * y


def cauchy_riemann(u, v):
    return sp.simplify(sp.diff(u, x) - sp.diff(v, y)), sp.simplify(sp.diff(u, y) + sp.diff(v, x))


def lap(u):
    return sp.simplify(sp.diff(u, x, 2) + sp.diff(u, y, 2))


def comprobar(nombre, cond, detalle=""):
    RESULTADOS.append((nombre, bool(cond)))
    print(f"{'OK ' if cond else 'FALLA'} {nombre} {detalle}")


# D1: c=1, b=-a  =>  f=(1-ai)z
u1, v1 = x + a * y, -a * x + y
comprobar("D1  C-R con c=1, b=-a", cauchy_riemann(u1, v1) == (0, 0))
comprobar("D1  f=(1-ai)z y f(1+i)=(1+a)+i(1-a)",
          sp.simplify(sp.expand((1 - a * sp.I) * z) - (u1 + sp.I * v1)) == 0 and
          sp.simplify(sp.expand((1 - a * sp.I) * (1 + sp.I)) - ((1 + a) + sp.I * (1 - a))) == 0)
# D2: cocientes incrementales de sqrt|xy| en 0
t = sp.symbols('t', positive=True)
comprobar("D2  límite por y=x es 1/(1+i) ≠ 0",
          sp.simplify(sp.sqrt(t * t) / (t + sp.I * t) - 1 / (1 + sp.I)) == 0)
# D3: f=(z-i)^2 Re(i z^2) ; Re(i z^2) = -2xy ; df/dz̄ = -i z̄ (z-i)^2
comprobar("D3  Re(i z²) = -2xy", sp.simplify(sp.re(sp.expand(sp.I * z**2)) + 2 * x * y) == 0)
F = sp.expand((z - sp.I)**2 * (-2 * x * y))
dzbar = sp.simplify((sp.diff(F, x) + sp.I * sp.diff(F, y)) / 2)
comprobar("D3  ∂f/∂z̄ = -i z̄ (z-i)²",
          sp.simplify(sp.expand(dzbar - (-sp.I * sp.conjugate(z) * (z - sp.I)**2))) == 0)
dz = sp.simplify((sp.diff(F, x) - sp.I * sp.diff(F, y)) / 2)
comprobar("D3  f'(0)=0 y f'(i)=0", dz.subs({x: 0, y: 0}) == 0 and sp.simplify(dz.subs({x: 0, y: 1})) == 0)
# D5: en x²-y²>0, xy>0 es z²; en x²-y²<0, xy<0 es -z²
comprobar("D5  z² = (x²-y²)+2ixy", sp.expand(z**2 - ((x**2 - y**2) + 2 * sp.I * x * y)) == 0)
# D6
u6, v6 = x / (x**2 + y**2), -y / (x**2 + y**2)
comprobar("D6  u armónica", lap(u6) == 0)
comprobar("D6  v=-y/(x²+y²) conjugada", cauchy_riemann(u6, v6) == (0, 0))
# D7
u7, v7 = sp.log(x**2 + y**2) / 2, sp.atan(y / x)
comprobar("D7  φ(t)=½ ln t, v=arctan(y/x)", cauchy_riemann(u7, v7) == (0, 0))
# D8
u8 = sp.exp((x**2 - y**2) / 2) * sp.cos(x * y)
v8 = sp.exp((x**2 - y**2) / 2) * sp.sin(x * y)
comprobar("D8  f=e^{z²/2} cumple C-R", cauchy_riemann(u8, v8) == (0, 0))
# D9: C-R polares para ln r + iθ
r, th = sp.symbols('r theta', positive=True)
U, V = sp.log(r), th
comprobar("D9  C-R polares", sp.simplify(sp.diff(U, r) - sp.diff(V, th) / r) == 0 and
          sp.simplify(sp.diff(V, r) + sp.diff(U, th) / r) == 0)
# D10: caso de prueba con f = e^z·z³
ff = sp.expand(sp.exp(z) * z**3, complex=True)
uu, vv = sp.re(ff), sp.im(ff)
comprobar("D10 uv armónica (prueba con f=z³e^z)", sp.simplify(lap(uu * vv)) == 0)

fallas = [n for n, ok in RESULTADOS if not ok]
print(f"\n{len(RESULTADOS) - len(fallas)}/{len(RESULTADOS)} comprobaciones correctas")
if fallas:
    print("FALLAS:", fallas)
    raise SystemExit(1)
