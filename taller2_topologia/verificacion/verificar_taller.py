"""Comprobación por computadora de todas las respuestas del Taller 2.

Uso:  python3 verificar_taller.py            (imprime el informe completo)
"""
from itertools import combinations

from topofin import (S, abierta, abierto_minimo, cerrada, cerrados, clausura,
                     continua, continua_en, densos, derivado, es_base,
                     es_topologia, exterior, fallos_topologia, fmt, fmt_fam,
                     frontera, generada, homeomorfismos, imagen, interior,
                     partes, preimagen, relativa, todas_las_topologias,
                     vecindades)


def titulo(t):
    print("\n" + "=" * 78 + "\n" + t + "\n" + "=" * 78)


def explica_fallos(X, tau, nombre="X"):
    for f in fallos_topologia(X, tau):
        if f[0] == "falta":
            print("   falta", f[1])
        else:
            op = "∪" if f[0] == "union" else "∩"
            print(f"   {fmt(f[1], X, nombre)} {op} {fmt(f[2], X, nombre)} = {fmt(f[3], X, nombre)}  ∉ τ")


def analiza(X, tau, n="X"):
    print("  cerrados:", fmt_fam(cerrados(X, tau), X, n))


# ============================================================ PARTE I
titulo("PARTE I   X = {a,b,c,d,e}")
X = S("abcde")
T = {
    "τ1": {X, S(""), S("a"), S("cd"), S("acd"), S("bcde")},
    "τ2": {X, S(""), S("a"), S("cd"), S("acd"), S("bcd")},
    "τ3": {X, S(""), S("a"), S("cd"), S("acd"), S("abde")},
    "τ4": {X, S(""), S("a"), S("be"), S("abe"), S("bcde")},
}
G, H, J = S("be"), S("acd"), S("abc")
for nom, tau in T.items():
    ok = es_topologia(X, tau)
    print(f"\n{nom} = {fmt_fam(tau, X)}  ->  {'SÍ' if ok else 'NO'} es topología")
    if not ok:
        explica_fallos(X, tau)
        continue
    print("  a) cerrados          :", fmt_fam(cerrados(X, tau), X))
    print("  b) G' (G={b,e})      :", fmt(derivado(X, tau, G), X))
    for A in ("a", "b", "cd"):
        print(f"  c) clausura {fmt(S(A))}".ljust(24) + ":", fmt(clausura(X, tau, S(A)), X))
    print("  d) τ_H (H={a,c,d})   :", fmt_fam(relativa(tau, H), H, "H"))
    print("  e) abiertos densos   :", ", ".join(fmt(U, X) for U in densos(X, tau)))
    for p in "ce":
        N = vecindades(X, tau, p)
        print(f"  f) N_{p}: abierto mínimo {fmt(abierto_minimo(X, tau, p), X)}; {len(N)} vecindades:",
              fmt_fam(N, X))
    Nc, Ne = set(vecindades(X, tau, "c")), set(vecindades(X, tau, "e"))
    print("     N_c ∩ N_e         :", fmt_fam(Nc & Ne, X))
    print("  g) int J (J={a,b,c}) :", fmt(interior(X, tau, J), X))
    print("  h) clausura J        :", fmt(clausura(X, tau, J), X))
    print("     frontera J        :", fmt(frontera(X, tau, J), X))
    print("     exterior J        :", fmt(exterior(X, tau, J), X))
    print("     J'                :", fmt(derivado(X, tau, J), X))

# =========================================================== PARTE II
titulo("PARTE II   X = {1,2,3,4,6}")
X = frozenset({1, 2, 3, 4, 6})
f_ = lambda *a: frozenset(a)
T = {
    "τ1 (leyendo '{, 2}' como {2})": {X, f_(), f_(1), f_(1, 2), f_(2, 6), f_(1, 6), f_(2), f_(1, 2, 6), f_(6)},
    "τ1 (omitiendo el término ilegible)": {X, f_(), f_(1), f_(1, 2), f_(2, 6), f_(1, 6), f_(1, 2, 6), f_(6)},
    "τ2": {X, f_(), f_(2), f_(3), f_(2, 3), f_(2, 4, 6), f_(2, 3, 4, 6)},
}
L, M, P = f_(1, 4), f_(2, 6), f_(1, 3, 4, 6)
for nom, tau in T.items():
    ok = es_topologia(X, tau)
    print(f"\n{nom} = {fmt_fam(tau, X)}  ->  {'SÍ' if ok else 'NO'} es topología")
    if not ok:
        explica_fallos(X, tau)
        continue
    print("  a) cerrados          :", fmt_fam(cerrados(X, tau), X))
    print("  b) L' (L={1,4})      :", fmt(derivado(X, tau, L), X))
    print("     M' (M={2,6})      :", fmt(derivado(X, tau, M), X))
    for A in (f_(1), f_(1, 3), f_(2, 6)):
        print(f"  c) clausura {fmt(A)}".ljust(24) + ":", fmt(clausura(X, tau, A), X))
    print("  d) τ_P (P={1,3,4,6}) :", fmt_fam(relativa(tau, P), P, "P"))
    for p in (1, 4, 6):
        N = vecindades(X, tau, p)
        print(f"  e) N_{p}: abierto mínimo {fmt(abierto_minimo(X, tau, p), X)}; {len(N)} vecindades:",
              fmt_fam(N, X))
    print("  f) int P             :", fmt(interior(X, tau, P), X))
    LM = L | M
    print("  g) L∪M               :", fmt(LM, X))
    print("     int(L∪M)          :", fmt(interior(X, tau, LM), X))
    print("     clausura(L∪M)     :", fmt(clausura(X, tau, LM), X))
    print("     frontera(L∪M)     :", fmt(frontera(X, tau, LM), X))
    print("     exterior(L∪M)     :", fmt(exterior(X, tau, LM), X))
    print("     (L∪M)'            :", fmt(derivado(X, tau, LM), X))

