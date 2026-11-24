// Lógica común de los documentos del paquete AL2-M23:
//  - portada uniforme de la serie (a partir de window.DOC)
//  - índice automático con números de página (inyectados por render.js)
//  - tipografía matemática con KaTeX y macros compartidas
(function () {
  const SERIE = [
    ["AL2-M23-01", "Guía de estudio: teoría, métodos y ejercicios"],
    ["AL2-M23-02", "Práctica de parcial (Forma A)"],
    ["AL2-M23-03", "Solucionario y rúbrica de calificación"],
    ["AL2-M23-04", "Video explicativo narrado, guion y subtítulos"],
  ];
  const MACROS = {
    "\\Z": "\\mathbb{Z}", "\\Q": "\\mathbb{Q}", "\\R": "\\mathbb{R}", "\\C": "\\mathbb{C}", "\\N": "\\mathbb{N}",
    "\\gen": "\\left\\langle #1 \\right\\rangle",
    "\\mcd": "\\operatorname{mcd}", "\\mcm": "\\operatorname{mcm}", "\\car": "\\operatorname{char}",
    "\\cl": "\\left[#1\\right]",
  };
  const params = new URLSearchParams(location.search);
  const modo = params.get("modo") || "todo";       // portada | cuerpo | todo
  const marcas = params.get("marcas") === "1";

  function portada() {
    const d = window.DOC;
    const items = SERIE.map(([c, t]) =>
      `<div class="item${c === d.codigo ? " actual" : ""}"><span class="cod">${c}</span><span>${t}</span></div>`).join("");
    const filas = [
      ["Código", d.codigo], ["Tipo de documento", d.tipo], ["Asignatura", "Álgebra 2: Teoría de anillos"],
      ["Alcance", "Módulo 2 (Dominios enteros) y Módulo 3 (Ideales)"],
      ["Fuente base", "Folleto de Álgebra 2: Anillos (Módulos 0–5)"],
      ["Versión", d.version + " · " + d.fecha],
    ].concat(d.extra || []);
    return `<section class="portada">
      <div class="banda">
        <div class="serie">Álgebra 2 · Paquete de preparación para el parcial</div>
        <div class="titulo">${d.titulo}</div>
        <div class="subtitulo">${d.subtitulo}</div>
      </div>
      <div class="ficha"><table>${filas.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table></div>
      <div class="serie-lista"><h4>Documentos de la serie</h4>${items}</div>
      ${d.nota ? `<p class="pequeno" style="margin-top:6mm">${d.nota}</p>` : ""}
      <div class="pie">Material de estudio elaborado a partir del folleto del curso. La numeración de definiciones,
      teoremas y ejemplos (p. ej. «Teorema 2.6») coincide con la del folleto; los resultados marcados como
      <i>complementarios</i> no aparecen en él y se incluyen para ampliar la práctica.</div>
    </section>`;
  }

  function indice() {
    const cont = document.querySelector(".indice[data-auto]");
    const heads = [...document.querySelectorAll("h1.capitulo, h2")].filter(h => !h.closest(".portada") && !h.hasAttribute("data-no-indice"));
    const paginas = JSON.parse(params.get("paginas") || "{}");
    heads.forEach((h, i) => {
      h.id = h.id || "s" + i;
      if (marcas) h.insertAdjacentHTML("beforeend", `<span style="color:#fff;font-size:1px">QQM${i}QQ</span>`);
    });
    if (!cont) return;
    cont.innerHTML = heads.map((h, i) => {
      const nivel = h.tagName === "H1" ? "e1" : "e2";
      let texto = h.dataset.indice;
      if (!texto) {  // conserva la matemática renderizada, sin el duplicado MathML ni las marcas
        const c = h.cloneNode(true);
        c.querySelectorAll(".katex-mathml, span[style*='font-size:1px']").forEach(e => e.remove());
        texto = c.innerHTML.trim();
      }
      const p = paginas[i] != null ? paginas[i] : "00";
      return `<div class="${nivel}"><a class="t" href="#${h.id}">${texto}</a><span class="puntos"></span><span class="p">${p}</span></div>`;
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (window.DOC) document.body.insertAdjacentHTML("afterbegin", portada());
    if (modo === "portada") {
      [...document.body.children].forEach(el => { if (!el.classList.contains("portada")) el.style.display = "none"; });
    } else if (modo === "cuerpo") {
      const p = document.querySelector(".portada"); if (p) p.remove();
    }
    window.__errores = [];
    renderMathInElement(document.body, {
      delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
      macros: MACROS, throwOnError: true,
      errorCallback: (msg, err) => window.__errores.push(msg + " " + err),
    });
    indice();
    document.fonts.ready.then(() => { window.__listo = true; });
  });
})();
