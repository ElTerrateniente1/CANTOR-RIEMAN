// Genera Guia_Anillos_Modulos_0-2.pdf a partir de guia_anillos_modulos_0_2.html
// Uso (desde la raíz del repositorio): node algebra2/generar_pdf_guia.js
// Requiere Playwright con Chromium. MathJax se carga de cdn.jsdelivr.net; si la red lo bloquea,
// define MATHJAX_DIR con la carpeta de un `npm install mathjax@3.2.2` (node_modules/mathjax).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const dir = __dirname;
  const cuerpo = fs.readFileSync(path.join(dir, 'guia_anillos_modulos_0_2.html'), 'utf8');
  const html = '<!doctype html><html lang="es" data-theme="light"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + cuerpo + '</body></html>';
  const tmp = path.join(dir, '.tmp_guia.html');
  fs.writeFileSync(tmp, html);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  if (process.env.MATHJAX_DIR) {
    await page.route('https://cdn.jsdelivr.net/npm/mathjax@3.2.2/**', route => {
      const rel = new URL(route.request().url()).pathname.replace('/npm/mathjax@3.2.2/', '');
      route.fulfill({ path: path.join(process.env.MATHJAX_DIR, rel), contentType: 'application/javascript' });
    });
  }
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.MathJax && MathJax.startup && MathJax.startup.promise);
  await page.evaluate(() => MathJax.startup.promise);
  // Abrir los <details> para que las soluciones salgan en el PDF
  await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await page.evaluate(() => document.fonts.ready);
  if (process.argv[2]) await page.screenshot({ path: process.argv[2], fullPage: false });
  await page.pdf({
    path: path.join(dir, 'Guia_Anillos_Modulos_0-2.pdf'), format: 'A4', printBackground: true,
    margin: { top: '14mm', bottom: '16mm', left: '12mm', right: '12mm' },
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#777">Álgebra 2 · Anillos · Guía de estudio — <span class="pageNumber"></span>/<span class="totalPages"></span></div>'
  });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF generado');
})();
