// Diagramas del plano complejo como SVG + etiquetas KaTeX.
// Los puntos se dan como [re, im]. Cada elemento admite:
//   c: clase CSS extra · desde / hasta: pasos en que es visible · trazo: se dibuja animado
import { mate } from './mate.mjs';

const f2 = (v) => Number(v.toFixed(2));

function attrs(o = {}, base = '') {
  const cls = [base, o.c || '', o.trazo ? 'trazo' : ''].filter(Boolean).join(' ');
  return ` class="${cls}"` + (o.desde != null ? ` data-desde="${o.desde}"` : '') +
    (o.hasta != null ? ` data-hasta="${o.hasta}"` : '') + (o.trazo ? ' pathLength="1"' : '');
}
const vis = (o = {}) => (o.desde != null ? ` data-desde="${o.desde}"` : '') + (o.hasta != null ? ` data-hasta="${o.hasta}"` : '');

/** Lienzo: plano({x:[a,b], y:[c,d], w:px}, ...elementos) */
export function plano(o, ...elems) {
  const [x0, x1] = o.x, [y0, y1] = o.y, w = o.w || 640;
  const s = w / (x1 - x0), h = s * (y1 - y0);
  const ctx = { s, w, h, x0, x1, y0, y1, svg: [], etq: [], X: (v) => f2((v - x0) * s), Y: (v) => f2((y1 - v) * s) };
  for (const e of elems.flat(Infinity)) if (e) e(ctx);
  return `<div class="plano ${o.c || ''}" style="width:${w}px;height:${f2(h)}px">` +
    `<svg viewBox="0 0 ${w} ${f2(h)}" width="${w}" height="${f2(h)}">${ctx.svg.join('')}</svg>${ctx.etq.join('')}</div>`;
}

function punta(ctx, P, ang, o = {}, tam = 1) {
  // P en píxeles, ang en radianes (convención matemática)
  const dx = Math.cos(ang), dy = -Math.sin(ang), nx = -dy, ny = dx;
  const L = 13 * tam, B = 9 * tam, W = 8.5 * tam;
  const pts = [[P[0] + L * dx, P[1] + L * dy], [P[0] - B * dx + W * nx, P[1] - B * dy + W * ny],
    [P[0] - B * dx - W * nx, P[1] - B * dy - W * ny]].map((p) => p.map(f2).join(',')).join(' ');
  ctx.svg.push(`<polygon points="${pts}" class="flecha ${o.c || ''}"${vis(o)}/>`);
}

function rotulo(ctx, z, tex, o = {}) {
  if (tex == null || tex === '') return;
  const pos = o.pos || 'ne';
  ctx.etq.push(`<span class="etq pos-${pos} ${o.c || ''}" style="left:${ctx.X(z[0])}px;top:${ctx.Y(z[1])}px"${vis(o)}>` +
    `${mate('$' + tex + '$')}</span>`);
}

/** Ejes coordenados. marcas: {x:[...], y:[...]} dibuja marcas con su número. */
export const ejes = (o = {}) => (ctx) => {
  const { X, Y, x0, x1, y0, y1 } = ctx;
  const m = 0.04 * (x1 - x0);
  ctx.svg.push(`<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1 - m)}" y2="${Y(0)}" class="eje"/>`);
  ctx.svg.push(`<line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1 - m)}" class="eje"/>`);
  punta(ctx, [X(x1 - m), Y(0)], 0, { c: 'eje' }, 0.8);
  punta(ctx, [X(0), Y(y1 - m)], Math.PI / 2, { c: 'eje' }, 0.8);
  if (o.nombres !== false) {
    rotulo(ctx, [x1 - m, 0], o.re || '\\mathrm{Re}', { pos: 's', c: 'tenue' });
    rotulo(ctx, [0, y1 - m], o.im || '\\mathrm{Im}', { pos: 'w', c: 'tenue' });
  }
  for (const v of (o.marcas?.x || [])) {
    ctx.svg.push(`<line x1="${X(v)}" y1="${Y(0) - 7}" x2="${X(v)}" y2="${Y(0) + 7}" class="eje"/>`);
    rotulo(ctx, [v, 0], String(v).replace('-', '-'), { pos: 's', c: 'tenue chica' });
  }
  for (const v of (o.marcas?.y || [])) {
    ctx.svg.push(`<line x1="${X(0) - 7}" y1="${Y(v)}" x2="${X(0) + 7}" y2="${Y(v)}" class="eje"/>`);
    rotulo(ctx, [0, v], (v === 1 ? '' : v === -1 ? '-' : v) + 'i', { pos: 'w', c: 'tenue chica' });
  }
};

