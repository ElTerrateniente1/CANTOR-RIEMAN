// Genera los PDF del paquete: portada + cuerpo (con índice paginado y marcadores).
// Uso: node fuentes/render_pdf.js [guia|practica|solucionario|guion ...]
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const SAL = path.join(RAIZ, "entregables");
const TMP = path.join(RAIZ, ".tmp");
const DOCS = {
  guia: ["guia.html", "AL2-M23-01_Guia_de_estudio.pdf"],
  practica: ["practica.html", "AL2-M23-02_Practica_de_parcial.pdf"],
  solucionario: ["solucionario.html", "AL2-M23-03_Solucionario_y_rubrica.pdf"],
  guion: ["video/guion.html", "AL2-M23-04_Guion_del_video.pdf"],
};

const pie = (codigo, titulo) => ({
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-family:Arial,sans-serif;font-size:7.5px;color:#5a6472;width:100%;padding:0 20mm;display:flex;justify-content:space-between">
     <span><b style="color:#1f3a5f">${codigo}</b> · ${titulo}</span><span>Álgebra 2 · Módulos 2 y 3 · v2.0</span></div>`,
  footerTemplate: `<div style="font-family:Arial,sans-serif;font-size:7.5px;color:#5a6472;width:100%;text-align:center">
     Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>`,
});

async function cargar(page, archivo, consulta) {
  await page.goto("file://" + path.join(RAIZ, "fuentes", archivo) + consulta, { waitUntil: "load" });
  await page.waitForFunction(() => window.__listo === true, null, { timeout: 60000 });
  const errores = await page.evaluate(() => window.__errores);
  if (errores.length) throw new Error("Errores de KaTeX en " + archivo + ":\n" + errores.join("\n"));
  return page.evaluate(() => window.DOC);
}

(async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(DOCS);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const clave of pedidos) {
    const [archivo, salida] = DOCS[clave];
    const opts = { format: "A4", printBackground: true, margin: { top: "22mm", bottom: "20mm", left: "20mm", right: "20mm" } };
    // 1) primera pasada con marcas invisibles para localizar la página de cada título
    const doc = await cargar(page, archivo, "?modo=cuerpo&marcas=1");
    const p1 = path.join(TMP, clave + "_p1.pdf");
    await page.pdf({ ...opts, path: p1 });
    const paginas = execFileSync("python3", ["-I", path.join(__dirname, "pdf_util.py"), "marcas", p1]).toString().trim();
    // 2) pasada definitiva con el índice paginado, encabezado/pie y marcadores
    await cargar(page, archivo, "?modo=cuerpo&paginas=" + encodeURIComponent(paginas));
    const cuerpo = path.join(TMP, clave + "_cuerpo.pdf");
    await page.pdf({ ...opts, ...pie(doc.codigo, doc.tipo), path: cuerpo, outline: true, tagged: true });
    // 3) portada sin encabezado ni pie
    await cargar(page, archivo, "?modo=portada");
    const portada = path.join(TMP, clave + "_portada.pdf");
    await page.pdf({ ...opts, path: portada, pageRanges: "1" });
    // 4) unión y metadatos
    const destino = path.join(SAL, salida);
    execFileSync("python3", ["-I", path.join(__dirname, "pdf_util.py"), "unir", portada, cuerpo, destino,
      `${doc.codigo} ${doc.tipo}: ${doc.titulo}`]);
    console.log("✔", salida, execFileSync("python3", ["-I", path.join(__dirname, "pdf_util.py"), "paginas", destino]).toString().trim(), "páginas");
  }
  await browser.close();
})().catch(e => { console.error(e.message || e); process.exit(1); });
