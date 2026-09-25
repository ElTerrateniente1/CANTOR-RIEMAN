// Genera Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pptx a partir del PDF
// de los puntos 2 y 3. Las citas [n] usan la misma numeración que el PDF
// (documento/referencias_temas_2_3.json, creado por generar_pdf_temas_2_3.py).
//
// Uso (desde la raíz del repositorio):
//   python3 documento/generar_pdf_temas_2_3.py
//   python3 presentacion/generar_toro.py
//   (cd presentacion && npm install && node generar_pptx.js)

const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");

const REFS = JSON.parse(fs.readFileSync(
  path.join(__dirname, "..", "documento", "referencias_temas_2_3.json"), "utf8"));
const NUM = Object.fromEntries(REFS.map((r) => [r.clave, r.n]));
const cita = (...claves) => "[" + claves.map((k) => {
  if (!(k in NUM)) throw new Error(`Referencia desconocida: ${k}`);
  return NUM[k];
}).join(", ") + "]";

// Paleta
const OSCURO = "1F2A36", CLARO = "F3EFE6", TEXTO = "2A323C", GRIS = "5F6773";
const PANEL = "F2F4F6", BLANCO = "FFFFFF", REGLA = "D9DDE2";
const VERDE = "1E6B66", VERDE_CLARO = "E0EEEC", VERDE_SOBRE_OSCURO = "8CCFC7";
const AZUL = "2F5D8A", AZUL_CLARO = "E3EBF3";
const NARANJA = "9A4E1B", NARANJA_RELLENO = "B5652B", NARANJA_SOBRE_OSCURO = "E3A26B";
const MUTED_OSCURO = "C9CFD6", CHIP_OSCURO = "2A3847";
const SERIF = "Cambria", SANS = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.title = "Del límite al espacio: Cauchy, Weierstrass, Riemann y Cantor";
pres.lang = "es-ES";

const W = 13.333, M = 0.6;
let numeroDiapositiva = 0;

function texto(slide, t, opts) {
  slide.addText(t, { isTextBox: true, margin: 0, fontFace: SANS, color: TEXTO, valign: "top", ...opts });
}

function encabezado(slide, antetitulo, titulo, color, oscuro = false) {
  texto(slide, antetitulo, { x: M, y: 0.42, w: W - 2 * M, h: 0.3, fontSize: 12, bold: true,
    charSpacing: 2, color });
  texto(slide, titulo, { x: M, y: 0.72, w: W - 2 * M, h: 0.75, fontFace: SERIF, fontSize: 32,
    bold: true, color: oscuro ? CLARO : OSCURO, valign: "middle" });
}

function pie(slide, fuentes, oscuro = false) {
  numeroDiapositiva += 1;
  const color = oscuro ? MUTED_OSCURO : GRIS;
  if (fuentes) {
    texto(slide, `Fuentes: ${fuentes} (lista completa con enlaces al final)`, { x: M, y: 6.98, w: 10.5,
      h: 0.3, fontSize: 10, color });
  }
  texto(slide, String(numeroDiapositiva), { x: W - M - 0.6, y: 6.98, w: 0.6, h: 0.3, fontSize: 10,
    color, align: "right" });
}

function circulo(slide, x, y, d, relleno, etiqueta, tam = 16, colorTexto = BLANCO) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: relleno }, line: { color: relleno } });
  texto(slide, etiqueta, { x, y, w: d, h: d, fontFace: SERIF, fontSize: tam, bold: true,
    color: colorTexto, align: "center", valign: "middle" });
}

// Fila «año en círculo + título + texto», usada en Riemann y Cantor.
function fila(slide, y, anio, titulo, cuerpo, color, ancho = 6.2) {
  circulo(slide, M, y, 0.9, color, anio, 13);
  texto(slide, titulo, { x: M + 1.15, y: y - 0.02, w: ancho, h: 0.38, fontSize: 17, bold: true, color: OSCURO });
  texto(slide, cuerpo, { x: M + 1.15, y: y + 0.38, w: ancho, h: 0.72, fontSize: 13.5, color: TEXTO });
}

