// Matemática (KaTeX) y marcado de narración.
//
//  - En el HTML de las escenas:  $...$ (en línea)  y  $$...$$ (destacada).
//  - En la narración:  [[latex::cómo se lee]]  → el documento muestra la fórmula
//    y la voz lee el texto. [[latex]] solo, si el símbolo está en LECTURAS.
import katex from 'katex';

export const r = String.raw;

const MACROS = {
  '\\C': '\\mathbb{C}',
  '\\R': '\\mathbb{R}',
  '\\Res': '\\operatorname*{Res}',
  '\\Log': '\\operatorname{Log}',
  '\\Arg': '\\operatorname{Arg}',
  '\\sen': '\\operatorname{sen}',
  '\\senh': '\\operatorname{senh}',
  '\\Re': '\\operatorname{Re}',
  '\\Im': '\\operatorname{Im}',
  '\\vp': '\\operatorname{v.p.}',
  '\\dd': '\\,\\mathrm{d}',
  '\\zb': '\\bar z',
  '\\dzb': '\\dfrac{\\partial f}{\\partial \\bar z}',
  '\\eps': '\\varepsilon',
};

function tex(src, display) {
  try {
    return katex.renderToString(src.trim(), {
      displayMode: display, throwOnError: true, strict: 'ignore', macros: { ...MACROS }, output: 'html',
    });
  } catch (e) {
    throw new Error(`KaTeX: ${e.message}\n   en: ${src}`);
  }
}

/** Sustituye $$...$$ y $...$ por HTML de KaTeX. */
export function mate(html) {
  if (!html) return '';
  return html
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, s) => `<div class="mate">${tex(s, true)}</div>`)
    .replace(/\$([^$]+?)\$/g, (_, s) => tex(s, false));
}

/** Símbolos frecuentes que pueden ir como [[latex]] sin lectura explícita. */
export const LECTURAS = {
  'z': 'zeta', 'w': 'doble u', 'x': 'equis', 'y': 'ye', 'f': 'efe', 'g': 'ge', 'u': 'u', 'v': 'uve',
  't': 'te', 'r': 'erre', 'i': 'i', 'e': 'e', 'a': 'a', 'b': 'be', 'c': 'ce', 'n': 'ene', 'h': 'hache', 'm': 'eme',
  'R': 'erre', 'F': 'efe mayúscula', 'M': 'eme', 'L': 'ele',
  'z_0': 'zeta cero', 'x_0': 'equis cero', '\\pi': 'pi', '\\theta': 'theta', '2\\pi i': 'dos pi i', '\\pi i': 'pi i',
  'f(z)': 'efe de zeta', "f'(z)": 'efe prima de zeta', 'g(z)': 'ge de zeta', '\\bar z': 'zeta conjugado',
  '\\bar f': 'efe conjugada', '|z|': 'módulo de zeta', '\\infty': 'infinito', '\\varepsilon': 'épsilon',
  '\\eps': 'épsilon', '2\\pi': 'dos pi', '\\gamma': 'gama', '\\alpha': 'alfa', '\\C': 'el plano complejo',
  'z=0': 'zeta igual a cero', 'z=i': 'zeta igual a i', 'z=-i': 'zeta igual a menos i', '0': 'cero', '1': 'uno',
  '-1': 'menos uno', '2': 'dos', '2i': 'dos i', '-2i': 'menos dos i', '\\pm i': 'más menos i',
  '\\pm 2i': 'más menos dos i', '4i': 'cuatro i', '5i': 'cinco i', 'p': 'pe', 'q': 'cu', 'k': 'ka',
  'z_1': 'zeta uno', 'z_2': 'zeta dos', 'R^2': 'erre cuadrado', 'z^2': 'zeta cuadrado', 'x_j': 'equis jota',
};

const RE_MARCA = /\[\[([\s\S]+?)\]\]/g;

function partir(m) {
  const k = m.indexOf('::');
  return k < 0 ? [m.trim(), null] : [m.slice(0, k).trim(), m.slice(k + 2).trim()];
}

/** Narración → HTML (para el documento): las marcas se muestran como fórmulas. */
export function vozHTML(texto) {
  if (!texto) return '';
  return texto.replace(RE_MARCA, (_, m) => tex(partir(m)[0], false));
}

/** Pronunciaciones que el sintetizador lee mejor con otra grafía. */
export const PRONUNCIACION = [
  [/\bCauchy[-–]Riemann\b/g, 'Cauchy Riemann'],
  [/\bCauchy[-–]Goursat\b/g, 'Cauchy Gursá'],
  [/\bGoursat\b/g, 'Gursá'],
  [/\bLaurent\b/g, 'Lorán'],
  [/\bLiouville\b/g, 'Liuvil'],
];

/** Narración → texto plano para la voz. */
export function vozTTS(texto) {
  if (!texto) return '';
  let s = texto.replace(RE_MARCA, (_, m) => {
    const [t, h] = partir(m);
    if (h !== null) return h;
    if (t in LECTURAS) return LECTURAS[t];
    throw new Error(`Falta la lectura de [[${t}]] en la narración`);
  });
  for (const [re, por] of PRONUNCIACION) s = s.replace(re, por);
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
