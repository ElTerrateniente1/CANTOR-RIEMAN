// Genera las prácticas por niveles:
//   practicas/index.html                  página autónoma (video + apuntes + práctica, con desbloqueo)
//   practicas/Practicas_Variable_Compleja.pdf   versión imprimible con soluciones
//   build/ruta_artifact.html              la misma página lista para publicar (videos como recursos subidos)
//   node construir_practicas.mjs
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { mate } from './lib/mate.mjs';
import { cssFuentes, cssKatex, CSS_BLOQUES, TEMA_CLARO, RAIZ } from './lib/estilos.mjs';
import { cargarNiveles, apuntes } from './lib/apuntes.mjs';
import { paginaRuta } from './lib/ruta.mjs';
import BANCO, { UMBRAL } from './contenido/practicas.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BUILD = process.env.VC_BUILD || path.join(RAIZ, 'build');
const SALIDA = path.join(RAIZ, '..', 'practicas');
const VIDEOS = path.join(RAIZ, '..', 'videos');
const leerJSON = (f, def) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } };
const videos = leerJSON(path.join(BUILD, 'videos.json'), {});
const recursos = leerJSON(path.join(BUILD, 'recursos.json'), {});   // { nivel1: "/_blob/…" } tras subir los videos
const CORTO = { nivel1: 'Derivación', nivel2: 'Curvas', nivel3: 'Cauchy', nivel4: 'Residuos', nivel5: 'Trigonométricas', nivel6: 'Impropias', simulacro: 'Simulacro' };

const niveles = await cargarNiveles();
const banco = Object.fromEntries(BANCO.map((b) => [b.id, b]));
const preguntas = (id) => banco[id].preguntas.map((p) => ({ q: mate(p.q), ops: p.ops.map(mate), sol: mate(p.sol), rep: p.rep }));

function datos(modo) {
  const lista = niveles.map((n) => {
    const a = apuntes(n), v = videos[n.id];
    let src = '', vtt = '';
    if (v) {
      if (modo === 'artifact') src = recursos[n.id] || '';
      else if (fs.existsSync(path.join(VIDEOS, v.archivo))) src = '../videos/' + v.archivo;
      try { vtt = fs.readFileSync(path.join(VIDEOS, v.vtt), 'utf8'); } catch { /* sin subtítulos */ }
    }
    return {
      id: n.id, n: n.n, titulo: n.titulo, corto: CORTO[n.id], sub: n.sub,
      video: { src, archivo: v ? v.archivo : `Nivel_${n.n}`, dur: v ? v.duracion : 0, caps: v ? v.capitulos : [], vtt },
      apuntes: { intro: a.intro, objetivos: a.objetivos, escenas: a.escenas.map((e) => ({ id: e.id, titulo: mate(e.titulo.replaceAll('\\displaystyle', '').replaceAll('\\dfrac', '\\frac')), html: e.html })) },
      preguntas: preguntas(n.id),
    };
  });
  lista.push({ id: 'simulacro', n: 7, titulo: 'Simulacro de parcial', corto: CORTO.simulacro, sub: 'Diez preguntas que mezclan los seis niveles, en condiciones de examen', video: null, apuntes: null, preguntas: preguntas('simulacro') });
  return { umbral: UMBRAL, niveles: lista };
}

fs.mkdirSync(SALIDA, { recursive: true });
fs.mkdirSync(BUILD, { recursive: true });
// --- página autónoma ---
{
  const { cabeza, cuerpo } = paginaRuta(datos('archivo'));
  const html = `<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark">\n${cabeza}\n</head><body>\n${cuerpo}\n</body></html>\n`;
  fs.writeFileSync(path.join(SALIDA, 'index.html'), html);
  console.log(`practicas/index.html: ${(html.length / 1e6).toFixed(2)} MB`);
}
// --- página para publicar ---
{
  const { cabeza, cuerpo } = paginaRuta(datos('artifact'));
  const html = `${cabeza}\n${cuerpo}\n`;
  fs.writeFileSync(path.join(BUILD, 'ruta_artifact.html'), html);
  console.log(`build/ruta_artifact.html: ${(html.length / 1e6).toFixed(2)} MB; videos enlazados: ${Object.keys(recursos).length}`);
}