// ------------------------------------------------------------------ 1. Portada
{
  const s = pres.addSlide();
  s.background = { color: OSCURO };
  texto(s, "GÉNESIS DE LA MATEMÁTICA · PUNTOS 2 Y 3 DE LA PRESENTACIÓN", { x: 0.9, y: 1.1, w: 11.5, h: 0.35,
    fontSize: 13, bold: true, charSpacing: 3, color: MUTED_OSCURO });
  texto(s, "Del límite al espacio", { x: 0.9, y: 1.5, w: 11.5, h: 1.2, fontFace: SERIF, fontSize: 60,
    bold: true, color: CLARO, valign: "middle" });
  texto(s, "Cauchy y Weierstrass (siglo XIX) · Riemann y Cantor (finales del siglo XIX)", { x: 0.9, y: 2.75,
    w: 11.5, h: 0.5, fontSize: 22, color: MUTED_OSCURO });
  const personas = [
    ["C", "Cauchy", "1789–1857", VERDE], ["W", "Weierstrass", "1815–1897", VERDE],
    ["R", "Riemann", "1826–1866", AZUL], ["C", "Cantor", "1845–1918", NARANJA_RELLENO],
  ];
  personas.forEach(([ini, nombre, fechas, color], i) => {
    const x = 0.9 + i * 2.4;
    circulo(s, x, 3.8, 1.0, color, ini, 28);
    texto(s, nombre, { x: x - 0.3, y: 4.9, w: 1.6, h: 0.35, fontSize: 16, bold: true, color: CLARO, align: "center" });
    texto(s, fechas, { x: x - 0.3, y: 5.25, w: 1.6, h: 0.3, fontSize: 13, color: MUTED_OSCURO, align: "center" });
  });
  texto(s, "Cauchy y Weierstrass precisaron qué significa acercarse a un punto; Riemann y Cantor se preguntaron " +
    "cómo es el espacio en el que uno se acerca.", { x: 0.9, y: 6.0, w: 11.5, h: 0.8, fontFace: SERIF,
    fontSize: 19, italic: true, color: NARANJA_SOBRE_OSCURO });
  pie(s, null, true);
  s.addNotes("Presentación de los puntos 2 (Cauchy–Weierstrass) y 3 (Riemann–Cantor). Cada dato lleva una cita " +
    "numerada que coincide con el documento PDF; la lista completa de fuentes con enlaces está al final. " +
    "Las «lecturas epistemológicas» son interpretación y se señalan como tales.");
}

// -------------------------------------------------------------- 2. Hoja de ruta
{
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "HOJA DE RUTA", "Dónde encajan los puntos 2 y 3", GRIS);
  const puntos = [
    ["1", "1736", "Euler", "Puentes de Königsberg: solo importa la conexión", null],
    ["2", "Siglo XIX", "Cauchy y Weierstrass", "Rigor del análisis: límite, continuidad, ε–δ", VERDE],
    ["3", "Fines del XIX", "Riemann y Cantor", "Forma global del espacio y conjuntos de puntos", AZUL],
    ["4", "1906", "Fréchet", "Espacios métricos abstractos", null],
    ["5", "1914", "Hausdorff", "Axiomas de espacio topológico", null],
  ];
  const w = 2.2, g = (W - 2 * M - 5 * w) / 4, y = 1.9, h = 2.5;
  puntos.forEach(([n, fecha, nombre, desc, color], i) => {
    const x = M + i * (w + g);
    const activo = color !== null;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08,
      fill: { color: activo ? color : PANEL }, line: { color: activo ? color : REGLA } });
    circulo(s, x + 0.2, y + 0.2, 0.55, activo ? BLANCO : GRIS, n, 16, activo ? color : BLANCO);
    texto(s, fecha, { x: x + 0.9, y: y + 0.3, w: w - 1.0, h: 0.35, fontSize: 12, bold: true,
      color: activo ? CLARO : GRIS });
    texto(s, nombre, { x: x + 0.2, y: y + 0.95, w: w - 0.4, h: 0.65, fontSize: 17, bold: true,
      color: activo ? BLANCO : OSCURO });
    texto(s, desc, { x: x + 0.2, y: y + 1.6, w: w - 0.4, h: 0.8, fontSize: 12.5,
      color: activo ? CLARO : TEXTO });
    if (i < puntos.length - 1) {
      s.addShape(pres.shapes.RIGHT_ARROW, { x: x + w + (g - 0.2) / 2, y: y + h / 2 - 0.1, w: 0.2, h: 0.2,
        fill: { color: GRIS }, line: { color: GRIS } });
    }
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.85, w: W - 2 * M, h: 1.75, rectRadius: 0.08,
    fill: { color: PANEL }, line: { color: PANEL } });
  texto(s, "INTERPRETACIÓN", { x: M + 0.3, y: 5.0, w: 4, h: 0.3, fontSize: 11, bold: true, charSpacing: 2, color: GRIS });
  texto(s, [
    { text: "El punto 2 aporta el lenguaje riguroso: límite, continuidad, convergencia. ", options: {} },
    { text: "El punto 3 lleva ese rigor al espacio mismo: su forma global (Riemann) y su estructura punto a punto " +
      "(Cantor). ", options: {} },
    { text: "Fréchet y Hausdorff abstraen después esos conceptos.", options: {} },
  ], { x: M + 0.3, y: 5.35, w: W - 2 * M - 0.6, h: 1.1, fontSize: 16, color: TEXTO });
  pie(s, `Euler ${cita("euler")}; Fréchet ${cita("frechet")}; Hausdorff ${cita("hausdorff")}`);
  s.addNotes("Euler (1736) resolvió el problema de los puentes de Königsberg atendiendo solo a la conexión " +
    `${cita("euler")}. Fréchet (1906) introdujo los espacios métricos abstractos ${cita("frechet")} y Hausdorff ` +
    `(1914) axiomatizó el espacio topológico ${cita("hausdorff")}. Nuestros puntos, 2 y 3, son el puente: primero ` +
    "el rigor del análisis y después la pregunta por el espacio.");
}