# ========================================================== PARTE III
titulo("PARTE III.1   topologías de 4 elementos sobre {2,4,6}")
X = frozenset({2, 4, 6})
todas3 = todas_las_topologias(X)
print("total de topologías sobre un conjunto de 3 puntos:", len(todas3))
from collections import Counter
print("por número de abiertos:", sorted(Counter(len(t) for t in todas3).items()))
for t in [t for t in todas3 if len(t) == 4]:
    print("  τ =", fmt_fam(t, X), "   cerrados:", fmt_fam(cerrados(X, t), X))

titulo("PARTE III.2   topologías de 4 elementos sobre {1,2,3,4}")
Y = frozenset({1, 2, 3, 4})
todas4 = todas_las_topologias(Y)
print("total de topologías sobre un conjunto de 4 puntos:", len(todas4))
print("por número de abiertos:", sorted(Counter(len(t) for t in todas4).items()))
c4 = [t for t in todas4 if len(t) == 4]
cad = [t for t in c4 if any(A < B for A in t for B in t if A and B != Y and A != B)]
print("de 4 abiertos:", len(c4), " (cadenas:", len(cad), ", complementarias:", len(c4) - len(cad), ")")

titulo("PARTE III.3   topologías de 5 elementos sobre {2,4,5,6}")
Z = frozenset({2, 4, 5, 6})
todasZ = todas_las_topologias(Z)
c5 = [t for t in todasZ if len(t) == 5]
print("de 5 abiertos:", len(c5))


def es_cadena(t):
    l = sorted(t, key=len)
    return all(l[i] < l[i + 1] for i in range(len(l) - 1))


print("   cadenas:", sum(es_cadena(t) for t in c5), "  no cadenas:", sum(not es_cadena(t) for t in c5))

titulo("PARTE III.4   las 29 topologías sobre {a,b,c} y su comparación")
X = S("abc")
t29 = todas_las_topologias(X)
t29.sort(key=lambda t: (len(t), sorted((len(A), sorted(A)) for A in t)))
for i, t in enumerate(t29, 1):
    print(f"  τ{i:<2} ({len(t)} abiertos) = {fmt_fam(t, X)}")
comp = sum(1 for s, t in combinations(t29, 2) if s <= t or t <= s)
tot = len(t29) * (len(t29) - 1) // 2
print(f"pares: {tot};  comparables: {comp};  no comparables: {tot - comp}")

titulo("PARTE III.5")
X = S("abcdef")
tau = {X, S(""), S("a"), S("cd"), S("acd"), S("bcdef")}
print("es topología:", es_topologia(X, tau))

titulo("PARTE III.8 y III.9   topología generada")
X = S("abcde")
for nom, C in (("8", [S("abc"), S("cd"), S("de")]), ("9", [S("a"), S("abc"), S("cd")])):
    base, tau = generada(X, C)
    print(f"III.{nom}  subbase {fmt_fam(C, X)}")
    print("   base  :", fmt_fam(base, X))
    print("   τ     :", fmt_fam(tau, X), f"({len(tau)} abiertos)")
    print("   es topología:", es_topologia(X, tau), "  la base es base:", es_base(X, tau, base))

titulo("PARTE III.10   sub-bases")
tau1 = {X, S(""), S("a"), S("cd"), S("acd"), S("bcde")}
for C in ([S("a"), S("acd"), S("bcde")], [S("a"), S("cd"), S("bcde")]):
    print("  ", fmt_fam(C, X), "genera τ1 de la Parte I:", generada(X, C)[1] == tau1)
disc = set(partes(X))
for C in ([S(x) for x in "abcde"], [X - S(x) for x in "abcde"]):
    print("  ", fmt_fam(C, X), "genera la discreta:", generada(X, C)[1] == disc)

