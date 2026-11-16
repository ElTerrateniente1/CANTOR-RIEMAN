// Captura los cuadros (PNG 1920×1080) de cada paso de cada escena y escribe el manifiesto.
//   node construir_cuadros.mjs nivel1 [nivel2 ...]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { paginaVideo } from './lib/pagina.mjs';
import { RAIZ } from './lib/estilos.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const SALIDA = process.env.VC_BUILD || path.join(RAIZ, 'build');
const N_ANIM = 30; // cuadros de la animación de trazo (1 s a 30 fps)
const suave = (t) => t * t * (3 - 2 * t);
const dos = (n) => String(n).padStart(2, '0');
/** Título en texto plano (para los capítulos del video). */
const llano = (t) => t.replace(/\$/g, '').replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/($2)').replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
  .replace(/\\bar z\^\{\\,2\}/g, 'z̄²').replace(/\\bar z/g, 'z̄').replace(/\\bar f/g, 'f̄').replace(/\^2/g, '²').replace(/\^\{\\,2\}/g, '²')
  .replace(/\\partial/g, '∂').replace(/\\pi/g, 'π').replace(/\\infty/g, '∞').replace(/\\int/g, '∫').replace(/\\oint/g, '∮').replace(/\\theta/g, 'θ')
  .replace(/\\(Re|Im|arg|Log|ln|cos|sen|tan|Res)\b/g, '$1').replace(/\\[,;!]/g, '').replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();

const ids = process.argv.slice(2);
const navegador = await chromium.launch();
let hayDesborde = false;
for (const id of ids) {
  const nivel = (await import(`./contenido/${id}.mjs`)).default;
  const { html, pasos } = paginaVideo(nivel);
  const dir = path.join(SALIDA, id), dirC = path.join(dir, 'cuadros');
  fs.rmSync(dirC, { recursive: true, force: true });
  fs.mkdirSync(dirC, { recursive: true });
  fs.writeFileSync(path.join(dir, 'pagina.html'), html);
  const pag = await navegador.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await pag.goto('file://' + path.join(dir, 'pagina.html'));
  await pag.evaluate(() => document.fonts.ready);
  const lienzo = pag.locator('#lienzo');
  const total = pasos.length;
  for (let i = 0; i < total; i++) {
    const { e, p } = pasos[i], frac = (i + 1) / total, base = `e${dos(e)}_p${dos(p)}`;
    const anim = await pag.evaluate(([a, b]) => window.animado(a, b), [e, p]);
    pasos[i].anim = [];
    if (anim) {
      for (let k = 0; k < N_ANIM; k++) {
        await pag.evaluate(([a, b, t, f]) => window.mostrar(a, b, t, f), [e, p, suave(k / N_ANIM), frac]);
        const f = `${base}_a${dos(k)}.png`;
        await lienzo.screenshot({ path: path.join(dirC, f) });
        pasos[i].anim.push(f);
      }
    }
    await pag.evaluate(([a, b, f]) => window.mostrar(a, b, 1, f), [e, p, frac]);
    pasos[i].cuadro = `${base}.png`;
    await lienzo.screenshot({ path: path.join(dirC, pasos[i].cuadro) });
    const ultimo = i === total - 1 || pasos[i + 1].e !== e;
    if (ultimo) {
      const d = await pag.evaluate((a) => window.desborde(a), e);
      if (d.abajo > 0 || d.derecha > 0) {
        hayDesborde = true;
        console.log(`  ⚠ ${id} escena ${e + 1} «${nivel.escenas[e].t || 'portada'}» se desborda: abajo ${d.abajo}px, derecha ${d.derecha}px`);
      }
    }
  }
  await pag.close();
  const palabras = pasos.reduce((s, x) => s + x.voz.split(/\s+/).length, 0);
  fs.writeFileSync(path.join(dir, 'manifiesto.json'), JSON.stringify({ id, titulo: nivel.titulo, etiqueta: nivel.etiqueta, fps: 30,
    escenas: nivel.escenas.map((e) => e.cap || (e.portada ? 'Presentación y objetivos' : llano(e.t))), pasos }, null, 1));
  console.log(`${id}: ${nivel.escenas.length} escenas, ${total} pasos, ${palabras} palabras de narración (≈${(palabras / 150).toFixed(1)} min)`);
}
await navegador.close();
if (hayDesborde) process.exitCode = 2;
