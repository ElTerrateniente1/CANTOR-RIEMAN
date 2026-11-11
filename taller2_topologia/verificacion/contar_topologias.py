# Cuenta topologías sobre n puntos vía preórdenes (relaciones reflexivas y transitivas)
import sys
from itertools import permutations
n = int(sys.argv[1])
pares = [(i, j) for i in range(n) for j in range(n) if i != j]
m = len(pares)
total = 0
clases = set()
perms = list(permutations(range(n)))
for mask in range(1 << m):
    R = [1 << i for i in range(n)]            # fila i: bits de los j con i<=j
    for k, (i, j) in enumerate(pares):
        if mask >> k & 1:
            R[i] |= 1 << j
    ok = True
    for i in range(n):
        ri = R[i]
        for j in range(n):
            if ri >> j & 1 and (R[j] & ~ri):
                ok = False; break
        if not ok: break
    if not ok: continue
    total += 1
    best = None
    for p in perms:
        key = tuple(sorted((p[i], tuple(sorted(p[j] for j in range(n) if R[i] >> j & 1))) for i in range(n)))
        if best is None or key < best: best = key
    clases.add(best)
print(n, total, len(clases))
