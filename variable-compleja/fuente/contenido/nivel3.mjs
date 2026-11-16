// NIVEL 3 · Teorema de Cauchy y fórmula integral de Cauchy
import { r } from '../lib/mate.mjs';
import { plano, ejes, arco, circ, seg, curva, disco, region, ptsCirc, ptsCurva, pto, etq, corte, PI } from '../lib/plano.mjs';

const R2 = Math.SQRT2;
// contorno "genérico" (una curva cerrada simple no circular)
const blob = (cx, cy, s = 1) => (t) => [cx + s * (1.45 * Math.cos(t) + 0.18 * Math.cos(2 * t)), cy + s * (1.05 * Math.sin(t) + 0.14 * Math.sin(3 * t))];

const figCG = plano({ x: [-0.6, 3.8], y: [-0.5, 3.0], w: 620 },
  region([ptsCurva(blob(1.7, 1.3), 0, 2 * PI)], { c: 'c2' }),
  ejes(),
  curva(blob(1.7, 1.3), 0, 2 * PI, { flecha: [0.1, 0.6], trazo: true, desde: 0 }),
  etq([3.25, 2.25], '\\gamma', { c: 'am' }),
  etq([1.7, 1.3], 'f\\ \\text{analítica}', { c: 'ci chica' }),
);

const pA = [1.25, 1.35], pB = [2.3, 1.0], pC = [1.55, 0.75];
const figDef = plano({ x: [-0.6, 3.8], y: [-0.5, 3.0], w: 620 },
  region([ptsCurva(blob(1.7, 1.3), 0, 2 * PI), ptsCirc(pA, 0.3)], { c: 'c2', hasta: 1 }),
  region([ptsCurva(blob(1.7, 1.3), 0, 2 * PI), ptsCirc(pA, 0.3), ptsCirc(pB, 0.3), ptsCirc(pC, 0.3)], { c: 'c2', desde: 2 }),
  ejes(),
  curva(blob(1.7, 1.3), 0, 2 * PI, { flecha: [0.1, 0.6] }),
  etq([3.25, 2.25], '\\Gamma', { c: 'am' }),
  circ(pA, 0.3, { c: 'c3 fina', flecha: [0.1], tam: 0.7, desde: 1, trazo: true }),
  pto(pA, '', { tipo: 'polo' }),
  etq([pA[0] - 0.42, pA[1] + 0.42], '\\gamma', { c: 've', desde: 1 }),
  circ(pB, 0.3, { c: 'c3 fina', flecha: [0.1], tam: 0.7, desde: 2, trazo: true }),
  pto(pB, '', { tipo: 'polo', desde: 2 }),
  circ(pC, 0.3, { c: 'c3 fina', flecha: [0.1], tam: 0.7, desde: 2, trazo: true }),
  pto(pC, '', { tipo: 'polo', desde: 2 }),
);

const figFIC = plano({ x: [-0.6, 3.8], y: [-0.5, 3.0], w: 620 },
  ejes(),
  curva(blob(1.7, 1.3), 0, 2 * PI, { flecha: [0.1, 0.6] }),
  etq([3.25, 2.25], '\\gamma', { c: 'am' }),
  circ([1.5, 1.25], 0.34, { c: 'c3 fina', flecha: [0.1], tam: 0.7, desde: 1, trazo: true }),
  pto([1.5, 1.25], 'z_0', { pos: 'se' }),
);

const cD = [1.6, 1.3];
const figDist = plano({ x: [-0.8, 4.4], y: [-0.7, 3.2], w: 640 },
  ejes(),
  circ(cD, 1.15, { flecha: [0.13] }),
  seg(cD, [2.2, 1.85], { c: 'aux' }),
  seg(cD, [3.55, 0.45], { c: 'aux' }),
  pto(cD, 'c', { pos: 'w' }),
  pto([2.2, 1.85], '\\text{dentro}', { tipo: 'polo', pos: 'n', c: 've' }),
  pto([3.55, 0.45], '\\text{fuera}', { tipo: 'polo', pos: 'n', c: 'fuera' }),
  etq([0.6, 2.55], '|z-c|=r', { c: 'am chica' }),
);

const figE1 = plano({ x: [-3.3, 3.3], y: [-3.0, 4.7], w: 520 },
  disco([0, 2], 2, { c: 'suave' }),
  ejes(),
  circ([0, 2], 2, { flecha: [0.1], trazo: true, desde: 0 }),
  pto([0, 2], '2i', { tipo: 'polo', pos: 'e' }),
  pto([0, -2], '-2i', { tipo: 'polo', pos: 'e', c: 'fuera' }),
  seg([0, 2], [0, -2], { c: 'aux', desde: 0 }),
  etq([-0.1, -0.9], '4', { pos: 'w', c: 'tenue chica' }),
);

