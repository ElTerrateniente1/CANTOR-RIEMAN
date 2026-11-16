// Genera documento/Guia_Variable_Compleja.pdf: el material de los videos por niveles,
// más las respuestas de las listas de referencia y un formulario.
//   node construir_documento.mjs
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { mate } from './lib/mate.mjs';
import { cssFuentes, cssKatex, CSS_BLOQUES, TEMA_CLARO, RAIZ } from './lib/estilos.mjs';
import { cargarNiveles, apuntes, resumenNivel } from './lib/apuntes.mjs';
import LISTAS from './contenido/respuestas.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BUILD = process.env.VC_BUILD || path.join(RAIZ, 'build');
const SALIDA = path.join(RAIZ, '..', 'documento');
const PDF = path.join(SALIDA, 'Guia_Variable_Compleja.pdf');

const niveles = await cargarNiveles();
let videos = {};
try { videos = JSON.parse(fs.readFileSync(path.join(BUILD, 'videos.json'), 'utf8')); } catch { /* aún no hay videos */ }

const CSS = String.raw`
@page{size:A4;margin:17mm 16mm 18mm 16mm}
*{box-sizing:border-box}
html{font-size:10.5pt}
body{font-family:'Source Serif 4',serif;color:var(--tinta);line-height:1.43;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,.sans,.bloque,.meta,.ref,table.resp,.indice{font-family:'IBM Plex Sans',sans-serif}
a{color:inherit;text-decoration:none}
.portada{height:258mm;display:flex;flex-direction:column;justify-content:center;break-after:page;padding:0 6mm}
.portada .et{font-family:'IBM Plex Sans';font-weight:700;letter-spacing:.24em;font-size:10pt;color:var(--ac)}
.portada h1{font-size:41pt;line-height:1.02;margin:5mm 0 4mm;letter-spacing:-.015em}
.portada .lema{font-family:'IBM Plex Sans';font-size:14pt;color:var(--tenue);margin:0 0 14mm}
.portada ol{font-family:'IBM Plex Sans';font-size:11.5pt;padding:0;margin:0;list-style:none;border-top:1.5px solid var(--tinta)}
.portada ol li{padding:2.4mm 0;border-bottom:1px solid var(--linea);display:flex;gap:5mm}
.portada ol li b{color:var(--ac);min-width:20mm;letter-spacing:.06em;font-size:9.5pt;padding-top:.5mm}
.portada .pie{margin-top:14mm;font-family:'IBM Plex Sans';font-size:9pt;color:var(--tenue)}
h2.cap{font-size:19pt;margin:0 0 4mm;line-height:1.15;break-before:page}
h2.cap.seguido{break-before:auto;margin-top:9mm}
.indice{font-size:9.6pt;columns:2;column-gap:9mm}
.indice .n{break-inside:avoid;margin:0 0 3.5mm}
.indice .n>a{font-weight:700;display:flex;justify-content:space-between;border-bottom:1px solid var(--tinta);padding-bottom:.6mm;margin-bottom:.8mm}
.indice .e a{display:flex;justify-content:space-between;gap:3mm;color:var(--tenue);line-height:1.32;padding:.25mm 0}
.indice .e a span:first-child{color:var(--tinta)}
.indice .katex{font-size:.95em}
.nn{break-before:page;font-family:'IBM Plex Sans',sans-serif;font-size:9.8pt;letter-spacing:.22em;color:var(--ac);font-weight:700;margin-bottom:2mm}
h1.nivel{font-size:25pt;margin:0 0 1.5mm;line-height:1.08;letter-spacing:-.01em;break-before:avoid}
.sub{font-family:'IBM Plex Sans';color:var(--tenue);font-size:12pt;margin:0 0 3.5mm}
.meta{font-size:8.6pt;color:var(--tenue);border-top:1px solid var(--linea);border-bottom:1px solid var(--linea);padding:1.5mm 0;margin-bottom:4mm;display:flex;gap:7mm;flex-wrap:wrap}
.meta b{color:var(--tinta);font-weight:600}
.objetivos{font-family:'IBM Plex Sans';font-size:9.9pt;background:var(--fondo2);border-radius:2mm;padding:2.5mm 4mm;margin:3mm 0 0}
.objetivos .tit{font-weight:700;font-size:8.6pt;letter-spacing:.12em;color:var(--tenue)}
section.esc{margin-top:6.5mm}
section.esc::after{content:'';display:block;clear:both}
section.esc h3{font-size:12.8pt;font-weight:600;margin:0 0 2.2mm;padding-top:2mm;border-top:1.4px solid var(--tinta);break-after:avoid;line-height:1.3}
.ref{font-size:8.2pt;font-weight:500;color:var(--cian);margin-left:1.5mm;white-space:nowrap}
.figura{float:right;margin:.5mm 0 2.5mm 6mm;font-size:38px;font-family:'IBM Plex Sans',sans-serif;break-inside:avoid}
.figura .plano{zoom:.43}
.figura [data-hasta]{display:none}
.pasoD{break-inside:avoid;margin:0 0 2.6mm}
.voz{margin:0 0 1.3mm;text-align:justify;hyphens:auto}
.bloque{font-size:9.7pt;line-height:1.38;margin:0 0 .8mm;overflow:hidden}
.bloque p{margin:0 0 1mm} .bloque p:last-child{margin-bottom:0}
.bloque .pie{font-size:.92em;color:var(--tenue)}
.bloque>.mate,.bloque>p{padding-left:2.2mm}
.nota{font-size:8.9pt;color:var(--tenue);margin:1mm 0 0;padding-left:2.5mm;border-left:2px solid var(--linea);line-height:1.38;overflow:hidden}
.katex{font-size:1.02em}
table.resp{width:100%;border-collapse:collapse;font-size:8.9pt;margin:0 0 5mm}
table.resp th{text-align:left;font-size:7.8pt;letter-spacing:.08em;color:var(--tenue);border-bottom:1.2px solid var(--tinta);padding:1mm 1.5mm}
table.resp td{border-bottom:1px solid var(--linea);padding:1.5mm 1.5mm;vertical-align:top}
table.resp tr{break-inside:avoid}
table.resp td.num{font-weight:700;color:var(--ac);width:6mm}
table.resp td.en{width:33%} table.resp td.re{width:31%} table.resp td.cl{color:var(--tenue)}
table.resp .dn{display:block;font-size:7.6pt;color:var(--cian);margin-top:.6mm}
h3.lista{font-size:12.5pt;margin:5mm 0 1.5mm;break-after:avoid}
h3.lista span{color:var(--ac);font-size:8.8pt;letter-spacing:.14em;margin-right:2mm}
.form{break-inside:avoid;margin:0 0 4mm;font-family:'IBM Plex Sans';font-size:9.6pt}
.form h4{font-size:10.5pt;margin:0 0 1mm} .form h4 span{color:var(--ac);font-size:8.6pt;letter-spacing:.14em;margin-right:2mm}
.caja{font-family:'IBM Plex Sans';font-size:9.6pt;background:var(--fondo2);border-radius:2mm;padding:3mm 4mm;margin:0 0 4mm;break-inside:avoid}
.caja p{margin:0 0 1.4mm} .caja p:last-child{margin:0}
p.t{margin:0 0 2.4mm;text-align:justify;hyphens:auto}
ol.ruta{font-family:'IBM Plex Sans';font-size:10pt;padding-left:5mm;margin:0 0 4mm} ol.ruta li{margin:0 0 1.2mm}
${CSS_BLOQUES}
`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const min = (seg) => `${Math.round(seg / 60)} min`;

