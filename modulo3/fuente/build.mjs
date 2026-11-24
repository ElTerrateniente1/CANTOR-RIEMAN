// Uso: node build.mjs CLASE   (CLASE = carpeta de clases/, p. ej. t3t4)
// Genera: build/CLASE/frames/*.png + build/CLASE/narracion.json (para el video),
// el PDF de diapositivas y el PDF de apuntes.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import { diagramas } from './diagramas.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const CLASE = process.argv[2];
const CLASES = JSON.parse(fs.readFileSync(path.join(AQUI, 'clases.json'), 'utf8'));
if (!CLASES[CLASE]) throw new Error(`Indique la clase: node build.mjs ${Object.keys(CLASES).join('|')}`);
const { nombre: NOMBRE, pie: PIE } = CLASES[CLASE];
const FUENTES = path.join(AQUI, 'clases', CLASE);
const BUILD = path.join(AQUI, 'build', CLASE);
const SALIDA = path.join(AQUI, '..');
fs.mkdirSync(path.join(BUILD, 'frames'), { recursive: true });

const macros = { '\\N': '\\mathcal{N}', '\\T': '\\mathcal{T}', '\\R': '\\mathbb{R}', '\\C': '\\mathcal{C}' };
const tex = (s, displayMode) => katex.renderToString(
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
  { displayMode, macros, throwOnError: true, output: 'html' });
const procesar = src => src
  .replace(/\{\{D:(\w+)\}\}/g, (_, n) => { if (!diagramas[n]) throw new Error('diagrama ' + n); return diagramas[n]; })
  .replace(/\$\$([\s\S]+?)\$\$/g, (_, s) => tex(s, true))
  // la puntuación que sigue a una fórmula no debe saltar sola de línea
  .replace(/\$([^$]+?)\$([.,;:)]+)?/g, (_, s, p) => p ? `<span class="nw">${tex(s, false)}${p}</span>` : tex(s, false));

const cabeza = css => `<!doctype html><html lang="es"><head><meta charset="utf-8">
${['katex/dist/katex.min.css', '@fontsource/ibm-plex-sans/400.css', '@fontsource/ibm-plex-sans/400-italic.css', '@fontsource/ibm-plex-sans/600.css']
  .map(f => `<link rel="stylesheet" href="file://${path.join(AQUI, 'node_modules', f)}">`).join('\n')}
<style>${fs.readFileSync(path.join(AQUI, 'comun.css'), 'utf8')}${fs.readFileSync(path.join(AQUI, css), 'utf8')}</style></head><body>`;

const escribir = (nombre, css, src) => {
  const f = path.join(BUILD, nombre);
  fs.writeFileSync(f, cabeza(css) + procesar(fs.readFileSync(path.join(FUENTES, src), 'utf8')) + '</body></html>');
  return 'file://' + f;
};
const urlDiap = escribir('diapositivas.html', 'diapositivas.css', 'diapositivas.src.html');
const urlApuntes = escribir('apuntes.html', 'apuntes.css', 'apuntes.src.html');

const browser = await chromium.launch();

// ---------- Diapositivas: un cuadro por paso ----------
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(urlDiap);
await page.evaluate(() => document.fonts.ready);
const pasos = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => {
  s.dataset.n = i + 1;
  return [...s.querySelectorAll('aside')].map(a => ({ paso: +a.dataset.s, texto: a.textContent.trim() }));
}));
const total = pasos.length;
const narracion = [];
for (let i = 0; i < total; i++) {
  for (const { paso, texto } of pasos[i]) {
    await page.evaluate(([i, paso, total]) => {
      document.querySelectorAll('.slide').forEach((s, j) => {
        s.style.display = j === i ? '' : 'none';
        if (j !== i) return;
        s.querySelectorAll('[data-s]:not(aside)').forEach(e => { e.style.visibility = +e.dataset.s <= paso ? 'visible' : 'hidden'; });
        s.dataset.pie = `${i + 1} / ${total}`;
      });
    }, [i, paso, total]);
    const desborde = await page.evaluate(i => {
      const s = document.querySelectorAll('.slide')[i];
      return s.scrollHeight > s.clientHeight + 1 || s.scrollWidth > s.clientWidth + 1;
    }, i);
    if (desborde) console.warn(`DESBORDE en diapositiva ${i + 1}`);
    const frame = `s${String(i + 1).padStart(2, '0')}_${paso}.png`;
    await page.screenshot({ path: path.join(BUILD, 'frames', frame) });
    narracion.push({ frame, texto, finDiapositiva: paso === pasos[i].at(-1).paso });
  }
}
fs.writeFileSync(path.join(BUILD, 'narracion.json'), JSON.stringify(narracion, null, 1));

// ---------- PDF de diapositivas (todo visible) ----------
await page.evaluate(() => document.querySelectorAll('.slide').forEach(s => {
  s.style.display = '';
  s.querySelectorAll('[data-s]:not(aside)').forEach(e => { e.style.visibility = 'visible'; });
}));
await page.pdf({ path: path.join(SALIDA, NOMBRE + '_diapositivas.pdf'), width: '1920px', height: '1080px', printBackground: true });

// ---------- PDF de apuntes ----------
const p2 = await browser.newPage();
await p2.goto(urlApuntes);
await p2.evaluate(() => document.fonts.ready);
await p2.pdf({
  path: path.join(SALIDA, NOMBRE + '_apuntes.pdf'), format: 'Letter', printBackground: true,
  displayHeaderFooter: true, headerTemplate: '<span></span>',
  footerTemplate: `<div style="width:100%;font:8pt sans-serif;color:#6b7280;padding:0 18mm;display:flex;justify-content:space-between"><span>${PIE}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  margin: { top: '18mm', bottom: '20mm', left: '18mm', right: '18mm' },
});
await browser.close();
console.log(`${narracion.length} pasos en ${total} diapositivas`);