const figE2 = plano({ x: [-2.7, 3.3], y: [-2.75, 2.75], w: 600 },
  disco([R2, 0], 1, { c: 'suave' }),
  ejes(),
  circ([R2, 0], 1, { flecha: [0.1], trazo: true, desde: 0 }),
  pto([R2, 0], '\\sqrt2', { tipo: 'polo', pos: 'ne', desde: 0 }),
  pto([-R2, 0], '-\\sqrt2', { tipo: 'polo', pos: 'n', c: 'fuera', desde: 0 }),
  pto([0, 2], '2i', { tipo: 'polo', pos: 'e', c: 'fuera', desde: 0 }),
  pto([0, -2], '-2i', { tipo: 'polo', pos: 'e', c: 'fuera', desde: 0 }),
  seg([R2, 0], [0, 2], { c: 'aux', desde: 1, tex: '\\sqrt6', pos: 'ne' }),
);

const figE4 = plano({ x: [-2.2, 2.2], y: [-2.7, 2.8], w: 500 },
  disco([0, 1], 0.5, { c: 'suave' }),
  ejes(),
  circ([0, 1], 0.5, { flecha: [0.1], tam: 0.8 }),
  pto([0, 1], 'i', { tipo: 'polo', pos: 'e' }),
  pto([0, -1], '-i', { tipo: 'polo', pos: 'e', c: 'fuera' }),
  pto([0, 2], '2i', { tipo: 'polo', pos: 'e', c: 'fuera' }),
  pto([0, -2], '-2i', { tipo: 'polo', pos: 'e', c: 'fuera' }),
);

const wv = [1.15, 0.65], mw = Math.hypot(wv[0], wv[1]);
const figE5 = plano({ x: [-2.3, 3.4], y: [-1.6, 2.7], w: 620 },
  disco(wv, mw, { c: 'suave' }),
  ejes(),
  circ(wv, mw, { flecha: [0.1], trazo: true, desde: 0 }),
  pto(wv, 'w', { tipo: 'polo', pos: 'ne' }),
  pto([-wv[0], -wv[1]], '-w', { tipo: 'polo', pos: 'sw', c: 'fuera' }),
  seg(wv, [-wv[0], -wv[1]], { c: 'aux' }),
  etq([-0.55, 0.05], '2|w|', { pos: 'n', c: 'tenue chica' }),
);

const w6 = [0.95, 0.5], m6 = Math.hypot(w6[0], w6[1]), R6 = 2 * m6;
const figE6 = plano({ x: [-2.7, 2.7], y: [-1.5, 2.7], w: 640 },
  ejes(),
  arco([0, 0], R6, 0, PI, { flecha: [0.35], trazo: true, desde: 0 }),
  seg([-R6, 0], [R6, 0], { flecha: 0.75, desde: 0 }),
  pto([-w6[1], w6[0]], 'iw', { tipo: 'polo', pos: 'nw', desde: 1 }),
  pto([w6[1], -w6[0]], '-iw', { tipo: 'polo', pos: 'se', c: 'fuera', desde: 1 }),
  pto(w6, 'w', { pos: 'ne', desde: 1 }),
  etq([R6, 0], '2|w|', { pos: 'sw', c: 'tenue chica' }),
  etq([-R6, 0], '-2|w|', { pos: 'se', c: 'tenue chica' }),
  etq([1.7, 1.75], '\\alpha', { c: 'am' }),
);

const figE7 = plano({ x: [-2.6, 2.6], y: [-0.7, 3.5], w: 620 },
  disco([0, 2], 1, { c: 'suave' }),
  ejes(),
  corte([-2.5, 0], [0, 0], { tex: '\\text{corte de }\\Log', c: 'ro chica' }),
  circ([0, 2], 1, { flecha: [0.1] }),
  pto([0, 2], '2i', { tipo: 'polo', pos: 'e' }),
  pto([1, 0], '1', { tipo: 'hueco', pos: 'ne', desde: 0 }),
  seg([0, 2], [1, 0], { c: 'aux', desde: 1, tex: '\\sqrt5', pos: 'e' }),
);

const w9 = [1.0, 0.45], m9 = Math.hypot(w9[0], w9[1]);
const figDos = plano({ x: [-2.9, 2.9], y: [-2.6, 2.6], w: 580 },
  ejes(),
  circ([0, 0], 2 * m9, { flecha: [0.1] }),
  pto(w9, 'w', { tipo: 'polo', pos: 'ne' }),
  pto([-w9[0], -w9[1]], '-w', { tipo: 'polo', pos: 'sw' }),
  circ(w9, 0.42, { c: 'c3 fina', flecha: [0.1], tam: 0.7, desde: 1, trazo: true }),
  circ([-w9[0], -w9[1]], 0.42, { c: 'c3 fina', flecha: [0.1], tam: 0.7, desde: 1, trazo: true }),
  etq([1.75, 1.75], '|z|=2|w|', { c: 'am chica' }),
);

