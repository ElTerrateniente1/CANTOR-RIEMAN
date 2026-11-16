#!/usr/bin/env python3
"""Comprueba las respuestas correctas del banco de prácticas.

Cada pregunta de cálculo trae una especificación `v` (en fuente/contenido/practicas.mjs)
con la integral que se pide y el valor que el banco marca como correcto; aquí se
integra numéricamente (o se comprueba simbólicamente) y se compara.

Uso:  python3 verificar_practicas.py
"""
import json
import os
import subprocess

import mpmath as mp
import sympy as sp

from numerico import circ, camino, vp

AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTE = os.path.join(AQUI, '..', 'fuente')
banco = json.loads(subprocess.run(['node', 'herramientas/exportar_practicas.mjs'], cwd=FUENTE,
                                  capture_output=True, text=True, check=True).stdout)

NUM = {k: getattr(mp, k) for k in ('exp', 'sin', 'cos', 'tan', 'sqrt', 'log', 'atan', 'sinh', 'cosh', 'pi', 'e', 'conj', 're', 'im')}
NUM.update(I=mp.mpc(0, 1), abs=abs)
x, y = sp.symbols('x y', real=True)
rr, th = sp.symbols('rr th', positive=True)
SIM = dict(x=x, y=y, rr=rr, th=th, I=sp.I, diff=sp.diff, exp=sp.exp, sin=sp.sin, cos=sp.cos, sqrt=sp.sqrt,
           dzb=lambda F: (sp.diff(F, x) + sp.I * sp.diff(F, y)) / 2,
           dz=lambda F: (sp.diff(F, x) - sp.I * sp.diff(F, y)) / 2,
           lap=lambda u: sp.diff(u, x, 2) + sp.diff(u, y, 2))


def num(expr, **extra):
    return eval(expr, {'__builtins__': {}}, {**NUM, **extra})


def fun(expr, var):
    return lambda val: num(expr, **{var: val})


def comprobar(v):
    t = v['t']
    if t == 'simb':
        malos = [c for c in v['ceros'] if sp.simplify(sp.expand(eval(c, {'__builtins__': {}}, SIM), complex=True)) != 0]
        return (not malos), ('' if not malos else 'no se anula: ' + '; '.join(malos))
    val = mp.mpc(num(v['val']))
    if t == 'circ':
        got = circ(fun(v['f'], 'z'), mp.mpc(num(v['c'])), num(v['r']), n=32)
    elif t == 'camino':
        got = camino(fun(v['f'], 'z'), fun(v['alfa'], 't'), fun(v['dalfa'], 't'), num(v['a']), num(v['b']))
    elif t == 'real':
        a, b = num(v['a']), num(v['b'])
        got = mp.quad(fun(v['f'], 'x'), mp.linspace(a, b, 17))
    elif t in ('recta', 'vp'):
        f = fun(v['f'], 'x')
        polos = [num(p) for p in v.get('polos', [])]
        om = num(v['om']) if v.get('om') else None
        got = vp(f, polos, [(f, om)], L=None if polos else 4)
    else:
        raise ValueError(t)
    err = abs(mp.mpc(got) - val)
    return err < 1e-9 * max(1, abs(val)), f'esperado {mp.nstr(val, 10)}, numérico {mp.nstr(mp.mpc(got), 10)}'


total = fallas = sin_v = 0
for nivel in banco:
    print(f"=== {nivel['titulo']} ({len(nivel['preguntas'])} preguntas) ===")
    for p in nivel['preguntas']:
        assert p['nops'] == 4 and p['tieneSol'] and p['rep'], f"pregunta incompleta: {nivel['id']} #{p['k']}"
        if not p['v']:
            sin_v += 1
            print(f"  ·   #{p['k']:<2} (conceptual, sin comprobación numérica)")
            continue
        total += 1
        ok, det = comprobar(p['v'])
        fallas += not ok
        print(f"  {'OK ' if ok else 'FALLA'} #{p['k']:<2} [{p['v']['t']}] {det}")
print(f"\n{total - fallas}/{total} respuestas de cálculo comprobadas; {sin_v} preguntas conceptuales sin comprobación numérica")
raise SystemExit(1 if fallas else 0)