function htmlDocumento(paginas = {}) {
  const pg = (id) => `<span class="pg">${paginas[id] ?? ''}</span>`;
  const datos = niveles.map((n) => ({ n, a: apuntes(n) }));

  const portada = `<div class="portada"><div class="et">VARIABLE COMPLEJA · CURSO INTENSIVO POR NIVELES</div>
<h1>Guía de estudio <br>para el parcial</h1>
<p class="lema">El material de los seis videos: teoría, ejemplos resueltos paso a paso, errores frecuentes y formulario.</p>
<ol>${datos.map(({ n }) => `<li><b>NIVEL ${n.n}</b><span>${n.titulo}</span></li>`).join('')}
<li><b>APÉNDICES</b><span>Respuestas de las 6 listas de referencia (60 ejercicios) · Formulario</span></li></ol>
<p class="pie">Los ejemplos de los videos son ejercicios de las listas de referencia del curso. Todas las respuestas numéricas se comprobaron con integración numérica independiente (ver «Cómo usar este material»).</p></div>`;

  const uso = `<h2 class="cap" id="uso">Cómo usar este material</h2>
<p class="t">Este documento contiene el material de los seis videos del curso. Cada apartado corresponde a una escena del video: el texto corrido es la explicación (la narración) y los bloques en letra sin serifa son lo que aparece en la pizarra. Las notas en gris añaden justificaciones que el video omite por brevedad.</p>
<ol class="ruta"><li><b>Mira el video</b> del nivel (carpeta <span class="sans">videos/</span>; cada escena es un capítulo y hay subtítulos).</li>
<li><b>Repasa el nivel en esta guía</b>, rehaciendo cada ejemplo a mano antes de leer la solución.</li>
<li><b>Resuelve la práctica del nivel</b> (<span class="sans">practicas/index.html</span> o la página publicada). Con <b>70&nbsp;% o más</b> se desbloquea el nivel siguiente; si no, la práctica indica qué escenas repasar.</li>
<li>Tras el Nivel 6, haz el <b>simulacro de parcial</b> y usa las listas de referencia como práctica adicional: sus respuestas están en el Apéndice A.</li></ol>
<div class="caja"><p><b>Convenciones.</b> $\Log z=\ln|z|+i\Arg z$ con $\Arg z\in(-\pi,\pi]$ (rama principal); las curvas cerradas se recorren en sentido antihorario (orientación positiva); $\sen$ es el seno; «v.p.» es el valor principal de Cauchy; C–R abrevia Cauchy–Riemann.</p></div>
<div class="caja"><p><b>Qué está comprobado y qué no.</b> Las respuestas de los 60 ejercicios de las listas y de todas las preguntas de práctica se compararon con una integración numérica independiente (programas en <span class="sans">verificacion/</span>). Eso detecta errores de signo, de residuos o de polos mal ubicados, pero no sustituye la revisión de tu docente: contrasta las definiciones y convenciones con las de tu curso.</p>
<p><b>Supuestos al interpretar las listas.</b> (1) Cauchy 8 y 9: la nota dice «segmento $[-|w|,|w|]$», que no cierra la semicircunferencia de radio $2|w|$; se asumió el diámetro $[-2|w|,2|w|]$. (2) Curvas 7: se integró sobre el arco; si se quiere el contorno cerrado del semidisco, la integral es $0$. (3) Curvas 9: se leyó $f(z)=z\sqrt z$ con la rama principal. (4) Derivación 9: con $\theta\in(-\pi,\pi]$ el logaritmo no es continuo en el semieje real negativo, así que es analítico en $\C\setminus(-\infty,0]$ y no en todo su dominio de definición. (5) Singularidades reales: cuando hay un polo real, la integral se entiende como valor principal. Los ejercicios 4–5 y 8–9 de esa lista están repetidos.</p></div>`;

  const indice = `<h2 class="cap seguido" id="indice">Índice</h2><div class="indice">` + datos.map(({ n, a }) =>
    `<div class="n"><a href="#${n.id}"><span>Nivel ${n.n} · ${n.titulo}</span>${pg(n.id)}</a>` +
    a.escenas.map((e) => `<div class="e"><a href="#${e.id}"><span>${mate(e.titulo.replaceAll('\\displaystyle', '').replaceAll('\\dfrac', '\\frac'))}</span>${pg(e.id)}</a></div>`).join('') + `</div>`).join('') +
    `<div class="n"><a href="#apA"><span>Apéndice A · Respuestas de las listas</span>${pg('apA')}</a></div>` +
    `<div class="n"><a href="#apB"><span>Apéndice B · Formulario</span>${pg('apB')}</a></div></div>`;

  const cuerpo = datos.map(({ n, a }) => {
    const v = videos[n.id];
    return `<div class="nn">NIVEL ${n.n}</div><h1 class="nivel" id="${n.id}">${n.titulo}</h1><p class="sub">${n.sub}</p>
<div class="meta"><span><b>Video:</b> ${v ? `${esc(v.archivo)} · ${min(v.duracion)}` : `Nivel ${n.n}`}</span><span><b>Lista de referencia:</b> ${n.lista}</span></div>
<p class="t">${a.intro}</p><div class="objetivos"><div class="tit">AL TERMINAR ESTE NIVEL PODRÁS</div>${a.objetivos}</div>
${a.escenas.map((e) => e.html).join('\n')}`;
  }).join('\n');

  const apA = `<h2 class="cap" id="apA">Apéndice A · Respuestas de las listas de referencia</h2>
<p class="t">Respuestas de los 60 ejercicios de las seis listas, con la idea clave y el lugar del curso donde se resuelve cada uno. Úsalas para corregir tu propio trabajo: intenta el ejercicio completo antes de mirar.</p>` +
    LISTAS.map((L) => `<h3 class="lista"><span>NIVEL ${L.nivel}</span>${L.titulo}</h3><table class="resp"><tr><th></th><th>EJERCICIO</th><th>RESPUESTA</th><th>IDEA CLAVE</th></tr>` +
      L.items.map((it, k) => `<tr><td class="num">${k + 1}</td><td class="en">${mate('$\\displaystyle ' + it.e + '$')}</td><td class="re">${mate('$\\displaystyle ' + it.r + '$')}</td><td class="cl">${mate(it.k)}<span class="dn">${it.d}</span></td></tr>`).join('') + `</table>`).join('');

  const mapa = niveles[5].escenas.find((e) => e.t && e.t.startsWith('Mapa de decisión'));
  const apB = `<h2 class="cap" id="apB">Apéndice B · Formulario</h2>` +
    datos.map(({ n }) => `<div class="form"><h4><span>NIVEL ${n.n}</span>${n.titulo}</h4>${resumenNivel(n).replace('<span class="rot">Resumen</span>', '')}</div>`).join('') +
    `<div class="form"><h4><span>TODO EL CURSO</span>Mapa de decisión</h4>${mate(mapa.pasos[0].h)}</div>`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Variable compleja · Guía de estudio por niveles</title>
<style>${cssFuentes()}\n${cssKatex()}\n${TEMA_CLARO}\n${CSS}</style></head><body>
${portada}${uso}${indice}${cuerpo}${apA}${apB}</body></html>`;
}

async function aPDF(html, destino) {
  const tmp = path.join(BUILD, 'documento.html');
  fs.mkdirSync(BUILD, { recursive: true });
  fs.writeFileSync(tmp, html);
  const nav = await chromium.launch();
  const pag = await nav.newPage();
  await pag.goto('file://' + tmp);
  await pag.evaluate(() => document.fonts.ready);
  await pag.pdf({
    path: destino, format: 'A4', printBackground: true, preferCSSPageSize: true, outline: true, tagged: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-family:sans-serif;font-size:7.5px;color:#6b7686;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>Variable compleja · curso intensivo por niveles</span><span class="pageNumber"></span></div>`,
  });
  await nav.close();
}

