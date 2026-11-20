"""Genera las figuras 1 y 3 del Tema 2 y verifica las cifras citadas en el texto.

Uso:  python3 figuras/generar_figuras.py   (requiere numpy, scipy, matplotlib y LaTeX)
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from scipy.integrate import quad

AQUI = Path(__file__).resolve().parent
AZUL, NARANJA = "#1F6FD1", "#E8603C"

plt.rcParams.update({
    "text.usetex": True,
    "text.latex.preamble": r"\usepackage[T1]{fontenc}\usepackage[utf8]{inputenc}\usepackage{mathpazo}",
    "font.family": "serif",
    "font.size": 9,
    "axes.edgecolor": "#888888",
    "axes.linewidth": 0.6,
    "axes.grid": True,
    "grid.color": "#E4E4E4",
    "grid.linewidth": 0.5,
    "xtick.color": "#555555",
    "ytick.color": "#555555",
    "xtick.labelsize": 8,
    "ytick.labelsize": 8,
    "legend.frameon": False,
    "legend.fontsize": 8,
})


# ---------------------------------------------------------------------------
# Figura 1: modelo de Lorentz (omega_p = omega_0 = 1, gamma = 0.15)
# ---------------------------------------------------------------------------
W0, WP, G = 1.0, 1.0, 0.15


def eps(w):
    return 1 + WP**2 / (W0**2 - w**2 - 1j * G * w)


def eps2(w):
    return eps(w).imag


def eps1_kk(w, wmax=2000.0):
    """eps'(w) - 1 = (2/pi) P int_0^inf w' eps''(w') / (w'^2 - w^2) dw'."""
    # w'/(w'^2-w^2) = 1/(w'-w) * w'/(w'+w): peso de Cauchy en w
    f = lambda x: x * eps2(x) / (x + w)
    a = 0.0
    b = 3.0 * max(w, W0) + 5.0
    pv, _ = quad(f, a, b, weight="cauchy", wvar=w, limit=400)
    cola, _ = quad(lambda x: x * eps2(x) / (x**2 - w**2), b, wmax, limit=400)
    cola += (2 / np.pi) * 0  # la cola restante (x > wmax) es despreciable (~ G/wmax^3)
    return 1 + (2 / np.pi) * (pv + cola)


def figura1():
    w = np.linspace(0.0005, 2.5, 2000)
    e = eps(w)
    nh = np.sqrt(e)  # rama principal: Im >= 0 porque Im eps >= 0
    wkk = np.array([0.25, 0.5, 0.7, 0.85, 0.95, 1.05, 1.15, 1.3, 1.6, 2.0, 2.4])
    ekk = np.array([eps1_kk(x) for x in wkk])
    err = np.max(np.abs(ekk - eps(wkk).real))

    fig, (a, b) = plt.subplots(1, 2, figsize=(6.5, 2.55))
    a.axhline(0, color="#999999", lw=0.6)
    a.plot(w, e.real, color=AZUL, lw=1.6, label=r"$\varepsilon'(\omega)$")
    a.plot(w, e.imag, color=NARANJA, lw=1.6, label=r"$\varepsilon''(\omega)$")
    a.plot(wkk, ekk, "o", ms=4, mfc="white", mec="black", mew=0.9,
           label=r"$\varepsilon'$ por KK (num.)")
    a.set_xlim(0, 2.5)
    a.set_xlabel(r"$\omega/\omega_0$")
    a.set_title(r"(a) Permitividad relativa", loc="left", fontsize=9)
    a.legend(loc="upper right")

    banda = (W0, np.sqrt(W0**2 + WP**2))
    # banda real donde eps' < 0 (calculada, no la de pérdidas nulas)
    neg = w[e.real < 0]
    b.axvspan(neg.min(), neg.max(), color="#EEEDE8", lw=0)
    b.text((neg.min() + neg.max()) / 2, 2.38, r"$\varepsilon'<0$", ha="center",
           fontsize=8, color="#555555")
    b.plot(w, nh.real, color=AZUL, lw=1.6, label=r"$n(\omega)$")
    b.plot(w, nh.imag, color=NARANJA, lw=1.6, label=r"$\kappa(\omega)$")
    b.set_xlim(0, 2.5)
    b.set_ylim(0, 2.55)
    b.set_xlabel(r"$\omega/\omega_0$")
    b.set_title(r"(b) \'Indice complejo $\hat n=n+i\kappa$", loc="left", fontsize=9)
    b.legend(loc="upper left")
    fig.tight_layout(w_pad=1.5)
    fig.savefig(AQUI / "fig1_lorentz.pdf")
    plt.close(fig)

    regla, _ = quad(lambda x: x * eps2(x), 0, np.inf, limit=500)
    print(f"[Fig. 1] error máx. KK = {err:.2e};  int w eps'' dw = {regla:.6f} (pi/2 = {np.pi/2:.6f})")
    print(f"         banda eps'<0: [{neg.min():.3f}, {neg.max():.3f}] (sin pérdidas: {banda[0]:.3f}-{banda[1]:.3f})")


# ---------------------------------------------------------------------------
# Figura 3: Kretschmann, BK7 / 50 nm Au / dieléctrico, lambda = 632.8 nm
# ---------------------------------------------------------------------------
LAM = 632.8e-9
EPS_AU = -11.74 + 1.26j
NP = 1.515
D = 50e-9


def kz(e, kx):
    k = np.sqrt(e - kx**2 + 0j)
    return np.where(k.imag < 0, -k, k)  # Im kz >= 0


def rp(e1, e2, kx):
    k1, k2 = kz(e1, kx), kz(e2, kx)
    return (e2 * k1 - e1 * k2) / (e2 * k1 + e1 * k2)


