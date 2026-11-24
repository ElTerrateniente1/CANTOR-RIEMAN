// Captura cada plano del video como PNG 1920x1080.
// Uso: node capturar.js planos.json carpeta_salida
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const [lista, salida] = process.argv.slice(2);
  const planos = JSON.parse(fs.readFileSync(lista, "utf8"));
  fs.mkdirSync(salida, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const base = "file://" + path.join(__dirname, "diapositiva.html");
  const avisos = [];
  for (const pl of planos) {
    await page.goto(`${base}?c=${pl.c}&s=${pl.s}&p=${pl.p}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__listo === true, null, { timeout: 30000 });
    const est = await page.evaluate(() => ({ e: window.__errores, f: window.__fuente, d: window.__desborde }));
    if (est.e.length) throw new Error(`KaTeX en plano ${pl.id}: ${est.e.join(" | ")}`);
    if (est.d) avisos.push(`DESBORDE en plano ${pl.id}`);
    else if (est.f && est.f < 36) avisos.push(`plano ${pl.id}: letra reducida a ${est.f}px`);
    await page.screenshot({ path: path.join(salida, `${pl.id}.png`) });
  }
  await browser.close();
  avisos.forEach(a => console.log(a));
  console.log(`capturados ${planos.length} planos`);
})().catch(e => { console.error(e.message || e); process.exit(1); });
