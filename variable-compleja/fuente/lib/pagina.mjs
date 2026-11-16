// Página HTML (1920×1080) con todas las escenas de un nivel, para capturar los cuadros del video.
import { mate, vozTTS } from './mate.mjs';
import { cssFuentes, cssKatex, CSS_BLOQUES, TEMA_OSCURO } from './estilos.mjs';

const CSS_VIDEO = String.raw`
*{box-sizing:border-box}
html,body{margin:0;background:var(--fondo)}
#lienzo{width:1920px;height:1080px;position:relative;overflow:hidden;font-family:'IBM Plex Sans',sans-serif;color:var(--tinta);
  background:radial-gradient(1400px 800px at 78% -10%,#1b2740 0%,var(--fondo) 62%)}
.barra{position:absolute;top:0;left:0;right:0;height:66px;display:flex;align-items:center;padding:0 72px;font-size:25px;color:var(--tenue);
  border-bottom:1px solid var(--linea)}
.barra .nivel{color:var(--ac);font-weight:700;letter-spacing:.09em;margin-right:20px}
.barra .cont{margin-left:auto;font-variant-numeric:tabular-nums}
.progreso{position:absolute;left:0;bottom:0;height:7px;background:var(--ac);border-radius:0 4px 4px 0}
section.escena{position:absolute;top:66px;left:0;right:0;bottom:7px;padding:30px 72px 30px;display:none;flex-direction:column}
section.escena.activa{display:flex}
h1{font-size:57px;font-weight:600;margin:0 0 24px;letter-spacing:-.012em;line-height:1.12}
.cuerpo{flex:1;display:flex;gap:50px;min-height:0}
.col{flex:1;display:flex;flex-direction:column;gap:17px;min-width:0}
.col.der{flex:0 0 auto;align-items:center;justify-content:center;font-size:38px}
.paso{font-size:39px;line-height:1.34;border-left:6px solid transparent;padding-left:20px;margin-left:-26px}
.paso p{margin:0 0 .28em} .paso p:last-child{margin-bottom:0}
.paso.futuro{visibility:hidden}
.paso.visto{opacity:.7}
.paso.actual{border-left-color:var(--ac)}
.compacta .paso{font-size:34px} .compacta .col{gap:13px}
.mini .paso{font-size:30.5px} .mini .col{gap:11px}
.amplia .paso{font-size:44px}
.katex{font-size:1.06em}
.pie{font-size:.78em;color:var(--tenue)}
/* portada */
section.portada{justify-content:center;padding-left:130px;padding-right:130px}
.portada .nivel-g{font-size:40px;font-weight:700;letter-spacing:.22em;color:var(--ac)}
.portada h1{font-size:108px;margin:14px 0 14px;line-height:1.03}
.portada .sub-g{font-size:42px;color:var(--tenue);margin:0 0 40px}
.portada .cuerpo{flex:0 0 auto}
.portada .paso{font-size:38px}
.portada ul.l li{margin:.3em 0}
${CSS_BLOQUES}
`;

const JS_VIDEO = String.raw`
window.mostrar = (e, p, t = 1, frac = 0) => {
  document.querySelectorAll('section.escena').forEach((s, i) => {
    s.classList.toggle('activa', i === e);
    if (i !== e) return;
    s.querySelectorAll('[data-p]').forEach((el) => {
      const k = +el.dataset.p;
      el.classList.toggle('visto', k < p); el.classList.toggle('actual', k === p); el.classList.toggle('futuro', k > p);
    });
    s.querySelectorAll('[data-desde],[data-hasta]').forEach((el) => {
      const d = el.dataset.desde != null ? +el.dataset.desde : -1, h = el.dataset.hasta != null ? +el.dataset.hasta : 1e9;
      el.style.visibility = (p >= d && p <= h) ? 'visible' : 'hidden';
      const nuevo = d === p;
      if (el.classList.contains('trazo')) {
        el.style.strokeDasharray = nuevo ? '1' : ''; el.style.strokeDashoffset = nuevo ? String(1 - t) : '';
      } else if (el.dataset.desde != null) {
        const conTrazo = !!s.querySelector('.trazo[data-desde="' + p + '"]');
        el.style.opacity = (nuevo && conTrazo) ? String(Math.max(0, Math.min(1, (t - 0.55) / 0.45))) : '';
      }
    });
    document.querySelector('.barra .cont').textContent = (e + 1) + ' / ' + document.querySelectorAll('section.escena').length;
  });
  document.querySelector('.progreso').style.width = (frac * 100).toFixed(3) + '%';
};
window.animado = (e, p) => !!document.querySelectorAll('section.escena')[e].querySelector('.trazo[data-desde="' + p + '"]');
window.desborde = (e) => {
  const s = document.querySelectorAll('section.escena')[e], lim = s.getBoundingClientRect().bottom - 24, limD = s.getBoundingClientRect().right - 40;
  let maxB = 0, maxR = 0;
  s.querySelectorAll('.paso, .plano, h1').forEach((el) => { const r = el.getBoundingClientRect(); maxB = Math.max(maxB, r.bottom); maxR = Math.max(maxR, r.right); });
  s.querySelectorAll('.katex-display, .katex').forEach((el) => { const r = el.getBoundingClientRect(); maxR = Math.max(maxR, r.right); });
  return { abajo: Math.round(maxB - lim), derecha: Math.round(maxR - limD) };
};
`;

function escenaHTML(esc, i) {
  const izq = [], der = [];
  esc.pasos.forEach((p, k) => {
    if (!p.h) return;
    const bloque = `<div class="paso" data-p="${k}">${mate(p.h)}</div>`;
    (p.col === 'der' ? der : izq).push(bloque);
  });
  if (esc.fig) der.unshift(esc.fig);
  const cuerpo = `<div class="cuerpo"><div class="col izq">${izq.join('')}</div>` +
    (der.length ? `<div class="col der">${der.join('')}</div>` : '') + `</div>`;
  if (esc.portada) {
    return `<section class="escena portada ${esc.clase || ''}"><div class="nivel-g">${esc.portada.nivel}</div>` +
      `<h1>${esc.portada.titulo}</h1><p class="sub-g">${esc.portada.sub || ''}</p>${cuerpo}</section>`;
  }
  return `<section class="escena ${esc.clase || ''}"><h1>${mate(esc.t)}</h1>${cuerpo}</section>`;
}

/** Devuelve { html, pasos:[{e,p,voz}] } para un nivel. */
export function paginaVideo(nivel) {
  const pasos = [];
  nivel.escenas.forEach((esc, e) => esc.pasos.forEach((p, k) => {
    pasos.push({ e, p: k, voz: vozTTS(p.v), pausa: p.pausa ?? null });
  }));
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>${cssFuentes({ familias: ['IBM Plex Sans'] })}\n${cssKatex()}\n${TEMA_OSCURO}\n${CSS_VIDEO}</style></head>
<body><div id="lienzo"><div class="barra"><span class="nivel">${nivel.etiqueta}</span><span>${nivel.titulo}</span><span class="cont"></span></div>
${nivel.escenas.map(escenaHTML).join('\n')}
<div class="progreso"></div></div><script>${JS_VIDEO}</script></body></html>`;
  return { html, pasos };
}
