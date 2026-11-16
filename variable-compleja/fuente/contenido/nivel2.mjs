// NIVEL 2 · Integrales sobre curvas
import { r } from '../lib/mate.mjs';
import { plano, ejes, arco, circ, seg, curva, disco, pto, etq, corte, PI } from '../lib/plano.mjs';

const figCurvas = plano({ x: [-0.5, 4.5], y: [-0.5, 3.3], w: 650 },
  ejes(),
  seg([0.45, 0.55], [1.75, 2.55], { flecha: 'medio', desde: 1, trazo: true }),
  pto([0.45, 0.55], 'z_0', { pos: 'se', desde: 1 }),
  pto([1.75, 2.55], 'z_1', { pos: 'ne', desde: 1 }),
  circ([3.2, 1.35], 0.95, { c: 'c2', desde: 2, trazo: true, flecha: [0.15], inicio: 0 }),
  seg([3.2, 1.35], [3.2 + 0.95 * Math.cos(-0.6), 1.35 + 0.95 * Math.sin(-0.6)], { c: 'aux', tex: 'r', pos: 'sw', desde: 2 }),
  pto([3.2, 1.35], 'c', { pos: 'nw', desde: 2 }),
);

const figFund = plano({ x: [-0.6, 3.4], y: [-0.5, 2.9], w: 560 },
  ejes(),
  circ([1.5, 1.25], 1.0, { trazo: true, desde: 0, flecha: [0.13, 0.63] }),
  seg([1.5, 1.25], [1.5 + Math.cos(2.5), 1.25 + Math.sin(2.5)], { c: 'aux', tex: 'r', pos: 'ne' }),
  pto([1.5, 1.25], 'z_0', { pos: 'se' }),
);

const figCuarto = plano({ x: [-0.45, 1.75], y: [-0.4, 1.6], w: 600 },
  ejes(),
  arco([0, 0], 1, 0, PI / 2, { trazo: true, desde: 0, flecha: [0.55] }),
  seg([1, 0], [0, 1], { c: 'c2 fina', flecha: 0.5, desde: 2 }),
  pto([1, 0], '1', { pos: 's' }),
  pto([0, 1], 'i', { pos: 'w' }),
  etq([0.93, 0.93], '\\gamma', { c: 'am' }),
);

const figAtan = plano({ x: [-0.3, 1.6], y: [-0.3, 1.25], w: 620 },
  ejes(),
  curva((t) => [t, Math.atan(t)], 0, 1, { trazo: true, desde: 0, flecha: [0.55] }),
  pto([0, 0], '0', { pos: 'sw' }),
  pto([1, PI / 4], '1+\\tfrac{\\pi}{4}i', { pos: 'n' }),
);

const figV = plano({ x: [-0.4, 1.7], y: [-0.3, 1.5], w: 600 },
  ejes(),
  curva((s) => [(1 - s) ** 2, 1 - s], 0, 1, { c: 'c2', flecha: [0.3], desde: 0, trazo: true }),
  curva((s) => [s * s, s], 0, 1, { flecha: [0.72], desde: 0 }),
  pto([1, 1], '\\gamma(-1)=\\gamma(1)=1+i', { pos: 'n' }),
  pto([0, 0], '\\gamma(0)=0', { pos: 'se' }),
);

const figLogSeg = plano({ x: [-1.7, 1.8], y: [-0.7, 1.7], w: 640 },
  ejes(),
  corte([-1.6, 0], [0, 0], { tex: '\\text{corte}', c: 'ro chica' }),
  seg([1, 0], [0, 1], { flecha: 0.55, trazo: true, desde: 0 }),
  pto([1, 0], '1', { pos: 's' }),
  pto([0, 1], 'i', { pos: 'e' }),
);