# =========================================================== PARTE IV
titulo("PARTE IV.1")
X = S("abcd")
tau = {X, S(""), S("a"), S("b"), S("ab"), S("bcd")}
print("τ es topología:", es_topologia(X, tau))
for nom, f in (("lectura principal f(b)=d", dict(a="b", b="d", c="b", d="c")),
               ("lectura alternativa f(b)=c", dict(a="b", b="c", c="b", d="c"))):
    print(" ", nom)
    for V in sorted(tau, key=lambda s: (len(s), sorted(s))):
        pre = preimagen(f, V)
        print(f"     f⁻¹({fmt(V, X)}) = {fmt(pre, X)}  {'∈ τ' if pre in tau else '∉ τ'}")
    print("     continua:", continua(f, tau, tau),
          "| continua en cada punto:", {p: continua_en(f, X, tau, tau, p) for p in "abcd"})

titulo("PARTE IV.3")
X = frozenset({1, 2, 3, 4})
Y = S("abcd")
t1 = {X, f_(), f_(2), f_(2, 3), f_(2, 3, 4), f_(3), f_(2, 4), f_(1, 2, 4), f_(1, 2, 3)}
t2 = {Y, S(""), S("c"), S("cd"), S("abc")}
print("τ1 dada es topología:", es_topologia(X, t1))
explica_fallos(X, t1)
print("τ2 es topología:", es_topologia(Y, t2))
_, t1r = generada(X, list(t1))
print("topología generada por τ1 (τ1*):", fmt_fam(t1r, X), f"({len(t1r)} abiertos)")
print("cerrados de τ1*:", fmt_fam(cerrados(X, t1r), X))
print("cerrados de τ2 :", fmt_fam(cerrados(Y, t2), Y, "Y"))
fun = {
    "f": ({1: "a", 2: "a", 3: "d", 4: "c"}, "XY"),
    "g": ({1: "b", 2: "c", 3: "c", 4: "d"}, "XY"),
    "h": ({"a": 2, "b": 3, "c": 4, "d": 1}, "YX"),
    "k": ({"a": 2, "b": 4, "c": 3, "d": 3}, "YX"),
}
for nombre_t1, tx in (("τ1* (reparada, 10 abiertos)", t1r), ("τ1 literal (9 conjuntos)", t1)):
    print("\n  usando", nombre_t1)
    for nom, (f, sentido) in fun.items():
        if sentido == "XY":
            dom, td, cod, tc, nd, nc = X, tx, Y, t2, "X", "Y"
        else:
            dom, td, cod, tc, nd, nc = Y, t2, X, tx, "Y", "X"
        print(f"   {nom}: {nd}→{nc}")
        malos = [V for V in tc if preimagen(f, V) not in td]
        print("      continua:", not malos, "" if not malos else
              "| falla: " + "; ".join(f"{nom}⁻¹({fmt(V, cod, nc)})={fmt(preimagen(f, V), dom, nd)}" for V in malos))
        malos = [U for U in td if imagen(f, U) not in tc]
        print("      abierta :", not malos, "" if not malos else
              "| falla: " + "; ".join(f"{nom}({fmt(U, dom, nd)})={fmt(imagen(f, U), cod, nc)}" for U in malos))
        cd, cc = cerrados(dom, td), cerrados(cod, tc)
        malos = [F for F in cd if imagen(f, F) not in cc]
        print("      cerrada :", not malos, "" if not malos else
              "| falla: " + "; ".join(f"{nom}({fmt(F, dom, nd)})={fmt(imagen(f, F), cod, nc)}" for F in malos))
print("\n  homeomorfismos X→Y con τ1*:", len(homeomorfismos(X, t1r, Y, t2)),
      "| |τ1*| =", len(t1r), ", |τ2| =", len(t2))

titulo("PARTE IV.4")
X = S("abcde")
Y = S("vwxyz")
Z = frozenset({1, 2, 3, 4, 5})
tX = {X, S(""), S("a"), S("cd"), S("acd"), S("bcde")}
tY = {Y, S(""), S("v"), S("wz"), S("vwz"), S("wxyz")}
tZ = {Z, f_(), f_(1), f_(1, 2), f_(1, 3, 4), f_(1, 2, 3, 4), f_(1, 2, 5)}
print("topologías:", es_topologia(X, tX), es_topologia(Y, tY), es_topologia(Z, tZ),
      "| tamaños:", len(tX), len(tY), len(tZ))
for (n1, A, tA), (n2, B, tB) in ((("X", X, tX), ("X", X, tX)), (("X", X, tX), ("Y", Y, tY)),
                                 (("Y", Y, tY), ("Z", Z, tZ)), (("Z", Z, tZ), ("X", X, tX)),
                                 (("Z", Z, tZ), ("Z", Z, tZ))):
    hs = homeomorfismos(A, tA, B, tB)
    print(f"  {n1} ≅ {n2}: {'SÍ' if hs else 'NO'}  ({len(hs)} homeomorfismos)",
          "" if not hs else "p. ej. " + ", ".join(f"{k}→{v}" for k, v in sorted(hs[0].items(), key=lambda kv: str(kv[0]))))
    if n1 != n2:
        for h in hs:
            print("       ", ", ".join(f"{k}→{v}" for k, v in sorted(h.items(), key=lambda kv: str(kv[0]))))
