// Guion del video AL2-M23-04. Cada capítulo contiene diapositivas; cada diapositiva,
// pasos que se revelan de forma acumulativa. b = bloque visual (HTML + KaTeX),
// k = tipo de bloque (def, thm, ej, met, warn, obs, txt), v = narración (texto hablado).
var ESCENAS = [
{
  n: 1, titulo: "Introducción", vt: "Introducción.",
  slides: [
    { t: "Dominios enteros e ideales", portada: true, pasos: [
      { k: "txt", b: String.raw`<div class="portada-video"><div class="serie">Álgebra 2 · Paquete de preparación para el parcial</div><div class="grande">Dominios enteros e ideales</div><div class="sub">Módulos 2 y 3 · Video explicativo AL2-M23-04</div></div>`,
        v: "Bienvenidos. En este video repasamos los módulos dos y tres del curso de Álgebra dos: los dominios enteros y los ideales. Forma parte de un paquete de preparación para el parcial que incluye una guía de estudio, una práctica en formato de examen y un solucionario con rúbrica." },
    ]},
    { t: "Qué vas a aprender", pasos: [
      { k: "txt", b: String.raw`<ol class="agenda"><li>Dominios enteros y cancelación</li><li>Divisores de cero y los anillos \(\Z_n\)</li><li>Dominios finitos y cuerpos</li><li>Irreducibles, primos y la norma</li><li>Característica de un anillo</li></ol>`,
        v: "En la primera mitad estudiamos los dominios enteros: la ley de cancelación, los divisores de cero, los anillos zeta sub ene, los dominios finitos, los elementos irreducibles y primos, y la característica." },
      { k: "txt", b: String.raw`<ol class="agenda" start="6"><li>Ideales: definición y test</li><li>Ideal generado y operaciones</li><li>Ideales primos y maximales</li><li>Ejemplos integradores: \(\Z_{12}\) y \(\Z[i]\)</li><li>Estrategia para el parcial</li></ol>`,
        v: "En la segunda mitad pasamos a los ideales: su definición, los ideales generados, las operaciones, los ideales primos y maximales, y dos ejemplos que integran todo. Cerramos con una estrategia para el examen. La numeración de los teoremas coincide con la del folleto del curso." },
    ]},
  ]
},
{
  n: 2, titulo: "Dominios enteros y cancelación", vt: "Capítulo dos. Dominios enteros y cancelación.",
  slides: [
    { t: "Recordatorio: anillos", pasos: [
      { k: "def", b: String.raw`<span class="rot">Anillo conmutativo con identidad</span> \((R,+)\) grupo abeliano, producto asociativo y distributivo, \(ab=ba\), y existe \(1\neq0\) con \(1\cdot a=a\).`,
        v: "Empecemos recordando. Un anillo conmutativo con identidad es un conjunto con suma y producto donde la suma forma un grupo abeliano, el producto es asociativo, conmutativo y distribuye sobre la suma, y existe un uno distinto de cero." },
      { k: "def", b: String.raw`<span class="rot">Unidad y cuerpo</span> \(a\) es <b>unidad</b> si existe \(a^{-1}\) con \(aa^{-1}=1\). Un <b>cuerpo</b> es un anillo conmutativo con identidad donde todo \(a\neq0\) es unidad.`,
        v: "Un elemento es unidad si tiene inverso multiplicativo. Y un cuerpo es un anillo conmutativo con identidad en el que todo elemento distinto de cero es unidad. Por ejemplo, los racionales son un cuerpo; los enteros no, porque el dos no tiene inverso." },
    ]},
    { t: "Definición de dominio entero", pasos: [
      { k: "def", b: String.raw`<span class="rot">Definición 2.1</span> Un <b>dominio entero</b> es un anillo conmutativo con identidad que cumple la cancelación: \[a\neq0,\ ab=ac\ \Longrightarrow\ b=c.\]`,
        v: "Definición dos punto uno. Un dominio entero es un anillo conmutativo con identidad en el que vale la ley de cancelación: si a es distinto de cero y a por b es igual a a por c, entonces b es igual a c." },
      { k: "warn", b: String.raw`<span class="rot">Atención</span> La condición \(a\neq0\) es imprescindible: \(0\cdot b=0\cdot c\) siempre. Y se exige conmutatividad e identidad: \(2\Z\) no es DI.`,
        v: "Fíjate en dos detalles. Primero, la hipótesis a distinto de cero es imprescindible, porque cero por b es igual a cero por c para cualesquiera b y c. Segundo, la definición exige conmutatividad e identidad. Por eso los enteros pares no forman un dominio entero: no tienen uno." },
      { k: "ej", b: String.raw`<span class="rot">Contraejemplo</span> En \(\Z_6\): \(\cl2\cl1=\cl2=\cl2\cl4\), pero \(\cl1\neq\cl4\). La cancelación falla.`,
        v: "Un contraejemplo concreto: en zeta sub seis, dos por uno es dos, y dos por cuatro es ocho, que también es dos. Sin embargo, uno es distinto de cuatro. La cancelación falla, así que zeta sub seis no es un dominio entero." },
    ]},
    { t: "Cuerpos y dominios enteros", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Proposición 2.2</span> Todo cuerpo es un dominio entero.`,
        v: "Proposición dos punto dos. Todo cuerpo es un dominio entero." },
      { k: "txt", b: String.raw`<div class="prueba"><i>Prueba.</i> Si \(a\neq0\) y \(ab=ac\), multiplicamos por \(a^{-1}\): \(\ a^{-1}ab=a^{-1}ac\ \Rightarrow\ b=c.\)</div>`,
        v: "La prueba es inmediata. Si a es distinto de cero, en un cuerpo tiene inverso. Multiplicamos ambos lados de a por b igual a a por c por el inverso de a, y obtenemos b igual a c." },
      { k: "warn", b: String.raw`<span class="rot">El recíproco es falso</span> \(\Z\) es dominio entero pero no es cuerpo. Cuerpo \(\Rightarrow\) DI, pero DI \(\not\Rightarrow\) cuerpo.`,
        v: "El recíproco es falso. Los enteros cumplen la cancelación, pero no son un cuerpo. Recuerda la dirección correcta: cuerpo implica dominio entero, no al revés." },
    ]},
  ]
},
{
  n: 3, titulo: "Divisores de cero y los anillos \\(\\Z_n\\)", vt: "Capítulo tres. Divisores de cero y los anillos zeta sub ene.",
  slides: [
    { t: "Divisores de cero", pasos: [
      { k: "def", b: String.raw`<span class="rot">Definición 2.4</span> \(a\neq0\) es <b>divisor de cero</b> si existe \(b\neq0\) con \(ab=0\).`,
        v: "Definición dos punto cuatro. Un elemento a distinto de cero es divisor de cero si existe otro elemento b, también distinto de cero, tal que a por b es igual a cero. Por ejemplo, en zeta sub seis, dos por tres es seis, que es cero." },
      { k: "thm", b: String.raw`<span class="rot">Teorema 2.6</span> Un anillo conmutativo con identidad es DI \(\iff\) no tiene divisores de cero: \[ab=0\ \Longrightarrow\ a=0\ \text{ o }\ b=0.\]`,
        v: "El teorema dos punto seis dice que un anillo conmutativo con identidad es dominio entero si y solo si no tiene divisores de cero. Esta es la forma más práctica de la definición." },
      { k: "txt", b: String.raw`<div class="prueba"><i>Idea.</i> \((\Rightarrow)\) \(ab=0=a\cdot0\); cancelar \(a\). &nbsp; \((\Leftarrow)\) \(ab=ac\Rightarrow a(b-c)=0\Rightarrow b-c=0\).</div>`,
        v: "La prueba tiene dos líneas. Si hay cancelación y a por b es cero, escribimos cero como a por cero y cancelamos a. Recíprocamente, si a por b es igual a a por c, entonces a por b menos c es cero, y como no hay divisores de cero, b menos c es cero." },
    ]},
    { t: "El criterio en \\(\\Z_n\\)", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Teorema 2.9</span> En \(\Z_n\), \(\cl m\neq\cl0\) es divisor de cero \(\iff\mcd(m,n)\neq1\).`,
        v: "En zeta sub ene hay un criterio muy cómodo. Teorema dos punto nueve: una clase m distinta de cero es divisor de cero si y solo si el máximo común divisor de m y ene es distinto de uno." },
      { k: "met", b: String.raw`<span class="rot">Compañero que anula</span> Si \(d=\mcd(m,n)&gt;1\), entonces \(\cl m\cdot\cl{n/d}=\cl0\), con \(\cl{n/d}\neq\cl0\).`,
        v: "Y además nos dice cómo encontrar el compañero que anula: si de es el máximo común divisor, multiplicamos m por ene sobre de, y el resultado es un múltiplo de ene, es decir, cero." },
      { k: "thm", b: String.raw`<span class="rot">Dicotomía</span> En \(\Z_n\), todo elemento no nulo es <b>o</b> unidad (\(\mcd=1\)) <b>o</b> divisor de cero (\(\mcd\neq1\)).`,
        v: "Consecuencia importante: en zeta sub ene, todo elemento no nulo es unidad o divisor de cero, y nunca ambas cosas. Si el máximo común divisor es uno, es unidad por la identidad de Bézout; si no, es divisor de cero." },
    ]},
    { t: "Ejemplo resuelto: \\(\\Z_{12}\\)", pasos: [
      { k: "txt", b: String.raw`<table class="tz"><tr><th>\(m\)</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td></tr><tr><th>\(\mcd(m,12)\)</th><td>1</td><td>2</td><td>3</td><td>4</td><td>1</td><td>6</td><td>1</td><td>4</td><td>3</td><td>2</td><td>1</td></tr></table>`,
        v: "Veamos zeta sub doce. Calculamos el máximo común divisor de cada m con doce, para m desde uno hasta once." },
      { k: "ej", b: String.raw`<span class="rot">Clasificación</span> Unidades: \(\cl1,\cl5,\cl7,\cl{11}\). &nbsp; Divisores de cero: \(\cl2,\cl3,\cl4,\cl6,\cl8,\cl9,\cl{10}\).`,
        v: "Donde el máximo común divisor es uno tenemos unidades: uno, cinco, siete y once. Todos los demás son divisores de cero: dos, tres, cuatro, seis, ocho, nueve y diez. Son cuatro unidades y siete divisores de cero, que suman los once elementos no nulos." },
      { k: "ej", b: String.raw`<span class="rot">Compañeros</span> \(\cl2\cl6=\cl3\cl4=\cl8\cl3=\cl9\cl4=\cl{10}\cl6=\cl0\). Inversos: \(5^2=25\equiv1,\ 7^2=49\equiv1\).`,
        v: "Podemos verificar con compañeros concretos: dos por seis, tres por cuatro, ocho por tres, nueve por cuatro y diez por seis dan cero módulo doce. Y las unidades son su propio inverso: cinco al cuadrado es veinticinco, que es uno módulo doce." },
    ]},
  ]
},
{
  n: 4, titulo: "Dominios finitos y cuerpos", vt: "Capítulo cuatro. Dominios finitos y cuerpos.",
  slides: [
    { t: "Todo dominio entero finito es un cuerpo", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Teorema 2.11</span> Todo dominio entero finito es un cuerpo.`,
        v: "Uno de los teoremas más importantes del módulo. Teorema dos punto once: todo dominio entero finito es un cuerpo." },
      { k: "txt", b: String.raw`<div class="prueba"><i>Prueba.</i> Sea \(b\neq0\) y \(\lambda_b(x)=bx\).<br>• <b>Inyectiva:</b> \(bx=by\Rightarrow x=y\) (cancelación).<br>• <b>Sobreyectiva:</b> inyectiva en un conjunto finito.<br>• Luego existe \(c\) con \(bc=1\): \(b\) es unidad.</div>`,
        v: "La prueba usa la función multiplicar por b, con b distinto de cero. Es inyectiva gracias a la cancelación. Como el dominio es finito, toda función inyectiva del conjunto en sí mismo es también sobreyectiva. Entonces el uno está en la imagen: existe c con b por c igual a uno, y b es unidad." },
      { k: "warn", b: String.raw`<span class="rot">Importante</span> La finitud es esencial: \(\Z\) es DI infinito y no es cuerpo.`,
        v: "La hipótesis de finitud es esencial: los enteros son un dominio entero infinito que no es cuerpo." },
    ]},
    { t: "\\(\\Z_n\\) es cuerpo \\(\\iff\\) \\(n\\) es primo", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Corolario 2.12</span> \(\Z_n\) es cuerpo \(\iff\) \(n\) es primo.`,
        v: "Corolario dos punto doce. Zeta sub ene es un cuerpo si y solo si ene es primo. Si ene es primo, el lema de Euclides impide los divisores de cero y aplicamos el teorema anterior. Si ene es compuesto, ene igual a ese por te da dos divisores de cero." },
      { k: "ej", b: String.raw`<span class="rot">Ejemplo en \(\Z_7\)</span> Multiplicar por \(\cl3\) permuta los no nulos: \[1\mapsto3,\ 2\mapsto6,\ 3\mapsto2,\ 4\mapsto5,\ 5\mapsto1,\ 6\mapsto4.\] El \(1\) es imagen de \(5\): \(\cl3^{-1}=\cl5\).`,
        v: "Así se ve la prueba en zeta sub siete. Multiplicar por tres envía uno en tres, dos en seis, tres en dos, cuatro en cinco, cinco en uno y seis en cuatro. Es una permutación, y como el uno es la imagen del cinco, el inverso de tres es cinco." },
    ]},
    { t: "Ejemplo: \\(\\Z_3[i]\\) frente a \\(\\Z_5[i]\\)", pasos: [
      { k: "ej", b: String.raw`<span class="rot">\(\Z_5[i]\) no es DI</span> \((2+i)(2-i)=4-i^2=5=0\).`,
        v: "Un ejemplo que suele aparecer en exámenes. Considera los anillos zeta sub pe de i, con a más b i y coeficientes módulo pe. En zeta sub cinco de i, dos más i por dos menos i es cuatro más uno, que es cinco, es decir cero. Hay divisores de cero." },
      { k: "ej", b: String.raw`<span class="rot">\(\Z_3[i]\) es cuerpo</span> \((a+bi)(a-bi)=a^2+b^2\), y en \(\Z_3\) los cuadrados son \(0\) y \(1\): \(a^2+b^2=0\iff a=b=0\). Luego \[(a+bi)^{-1}=(a^2+b^2)^{-1}(a-bi).\]`,
        v: "En cambio, zeta sub tres de i es un cuerpo con nueve elementos. Multiplicando por el conjugado obtenemos a cuadrado más b cuadrado. En zeta sub tres los cuadrados solo valen cero o uno, así que esa suma es cero únicamente si a y b son cero. Por tanto, todo elemento no nulo tiene inverso." },
    ]},
  ]
},
{
  n: 5, titulo: "Irreducibles, primos y la norma", vt: "Capítulo cinco. Irreducibles, primos y la norma.",
  slides: [
    { t: "Asociados, irreducibles y primos", pasos: [
      { k: "def", b: String.raw`<span class="rot">Asociados (2.13)</span> \(a=ub\) con \(u\) unidad.`,
        v: "Trabajamos ahora en un dominio entero. Dos elementos son asociados si uno es el otro multiplicado por una unidad. En los enteros, a es asociado de menos a." },
      { k: "def", b: String.raw`<span class="rot">Irreducible (2.14)</span> \(a\neq0\), no unidad, y \(a=bc\Rightarrow b\) o \(c\) es unidad.`,
        v: "Un elemento no nulo y que no es unidad es irreducible si en cualquier factorización a igual a b por c, alguno de los factores es unidad. Es decir, no se puede partir en factores no triviales." },
      { k: "def", b: String.raw`<span class="rot">Primo (2.15)</span> \(a\neq0\), no unidad, y \(a\mid bc\Rightarrow a\mid b\) o \(a\mid c\).`,
        v: "Y es primo si cada vez que divide a un producto, divide a alguno de los factores. Irreducible habla de cómo se factoriza el elemento; primo habla de cómo divide a los productos." },
    ]},
    { t: "Primo implica irreducible", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Teorema 2.17</span> En un dominio entero, todo primo es irreducible.`,
        v: "Teorema dos punto diecisiete. En un dominio entero, todo elemento primo es irreducible." },
      { k: "txt", b: String.raw`<div class="prueba"><i>Prueba.</i> \(a=bc\Rightarrow a\mid bc\Rightarrow a\mid b\) (por ejemplo), \(b=ad\). Entonces \(b=ad=bcd\Rightarrow 1=cd\) cancelando \(b\). Así \(c\) es unidad.</div>`,
        v: "Si a es igual a b por c, entonces a divide al producto, y por ser primo divide, digamos, a b. Escribimos b igual a a por d. Sustituyendo, b es igual a b por c por d, y cancelando b obtenemos que c por d es uno. Así c es una unidad." },
      { k: "warn", b: String.raw`<span class="rot">El recíproco es falso</span> En \(\Z\) coinciden, pero hay dominios con irreducibles que no son primos.`,
        v: "Cuidado: el recíproco es falso en general. En los enteros, primo e irreducible coinciden, pero veremos un dominio donde no." },
    ]},
    { t: "La norma en \\(\\Z[\\sqrt d]\\)", pasos: [
      { k: "def", b: String.raw`<span class="rot">Norma</span> \(N(a+b\sqrt d)=|a^2-db^2|\). Por ejemplo, en \(\Z[i]\): \(a^2+b^2\); en \(\Z[\sqrt{-3}]\): \(a^2+3b^2\).`,
        v: "La herramienta para estos dominios es la norma. En zeta de raíz de de, la norma de a más b raíz de de es el valor absoluto de a cuadrado menos de por b cuadrado. En los enteros gaussianos queda a cuadrado más b cuadrado." },
      { k: "thm", b: String.raw`<span class="rot">Proposición 2.18</span> (1) \(N(x)=0\iff x=0\). (2) \(N(xy)=N(x)N(y)\). (3) \(N(x)=1\iff x\) es unidad. (4) \(N(x)\) primo \(\Rightarrow x\) irreducible.`,
        v: "Sus propiedades clave: la norma es multiplicativa, vale uno exactamente en las unidades, y si la norma de un elemento es un número primo, el elemento es irreducible. Ojo: el recíproco de esta última es falso. El tres tiene norma nueve en los gaussianos y aun así es irreducible." },
    ]},
    { t: "Irreducible pero no primo: \\(2\\) en \\(\\Z[\\sqrt{-3}]\\)", pasos: [
      { k: "ej", b: String.raw`<span class="rot">Paso 1: es irreducible</span> \(N(2)=4\). Si \(2=xy\) sin unidades, \(N(x)=N(y)=2\); pero \(a^2+3b^2=2\) no tiene solución.`,
        v: "Ejemplo central. En zeta de raíz de menos tres, el dos tiene norma cuatro. Si se factorizara en dos no unidades, ambas tendrían norma dos. Pero a cuadrado más tres b cuadrado nunca vale dos: con b cero queda a cuadrado igual a dos, y con b distinto de cero ya es al menos tres. Luego el dos es irreducible." },
      { k: "ej", b: String.raw`<span class="rot">Paso 2: no es primo</span> \(2\mid(1+\sqrt{-3})(1-\sqrt{-3})=4\), pero \(\frac{1\pm\sqrt{-3}}{2}\notin\Z[\sqrt{-3}]\).`,
        v: "Pero no es primo. El dos divide al producto uno más raíz de menos tres por uno menos raíz de menos tres, que es cuatro. Sin embargo, no divide a ninguno de los factores, porque al dividir obtendríamos coeficientes un medio, que no son enteros." },
      { k: "met", b: String.raw`<span class="rot">Método</span> Irreducible: norma y ecuación sin solución. &nbsp; No primo: producto de conjugados que es múltiplo, y división con coeficientes no enteros.`,
        v: "Este es el método para el examen. Para irreducibilidad, usa la norma y muestra que las normas intermedias son imposibles. Para ver que no es primo, busca un producto de conjugados que sea múltiplo del elemento, y muestra que no divide a los factores. El mismo esquema funciona con el dos en zeta de raíz de menos cinco." },
    ]},
  ]
},
{
  n: 6, titulo: "Característica de un anillo", vt: "Capítulo seis. Característica de un anillo.",
  slides: [
    { t: "Definición y cálculo", pasos: [
      { k: "def", b: String.raw`<span class="rot">Definición 2.20</span> \(\car(R)\) es el menor \(n&gt;0\) con \(n\cdot x=0\) para todo \(x\). Si no existe, \(\car(R)=0\).`,
        v: "La característica de un anillo es el menor entero positivo ene tal que ene por x es cero para todo x. Si no existe tal ene, la característica es cero." },
      { k: "met", b: String.raw`<span class="rot">Teorema 2.23</span> Con identidad, basta mirar el \(1\): \(\car(R)\) es el orden aditivo de \(1\).<br>\(\car(\Z)=0,\quad\car(\Z_n)=n,\quad\car(\Z_4\oplus\Z_6)=\mcm(4,6)=12.\)`,
        v: "Si el anillo tiene identidad, basta mirar el uno: la característica es el número de veces que hay que sumar el uno para obtener cero. Los enteros tienen característica cero, zeta sub ene tiene característica ene, y zeta sub cuatro por zeta sub seis tiene característica doce, el mínimo común múltiplo." },
    ]},
    { t: "Característica de un dominio entero", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Teorema 2.25</span> La característica de un dominio entero es \(0\) o un número primo.`,
        v: "Teorema dos punto veinticinco. La característica de un dominio entero es cero o un número primo." },
      { k: "txt", b: String.raw`<div class="prueba"><i>Prueba.</i> Si \(n=st\) con \(1&lt;s,t&lt;n\): \(0=n\cdot1=(s\cdot1)(t\cdot1)\). Sin divisores de cero, \(s\cdot1=0\) o \(t\cdot1=0\): contradice la minimalidad de \(n\).</div>`,
        v: "Si la característica ene fuera compuesta, ene igual a ese por te, entonces cero sería ene por uno, que es ese por uno multiplicado por te por uno. Como no hay divisores de cero, alguno de esos factores sería cero, contradiciendo que ene es el mínimo." },
      { k: "ej", b: String.raw`<span class="rot">Consecuencias</span> No existe un DI de característica \(6\), \(10\) o \(15\). Todo DI finito tiene característica prima; por ejemplo, \(\car(\Z_3[i])=3\).`,
        v: "Consecuencias: no existe un dominio entero de característica seis, diez o quince. Y todo dominio entero finito tiene característica prima. Por ejemplo, zeta sub tres de i tiene nueve elementos pero característica tres. No confundas la característica con el número de elementos." },
    ]},
  ]
},
{
  n: 7, titulo: "Ideales: definición y test", vt: "Capítulo siete. Ideales: definición y test.",
  slides: [
    { t: "Definición de ideal", pasos: [
      { k: "def", b: String.raw`<span class="rot">Definición 3.1</span> Un subanillo \(I\) de \(R\) es un <b>ideal</b> si \(ra\in I\) para todo \(r\in R\), \(a\in I\). (Absorbe la multiplicación).`,
        v: "Entramos al módulo tres. Un ideal es un subanillo que absorbe la multiplicación: si a está en el ideal y r es cualquier elemento del anillo, el producto r por a sigue en el ideal." },
      { k: "thm", b: String.raw`<span class="rot">Teorema 3.2 (test del ideal)</span> \(I\neq\varnothing\) es ideal \(\iff\) para todo \(a,b\in I\), \(r\in R\): \[a-b\in I \quad\text{y}\quad ra\in I.\]`,
        v: "En la práctica se usa el test del ideal, teorema tres punto dos. Un subconjunto no vacío es ideal si y solo si es cerrado bajo restas y absorbe productos por cualquier elemento del anillo." },
      { k: "warn", b: String.raw`<span class="rot">Error frecuente</span> Verificar \(ra\in I\) solo con \(r\in I\): eso prueba que es subanillo, no ideal. \(r\) recorre <b>todo</b> \(R\).`,
        v: "El error más frecuente es verificar la absorción solo con elementos del propio ideal. Eso demuestra que es un subanillo, no un ideal. El factor r tiene que recorrer todo el anillo." },
    ]},
    { t: "Ejemplos y contraejemplos", pasos: [
      { k: "ej", b: String.raw`<span class="rot">Sí son ideales</span> \(\{0\}\) y \(R\). \(n\Z\) en \(\Z\): \(nx-ny=n(x-y)\), \(r(nx)=n(rx)\). Matrices con entradas pares en \(M_2(\Z)\).`,
        v: "Ejemplos: el ideal cero y el propio anillo siempre son ideales. Los múltiplos de ene forman un ideal de los enteros: la resta de múltiplos es múltiplo, y un entero por un múltiplo de ene es múltiplo de ene. También las matrices con entradas pares son un ideal de las matrices enteras." },
      { k: "warn", b: String.raw`<span class="rot">No son ideales</span> \(\Z\subseteq\Q\): \(\tfrac12\cdot1\notin\Z\). Los impares en \(\Z\): \(3-1=2\). \(\N\) en \(\Z\): \((-1)\cdot1\notin\N\).`,
        v: "Contraejemplos: los enteros son subanillo de los racionales, pero no ideal, porque un medio por uno no es entero. Los impares no son ideal, porque tres menos uno es par. Y los naturales tampoco, porque menos uno por uno es negativo." },
    ]},
    { t: "El ideal unidad", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Lema 3.7</span> Si \(R\) tiene identidad: \(1\in I\iff I=R\). Más en general, si \(I\) contiene una unidad, \(I=R\).`,
        v: "Lema tres punto siete: si un ideal contiene al uno, es todo el anillo, porque cualquier a es a por uno. Y si contiene una unidad u, también contiene al uno, que es u inverso por u." },
      { k: "thm", b: String.raw`<span class="rot">Consecuencia</span> \(R\) conmutativo con identidad es cuerpo \(\iff\) sus únicos ideales son \(\{0\}\) y \(R\).`,
        v: "De aquí sale una caracterización muy útil: un anillo conmutativo con identidad es cuerpo si y solo si sus únicos ideales son el cero y el anillo. Si a es no nulo, el ideal generado por a tiene que ser todo el anillo, así que uno es r por a, y a es unidad." },
    ]},
  ]
},
{
  n: 8, titulo: "Ideal generado y operaciones", vt: "Capítulo ocho. Ideal generado y operaciones.",
  slides: [
    { t: "Ideal generado e ideales principales", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Teorema 3.8</span> \(\gen{a_1,\dots,a_n}=\{x_1a_1+\cdots+x_na_n: x_i\in R\}\) es el menor ideal que contiene a los \(a_i\).`,
        v: "El ideal generado por a uno hasta a ene es el conjunto de todas sus combinaciones con coeficientes en el anillo. Es el menor ideal que los contiene." },
      { k: "def", b: String.raw`<span class="rot">Definiciones 3.10 y 3.11</span> <b>Principal:</b> \(I=\gen a\). <b>DIP:</b> dominio donde todo ideal es principal.`,
        v: "Un ideal es principal si lo genera un solo elemento. Y un dominio de ideales principales es un dominio en el que todos los ideales son principales." },
      { k: "thm", b: String.raw`<span class="rot">\(\Z\) es DIP</span> Si \(I\neq\{0\}\), sea \(n\) el menor positivo de \(I\). Para \(a\in I\): \(a=qn+r\), \(r=a-qn\in I\), \(0\le r&lt;n\Rightarrow r=0\). Luego \(I=\gen n\).`,
        v: "Los enteros son un dominio de ideales principales. Tomamos el menor positivo ene del ideal. Si a está en el ideal, el resto de dividir a entre ene también está, y es menor que ene, así que es cero. Por tanto el ideal es el generado por ene." },
    ]},
    { t: "Contener es dividir", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Lema 3.14</span> En un DI: \(\gen a\subseteq\gen b\iff b\mid a\); \(\ \gen a=\gen b\iff a,b\) asociados; \(\ \gen a=D\iff a\) unidad.`,
        v: "Lema tres punto catorce. En un dominio entero, el ideal generado por a está contenido en el generado por b si y solo si b divide a a. Son iguales si y solo si a y b son asociados. Y el ideal generado por a es todo el dominio si y solo si a es unidad." },
      { k: "met", b: String.raw`<span class="rot">Regla</span> El ideal <b>grande</b> corresponde al divisor <b>pequeño</b>: \(\gen8\subseteq\gen4\subseteq\gen2\), y \(\gen2=\gen{-2}\).`,
        v: "Regla mnemotécnica: contener es dividir. El ideal grande corresponde al divisor pequeño. El ideal de ocho está dentro del de cuatro, que está dentro del de dos. Y el ideal de dos es igual al de menos dos." },
    ]},
    { t: "Operaciones con ideales en \\(\\Z\\)", pasos: [
      { k: "def", b: String.raw`<span class="rot">Operaciones</span> \(I+J=\{i+j\}\), \(\ IJ=\{\textstyle\sum i_kj_k\}\), \(\ I\cap J\). Todas son ideales y \(IJ\subseteq I\cap J\).`,
        v: "Con dos ideales podemos formar la suma, el producto, que son sumas finitas de productos, y la intersección. Las tres son ideales, y el producto siempre está contenido en la intersección." },
      { k: "thm", b: String.raw`<span class="rot">En \(\Z\)</span> \(\gen m+\gen n=\gen{\mcd}\), \(\ \gen m\cap\gen n=\gen{\mcm}\), \(\ \gen m\gen n=\gen{mn}\).`,
        v: "En los enteros hay fórmulas directas: la suma corresponde al máximo común divisor, la intersección al mínimo común múltiplo, y el producto al producto." },
      { k: "ej", b: String.raw`<span class="rot">Ejemplo</span> \(\gen4+\gen6=\gen2\), \(\ \gen4\cap\gen6=\gen{12}\), \(\ \gen4\gen6=\gen{24}\subsetneq\gen{12}\). La unión \(\gen2\cup\gen3\) <b>no</b> es ideal: \(3-2=1\).`,
        v: "Ejemplo con cuatro y seis: la suma es el ideal de dos, la intersección el de doce y el producto el de veinticuatro, estrictamente menor que la intersección. Y atención: la unión de ideales no es ideal en general. Dos y tres están en la unión, pero su diferencia, uno, no." },
    ]},
  ]
},
{
  n: 9, titulo: "Ideales primos y maximales", vt: "Capítulo nueve. Ideales primos y maximales.",
  slides: [
    { t: "Definiciones", pasos: [
      { k: "def", b: String.raw`<span class="rot">Ideal primo (3.17)</span> \(P\neq R\) y \(ab\in P\Rightarrow a\in P\) o \(b\in P\).`,
        v: "Un ideal propio pe es primo si cada vez que un producto a por b está en pe, alguno de los factores está en pe. En los enteros, el ideal generado por un primo es primo, por el lema de Euclides. El ideal de seis no lo es: dos por tres está en él, pero ni dos ni tres." },
      { k: "def", b: String.raw`<span class="rot">Ideal maximal (3.18)</span> \(M\neq R\) y no hay ideal \(A\) con \(M\subsetneq A\subsetneq R\).`,
        v: "Un ideal propio eme es maximal si no hay ningún ideal estrictamente entre eme y el anillo completo." },
      { k: "met", b: String.raw`<span class="rot">Criterio práctico</span> \(M\) maximal \(\iff\) para todo \(a\notin M\): \(M+\gen a=R\), es decir, \(1=m+ra\).`,
        v: "Un criterio práctico: eme es maximal si y solo si, para cualquier a fuera de eme, al agregarle a obtenemos todo el anillo. Es decir, uno se escribe como un elemento de eme más un múltiplo de a." },
    ]},
    { t: "Maximal implica primo", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Teorema</span> En un anillo conmutativo con identidad, todo ideal maximal es primo.`,
        v: "Teorema: en un anillo conmutativo con identidad, todo ideal maximal es primo." },
      { k: "txt", b: String.raw`<div class="prueba"><i>Prueba.</i> \(ab\in M\), \(a\notin M\). Por el criterio, \(1=m+ra\). Multiplicando por \(b\): \[b=mb+r(ab)\in M.\]</div>`,
        v: "Supongamos que a por b está en eme y que a no está. Por el criterio, uno es m más r por a. Multiplicamos por b: b es igual a m por b más r por a b. Los dos sumandos están en eme por absorción, así que b está en eme." },
      { k: "warn", b: String.raw`<span class="rot">El recíproco es falso</span> \(\{0\}\) es primo en \(\Z\) (es DI), pero \(\{0\}\subsetneq\gen2\subsetneq\Z\): no es maximal.`,
        v: "El recíproco es falso. El ideal cero es primo en los enteros, porque los enteros son un dominio entero, pero no es maximal: el ideal de dos está estrictamente entre él y los enteros. En anillos finitos, en cambio, primo y maximal coinciden." },
    ]},
    { t: "Conexiones clave", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Proposición 3.22</span> En un DI, \(\gen p\) es primo \(\iff\) \(p\) es elemento primo.`,
        v: "Proposición tres punto veintidós: en un dominio entero, el ideal generado por pe es primo si y solo si pe es un elemento primo. Ser divisible por pe es lo mismo que pertenecer al ideal generado por pe." },
      { k: "thm", b: String.raw`<span class="rot">En \(\Z\)</span> Para \(n\ge2\): \(\gen n\) maximal \(\iff\) \(\gen n\) primo \(\iff\) \(n\) primo.`,
        v: "En los enteros, para ene mayor o igual que dos, el ideal de ene es maximal si y solo si es primo, si y solo si ene es primo. Los ideales entre el de ene y los enteros corresponden a los divisores de ene." },
      { k: "obs", b: String.raw`<span class="rot">Adelanto del Módulo 4</span> \(I\) primo \(\iff R/I\) es DI; \(\ I\) maximal \(\iff R/I\) es cuerpo.`,
        v: "Y un adelanto del módulo cuatro: un ideal es primo si y solo si el cociente es dominio entero, y es maximal si y solo si el cociente es cuerpo." },
    ]},
  ]
},
{
  n: 10, titulo: "Ejemplos integradores", vt: "Capítulo diez. Ejemplos integradores.",
  slides: [
    { t: "Todos los ideales de \\(\\Z_{12}\\)", pasos: [
      { k: "thm", b: String.raw`<span class="rot">Ideales de \(\Z_n\)</span> Son \(\gen{\cl d}\) con \(d\mid n\), con \(n/d\) elementos. \(\gen{\cl d}\subseteq\gen{\cl e}\iff e\mid d\). Maximal \(\iff\) primo \(\iff d\) primo.`,
        v: "Los ideales de zeta sub ene son exactamente los generados por los divisores de ene. El ideal de de tiene ene sobre de elementos, la contención vuelve a ser divisibilidad, y los maximales, que coinciden con los primos, son los de divisor primo." },
      { k: "txt", b: String.raw`<div class="dos"><div><table class="tz"><tr><th>Ideal</th><th>Elementos</th></tr><tr><td>\(\gen{\cl2}\)</td><td>0,2,4,6,8,10</td></tr><tr><td>\(\gen{\cl3}\)</td><td>0,3,6,9</td></tr><tr><td>\(\gen{\cl4}\)</td><td>0,4,8</td></tr><tr><td>\(\gen{\cl6}\)</td><td>0,6</td></tr><tr><td>\(\gen{\cl0}\)</td><td>0</td></tr></table></div>
<div><svg width="460" height="349" viewBox="0 0 330 250" font-family="DejaVu Sans, sans-serif" font-size="17"><g stroke="#1f3a5f" stroke-width="2"><line x1="165" y1="34" x2="95" y2="86"/><line x1="165" y1="34" x2="235" y2="86"/><line x1="95" y1="114" x2="60" y2="156"/><line x1="95" y1="114" x2="165" y2="156"/><line x1="235" y1="114" x2="165" y2="156"/><line x1="60" y1="184" x2="165" y2="216"/><line x1="165" y1="184" x2="165" y2="216"/></g><g text-anchor="middle"><rect x="115" y="6" width="100" height="30" rx="5" fill="#fff" stroke="#1f3a5f"/><text x="165" y="27">ℤ₁₂</text><rect x="60" y="86" width="70" height="30" rx="5" fill="#dff3e6" stroke="#2f855a"/><text x="95" y="107">⟨2⟩</text><rect x="200" y="86" width="70" height="30" rx="5" fill="#dff3e6" stroke="#2f855a"/><text x="235" y="107">⟨3⟩</text><rect x="25" y="156" width="70" height="30" rx="5" fill="#fff" stroke="#1f3a5f"/><text x="60" y="177">⟨4⟩</text><rect x="130" y="156" width="70" height="30" rx="5" fill="#fff" stroke="#1f3a5f"/><text x="165" y="177">⟨6⟩</text><rect x="130" y="214" width="70" height="30" rx="5" fill="#fff" stroke="#1f3a5f"/><text x="165" y="235">⟨0⟩</text></g></svg></div></div>`,
        v: "Para zeta sub doce, los divisores de doce dan seis ideales. Además del anillo completo: el de dos, con seis elementos; el de tres, con cuatro; el de cuatro, con tres; el de seis, con dos; y el cero. En el diagrama, cada línea indica contención." },
      { k: "ej", b: String.raw`<span class="rot">Clasificación</span> Maximales y primos: \(\gen{\cl2}\), \(\gen{\cl3}\). No primos: \(\cl2\cl2\in\gen{\cl4}\), \(\cl2\cl3\in\gen{\cl6}\), \(\cl2\cl6=\cl0\).`,
        v: "Los maximales son el de dos y el de tres, y también son los primos. Los demás no son primos: dos por dos está en el ideal de cuatro sin que dos esté; dos por tres está en el de seis; y dos por seis es cero, así que el ideal cero tampoco es primo." },
    ]},
    { t: "Ideales en \\(\\Z[i]\\): \\(\\gen2\\subsetneq\\gen{1+i}\\subsetneq\\Z[i]\\)", pasos: [
      { k: "ej", b: String.raw`<span class="rot">Paso 1</span> \(2=(1+i)(1-i)\in\gen{1+i}\). Estricta: \(1+i\notin\gen2\). Propio: \(N(1+i)=2\neq1\).`,
        v: "Segundo ejemplo, en los enteros gaussianos. Como dos es uno más i por uno menos i, el ideal de dos está dentro del ideal de uno más i. La contención es estricta, porque uno más i no tiene coeficientes pares. Y el ideal de uno más i es propio, porque su norma es dos, así que no es unidad." },
      { k: "ej", b: String.raw`<span class="rot">Paso 2</span> \(a+bi\in\gen{1+i}\iff a+b\) es par, pues \((1+i)(c+di)=(c-d)+(c+d)i\).`,
        v: "Además, a más b i está en el ideal de uno más i exactamente cuando a más b es par, porque los múltiplos de uno más i tienen suma de coeficientes igual a dos c." },
      { k: "ej", b: String.raw`<span class="rot">Paso 3</span> Si \(A\supsetneq\gen{1+i}\), contiene \(a+bi\) con \(a+b\) impar, y \(1=(a+bi)-((a-1)+bi)\in A\). Luego \(\gen{1+i}\) es <b>maximal</b> y \(\gen2\) no lo es.`,
        v: "Si un ideal contiene estrictamente al de uno más i, tiene algún elemento con suma impar. Restándole el elemento de suma par a menos uno más b i, obtenemos el uno. Por tanto el ideal de uno más i es maximal, y el ideal de dos no lo es. Este es justamente el ítem diecinueve de la práctica." },
    ]},
  ]
},
{
  n: 11, titulo: "Estrategia para el parcial", vt: "Capítulo once. Estrategia para el parcial.",
  slides: [
    { t: "Métodos que debes dominar", pasos: [
      { k: "met", b: String.raw`<span class="rot">Módulo 2</span> DI: \(ab=0\Rightarrow a=0\) o \(b=0\). &nbsp; \(\Z_n\): \(\mcd(m,n)\). &nbsp; Finito + DI \(\Rightarrow\) cuerpo. &nbsp; Irreducible: norma. &nbsp; Característica: orden de \(1\).`,
        v: "Repasemos los métodos. Para dominios enteros: prueba que a por b igual a cero obliga a que uno de los factores sea cero. En zeta sub ene, todo se decide con el máximo común divisor. Si el anillo es finito, dominio entero implica cuerpo. Para irreducibilidad, usa la norma. Y la característica es el orden aditivo del uno." },
      { k: "met", b: String.raw`<span class="rot">Módulo 3</span> Ideal: test (\(a-b\), \(ra\) con \(r\in R\)). &nbsp; \(I=R\): busca \(1\). &nbsp; En \(\Z\): mcd y mcm. &nbsp; Primo: \(ab\in P\). &nbsp; Maximal: \(1=m+ra\) o ideal intermedio.`,
        v: "Para ideales: usa el test con r arbitrario en el anillo. Para ver si un ideal es todo el anillo, busca el uno o una unidad. En los enteros, suma e intersección se calculan con el máximo común divisor y el mínimo común múltiplo. Para probar maximalidad, construye el uno; para refutarla, exhibe un ideal intermedio." },
    ]},
    { t: "Cinco contraejemplos que debes saber", pasos: [
      { k: "warn", b: String.raw`<ol class="agenda compacta"><li>DI \(\not\Rightarrow\) cuerpo: \(\Z\).</li><li>Irreducible \(\not\Rightarrow\) primo: \(2\) en \(\Z[\sqrt{-3}]\).</li><li>Subanillo \(\not\Rightarrow\) ideal: \(\Z\subseteq\Q\).</li><li>Primo \(\not\Rightarrow\) maximal: \(\{0\}\subseteq\Z\).</li><li>Unión de ideales \(\not\Rightarrow\) ideal: \(\gen2\cup\gen3\).</li></ol>`,
        v: "Memoriza estos cinco contraejemplos, porque aparecen en casi todos los parciales. Dominio entero no implica cuerpo: los enteros. Irreducible no implica primo: el dos en zeta de raíz de menos tres. Subanillo no implica ideal: los enteros dentro de los racionales. Primo no implica maximal: el ideal cero en los enteros. Y la unión de ideales no es ideal: el de dos unido con el de tres." },
    ]},
    { t: "Próximos pasos", pasos: [
      { k: "txt", b: String.raw`<div class="cierre"><div class="paso"><b>1</b> Guía AL2-M23-01: teoría completa y 31 ejercicios</div><div class="paso"><b>2</b> Práctica AL2-M23-02: 120 minutos, sin consultar</div><div class="paso"><b>3</b> Solucionario AL2-M23-03: corrige con la rúbrica</div><div class="paso"><b>4</b> Repasa según el diagnóstico del Apéndice A</div></div>`,
        v: "Para terminar, te recomendamos este orden. Estudia la guía y resuelve sus ejercicios. Luego haz la práctica en ciento veinte minutos, sin consultar nada. Corrígela con la rúbrica del solucionario, y usa su apéndice de diagnóstico para saber qué capítulos de este video y qué secciones de la guía repasar. Mucho éxito en el parcial." },
    ]},
  ]
},
];
if (typeof module !== "undefined") module.exports = ESCENAS;
