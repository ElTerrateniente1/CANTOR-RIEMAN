// Hojas de estilo compartidas por los videos, el documento y las prácticas.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NM = path.join(RAIZ, 'node_modules');

const FUENTES = [
  ['IBM Plex Sans', 400, 'normal', '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2'],
  ['IBM Plex Sans', 400, 'italic', '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-italic.woff2'],
  ['IBM Plex Sans', 500, 'normal', '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2'],
  ['IBM Plex Sans', 600, 'normal', '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2'],
  ['IBM Plex Sans', 700, 'normal', '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2'],
  ['Source Serif 4', 400, 'normal', '@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2'],
  ['Source Serif 4', 400, 'italic', '@fontsource/source-serif-4/files/source-serif-4-latin-400-italic.woff2'],
  ['Source Serif 4', 600, 'normal', '@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2'],
  ['Source Serif 4', 700, 'normal', '@fontsource/source-serif-4/files/source-serif-4-latin-700-normal.woff2'],
];

const dataURI = (archivo, mime) => `data:${mime};base64,${fs.readFileSync(archivo).toString('base64')}`;

/** @font-face de las tipografías de texto. familias: filtro opcional. */
export function cssFuentes({ incrustar = false, familias = null } = {}) {
  return FUENTES.filter((f) => !familias || familias.includes(f[0])).map(([fam, peso, estilo, rel]) => {
    const abs = path.join(NM, rel);
    const url = incrustar ? dataURI(abs, 'font/woff2') : 'file://' + abs;
    return `@font-face{font-family:'${fam}';font-weight:${peso};font-style:${estilo};font-display:block;src:url(${url}) format('woff2')}`;
  }).join('\n');
}

/** CSS de KaTeX; con incrustar=true las fuentes van como data URI (solo woff2). */
export function cssKatex({ incrustar = false } = {}) {
  const dir = path.join(NM, 'katex/dist');
  let css = fs.readFileSync(path.join(dir, 'katex.min.css'), 'utf8');
  css = css.replace(/src:url\((fonts\/[^)]+\.woff2)\) format\("woff2"\),url\([^)]+\) format\("woff"\),url\([^)]+\) format\("truetype"\)/g,
    (_, rel) => `src:url(${incrustar ? dataURI(path.join(dir, rel), 'font/woff2') : 'file://' + path.join(dir, rel)}) format("woff2")`);
  return css;
}

