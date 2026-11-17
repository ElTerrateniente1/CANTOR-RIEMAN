// Diagramas SVG compartidos por las diapositivas (video) y los apuntes (PDF).
const AZ = '#2563eb';   // punto x y sus vecindades
const NA = '#d9480f';   // punto y y sus vecindades
const TI = '#1d2433';   // tinta
const GR = '#6b7280';   // gris

const svg = (w, h, body) =>
  `<svg class="diag" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const ml = (x, y, t, c = TI, size = 40) =>
  `<text x="${x}" y="${y}" class="ml" fill="${c}" font-size="${size}" text-anchor="middle">${t}</text>`;
const tl = (x, y, t, c = TI, size = 28, anchor = 'middle') =>
  `<text x="${x}" y="${y}" class="tl" fill="${c}" font-size="${size}" text-anchor="${anchor}">${t.replace(/ {2,}/g, m => '\u00a0'.repeat(m.length))}</text>`;
const pt = (x, y, label, c, dy = -22) =>
  `<circle cx="${x}" cy="${y}" r="10" fill="${c}"/>` + ml(x, y + dy, label, c);
const elip = (cx, cy, rx, ry, c, dash = false, op = '1c') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}${op}" stroke="${c}" stroke-width="4"${dash ? ' stroke-dasharray="14 10"' : ''}/>`;

