// NIVEL 5 · Integrales racionales de senos y cosenos
import { r } from '../lib/mate.mjs';
import { plano, ejes, arco, circ, seg, curva, disco, pto, etq, PI } from '../lib/plano.mjs';

const ax = 0.95;
const figUnit = plano({ x: [-1.55, 1.75], y: [-1.45, 1.55], w: 620 },
  ejes(),
  circ([0, 0], 1, { flecha: [0.28, 0.78], trazo: true, desde: 0 }),
  seg([0, 0], [Math.cos(ax), Math.sin(ax)], { c: 'c2 fina' }),
  arco([0, 0], 0.33, 0, ax, { c: 'c3 fina', flecha: false, tex: 'x', pos: 'e' }),
  pto([Math.cos(ax), Math.sin(ax)], 'z=e^{ix}', { pos: 'ne' }),
  pto([1, 0], '1', { pos: 'se' }),
  etq([-0.95, 0.95], '|z|=1', { c: 'am chica' }),
);

const zp = -2 + Math.sqrt(3), zm = -2 - Math.sqrt(3);
const figModelo = plano({ x: [-4.5, 1.9], y: [-1.9, 1.9], w: 640 },
  disco([0, 0], 1, { c: 'suave' }),
  ejes(),
  circ([0, 0], 1, { flecha: [0.13] }),
  pto([zp, 0], 'z_+', { tipo: 'polo', pos: 'n', desde: 1 }),
  pto([zm, 0], 'z_-', { tipo: 'polo', pos: 'n', c: 'fuera', desde: 1 }),
  etq([-2.2, -1.25], 'z_+z_-=1', { c: 'ci chica', desde: 1 }),
  etq([0.95, 1.0], '|z|=1', { c: 'am chica' }),
);