// ---------------------------------------------------------------- 3. Cauchy
{
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "PUNTO 2 · SIGLO XIX", "Cauchy: definir el límite", VERDE);
  circulo(s, M, 1.75, 1.1, VERDE, "C", 30);
  texto(s, "Augustin-Louis Cauchy", { x: M + 1.3, y: 1.8, w: 2.6, h: 0.7, fontFace: SERIF, fontSize: 20,
    bold: true, color: OSCURO });
  texto(s, "1789–1857", { x: M + 1.3, y: 2.5, w: 2.6, h: 0.3, fontSize: 14, color: GRIS });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 3.15, w: 3.7, h: 3.4, rectRadius: 0.08,
    fill: { color: VERDE_CLARO }, line: { color: VERDE_CLARO } });
  texto(s, "DEFINICIÓN DE LÍMITE (1821)", { x: M + 0.25, y: 3.35, w: 3.2, h: 0.3, fontSize: 11, bold: true,
    charSpacing: 1, color: VERDE });
  texto(s, "«Cuando los valores atribuidos sucesivamente a una variable se aproximan indefinidamente a un " +
    "valor fijo, hasta diferir de él tan poco como se quiera, ese valor fijo se llama el límite de todos los " +
    "demás».", { x: M + 0.25, y: 3.75, w: 3.2, h: 2.2, fontFace: SERIF, fontSize: 15, italic: true, color: OSCURO });
  texto(s, `Cours d’analyse ${cita("cours")}`, { x: M + 0.25, y: 6.05, w: 3.2, h: 0.3, fontSize: 11, color: GRIS });

  const tarjetas = [
    ["1821", "Cours d’analyse", "Busca «todo el rigor que se exige en geometría», sin la «generalidad del álgebra».", cita("cours")],
    ["1821", "Límite e infinitésimo", "Infinitésimo: variable cuyo límite es cero; con esa noción formula la continuidad.", cita("cours")],
    ["1821", "Criterio de convergencia", "Publicado en el Cours d’analyse: origen de las hoy llamadas sucesiones de Cauchy.", cita("criterio")],
    ["1825", "Teorema integral", "Para una función holomorfa, la integral depende solo de los extremos del camino.", cita("integral_rev", "integral_wiki")],
  ];
  const x0 = 4.65, cw = (W - M - x0 - 0.3) / 2, ch = 1.9;
  tarjetas.forEach(([anio, tit, desc, ref], i) => {
    const x = x0 + (i % 2) * (cw + 0.3), y = 1.75 + Math.floor(i / 2) * (ch + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: PANEL },
      line: { color: PANEL } });
    texto(s, anio, { x: x + 0.25, y: y + 0.2, w: 1.2, h: 0.45, fontFace: SERIF, fontSize: 24, bold: true, color: VERDE });
    texto(s, tit, { x: x + 0.25, y: y + 0.7, w: cw - 0.5, h: 0.35, fontSize: 16, bold: true, color: OSCURO });
    texto(s, `${desc} ${ref}`, { x: x + 0.25, y: y + 1.08, w: cw - 0.5, h: 0.85, fontSize: 13.5, color: TEXTO });
  });
  texto(s, `Matiz: Cauchy no dio una definición ε–δ formal, aunque usó ε y δ en algunas pruebas ${cita("epsdelta")}; ` +
    `su teorema de 1821 sobre sumas de funciones continuas recibió objeciones de Abel en 1826 ${cita("uniforme")}.`,
    { x: x0, y: 6.0, w: W - M - x0, h: 0.8, fontSize: 12.5, italic: true, color: GRIS });
  pie(s, [cita("cours"), cita("criterio"), cita("integral_rev", "integral_wiki"), cita("epsdelta"), cita("uniforme")].join(" "));
  s.addNotes("Cauchy escribió el Cours d’analyse (1821) a partir de su curso en la École Polytechnique; en el prefacio " +
    `declara buscar el rigor de la geometría sin apoyarse en la «generalidad del álgebra» ${cita("cours")}. Define ` +
    "límite, infinitésimo (variable con límite cero) y, con ello, la continuidad. Publica allí su criterio de " +
    `convergencia ${cita("criterio")}. En 1825 formula el teorema integral para funciones holomorfas ` +
    `${cita("integral_rev", "integral_wiki")}; la primera prueba completa es de Goursat. Matiz: no hay en Cauchy una ` +
    `definición ε–δ formal ${cita("epsdelta")}.`);
}