/** Arco de circunferencia de centro c, radio r, del ángulo a0 al a1 (a1>a0: antihorario). */
export const arco = (c, r, a0, a1, o = {}) => (ctx) => {
  const { X, Y, s } = ctx;
  const P = (a) => [X(c[0] + r * Math.cos(a)), Y(c[1] + r * Math.sin(a))];
  const R = f2(r * s), anti = a1 > a0, total = Math.abs(a1 - a0);
  let d;
  if (total >= 2 * Math.PI - 1e-9) {
    const am = a0 + (anti ? Math.PI : -Math.PI);
    d = `M${P(a0)} A${R} ${R} 0 1 ${anti ? 0 : 1} ${P(am)} A${R} ${R} 0 1 ${anti ? 0 : 1} ${P(a0)}`;
  } else {
    d = `M${P(a0)} A${R} ${R} 0 ${total > Math.PI ? 1 : 0} ${anti ? 0 : 1} ${P(a1)}`;
  }
  ctx.svg.push(`<path d="${d}"${attrs(o, 'curva')}/>`);
  const fl = o.flecha === undefined ? [0.5] : o.flecha === false ? [] : [].concat(o.flecha);
  for (const fr of fl) {
    const a = a0 + fr * (a1 - a0);
    punta(ctx, P(a), a + (anti ? Math.PI / 2 : -Math.PI / 2), o, o.tam || 1);
  }
  if (o.tex) rotulo(ctx, [c[0] + r * Math.cos(o.en ?? (a0 + a1) / 2), c[1] + r * Math.sin(o.en ?? (a0 + a1) / 2)], o.tex, o);
};

/** Circunferencia completa (antihoraria salvo horario:true). flecha: fracciones de vuelta. */
export const circ = (c, r, o = {}) => {
  const a0 = o.inicio ?? 0;
  const fl = o.flecha === undefined ? [0.125] : o.flecha;
  return arco(c, r, a0, a0 + (o.horario ? -2 : 2) * Math.PI, { ...o, flecha: fl, en: o.en ?? Math.PI / 4 });
};

/** Segmento de a a b. flecha: 'fin' | 'medio' | fracción | false */
export const seg = (a, b, o = {}) => (ctx) => {
  const { X, Y } = ctx;
  ctx.svg.push(`<path d="M${X(a[0])} ${Y(a[1])} L${X(b[0])} ${Y(b[1])}"${attrs(o, 'curva')}/>`);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const fl = o.flecha === undefined || o.flecha === false ? [] : [].concat(o.flecha);
  for (const f of fl) {
    const fr = f === 'fin' ? 0.97 : f === 'medio' ? 0.55 : f;
    punta(ctx, [X(a[0] + fr * (b[0] - a[0])), Y(a[1] + fr * (b[1] - a[1]))], ang, o, o.tam || 1);
  }
  if (o.tex) rotulo(ctx, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o.tex, o);
};

/** Curva paramétrica t ↦ [x,y]. */
export const curva = (fn, t0, t1, o = {}) => (ctx) => {
  const { X, Y } = ctx, n = o.n || 160, pts = [];
  for (let k = 0; k <= n; k++) { const p = fn(t0 + (t1 - t0) * k / n); pts.push([X(p[0]), Y(p[1])]); }
  ctx.svg.push(`<path d="M${pts.map((p) => p.join(' ')).join(' L')}"${attrs(o, 'curva')}/>`);
  const fl = o.flecha === undefined || o.flecha === false ? [] : [].concat(o.flecha);
  for (const fr of fl) {
    const t = t0 + fr * (t1 - t0), e = (t1 - t0) * 1e-4, p = fn(t), q = fn(t + e);
    punta(ctx, [X(p[0]), Y(p[1])], Math.atan2(q[1] - p[1], q[0] - p[0]), o, o.tam || 1);
  }
  if (o.tex) { const p = fn(t0 + (o.en ?? 0.5) * (t1 - t0)); rotulo(ctx, p, o.tex, o); }
};