export const diagramas = {
  vecindad: svg(800, 560,
    elip(400, 260, 320, 210, AZ, false, '12') +
    elip(380, 280, 180, 115, AZ, true, '22') +
    pt(380, 300, 'x', AZ) +
    ml(640, 130, 'N', AZ, 48) + ml(480, 230, 'U', AZ, 44) +
    tl(400, 530, 'U abierto,  x ∈ U ⊆ N', TI, 32)),

  anidadas: svg(800, 560,
    [230, 170, 115, 62].map((r, i) =>
      `<circle cx="400" cy="250" r="${r}" fill="${AZ}${['0d', '14', '1c', '26'][i]}" stroke="${AZ}" stroke-width="3"/>`).join('') +
    pt(400, 250, 'x', AZ) +
    `<circle cx="690" cy="110" r="10" fill="${NA}"/>` + ml(690, 88, 'y', NA) +
    tl(400, 530, 'lo único común a todas las vecindades de x es x', TI, 30)),

  t0: svg(800, 560,
    elip(270, 260, 190, 150, AZ) + ml(150, 130, 'U', AZ, 48) +
    pt(270, 270, 'x', AZ) + pt(600, 270, 'y', NA) +
    tl(400, 500, 'un abierto contiene a uno de los puntos', TI, 30) +
    tl(400, 540, 'y deja fuera al otro', TI, 30)),

  t1: svg(800, 560,
    elip(310, 250, 200, 140, AZ) + elip(500, 250, 200, 140, NA) +
    pt(230, 260, 'x', AZ) + pt(580, 260, 'y', NA) +
    ml(180, 110, 'N', AZ, 48) + ml(630, 110, 'M', NA, 48) +
    tl(405, 258, 'pueden', GR, 24) + tl(405, 288, 'cortarse', GR, 24) +
    tl(400, 500, 'y ∉ N   y   x ∉ M', TI, 34)),

  t2: svg(800, 560,
    elip(225, 250, 160, 140, AZ) + elip(575, 250, 160, 140, NA) +
    pt(225, 260, 'x', AZ) + pt(575, 260, 'y', NA) +
    ml(110, 100, 'N', AZ, 48) + ml(690, 100, 'M', NA, 48) +
    tl(400, 500, 'N ∩ M = ∅', TI, 36)),

  // Topología del punto particular en R: los conjuntos {0,x} y {0,y}
  particular: svg(800, 560,
    `<line x1="40" y1="290" x2="760" y2="290" stroke="${TI}" stroke-width="4"/>` +
    `<path d="M 200 262 C 250 120, 350 120, 392 258" fill="none" stroke="${AZ}" stroke-width="4"/>` +
    `<path d="M 408 322 C 450 460, 570 460, 620 318" fill="none" stroke="${NA}" stroke-width="4"/>` +
    `<circle cx="200" cy="290" r="28" fill="${AZ}1c" stroke="${AZ}" stroke-width="4"/>` +
    `<circle cx="400" cy="290" r="30" fill="${AZ}1c" stroke="${AZ}" stroke-width="4"/>` +
    `<circle cx="400" cy="290" r="40" fill="none" stroke="${NA}" stroke-width="4"/>` +
    `<circle cx="620" cy="290" r="28" fill="${NA}1c" stroke="${NA}" stroke-width="4"/>` +
    `<circle cx="200" cy="290" r="10" fill="${AZ}"/><circle cx="620" cy="290" r="10" fill="${NA}"/>` +
    `<circle cx="400" cy="290" r="12" fill="${TI}"/>` +
    ml(200, 360, 'x', AZ) + ml(620, 250, 'y', NA) + ml(455, 268, '0', TI) +
    ml(295, 120, '{0, x}', AZ, 42) + ml(515, 500, '{0, y}', NA, 42) +
    tl(400, 50, 'todo abierto no vacío contiene al 0', TI, 30)),

  recta: (() => {
    const X = n => 80 + 92 * n;
    let s = `<line x1="40" y1="300" x2="760" y2="300" stroke="${TI}" stroke-width="4"/>`;
    for (let n = 0; n <= 7; n++)
      s += `<line x1="${X(n)}" y1="288" x2="${X(n)}" y2="312" stroke="${TI}" stroke-width="3"/>` +
        tl(X(n), 356, String(n), GR, 28);
    const intervalo = (a, b, c, nombre) =>
      `<line x1="${X(a)}" y1="300" x2="${X(b)}" y2="300" stroke="${c}" stroke-width="12" stroke-linecap="round" opacity=".55"/>` +
      `<circle cx="${X(a)}" cy="300" r="11" fill="#fff" stroke="${c}" stroke-width="4"/>` +
      `<circle cx="${X(b)}" cy="300" r="11" fill="#fff" stroke="${c}" stroke-width="4"/>` +
      ml((X(a) + X(b)) / 2, 170, nombre, c, 42);
    s += intervalo(1, 3, AZ, 'U = (1, 3)') + intervalo(4, 6, NA, 'V = (4, 6)');
    s += pt(X(2), 300, 'x = 2', AZ, -36) + pt(X(5), 300, 'y = 5', NA, -36);
    s += tl(400, 470, 'U ∩ V = ∅', TI, 36);
    return svg(800, 560, s);
  })(),

  sierpinski: svg(800, 560,
    `<rect x="130" y="110" width="540" height="320" rx="50" fill="${GR}10" stroke="${GR}" stroke-width="4"/>` +
    `<circle cx="300" cy="275" r="85" fill="${AZ}1c" stroke="${AZ}" stroke-width="4"/>` +
    `<circle cx="300" cy="275" r="10" fill="${AZ}"/><circle cx="520" cy="275" r="10" fill="${NA}"/>` +
    ml(300, 250, '0', AZ) + ml(520, 250, '1', NA) +
    ml(300, 160, '{0}', AZ, 38) + ml(630, 95, 'X', GR, 46) +
    tl(400, 500, 'abiertos:  ∅,  {0},  X', TI, 32)),

  abc: svg(800, 560,
    `<rect x="100" y="110" width="600" height="320" rx="50" fill="${GR}10" stroke="${GR}" stroke-width="4"/>` +
    `<circle cx="240" cy="275" r="80" fill="${AZ}1c" stroke="${AZ}" stroke-width="4"/>` +
    `<circle cx="240" cy="275" r="10" fill="${AZ}"/><circle cx="420" cy="275" r="10" fill="${NA}"/><circle cx="580" cy="275" r="10" fill="${NA}"/>` +
    ml(240, 250, 'a', AZ) + ml(420, 250, 'b', NA) + ml(580, 250, 'c', NA) +
    ml(240, 165, '{a}', AZ, 38) + ml(660, 95, 'X', GR, 46) +
    tl(400, 500, 'abiertos:  ∅,  {a},  X', TI, 32)),
};
