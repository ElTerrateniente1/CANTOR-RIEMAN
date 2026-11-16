// Apuntes de un nivel (HTML): el contenido de cada escena del video como texto + pizarra.
// Lo usan el documento PDF y la página de la ruta por niveles.
import { mate, vozHTML } from './mate.mjs';

export const NIVELES = ['nivel1', 'nivel2', 'nivel3', 'nivel4', 'nivel5', 'nivel6'];

export async function cargarNiveles() {
  const out = [];
  for (const id of NIVELES) out.push((await import(`../contenido/${id}.mjs`)).default);
  return out;
}

// Frases de la narración que solo tienen sentido viendo el video.
const AJUSTES = [
  [/, es la que aparece en pantalla\./g, ', es la siguiente.'],
  [/que aparecen sombreados en la figura/g, 'que aparecen sombreados en la figura'],
];

function prosa(v) {
  let s = vozHTML(v);
  for (const [re, por] of AJUSTES) s = s.replace(re, por);
  return s;
}

/** Devuelve { objetivos, intro, escenas:[{id,titulo,ref,html}] } */
export function apuntes(nivel) {
  const portada = nivel.escenas[0];
  const intro = prosa(portada.pasos[0].v);
  const objetivos = mate(portada.pasos[1].h);
  const escenas = nivel.escenas.slice(1).map((esc, k) => {
    const id = `${nivel.id}-e${k + 1}`;
    const pasos = esc.pasos.map((p) =>
      `<div class="pasoD">${p.v ? `<p class="voz">${prosa(p.v)}</p>` : ''}` +
      (p.h ? `<div class="bloque">${mate(p.h)}</div>` : '') +
      (p.nota ? `<p class="nota"><b>Nota.</b> ${mate(p.nota)}</p>` : '') + `</div>`).join('\n');
    const html = `<section class="esc" id="${id}"><h3>${mate(esc.t)}${esc.ref ? ` <span class="ref">${esc.ref}</span>` : ''}</h3>` +
      (esc.fig ? `<div class="figura">${esc.fig}</div>` : '') + pasos + `</section>`;
    return { id, titulo: esc.t, ref: esc.ref || '', html };
  });
  return { intro, objetivos, escenas };
}

/** Bloque «Resumen» de la última escena del nivel (para el formulario). */
export function resumenNivel(nivel) {
  const ult = nivel.escenas[nivel.escenas.length - 1];
  const p = ult.pasos.find((x) => x.h && x.h.includes('Resumen'));
  return p ? mate(p.h) : '';
}
