#!/usr/bin/env python3
"""Actualiza la tabla de videos del README a partir de build/videos.json."""
import json
import os
import re

AQUI = os.path.dirname(os.path.abspath(__file__))
BUILD = os.environ.get('VC_BUILD', os.path.join(AQUI, '..', 'build'))
README = os.path.join(AQUI, '..', '..', 'README.md')
TITULOS = {'nivel1': 'Derivación compleja', 'nivel2': 'Integrales sobre curvas', 'nivel3': 'Teorema y fórmula integral de Cauchy',
           'nivel4': 'Teorema de los residuos', 'nivel5': 'Integrales trigonométricas', 'nivel6': 'Integrales impropias y singularidades reales'}
v = json.load(open(os.path.join(BUILD, 'videos.json')))
filas = ['| Nivel | Video | Duración | Tamaño | Escenas |', '|---|---|---|---|---|']
total = 0
for k in sorted(v):
    x = v[k]
    total += x['duracion']
    filas.append(f"| {k[-1]} · {TITULOS[k]} | [`{x['archivo']}`](videos/{x['archivo']}) | {x['duracion'] / 60:.0f} min | {x['mb']:.0f} MB | {len(x['capitulos'])} |")
filas.append(f'\nDuración total: {total / 60:.0f} minutos.')
s = open(README, encoding='utf-8').read()
s = re.sub(r'<!-- VIDEOS -->.*?<!-- /VIDEOS -->', '<!-- VIDEOS -->\n' + '\n'.join(filas) + '\n<!-- /VIDEOS -->', s, flags=re.S)
open(README, 'w', encoding='utf-8').write(s)
print('\n'.join(filas))
