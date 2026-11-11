"""Herramientas para espacios topológicos finitos.

Se usan para comprobar por computadora (fuerza bruta) todas las respuestas del
Taller 2 de Topología. Cada conjunto es un ``frozenset`` y cada topología un
``set`` de ``frozenset``.
"""
from itertools import combinations, permutations, product


def fs(*elems):
    return frozenset(elems)


def S(texto):
    """'acd' -> frozenset({'a','c','d'});  '' -> vacío."""
    return frozenset(texto)


def partes(X):
    X = sorted(X, key=str)
    return [frozenset(c) for r in range(len(X) + 1) for c in combinations(X, r)]


def fmt(A, universo=None, nombre="X"):
    """Escribe un conjunto en notación de llaves."""
    if universo is not None and frozenset(A) == frozenset(universo):
        return nombre
    if not A:
        return "∅"
    return "{" + ",".join(str(x) for x in sorted(A, key=str)) + "}"


def fmt_fam(F, universo=None, nombre="X"):
    orden = sorted(F, key=lambda A: (len(A), sorted(map(str, A))))
    return "{" + ", ".join(fmt(A, universo, nombre) for A in orden) + "}"


# ---------------------------------------------------------------- axiomas
def fallos_topologia(X, tau):
    """Lista de testigos de por qué ``tau`` NO es topología sobre X (vacía si lo es).

    En un conjunto finito basta comprobar uniones e intersecciones de dos en dos.
    """
    X = frozenset(X)
    tau = set(tau)
    fallos = []
    if frozenset() not in tau:
        fallos.append(("falta", "∅"))
    if X not in tau:
        fallos.append(("falta", "X"))
    for A, B in combinations(sorted(tau, key=lambda s: (len(s), sorted(map(str, s)))), 2):
        if A | B not in tau:
            fallos.append(("union", A, B, A | B))
        if A & B not in tau:
            fallos.append(("interseccion", A, B, A & B))
    return fallos


def es_topologia(X, tau):
    return not fallos_topologia(X, tau)


# ------------------------------------------------------------- operadores
def cerrados(X, tau):
    X = frozenset(X)
    return {X - U for U in tau}


def abiertos_de(x, tau):
    return [U for U in tau if x in U]


def derivado(X, tau, A):
    """Conjunto de puntos de acumulación de A."""
    A = frozenset(A)
    return frozenset(x for x in X if all((U - {x}) & A for U in abiertos_de(x, tau)))


def clausura(X, tau, A):
    A = frozenset(A)
    C = frozenset(X)
    for F in cerrados(X, tau):
        if A <= F:
            C &= F
    return C


def interior(X, tau, A):
    A = frozenset(A)
    I = frozenset()
    for U in tau:
        if U <= A:
            I |= U
    return I


def exterior(X, tau, A):
    return interior(X, tau, frozenset(X) - frozenset(A))


def frontera(X, tau, A):
    return clausura(X, tau, A) - interior(X, tau, A)


def relativa(tau, H):
    H = frozenset(H)
    return {U & H for U in tau}


def densos(X, tau):
    X = frozenset(X)
    return [U for U in tau if clausura(X, tau, U) == X]


def abierto_minimo(X, tau, x):
    """Intersección de todos los abiertos que contienen a x (existe por ser X finito)."""
    M = frozenset(X)
    for U in abiertos_de(x, tau):
        M &= U
    return M


def vecindades(X, tau, x):
    """Sistema de vecindades N_x: todos los N con x ∈ U ⊆ N para algún abierto U."""
    return [N for N in partes(X) if any(x in U and U <= N for U in tau)]


# ------------------------------------------------------- bases y subbases
def generada(X, C):
    """Topología generada por la subbase C (intersecciones finitas y luego uniones)."""
    X = frozenset(X)
    base = {X}
    for r in range(1, len(C) + 1):
        for fam in combinations(list(C), r):
            I = X
            for A in fam:
                I &= A
            base.add(I)
    # clausura por uniones: se itera hasta que no aparezcan conjuntos nuevos
    tau = set(base) | {frozenset()}
    cambio = True
    while cambio:
        cambio = False
        for A, B in combinations(list(tau), 2):
            if A | B not in tau:
                tau.add(A | B)
                cambio = True
    return base, tau


def es_base(X, tau, B):
    B = set(B)
    if not B <= set(tau):
        return False
    for U in tau:
        union = frozenset()
        for V in B:
            if V <= U:
                union |= V
        if union != U:
            return False
    return True


# --------------------------------------------------------- enumeraciones
def todas_las_topologias(X):
    """Todas las topologías sobre X (fuerza bruta; pensado para |X| ≤ 4)."""
    X = frozenset(X)
    medios = [A for A in partes(X) if A and A != X]
    res = []
    for r in range(len(medios) + 1):
        for fam in combinations(medios, r):
            tau = set(fam) | {frozenset(), X}
            if es_topologia(X, tau):
                res.append(tau)
    return res


# ------------------------------------------------------------- funciones
def preimagen(f, B):
    return frozenset(x for x in f if f[x] in B)


def imagen(f, A):
    return frozenset(f[x] for x in A)


def continua(f, tauX, tauY):
    return all(preimagen(f, V) in tauX for V in tauY)


def continua_en(f, X, tauX, tauY, p):
    """f es continua en p: para todo abierto V ∋ f(p) hay un abierto U ∋ p con f(U) ⊆ V."""
    for V in tauY:
        if f[p] in V and not any(p in U and imagen(f, U) <= V for U in tauX):
            return False
    return True


def abierta(f, tauX, tauY):
    return all(imagen(f, U) in tauY for U in tauX)


def cerrada(f, X, tauX, Y, tauY):
    cY = cerrados(Y, tauY)
    return all(imagen(f, F) in cY for F in cerrados(X, tauX))


def homeomorfismos(X, tauX, Y, tauY):
    """Todas las biyecciones X -> Y que llevan tauX exactamente sobre tauY."""
    X = sorted(X, key=str)
    Y = sorted(Y, key=str)
    if len(X) != len(Y) or len(tauX) != len(tauY):
        return []
    res = []
    tY = set(tauY)
    for perm in permutations(Y):
        f = dict(zip(X, perm))
        if {imagen(f, U) for U in tauX} == tY:
            res.append(f)
    return res