def R_kretschmann(theta_deg, ed):
    kx = NP * np.sin(np.radians(theta_deg))  # en unidades de k0
    k0 = 2 * np.pi / LAM
    r12, r23 = rp(NP**2, EPS_AU, kx), rp(EPS_AU, ed, kx)
    fase = np.exp(2j * kz(EPS_AU, kx) * k0 * D)
    return np.abs((r12 + r23 * fase) / (1 + r12 * r23 * fase)) ** 2


def figura3():
    th = np.linspace(35, 85, 5001)
    fig, ax = plt.subplots(figsize=(6.5, 2.4))
    for ed, col, et in [(1.0, AZUL, "Au / aire"), (1.332**2, NARANJA, "Au / agua")]:
        R = R_kretschmann(th, ed)
        ax.plot(th, R, color=col, lw=1.6, label=et)
        tc = np.degrees(np.arcsin(np.sqrt(ed) / NP))
        ax.axvline(tc, color=col, ls=":", lw=1.0)
        i = np.argmin(R)
        ax.annotate(rf"$\theta_{{\min}}={th[i]:.1f}^\circ$", xy=(th[i], R[i]),
                    xytext=(th[i] + (-6 if ed == 1 else 2.5), 0.17), fontsize=8,
                    arrowprops=dict(arrowstyle="-", lw=0.5, color="#555555"))
        ksp = np.sqrt(EPS_AU * ed / (EPS_AU + ed))
        th_sp = np.degrees(np.arcsin(ksp.real / NP))
        print(f"[Fig. 3] {et}: theta_c={tc:.1f}°, ksp/k0={ksp:.4f}, predicción {th_sp:.1f}°, "
              f"mínimo {th[i]:.1f}° (R={R[i]:.4f})")
    ax.set_xlim(35, 85)
    ax.set_ylim(0, 1.03)
    ax.set_xlabel(r"\'Angulo de incidencia en el prisma $\theta$ (grados)")
    ax.set_ylabel(r"$R_p=|r_p|^2$")
    ax.legend(loc="center", bbox_to_anchor=(0.36, 0.5))
    fig.tight_layout()
    fig.savefig(AQUI / "fig3_kretschmann.pdf")
    plt.close(fig)

    # sensibilidad: agua 1.332 -> 1.342
    m = [th[np.argmin(R_kretschmann(th, n**2))] for n in (1.332, 1.342)]
    print(f"         desplazamiento 1.332->1.342: {m[1]-m[0]:.2f}° ({(m[1]-m[0])/0.01:.0f}°/RIU)")


def verificaciones():
    # Ejemplo 1
    a, k = 1.3, 0.7
    I, _ = quad(lambda x: 1 / (x**2 + a**2), -np.inf, np.inf, weight="cos", wvar=k) if False else (None, None)
    I = 2 * quad(lambda x: 1 / (x**2 + a**2), 0, np.inf, weight="cos", wvar=k)[0]
    print(f"[Ej. 1] cuadratura {I:.6f}  vs  (pi/a) e^(-ka) = {np.pi/a*np.exp(-k*a):.6f}")
    # Ejemplo 4
    n = np.sqrt(EPS_AU)
    alpha = 4 * np.pi * n.imag / LAM
    Rn = abs((n - 1) / (n + 1)) ** 2
    kz2 = np.sqrt(EPS_AU - 0.5)
    k0 = 2 * np.pi / LAM
    th2 = np.arcsin(np.sin(np.pi / 4) / n)
    print(f"[Ej. 4] n={n:.3f}, alpha={alpha:.2e} 1/m, 1/alpha={1e9/alpha:.1f} nm, R(0)={Rn:.3f}")
    print(f"        kz2/k0={kz2:.3f}, 1/(Im kz2)={1e9/(kz2.imag*k0):.1f} nm, "
          f"ángulo de fase={np.degrees(np.arctan2(np.sin(np.pi/4), kz2.real)):.1f}°, theta2={th2:.4f}")
    kx = np.sin(np.pi / 4)
    rs = (np.cos(np.pi / 4) - kz2) / (np.cos(np.pi / 4) + kz2)
    rpp = rp(1.0, EPS_AU, kx)
    print(f"        Rs={abs(rs)**2:.3f}, Rp={abs(rpp)**2:.3f}")
    # Ejemplo 5
    for n1, lam in [(2.4, 10), (2.4, 5), (4.0, 10)]:
        dp = lam / (2 * np.pi * np.sqrt(n1**2 * 0.5 - 1.5**2))
        print(f"[Ej. 5] n1={n1}, lambda={lam} um: dp={dp:.2f} um")
    print(f"        theta_c={np.degrees(np.arcsin(1.5/2.4)):.1f}°")
    # Ejemplo 6
    for ed, et in [(1.0, "aire"), (1.332**2, "agua")]:
        ksp = np.sqrt(EPS_AU * ed / (EPS_AU + ed))
        L = 1 / (2 * ksp.imag * k0)
        dd = 1 / (k0 * np.sqrt(ksp**2 - ed)).imag if False else 1 / abs((k0 * np.sqrt(ed - ksp**2 + 0j)).imag)
        dm = 1 / abs((k0 * np.sqrt(EPS_AU - ksp**2 + 0j)).imag)
        print(f"[Ej. 6] {et}: ksp/k0={ksp:.4f}, L={L*1e6:.1f} um, penetra {dd*1e9:.0f} nm (diel.), {dm*1e9:.0f} nm (metal)")


if __name__ == "__main__":
    verificaciones()
    figura1()
    figura3()
