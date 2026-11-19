"""Verificación por fuerza bruta de los homomorfismos de anillos Z_m -> Z_n
(y Z -> Z_n) usados en la guía de estudio.

Un homomorfismo de anillos (definición 5.1 del folleto: NO se exige f(1)=1)
de Z_m en Z_n queda determinado por k = f(1) y existe si y solo si
    (1) n | m*k        (buena definición: f(m) = f(0) = 0)
    (2) k^2 = k mod n  (conservación del producto)
Aquí NO se usan esas condiciones: se prueban las n funciones x -> kx
directamente contra la definición, para contrastar la teoría.

Uso:  python3 algebra2/verificar_homomorfismos.py
"""
from math import gcd


def es_homomorfismo(m, n, k):
    """m = 0 representa a Z (basta probar un rango amplio de enteros)."""
    dominio = range(-60, 61) if m == 0 else range(m)
    f = lambda x: (k * x) % n
    # buena definición: x ≡ y (mod m)  =>  f(x) = f(y)
    if m and any(f(x) != f(x + m) for x in dominio):
        return False
    for a in dominio:
        for b in dominio:
            if f(a + b) != (f(a) + f(b)) % n or f(a * b) != (f(a) * f(b)) % n:
                return False
    return True


def es_hom_grupos(m, n, k):
    f = lambda x: (k * x) % n
    return all(f(x) == f(x + m) for x in range(m))


def informe(m, n):
    nombre = "Z" if m == 0 else f"Z_{m}"
    ks = [k for k in range(n) if es_homomorfismo(m, n, k)]
    print(f"\n{nombre} -> Z_{n}: {len(ks)} homomorfismos, k = f(1) en {ks}")
    for k in ks:
        imagen = sorted({(k * x) % n for x in range(n)})
        if m == 0:
            nucleo = f"{n // gcd(k, n)}Z"
        else:
            nucleo = [x for x in range(m) if (k * x) % n == 0]
        print(f"  f_{k}(x) = {k}x   ker = {nucleo}   Im = {imagen}")


if __name__ == "__main__":
    informe(0, 30)
    informe(20, 30)
    informe(12, 24)
    informe(24, 12)
    informe(12, 30)   # ejemplo 5.6 del folleto
    print("\ng(x) = 6x de Z_12 en Z_24:")
    print("  ¿bien definida y aditiva?", es_hom_grupos(12, 24, 6))
    print("  ¿homomorfismo de ANILLOS?", es_homomorfismo(12, 24, 6),
          f"(g(1·1) = 6, pero g(1)·g(1) = {36 % 24})")
    print("  ker g =", [x for x in range(12) if (6 * x) % 24 == 0],
          "  Im g =", sorted({(6 * x) % 24 for x in range(12)}))