const figSemi = plano({ x: [-2.7, 2.7], y: [-2.6, 2.7], w: 600 },
  disco([0, 0], 2, { c: 'c2 suave' }),
  circ([0, 0], 2, { c: 'aux', flecha: false }),
  ejes(),
  arco([0, 0], 1, 0, PI, { flecha: [0.5] }),
  seg([1, 0], [-1, 0], { c: 'c3', flecha: 0.55, desde: 1, trazo: true }),
  pto([0, 2], '2i', { tipo: 'polo', pos: 'ne' }),
  pto([0, -2], '-2i', { tipo: 'polo', pos: 'se' }),
  pto([1, 0], '1', { pos: 'se' }),
  pto([-1, 0], '-1', { pos: 'sw' }),
  etq([1.75, 1.75], '|z|<2', { c: 'ci chica' }),
);

const figParab = plano({ x: [-1.5, 1.7], y: [-1.45, 1.45], w: 600 },
  ejes(),
  corte([-1.4, 0], [0, 0], { tex: '\\text{corte de }\\sqrt{z}', c: 'ro chica' }),
  curva((t) => [t * t, t], -1, 1, { flecha: [0.78], trazo: true, desde: 0 }),
  pto([1, -1], '1-i', { pos: 'e' }),
  pto([1, 1], '1+i', { pos: 'e' }),
);

const figML = plano({ x: [-3.4, 3.4], y: [-0.8, 3.5], w: 650 },
  ejes(),
  arco([0, 0], 2.8, 0, PI, { flecha: [0.3], desde: 1, trazo: true, tex: 'C_R', pos: 'ne', en: PI / 4 }),
  seg([0, 0], [2.8 * Math.cos(2.2), 2.8 * Math.sin(2.2)], { c: 'aux', tex: 'R', pos: 'e', desde: 1 }),
  pto([0, 2], '2i', { tipo: 'polo', pos: 'e', desde: 1 }),
);