// --- PDF imprimible ---
function azar(semilla) { let a = semilla >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const LETRAS = ['a', 'b', 'c', 'd'];
const impresos = BANCO.map((niv) => ({
  ...niv,
  preguntas: niv.preguntas.map((p, k) => {
    const rnd = azar(niv.n * 1000 + k * 7 + 3), orden = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
    return { ...p, orden, correcta: LETRAS[orden.indexOf(0)] };
  }),
}));
const CSS_PDF = String.raw`
@page{size:A4;margin:17mm 16mm 18mm 16mm}
*{box-sizing:border-box}
html{font-size:10.4pt}
body{font-family:'IBM Plex Sans',sans-serif;color:var(--tinta);line-height:1.42;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.et{font-weight:700;letter-spacing:.22em;font-size:9pt;color:var(--ac)}
h1{font-size:30pt;line-height:1.05;margin:3mm 0 3mm;letter-spacing:-.015em}
.lema{font-size:12pt;color:var(--tenue);margin:0 0 7mm}
.caja{background:var(--fondo2);border-radius:2mm;padding:3mm 4mm;margin:0 0 4mm;font-size:9.8pt}
.caja p{margin:0 0 1.3mm}.caja p:last-child{margin:0}
h2{font-size:16pt;margin:0 0 1mm;break-before:page;line-height:1.15}
h2 span{display:block;font-size:8.8pt;letter-spacing:.2em;color:var(--ac);margin-bottom:1mm}
h2.seguido{break-before:auto;margin-top:8mm}
.meta{font-size:9pt;color:var(--tenue);margin:0 0 4mm;border-bottom:1.3px solid var(--tinta);padding-bottom:1.5mm}
.q{break-inside:avoid;margin:0 0 4.2mm;display:grid;grid-template-columns:8mm 1fr;gap:0 1mm}
.q .num{font-weight:700;color:var(--ac)}
.q .enun{margin:0 0 1.4mm}
.ops{display:grid;grid-template-columns:1fr 1fr;gap:1mm 6mm}
.ops.larga{grid-template-columns:1fr}
.ops div{display:flex;gap:1.6mm}.ops b{color:var(--tenue);font-weight:600}
.s{break-inside:avoid;margin:0 0 2.8mm;display:grid;grid-template-columns:8mm 9mm 1fr;gap:0 1mm;font-size:9.6pt}
.s .num{font-weight:700;color:var(--ac)}.s .let{font-weight:700;color:var(--verde)}
.s .rep{display:block;font-size:8.3pt;color:var(--cian);margin-top:.5mm}
.tabla{display:grid;grid-template-columns:repeat(10,1fr);gap:0;margin:0 0 5mm;font-size:9.4pt;text-align:center;border:1px solid var(--linea);border-radius:1.5mm;overflow:hidden}
.tabla div{padding:1.2mm 0;border-right:1px solid var(--linea)}.tabla div:nth-child(10n){border-right:0}
.tabla .c{font-weight:700;color:var(--verde);border-top:1px solid var(--linea)}
.katex{font-size:1.02em}
${CSS_BLOQUES}
`;
const largo = (p) => p.ops.some((o) => o.replace(/\$[^$]*\$/g, 'xxxxxx').length > 46);
const htmlPDF = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Variable compleja · Prácticas por niveles</title>
<style>${cssFuentes({ familias: ['IBM Plex Sans'] })}\n${cssKatex()}\n${TEMA_CLARO}\n${CSS_PDF}</style></head><body>
<div class="et">VARIABLE COMPLEJA · CURSO INTENSIVO POR NIVELES</div><h1>Prácticas por niveles</h1>
<p class="lema">Seis prácticas (una por nivel) y un simulacro de parcial, con respuestas y soluciones al final.</p>
<div class="caja"><p><b>Regla de avance.</b> Cada práctica tiene 10 preguntas de opción única. Se aprueba con <b>${Math.ceil(10 * UMBRAL)} o más correctas (${Math.round(UMBRAL * 100)}&nbsp;%)</b>; solo entonces se pasa al nivel siguiente. Si no se alcanza, se repasan los apartados indicados en las soluciones y se repite la práctica.</p>
<p><b>Cómo trabajar.</b> Resuelve con papel y lápiz antes de mirar las opciones. Las opciones incorrectas corresponden a errores típicos: si tu resultado coincide con una de ellas, la solución te dice qué falló.</p>
<p><b>Versión interactiva.</b> El archivo <b>practicas/index.html</b> (y la página publicada) corrige las respuestas, baraja las preguntas en cada intento y lleva el control de los niveles desbloqueados.</p>
<p><b>Fiabilidad.</b> La respuesta correcta de las 58 preguntas de cálculo se comprobó con integración numérica o cálculo simbólico (<b>verificacion/verificar_practicas.py</b>); las 12 conceptuales no admiten esa comprobación.</p></div>
${impresos.map((niv, i) => `<h2${i === 0 ? ' class="seguido"' : ''}><span>${niv.n <= 6 ? 'NIVEL ' + niv.n : 'EVALUACIÓN FINAL'}</span>${niv.titulo}</h2>
<p class="meta">10 preguntas · se aprueba con ${Math.ceil(niv.preguntas.length * UMBRAL)} correctas${niv.n === 7 ? ' · tiempo sugerido: 60 minutos, sin apuntes' : ''}</p>
${niv.preguntas.map((p, k) => `<div class="q"><div class="num">${k + 1}.</div><div><div class="enun">${mate(p.q)}</div><div class="ops${largo(p) ? ' larga' : ''}">${p.orden.map((j, pos) => `<div><b>${LETRAS[pos]})</b><span>${mate(p.ops[j])}</span></div>`).join('')}</div></div></div>`).join('\n')}`).join('\n')}
<h2><span>CLAVE</span>Respuestas y soluciones</h2><p class="meta">Corrige primero con la tabla; lee la solución de cada pregunta fallada.</p>
${impresos.map((niv) => `<h2 class="seguido" style="font-size:12.5pt">${niv.n <= 6 ? 'Nivel ' + niv.n + ' · ' : ''}${niv.titulo}</h2>
<div class="tabla">${niv.preguntas.map((_, k) => `<div>${k + 1}</div>`).join('')}${niv.preguntas.map((p) => `<div class="c">${p.correcta}</div>`).join('')}</div>
${niv.preguntas.map((p, k) => `<div class="s"><div class="num">${k + 1}.</div><div class="let">${p.correcta})</div><div>${mate(p.sol)}<span class="rep">Repasar: ${p.rep}</span></div></div>`).join('\n')}`).join('\n')}
</body></html>`;
const tmp = path.join(BUILD, 'practicas_pdf.html');
fs.writeFileSync(tmp, htmlPDF);
const nav = await chromium.launch();
const pag = await nav.newPage();
await pag.goto('file://' + tmp);
await pag.evaluate(() => document.fonts.ready);
const pdf = path.join(SALIDA, 'Practicas_Variable_Compleja.pdf');
await pag.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
  footerTemplate: `<div style="font-family:sans-serif;font-size:7.5px;color:#6b7686;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>Variable compleja · prácticas por niveles</span><span class="pageNumber"></span></div>` });
await nav.close();
console.log(`practicas/Practicas_Variable_Compleja.pdf: ${(fs.statSync(pdf).size / 1e6).toFixed(2)} MB`);