// ------------------------------------------------------------- 4. Weierstrass
{
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "PUNTO 2 · SIGLO XIX", "Weierstrass: aritmetizar el análisis", VERDE);
  const hitos = [
    ["1841", "Convergencia uniforme: acuña «gleichmäßig konvergent» (publicado en 1894).", cita("uniforme")],
    ["1856", "Enseña en Berlín (Gewerbeinstitut y Universidad); su obra circula por sus lecciones.", cita("britannica_w")],
    ["1861", "Lecciones con la definición ε–δ de límite en su forma actual (notas de Schwarz).", cita("epsdelta", "sinkevich")],
    ["1870", "Contraejemplo: el principio de Dirichlet, usado por Riemann, no está garantizado.", cita("dirichlet", "fantasias")],
    ["1872", "Función continua sin derivada en ningún punto (18 de julio, Academia de Berlín).", cita("quanta")],
  ];
  const ancho = (W - 2 * M) / hitos.length;
  s.addShape(pres.shapes.LINE, { x: M + 0.45, y: 2.1, w: ancho * (hitos.length - 1), h: 0,
    line: { color: REGLA, width: 2 } });
  hitos.forEach(([anio, desc, ref], i) => {
    const x = M + i * ancho;
    circulo(s, x, 1.65, 0.9, VERDE, anio, 13);
    texto(s, `${desc} ${ref}`, { x, y: 2.75, w: ancho - 0.3, h: 1.3, fontSize: 13, color: TEXTO });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.3, w: 5.6, h: 2.4, rectRadius: 0.08,
    fill: { color: VERDE_CLARO }, line: { color: VERDE_CLARO } });
  texto(s, [
    { text: "Aritmetización del análisis", options: { bold: true, fontSize: 16, color: OSCURO, breakLine: true } },
    { text: `Fundar el análisis en un desarrollo riguroso de los números reales, reduciendo su dependencia de la ` +
      `geometría ${cita("britannica_w")}.`, options: { fontSize: 13.5, breakLine: true } },
    { text: " ", options: { fontSize: 8, breakLine: true } },
    { text: "Bolzano–Weierstrass", options: { bold: true, fontSize: 16, color: OSCURO, breakLine: true } },
    { text: `Todo conjunto infinito y acotado de reales tiene un punto límite (Bolzano lo probó en 1817) ` +
      `${cita("bw")}.`, options: { fontSize: 13.5 } },
  ], { x: M + 0.3, y: 4.5, w: 5.0, h: 2.1, color: TEXTO });

  // Suma parcial de la función de Weierstrass W(x) = Σ a^n cos(b^n π x), a = 0,5, b = 13.
  const xs = [], ys = [];
  for (let i = 0; i <= 800; i++) {
    const x = i / 800;
    let y = 0;
    for (let n = 0; n < 3; n++) y += Math.pow(0.5, n) * Math.cos(Math.pow(13, n) * Math.PI * x);
    xs.push(x.toFixed(3));
    ys.push(Number(y.toFixed(4)));
  }
  s.addChart(pres.charts.LINE, [{ name: "Suma parcial", labels: xs, values: ys }], {
    x: 6.6, y: 4.25, w: W - M - 6.6, h: 2.1, chartColors: [VERDE], lineSize: 1.5, lineDataSymbol: "none",
    showLegend: false, catAxisHidden: true, valAxisHidden: true,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: false,
  });
  texto(s, "Suma parcial (3 términos) de Σ aⁿ cos(bⁿπx), con a = 0,5 y b = 13: la serie completa es continua " +
    "pero no derivable en ningún punto.", { x: 6.6, y: 6.35, w: W - M - 6.6, h: 0.55, fontSize: 11.5, color: GRIS });
  pie(s, [cita("uniforme"), cita("britannica_w"), cita("epsdelta", "sinkevich"), cita("bw"),
    cita("dirichlet", "fantasias"), cita("quanta")].join(" "));
  s.addNotes("Weierstrass enseñó en Berlín desde 1856 y publicó poco: su influencia pasó por sus lecciones " +
    `${cita("britannica_w")}. Su programa fue aritmetizar el análisis. En 1841 usó el término «convergencia ` +
    `uniforme» (su maestro Gudermann había observado el fenómeno en 1838) ${cita("uniforme")}. En sus lecciones de ` +
    `1861 aparece la definición ε–δ en su forma actual; Bolzano la había anticipado en 1817 ${cita("epsdelta", "sinkevich")}. ` +
    `En 1870 objetó el principio de Dirichlet que usaba Riemann ${cita("dirichlet", "fantasias")}, y el 18 de julio de ` +
    `1872 presentó una función continua sin derivada en ningún punto ${cita("quanta")}. El gráfico es solo una suma ` +
    "parcial ilustrativa: la suma parcial sí es derivable; la no derivabilidad es de la serie completa.");
}

