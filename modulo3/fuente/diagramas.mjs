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
  // ---------- Clase T3 / T4 ----------
  // Convención: borde continuo = cerrado; borde punteado = abierto.
  regular: svg(800, 560,
    elip(540, 245, 205, 175, NA, true, '0d') +
    `<ellipse cx="550" cy="250" rx="120" ry="95" fill="${NA}2e" stroke="${NA}" stroke-width="5"/>` +
    elip(165, 250, 115, 115, AZ, true, '14') +
    pt(165, 262, 'x', AZ) +
    ml(550, 264, 'F', NA, 50) + ml(700, 98, 'G', NA, 48) + ml(88, 128, 'H', AZ, 48) +
    tl(400, 490, 'F ⊆ G,   x ∈ H,   G ∩ H = ∅', TI, 32) +
    tl(400, 535, 'borde continuo: cerrado  ·  punteado: abierto', GR, 24)),

  normal: svg(800, 560,
    elip(213, 245, 178, 170, AZ, true, '0d') +
    `<ellipse cx="213" cy="250" rx="95" ry="110" fill="${AZ}2e" stroke="${AZ}" stroke-width="5"/>` +
    elip(592, 245, 178, 170, NA, true, '0d') +
    `<ellipse cx="592" cy="250" rx="105" ry="88" fill="${NA}2e" stroke="${NA}" stroke-width="5"/>` +
    ml(213, 264, 'E', AZ, 50) + ml(592, 264, 'F', NA, 50) +
    ml(70, 95, 'G', AZ, 48) + ml(735, 95, 'H', NA, 48) +
    tl(400, 490, 'E ⊆ G,   F ⊆ H,   G ∩ H = ∅', TI, 32) +
    tl(400, 535, 'borde continuo: cerrado  ·  punteado: abierto', GR, 24)),

  abcRegular: svg(800, 560,
    `<rect x="90" y="110" width="620" height="320" rx="50" fill="${GR}10" stroke="${GR}" stroke-width="4"/>` +
    `<circle cx="230" cy="275" r="82" fill="${AZ}1c" stroke="${AZ}" stroke-width="4"/>` +
    `<ellipse cx="500" cy="275" rx="165" ry="88" fill="${NA}1c" stroke="${NA}" stroke-width="4"/>` +
    `<circle cx="230" cy="285" r="10" fill="${AZ}"/><circle cx="435" cy="285" r="10" fill="${NA}"/><circle cx="565" cy="285" r="10" fill="${NA}"/>` +
    ml(230, 262, 'a', AZ) + ml(435, 262, 'b', NA) + ml(565, 262, 'c', NA) +
    ml(230, 170, '{a}', AZ, 38) + ml(500, 165, '{b, c}', NA, 38) + ml(675, 95, 'X', GR, 46) +
    tl(400, 490, 'abiertos:  ∅,  {a},  {b, c},  X', TI, 30) +
    tl(400, 532, 'los cerrados son los mismos conjuntos', GR, 26)),

  rectaRegular: (() => {
    const X = n => 80 + 85 * (n + 2);
    const num = n => (n < 0 ? '−' : '') + Math.abs(n);
    let s = `<line x1="40" y1="300" x2="780" y2="300" stroke="${TI}" stroke-width="4"/>`;
    for (let n = -2; n <= 6; n++)
      s += `<line x1="${X(n)}" y1="288" x2="${X(n)}" y2="312" stroke="${TI}" stroke-width="3"/>` + tl(X(n), 356, num(n), GR, 26);
    const banda = (a, b, c) => `<rect x="${X(a)}" y="287" width="${X(b) - X(a)}" height="26" fill="${c}30"/>`;
    const hueco = (n, c, r = 10) => `<circle cx="${X(n)}" cy="300" r="${r}" fill="${r === 10 ? '#fff' : 'none'}" stroke="${c}" stroke-width="4"/>`;
    s += banda(-1, 1, AZ) + banda(1, 5, NA);
    s += `<line x1="${X(2)}" y1="300" x2="${X(4)}" y2="300" stroke="${NA}" stroke-width="14"/>`;
    s += `<circle cx="${X(2)}" cy="300" r="11" fill="${NA}"/><circle cx="${X(4)}" cy="300" r="11" fill="${NA}"/>`;
    s += hueco(-1, AZ) + hueco(1, AZ) + hueco(1, NA, 17) + hueco(5, NA);
    s += `<circle cx="${X(0)}" cy="300" r="10" fill="${AZ}"/>`;
    s += ml(X(0), 196, 'H = (−1, 1)', AZ, 38) + ml(X(0), 268, 'x', AZ, 34);
    s += ml(X(3), 196, 'G = (1, 5)', NA, 38) + ml(X(3), 425, 'F = [2, 4]', NA, 38);
    s += tl(400, 515, 'G ∩ H = ∅:  el 1 no está en ninguno de los dos', TI, 28);
    return svg(800, 560, s);
  })(),

  metrico: (() => {
    const sub = t => `<tspan baseline-shift="sub" font-size="68%">${t}</tspan>`;
    const halo = t => t.replace('<text ', '<text paint-order="stroke" stroke="#fbfaf6" stroke-width="5" ');
    const bola = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}0d" stroke="${c}" stroke-width="3" stroke-dasharray="10 8"/>`;
    const A = [[230, 150, 62], [290, 300, 92], [195, 390, 66]];
    const B = [[585, 165, 60], [530, 320, 72], [630, 395, 58]];
    let s = A.map(([x, y, r]) => bola(x, y, r, AZ)).join('') + B.map(([x, y, r]) => bola(x, y, r, NA)).join('');
    s += `<ellipse cx="230" cy="270" rx="85" ry="150" fill="${AZ}2e" stroke="${AZ}" stroke-width="5"/>`;
    s += `<ellipse cx="600" cy="275" rx="80" ry="140" fill="${NA}2e" stroke="${NA}" stroke-width="5"/>`;
    s += A.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="${AZ}"/>`).join('');
    s += B.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="${NA}"/>`).join('');
    s += `<line x1="290" y1="300" x2="382" y2="300" stroke="${AZ}" stroke-width="3"/>`;
    s += halo(ml(272, 332, 'a', AZ, 32)) + halo(ml(336, 286, `r${sub('a')}/2`, AZ, 32));
    s += `<line x1="530" y1="320" x2="458" y2="320" stroke="${NA}" stroke-width="3"/>`;
    s += halo(ml(550, 352, 'b', NA, 32)) + halo(ml(488, 304, `r${sub('b')}/2`, NA, 32));
    s += ml(105, 130, 'E', AZ, 48) + ml(712, 130, 'F', NA, 48);
    s += ml(400, 500, `G = ⋃ B(a, r${sub('a')}/2),   H = ⋃ B(b, r${sub('b')}/2)`, TI, 30);
    return svg(800, 560, s);
  })(),

  sierpinskiF: svg(800, 560,
    `<rect x="130" y="110" width="540" height="320" rx="50" fill="${GR}10" stroke="${GR}" stroke-width="4"/>` +
    `<circle cx="300" cy="275" r="88" fill="${AZ}14" stroke="${AZ}" stroke-width="4" stroke-dasharray="14 10"/>` +
    `<circle cx="520" cy="275" r="50" fill="${NA}2e" stroke="${NA}" stroke-width="5"/>` +
    `<circle cx="300" cy="285" r="10" fill="${AZ}"/><circle cx="520" cy="285" r="10" fill="${NA}"/>` +
    ml(300, 262, '0', AZ) + ml(520, 262, '1', NA) +
    ml(300, 165, '{0}', AZ, 38) + ml(520, 195, 'F = {1}', NA, 36) + ml(630, 95, 'X', GR, 46) +
    tl(400, 490, 'el único abierto que contiene a F es X', TI, 30) +
    tl(400, 532, 'abiertos: ∅, {0}, X  ·  cerrados: ∅, {1}, X', GR, 26)),
};
