"""Genera los fragmentos LaTeX (tablas y diagramas) que usan los dos PDF.

Uso:  python3 generar_tablas.py   ->  escribe en ../fuente/gen/
"""
import os
from itertools import combinations

from topofin import (S, cerrados, es_topologia, partes, todas_las_topologias)

AQUI = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(AQUI, "..", "fuente", "gen")
os.makedirs(GEN, exist_ok=True)


def tex(A, X=None, nombre="X"):
    if X is not None and frozenset(A) == frozenset(X):
        return nombre
    if not A:
        return r"\varnothing"
    return r"\{" + ",".join(str(x) for x in sorted(A, key=str)) + r"\}"


def orden(F):
    return sorted(F, key=lambda A: (len(A), sorted(map(str, A))))


def tex_fam(F, X=None, nombre="X"):
    return r"\{" + r",\ ".join(tex(A, X, nombre) for A in orden(F)) + r"\}"


def escribe(nombre, contenido):
    with open(os.path.join(GEN, nombre), "w", encoding="utf-8") as fh:
        fh.write(contenido)
    print("  ", nombre)


def tabla_operacion(X, tau, op, nombre="X"):
    """Tabla de doble entrada con A∪B o A∩B para los elementos no triviales de tau."""
    X = frozenset(X)
    medios = [A for A in orden(tau) if A and A != X]
    simb = r"\cup" if op == "u" else r"\cap"
    filas = [r"\begin{tabular}{@{}>{$}c<{$}|" + ">{$}c<{$}" * len(medios) + "@{}}",
             simb + " & " + " & ".join(tex(A, X, nombre) for A in medios) + r"\\ \hline"]
    for A in medios:
        celdas = []
        for B in medios:
            R = (A | B) if op == "u" else (A & B)
            t = tex(R, X, nombre)
            if R not in tau:
                t = r"\cellcolor{malo}\boldsymbol{" + t + "}"
            celdas.append(t)
        filas.append(tex(A, X, nombre) + " & " + " & ".join(celdas) + r"\\")
    filas.append(r"\end{tabular}")
    return "\n".join(filas) + "\n"


f_ = lambda *a: frozenset(a)

# ----------------------------------------------------------- Parte I y II
X = S("abcde")
TI = {
    "I1": {X, S(""), S("a"), S("cd"), S("acd"), S("bcde")},
    "I2": {X, S(""), S("a"), S("cd"), S("acd"), S("bcd")},
    "I3": {X, S(""), S("a"), S("cd"), S("acd"), S("abde")},
    "I4": {X, S(""), S("a"), S("be"), S("abe"), S("bcde")},
}
print("tablas de uniones e intersecciones")
for k, tau in TI.items():
    escribe(f"tab_{k}_u.tex", tabla_operacion(X, tau, "u"))
    escribe(f"tab_{k}_i.tex", tabla_operacion(X, tau, "i"))

X2 = f_(1, 2, 3, 4, 6)
TII = {
    "II1": {X2, f_(), f_(1), f_(1, 2), f_(2, 6), f_(1, 6), f_(2), f_(1, 2, 6), f_(6)},
    "II2": {X2, f_(), f_(2), f_(3), f_(2, 3), f_(2, 4, 6), f_(2, 3, 4, 6)},
}
for k, tau in TII.items():
    escribe(f"tab_{k}_u.tex", tabla_operacion(X2, tau, "u"))
    escribe(f"tab_{k}_i.tex", tabla_operacion(X2, tau, "i"))

X6 = S("abcdef")
t5 = {X6, S(""), S("a"), S("cd"), S("acd"), S("bcdef")}
escribe("tab_III5_u.tex", tabla_operacion(X6, t5, "u"))
escribe("tab_III5_i.tex", tabla_operacion(X6, t5, "i"))

X5 = S("abcde")
t8 = {X5, S(""), S("c"), S("d"), S("cd"), S("de"), S("cde"), S("abc"), S("abcd")}
t9 = {X5, S(""), S("a"), S("c"), S("ac"), S("cd"), S("acd"), S("abc"), S("abcd")}
for k, tau in (("III8", t8), ("III9", t9)):
    assert es_topologia(X5, tau)
    escribe(f"tab_{k}_u.tex", tabla_operacion(X5, tau, "u"))
    escribe(f"tab_{k}_i.tex", tabla_operacion(X5, tau, "i"))

