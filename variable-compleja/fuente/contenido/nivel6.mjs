// NIVEL 6 · Integrales impropias y singularidades reales (valor principal)
import { r } from '../lib/mate.mjs';
import { plano, ejes, arco, seg, curva, poli, pto, etq, PI } from '../lib/plano.mjs';

const R3 = Math.sqrt(3), R2 = Math.SQRT2;

/** Contorno: [-R,R] con muescas superiores en los polos reales + semicírculo grande. */
const contorno = (R, muescas = [], eps = 0.3, o = {}) => {
  const els = [];
  let a = -R;
  for (const m of [...muescas].sort((p, q) => p - q)) {
    els.push(seg([a, 0], [m - eps, 0], { flecha: m - eps - a > 1.2 ? 0.6 : false, ...o }));
    els.push(arco([m, 0], eps, PI, 0, { flecha: false, ...o, c: 'c2' }));
    a = m + eps;
  }
  els.push(seg([a, 0], [R, 0], { flecha: R - a > 1.2 ? 0.6 : false, ...o }));
  els.push(arco([0, 0], R, 0, PI, { flecha: [0.3, 0.72], ...o }));
  return els;
};

const figSemi = plano({ x: [-3.5, 3.5], y: [-1.5, 3.6], w: 640 },
  ejes(),
  ...contorno(2.9),
  pto([-1.2, 1.25], '', { tipo: 'polo' }),
  pto([0.95, 1.85], 'z_k', { tipo: 'polo', pos: 'e' }),
  pto([0.5, -0.85], '', { tipo: 'polo', c: 'fuera' }),
  etq([2.25, 2.25], 'C_R', { c: 'am' }),
  etq([-2.9, 0], '-R', { pos: 's', c: 'tenue chica' }),
  etq([2.9, 0], 'R', { pos: 'sw', c: 'tenue chica' }),
);

const figJordan = plano({ x: [-3.5, 3.5], y: [-1.5, 3.6], w: 640 },
  ejes(),
  ...contorno(2.9),
  pto([-1.1, 1.3], '', { tipo: 'polo' }),
  etq([2.25, 2.25], 'C_R', { c: 'am' }),
  seg([1.2, 0.25], [1.2, 2.1], { c: 'c2 fina', flecha: 'fin', desde: 1 }),
  etq([1.3, 1.15], '|e^{iaz}|=e^{-ay}', { pos: 'e', c: 'ci chica', desde: 1 }),
);

const figE1 = plano({ x: [-3.9, 3.9], y: [-2.7, 3.9], w: 600 },
  ejes(),
  ...contorno(3.2),
  pto([-1, 2], '-1+2i', { tipo: 'polo', pos: 'n' }),
  pto([-1, -2], '-1-2i', { tipo: 'polo', pos: 's', c: 'fuera' }),
);

const fx = (x) => 0.55 / x, E = 0.5, X1 = 2.3;
const banda = (s) => {
  const pts = [[s * E, 0]];
  for (let k = 0; k <= 40; k++) { const x = E + (X1 - E) * k / 40; pts.push([s * x, s * fx(x)]); }
  pts.push([s * X1, 0]);
  return pts;
};
const figVP = plano({ x: [-2.8, 2.8], y: [-2.4, 2.4], w: 620 },
  poli(banda(1), { c: 'c3', desde: 1 }),
  poli(banda(-1), { c: 'rojo', desde: 1 }),
  ejes({ nombres: false }),
  curva((x) => [x, fx(x)], 0.235, 2.7, { c: 'fina' }),
  curva((x) => [x, fx(x)], -2.7, -0.235, { c: 'fina' }),
  seg([E, 0], [E, 1.5], { c: 'aux', desde: 1 }),
  seg([-E, 0], [-E, -1.5], { c: 'aux', desde: 1 }),
  etq([E, 0], 'x_0+\\varepsilon', { pos: 'se', c: 'tenue chica', desde: 1 }),
  etq([-E, 0], 'x_0-\\varepsilon', { pos: 'nw', c: 'tenue chica', desde: 1 }),
  etq([1.25, 0.2], '+', { c: 've', desde: 1 }),
  etq([-1.25, -0.2], '-', { c: 'ro', desde: 1 }),
  pto([0, 0], 'x_0', { tipo: 'polo', pos: 'sw' }),
);

const figMuesca = plano({ x: [-3.6, 3.6], y: [-1.4, 3.7], w: 650 },
  ejes(),
  ...contorno(3.0, [1.1], 0.45),
  pto([1.1, 0], 'x_0', { tipo: 'polo', pos: 's' }),
  pto([-1.0, 1.5], '', { tipo: 'polo' }),
  pto([0.3, 2.1], '', { tipo: 'polo' }),
  etq([1.1, 0.5], 'c_\\varepsilon', { pos: 'n', c: 'ci' }),
  etq([2.35, 2.3], 'C_R', { c: 'am' }),
);

const figE2 = plano({ x: [-3.9, 3.9], y: [-1.9, 3.9], w: 620 },
  ejes(),
  ...contorno(3.3, [2], 0.32),
  pto([2, 0], '2', { tipo: 'polo', pos: 's' }),
  pto([0, 1], 'i', { tipo: 'polo', pos: 'e' }),
  pto([0, -1], '-i', { tipo: 'polo', pos: 'e', c: 'fuera' }),
);