fs.mkdirSync(SALIDA, { recursive: true });
// 1.ª pasada: sin números de página en el índice
await aPDF(htmlDocumento(), PDF);
// se leen las páginas de destino de cada entrada del índice y se repite
const py = `
import json, sys, pymupdf
d = pymupdf.open(sys.argv[1])
nombres = d.resolve_names() if hasattr(d, 'resolve_names') else {}
res = {}
for pg in d:
    for l in pg.get_links():
        n = l.get('nameddest') or l.get('name')
        if n and n in nombres: res[n] = nombres[n]['page'] + 1
        elif n and l.get('page', -1) >= 0: res[n] = l['page'] + 1
print(json.dumps({'paginas': res, 'total': len(d)}))
`;
let info = { paginas: {}, total: 0 };
try {
  info = JSON.parse(execFileSync('python3', ['-c', py, PDF], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  if (Object.keys(info.paginas).length) await aPDF(htmlDocumento(info.paginas), PDF);
} catch (e) { console.log('  (índice sin números de página: ' + e.message.split('\n')[0] + ')'); }
console.log(`${PDF}: ${info.total || '?'} páginas, ${(fs.statSync(PDF).size / 1e6).toFixed(1)} MB, ${Object.keys(info.paginas).length} entradas de índice numeradas`);