// ------------------------------------------- 5. Lectura epistemológica (tema 2)
{
  const s = pres.addSlide();
  s.background = { color: PANEL };
  encabezado(s, "PUNTO 2 · LECTURA EPISTEMOLÓGICA (INTERPRETACIÓN, NO DATO)", "El rigor se gana cuando la intuición falla", VERDE);
  const cols = [
    ["1", "Qué cambia", "De la imagen geométrica a la definición aritmética. La función de Weierstrass (1872) " +
      `muestra que «continuo» no implica «liso» ${cita("quanta")}: la imagen ya no basta para decidir qué es verdad.`],
    ["2", "Cautela historiográfica", "El relato «Cauchy prepara, Weierstrass culmina» se discute: Borovik y Katz " +
      "sostienen que leer a Cauchy «como si ya hubiera leído a Weierstrass» es anacrónico, porque Cauchy razonaba " +
      `con infinitésimos ${cita("borovik")}.`],
  ];
  const cw = (W - 2 * M - 0.4) / 2;
  cols.forEach(([n, tit, desc], i) => {
    const x = M + i * (cw + 0.4), y = 1.9;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: 3.3, rectRadius: 0.08, fill: { color: BLANCO },
      line: { color: BLANCO }, shadow: { type: "outer", color: "000000", opacity: 0.08, blur: 6, offset: 2, angle: 90 } });
    circulo(s, x + 0.4, y + 0.4, 0.8, VERDE, n, 20);
    texto(s, tit, { x: x + 1.45, y: y + 0.52, w: cw - 1.8, h: 0.55, fontSize: 22, bold: true, color: OSCURO });
    texto(s, desc, { x: x + 0.4, y: y + 1.4, w: cw - 0.8, h: 1.8, fontSize: 18, color: TEXTO });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.5, w: W - 2 * M, h: 1.1, rectRadius: 0.08,
    fill: { color: VERDE_CLARO }, line: { color: VERDE_CLARO } });
  texto(s, [
    { text: "Pregunta para la clase: ", options: { bold: true, color: VERDE } },
    { text: "si la imagen geométrica puede engañar, ¿qué nos autoriza a afirmar una propiedad del espacio? " +
      "El punto 3 empieza justamente ahí.", options: { color: OSCURO } },
  ], { x: M + 0.3, y: 5.5, w: W - 2 * M - 0.6, h: 1.1, fontSize: 17, valign: "middle" });
  pie(s, `${cita("quanta")} ${cita("borovik")}`);
  s.addNotes("Esta diapositiva es interpretación. Idea: el rigor del siglo XIX responde a casos en que la intuición " +
    "geométrica engaña. Cautela: la historia lineal de Cauchy a Weierstrass es discutida por historiadores " +
    `(Borovik y Katz, 2012) ${cita("borovik")}.`);
}