export default {
  id: 'nivel3',
  n: 3,
  etiqueta: 'NIVEL 3',
  titulo: 'Teorema y fórmula integral de Cauchy',
  sub: 'Integrar sin integrar: todo depende de lo que hay dentro de la curva',
  lista: 'Fórmula integral de Cauchy (lista de 10 ejercicios)',
  escenas: [
    {
      portada: { nivel: 'NIVEL 3', titulo: 'Teorema y fórmula<br>integral de Cauchy', sub: 'Integrar sin integrar: todo depende de lo que hay dentro de la curva' },
      pasos: [
        { h: '', v: r`Nivel tres: el teorema de Cauchy y la fórmula integral de Cauchy. Este es el corazón del análisis complejo. Vas a ver que, para integrar sobre una curva cerrada, casi nunca hace falta parametrizar: basta con saber qué singularidades quedan dentro.` },
        { h: r`<ul class="l"><li>Enunciar y usar el teorema de Cauchy–Goursat.</li><li>Deformar contornos sin cambiar la integral.</li><li>Aplicar la fórmula integral de Cauchy y la de las derivadas.</li><li>Decidir qué singularidades quedan <span class="am">dentro</span> de la curva.</li></ul>`,
          v: r`Objetivos. Enunciar y aplicar el teorema de Cauchy-Goursat. Deformar contornos sin cambiar el valor de la integral. Aplicar la fórmula integral de Cauchy y su versión para derivadas. Y, lo más importante en la práctica, decidir correctamente qué singularidades quedan dentro de la curva.` },
      ],
    },
    {
      t: 'El teorema de Cauchy–Goursat',
      fig: figCG,
      clase: 'compacta',
      pasos: [
        { h: r`<div class="teo"><span class="rot">Teorema.</span> Si $f$ es analítica <b>sobre</b> una curva cerrada simple $\gamma$ y <b>en todo su interior</b>, entonces $$\oint_\gamma f(z)\dd z=0.$$</div>`,
          v: r`El teorema de Cauchy-Goursat dice que si una función es analítica sobre una curva cerrada simple, y en todos los puntos de su interior, entonces su integral sobre la curva es cero.` },
        { h: r`<p><b>Por qué es plausible.</b> Con $f=u+iv$, $\dd z=\dd x+i\dd y$ y el teorema de Green:</p>$$\oint f\dd z=\iint\!(-v_x-u_y)\dd A+i\!\iint\!(u_x-v_y)\dd A=0,$$<p>porque Cauchy–Riemann anula ambos integrandos.</p>`,
          v: r`La razón de fondo son las ecuaciones de Cauchy-Riemann. Si escribes la integral en parte real e imaginaria, y aplicas el teorema de Green, aparecen dos integrales dobles cuyos integrandos son exactamente las combinaciones que Cauchy-Riemann anula.`,
          nota: r`El argumento con Green necesita que $f'$ sea continua. Goursat demostró el teorema sin esa hipótesis; de hecho, la continuidad de $f'$ resulta ser una consecuencia.` },
        { h: r`<div class="ojo"><span class="rot">Clave.</span> Basta <b>un</b> punto interior donde $f$ no sea analítica para que el teorema no aplique: $\;\oint_{|z|=1}\frac{\dd z}{z}=2\pi i$.</div>`,
          v: r`La hipótesis es delicada: basta un solo punto en el interior donde la función no sea analítica, para que el teorema deje de aplicar. El ejemplo que ya conoces es [[1/z::uno sobre zeta]] sobre la circunferencia unitaria, cuya integral es [[2\pi i]].` },
      ],
    },
    {
      t: 'Deformación de contornos',
      fig: figDef,
      clase: 'compacta',
      pasos: [
        { h: r`<div class="teo"><span class="rot">Principio de deformación.</span> Si $f$ es analítica en la región comprendida entre dos curvas cerradas simples $\Gamma$ y $\gamma$, con la misma orientación: $$\oint_\Gamma f\dd z=\oint_\gamma f\dd z.$$</div>`,
          v: r`La consecuencia más útil del teorema es el principio de deformación. Si una función es analítica en toda la región comprendida entre dos curvas cerradas, las integrales sobre ambas curvas coinciden, siempre que se recorran en el mismo sentido.` },
        { h: r`<p>Se puede <span class="am">encoger</span> el contorno hasta una circunferencia pequeña alrededor de la singularidad, mientras no se cruce ninguna otra.</p>`,
          v: r`En palabras: puedes deformar el contorno como si fuera una banda elástica, encogerlo o estirarlo, y la integral no cambia mientras no cruces ninguna singularidad. En particular, puedes encogerlo hasta una circunferencia diminuta alrededor del punto problemático.` },
        { h: r`<p>Con varias singularidades dentro: $$\oint_\Gamma f\dd z=\sum_k\oint_{\gamma_k}f\dd z,$$ una circunferencia pequeña $\gamma_k$ por cada una.</p>`,
          v: r`Y si hay varias singularidades dentro, la integral sobre el contorno grande es la suma de las integrales sobre circunferencias pequeñas, una alrededor de cada singularidad. Esta idea, llevada hasta el final, es el teorema de los residuos.` },
      ],
    },
    {
      t: 'La fórmula integral de Cauchy',
      fig: figFIC,
      clase: 'compacta',
      pasos: [
        { h: r`<div class="teo"><span class="rot">Fórmula integral de Cauchy.</span> Si $g$ es analítica sobre y dentro de $\gamma$ (cerrada simple, positiva) y $z_0$ está <b>dentro</b>: $$\oint_\gamma\frac{g(z)}{z-z_0}\dd z=2\pi i\,g(z_0).$$</div>`,
          v: r`Llegamos a la fórmula integral de Cauchy. Sea [[g]] una función analítica sobre una curva cerrada simple y en su interior, y sea [[z_0]] un punto interior. Entonces la integral de [[\frac{g(z)}{z-z_0}::ge de zeta, sobre zeta menos zeta cero]], vale [[2\pi i]] por [[g(z_0)::ge de zeta cero]].` },
        { h: r`<p><b>Idea de la prueba.</b> Se encoge $\gamma$ a un círculo diminuto en torno a $z_0$; allí $g(z)\approx g(z_0)$:</p>$$\oint\frac{g(z)}{z-z_0}\dd z\approx g(z_0)\oint\frac{\dd z}{z-z_0}=2\pi i\,g(z_0).$$`,
          v: r`La idea de la demostración combina dos cosas que ya tienes. Por deformación, encogemos la curva a un círculo diminuto alrededor de [[z_0]]. Sobre ese círculo, por continuidad, [[g(z)]] es prácticamente la constante [[g(z_0)::ge de zeta cero]], que sale de la integral. Y lo que queda es la integral fundamental del nivel dos, que vale [[2\pi i]].`,
          nota: r`Con rigor: $\left|\oint\frac{g(z)-g(z_0)}{z-z_0}\dd z\right|\le\max_{|z-z_0|=\eps}|g(z)-g(z_0)|\cdot\frac{1}{\eps}\cdot2\pi\eps\to0$ cuando $\eps\to0$, por la cota $ML$ y la continuidad de $g$.` },
        { h: r`<div class="idea"><span class="rot">Lectura.</span> Los valores de una función analítica <b>dentro</b> de la curva quedan determinados por sus valores <b>sobre</b> la curva.</div>`,
          v: r`La fórmula tiene una lectura sorprendente: los valores de una función analítica en el interior de una curva quedan completamente determinados por sus valores sobre la curva. Nada parecido ocurre con funciones de variable real.` },
      ],
    },
    {
      t: 'La fórmula para las derivadas',
      pasos: [
        { h: r`<div class="teo">$$\oint_\gamma\frac{g(z)}{(z-z_0)^{n+1}}\dd z=\frac{2\pi i}{n!}\,g^{(n)}(z_0),\qquad n=0,1,2,\dots$$</div>`,
          v: r`Derivando la fórmula respecto a [[z_0]] bajo el signo integral, se obtiene la versión general. La integral de [[g]] dividida por [[(z-z_0)^{n+1}::zeta menos zeta cero, elevado a ene más uno]], es [[2\pi i]] sobre [[n!::ene factorial]], por la derivada enésima de [[g]] en [[z_0]].` },
        { h: r`<table class="t"><tr><th>Denominador</th><th>Resultado</th></tr><tr><td>$z-z_0$</td><td>$2\pi i\,g(z_0)$</td></tr><tr><td>$(z-z_0)^2$</td><td>$2\pi i\,g'(z_0)$</td></tr><tr><td>$(z-z_0)^3$</td><td>$\pi i\,g''(z_0)$</td></tr></table>`,
          v: r`Los tres casos que aparecen en los exámenes. Con el factor a la primera potencia: [[2\pi i]] por [[g]]. Al cuadrado: [[2\pi i]] por la primera derivada. Al cubo: [[\pi i]] por la segunda derivada, porque se divide entre dos factorial. Ojo con el desfase: el exponente es uno más que el orden de la derivada.` },
        { h: r`<p class="pie">Consecuencia teórica: una función analítica tiene derivadas de <b>todos</b> los órdenes, y todas son analíticas.</p>`,
          v: r`De paso, la fórmula demuestra algo notable: una función analítica es infinitamente derivable, y todas sus derivadas son analíticas.` },
      ],
    },
    {
      t: 'Receta para aplicar la fórmula',
      fig: figDist,
      clase: 'compacta',
      pasos: [
        { h: r`<div class="idea"><ol class="l"><li><b>Singularidades:</b> factorizar el denominador y hallar sus ceros (y cortes de rama, si los hay).</li><li><b>Ubicación:</b> en $|z-c|=r$, el punto $p$ está dentro si $|p-c|<r$.</li><li><b>Separar:</b> escribir el integrando como $\dfrac{g(z)}{(z-z_0)^{n+1}}$, con $g$ analítica dentro.</li><li><b>Aplicar</b> la fórmula.</li></ol></div>`,
          v: r`En la práctica, todos los ejercicios siguen la misma receta de cuatro pasos. Uno: encontrar las singularidades, factorizando el denominador. Dos: ubicarlas. Para una circunferencia de centro [[c]] y radio [[r]], un punto está dentro si su distancia al centro es menor que el radio. Tres: separar el integrando, dejando en el denominador solo el factor que se anula dentro, y llamando [[g]] a todo lo demás. Y cuatro: aplicar la fórmula.` },
        { h: r`<div class="ojo"><span class="rot">El paso 2 decide todo.</span> Sin singularidades dentro, la integral es $0$ (Cauchy–Goursat). Si una cae <b>sobre</b> la curva, la integral no está definida.</div>`,
          v: r`El paso dos decide todo. Si ninguna singularidad queda dentro, la integral es cero por el teorema de Cauchy-Goursat, y no hay nada que calcular. Y si una singularidad cae exactamente sobre la curva, la integral no está definida en el sentido usual.` },
      ],
    },
    {
      t: r`Ejemplo 1 · $\displaystyle\oint_{|z-2i|=2}\frac{\cos 2z}{z^2+4}\dd z$`,
      ref: 'Cauchy, ejercicio 1',
      fig: figE1,
      pasos: [
        { h: r`<p>$z^2+4=(z-2i)(z+2i)$. Centro $2i$, radio $2$:</p><p>$|2i-2i|=0<2$ → <span class="ve">dentro</span><br>$|-2i-2i|=4>2$ → <span class="ro">fuera</span></p>`,
          v: r`Ejercicio uno de la lista de Cauchy. El denominador se factoriza como [[(z-2i)(z+2i)::zeta menos dos i, por zeta más dos i]]. La curva es la circunferencia de centro [[2i]] y radio dos. El punto [[2i]] es el centro, así que está dentro. El punto [[-2i]] está a distancia cuatro del centro, mayor que el radio: queda fuera.` },
        { h: r`<p>Separamos: $\;\dfrac{\cos2z}{z^2+4}=\dfrac{g(z)}{z-2i}$, con $g(z)=\dfrac{\cos2z}{z+2i}$ analítica dentro.</p>`,
          v: r`Dejamos en el denominador el factor que se anula dentro, [[z-2i::zeta menos dos i]], y el resto es [[g]]: coseno de [[2z::dos zeta]], sobre [[z+2i::zeta más dos i]], que es analítica dentro de la curva.` },
        { h: r`<div class="res">$$\oint=2\pi i\,g(2i)=2\pi i\cdot\frac{\cos(4i)}{4i}=\frac{\pi}{2}\cos(4i)=\frac{\pi}{2}\cosh4.$$</div>`,
          v: r`Aplicamos la fórmula: [[2\pi i]] por [[g(2i)::ge de dos i]]. Las [[i]] se cancelan, y queda [[\frac{\pi}{2}\cos(4i)::pi medios por coseno de cuatro i]]. Como el coseno de un imaginario puro es un coseno hiperbólico, el resultado es [[\frac{\pi}{2}\cosh 4::pi medios por coseno hiperbólico de cuatro]], un número real.` },
      ],
    },
    {
      t: r`Ejemplo 2 · $\displaystyle\oint_{|z-\sqrt2|=1}\frac{z}{z^4+2z^2-8}\dd z$`,
      ref: 'Cauchy, ejercicio 3',
      fig: figE2,
      pasos: [
        { h: r`<p>Bicuadrada: $z^4+2z^2-8=(z^2+4)(z^2-2)$.<br>Singularidades: $\pm2i,\ \pm\sqrt2$.</p>`,
          v: r`Ejercicio tres. El denominador es un polinomio bicuadrado. Tratándolo como una cuadrática en [[z^2]], se factoriza como [[(z^2+4)(z^2-2)::zeta cuadrado más cuatro, por zeta cuadrado menos dos]]. Hay cuatro singularidades: [[\pm 2i]], y más menos raíz de dos.` },
        { h: r`<p>Distancias al centro $\sqrt2$: $\;\sqrt2\to0$ <span class="ve">✓</span>, $\;-\sqrt2\to2\sqrt2$, $\;\pm2i\to\sqrt6$. Con radio $1$, solo $\sqrt2$ está dentro.</p>`,
          v: r`Medimos distancias al centro, que es raíz de dos. La propia raíz de dos está a distancia cero. Menos raíz de dos está a distancia dos raíz de dos. Y los puntos [[\pm 2i]] están a distancia raíz de seis. El radio es uno, así que solo raíz de dos queda dentro.` },
        { h: r`<p>$g(z)=\dfrac{z}{(z^2+4)(z+\sqrt2)}$</p>`,
          v: r`Entonces [[g]] es todo lo demás: [[z]] sobre [[(z^2+4)(z+\sqrt2)::zeta cuadrado más cuatro, por zeta más raíz de dos]].` },
        { h: r`<div class="res">$$\oint=2\pi i\,g(\sqrt2)=2\pi i\cdot\frac{\sqrt2}{6\cdot2\sqrt2}=\frac{\pi i}{6}.$$</div>`,
          v: r`Evaluamos [[g]] en raíz de dos: el numerador es raíz de dos, y el denominador es seis por dos raíz de dos. Las raíces se cancelan y queda un doceavo. La integral es [[2\pi i]] sobre doce, es decir, [[\frac{\pi i}{6}::pi i sobre seis]].` },
      ],
    },
    {
      t: r`Ejemplo 3 · $\displaystyle\oint_{|z+i|=1}\frac{e^{iz}}{(z+i)^3}\dd z$`,
      ref: 'Cauchy, ejercicio 5',
      pasos: [
        { h: r`<p>Única singularidad: $z_0=-i$, el centro. Tiene la forma $\dfrac{g(z)}{(z-z_0)^{3}}$ con $g(z)=e^{iz}$ y $n=2$.</p>`,
          v: r`Ejercicio cinco. La única singularidad es [[-i::menos i]], el centro de la circunferencia. El integrando ya tiene la forma de la fórmula para derivadas: [[g]] es [[e^{iz}::e a la i zeta]], y el exponente tres significa que [[n]] es dos.` },
        { h: r`$$g'(z)=i\,e^{iz},\qquad g''(z)=i^2e^{iz}=-e^{iz},\qquad g''(-i)=-e^{i(-i)}=-e.$$`,
          v: r`Necesitamos la segunda derivada. Cada derivada baja un factor [[i]], así que la segunda derivada es menos [[e^{iz}::e a la i zeta]]. En [[-i::menos i]], el exponente es [[i]] por menos [[i]], que es uno. La segunda derivada vale menos [[e]].` },
        { h: r`<div class="res">$$\oint=\frac{2\pi i}{2!}\,g''(-i)=\pi i\cdot(-e)=-\pi e\,i.$$</div>`,
          v: r`La integral es [[2\pi i]] sobre dos factorial, por menos [[e]]. El resultado es [[-\pi e i::menos pi e i]].` },
      ],
    },
    {
      t: r`Ejemplo 4 · $\displaystyle\oint_{|z-i|=\frac12}\frac{\dd z}{(z^2+4)(z^2+1)^2}$`,
      ref: 'Cauchy, ejercicio 10',
      fig: figE4,
      clase: 'compacta',
      pasos: [
        { h: r`<p>$(z^2+1)^2=(z-i)^2(z+i)^2$. Dentro solo está $z=i$, con exponente $2$:</p><p>$g(z)=\dfrac{1}{(z^2+4)(z+i)^2}$, $\;n=1\;\Rightarrow\;\oint=2\pi i\,g'(i)$.</p>`,
          v: r`Ejercicio diez. El factor [[(z^2+1)^2::zeta cuadrado más uno, al cuadrado]], es [[(z-i)^2(z+i)^2::zeta menos i al cuadrado, por zeta más i al cuadrado]]. El círculo es pequeño, de radio un medio alrededor de [[i]], y solo contiene a [[i]], que aparece al cuadrado. Entonces [[n]] es uno, y la integral es [[2\pi i]] por la derivada de [[g]] en [[i]].` },
        { h: r`$$g'(z)=-\frac{2z}{(z^2+4)^2(z+i)^2}-\frac{2}{(z^2+4)(z+i)^3}.$$`,
          v: r`Derivamos [[g]] con la regla del producto, viéndola como producto de dos potencias negativas.` },
        { h: r`<p>En $z=i$: $\;z^2+4=3$, $\;(2i)^2=-4$, $\;(2i)^3=-8i$:</p>$$g'(i)=\frac{-2i}{9\cdot(-4)}-\frac{2}{3\cdot(-8i)}=\frac{i}{18}+\frac{1}{12i}=\frac{i}{18}-\frac{i}{12}=-\frac{i}{36}.$$`,
          v: r`Evaluamos con cuidado en [[i]]. [[z^2+4::zeta cuadrado más cuatro]] vale tres. [[z+i::zeta más i]] vale [[2i]]: su cuadrado es menos cuatro, y su cubo es [[-8i::menos ocho i]]. El primer término da [[\frac{i}{18}::i sobre dieciocho]]. El segundo, usando que uno sobre [[i]] es menos [[i]], da [[-\frac{i}{12}::menos i sobre doce]]. La suma es [[-\frac{i}{36}::menos i sobre treinta y seis]].` },
        { h: r`<div class="res">$$\oint=2\pi i\cdot\left(-\frac{i}{36}\right)=\frac{\pi}{18}.$$</div>`,
          v: r`Multiplicando por [[2\pi i]], el resultado es [[\frac{\pi}{18}::pi sobre dieciocho]].` },
      ],
    },
    {
      t: r`Ejemplo 5 · $\displaystyle\oint_{|z-w|=|w|}\frac{\dd z}{z^2-w^2},\;\;w\neq0$`,
      ref: 'Cauchy, ejercicio 7',
      fig: figE5,
      pasos: [
        { h: r`<p>$z^2-w^2=(z-w)(z+w)$. Centro $w$, radio $|w|$:</p><p>$w$ es el centro → <span class="ve">dentro</span><br>$|-w-w|=2|w|>|w|$ → <span class="ro">fuera</span></p>`,
          v: r`Ejercicio siete, con un parámetro complejo [[w]] distinto de cero. Las singularidades son [[w]] y [[-w::menos doble u]]. La circunferencia está centrada en [[w]] y tiene radio módulo de [[w]], así que pasa por el origen. El punto [[w]] está dentro. El punto [[-w::menos doble u]] está a distancia dos veces el módulo de [[w]]: queda fuera.` },
        { h: r`<div class="res">$$\oint=2\pi i\cdot\left.\frac{1}{z+w}\right|_{z=w}=\frac{2\pi i}{2w}=\frac{\pi i}{w}.$$</div>`,
          v: r`Con [[g]] igual a uno sobre [[z+w::zeta más doble u]], la fórmula da [[2\pi i]] sobre [[2w::dos doble u]], es decir, [[\frac{\pi i}{w}::pi i sobre doble u]]. El método es el mismo de siempre: el parámetro solo exige razonar las distancias en general.` },
      ],
    },
    {
      t: r`Ejemplo 6 · $\displaystyle\oint_{\alpha}\frac{z+w}{z^2+w^2}\dd z$ sobre un semidisco`,
      ref: 'Cauchy, ejercicios 8 y 9',
      fig: figE6,
      clase: 'compacta',
      pasos: [
        { h: r`<p>$\alpha$: semicircunferencia superior de radio $2|w|$ más el diámetro $[-2|w|,\,2|w|]$.</p><p class="pie">La lista escribe el segmento $[-|w|,|w|]$, que no cierra la curva; aquí se asume el diámetro completo.</p>`,
          v: r`Ejercicio ocho. La curva es el borde de un semidisco: la semicircunferencia superior de radio dos veces el módulo de [[w]], cerrada con el diámetro sobre el eje real. Una advertencia honesta: en la lista, el segmento aparece con extremos más y menos módulo de [[w]], y así no cierra la curva. Aquí asumo que se trata del diámetro completo.` },
        { h: r`<p>$z^2+w^2=(z-iw)(z+iw)$; polos $\pm iw$, de módulo $|w|<2|w|$.<br>¿Cuál está arriba? $\;\Im(iw)=\Re(w)$.</p>`,
          v: r`Las singularidades son [[iw::i doble u]] y [[-iw::menos i doble u]]. Ambas tienen módulo menor que el radio. La cuestión es cuál está en el semiplano superior. Como la parte imaginaria de [[iw::i doble u]] es la parte real de [[w]], todo depende del signo de la parte real de [[w]].` },
        { h: r`<p>Si $\Re w>0$, dentro está $iw$: $\;2\pi i\cdot\dfrac{iw+w}{2iw}=\pi(1+i)$.</p><p>Si $\Re w<0$, dentro está $-iw$: $\;2\pi i\cdot\dfrac{-iw+w}{-2iw}=\pi(-1+i)$.</p>`,
          v: r`Si la parte real de [[w]] es positiva, el polo de dentro es [[iw::i doble u]], y la fórmula da [[\pi(1+i)::pi por uno más i]]. Si es negativa, el polo de dentro es [[-iw::menos i doble u]], y da [[\pi(-1+i)::pi por menos uno más i]]. Curiosamente, [[w]] se cancela en ambos casos.` },
        { h: r`<div class="ojo"><span class="rot">Caso excluido.</span> Si $\Re w=0$ los polos caen sobre el diámetro y la integral no está definida.</div><p class="pie"><b>Ejercicio 9</b> (mismo contorno, denominador al cuadrado): $\;\pm\dfrac{\pi}{2w^2}$ según el signo de $\Re w$.</p>`,
          v: r`Si la parte real de [[w]] es cero, los polos caen sobre el diámetro, y la integral no está definida. El ejercicio nueve usa el mismo contorno, con el denominador al cuadrado. Se resuelve igual, con la fórmula de la derivada, y da más o menos [[\frac{\pi}{2w^2}::pi sobre dos doble u cuadrado]], según el signo de la parte real de [[w]].`,
          nota: r`Ejercicio 9, caso $\Re w>0$: $g(z)=\dfrac{z+w}{(z+iw)^2}$, $g'(z)=\dfrac{-z+iw-2w}{(z+iw)^3}$, $g'(iw)=\dfrac{-2w}{(2iw)^3}=-\dfrac{i}{4w^2}$ y $\oint=2\pi i\,g'(iw)=\dfrac{\pi}{2w^2}$. Para $\Re w<0$ se obtiene $-\dfrac{\pi}{2w^2}$.` },
      ],
    },
    {
      t: r`Ejemplo 7 · $\displaystyle\oint_{|z-2i|=1}\frac{\dd z}{\Log^2\!z\;(z-2i)}$`,
      ref: 'Cauchy, ejercicio 6',
      fig: figE7,
      pasos: [
        { h: r`<p>Candidatos a problema: $z=2i$; el cero de $\Log z$ en $z=1$; y el corte $(-\infty,0]$.</p>`,
          v: r`Ejercicio seis. Aquí hay que revisar tres posibles fuentes de problemas. El punto [[2i]]. El punto donde el logaritmo se anula, que es uno. Y el corte de rama del logaritmo, sobre el semieje real negativo.` },
        { h: r`<p>$|1-2i|=\sqrt5>1$ → fuera. El disco está en $\Im z\ge1$: no toca el corte.</p><p>⟹ $g(z)=\dfrac{1}{\Log^2z}$ es analítica dentro.</p>`,
          v: r`El punto uno está a distancia raíz de cinco del centro: fuera. Y el disco está contenido en el semiplano de parte imaginaria mayor o igual que uno, así que no toca el eje real. Por tanto [[g]], que es uno sobre el logaritmo al cuadrado, es analítica dentro de la curva.` },
        { h: r`<div class="res">$$\oint=2\pi i\,g(2i)=\frac{2\pi i}{\left(\ln2+\frac{\pi}{2}\,i\right)^2}.$$</div>`,
          v: r`La fórmula da [[2\pi i]] sobre el logaritmo de [[2i]] al cuadrado. El logaritmo principal de [[2i]] es logaritmo natural de dos, más [[\frac{\pi}{2}i::pi medios por i]]. Puedes dejar el resultado así, o desarrollar el cuadrado.`,
          nota: r`Desarrollando: $\left(\ln2+\tfrac{\pi}{2}i\right)^2=\ln^22-\tfrac{\pi^2}{4}+i\pi\ln2$, y entonces $$\oint=\frac{2\pi^2\ln2+2\pi i\left(\ln^22-\frac{\pi^2}{4}\right)}{\left(\ln^22+\frac{\pi^2}{4}\right)^2}\approx1{,}5745-1{,}4367\,i.$$` },
      ],
    },
    {
      t: 'Dos ejercicios más de la lista, en breve',
      ref: 'Cauchy, ejercicios 2 y 4',
      pasos: [
        { h: r`<p><b>Ej. 2.</b> $\displaystyle\oint_{|z|=\frac12}\frac{e^{iz}}{z^2-iz}\dd z$: $\;z^2-iz=z(z-i)$; dentro solo $0$.</p><p>$g=\dfrac{e^{iz}}{z-i}\;\Rightarrow\;2\pi i\cdot\dfrac{1}{-i}=-2\pi$.</p>`,
          v: r`Dos ejercicios más de la lista, en breve. El ejercicio dos: el denominador es [[z(z-i)::zeta, por zeta menos i]], y dentro del círculo de radio un medio solo está el cero. Evaluando [[g]] en cero, la integral es menos dos pi.` },
        { h: r`<p><b>Ej. 4.</b> $\displaystyle\oint_{|z+\pi i|=1}\frac{\sen z}{z^2+\pi^2}\dd z$: dentro solo $-\pi i$.</p><p>$g=\dfrac{\sen z}{z-\pi i}\;\Rightarrow\;2\pi i\cdot\dfrac{\sen(-\pi i)}{-2\pi i}=\sen(\pi i)=i\,\senh\pi$.</p>`,
          v: r`El ejercicio cuatro: las singularidades son [[\pm\pi i::más menos pi i]], y dentro solo está [[-\pi i::menos pi i]]. La fórmula da seno de [[\pi i]], que es [[i]] por el seno hiperbólico de pi.` },
      ],
    },
    {
      t: 'Cuando hay dos singularidades dentro',
      fig: figDos,
      pasos: [
        { h: r`<p>Ejemplo: $\displaystyle\oint_{|z|=2|w|}\frac{\dd z}{z^2-w^2}$. Ahora $w$ y $-w$ están <b>ambos</b> dentro.</p>`,
          v: r`¿Y si quedan dos singularidades dentro? Tomemos la misma función de antes, pero sobre la circunferencia centrada en el origen, de radio dos veces el módulo de [[w]]. Ahora [[w]] y [[-w::menos doble u]] están los dos dentro, y la fórmula de Cauchy no se puede aplicar directamente.` },
        { h: r`<p>Por deformación, se rodea cada polo con un círculo pequeño y se suman:</p>$$\oint=2\pi i\cdot\frac{1}{2w}+2\pi i\cdot\frac{1}{-2w}=0.$$`,
          v: r`La solución es el principio de deformación: rodeamos cada polo con un círculo pequeño, aplicamos la fórmula de Cauchy en cada uno, y sumamos. Las dos contribuciones son opuestas, y la integral vale cero.` },
        { h: r`<div class="idea"><span class="rot">Idea.</span> Cada singularidad aporta $2\pi i$ por un número: su <b>residuo</b>. Sistematizar esto es el Nivel 4.</div>`,
          v: r`Observa el patrón: cada singularidad aporta [[2\pi i]], multiplicado por un número. Ese número se llama residuo, y sistematizar su cálculo es el tema del nivel cuatro.` },
      ],
    },
    {
      t: 'Errores frecuentes y resumen del nivel',
      clase: 'compacta',
      pasos: [
        { h: r`<div class="ojo"><span class="rot">Errores que cuestan puntos</span><ul class="l"><li>No comprobar qué singularidades están dentro, o no factorizar por completo.</li><li>Dejar en $g$ un factor que se anula dentro.</li><li>Desfase: $(z-z_0)^{n+1}\leftrightarrow g^{(n)}$; olvidar el $n!$.</li><li>Olvidar los cortes de rama de $\Log$ y de las raíces.</li></ul></div>`,
          v: r`Errores frecuentes. No comprobar qué singularidades están dentro, o no factorizar el denominador por completo. Dejar dentro de [[g]] un factor que se anula en el interior. Equivocarse con el desfase entre el exponente y el orden de la derivada, u olvidar el factorial. Y olvidar los cortes de rama.` },
        { h: r`<div class="res"><span class="rot">Resumen</span><ul class="l"><li>Cauchy–Goursat: analítica sobre y dentro ⟹ $\oint=0$.</li><li>Los contornos se deforman sin cruzar singularidades.</li><li>$\displaystyle\oint_\gamma\frac{g(z)}{(z-z_0)^{n+1}}\dd z=\frac{2\pi i}{n!}\,g^{(n)}(z_0)$.</li></ul></div>`,
          v: r`Resumen. Si la función es analítica sobre la curva y dentro, la integral es cero. Los contornos se pueden deformar sin cruzar singularidades. Y la fórmula integral de Cauchy, con su versión para derivadas, convierte una integral en una evaluación.` },
        { h: r`<p class="am"><b>Siguiente paso:</b> práctica del Nivel 3. Al aprobarla se desbloquea el Nivel 4.</p>`,
          v: r`Resuelve ahora la práctica del nivel tres, para desbloquear el nivel cuatro: el teorema de los residuos.` },
      ],
    },
  ],
};