/** Bloques de contenido (definición, teorema, advertencia, resultado) y diagramas. */
export const CSS_BLOQUES = String.raw`
.def,.teo,.ojo,.res,.idea{border-left:.22em solid var(--b,var(--cian));background:var(--bf,rgba(111,211,247,.09));
  padding:.42em .8em .46em;border-radius:0 .45em .45em 0}
.teo{--b:var(--ac);--bf:var(--ac-f)}
.ojo{--b:var(--rojo);--bf:var(--rojo-f)}
.res{--b:var(--verde);--bf:var(--verde-f)}
.idea{--b:var(--violeta);--bf:var(--violeta-f)}
.def{--b:var(--cian);--bf:var(--cian-f)}
.rot{font-weight:700;letter-spacing:.02em;color:var(--b,var(--cian));margin-right:.35em}
.am{color:var(--ac)} .ci{color:var(--cian)} .ro{color:var(--rojo)} .ve{color:var(--verde)} .vi{color:var(--violeta)}
.ten{color:var(--tenue)}
.mate{margin:.18em 0}
.katex-display{margin:0!important}
.katex-display>.katex{text-align:left!important;padding-left:.7em}
.centro .katex-display>.katex{text-align:center!important;padding-left:0}
ul.l,ol.l{margin:.1em 0;padding-left:1.15em} ul.l li,ol.l li{margin:.16em 0}
.fila{display:flex;gap:1.2em;align-items:center;flex-wrap:wrap}
table.t{border-collapse:collapse;font-size:.9em} table.t td,table.t th{padding:.22em .7em;border-bottom:1px solid var(--linea);text-align:left;vertical-align:top}
table.t th{color:var(--tenue);font-weight:600}

.plano{position:relative;flex:none}
.plano svg{display:block;overflow:visible}
.plano .eje{stroke:var(--tenue);stroke-width:2;fill:none}
.plano polygon.eje{fill:var(--tenue);stroke:none}
.plano .curva{stroke:var(--ac);stroke-width:5;fill:none;stroke-linecap:round;stroke-linejoin:round}
.plano .curva.c2{stroke:var(--cian)} .plano .curva.c3{stroke:var(--verde)} .plano .curva.c4{stroke:var(--violeta)}
.plano .curva.fina{stroke-width:3}
.plano .curva.aux{stroke:var(--tenue);stroke-width:2.5;stroke-dasharray:9 8}
.plano .flecha{fill:var(--ac);stroke:none}
.plano .flecha.c2{fill:var(--cian)} .plano .flecha.c3{fill:var(--verde)} .plano .flecha.c4{fill:var(--violeta)} .plano .flecha.aux{fill:var(--tenue)}
.plano .relleno{fill:var(--ac);fill-opacity:.2;stroke:none}
.plano .relleno.c2{fill:var(--cian)} .plano .relleno.c3{fill:var(--verde)} .plano .relleno.c4{fill:var(--violeta)} .plano .relleno.rojo{fill:var(--rojo)}
.plano .relleno.suave{fill-opacity:.11}
.plano .marca.polo{stroke:var(--rojo);stroke-width:4.5;stroke-linecap:round;fill:none}
.plano .marca.polo.fuera{stroke:var(--tenue)}
.plano .marca.punto{fill:var(--tinta);stroke:none}
.plano .marca.punto.c2{fill:var(--cian)} .plano .marca.punto.am{fill:var(--ac)}
.plano .marca.hueco{fill:var(--fondo);stroke:var(--tinta);stroke-width:3}
.plano .corte{stroke:var(--rojo);stroke-width:3.5;fill:none;stroke-linejoin:round}
.plano .etq{position:absolute;white-space:nowrap;font-size:.8em;line-height:1;color:var(--tinta)}
.plano .etq.tenue{color:var(--tenue)} .plano .etq.chica{font-size:.62em}
.plano .etq.am{color:var(--ac)} .plano .etq.ci{color:var(--cian)} .plano .etq.ro{color:var(--rojo)} .plano .etq.ve{color:var(--verde)} .plano .etq.vi{color:var(--violeta)}
.plano .etq.pos-c{transform:translate(-50%,-50%)}
.plano .etq.pos-n{transform:translate(-50%,calc(-100% - .45em))}
.plano .etq.pos-s{transform:translate(-50%,.45em)}
.plano .etq.pos-e{transform:translate(.5em,-50%)}
.plano .etq.pos-w{transform:translate(calc(-100% - .5em),-50%)}
.plano .etq.pos-ne{transform:translate(.4em,calc(-100% - .3em))}
.plano .etq.pos-nw{transform:translate(calc(-100% - .4em),calc(-100% - .3em))}
.plano .etq.pos-se{transform:translate(.4em,.3em)}
.plano .etq.pos-sw{transform:translate(calc(-100% - .4em),.3em)}
`;

/** Paleta oscura (videos). */
export const TEMA_OSCURO = String.raw`
:root{--fondo:#0f1522;--fondo2:#172033;--tinta:#eef1f6;--tenue:#93a1b8;--linea:#2b364b;
  --ac:#ffd166;--cian:#6fd3f7;--rojo:#ff8177;--verde:#7ee0a1;--violeta:#c9b0ff;
  --ac-f:rgba(255,209,102,.11);--cian-f:rgba(111,211,247,.10);--rojo-f:rgba(255,129,119,.12);
  --verde-f:rgba(126,224,161,.11);--violeta-f:rgba(201,176,255,.12)}
`;

/** Paleta clara (documento impreso). */
export const TEMA_CLARO = String.raw`
:root{--fondo:#ffffff;--fondo2:#f5f6f8;--tinta:#1b2330;--tenue:#5d6878;--linea:#d9dee6;
  --ac:#a86400;--cian:#0b6fa4;--rojo:#c0392b;--verde:#1e7d45;--violeta:#6a45b8;
  --ac-f:rgba(214,146,0,.10);--cian-f:rgba(11,111,164,.08);--rojo-f:rgba(192,57,43,.08);
  --verde-f:rgba(30,125,69,.09);--violeta-f:rgba(106,69,184,.08)}
`;