// ------------------------------------------------------------- 6. Transición
{
  const s = pres.addSlide();
  s.background = { color: OSCURO };
  encabezado(s, "TRANSICIÓN AL PUNTO 3", "Del rigor del límite a la pregunta por el espacio", MUTED_OSCURO, true);
  texto(s, "CAUCHY · WEIERSTRASS", { x: M, y: 1.9, w: 5.4, h: 0.3, fontSize: 13, bold: true, charSpacing: 2,
    color: VERDE_SOBRE_OSCURO });
  texto(s, "¿Qué significa acercarse a un punto?", { x: M, y: 2.25, w: 5.4, h: 1.3, fontFace: SERIF, fontSize: 32,
    color: CLARO });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.25, y: 2.55, w: 0.8, h: 0.5, fill: { color: NARANJA_SOBRE_OSCURO },
    line: { color: NARANJA_SOBRE_OSCURO } });
  texto(s, "RIEMANN · CANTOR", { x: 7.3, y: 1.9, w: 5.4, h: 0.3, fontSize: 13, bold: true, charSpacing: 2,
    color: NARANJA_SOBRE_OSCURO });
  texto(s, "¿Cómo es el espacio en el que uno se acerca?", { x: 7.3, y: 2.25, w: 5.4, h: 1.3, fontFace: SERIF,
    fontSize: 32, color: CLARO });
  texto(s, "PUENTES DOCUMENTADOS", { x: M, y: 4.3, w: 6, h: 0.3, fontSize: 12, bold: true, charSpacing: 2,
    color: MUTED_OSCURO });
  const chips = [
    `Cantor se formó en Berlín con Weierstrass ${cita("enc_c")}`,
    `Cantor construye los números reales con sucesiones de Cauchy (1872) ${cita("enc_c2")}`,
    `Weierstrass exige rigor a los argumentos de Riemann (1870) ${cita("fantasias")}`,
  ];
  const cw = (W - 2 * M - 0.6) / 3;
  chips.forEach((t, i) => {
    const x = M + i * (cw + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.7, w: cw, h: 1.5, rectRadius: 0.08,
      fill: { color: CHIP_OSCURO }, line: { color: CHIP_OSCURO } });
    texto(s, t, { x: x + 0.3, y: 4.9, w: cw - 0.6, h: 1.1, fontSize: 16, color: CLARO, valign: "middle" });
  });
  pie(s, `${cita("enc_c")} ${cita("enc_c2")} ${cita("fantasias")}`, true);
  s.addNotes("Guion: «Cauchy y Weierstrass dieron al análisis un lenguaje exacto, pero trabajaban sobre un escenario " +
    "que nadie cuestionaba: la recta y el plano. El paso siguiente fue preguntar por el propio espacio». Puentes " +
    `documentados: Cantor fue alumno de Weierstrass en Berlín ${cita("enc_c")}; construyó los reales con sucesiones ` +
    `de Cauchy ${cita("enc_c2")}; Weierstrass objetó en 1870 el principio de Dirichlet que usaba Riemann ` +
    `${cita("fantasias")}. Puente conceptual (interpretación): el teorema integral de Cauchy depende de la región ` +
    `${cita("integral_wiki")}, y Riemann convirtió la conectividad de esa región en objeto de estudio ${cita("mactutor_r")}.`);
}

// -------------------------------------------------------------- 7. Riemann
{
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "PUNTO 3 · FINALES DEL SIGLO XIX", "Riemann: la forma global del espacio", AZUL);
  fila(s, 1.8, "1851", "Superficies de Riemann",
    `Tesis en Gotinga (supervisión formal de Gauss): superficies para funciones complejas; estudia su conectividad ${cita("enc_r", "mactutor_r")}.`, AZUL);
  fila(s, 3.2, "1854", "Variedades de varias dimensiones",
    `Lección de habilitación del 10 de junio: noción de variedad (Mannigfaltigkeit) ${cita("riemann_1854", "aps")}.`, AZUL);
  fila(s, 4.6, "1857", "Cortes y género",
    `Mide la conectividad con cortes; Clebsch llama «género» a ese número (1865) ${cita("clebsch")}. Raíz de los números de Betti ${cita("weibel")}.`, AZUL);
  s.addImage({ path: path.join(__dirname, "img", "toro.png"), x: 8.2, y: 1.8, w: 4.53, h: 2.91 });
  texto(s, "Ilustración didáctica (no tomada de Riemann): el anillo azul y el naranja son dos cortes que vuelven " +
    "simplemente conexo al toro (género 1).", { x: 8.2, y: 4.85, w: 4.53, h: 0.85, fontSize: 12, color: GRIS });
  texto(s, `Matiz: Riemann murió en 1866; lo «de fin de siglo» es su recepción: Betti (1871) y Poincaré (1895) ${cita("weibel", "betti")}.`,
    { x: M, y: 6.25, w: W - 2 * M, h: 0.45, fontSize: 13, italic: true, color: GRIS });
  pie(s, [cita("enc_r", "mactutor_r"), cita("riemann_1854", "aps"), cita("clebsch"), cita("weibel", "betti")].join(" "));
  s.addNotes("Riemann escribió su tesis en 1851 bajo la supervisión formal de Gauss: definió las superficies que llevan " +
    "su nombre, estudió la conectividad de las superficies e introdujo métodos topológicos en la teoría de funciones " +
    `${cita("enc_r", "mactutor_r")}. En la lección del 10 de junio de 1854 introdujo la noción de variedad ` +
    `${cita("riemann_1854", "aps")}. En 1857 midió la conectividad mediante cortes; Clebsch llamó «género» a ese ` +
    `número en 1865 ${cita("clebsch")}. Con Betti (1871) y Poincaré (1895) esa línea lleva a los números de Betti ` +
    `${cita("weibel", "betti")}. Matiz: murió en 1866.`);
}