const figE3 = plano({ x: [-3.2, 3.2], y: [-1.7, 3.2], w: 620 },
  ejes(),
  ...contorno(2.7, [-1], 0.3),
  pto([-1, 0], '-1', { tipo: 'polo', pos: 's' }),
  pto([0.5, R3 / 2], 'e^{i\\pi/3}', { tipo: 'polo', pos: 'e' }),
  pto([0.5, -R3 / 2], 'e^{-i\\pi/3}', { tipo: 'polo', pos: 'e', c: 'fuera' }),
);

const figE5 = plano({ x: [-3.0, 3.0], y: [-1.7, 3.0], w: 620 },
  ejes(),
  ...contorno(2.5, [0], 0.3),
  pto([0, 0], '0', { tipo: 'polo', pos: 's' }),
  pto([R2 / 2, R2 / 2], 'e^{i\\pi/4}', { tipo: 'polo', pos: 'e' }),
  pto([-R2 / 2, R2 / 2], 'e^{3i\\pi/4}', { tipo: 'polo', pos: 'w' }),
  pto([R2 / 2, -R2 / 2], '', { tipo: 'polo', c: 'fuera' }),
  pto([-R2 / 2, -R2 / 2], '', { tipo: 'polo', c: 'fuera' }),
);

const figE6 = plano({ x: [-3.2, 3.2], y: [-1.7, 3.2], w: 620 },
  ejes(),
  ...contorno(2.7, [-1, 1], 0.3),
  pto([-1, 0], '-1', { tipo: 'polo', pos: 's' }),
  pto([1, 0], '1', { tipo: 'polo', pos: 's' }),
  pto([0, 1], 'i', { tipo: 'polo', pos: 'e' }),
  pto([0, -1], '-i', { tipo: 'polo', pos: 'e', c: 'fuera' }),
);

const figE7 = plano({ x: [-5.0, 5.0], y: [-2.6, 5.0], w: 620 },
  ejes(),
  ...contorno(4.3, [2], 0.4),
  pto([2, 0], '2', { tipo: 'polo', pos: 's' }),
  pto([-2, R3], '-2+\\sqrt3\\,i', { tipo: 'polo', pos: 'n' }),
  pto([-2, -R3], '-2-\\sqrt3\\,i', { tipo: 'polo', pos: 's', c: 'fuera' }),
);