X4 = f_(1, 2, 3, 4)
t1lit = {X4, f_(), f_(2), f_(2, 3), f_(2, 3, 4), f_(3), f_(2, 4), f_(1, 2, 4), f_(1, 2, 3)}
escribe("tab_IV3_u.tex", tabla_operacion(X4, t1lit, "u"))
escribe("tab_IV3_i.tex", tabla_operacion(X4, t1lit, "i"))
Z5 = f_(1, 2, 3, 4, 5)
tZ = {Z5, f_(), f_(1), f_(1, 2), f_(1, 3, 4), f_(1, 2, 3, 4), f_(1, 2, 5)}
escribe("tab_IV4Z_u.tex", tabla_operacion(Z5, tZ, "u", "Z"))
escribe("tab_IV4Z_i.tex", tabla_operacion(Z5, tZ, "i", "Z"))

# ------------------------------------------------- III.1, III.2 y III.3
print("listas de topologías")


def es_cadena(t):
    l = sorted(t, key=len)
    return all(l[i] < l[i + 1] for i in range(len(l) - 1))


def filas_lista(Xs, lista, nombre, pref):
    out = []
    for i, t in enumerate(lista, 1):
        tipo = "cadena" if es_cadena(t) else "no cadena"
        out.append(rf"$\tau_{{{i}}}$ & ${tex_fam(t, Xs, nombre)}$ & ${tex_fam(cerrados(Xs, t), Xs, nombre)}$ & {tipo}\\")
    return "\n".join(out) + "\n"


Xa = f_(2, 4, 6)
c4 = [t for t in todas_las_topologias(Xa) if len(t) == 4]
c4.sort(key=lambda t: (not es_cadena(t), [sorted(A) for A in orden(t)]))
assert len(c4) == 9
escribe("lista_III1.tex", filas_lista(Xa, c4, "X", "t"))

Y = f_(1, 2, 3, 4)
todasY = todas_las_topologias(Y)
assert len(todasY) == 355
y4 = [t for t in todasY if len(t) == 4]
assert len(y4) == 43
# diez elegidas a mano: 6 cadenas de distintos tamaños y 4 complementarias
elegY = [
    {Y, f_(), f_(1), f_(1, 2)}, {Y, f_(), f_(2), f_(2, 3)}, {Y, f_(), f_(3), f_(1, 3, 4)},
    {Y, f_(), f_(4), f_(2, 3, 4)}, {Y, f_(), f_(1, 2), f_(1, 2, 3)}, {Y, f_(), f_(3, 4), f_(1, 3, 4)},
    {Y, f_(), f_(1), f_(2, 3, 4)}, {Y, f_(), f_(2), f_(1, 3, 4)}, {Y, f_(), f_(1, 2), f_(3, 4)},
    {Y, f_(), f_(1, 3), f_(2, 4)},
]
assert all(t in y4 for t in elegY) and len({frozenset(t) for t in elegY}) == 10
escribe("lista_III2.tex", filas_lista(Y, elegY, "Y", "t"))

Z = f_(2, 4, 5, 6)
todasZ = todas_las_topologias(Z)
z5 = [t for t in todasZ if len(t) == 5]
assert len(z5) == 60
elegZ = [
    {Z, f_(), f_(2), f_(2, 4), f_(2, 4, 5)}, {Z, f_(), f_(4), f_(4, 6), f_(4, 5, 6)},
    {Z, f_(), f_(5), f_(2, 5), f_(2, 5, 6)}, {Z, f_(), f_(6), f_(5, 6), f_(4, 5, 6)},
    {Z, f_(), f_(2), f_(4), f_(2, 4)}, {Z, f_(), f_(5), f_(6), f_(5, 6)},
    {Z, f_(), f_(2), f_(4, 5), f_(2, 4, 5)}, {Z, f_(), f_(6), f_(2, 4), f_(2, 4, 6)},
    {Z, f_(), f_(2), f_(2, 4), f_(2, 5, 6)}, {Z, f_(), f_(5, 6), f_(2, 5, 6), f_(4, 5, 6)},
]
assert all(t in z5 for t in elegZ) and len({frozenset(t) for t in elegZ}) == 10
escribe("lista_III3.tex", filas_lista(Z, elegZ, "Z", "t"))