export default {
  id: 'nivel2',
  n: 2,
  etiqueta: 'NIVEL 2',
  titulo: 'Integrales sobre curvas',
  sub: 'Parametrizar, integrar y saber cuándo no hace falta',
  lista: 'Integrales sobre curvas (lista de 10 ejercicios)',
  escenas: [
    {
      portada: { nivel: 'NIVEL 2', titulo: 'Integrales sobre curvas', sub: 'Parametrizar, integrar y saber cuándo no hace falta' },
      pasos: [
        { h: '', v: r`Nivel dos: integrales sobre curvas. En el nivel anterior aprendiste a reconocer funciones analíticas. Ahora vamos a integrar funciones complejas a lo largo de caminos en el plano. Es la operación sobre la que se construye todo lo que sigue: el teorema de Cauchy, su fórmula integral y los residuos.` },
        { h: r`<ul class="l"><li>Parametrizar segmentos, circunferencias y arcos.</li><li>Calcular $\int_\gamma f(z)\dd z$ con la definición.</li><li>Usar una <span class="am">primitiva</span> cuando existe, y saber cuándo existe.</li><li>Acotar integrales con la desigualdad $ML$.</li></ul>`,
          v: r`Los objetivos son cuatro. Parametrizar las curvas habituales: segmentos, circunferencias y arcos. Calcular una integral de contorno a partir de la definición. Reconocer cuándo se puede usar una primitiva, lo que ahorra casi todo el trabajo. Y acotar el tamaño de una integral con la desigualdad eme ele.` },
      ],
    },
    {
      t: 'Curvas y parametrizaciones',
      fig: figCurvas,
      pasos: [
        { h: r`<div class="def"><span class="rot">Curva.</span> Función continua $\gamma:[a,b]\to\C$, suave a trozos. Tiene punto inicial $\gamma(a)$, punto final $\gamma(b)$ y un <span class="am">sentido de recorrido</span>.</div>`,
          v: r`Una curva es una función continua que a cada valor de un parámetro real [[t]] le asigna un punto del plano complejo. Pedimos que sea suave a trozos, es decir, que tenga derivada continua salvo en un número finito de esquinas. Toda curva tiene un punto inicial, un punto final y un sentido de recorrido, y el sentido importa.` },
        { h: r`<p><b>Segmento</b> de $z_0$ a $z_1$:</p>$$\gamma(t)=z_0+t\,(z_1-z_0),\qquad 0\le t\le1.$$`,
          v: r`Las parametrizaciones que debes saber de memoria son dos. El segmento que va de [[z_0]] a [[z_1]] es [[z_0+t(z_1-z_0)::zeta cero, más te por zeta uno menos zeta cero]], con [[t]] entre cero y uno.` },
        { h: r`<p><b>Circunferencia</b> $|z-c|=r$:</p>$$\gamma(t)=c+r\,e^{it},\qquad 0\le t\le2\pi.$$<p class="pie">Antihoraria = <span class="am">orientación positiva</span>. Un arco usa el mismo $\gamma$ con $t\in[\theta_1,\theta_2]$.</p>`,
          v: r`Y la circunferencia de centro [[c]] y radio [[r]] es [[c+re^{it}::ce, más erre por e a la i te]], con [[t]] entre cero y dos pi. Al crecer [[t]] se recorre en sentido antihorario, que es la orientación positiva. Un arco de circunferencia usa la misma fórmula, con el parámetro restringido a un intervalo de ángulos.` },
      ],
    },
    {
      t: 'La integral de contorno',
      pasos: [
        { h: r`<div class="def"><span class="rot">Definición.</span> $$\int_\gamma f(z)\dd z=\int_a^b f\big(\gamma(t)\big)\,\gamma'(t)\dd t.$$</div>`,
          v: r`La integral de una función compleja a lo largo de una curva se define reduciéndola a una integral ordinaria en el parámetro. Se sustituye [[z]] por [[\gamma(t)::gama de te]], y el diferencial [[\dd z::de zeta]] por [[\gamma'(t)\dd t::gama prima de te, por de te]].` },
        { h: r`<div class="idea"><span class="rot">Receta.</span> ① parametrizar &nbsp; ② calcular $\gamma'(t)$ &nbsp; ③ sustituir &nbsp; ④ integrar parte real e imaginaria.</div>`,
          v: r`La receta siempre es la misma, en cuatro pasos: parametrizar, derivar la parametrización, sustituir, e integrar. El integrando que resulta es una función compleja de variable real, que se integra separando parte real e imaginaria.` },
        { h: r`<p><b>Propiedades.</b> Es lineal. Al invertir el sentido cambia de signo: $\int_{-\gamma}f=-\int_\gamma f$. Sobre una curva formada por tramos se suman las integrales de cada tramo.</p><p class="pie">El valor no depende de la parametrización elegida, solo de la curva y de su sentido.</p>`,
          v: r`Tres propiedades que se usan todo el tiempo. La integral es lineal. Si se recorre la curva en sentido contrario, cambia de signo. Y si la curva está formada por varios tramos, la integral es la suma de las integrales sobre cada tramo. Además, el resultado no depende de la parametrización que elijas, solo de la curva y de su sentido.` },
      ],
    },
    {
      t: r`Ejemplo 1 · La integral más importante del curso`,
      fig: figFund,
      pasos: [
        { h: r`<p>Sobre $|z-z_0|=r$: $\;\gamma(t)=z_0+re^{it}$, $\;\gamma'(t)=i\,re^{it}$.</p>$$\oint(z-z_0)^n\dd z=\int_0^{2\pi}r^ne^{int}\,i\,re^{it}\dd t=i\,r^{n+1}\!\int_0^{2\pi}\!e^{i(n+1)t}\dd t.$$`,
          v: r`Empecemos con la integral más importante de todo el curso: la de una potencia entera de [[z-z_0::zeta menos zeta cero]] sobre una circunferencia centrada en [[z_0]]. Parametrizamos, derivamos y sustituimos. Queda la integral de [[e^{i(n+1)t}::e a la i, por ene más uno, por te]], entre cero y dos pi.` },
        { h: r`<p>Si $n\neq-1$: $\displaystyle\left[\frac{e^{i(n+1)t}}{i(n+1)}\right]_0^{2\pi}=0$. $\qquad$ Si $n=-1$: $\displaystyle\int_0^{2\pi}1\dd t=2\pi$.</p>`,
          v: r`Si [[n]] es distinto de menos uno, la exponencial tiene una primitiva periódica, y la integral sobre un periodo completo es cero. Si [[n]] es menos uno, el integrando es la constante uno, y la integral vale dos pi.` },
        { h: r`<div class="teo">$$\oint_{|z-z_0|=r}(z-z_0)^n\dd z=\begin{cases}2\pi i,& n=-1\\[2pt]0,& n\neq-1\end{cases}\qquad(n\in\mathbb Z)$$</div>`,
          v: r`Conclusión: la integral vale [[2\pi i]] cuando el exponente es menos uno, y cero para cualquier otro exponente entero, sin importar el radio. Grábate este resultado. De aquí salen la fórmula integral de Cauchy y el teorema de los residuos.` },
      ],
    },
    {
      t: r`Ejemplo 2 · $f(z)=\bar z$ sobre un cuarto de circunferencia`,
      ref: 'Curvas, ejercicio 6',
      fig: figCuarto,
      pasos: [
        { h: r`<p>Cuarto de circunferencia de $1$ a $i$:</p><p>$\gamma(t)=e^{it}$, $\;0\le t\le\frac{\pi}{2}$, $\;\gamma'(t)=i\,e^{it}$.</p>`,
          v: r`Ejercicio seis de la lista de curvas: integrar [[\bar z]] sobre el cuarto de circunferencia unitaria del primer cuadrante, en sentido positivo, es decir, de uno a [[i]]. La parametrización es [[e^{it}::e a la i te]], con [[t]] entre cero y pi medios.` },
        { h: r`$$\int_\gamma\bar z\dd z=\int_0^{\pi/2}e^{-it}\cdot i\,e^{it}\dd t=\int_0^{\pi/2}i\dd t=\frac{\pi}{2}\,i.$$`,
          v: r`Sobre la circunferencia unitaria, el conjugado de [[e^{it}::e a la i te]] es [[e^{-it}::e a la menos i te]]. Al multiplicar por la derivada, las exponenciales se cancelan y queda la integral de la constante [[i]]. El resultado es [[\frac{\pi}{2}i::pi medios por i]].` },
        { h: r`<div class="ojo"><span class="rot">Ojo.</span> $\bar z$ no es analítica: su integral <b>depende del camino</b>. Por el segmento recto de $1$ a $i$ da $i$, no $\frac{\pi}{2}i$.</div>`,
          v: r`Como [[\bar z]] no es analítica, su integral depende del camino. Si en lugar del arco tomamos el segmento recto de uno a [[i]], el resultado es [[i]], y no [[\frac{\pi}{2}i::pi medios por i]]. Con funciones no analíticas no hay atajos: hay que parametrizar la curva que te dan.`,
          nota: r`Comprobación: en el segmento $\gamma(t)=1+t(i-1)$, $\bar\gamma=1-t-it$, $\gamma'=i-1$, y $\int_0^1(1-t-it)(i-1)\dd t=(i-1)\cdot\tfrac{1-i}{2}=i$.` },
      ],
    },
    {
      t: r`Ejemplo 3 · $f(z)=\Re^2(z)+1$ sobre $\gamma(t)=t+i\arctan t$`,
      ref: 'Curvas, ejercicio 3',
      fig: figAtan,
      pasos: [
        { h: r`<p>$\gamma(t)=t+i\arctan t$, $\;0\le t\le1$:</p>$$\gamma'(t)=1+\frac{i}{1+t^2},\qquad f(\gamma(t))=t^2+1.$$`,
          v: r`Ejercicio tres. La curva ya viene parametrizada. Su derivada es [[1+\frac{i}{1+t^2}::uno, más i sobre uno más te cuadrado]]. La función es la parte real al cuadrado más uno, y sobre la curva la parte real es [[t]], así que vale [[t^2+1::te cuadrado más uno]].` },
        { h: r`$$\int_\gamma f\dd z=\int_0^1(t^2+1)\left(1+\frac{i}{1+t^2}\right)\dd t$$ $$=\int_0^1(t^2+1)\dd t+i\int_0^1\dd t=\frac43+i.$$`,
          v: r`Al multiplicar, el factor [[t^2+1::te cuadrado más uno]] se cancela con el denominador de la parte imaginaria. La parte real es la integral de [[t^2+1::te cuadrado más uno]], que da cuatro tercios, y la parte imaginaria es la integral de uno. Resultado: [[\frac43+i::cuatro tercios más i]].` },
      ],
    },
    {
      t: 'El teorema fundamental: primitivas',
      pasos: [
        { h: r`<div class="teo"><span class="rot">Teorema.</span> Si $F'=f$ en un dominio $D$ que contiene a $\gamma$, entonces $$\int_\gamma f(z)\dd z=F\big(\gamma(b)\big)-F\big(\gamma(a)\big).$$</div>`,
          v: r`Ahora el gran atajo. Si la función tiene una primitiva analítica en un dominio que contiene a la curva, la integral es la primitiva evaluada en el punto final, menos la primitiva en el punto inicial, igual que en cálculo.` },
        { h: r`<p>Consecuencias: la integral <span class="am">solo depende de los extremos</span>, y sobre toda curva <b>cerrada</b> en $D$ vale $0$.</p>`,
          v: r`Dos consecuencias inmediatas. La integral no depende del camino, solo de los extremos. Y sobre cualquier curva cerrada contenida en ese dominio, la integral vale cero.` },
        { h: r`<p><b>¿Cuándo existe una primitiva?</b></p><ul class="l"><li>Funciones enteras ($e^{iz}$, polinomios, $\sen z$…): en todo $\C$.</li><li>$f$ analítica en un dominio <b>simplemente conexo</b> (sin agujeros): siempre.</li><li>$\dfrac1z$ en $\C\setminus\{0\}$: <span class="ro">no</span>, porque $\oint_{|z|=1}\frac{\dd z}{z}=2\pi i\neq0$.</li></ul>`,
          v: r`¿Cuándo existe una primitiva? Las funciones enteras la tienen en todo el plano. En general, toda función analítica en un dominio simplemente conexo, es decir, sin agujeros, tiene primitiva. El contraejemplo clásico es [[1/z::uno sobre zeta]] en el plano sin el origen: no puede tener primitiva allí, porque su integral sobre la circunferencia unitaria es [[2\pi i]], y no cero.` },
      ],
    },
    {
      t: r`Ejemplo 4 · $f(z)=e^{iz}$ sobre $\gamma(t)=t^2+i\,|t|$, $\;-1\le t\le1$`,
      ref: 'Curvas, ejercicios 4 y 8',
      fig: figV,
      pasos: [
        { h: r`<p>$e^{iz}$ es entera, con primitiva $F(z)=-i\,e^{iz}$.</p><p>Extremos: $\gamma(-1)=1+i\;$ y $\;\gamma(1)=1+i$.<br><span class="am">¡La curva es cerrada!</span></p>`,
          v: r`Ejercicio cuatro: integrar [[e^{iz}::e a la i zeta]] sobre la curva [[t^2+i|t|::te cuadrado, más i por valor absoluto de te]]. Parametrizar y sustituir sería doloroso. Pero la función es entera y tiene primitiva. Miremos los extremos: en [[t]] igual a menos uno, y en [[t]] igual a uno, la curva está en el mismo punto, [[1+i::uno más i]]. La curva baja al origen y regresa por el mismo camino.` },
        { h: r`<div class="res">$$\int_\gamma e^{iz}\dd z=F(1+i)-F(1+i)=0.$$</div>`,
          v: r`Por el teorema fundamental, la integral es la primitiva en el punto final menos la primitiva en el punto inicial, que son el mismo punto. La integral vale cero.` },
        { h: r`<p class="pie">Mismo argumento para el <b>ejercicio 8</b>: $e^{iz}$ sobre el contorno del triángulo de vértices $0$, $1$, $i$ (curva cerrada) ⟹ $0$.</p>`,
          v: r`El ejercicio ocho es idéntico: la misma función sobre el contorno de un triángulo. Es una curva cerrada y la función tiene primitiva, así que la integral es cero, sin calcular nada. Antes de parametrizar, revisa siempre los extremos.` },
      ],
    },
    {
      t: r`Ejemplo 5 · $f(z)=\Log z$ sobre el segmento de $1$ a $i$`,
      ref: 'Curvas, ejercicio 5',
      fig: figLogSeg,
      pasos: [
        { h: r`<p>$\gamma(t)=1-t+it$ es el segmento de $1$ a $i$: no toca el corte $(-\infty,0]$, donde $\Log$ no es analítico.</p>`,
          v: r`Ejercicio cinco: el logaritmo principal sobre el segmento que va de uno a [[i]]. Primero, la verificación obligatoria: el segmento está en el primer cuadrante y no toca el corte de rama, así que el logaritmo es analítico en una región sin agujeros que contiene a la curva.` },
        { h: r`<p>Primitiva (por partes): $F(z)=z\Log z-z$, pues $F'(z)=\Log z+1-1$.</p>`,
          v: r`Una primitiva se obtiene integrando por partes, como en cálculo: [[z\Log z-z::zeta por logaritmo de zeta, menos zeta]]. Se comprueba derivando.` },
        { h: r`$$F(i)=i\cdot\frac{\pi}{2}i-i=-\frac{\pi}{2}-i,\qquad F(1)=1\cdot0-1=-1.$$`,
          v: r`Evaluamos. El logaritmo de [[i]] es [[\frac{\pi}{2}i::pi medios por i]], así que la primitiva en [[i]] vale [[-\frac{\pi}{2}-i::menos pi medios, menos i]]. El logaritmo de uno es cero, y la primitiva en uno vale menos uno.` },
        { h: r`<div class="res">$$\int_\gamma\Log z\dd z=F(i)-F(1)=1-\frac{\pi}{2}-i.$$</div>`,
          v: r`La resta da [[1-\frac{\pi}{2}-i::uno menos pi medios, menos i]].` },
      ],
    },
    {
      t: r`Ejemplo 6 · $f(z)=\dfrac{1}{z^2+4}$ sobre el semicírculo superior $|z|=1$`,
      ref: 'Curvas, ejercicio 7',
      fig: figSemi,
      pasos: [
        { h: r`<p>$f$ solo falla en $z=\pm2i$. Es analítica en el disco $|z|<2$, que es simplemente conexo y contiene a la curva.</p>`,
          v: r`Ejercicio siete: [[\frac{1}{z^2+4}::uno sobre zeta cuadrado más cuatro]], sobre el semicírculo superior de radio uno, recorrido de uno a menos uno. Las únicas singularidades están en [[\pm 2i]], lejos de la curva. La función es analítica en el disco de radio dos, que no tiene agujeros.` },
        { h: r`<p>⟹ dentro del disco la integral <span class="am">no depende del camino</span>. Cambiamos el arco por el segmento real de $1$ a $-1$.</p>`,
          v: r`Entonces, dentro de ese disco, la integral no depende del camino, y podemos cambiar el semicírculo por el camino más cómodo con los mismos extremos: el segmento del eje real, de uno a menos uno.` },
        { h: r`<div class="res">$$\int_\gamma\frac{\dd z}{z^2+4}=\int_1^{-1}\frac{\dd x}{x^2+4}=\left[\frac12\arctan\frac{x}{2}\right]_1^{-1}=-\arctan\frac12.$$</div><p class="pie">$\approx-0{,}4636$</p>`,
          v: r`Sobre el eje real es una integral de cálculo uno. Su primitiva es un medio del arco tangente de [[x/2::equis medios]], y el resultado es menos arco tangente de un medio.`,
          nota: r`Si el enunciado se interpreta como el contorno cerrado del semidisco (arco más diámetro), la integral vale $0$ por el teorema de Cauchy–Goursat del Nivel 3.` },
      ],
    },
    {
      t: r`Ejemplo 7 · $f(z)=z\sqrt z$ sobre un arco de parábola`,
      ref: 'Curvas, ejercicio 9',
      fig: figParab,
      pasos: [
        { h: r`<p>Arco de parábola $x=y^2$ de $1-i$ a $1+i$: $\;\gamma(t)=t^2+it$, $-1\le t\le1$. Está en $\Re z\ge0$ y solo toca el corte de $\sqrt z$ en el origen.</p>`,
          v: r`Ejercicio nueve. El arco de parábola con vértice en el origen que une [[1-i::uno menos i]] con [[1+i::uno más i]] es [[x=y^2::equis igual a ye cuadrado]], que se parametriza como [[t^2+it::te cuadrado más i te]]. Todo el arco está en el semiplano derecho, y solo toca el corte de la raíz principal en el origen, donde la función sigue siendo continua.` },
        { h: r`<p>Primitiva: $F(z)=\frac25\,z^{5/2}$ (rama principal). Como $1\pm i=\sqrt2\,e^{\pm i\pi/4}$:</p>$$(1\pm i)^{5/2}=2^{5/4}\,e^{\pm i\,5\pi/8}.$$`,
          v: r`Como [[z\sqrt z::zeta por raíz de zeta]] es [[z^{3/2}::zeta a la tres medios]], una primitiva es [[\frac25z^{5/2}::dos quintos de zeta a la cinco medios]], con la rama principal. Para evaluarla escribimos los extremos en forma polar: módulo raíz de dos, y argumentos más y menos pi cuartos.` },
        { h: r`<div class="res">$$\int_\gamma z\sqrt z\dd z=\frac25\,2^{5/4}\left(e^{i5\pi/8}-e^{-i5\pi/8}\right)=\frac45\,2^{5/4}\sen\frac{5\pi}{8}\;i.$$</div><p class="pie">$\approx1{,}758\,i$</p>`,
          v: r`La diferencia de las dos exponenciales conjugadas es [[2i\sen\frac{5\pi}{8}::dos i por el seno de cinco pi octavos]]. El resultado es imaginario puro: aproximadamente uno coma setenta y seis, por [[i]].`,
          nota: r`$F$ es continua sobre todo el arco y analítica fuera del origen; el teorema fundamental se aplica a cada mitad del arco (de $1-i$ a $0$ y de $0$ a $1+i$) pasando al límite en el origen.` },
      ],
    },
    {
      t: 'Tres ejercicios más de la lista, en una línea',
      ref: 'Curvas, ejercicios 1, 2 y 10',
      pasos: [
        { h: r`<p><b>Ej. 1.</b> $f=z^2$, $\gamma(t)=\cos t$, $0\le t\le\frac{\pi}{2}$: va de $1$ a $0$. Con $F=\frac{z^3}{3}$: $\;0-\frac13=-\frac13$.</p>`,
          v: r`Tres ejercicios más de la lista, resueltos en una línea cada uno. El ejercicio uno: [[z^2::zeta cuadrado]] sobre la curva coseno de [[t]], que va de uno a cero por el eje real. Con la primitiva [[z^3/3::zeta cubo sobre tres]], el resultado es menos un tercio.` },
        { h: r`<p><b>Ej. 2.</b> $f=\frac1z$, $\gamma(t)=e^{it}$, $0\le t\le\frac{\pi}{4}$: $\;\displaystyle\int_0^{\pi/4}e^{-it}\,i\,e^{it}\dd t=\frac{\pi}{4}\,i$.</p>`,
          v: r`El ejercicio dos: [[1/z::uno sobre zeta]] sobre un arco de la circunferencia unitaria, de amplitud pi cuartos. El integrando se reduce a la constante [[i]], y el resultado es [[\frac{\pi}{4}i::pi cuartos por i]]. En general, la integral de [[1/z::uno sobre zeta]] sobre un arco centrado en el origen es [[i]] por el ángulo recorrido.` },
        { h: r`<p><b>Ej. 10.</b> $f=\Im z+i\,\Re z=i\,\bar z$ (no analítica), segmento de $i$ a $1+2i$: $\gamma(t)=t+i(1+t)$, $\gamma'=1+i$.</p>$$\int_0^1\big[(1+t)+it\big](1+i)\dd t=(1+i)\left(\tfrac32+\tfrac{i}{2}\right)=1+2i.$$`,
          v: r`Y el ejercicio diez: la función [[\Im z+i\Re z::parte imaginaria de zeta, más i por parte real de zeta]], que es [[i\bar z::i por zeta conjugado]], y no es analítica. Parametrizamos el segmento de [[i]] a [[1+2i::uno más dos i]], sustituimos, y la integral da [[1+2i::uno más dos i]].` },
      ],
    },
    {
      t: r`La desigualdad $ML$`,
      fig: figML,
      pasos: [
        { h: r`<div class="teo"><span class="rot">Cota $ML$.</span> Si $|f(z)|\le M$ sobre $\gamma$ y $L$ es la longitud de $\gamma$: $$\left|\int_\gamma f(z)\dd z\right|\le M\cdot L.$$</div>`,
          v: r`La última herramienta del nivel no calcula integrales: las acota. Si el módulo de la función no supera [[M]] sobre la curva, y la curva tiene longitud [[L]], entonces el módulo de la integral es, a lo sumo, [[M\cdot L::eme por ele]].` },
        { h: r`<p><b>Ejemplo.</b> Semicírculo $C_R$ de radio $R>2$: $\;|z^2+4|\ge R^2-4$, $\;L=\pi R$.</p>$$\left|\int_{C_R}\frac{\dd z}{z^2+4}\right|\le\frac{\pi R}{R^2-4}\xrightarrow[R\to\infty]{}0.$$`,
          v: r`Ejemplo típico: la función [[\frac{1}{z^2+4}::uno sobre zeta cuadrado más cuatro]] sobre un semicírculo de radio [[R]] grande. Por la desigualdad triangular inversa, el denominador es al menos [[R^2-4::erre cuadrado menos cuatro]]. La longitud del semicírculo es [[\pi R::pi erre]]. La cota es [[\frac{\pi R}{R^2-4}::pi erre, sobre erre cuadrado menos cuatro]], que tiende a cero cuando [[R]] crece.` },
        { h: r`<div class="idea"><span class="rot">Para qué sirve.</span> Para demostrar que la integral sobre un arco grande (o pequeño) <b>desaparece en el límite</b>. Es la pieza clave del Nivel 6.</div>`,
          v: r`Este tipo de argumento sirve para demostrar que la integral sobre un arco desaparece en el límite. Es la pieza que hace funcionar el cálculo de integrales reales impropias con residuos, en el nivel seis.` },
      ],
    },
    {
      t: 'Estrategia y errores frecuentes',
      clase: 'compacta',
      pasos: [
        { h: r`<div class="idea"><span class="rot">¿Qué hago ante $\int_\gamma f\dd z$?</span><ol class="l"><li>¿$f$ tiene $\bar z$, $\Re$, $\Im$ o $|z|$? → <b>parametrizar</b> (no hay atajo).</li><li>¿$f$ es analítica en una región sin agujeros que contiene a $\gamma$? → <b>primitiva</b>, o cambiar de camino.</li><li>¿$\gamma$ es cerrada y encierra singularidades? → Niveles 3 y 4.</li></ol></div>`,
          v: r`Resumamos la estrategia. Ante una integral de contorno, pregúntate tres cosas, en orden. Uno: ¿la función tiene conjugados, partes reales o módulos? Entonces no es analítica, y hay que parametrizar. Dos: ¿es analítica en una región sin agujeros que contiene a la curva? Entonces usa una primitiva, o cambia el camino por uno más fácil. Tres: ¿la curva es cerrada y encierra singularidades? Ese es el tema de los niveles tres y cuatro.` },
        { h: r`<div class="ojo"><span class="rot">Errores que cuestan puntos</span><ul class="l"><li>Olvidar el factor $\gamma'(t)$.</li><li>Usar una primitiva con una función no analítica.</li><li>Ignorar el sentido de recorrido (cambia el signo).</li><li>Usar $\Log$ o $\sqrt{\ }$ sin comprobar que la curva evita el corte.</li></ul></div>`,
          v: r`Y los errores típicos. Olvidar multiplicar por la derivada de la parametrización. Usar una primitiva con una función que no es analítica. Ignorar el sentido de recorrido, que cambia el signo. Y usar el logaritmo o una raíz sin comprobar que la curva evita el corte de rama.` },
        { h: r`<p class="am"><b>Siguiente paso:</b> práctica del Nivel 2. Al aprobarla se desbloquea el Nivel 3.</p>`,
          v: r`Ahora resuelve la práctica del nivel dos. Al aprobarla se desbloquea el nivel tres: el teorema de Cauchy y la fórmula integral.` },
      ],
    },
  ],
};