/** Polígono (relleno si la clase lo indica). */
export const poli = (pts, o = {}) => (ctx) => {
  const d = pts.map((p) => `${ctx.X(p[0])} ${ctx.Y(p[1])}`).join(' L');
  ctx.svg.push(`<path d="M${d}${o.abierto ? '' : ' Z'}"${attrs(o, o.base || 'relleno')}/>`);
};

/** Región con agujeros: lista de contornos (cada uno, lista de puntos); relleno par-impar. */
export const region = (contornos, o = {}) => (ctx) => {
  const d = contornos.map((pts) => 'M' + pts.map((p) => `${ctx.X(p[0])} ${ctx.Y(p[1])}`).join(' L') + ' Z').join(' ');
  ctx.svg.push(`<path d="${d}" fill-rule="evenodd"${attrs(o, 'relleno')}/>`);
};

/** Puntos de una circunferencia (para usar en region). */
export const ptsCirc = (c, r, n = 72) => Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(2 * Math.PI * k / n), c[1] + r * Math.sin(2 * Math.PI * k / n)]);

/** Puntos de una curva paramétrica cerrada. */
export const ptsCurva = (fn, t0, t1, n = 160) => Array.from({ length: n }, (_, k) => fn(t0 + (t1 - t0) * k / n));

/** Disco relleno. */
export const disco = (c, r, o = {}) => (ctx) => {
  ctx.svg.push(`<circle cx="${ctx.X(c[0])}" cy="${ctx.Y(c[1])}" r="${f2(r * ctx.s)}"${attrs(o, 'relleno')}/>`);
};

/** Sector circular relleno entre los ángulos a0 y a1. */
export const sector = (c, r, a0, a1, o = {}) => {
  const n = 40, pts = [c];
  for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n; pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
  return poli(pts, o);
};

/** Punto marcado: tipo 'polo' (×), 'punto' (●) o 'hueco' (○), con etiqueta. */
export const pto = (z, tex, o = {}) => (ctx) => {
  const x = ctx.X(z[0]), y = ctx.Y(z[1]), tipo = o.tipo || 'punto', k = 9;
  if (tipo === 'polo') {
    ctx.svg.push(`<path d="M${x - k} ${y - k} L${x + k} ${y + k} M${x - k} ${y + k} L${x + k} ${y - k}" class="marca polo ${o.c || ''}"${vis(o)}/>`);
  } else {
    ctx.svg.push(`<circle cx="${x}" cy="${y}" r="${tipo === 'hueco' ? 8 : 7.5}" class="marca ${tipo} ${o.c || ''}"${vis(o)}/>`);
  }
  rotulo(ctx, z, tex, o);
};

/** Etiqueta suelta. */
export const etq = (z, tex, o = {}) => (ctx) => rotulo(ctx, z, tex, { pos: 'c', ...o });

/** Corte de rama (línea gruesa ondulada) de a a b. */
export const corte = (a, b, o = {}) => (ctx) => {
  const { X, Y } = ctx, n = 28, pts = [];
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  for (let k = 0; k <= n; k++) {
    const t = k / n, amp = (k % 2 ? 1 : -1) * 0.045 * (ctx.x1 - ctx.x0) * 0.25;
    pts.push(`${X(a[0] + dx * t + nx * amp)} ${Y(a[1] + dy * t + ny * amp)}`);
  }
  ctx.svg.push(`<path d="M${pts.join(' L')}" class="corte ${o.c || ''}"${vis(o)}/>`);
  if (o.tex) rotulo(ctx, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], o.tex, { pos: 'n', ...o });
};

export const PI = Math.PI;