# --------------------------------------------- III.4: las 29 topologías
print("III.4")
Xc = S("abc")
t29 = todas_las_topologias(Xc)
t29.sort(key=lambda t: (len(t), sorted((len(A), sorted(A)) for A in t)))
assert len(t29) == 29


def tipo29(t):
    """Clase de homeomorfismo (hay 9) descrita por la forma de sus abiertos propios."""
    medios = sorted((len(A) for A in t if A and A != Xc))
    cad = es_cadena(t)
    return {
        (): "indiscreta",
        (1,): "un punto abierto",
        (2,): "un par abierto",
        (1, 2): "cadena" if cad else "partición",
        (1, 1, 2): "dos puntos y su unión",
        (1, 2, 2): "un punto y dos pares",
        (1, 1, 2, 2): "dos puntos, dos pares",
        (1, 1, 1, 2, 2, 2): "discreta",
    }[tuple(medios)]


lineas = []
for i, t in enumerate(t29, 1):
    lineas.append(rf"$\tau_{{{i}}}$ & ${tex_fam(t, Xc)}$ & {len(t)} & {tipo29(t)}\\")
escribe("lista_III4.tex", "\n".join(lineas) + "\n")

# matriz de comparabilidad
n = len(t29)
cab = " & ".join(rf"\rotatebox{{90}}{{$\tau_{{{j}}}$}}" for j in range(1, n + 1))
filas = [r"\begin{tabular}{@{}r|" + "c" * n + "@{}}", " & " + cab + r"\\ \hline"]
comp = 0
for i, s in enumerate(t29, 1):
    celdas = []
    for j, t in enumerate(t29, 1):
        if i == j:
            celdas.append(r"\cellcolor{gray!25}$=$")
        elif s < t:
            celdas.append(r"\cellcolor{bueno}$\subset$")
        elif s > t:
            celdas.append(r"\cellcolor{bueno2}$\supset$")
        else:
            celdas.append(r"$\cdot$")
        if i < j and (s < t or s > t):
            comp += 1
    filas.append(rf"$\tau_{{{i}}}$ & " + " & ".join(celdas) + r"\\")
filas.append(r"\end{tabular}")
escribe("matriz_III4.tex", "\n".join(filas) + "\n")
total = n * (n - 1) // 2
escribe("conteo_III4.tex", rf"\newcommand{{\paresTotal}}{{{total}}}\newcommand{{\paresComp}}{{{comp}}}"
        rf"\newcommand{{\paresNoComp}}{{{total - comp}}}" + "\n")
print("   pares", total, "comparables", comp)

# diagrama de Hasse (relaciones de cubrimiento)
cubre = []
for i, s in enumerate(t29):
    for j, t in enumerate(t29):
        if s < t and not any(s < u < t for u in t29):
            cubre.append((i + 1, j + 1))
niveles = {}
for i, t in enumerate(t29, 1):
    niveles.setdefault(len(t), []).append(i)
ys = {2: 0, 3: 2.3, 4: 4.9, 5: 7.5, 6: 10.1, 8: 12.4}
pos = {}
ANCHO = 15.5
for k, idx in niveles.items():
    m = len(idx)
    for r, i in enumerate(idx):
        x = 0 if m == 1 else -ANCHO / 2 + r * ANCHO / (m - 1)
        pos[i] = (x, ys[k])
tk = [r"\begin{tikzpicture}[x=1cm,y=1cm,every node/.style={font=\scriptsize}]"]
for (i, j) in cubre:
    tk.append(rf"\draw[hasse] ({pos[i][0]:.2f},{pos[i][1]:.2f}) -- ({pos[j][0]:.2f},{pos[j][1]:.2f});")
for i, (x, y) in pos.items():
    tk.append(rf"\node[nodoh] at ({x:.2f},{y:.2f}) {{$\tau_{{{i}}}$}};")
for k, y in ys.items():
    tk.append(rf"\node[anchor=east,font=\scriptsize\itshape,text=black!60] at ({-ANCHO / 2 - 0.7:.2f},{y:.2f}) {{{k} abiertos}};")
tk.append(r"\end{tikzpicture}")
escribe("hasse_III4.tex", "\n".join(tk) + "\n")
print("   aristas de cubrimiento:", len(cubre))
print("   comparables por nivel:", {k: len(v) for k, v in niveles.items()})