export default {
  id: 'nivel6',
  n: 6,
  etiqueta: 'NIVEL 6',
  titulo: 'Integrales impropias y singularidades reales',
  sub: 'Semicírculos, lema de Jordan y valor principal de Cauchy',
  lista: 'Integrandos con singularidades reales (lista de 10 ejercicios)',
  escenas: [
    {
      portada: { nivel: 'NIVEL 6', titulo: 'Integrales impropias y<br>singularidades reales', sub: 'Semicírculos, lema de Jordan y valor principal de Cauchy' },
      pasos: [
        { h: '', v: r`Nivel seis, el último: integrales impropias sobre toda la recta real, incluyendo el caso en que el integrando tiene singularidades sobre el propio eje real. Es el tema más exigente del parcial, y combina todo lo que has aprendido.` },
        { h: r`<ul class="l"><li>Calcular $\int_{-\infty}^{\infty}$ de funciones racionales cerrando con un semicírculo.</li><li>Tratar $\cos ax$ y $\sen ax$ con $e^{iaz}$ y el lema de Jordan.</li><li>Definir y calcular el <span class="am">valor principal</span> de Cauchy.</li><li>Aplicar la regla: polo real simple = «medio residuo».</li></ul>`,
          v: r`Objetivos. Calcular integrales de funciones racionales sobre toda la recta, cerrando el camino con un semicírculo. Tratar integrales con senos y cosenos mediante la exponencial compleja y el lema de Jordan. Entender qué es el valor principal de Cauchy. Y aplicar la regla según la cual un polo simple sobre el eje real cuenta como medio residuo.` },
      ],
    },
    {
      t: 'Cerrar el camino con un semicírculo',
      fig: figSemi,
      clase: 'compacta',
      pasos: [
        { h: r`<p>Para calcular $\displaystyle\int_{-\infty}^{\infty}f(x)\dd x$ se integra $f(z)$ sobre el contorno cerrado formado por $[-R,R]$ y el semicírculo $C_R$.</p>`,
          v: r`La estrategia general es esta. Queremos una integral sobre el eje real. Tomamos el segmento de menos [[R]] a [[R]], y lo cerramos con un semicírculo de radio [[R]] en el semiplano superior. Sobre ese contorno cerrado sí podemos usar residuos.` },
        { h: r`$$\int_{-R}^{R}f(x)\dd x+\int_{C_R}f(z)\dd z=2\pi i\sum_{\Im z_k>0}\Res_{z=z_k}f.$$`,
          v: r`El teorema de los residuos dice que la integral sobre el segmento, más la integral sobre el arco, es [[2\pi i]] por la suma de los residuos en los polos del semiplano superior, una vez que [[R]] es suficientemente grande para encerrarlos a todos.` },
        { h: r`<div class="teo"><span class="rot">Caso racional.</span> Si $f=\dfrac PQ$, $Q$ no tiene ceros reales y $\operatorname{gr}Q\ge\operatorname{gr}P+2$, el arco desaparece ($ML\le\frac{C}{R^2}\,\pi R\to0$) y $$\int_{-\infty}^{\infty}f(x)\dd x=2\pi i\sum_{\Im z_k>0}\Res_{z=z_k}f.$$</div>`,
          v: r`Falta deshacerse del arco. Si la función es racional, y el grado del denominador supera al del numerador en al menos dos, la función decae como uno sobre [[R^2]], y la cota eme ele del nivel dos muestra que la integral sobre el arco tiende a cero. En el límite, la integral real es [[2\pi i]] por la suma de los residuos del semiplano superior.` },
      ],
    },
    {
      t: 'Integrales de Fourier y lema de Jordan',
      fig: figJordan,
      clase: 'compacta',
      pasos: [
        { h: r`<p>Para $\displaystyle\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}\cos(ax)\dd x$ (o con $\sen$), $a>0$: <b>no</b> se usa $\cos(az)$, que crece en el plano. Se integra $$F(z)=\frac{P(z)}{Q(z)}\,e^{iaz}$$ y al final se toma parte real o imaginaria.</p>`,
          v: r`Cuando el integrando tiene un coseno o un seno, hay una trampa. No se puede usar [[\cos(az)::coseno de a zeta]] en el plano complejo, porque el coseno complejo crece exponencialmente lejos del eje real. En su lugar se usa la exponencial [[e^{iaz}::e a la i a zeta]], y al final se toma la parte real para el coseno, o la parte imaginaria para el seno.` },
        { h: r`<p>Si $z=x+iy$ con $y>0$ y $a>0$: $\;|e^{iaz}|=e^{-ay}\le1$. La exponencial <span class="am">ayuda</span> en el semiplano superior.</p>`,
          v: r`La razón es que, para [[a]] positivo, el módulo de [[e^{iaz}::e a la i a zeta]] es [[e^{-ay}::e a la menos a ye]], que en el semiplano superior es menor o igual que uno, y decae al subir. La exponencial ayuda, en lugar de estorbar.` },
        { h: r`<div class="teo"><span class="rot">Lema de Jordan.</span> Si $a>0$ y $\operatorname{gr}Q\ge\operatorname{gr}P+1$: $$\lim_{R\to\infty}\int_{C_R}\frac{P(z)}{Q(z)}\,e^{iaz}\dd z=0.$$</div>`,
          v: r`El lema de Jordan precisa esa ayuda: con [[a]] positivo, basta que el grado del denominador supere al del numerador en uno, y no en dos, para que la integral sobre el arco tienda a cero.` },
        { h: r`<div class="ojo"><span class="rot">Si $a<0$</span> se cierra por el semiplano <b>inferior</b> (sentido horario: signo $-$), o se usa la paridad para pasar a $a>0$.</div>`,
          v: r`Si [[a]] es negativo, la exponencial decae hacia abajo, y hay que cerrar por el semiplano inferior, con sentido horario y un signo menos. O más fácil: usar que el coseno es par y el seno impar, para trabajar siempre con [[a]] positivo.` },
      ],
    },
    {
      t: r`Ejemplo 1 · $\displaystyle\int_{-\infty}^{\infty}\frac{\cos5x}{x^2+2x+5}\dd x$`,
      ref: 'Singularidades reales, ejercicios 8 y 9',
      fig: figE1,
      clase: 'compacta',
      pasos: [
        { h: r`<p>$F(z)=\dfrac{e^{5iz}}{z^2+2z+5}$. Polos: $z=-1\pm2i$ (no reales). Arriba: $z_1=-1+2i$.</p>`,
          v: r`Ejercicio ocho de la lista de singularidades. Cambiamos el coseno por [[e^{5iz}::e a la cinco i zeta]]. El denominador tiene discriminante negativo: sus raíces son [[-1\pm 2i::menos uno, más menos dos i]], y no hay polos reales. En el semiplano superior está [[-1+2i::menos uno más dos i]].` },
        { h: r`$$\Res_{z=z_1}F=\frac{e^{5iz_1}}{2z_1+2}=\frac{e^{5i(-1+2i)}}{4i}=\frac{e^{-10}\,e^{-5i}}{4i}.$$`,
          v: r`El residuo, con la regla [[p/q::pe sobre cu]], es la exponencial evaluada en el polo, sobre [[2z+2::dos zeta más dos]], que vale [[4i]]. El exponente es cinco [[i]], por [[-1+2i::menos uno más dos i]], que da menos diez, menos [[5i]].` },
        { h: r`$$\int_{-\infty}^{\infty}\frac{e^{5ix}}{x^2+2x+5}\dd x=2\pi i\cdot\frac{e^{-10}e^{-5i}}{4i}=\frac{\pi}{2}\,e^{-10}\left(\cos5-i\sen5\right).$$`,
          v: r`Por el lema de Jordan, la integral de la exponencial sobre la recta es [[2\pi i]] por ese residuo. Las [[i]] se cancelan, y queda [[\frac{\pi}{2}e^{-10}::pi medios, por e a la menos diez]], por [[\cos 5-i\sen 5::coseno de cinco, menos i seno de cinco]].` },
        { h: r`<div class="res">$$\int_{-\infty}^{\infty}\frac{\cos5x}{x^2+2x+5}\dd x=\frac{\pi}{2}\,e^{-10}\cos5.$$</div><p class="pie">$\approx2{,}02\times10^{-5}$. La parte imaginaria da, gratis, la integral con $\sen5x$.</p>`,
          v: r`Tomando parte real, la integral del coseno es [[\frac{\pi}{2}e^{-10}\cos 5::pi medios, por e a la menos diez, por coseno de cinco]]. Y gratis, la parte imaginaria da la integral correspondiente con seno.` },
      ],
    },
    {
      t: 'Polos sobre el eje real: el valor principal',
      fig: figVP,
      clase: 'compacta',
      pasos: [
        { h: r`<p>Si $f$ tiene un polo en un punto real $x_0$, la integral $\int_{-\infty}^{\infty}f(x)\dd x$ <b>diverge</b> en sentido usual, como $\displaystyle\int_0^1\frac{\dd x}{x}=\infty$.</p>`,
          v: r`Ahora el caso que da nombre a la lista: el integrando tiene un polo en un punto del eje real. Entonces la integral impropia, en el sentido usual, diverge, igual que diverge la integral de [[1/x::uno sobre equis]] cerca de cero.` },
        { h: r`<div class="def"><span class="rot">Valor principal de Cauchy.</span> Se quita un intervalo <b>simétrico</b> alrededor del polo: $$\vp\!\int_{-\infty}^{\infty}\!f\dd x=\lim_{\substack{R\to\infty\\ \eps\to0^+}}\left[\int_{-R}^{x_0-\eps}\!f\dd x+\int_{x_0+\eps}^{R}\!f\dd x\right].$$</div>`,
          v: r`Lo que sí puede existir es el valor principal de Cauchy. Se define quitando un intervalo simétrico, de radio [[\eps]], alrededor del polo; integrando sobre lo que queda; y tomando el límite cuando [[\eps]] tiende a cero. La simetría es esencial: las áreas infinitas a izquierda y derecha del polo tienen signos opuestos, y se cancelan.` },
        { h: r`<p><b>Ejemplo.</b> $\displaystyle\vp\!\int_{-1}^{1}\frac{\dd x}{x}=\lim_{\eps\to0}\big[\ln\eps-\ln\eps\big]=0$, aunque la integral ordinaria no existe.</p>`,
          v: r`El ejemplo mínimo: el valor principal de la integral de [[1/x::uno sobre equis]] entre menos uno y uno es cero, porque la función es impar, aunque la integral ordinaria no existe. Cuando en la lista aparece una integral con un polo real, se entiende siempre en el sentido del valor principal.` },
      ],
    },
    {
      t: 'El contorno con muesca y el «medio residuo»',
      fig: figMuesca,
      clase: 'compacta',
      pasos: [
        { h: r`<p>Se esquiva el polo real $x_0$ con un semicírculo pequeño $c_\eps$ por arriba. Dentro del contorno quedan solo los polos con $\Im z>0$.</p>`,
          v: r`Para calcular un valor principal con residuos, modificamos el contorno. Al llegar cerca del polo real, lo esquivamos por arriba con un semicírculo pequeño, de radio [[\eps]]. Dentro del contorno quedan únicamente los polos del semiplano superior.` },
        { h: r`<div class="teo"><span class="rot">Lema del arco pequeño.</span> Si $x_0$ es un polo <b>simple</b> y $c_\eps$ se recorre en sentido horario: $$\lim_{\eps\to0}\int_{c_\eps}f(z)\dd z=-\pi i\,\Res_{z=x_0}f.$$</div>`,
          v: r`La pieza nueva es el lema del arco pequeño. Si el polo es simple, la integral sobre el semicírculo pequeño, recorrido en sentido horario, tiende a menos [[\pi i]] por el residuo. La intuición: cerca del polo, la función se comporta como el residuo, sobre [[z-x_0::zeta menos equis cero]]. Una vuelta completa daría [[2\pi i]]; media vuelta da [[\pi i]]; y el sentido horario pone el signo menos.`,
          nota: r`Demostración: cerca de $x_0$, $f(z)=\dfrac{\rho}{z-x_0}+h(z)$ con $\rho=\Res_{z=x_0}f$ y $h$ analítica. Con $z=x_0+\eps e^{i\theta}$, $\theta$ de $\pi$ a $0$: $\int_{c_\eps}\frac{\rho}{z-x_0}\dd z=\rho\int_\pi^0 i\dd\theta=-\pi i\rho$, y $\left|\int_{c_\eps}h\dd z\right|\le\max|h|\cdot\pi\eps\to0$.` },
        { h: r`<div class="res">$$\vp\!\int_{-\infty}^{\infty}f(x)\dd x=2\pi i\sum_{\Im z_k>0}\Res f+\pi i\sum_{x_j\in\R}\Res f.$$</div>`,
          v: r`Pasando ese término al otro lado, obtenemos la fórmula de trabajo de este nivel. El valor principal es [[2\pi i]] por la suma de los residuos del semiplano superior, más [[\pi i]] por la suma de los residuos en los polos reales. Los polos reales cuentan la mitad.` },
        { h: r`<div class="ojo"><span class="rot">Condiciones.</span> Polos reales <b>simples</b>, y el arco grande debe desaparecer (grados o lema de Jordan). Con un polo real doble, el valor principal en general no existe.</div>`,
          v: r`Dos condiciones. Los polos reales tienen que ser simples; con un polo real doble, el valor principal en general no existe. Y el arco grande debe desaparecer, por la condición de los grados, o por el lema de Jordan.` },
      ],
    },
    {
      t: r`Ejemplo 2 · $\displaystyle\vp\!\int_{-\infty}^{\infty}\frac{x+1}{(x-2)(x^2+1)}\dd x$`,
      ref: 'Singularidades reales, ejercicio 7',
      fig: figE2,
      clase: 'compacta',
      pasos: [
        { h: r`<p>Grados $1$ y $3$ <span class="ve">✓</span>. Polos: $z=2$ (real, simple), $z=i$ (arriba), $z=-i$ (abajo: no cuenta).</p>`,
          v: r`Ejercicio siete. Función racional con grados uno y tres, así que el arco grande desaparece. Los polos son: dos, que es real y simple; [[i]], en el semiplano superior; y [[-i::menos i]], en el inferior, que no interviene.` },
        { h: r`$$\Res_{z=2}=\frac{2+1}{2^2+1}=\frac35,\qquad\Res_{z=i}=\frac{i+1}{(i-2)(2i)}=\frac{1+i}{-2-4i}=-\frac{3-i}{10}.$$`,
          v: r`Los residuos. En dos, tapamos el factor [[x-2::equis menos dos]] y evaluamos: tres quintos. En [[i]], tapamos [[z-i::zeta menos i]]: el numerador es [[1+i::uno más i]], y el denominador es [[(i-2)(2i)::i menos dos, por dos i]], que es [[-2-4i::menos dos, menos cuatro i]]. Racionalizando, el residuo es [[-\frac{3-i}{10}::menos, tres menos i, sobre diez]].` },
        { h: r`<div class="res">$$\vp\!\int=2\pi i\left(-\frac{3-i}{10}\right)+\pi i\cdot\frac35=\frac{-3\pi i-\pi}{5}+\frac{3\pi i}{5}=-\frac{\pi}{5}.$$</div>`,
          v: r`Aplicamos la fórmula: [[2\pi i]] por el residuo de arriba, más [[\pi i]] por el residuo real. Las partes imaginarias se cancelan, como debe ocurrir con un integrando real, y el valor principal es [[-\frac{\pi}{5}::menos pi quintos]].` },
      ],
    },
    {
      t: r`Ejemplo 3 · $\displaystyle\vp\!\int_{-\infty}^{\infty}\frac{x}{x^3+1}\dd x$`,
      ref: 'Singularidades reales, ejercicio 2',
      fig: figE3,
      clase: 'compacta',
      pasos: [
        { h: r`<p>$z^3=-1$: $\;z=-1$ (real), $\;z=e^{i\pi/3}$ (arriba), $\;z=e^{-i\pi/3}$ (abajo).</p>`,
          v: r`Ejercicio dos. Los polos son las tres raíces cúbicas de menos uno: el menos uno, que es real; [[e^{i\pi/3}::e a la i pi tercios]], en el semiplano superior; y su conjugado, abajo.` },
        { h: r`<p>Regla $p/q$: $\;\displaystyle\Res_{z=z_0}\frac{z}{z^3+1}=\frac{z_0}{3z_0^2}=\frac{1}{3z_0}$.</p>$$\Res_{z=-1}=-\frac13,\qquad\Res_{z=e^{i\pi/3}}=\frac{e^{-i\pi/3}}{3}.$$`,
          v: r`Aquí la regla [[p/q::pe sobre cu]] es ideal, porque da una fórmula única para los tres polos: [[z_0]] sobre [[3z_0^2::tres zeta cero al cuadrado]], que es uno sobre [[3z_0::tres zeta cero]]. En menos uno, el residuo es menos un tercio. En [[e^{i\pi/3}::e a la i pi tercios]], es [[e^{-i\pi/3}::e a la menos i pi tercios]], sobre tres.` },
        { h: r`<div class="res">$$\vp\!\int=2\pi i\cdot\frac{e^{-i\pi/3}}{3}-\frac{\pi i}{3}=\frac{\pi i}{3}\left(2e^{-i\pi/3}-1\right)=\frac{\pi i}{3}\left(-\sqrt3\,i\right)=\frac{\pi}{\sqrt3}.$$</div>`,
          v: r`Sustituimos en la fórmula, y sacamos factor común [[\frac{\pi i}{3}::pi i sobre tres]]. Como [[e^{-i\pi/3}::e a la menos i pi tercios]] es un medio, menos raíz de tres medios por [[i]], el paréntesis vale menos raíz de tres por [[i]]. El resultado es [[\frac{\pi}{\sqrt3}::pi sobre raíz de tres]].` },
      ],
    },
    {
      t: r`Ejemplo 4 · $\displaystyle\vp\!\int_{-\infty}^{\infty}\frac{\cos\pi x}{x^3+1}\dd x\;$ y $\;\displaystyle\int_{-\infty}^{\infty}\frac{\sen\pi x}{x^3+1}\dd x$`,
      ref: 'Singularidades reales, ejercicios 3, 4 y 5',
      clase: 'mini',
      pasos: [
        { h: r`<p>$F(z)=\dfrac{e^{i\pi z}}{z^3+1}$, $\quad\displaystyle\Res_{z=z_0}F=\frac{e^{i\pi z_0}}{3z_0^2}$ (regla $p/q$). Jordan: $a=\pi>0$, grados $0$ y $3$ <span class="ve">✓</span></p>`,
          v: r`Los ejercicios tres, cuatro y cinco se resuelven de una sola vez, con la función [[\frac{e^{i\pi z}}{z^3+1}::e a la i pi zeta, sobre zeta cubo más uno]]. Los polos son los mismos del ejemplo anterior, y el residuo general es [[\frac{e^{i\pi z_0}}{3z_0^2}::e a la i pi zeta cero, sobre tres zeta cero al cuadrado]].` },
        { h: r`<p>En $-1$: $\;\dfrac{e^{-i\pi}}{3}=-\dfrac13$. $\quad$ En $z_1=e^{i\pi/3}=\frac12+\frac{\sqrt3}{2}i$: $\;e^{i\pi z_1}=e^{i\pi/2}\,e^{-\sqrt3\pi/2}=i\,e^{-\sqrt3\pi/2}$, $\;z_1^2=e^{2\pi i/3}$:</p>$$\Res_{z=z_1}F=\frac{i\,e^{-\sqrt3\pi/2}\,e^{-2\pi i/3}}{3}.$$`,
          v: r`En menos uno, la exponencial vale [[e^{-i\pi}::e a la menos i pi]], que es menos uno, y el residuo es menos un tercio. En [[z_1]], que es un medio, más raíz de tres medios por [[i]], el exponente [[i\pi z_1::i pi zeta uno]] se separa en [[i\pi/2::i pi medios]], cuya exponencial es [[i]], y una parte real negativa, que da el factor [[e^{-\sqrt3\pi/2}::e a la menos raíz de tres, pi medios]]. El cuadrado de [[z_1]] es [[e^{2\pi i/3}::e a la dos pi i tercios]].` },
        { h: r`$$\vp\!\int_{-\infty}^{\infty}\frac{e^{i\pi x}}{x^3+1}\dd x=2\pi i\Res_{z=z_1}F+\pi i\left(-\tfrac13\right)=\frac{\pi}{3}\,e^{-\sqrt3\pi/2}\left(1+\sqrt3\,i\right)-\frac{\pi}{3}\,i.$$`,
          v: r`Aplicamos la fórmula. En el primer término, [[i]] por [[i]] da menos uno; y menos dos por [[e^{-2\pi i/3}::e a la menos dos pi i tercios]], es [[1+\sqrt3 i::uno más raíz de tres i]]. El polo real aporta menos [[\frac{\pi}{3}i::pi tercios por i]].` },
        { h: r`<div class="res">$$\vp\!\int_{-\infty}^{\infty}\frac{\cos\pi x}{x^3+1}\dd x=\frac{\pi}{3}\,e^{-\sqrt3\pi/2},\qquad\int_{-\infty}^{\infty}\frac{\sen\pi x}{x^3+1}\dd x=\frac{\pi}{3}\left(\sqrt3\,e^{-\sqrt3\pi/2}-1\right).$$</div>`,
          v: r`Separando parte real e imaginaria, obtenemos las dos integrales. La del coseno vale [[\frac{\pi}{3}e^{-\sqrt3\pi/2}::pi tercios, por e a la menos raíz de tres, pi medios]]. La del seno vale pi tercios, por la cantidad: raíz de tres por esa misma exponencial, menos uno.` },
        { h: r`<div class="ojo"><span class="rot">Matiz.</span> $\sen\pi x$ se anula en $x=-1$: la singularidad del integrando con seno es <b>evitable</b> y esa integral converge en sentido ordinario. La del coseno solo existe como valor principal.</div>`,
          v: r`Un matiz para el examen. El seno de [[\pi x::pi equis]] se anula en menos uno, justo donde está el polo. Por eso el integrando con seno tiene allí una singularidad evitable, y su integral converge en sentido ordinario. La del coseno, en cambio, solo existe como valor principal.` },
      ],
    },
    {
      t: r`Ejemplo 5 · $\displaystyle\int_{-\infty}^{\infty}\frac{\sen(\pi\sqrt2\,x)}{x^5+x}\dd x$`,
      ref: 'Singularidades reales, ejercicio 6',
      fig: figE5,
      clase: 'mini',
      pasos: [
        { h: r`<p>$F(z)=\dfrac{e^{iaz}}{z\,(z^4+1)}$, $a=\pi\sqrt2$. Polos: $z=0$ (real) y las raíces de $z^4=-1$; arriba, $z_1=e^{i\pi/4}$ y $z_2=e^{3i\pi/4}$.</p>`,
          v: r`Ejercicio seis. El denominador es [[x(x^4+1)::equis, por equis a la cuarta más uno]]. Trabajamos con la exponencial, con [[a]] igual a pi por raíz de dos. Hay un polo real en cero, y cuatro polos en las raíces cuartas de menos uno, de los cuales dos están arriba: [[e^{i\pi/4}::e a la i pi cuartos]], y [[e^{3i\pi/4}::e a la tres i pi cuartos]].` },
        { h: r`<p>$\Res_{z=0}F=1$. En $z_k^4=-1$ (regla $p/q$, $q'=5z^4+1$): $\;\displaystyle\Res_{z=z_k}F=\frac{e^{iaz_k}}{5z_k^4+1}=-\frac{e^{iaz_k}}{4}$.</p>`,
          v: r`En cero, el residuo es uno. Para los otros polos, usamos la regla [[p/q::pe sobre cu]] con el denominador sin factorizar, cuya derivada es [[5z^4+1::cinco zeta a la cuarta, más uno]]. Como en esos polos [[z^4::zeta a la cuarta]] vale menos uno, la derivada vale menos cuatro. El residuo es menos la exponencial, sobre cuatro.` },
        { h: r`<p>$az_1=\pi(1+i)$, $\;az_2=\pi(-1+i)$ ⟹ $e^{iaz_1}=e^{i\pi}e^{-\pi}=-e^{-\pi}$, $\;e^{iaz_2}=e^{-i\pi}e^{-\pi}=-e^{-\pi}$.</p><p>Suma de los residuos de arriba: $\dfrac{e^{-\pi}}{4}+\dfrac{e^{-\pi}}{4}=\dfrac{e^{-\pi}}{2}$.</p>`,
          v: r`El valor de [[a]] está elegido para que las cuentas salgan limpias. [[a]] por [[z_1]] es [[\pi(1+i)::pi por uno más i]], y la exponencial vale [[-e^{-\pi}::menos e a la menos pi]]. Con [[z_2]] ocurre lo mismo. Cada residuo es [[e^{-\pi}/4::e a la menos pi, sobre cuatro]], y la suma es [[e^{-\pi}/2::e a la menos pi, sobre dos]].` },
        { h: r`<div class="res">$$\vp\!\int\frac{e^{iax}}{x^5+x}\dd x=2\pi i\cdot\frac{e^{-\pi}}{2}+\pi i\cdot1=\pi i\left(1+e^{-\pi}\right)$$ $$\Longrightarrow\quad\int_{-\infty}^{\infty}\frac{\sen(\pi\sqrt2\,x)}{x^5+x}\dd x=\pi\left(1+e^{-\pi}\right).$$</div>`,
          v: r`La fórmula da [[\pi i(1+e^{-\pi})::pi i, por uno más e a la menos pi]]. Es imaginario puro, y su parte imaginaria es la integral del seno: [[\pi(1+e^{-\pi})::pi, por uno más e a la menos pi]]. De nuevo, el seno cancela el polo en cero, y la integral converge en sentido ordinario.` },
      ],
    },
    {
      t: r`Ejemplo 6 · $\displaystyle\vp\!\int_{-\infty}^{\infty}\frac{\cos^2(\pi x)}{1-x^4}\dd x$`,
      ref: 'Singularidades reales, ejercicio 10',
      fig: figE6,
      clase: 'mini',
      pasos: [
        { h: r`<p>Linealizar: $\cos^2\pi x=\dfrac{1+\cos2\pi x}{2}$. Se necesitan $$I_1=\vp\!\int_{-\infty}^{\infty}\frac{\dd x}{1-x^4},\qquad I_2=\vp\!\int_{-\infty}^{\infty}\frac{e^{2\pi ix}}{1-x^4}\dd x.$$</p>`,
          v: r`Ejercicio diez. Un coseno al cuadrado no se puede sustituir directamente por una exponencial. Primero se linealiza, con la identidad del ángulo doble. Necesitamos dos valores principales: el de uno sobre [[1-x^4::uno menos equis a la cuarta]], y el de la exponencial [[e^{2\pi ix}::e a la dos pi i equis]] sobre el mismo denominador.` },
        { h: r`<p>Polos: $z^4=1$ → $\pm1$ (reales), $i$ (arriba), $-i$. Regla $p/q$ con $q'=-4z^3$ y $\frac{1}{z_0^3}=z_0$: $$\Res_{z=z_0}\frac{g(z)}{1-z^4}=-\frac{z_0\,g(z_0)}{4}.$$</p>`,
          v: r`Los polos son las raíces cuartas de uno: más y menos uno, sobre el eje real, y más y menos [[i]]. Con la regla [[p/q::pe sobre cu]], la derivada del denominador es [[-4z^3::menos cuatro zeta cubo]]. Y como en estos polos uno sobre [[z^3::zeta cubo]] es igual a [[z]], el residuo es menos [[z_0]] por el numerador, sobre cuatro.` },
        { h: r`<p>$I_1$: residuos $-\frac14$ (en $1$), $\frac14$ (en $-1$), $-\frac i4$ (en $i$) ⟹ $I_1=2\pi i\left(-\frac i4\right)+0=\dfrac{\pi}{2}$.</p><p>$I_2$: $-\frac14$, $\frac14$, $-\frac i4e^{-2\pi}$ ⟹ $I_2=\dfrac{\pi}{2}\,e^{-2\pi}$.</p>`,
          v: r`Para la primera integral, los residuos en uno y en menos uno son opuestos, y se cancelan. El de [[i]] es [[-i/4::menos i sobre cuatro]], y el valor principal es pi medios. Para la segunda, la exponencial vale uno en los dos polos reales, que vuelven a cancelarse, y en [[i]] aporta el factor [[e^{-2\pi}::e a la menos dos pi]]. El resultado es [[\frac{\pi}{2}e^{-2\pi}::pi medios, por e a la menos dos pi]].` },
        { h: r`<div class="res">$$\vp\!\int_{-\infty}^{\infty}\frac{\cos^2(\pi x)}{1-x^4}\dd x=\frac{I_1+\Re I_2}{2}=\frac{\pi}{4}\left(1+e^{-2\pi}\right).$$</div>`,
          v: r`Promediando, el valor principal es [[\frac{\pi}{4}(1+e^{-2\pi})::pi cuartos, por uno más e a la menos dos pi]].` },
      ],
    },
    {
      t: r`Ejemplo 7 · $\displaystyle\vp\!\int_{-\infty}^{\infty}\frac{x+2}{(2-x)(x^2+4x+7)}\dd x$`,
      ref: 'Singularidades reales, ejercicio 1',
      fig: figE7,
      clase: 'compacta',
      pasos: [
        { h: r`<p>$f(z)=-\dfrac{z+2}{(z-2)(z^2+4z+7)}$. Polos: $2$ (real) y $-2\pm\sqrt3\,i$; arriba, $z_1=-2+\sqrt3\,i$.</p>`,
          v: r`Para terminar, el ejercicio uno. Reescribimos [[2-x::dos menos equis]] como menos [[x-2::equis menos dos]], para no equivocarnos con el signo. Los polos son: dos, sobre el eje real, y las raíces del factor cuadrático, que ya encontramos en el nivel cuatro: [[-2\pm\sqrt3 i::menos dos, más menos raíz de tres i]].` },
        { h: r`<p>$\Res_{z=2}=-\dfrac{4}{19}$.</p>$$\Res_{z=z_1}=-\frac{z_1+2}{(z_1-2)(2z_1+4)}=-\frac{1}{2(z_1-2)}=\frac{1}{2(4-\sqrt3\,i)}=\frac{4+\sqrt3\,i}{38}.$$`,
          v: r`En dos, el residuo es menos cuatro sobre diecinueve. En [[z_1]], usamos la regla [[p/q::pe sobre cu]] para el factor cuadrático: su derivada, [[2z+4::dos zeta más cuatro]], es el doble del numerador, y se cancela. Queda menos uno sobre [[2(z_1-2)::dos, por zeta uno menos dos]], que racionalizando es [[\frac{4+\sqrt3i}{38}::cuatro más raíz de tres i, sobre treinta y ocho]].` },
        { h: r`<div class="res">$$\vp\!\int=2\pi i\cdot\frac{4+\sqrt3\,i}{38}+\pi i\left(-\frac{4}{19}\right)=\frac{4\pi i-\sqrt3\,\pi}{19}-\frac{4\pi i}{19}=-\frac{\sqrt3\,\pi}{19}.$$</div>`,
          v: r`En la fórmula final, las partes imaginarias se cancelan otra vez, y el valor principal es [[-\frac{\sqrt3\pi}{19}::menos raíz de tres pi, sobre diecinueve]].` },
      ],
    },
    {
      t: 'Mapa de decisión de todo el curso',
      clase: 'compacta',
      pasos: [
        { h: r`<table class="t"><tr><th>Integral</th><th>Herramienta</th></tr><tr><td>$\int_\gamma f\dd z$, $f$ no analítica</td><td>parametrizar</td></tr><tr><td>$\int_\gamma f\dd z$, $f$ analítica, $\gamma$ abierta</td><td>primitiva o cambiar de camino</td></tr><tr><td>$\oint_\gamma f\dd z$ con singularidades dentro</td><td>fórmula de Cauchy o residuos</td></tr><tr><td>$\int_0^{2\pi}R(\cos x,\sen x)\dd x$</td><td>$z=e^{ix}$, polos en $|z|<1$</td></tr><tr><td>$\int_{-\infty}^{\infty}\frac PQ\dd x$, $\;\int_{-\infty}^{\infty}\frac PQ\,e^{iax}\dd x$</td><td>semicírculo, polos de arriba</td></tr><tr><td>…con polos reales simples</td><td>$\vp=2\pi i\sum_{\text{arriba}}+\pi i\sum_{\text{reales}}$</td></tr></table>`,
          v: r`Para cerrar el curso, el mapa de decisión completo. Si la función no es analítica, se parametriza. Si es analítica y la curva es abierta, se usa una primitiva, o se cambia de camino. Si la curva es cerrada y encierra singularidades, fórmula de Cauchy o residuos. Si es una integral trigonométrica sobre un periodo, el cambio al círculo unitario. Si es una integral sobre toda la recta, el semicírculo y los polos del semiplano superior, con la exponencial si hay senos o cosenos. Y si hay polos reales simples, valor principal, contando esos polos con [[\pi i]], en lugar de [[2\pi i]].` },
      ],
    },
    {
      t: 'Errores frecuentes y cierre del curso',
      clase: 'compacta',
      pasos: [
        { h: r`<div class="ojo"><span class="rot">Errores que cuestan puntos</span><ul class="l"><li>Usar $\cos(az)$ en lugar de $e^{iaz}$.</li><li>Contar los polos reales con $2\pi i$ (es $\pi i$), o incluir los de abajo.</li><li>No verificar los grados (el arco grande debe desaparecer).</li><li>Olvidar tomar $\Re$ o $\Im$ al final.</li><li>Aplicar el «medio residuo» a un polo real que no es simple.</li></ul></div>`,
          v: r`Los errores típicos de este nivel. Usar el coseno complejo en lugar de la exponencial. Contar los polos reales con [[2\pi i]], o incluir los del semiplano inferior. No verificar la condición de los grados. Olvidar tomar la parte real o la imaginaria al final. Y aplicar la regla del medio residuo a un polo real que no es simple.` },
        { h: r`<div class="res"><span class="rot">Resumen</span><ul class="l"><li>Racional, sin polos reales, $\operatorname{gr}Q\ge\operatorname{gr}P+2$: $\;2\pi i\sum_{\text{arriba}}\Res$.</li><li>Con $e^{iax}$, $a>0$: basta $\operatorname{gr}Q\ge\operatorname{gr}P+1$ (Jordan).</li><li>Polos reales simples: $\;\vp=2\pi i\sum_{\text{arriba}}\Res+\pi i\sum_{\text{reales}}\Res$.</li></ul></div>`,
          v: r`Resumen. Para una función racional sin polos reales, con dos grados de diferencia, la integral es [[2\pi i]] por la suma de residuos de arriba. Con una exponencial de frecuencia positiva basta un grado de diferencia, por el lema de Jordan. Y con polos reales simples, el valor principal suma, además, [[\pi i]] por los residuos reales.` },
        { h: r`<p class="am"><b>Último paso:</b> práctica del Nivel 6 y, al aprobarla, el simulacro de parcial.</p>`,
          v: r`Has completado los seis niveles. Resuelve la práctica del nivel seis, y al aprobarla se desbloquea el simulacro de parcial, que mezcla todos los temas. Mucho éxito en el examen.` },
      ],
    },
  ],
};