// --------------------------------------------------------------- 8. Cantor
{
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "PUNTO 3 · FINALES DEL SIGLO XIX", "Cantor: la estructura fina del espacio", NARANJA);
  fila(s, 1.7, "1870", "Un problema de origen",
    `Heine le plantea la unicidad de las series trigonométricas; usa dos resultados de Riemann ${cita("mactutor_c", "kechris")}.`, NARANJA_RELLENO);
  fila(s, 2.95, "1872", "Punto límite y conjunto derivado",
    `P′ reúne los puntos límite de P; construye los reales con sucesiones de Cauchy ${cita("cantor_1872", "mathdl", "enc_c2")}.`, NARANJA_RELLENO);
  fila(s, 4.2, "1877", "¿Qué es la dimensión?",
    `Reales no numerables (1874) ${cita("cantor_1874")}. Biyección segmento–cuadrado; Dedekind: solo con continuidad; Brouwer, 1911 ${cita("gouvea", "utrecht")}.`, NARANJA_RELLENO);
  fila(s, 5.45, "1883", "Continuo y conjunto ternario",
    `Continuo = perfecto + conexo; conjunto perfecto sin intervalos (antecedente: Smith, 1875) ${cita("cantor_set")}.`, NARANJA_RELLENO);
  // Conjunto de Cantor (5 etapas), dibujado con rectángulos nativos.
  const x0 = 8.5, largo = W - M - x0;
  let intervalos = [[0, 1]];
  for (let n = 0; n < 5; n++) {
    const y = 1.9 + n * 0.55;
    intervalos.forEach(([a, b]) => {
      s.addShape(pres.shapes.RECTANGLE, { x: x0 + a * largo, y, w: Math.max((b - a) * largo, 0.02), h: 0.25,
        fill: { color: NARANJA_RELLENO }, line: { type: "none" } });
    });
    intervalos = intervalos.flatMap(([a, b]) => { const t = (b - a) / 3; return [[a, a + t], [b - t, b]]; });
  }
  texto(s, "0", { x: x0 - 0.1, y: 4.65, w: 0.3, h: 0.3, fontSize: 11, color: GRIS });
  texto(s, "1", { x: x0 + largo - 0.2, y: 4.65, w: 0.3, h: 0.3, fontSize: 11, color: GRIS, align: "right" });
  texto(s, "Primeras etapas del conjunto ternario: se quita siempre el tercio central. Queda un conjunto perfecto " +
    "y no numerable, pero sin un solo intervalo.", { x: x0, y: 5.05, w: largo, h: 0.9, fontSize: 12, color: GRIS });
  pie(s, [cita("mactutor_c", "kechris"), cita("cantor_1872", "mathdl", "enc_c2"), cita("cantor_1874"),
    cita("gouvea", "utrecht"), cita("cantor_set")].join(" "));
  s.addNotes(`Cantor estudió en Berlín con Kronecker, Kummer y Weierstrass ${cita("enc_c")}. Heine le propuso la ` +
    `unicidad de la representación por series trigonométricas; lo probó hacia abril de 1870 ${cita("mactutor_c")} ` +
    `usando resultados de Riemann ${cita("kechris")}. En 1872 definió punto límite y conjunto derivado ` +
    `${cita("cantor_1872", "mathdl")} y construyó los reales con «series fundamentales» ${cita("enc_c2")}. En 1874 ` +
    `probó que los reales no son numerables ${cita("cantor_1874")}. En 1877 halló una biyección entre segmento y ` +
    `cuadrado («Je le vois, mais je ne le crois pas», carta a Dedekind del 29 de junio) ${cita("gouvea")}; Dedekind ` +
    `respondió que la dimensión solo se conserva con biyecciones continuas; Brouwer lo probó en 1911 ${cita("utrecht")}. ` +
    `En 1883 definió el continuo como conjunto perfecto y conexo y presentó el conjunto ternario ${cita("cantor_set")}.`);
}