export default {
  id: 'nivel5',
  n: 5,
  etiqueta: 'NIVEL 5',
  titulo: 'Integrales trigonométricas',
  sub: 'De una integral real en [0, 2π] a una integral sobre el círculo unitario',
  lista: 'Integrales de funciones racionales de senos y cosenos (lista de 10 ejercicios)',
  escenas: [
    {
      portada: { nivel: 'NIVEL 5', titulo: 'Integrales trigonométricas', sub: 'De una integral real en [0, 2π] a una integral sobre el círculo unitario' },
      pasos: [
        { h: '', v: r`Nivel cinco: integrales de funciones racionales de senos y cosenos. Aquí empieza la recompensa: vamos a usar los residuos para calcular integrales reales, que con las técnicas de cálculo serían largas o inmanejables.` },
        { h: r`<ul class="l"><li>Convertir $\int_0^{2\pi}R(\cos x,\sen x)\dd x$ en una integral sobre $|z|=1$.</li><li>Localizar los polos <span class="am">dentro</span> del círculo unitario.</li><li>Simplificar antes de sustituir: identidades, periodicidad, simetría.</li><li>Reconocer cuándo no hacen falta residuos.</li></ul>`,
          v: r`Objetivos. Convertir una integral trigonométrica sobre un periodo en una integral de contorno sobre el círculo unitario. Localizar los polos que caen dentro. Simplificar antes de sustituir, usando identidades y simetrías. Y reconocer los casos en que ni siquiera hacen falta residuos.` },
      ],
    },
    {
      t: 'La idea: recorrer el círculo unitario',
      fig: figUnit,
      clase: 'compacta',
      pasos: [
        { h: r`<p>Cuando $x$ va de $0$ a $2\pi$, el punto $z=e^{ix}$ recorre una vez el círculo $|z|=1$ en sentido positivo.</p>`,
          v: r`La idea central es un cambio de variable. Cuando [[x]] recorre el intervalo de cero a dos pi, el punto [[z=e^{ix}::zeta igual a e a la i equis]] da una vuelta completa al círculo unitario, en sentido positivo. Una integral en [[x]] sobre un periodo se puede leer como una integral de contorno en [[z]].` },
        { h: r`<div class="teo"><span class="rot">Diccionario.</span> $$\cos x=\frac12\left(z+\frac1z\right),\quad\sen x=\frac{1}{2i}\left(z-\frac1z\right),\quad\dd x=\frac{\dd z}{i\,z}.$$</div>`,
          v: r`El diccionario tiene tres entradas, que salen de la fórmula de Euler. Como [[1/z::uno sobre zeta]] es [[e^{-ix}::e a la menos i equis]], el coseno es [[\frac12(z+\frac1z)::un medio, de zeta más uno sobre zeta]]. El seno es [[\frac{1}{2i}(z-\frac1z)::uno sobre dos i, por zeta menos uno sobre zeta]]. Y derivando, [[\dd x::de equis]] es [[\frac{\dd z}{iz}::de zeta, sobre i zeta]].`,
          nota: r`Para ángulos múltiples: $\cos nx=\dfrac{z^n+z^{-n}}{2}$ y $\sen nx=\dfrac{z^n-z^{-n}}{2i}$.` },
        { h: r`<div class="res">$$\int_0^{2\pi}\!R(\cos x,\sen x)\dd x=\oint_{|z|=1}\!R\!\left(\tfrac{z+z^{-1}}{2},\tfrac{z-z^{-1}}{2i}\right)\frac{\dd z}{iz}=2\pi i\!\sum_{|z_k|<1}\!\Res.$$</div>`,
          v: r`Sustituyendo, la integral trigonométrica se convierte en la integral de una función racional de [[z]] sobre el círculo unitario, que se calcula con el teorema de los residuos, sumando solo sobre los polos de módulo menor que uno.` },
      ],
    },
    {
      t: 'Receta y controles de calidad',
      pasos: [
        { h: r`<div class="idea"><ol class="l"><li>Sustituir con el diccionario y <b>multiplicar por $z$</b> (o la potencia necesaria) para quitar los $\frac1z$.</li><li>Hallar los polos y quedarse con los de $|z|<1$.</li><li>Calcular residuos, sumar y multiplicar por $2\pi i$.</li></ol></div>`,
          v: r`La receta. Uno: sustituir con el diccionario, y limpiar la expresión, multiplicando numerador y denominador por [[z]], o por la potencia que haga falta, hasta tener un cociente de polinomios. Dos: hallar los polos, y quedarte con los que están dentro del círculo unitario. Tres: calcular residuos, sumar, y multiplicar por [[2\pi i]].` },
        { h: r`<p><b>Controles de calidad</b></p><ul class="l"><li>Integrando real ⟹ el resultado debe ser <span class="am">real</span>.</li><li>Integrando positivo ⟹ resultado positivo.</li><li>El denominador original no puede anularse en $[0,2\pi]$; si lo hace, hay polos <b>sobre</b> $|z|=1$.</li></ul>`,
          v: r`Y tres controles de calidad, que detectan casi todos los errores. Si el integrando original es real, el resultado tiene que ser real: si te queda una [[i]], hay un error. Si el integrando es positivo, el resultado es positivo. Y el denominador original no puede anularse en el intervalo, porque eso significaría que hay polos sobre el propio círculo.` },
      ],
    },
    {
      t: r`Ejemplo 1 (modelo) · $\displaystyle\int_0^{2\pi}\frac{\dd x}{a+\cos x},\;\;a>1$`,
      ref: 'Trigonométricas, ejercicio 9',
      fig: figModelo,
      clase: 'compacta',
      pasos: [
        { h: r`$$\int_0^{2\pi}\!\frac{\dd x}{a+\cos x}=\oint_{|z|=1}\frac{1}{a+\frac12\left(z+\frac1z\right)}\frac{\dd z}{iz}=\frac2i\oint_{|z|=1}\frac{\dd z}{z^2+2az+1}.$$`,
          v: r`El ejemplo modelo es el ejercicio nueve de la lista, con [[a]] mayor que uno. Sustituimos el coseno y el diferencial. Para limpiar, multiplicamos numerador y denominador por [[2z::dos zeta]]. Queda dos sobre [[i]], por la integral de uno sobre [[z^2+2az+1::zeta cuadrado, más dos a zeta, más uno]].` },
        { h: r`<p>Polos: $z_\pm=-a\pm\sqrt{a^2-1}$ (reales). Como $z_+z_-=1$, <span class="am">exactamente uno</span> está dentro: $z_+=-a+\sqrt{a^2-1}$.</p>`,
          v: r`Las raíces son [[-a\pm\sqrt{a^2-1}::menos a, más menos la raíz de a cuadrado menos uno]]. Un truco que ahorra cuentas: el producto de las raíces es el término independiente, que es uno. Si el producto de dos números es uno, y no tienen módulo uno, uno de ellos está dentro del círculo y el otro fuera. El de dentro es el de módulo menor: el del signo más.` },
        { h: r`<p>Regla $p/q$: $\;\displaystyle\Res_{z=z_+}\frac{1}{z^2+2az+1}=\frac{1}{2z_++2a}=\frac{1}{2\sqrt{a^2-1}}$.</p>`,
          v: r`El residuo, con la regla [[p/q::pe sobre cu]], es uno sobre la derivada del denominador, que es [[2z+2a::dos zeta más dos a]]. Evaluada en la raíz de dentro, da dos por la raíz de [[a^2-1::a cuadrado menos uno]].` },
        { h: r`<div class="res">$$\int_0^{2\pi}\frac{\dd x}{a+\cos x}=\frac2i\cdot2\pi i\cdot\frac{1}{2\sqrt{a^2-1}}=\frac{2\pi}{\sqrt{a^2-1}}.$$</div>`,
          v: r`Multiplicamos: dos sobre [[i]], por [[2\pi i]], por el residuo. Las [[i]] se cancelan, como debe ser, y el resultado es [[\frac{2\pi}{\sqrt{a^2-1}}::dos pi, sobre la raíz de a cuadrado menos uno]]. Memoriza esta fórmula: varios ejercicios se reducen a ella.` },
        { h: r`<p class="pie">Si $a<-1$ el polo interior es $z_-$ y el resultado es $-\dfrac{2\pi}{\sqrt{a^2-1}}$. En general, si $a>|b|$: $\displaystyle\int_0^{2\pi}\!\frac{\dd x}{a+b\cos x}=\int_0^{2\pi}\!\frac{\dd x}{a+b\sen x}=\frac{2\pi}{\sqrt{a^2-b^2}}$.</p>`,
          v: r`Dos comentarios. Si [[a]] es menor que menos uno, el integrando es negativo, el polo interior es el otro, y el resultado cambia de signo. Y la versión general: para [[a]] mayor que el valor absoluto de [[b]], la integral de uno sobre [[a+b\cos x::a más be coseno de equis]], o con seno en lugar de coseno, vale [[\frac{2\pi}{\sqrt{a^2-b^2}}::dos pi, sobre la raíz de a cuadrado menos be cuadrado]].` },
      ],
    },
    {
      t: r`Ejemplo 2 · $\displaystyle\int_0^{2\pi}\frac{\dd x}{\cos x+\sen x+3}$`,
      ref: 'Trigonométricas, ejercicio 1',
      clase: 'compacta',
      pasos: [
        { h: r`$$\cos x+\sen x+3=\frac{(1-i)z+(1+i)z^{-1}+6}{2}\;\Rightarrow\;\int=\frac2i\oint_{|z|=1}\frac{\dd z}{(1-i)z^2+6z+(1+i)}.$$`,
          v: r`Ejercicio uno. Sustituimos seno y coseno, y agrupamos. Usando que uno sobre [[i]] es menos [[i]], el denominador queda [[(1-i)z+(1+i)/z+6::uno menos i, por zeta, más uno más i, sobre zeta, más seis]], todo sobre dos. Multiplicando por [[z]], llegamos a una cuadrática con coeficientes complejos.` },
        { h: r`<p>Raíces: $z=\dfrac{-6\pm\sqrt{36-4(1-i)(1+i)}}{2(1-i)}=\dfrac{-3\pm\sqrt7}{1-i}$. $\quad|z_+|=\dfrac{3-\sqrt7}{\sqrt2}\approx0{,}25<1$ <span class="ve">✓</span></p>`,
          v: r`La fórmula cuadrática funciona igual con coeficientes complejos. El discriminante es treinta y seis, menos cuatro por [[(1-i)(1+i)::uno menos i por uno más i]], que es dos: en total, veintiocho. Las raíces son [[\frac{-3\pm\sqrt7}{1-i}::menos tres más menos raíz de siete, sobre uno menos i]]. La del signo más tiene módulo aproximadamente cero coma veinticinco, y está dentro. La otra está fuera.` },
        { h: r`<p>$\displaystyle\Res_{z=z_+}=\frac{1}{2(1-i)z_++6}=\frac{1}{2(-3+\sqrt7)+6}=\frac{1}{2\sqrt7}$.</p>`,
          v: r`El residuo es uno sobre la derivada del denominador: [[2(1-i)z+6::dos, por uno menos i, por zeta, más seis]]. Al sustituir la raíz, el factor [[1-i::uno menos i]] se cancela, y queda uno sobre dos raíz de siete.` },
        { h: r`<div class="res">$$\int_0^{2\pi}\frac{\dd x}{\cos x+\sen x+3}=\frac2i\cdot2\pi i\cdot\frac{1}{2\sqrt7}=\frac{2\pi}{\sqrt7}.$$</div>`,
          v: r`El resultado es [[\frac{2\pi}{\sqrt7}::dos pi sobre raíz de siete]]: real y positivo, como exigen los controles.` },
        { h: r`<div class="idea"><span class="rot">Atajo.</span> $\cos x+\sen x=\sqrt2\cos\!\left(x-\frac{\pi}{4}\right)$, y un desplazamiento no cambia la integral sobre un periodo: modelo con $a=3$, $b=\sqrt2$ ⟹ $\dfrac{2\pi}{\sqrt{9-2}}$.</div>`,
          v: r`Y un atajo para verificar: [[\cos x+\sen x::coseno más seno]] es raíz de dos por un coseno desplazado, y desplazar la variable no cambia la integral sobre un periodo completo. Con la fórmula modelo, [[a]] igual a tres y [[b]] igual a raíz de dos, sale el mismo resultado.` },
      ],
    },
    {
      t: 'Simplificar antes de sustituir',
      ref: 'Trigonométricas, ejercicios 2, 8 y 6',
      clase: 'mini',
      pasos: [
        { h: r`<div class="idea"><span class="rot">Tres herramientas.</span><ul class="l"><li><b>Identidades:</b> $\sen x\cos x=\frac12\sen2x$, $\;\cos^2x=\frac{1+\cos2x}{2}$, $\;\sen^2\frac x2=\frac{1-\cos x}{2}$.</li><li><b>Periodicidad:</b> $\int_0^{2\pi}h(2x)\dd x=\int_0^{2\pi}h(u)\dd u$ si $h$ tiene periodo $2\pi$.</li><li><b>Simetría:</b> los términos impares (respecto de $0$ o de $\pi$) integran $0$.</li></ul></div>`,
          v: r`Antes de lanzarte a sustituir, simplifica. Tres herramientas. Las identidades trigonométricas, para reducir productos y potencias. La periodicidad: si la función depende de [[2x::dos equis]], el cambio de variable [[u=2x::u igual a dos equis]] recorre dos periodos con un factor un medio, y la integral queda igual que si en lugar de [[2x::dos equis]] hubiera [[x]]. Y la simetría: los términos impares integran cero sobre un periodo.` },
        { h: r`<p><b>Ej. 2.</b> $\displaystyle\int_0^{2\pi}\frac{\dd x}{\cos x\sen x+3}=\int_0^{2\pi}\frac{\dd u}{3+\frac12\sen u}=\frac{2\pi}{\sqrt{9-\frac14}}=\frac{4\pi}{\sqrt{35}}$.</p>`,
          v: r`El ejercicio dos: el producto [[\cos x\sen x::coseno por seno]] es un medio del seno de [[2x::dos equis]]. Por periodicidad, podemos cambiar [[2x::dos equis]] por [[u]]. Y la fórmula modelo, con [[a]] igual a tres y [[b]] igual a un medio, da [[\frac{4\pi}{\sqrt{35}}::cuatro pi sobre raíz de treinta y cinco]].` },
        { h: r`<p><b>Ej. 8.</b> $(\cos x+\sen x)^2=1+\sen2x$: $\displaystyle\int_{-\pi}^{\pi}\frac{\dd x}{2+\sen2x}=\int_0^{2\pi}\frac{\dd u}{2+\sen u}=\frac{2\pi}{\sqrt3}$.</p>`,
          v: r`El ejercicio ocho: el cuadrado de [[\cos x+\sen x::coseno más seno]] es uno más seno de [[2x::dos equis]]. El denominador se convierte en dos más seno de [[2x::dos equis]], y con los mismos dos pasos el resultado es [[\frac{2\pi}{\sqrt3}::dos pi sobre raíz de tres]]. El intervalo de menos pi a pi también es un periodo completo, así que vale lo mismo.` },
        { h: r`<p><b>Ej. 6.</b> $\displaystyle\int_{-\pi}^{\pi}\frac{\sen x\cos x+1}{3\cos x+4}\dd x$: el término con $\sen x$ es impar ⟹ $\displaystyle\int_{-\pi}^{\pi}\frac{\dd x}{4+3\cos x}=\frac{2\pi}{\sqrt{16-9}}=\frac{2\pi}{\sqrt7}$.</p>`,
          v: r`Y el ejercicio seis: el término [[\sen x\cos x::seno por coseno]], sobre el denominador, es una función impar, y su integral en un intervalo simétrico es cero. Queda uno sobre [[4+3\cos x::cuatro más tres coseno de equis]], que por la fórmula modelo da [[\frac{2\pi}{\sqrt7}::dos pi sobre raíz de siete]].` },
      ],
    },
    {
      t: r`Ejemplo 3 · $\displaystyle\int_0^{2\pi}\frac{\sen^2(x/2)}{\cos x+2}\dd x$`,
      ref: 'Trigonométricas, ejercicio 3',
      pasos: [
        { h: r`<p>$\sen^2\dfrac x2=\dfrac{1-\cos x}{2}\;$ y, dividiendo, $\;\dfrac{1-\cos x}{2+\cos x}=-1+\dfrac{3}{2+\cos x}$.</p>`,
          v: r`Ejercicio tres. El seno al cuadrado del ángulo mitad se escribe con la identidad como [[\frac{1-\cos x}{2}::uno menos coseno de equis, sobre dos]]. El cociente [[\frac{1-\cos x}{2+\cos x}::uno menos coseno, sobre dos más coseno]], se simplifica dividiendo: es menos uno, más tres sobre [[2+\cos x::dos más coseno]].` },
        { h: r`<div class="res">$$\int_0^{2\pi}\frac{\sen^2(x/2)}{\cos x+2}\dd x=\frac12\left[-2\pi+3\cdot\frac{2\pi}{\sqrt{4-1}}\right]=\pi\left(\sqrt3-1\right).$$</div>`,
          v: r`La integral de menos uno es menos dos pi. La otra es tres veces la fórmula modelo con [[a]] igual a dos, que da dos pi sobre raíz de tres. Con el factor un medio, el resultado es [[\pi(\sqrt3-1)::pi, por raíz de tres menos uno]].` },
      ],
    },
    {
      t: r`Ejemplo 4 · $\displaystyle\int_0^{2\pi}\frac{\sen x\cos x+1}{(\cos x+2)^2}\dd x$`,
      ref: 'Trigonométricas, ejercicio 4',
      clase: 'compacta',
      pasos: [
        { h: r`<p>El término $\dfrac{\sen x\cos x}{(\cos x+2)^2}$ es impar respecto de $x=\pi$: integra $0$. Queda $\displaystyle\int_0^{2\pi}\frac{\dd x}{(2+\cos x)^2}$.</p>`,
          v: r`Ejercicio cuatro. Primero la simetría: el término con [[\sen x\cos x::seno por coseno]] es impar respecto de pi, y su integral sobre el periodo es cero. Queda la integral de uno sobre [[(2+\cos x)^2::dos más coseno, al cuadrado]], que ya no es la fórmula modelo. Hay que usar residuos.` },
        { h: r`$$\int_0^{2\pi}\frac{\dd x}{(2+\cos x)^2}=\oint_{|z|=1}\frac{4z^2}{(z^2+4z+1)^2}\cdot\frac{\dd z}{iz}=\frac4i\oint_{|z|=1}\frac{z\dd z}{(z^2+4z+1)^2}.$$`,
          v: r`Sustituimos. Dos más coseno es [[\frac{z^2+4z+1}{2z}::zeta cuadrado más cuatro zeta más uno, sobre dos zeta]]. Al elevar al cuadrado e invertir, aparece [[4z^2::cuatro zeta cuadrado]] en el numerador. Con el diferencial, queda cuatro sobre [[i]], por la integral de [[z]] sobre [[(z^2+4z+1)^2::zeta cuadrado más cuatro zeta más uno, al cuadrado]].` },
        { h: r`<p>$z^2+4z+1=(z-z_+)(z-z_-)$, $\;z_\pm=-2\pm\sqrt3$. Dentro: $z_+$, polo <b>doble</b>.</p>$$\Res_{z=z_+}=\frac{\dd}{\dd z}\left[\frac{z}{(z-z_-)^2}\right]_{z_+}=\frac{-(z_++z_-)}{(z_+-z_-)^3}=\frac{4}{(2\sqrt3)^3}=\frac{1}{6\sqrt3}.$$`,
          v: r`Las raíces son [[-2\pm\sqrt3::menos dos, más menos raíz de tres]], y la de dentro es la del signo más, que ahora es un polo doble. Multiplicamos por [[(z-z_+)^2::zeta menos zeta más, al cuadrado]], derivamos y evaluamos. La derivada del cociente se simplifica a menos la suma de las raíces, sobre el cubo de su diferencia. La suma de las raíces es menos cuatro, y la diferencia es dos raíz de tres. El residuo es uno sobre seis raíz de tres.`,
          nota: r`$\dfrac{\dd}{\dd z}\dfrac{z}{(z-z_-)^2}=\dfrac{(z-z_-)-2z}{(z-z_-)^3}=-\dfrac{z+z_-}{(z-z_-)^3}$.` },
        { h: r`<div class="res">$$\int_0^{2\pi}\frac{\sen x\cos x+1}{(\cos x+2)^2}\dd x=\frac4i\cdot2\pi i\cdot\frac{1}{6\sqrt3}=\frac{4\pi}{3\sqrt3}.$$</div>`,
          v: r`Multiplicando por cuatro sobre [[i]], y por [[2\pi i]], el resultado es [[\frac{4\pi}{3\sqrt3}::cuatro pi, sobre tres raíz de tres]].` },
      ],
    },
    {
      t: 'Ejemplo 5 · Cuando no hacen falta residuos',
      ref: 'Trigonométricas, ejercicios 5 y 7',
      clase: 'compacta',
      pasos: [
        { h: r`<p><b>Ej. 5.</b> $\displaystyle\int_{-\pi}^{\pi}\frac{\cos2x}{3\sen2x-5}\dd x$: el numerador es $\frac16$ de la derivada del denominador.</p>$$=\frac16\Big[\ln|3\sen2x-5|\Big]_{-\pi}^{\pi}=0.$$`,
          v: r`No todos los ejercicios de la lista necesitan residuos, y reconocerlo ahorra tiempo en el examen. En el ejercicio cinco, el numerador es, salvo un factor, la derivada del denominador. La primitiva es el logaritmo de una función periódica, que toma el mismo valor en los dos extremos. La integral es cero.` },
        { h: r`<p><b>Ej. 7.</b> $\displaystyle\int_0^{\pi/2}\frac{\sen^24x}{4+4\cos4x}\dd x$, con $\sen^24x=(1-\cos4x)(1+\cos4x)$:</p>$$=\int_0^{\pi/2}\frac{1-\cos4x}{4}\dd x=\frac{\pi}{8}.$$`,
          v: r`En el ejercicio siete, el seno al cuadrado es una diferencia de cuadrados: [[(1-\cos 4x)(1+\cos 4x)::uno menos coseno de cuatro equis, por uno más coseno de cuatro equis]]. Un factor se cancela con el denominador, y lo que queda se integra directamente. El resultado es [[\frac{\pi}{8}::pi octavos]].` },
        { h: r`<div class="ojo"><span class="rot">Detalle.</span> En el ej. 7 el denominador se anula en $x=\frac{\pi}{4}$, pero el numerador también: la singularidad es evitable.</div>`,
          v: r`Un detalle fino del ejercicio siete: el denominador se anula en [[x=\pi/4::equis igual a pi cuartos]], pero el numerador también, y la singularidad es evitable. Por eso la simplificación es legítima.` },
      ],
    },
    {
      t: r`Ejemplo 6 · $\displaystyle\int_0^{2\pi}\frac{\dd x}{a^2+\cos^2x}$`,
      ref: 'Trigonométricas, ejercicio 10',
      pasos: [
        { h: r`<p>$\cos^2x=\dfrac{1+\cos2x}{2}\;\Rightarrow\;\dfrac{1}{a^2+\cos^2x}=\dfrac{2}{(2a^2+1)+\cos2x}$.</p>`,
          v: r`Ejercicio diez, el último de la lista. Bajamos el cuadrado con la identidad del ángulo doble. El integrando se convierte en dos sobre [[2a^2+1+\cos 2x::dos a cuadrado más uno, más coseno de dos equis]].` },
        { h: r`<p>Periodicidad ($2x\to u$) y fórmula modelo con $A=2a^2+1$:</p><div class="res">$$\int_0^{2\pi}\frac{\dd x}{a^2+\cos^2x}=\frac{2\cdot2\pi}{\sqrt{(2a^2+1)^2-1}}=\frac{4\pi}{\sqrt{4a^4+4a^2}}=\frac{2\pi}{|a|\sqrt{a^2+1}}.$$</div>`,
          v: r`Por periodicidad, cambiamos [[2x::dos equis]] por [[u]], y aplicamos la fórmula modelo. Dentro de la raíz queda [[(2a^2+1)^2-1::dos a cuadrado más uno, al cuadrado, menos uno]], que es [[4a^2(a^2+1)::cuatro a cuadrado, por a cuadrado más uno]]. El resultado final es [[\frac{2\pi}{|a|\sqrt{a^2+1}}::dos pi, sobre valor absoluto de a, por la raíz de a cuadrado más uno]]. No olvides el valor absoluto al sacar [[a]] de la raíz.` },
      ],
    },
    {
      t: 'Errores frecuentes y resumen del nivel',
      clase: 'compacta',
      pasos: [
        { h: r`<div class="ojo"><span class="rot">Errores que cuestan puntos</span><ul class="l"><li>Olvidar el factor $\dfrac{1}{iz}$ de $\dd x$.</li><li>Contar un polo con $|z|>1$.</li><li>No limpiar los $\frac1z$ antes de buscar polos (se pierde o se inventa un polo en $z=0$).</li><li>Aceptar un resultado con parte imaginaria para un integrando real.</li></ul></div>`,
          v: r`Errores frecuentes. Olvidar el factor uno sobre [[iz::i zeta]], que viene del diferencial. Contar un polo que está fuera del círculo unitario. No limpiar la expresión antes de buscar los polos, con lo que se pierde, o se inventa, un polo en el origen. Y aceptar un resultado con parte imaginaria, cuando el integrando era real.` },
        { h: r`<div class="res"><span class="rot">Resumen</span><ul class="l"><li>$z=e^{ix}$: $\;\cos x=\frac{z+z^{-1}}{2}$, $\;\sen x=\frac{z-z^{-1}}{2i}$, $\;\dd x=\frac{\dd z}{iz}$.</li><li>Solo cuentan los polos con $|z|<1$.</li><li>Modelo: $\displaystyle\int_0^{2\pi}\frac{\dd x}{a+b\cos x}=\frac{2\pi}{\sqrt{a^2-b^2}}$, $\;a>|b|$.</li><li>Antes de sustituir: identidades, periodicidad, simetría.</li></ul></div>`,
          v: r`Resumen. El cambio [[z=e^{ix}::zeta igual a e a la i equis]] convierte la integral en una integral sobre el círculo unitario. Solo cuentan los polos interiores. La fórmula modelo resuelve muchas integrales de un vistazo. Y antes de sustituir, simplifica con identidades, periodicidad y simetría.` },
        { h: r`<p class="am"><b>Siguiente paso:</b> práctica del Nivel 5. Al aprobarla se desbloquea el Nivel 6, el último.</p>`,
          v: r`Resuelve la práctica del nivel cinco. Queda un solo nivel: las integrales impropias, y los polos sobre el eje real.` },
      ],
    },
  ],
};