// --------------------------------------------------------------- 9. Síntesis
{
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "SÍNTESIS", "Qué hizo cada uno", GRIS);
  const cab = (t) => ({ text: t, options: { bold: true, color: OSCURO, fill: { color: PANEL }, fontSize: 13 } });
  const nombre = (t, color) => ({ text: t, options: { bold: true, color, fontSize: 15 } });
  const celda = (t) => ({ text: t, options: { fontSize: 13.5, color: TEXTO } });
  const filas = [
    [cab("QUIÉN"), cab("QUÉ HIZO (SELECCIÓN)"), cab("POR QUÉ IMPORTA PARA LA TOPOLOGÍA")],
    [nombre("Cauchy", VERDE), celda("Límite, infinitésimo y continuidad (1821); criterio de convergencia; teorema integral (1825)"),
      celda("Da el lenguaje de la convergencia y muestra que la integral depende de la región")],
    [nombre("Weierstrass", VERDE), celda("ε–δ (1861); convergencia uniforme; Bolzano–Weierstrass; función sin derivada (1872)"),
      celda("Aritmetiza el análisis y separa la verdad de la intuición geométrica")],
    [nombre("Riemann", AZUL), celda("Superficies y conectividad (1851); variedades (1854); cortes y género (1857)"),
      celda("Estudia la forma global: raíz de la topología algebraica (Betti, Poincaré)")],
    [nombre("Cantor", NARANJA), celda("Punto límite y conjunto derivado (1872); numerabilidad (1874); dimensión (1877); continuo (1883)"),
      celda("Crea el vocabulario de la topología de conjuntos que abstraen Fréchet y Hausdorff")],
  ];
  s.addTable(filas, { x: M, y: 1.75, w: W - 2 * M, colW: [1.9, 5.3, W - 2 * M - 7.2], fontFace: SANS,
    border: { type: "solid", pt: 0.75, color: REGLA }, valign: "middle", rowH: [0.5, 0.95, 0.95, 0.95, 0.95],
    margin: [0.08, 0.14, 0.08, 0.14] });
  texto(s, "Interpretación: los conceptos topológicos nacen resolviendo problemas del análisis (funciones " +
    "multivaluadas, series trigonométricas) y después se independizan de ellos.", { x: M, y: 6.25, w: W - 2 * M,
    h: 0.55, fontSize: 14, italic: true, color: GRIS });
  pie(s, "ver diapositivas 3, 4, 7 y 8");
  s.addNotes("Resumen de los cuatro personajes; las fuentes de cada dato están en las diapositivas anteriores y en el PDF.");
}

// ---------------------------------------------------- 10. Hacia los puntos 4 y 5
{
  const s = pres.addSlide();
  s.background = { color: OSCURO };
  encabezado(s, "ENLACE CON LOS PUNTOS 1, 4 Y 5", "De Euler a Hausdorff, pasando por el siglo XIX", MUTED_OSCURO, true);
  const cols = [
    ["1736", "Euler", `Puentes de Königsberg: el resultado depende solo de la conexión, no de las longitudes ${cita("euler")}.`, MUTED_OSCURO],
    ["1906", "Fréchet", `Tesis Sur quelques points du calcul fonctionnel: espacios métricos abstractos y compacidad ${cita("frechet")}.`, NARANJA_SOBRE_OSCURO],
    ["1914", "Hausdorff", `Grundzüge der Mengenlehre: axiomatiza el espacio topológico mediante entornos ${cita("hausdorff")}.`, VERDE_SOBRE_OSCURO],
  ];
  const cw = (W - 2 * M - 0.8) / 3;
  cols.forEach(([anio, nombre, desc, color], i) => {
    const x = M + i * (cw + 0.4);
    circulo(s, x, 1.85, 1.0, color, anio, 15, OSCURO);
    texto(s, nombre, { x: x + 1.2, y: 2.05, w: cw - 1.2, h: 0.6, fontFace: SERIF, fontSize: 24, bold: true, color: CLARO });
    texto(s, desc, { x, y: 3.05, w: cw - 0.2, h: 1.6, fontSize: 16, color: MUTED_OSCURO });
  });
  texto(s, "Riemann preguntó por la forma del espacio; Cantor, por sus puntos. Fréchet y Hausdorff convirtieron " +
    "esas preguntas en definiciones abstractas.", { x: M, y: 5.2, w: W - 2 * M, h: 1.0, fontFace: SERIF,
    fontSize: 22, italic: true, color: NARANJA_SOBRE_OSCURO });
  pie(s, `${cita("euler")} ${cita("frechet")} ${cita("hausdorff")}`, true);
  s.addNotes(`Euler (1736) ${cita("euler")}; Fréchet (1906) ${cita("frechet")}; Hausdorff (1914) ${cita("hausdorff")}. ` +
    "La frase final es una síntesis interpretativa.");
}

// ------------------------------------------------------------ 11–12. Fuentes
[REFS.slice(0, 17), REFS.slice(17)].forEach((grupo, i) => {
  const s = pres.addSlide();
  s.background = { color: BLANCO };
  encabezado(s, "FUENTES", `Fuentes con enlace (${i + 1}/2)`, GRIS);
  const runs = [];
  grupo.forEach((r, j) => {
    runs.push({ text: `[${r.n}] ${r.texto} `, options: { color: TEXTO } });
    runs.push({ text: r.url, options: { hyperlink: { url: r.url }, color: AZUL, breakLine: j < grupo.length - 1 } });
  });
  texto(s, runs, { x: M, y: 1.6, w: W - 2 * M, h: 5.3, fontSize: 12, paraSpaceAfter: 4 });
  pie(s, null);
  s.addNotes("Numeración idéntica a la del documento PDF de los puntos 2 y 3.");
});

const salida = path.join(__dirname, "Temas_2_y_3_Cauchy-Weierstrass_Cantor-Riemann.pptx");
pres.writeFile({ fileName: salida }).then(() => console.log(`PPTX generado: ${salida}`));
