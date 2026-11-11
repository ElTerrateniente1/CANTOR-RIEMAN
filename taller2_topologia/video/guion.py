"""Guion del video: cada cuadro tiene un título, el bloque al que pertenece, el
cuerpo en LaTeX (beamer, con superposiciones <n->) y una lista de narraciones,
una por cada superposición. La narración está escrita «como se pronuncia»
(tau, equis, be, ce, de...) porque la lee un sintetizador de voz.
"""

CUADROS = []


def cuadro(titulo, bloque, tex, voz):
    CUADROS.append(dict(titulo=titulo, bloque=bloque, tex=tex.strip("\n"), voz=[v.strip() for v in voz]))


# ---------------------------------------------------------------- 1
cuadro("", "Presentación", r"""
\vspace*{10mm}
\begin{center}
{\small\color{black!60} UNIVERSIDAD DE PANAMÁ · FACINET · LICENCIATURA EN MATEMÁTICA}\\[9mm]
{\Huge\bfseries\color{tinta} Topología · Taller 2}\\[4mm]
{\Large Explicación paso a paso: la teoría y los ejercicios}\\[2mm]
{\large\color{black!65} Material de estudio para el parcial}\\[10mm]
{\small\color{black!60} Acompaña a dos documentos: la solución completa del taller y la guía de estudio}
\end{center}
""", [
    "Topología, módulo dos. En este video repasamos, paso a paso, la teoría que hay detrás del taller dos, "
    "y la aplicamos a sus ejercicios, pensando en el examen parcial.",
])

# ---------------------------------------------------------------- 2
cuadro("Ruta del video", "Presentación", r"""
\begin{columns}[T]
\begin{column}{0.56\linewidth}
\begin{enumerate}\setlength{\itemsep}{1.6mm}
\item Qué es una topología y cómo se verifica
\item Cerrados, vecindades y el \textbf{abierto mínimo}
\item Derivado, clausura, interior y frontera
\item Conjuntos densos y subespacios
\item Topologías pequeñas y su comparación
\item Bases, sub-bases y topología generada
\item Continuidad, funciones abiertas y cerradas, homeomorfismos
\end{enumerate}
\end{column}
\begin{column}{0.40\linewidth}
\uncover<2->{\caja[ambar]{0.92\linewidth}{\etiqueta[ambar]{Para profundizar}
Cada tema está desarrollado en los dos PDF: la \textbf{solución} (todos los ejercicios) y la \textbf{guía de
estudio} (teoría, métodos, recetario y autoevaluación).}}
\end{column}
\end{columns}
""", [
    "El recorrido tiene siete bloques. Primero, qué es una topología y cómo se verifica. Después, los cerrados, "
    "las vecindades y el abierto mínimo, que es la herramienta clave. Luego, el derivado, la clausura, el interior "
    "y la frontera. Seguimos con los conjuntos densos y los subespacios, las topologías pequeñas y su comparación, "
    "las bases y las sub bases. Y terminamos con continuidad, funciones abiertas y cerradas, y homeomorfismos.",
    "Todo lo que se dice aquí está desarrollado con más detalle en los dos documentos que acompañan al video: "
    "la solución completa del taller, y la guía de estudio.",
])

# ---------------------------------------------------------------- 3
cuadro("¿Qué es una topología?", "1 · Topologías", r"""
\caja{0.94\linewidth}{\etiqueta{Definición}
Una \textbf{topología} sobre $X$ es una familia $\tau$ de subconjuntos de $X$ (los \emph{abiertos}) tal que:\\[1mm]
\textbf{(T1)}\ \ $\vac\in\tau$ \ y \ $X\in\tau$;\\
\textbf{(T2)}\ \ la unión de \emph{cualquier} cantidad de miembros de $\tau$ está en $\tau$;\\
\textbf{(T3)}\ \ la intersección de \emph{dos} (y por tanto de finitos) miembros de $\tau$ está en $\tau$.}

\vspace{2mm}
\uncover<2->{\caja[ambar]{0.94\linewidth}{\etiqueta[ambar]{¿Por qué solo intersecciones finitas?}
En $\R$: \ $U_n=\left(-\tfrac1n,\tfrac1n\right)$ es abierto para todo $n$, pero
$\displaystyle\bigcap_{n\ge1}U_n=\{0\}$ no es abierto.}}

\vspace{2mm}
\uncover<3->{\textbf{Extremos:}\quad indiscreta $\{\vac,X\}$ \ $\subseteq$ \ cualquier topología $\tau$ \ $\subseteq$ \ discreta $\mathcal{P}(X)$}
""", [
    "Una topología sobre un conjunto equis es una familia tau de subconjuntos de equis, a los que llamamos abiertos, "
    "que cumple tres condiciones. Uno: el vacío y equis están en tau. Dos: la unión de cualquier cantidad de abiertos "
    "es un abierto. Tres: la intersección de dos abiertos es un abierto, y por lo tanto, la de cualquier cantidad finita.",
    "¿Por qué solo intersecciones finitas? Porque así ocurre en la recta real. Los intervalos abiertos, de menos uno "
    "sobre ene, a uno sobre ene, son todos abiertos. Pero su intersección es solamente el punto cero, que no es abierto.",
    "Los ejemplos extremos son la topología indiscreta, que solo tiene al vacío y a equis, y la discreta, en la que "
    "todo subconjunto es abierto. Cualquier otra topología sobre equis queda entre las dos.",
])

# ---------------------------------------------------------------- 4
cuadro("Cómo verificar una familia finita", "1 · Topologías", r"""
\caja[black]{0.94\linewidth}{\etiqueta[black]{Método}
\begin{enumerate}\setlength{\itemsep}{0.8mm}
\item ¿Están $\vac$ y $X$ en la lista?
\item Uniones e intersecciones \textbf{de dos en dos} (basta, porque la familia es finita).
\item Atajo: si $A\subseteq B$, entonces $A\cup B=B$ y $A\cap B=A$. Solo importan los pares \textbf{no comparables}.
\end{enumerate}}

\vspace{3mm}
\uncover<2->{
\begin{columns}[T]
\begin{column}{0.46\linewidth}
\caja[rojo]{0.95\linewidth}{\etiqueta[rojo]{Para decir que NO}
Basta \textbf{un} par que falle.\\ Ese par es la respuesta.}
\end{column}
\begin{column}{0.46\linewidth}
\caja[verde]{0.95\linewidth}{\etiqueta[verde]{Para decir que SÍ}
Hay que revisar \textbf{todos} los pares, con las dos operaciones.}
\end{column}
\end{columns}}
""", [
    "En un conjunto finito, verificar es mecánico. Primero se comprueba que estén el vacío y equis. Después se revisan "
    "las uniones y las intersecciones de dos en dos. Basta de dos en dos, porque la familia es finita. Y hay un atajo: "
    "si un conjunto está contenido en otro, su unión es el grande y su intersección es el pequeño. Así que solo hay que "
    "mirar los pares no comparables.",
    "Atención a la lógica. Para concluir que no es topología, basta un solo par que falle, y ese par es la respuesta. "
    "Para concluir que sí lo es, hay que revisar todos los pares, con las dos operaciones.",
])

# ---------------------------------------------------------------- 5
cuadro(r"Parte I: $X=\{a,b,c,d,e\}$", "1 · Topologías", r"""
\renewcommand{\arraystretch}{1.45}
\begin{tabular}{@{}l@{\qquad}l@{}}
$\tau_1=\{X,\vac,\s{a},\s{c,d},\s{a,c,d},\s{b,c,d,e}\}$ & \ok\ \ \textcolor{verde}{topología}\\
\uncover<2->{$\tau_2=\{X,\vac,\s{a},\s{c,d},\s{a,c,d},\s{b,c,d}\}$} & \uncover<2->{\mal\ \ \textcolor{rojo}{falla una unión}}\\
\uncover<3->{$\tau_3=\{X,\vac,\s{a},\s{c,d},\s{a,c,d},\s{a,b,d,e}\}$} & \uncover<3->{\mal\ \ \textcolor{rojo}{falla una intersección}}\\
\uncover<4->{$\tau_4=\{X,\vac,\s{a},\s{b,e},\s{a,b,e},\s{b,c,d,e}\}$} & \uncover<4->{\ok\ \ \textcolor{verde}{topología}}
\end{tabular}

\vspace{4mm}
\only<1>{\caja[verde]{0.92\linewidth}{\etiqueta[verde]{Pares no comparables de $\tau_1$}
$\s{a}\cup\s{c,d}=\s{a,c,d}$\qquad $\s{a}\cup\s{b,c,d,e}=X$\qquad $\s{a,c,d}\cap\s{b,c,d,e}=\s{c,d}$\\[1mm]
Todos los resultados están en la lista: $\tau_1$ \textbf{sí es topología}.}}
\only<2>{\caja[rojo]{0.92\linewidth}{\etiqueta[rojo]{Contraejemplo en $\tau_2$}
$\s{a}\cup\s{b,c,d}=\colorbox{malo}{$\s{a,b,c,d}$}\notin\tau_2$\\[1mm]
$\tau_2$ \textbf{no es topología}: falla una \textbf{unión} (T2).}}
\only<3>{\caja[rojo]{0.92\linewidth}{\etiqueta[rojo]{Contraejemplo en $\tau_3$}
$\s{c,d}\cap\s{a,b,d,e}=\colorbox{malo}{$\s{d}$}\notin\tau_3$\\[1mm]
$\tau_3$ \textbf{no es topología}: pasa todas las uniones, pero falla una \textbf{intersección} (T3).}}
\only<4>{\caja[verde]{0.92\linewidth}{\etiqueta[verde]{Pares no comparables de $\tau_4$}
$\s{a}\cup\s{b,e}=\s{a,b,e}$\qquad $\s{a}\cup\s{b,c,d,e}=X$\qquad $\s{a,b,e}\cap\s{b,c,d,e}=\s{b,e}$\\[1mm]
\textbf{Respuesta:} son topologías $\tau_1$ y $\tau_4$. En lo que sigue se trabaja con $\tau_1$.}}
""", [
    "Parte uno del taller. Equis tiene cinco puntos: a, be, ce, de, y e. En tau uno, los pares no comparables dan: "
    "a, unido con ce de, que es a ce de. A, unido con be ce de e, que es equis. Y la intersección de a ce de, "
    "con be ce de e, que es ce de. Todos esos resultados están en la lista. Tau uno sí es una topología.",
    "En tau dos, la unión del conjunto a, con el conjunto be ce de, es a be ce de, que no está en la colección. "
    "Falla la unión: no es topología.",
    "En tau tres, todas las uniones funcionan. Pero la intersección de ce de, con a be de e, es el conjunto de, "
    "que no está. Falla la intersección: tampoco es topología. Por eso siempre hay que revisar las dos operaciones.",
    "Tau cuatro pasa todas las pruebas, igual que tau uno. Entonces las topologías son tau uno y tau cuatro. "
    "En lo que sigue trabajamos con tau uno.",
])

# ---------------------------------------------------------------- 6
cuadro(r"Conjuntos cerrados \ ($c_0\tau$)", "2 · Cerrados y vecindades", r"""
\caja{0.94\linewidth}{\etiqueta{Definición}
$F$ es \textbf{cerrado} si su complemento $X\sm F$ es abierto. Se obtienen tomando el complemento de cada abierto.}

\vspace{2mm}
{\renewcommand{\arraystretch}{1.3}
\begin{tabular}{@{}l|cccccc@{}}
abierto $U\in\tau_1$ & $\vac$ & $X$ & $\s{a}$ & $\s{c,d}$ & $\s{a,c,d}$ & $\s{b,c,d,e}$\\ \hline
cerrado $X\sm U$ & $X$ & $\vac$ & $\s{b,c,d,e}$ & $\s{a,b,e}$ & $\s{b,e}$ & $\s{a}$
\end{tabular}}

\vspace{4mm}
\uncover<2->{\caja[ambar]{0.94\linewidth}{\etiqueta[ambar]{Cuidado: «cerrado» no es lo contrario de «abierto»}
$\s{a}$ y $\s{b,c,d,e}$ son \textbf{abiertos y cerrados} a la vez.\qquad
$\s{b}$ \textbf{no es ni abierto ni cerrado}.}}
""", [
    "Un conjunto es cerrado si su complemento es abierto. Para hallar todos los cerrados, se toma el complemento de "
    "cada abierto, uno por uno. En tau uno, los cerrados son: el vacío, equis, el conjunto a, el conjunto be e, "
    "el conjunto a be e, y el conjunto be ce de e.",
    "Cuidado: cerrado no es lo contrario de abierto. El conjunto a, y el conjunto be ce de e, son abiertos y cerrados "
    "a la vez. En cambio, el conjunto be no es ni abierto ni cerrado.",
])

# ---------------------------------------------------------------- 7
cuadro("La herramienta clave: el abierto mínimo", "2 · Cerrados y vecindades", r"""
\begin{columns}[T]
\begin{column}{0.47\linewidth}
\caja{0.96\linewidth}{\etiqueta{En un espacio finito}
$U_x=\displaystyle\bigcap\{U\in\tau:\ x\in U\}$\\[1mm]
es el \textbf{menor abierto} que contiene a $x$.}

\vspace{2mm}
{\renewcommand{\arraystretch}{1.25}
\begin{tabular}{@{}c|l@{}}
$x$ & $U_x$ \ (en $\tau_1$)\\ \hline
$a$ & $\s{a}$\\
$b$ & $\s{b,c,d,e}$\\
$c$ & $\s{c,d}$\\
$d$ & $\s{c,d}$\\
$e$ & $\s{b,c,d,e}$
\end{tabular}}
\end{column}
\begin{column}{0.50\linewidth}
\uncover<2->{\caja[verde]{0.97\linewidth}{\etiqueta[verde]{Con esa tabla sale casi todo}
\renewcommand{\arraystretch}{1.5}
\begin{tabular}{@{}l@{\ }c@{\ }l@{}}
$N\in\N_x$ & $\iff$ & $U_x\subseteq N$\\
$x\in\cl{A}$ & $\iff$ & $U_x\cap A\neq\vac$\\
$x\in\inte{A}$ & $\iff$ & $U_x\subseteq A$\\
$x\in A'$ & $\iff$ & $(U_x\sm\{x\})\cap A\neq\vac$
\end{tabular}}}
\end{column}
\end{columns}
""", [
    "La herramienta más útil en espacios finitos es el abierto mínimo de un punto: la intersección de todos los "
    "abiertos que lo contienen. Es el abierto más pequeño que contiene al punto. En tau uno: el de a, es el conjunto a. "
    "El de be, y el de e, es be ce de e. Y el de ce, y el de de, es ce de.",
    "Con esa tabla se resuelve casi todo. Un conjunto es vecindad de un punto, si contiene a su abierto mínimo. "
    "Un punto está en la clausura de A, si su abierto mínimo corta a A. Está en el interior de A, si su abierto mínimo "
    "está contenido en A. Y es punto de acumulación de A, si su abierto mínimo, quitándole el propio punto, "
    "todavía corta a A.",
])

# ---------------------------------------------------------------- 8
cuadro(r"Vecindades: $\mathcal{N}_c$ y $\mathcal{N}_e$", "2 · Cerrados y vecindades", r"""
\caja{0.94\linewidth}{\etiqueta{Definición}
$N$ es \textbf{vecindad} de $x$ si existe un abierto $U$ con $x\in U\subseteq N$. {\small(No tiene que ser abierta.)}}

\vspace{1mm}
$U_c=\s{c,d}$ \ $\Longrightarrow$ \ a $\s{c,d}$ se le agregan puntos de $\s{a,b,e}$: \ $2^3=8$ vecindades

\vspace{1mm}
{\small$\N_c=\{\s{c,d},\ \s{a,c,d},\ \s{b,c,d},\ \s{c,d,e},\ \s{a,b,c,d},\ \s{a,c,d,e},\ \s{b,c,d,e},\ X\}$}

\vspace{1.5mm}
$U_e=\s{b,c,d,e}$ \ $\Longrightarrow$ \ $\N_e=\{\s{b,c,d,e},\ X\}$

\vspace{2mm}
\uncover<2->{\caja[ambar]{0.94\linewidth}{\etiqueta[ambar]{Dos convenciones}
{\small Lipschutz, Kelley: la vecindad no tiene que ser abierta (la de arriba).\\
Munkres: «vecindad» $=$ abierto que contiene al punto. Para $c$ serían $\s{c,d}$, $\s{a,c,d}$, $\s{b,c,d,e}$, $X$.}}}
""", [
    "Una vecindad de un punto es cualquier conjunto que contiene un abierto que contiene al punto. No tiene que ser "
    "abierta. El abierto mínimo de ce, es ce de. Entonces las vecindades de ce son: ce de, junto con cualquier "
    "combinación de los otros tres puntos. Ocho conjuntos en total. El abierto mínimo de e, es be ce de e, y sus "
    "únicas vecindades son ese conjunto, y equis.",
    "Una advertencia. Algunos libros, como el de Munkres, llaman vecindad solamente a los abiertos que contienen al "
    "punto. Con esa convención la respuesta es más corta. En el examen conviene aclarar qué definición se está usando.",
])

# ---------------------------------------------------------------- 9
cuadro(r"Puntos de acumulación y derivado $A'$", "3 · Derivado, clausura, interior, frontera", r"""
\caja{0.94\linewidth}{\etiqueta{Definición}
$x$ es \textbf{punto de acumulación} de $A$ si \alert{todo} abierto que contiene a $x$ contiene algún punto de $A$
\alert{distinto de $x$}. \ El conjunto de esos puntos es el \textbf{derivado} $A'$.}

\vspace{1mm}
\uncover<2->{
\begin{columns}[c]
\begin{column}{0.52\linewidth}
{\renewcommand{\arraystretch}{1.2}
\begin{tabular}{@{}c|l|l|c@{}}
$x$ & $U_x$ & $(U_x\sm\{x\})\cap G$ & $x\in G'$\\ \hline
$a$ & $\s{a}$ & $\vac$ & no\\
$b$ & $\s{b,c,d,e}$ & $\s{e}$ & \textbf{sí}\\
$c$ & $\s{c,d}$ & $\vac$ & no\\
$d$ & $\s{c,d}$ & $\vac$ & no\\
$e$ & $\s{b,c,d,e}$ & $\s{b}$ & \textbf{sí}
\end{tabular}}
\end{column}
\begin{column}{0.42\linewidth}
$G=\s{b,e}$ en $\tau_1$\\[3mm]
\uncover<3->{\caja[verde]{0.95\linewidth}{$G'=\s{b,e}$\\[1mm]
{\small En $\tau_4$, el mismo $G$ tiene $G'=\s{b,c,d,e}$: el derivado depende de la topología.}}}
\end{column}
\end{columns}}
""", [
    "Un punto es de acumulación de un conjunto A, si todo abierto que lo contiene tiene algún punto de A distinto de "
    "él mismo. El conjunto de esos puntos es el derivado de A, que se escribe A prima. Hay dos detalles decisivos: "
    "tiene que cumplirse para todo abierto, y el propio punto no cuenta.",
    "Calculemos el derivado de ge, igual a be, e, en tau uno. Para cada punto tomamos su abierto mínimo, le quitamos "
    "el punto, e intersecamos con ge. Para a, queda vacío. Para be, queda el punto e. Para ce, y para de, queda vacío, "
    "porque ce de no toca a ge. Para e, queda be.",
    "Los puntos de acumulación son be, y e. El derivado de ge es be, e. Si cambiamos a la topología tau cuatro, "
    "el mismo conjunto tiene como derivado a be ce de e. El derivado depende de la topología, no solo del conjunto.",
])

# ---------------------------------------------------------------- 10
cuadro(r"Clausura $\overline{A}$", "3 · Derivado, clausura, interior, frontera", r"""
\caja{0.94\linewidth}{\etiqueta{Definición y fórmula}
$\cl{A}$ es el \textbf{menor cerrado} que contiene a $A$.\qquad\qquad $\cl{A}=A\cup A'$}

\vspace{2mm}
Cerrados de $\tau_1$:\quad $\vac,\ \ \s{a},\ \ \s{b,e},\ \ \s{a,b,e},\ \ \s{b,c,d,e},\ \ X$

\vspace{3mm}
\uncover<2->{
{\renewcommand{\arraystretch}{1.5}
\begin{tabular}{@{}l@{\quad}l@{}}
$\cl{\s{a}}=\s{a}$ & ya es cerrado\\
$\cl{\s{b}}=\s{b,e}$ & el menor cerrado que contiene a $b$ \ \ (comprobación: $\s{b}'=\s{e}$)\\
$\cl{\s{c,d}}=\s{b,c,d,e}$ & el menor cerrado que contiene a $c$ y a $d$
\end{tabular}}

\vspace{2mm}
{\small\color{black!65} Hacer el cálculo por dos vías (cerrados y derivado) es la mejor comprobación en un examen.}}
""", [
    "La clausura de A es el menor cerrado que contiene a A. También es igual a A, unido con su derivado. "
    "Para calcularla, se recorre la lista de cerrados, y se toma el más pequeño que contiene al conjunto.",
    "En tau uno: el conjunto a ya es cerrado, así que es su propia clausura. El menor cerrado que contiene a be, "
    "es be e. Y el menor cerrado que contiene a ce de, es be ce de e. Hacer el cálculo por las dos vías, "
    "con los cerrados y con el derivado, es la mejor comprobación.",
])

# ---------------------------------------------------------------- 11
cuadro("Interior, exterior y frontera", "3 · Derivado, clausura, interior, frontera", r"""
\begin{columns}[c]
\begin{column}{0.37\linewidth}
\begin{tikzpicture}[x=0.92cm,y=0.92cm,font=\small]
\fill[tinta!7] (-2.7,-1.6) rectangle (2.7,1.6);
\draw[black!45] (-2.7,-1.6) rectangle (2.7,1.6);
\fill[verde!22] (0,0) ellipse (1.75 and 0.95);
\draw[rojo,line width=1.5pt] (0,0) ellipse (1.75 and 0.95);
\node at (0,0) {$\inte{A}$};
\node[rojo] at (1.9,1.25) {$\Fr(A)$};
\node at (-1.9,-1.25) {$\Ext(A)$};
\end{tikzpicture}
\end{column}
\begin{column}{0.60\linewidth}
{\renewcommand{\arraystretch}{1.45}
\begin{tabular}{@{}l@{\ }l@{}}
$\inte{A}$ & $=$ unión de los abiertos contenidos en $A$\\
$\Ext(A)$ & $=\Int(X\sm A)=X\sm\cl{A}$\\
$\Fr(A)$ & $=\cl{A}\sm\inte{A}$\\
$X$ & $=\inte{A}\ \sqcup\ \Fr(A)\ \sqcup\ \Ext(A)$
\end{tabular}}
\end{column}
\end{columns}

\vspace{2mm}
\uncover<2->{\caja[verde]{0.94\linewidth}{$J=\s{a,b,c}$ en $\tau_1$:\quad $\inte{J}=\s{a}$,\quad $\cl{J}=X$,\quad
$\Fr(J)=\s{b,c,d,e}$,\quad $\Ext(J)=\vac$}}

\vspace{1mm}
\uncover<3->{\caja[ambar]{0.94\linewidth}{{\small En espacios finitos la frontera puede ser casi todo el espacio.
El taller escribe $\sigma(J)$: se interpretó como frontera; \textbf{confirmar la notación} con los apuntes de clase.}}}
""", [
    "El interior de A es la unión de los abiertos contenidos en A: el mayor abierto que cabe dentro. El exterior es "
    "el interior del complemento. Y la frontera es lo que queda: la clausura menos el interior. Interior, frontera "
    "y exterior siempre forman una partición del espacio.",
    "Para jota, igual a, a be ce, en tau uno. El único abierto no vacío contenido en jota es el conjunto a, así que "
    "el interior es a. Ningún cerrado propio contiene a jota, así que su clausura es todo equis. La frontera es "
    "equis menos a, es decir, be ce de e. Y el exterior es vacío.",
    "Dos observaciones. En espacios finitos, la frontera no es un borde delgado: aquí son cuatro de los cinco puntos. "
    "Y el taller escribe sigma de jota. Lo interpretamos como la frontera, pero esa notación no es estándar, "
    "y hay que confirmarla con los apuntes de clase.",
])

# ---------------------------------------------------------------- 12
cuadro("Conjuntos densos y topología relativa", "4 · Densidad y subespacios", r"""
\caja{0.94\linewidth}{\etiqueta{Denso}
$D$ es \textbf{denso} si $\cl{D}=X$ \ $\iff$ \ $D$ corta a todo abierto no vacío.}

\vspace{1mm}
{\renewcommand{\arraystretch}{1.25}\small
\begin{tabular}{@{}l|cccccc@{}}
$U\in\tau_1$ & $\vac$ & $\s{a}$ & $\s{c,d}$ & $\s{a,c,d}$ & $\s{b,c,d,e}$ & $X$\\ \hline
$\cl{U}$ & $\vac$ & $\s{a}$ & $\s{b,c,d,e}$ & $X$ & $\s{b,c,d,e}$ & $X$\\
¿denso? & no & no & no & \textbf{sí} & no & \textbf{sí}
\end{tabular}}

\vspace{3mm}
\uncover<2->{\caja{0.94\linewidth}{\etiqueta{Topología relativa}
$\tau_H=\{U\cap H:\ U\in\tau\}$.\quad Para $H=\s{a,c,d}$: \ las intersecciones son $H,\vac,\s{a},\s{c,d},H,\s{c,d}$\\[1mm]
$\Longrightarrow\ \ \tau_H=\{H,\ \vac,\ \s{a},\ \s{c,d}\}$\qquad
{\small\color{ambar}Abierto en $H$ no implica abierto en $X$.}}}
""", [
    "Un conjunto es denso si su clausura es todo el espacio. O, lo que es lo mismo, si corta a todo abierto no vacío. "
    "Entre los abiertos de tau uno, los densos son a ce de, y equis. Por ejemplo, ce de no es denso, porque no toca "
    "al abierto a.",
    "La topología relativa sobre un subconjunto hache se obtiene intersecando cada abierto con hache. Para hache, "
    "igual a, a ce de, las intersecciones dan: hache, el vacío, el conjunto a, y el conjunto ce de. "
    "Ojo: un conjunto abierto en hache, no tiene por qué ser abierto en equis.",
])

# ---------------------------------------------------------------- 13
cuadro(r"Parte II: $X=\{1,2,3,4,6\}$", "4 · Densidad y subespacios", r"""
$\tau_1=\{X,\vac,\s{1},\s{1,2},\s{2,6},\s{1,6},\colorbox{malo}{$\s{\ ,2}$},\s{1,2,6},\s{6}\}$
\qquad $\tau_2=\{X,\vac,\s{2},\s{3},\s{2,3},\s{2,4,6},\s{2,3,4,6}\}$

\vspace{2mm}
\caja[ambar]{0.94\linewidth}{\etiqueta[ambar]{Errata en $\tau_1$}
Si «$\s{\ ,2}$» se lee como $\s{2}$, es topología. Si se omite, no: $\s{1,2}\cap\s{2,6}=\s{2}$ quedaría fuera.
\ $\tau_2$ es topología tal como está.}

\vspace{2mm}
\uncover<2->{
{\small\renewcommand{\arraystretch}{1.3}
\begin{tabular}{@{}l@{\quad}l@{\qquad}l@{\quad}l@{}}
\multicolumn{4}{@{}l}{\textbf{Resultados con $\tau_2$} \ ($L=\s{1,4}$, $M=\s{2,6}$, $P=\s{1,3,4,6}$)}\\
$L'$ & $=\s{1,6}$ & $M'$ & $=\s{1,4,6}$\\
$\cl{\s{2,6}}$ & $=\s{1,2,4,6}$ & $\tau_P$ & $=\{P,\vac,\s{3},\s{4,6},\s{3,4,6}\}$\\
$\N_1$ & $=\{X\}$ & $\N_4=\N_6$ & $=\{\s{2,4,6},\s{1,2,4,6},\s{2,3,4,6},X\}$\\
$\inte{P}$ & $=\s{3}$ & $\Fr(L\cup M)$ & $=\s{1,2,4,6}\sm\s{2,4,6}=\s{1}$
\end{tabular}}}
""", [
    "En la parte dos, el conjunto es: uno, dos, tres, cuatro, seis. En tau uno aparece un término incompleto. "
    "Si se lee como el conjunto dos, la colección es una topología. Si se omite, deja de serlo, porque la intersección "
    "de uno dos, con dos seis, es justamente el conjunto dos. Tau dos sí es topología, sin corregir nada.",
    "Con tau dos, y los mismos métodos, se obtiene: el derivado de ele es uno, seis. El de eme es uno, cuatro, seis. "
    "La clausura de dos seis es uno, dos, cuatro, seis. La única vecindad de uno es todo el espacio. El interior de pe "
    "es el conjunto tres. Y la frontera de ele unión eme es el conjunto uno. Un detalle instructivo: el cuatro "
    "pertenece a ele, pero no es punto de acumulación de ele.",
])

# ---------------------------------------------------------------- 14
cuadro(r"Topologías de cuatro términos: $\{\varnothing,A,B,X\}$", "5 · Topologías pequeñas y comparación", r"""
\caja{0.94\linewidth}{\etiqueta{Problema III.13}
$\{\vac,A,B,X\}$ es topología $\iff$ \ $A\subseteq B$, \ o \ $B\subseteq A$, \ o \ $B=X\sm A$.}

\vspace{1mm}
\begin{columns}[c]
\begin{column}{0.46\linewidth}\centering
\begin{tikzpicture}[font=\small]
\draw[black!50,rounded corners=3pt] (-2.3,-1.05) rectangle (2.3,1.05);
\draw[tinta2,fill=tinta2!10] (-0.3,0) ellipse (1.6 and 0.8);
\draw[verde,fill=verde!20] (-0.8,0) ellipse (0.7 and 0.45);
\node at (-0.8,0) {$A$}; \node at (0.7,0) {$B$}; \node at (1.95,0.75) {$X$};
\end{tikzpicture}\\
\textbf{Cadena:} $A\cup B=B$, \ $A\cap B=A$
\end{column}
\begin{column}{0.46\linewidth}\centering
\begin{tikzpicture}[font=\small]
\draw[black!50,rounded corners=3pt,fill=tinta2!10] (-2.3,-1.05) rectangle (2.3,1.05);
\fill[verde!20,rounded corners=3pt] (-2.3,-1.05) rectangle (-0.3,1.05);
\draw[black!50,rounded corners=3pt] (-2.3,-1.05) rectangle (2.3,1.05);
\draw[black!50] (-0.3,-1.05) -- (-0.3,1.05);
\node at (-1.3,0) {$A$}; \node at (1.0,0) {$B=X\sm A$};
\end{tikzpicture}\\
\textbf{Complementarios:} $A\cup B=X$, \ $A\cap B=\vac$
\end{column}
\end{columns}

\vspace{2mm}
\uncover<2->{\caja[verde]{0.94\linewidth}{\etiqueta[verde]{Problema III.1: $X=\s{2,4,6}$}
Cadenas $\s{x}\subset\s{x,y}$: \ $3\cdot 2=6$.\quad Complementarios $\s{x}$, $X\sm\s{x}$: \ $3$.\quad
\textbf{Total: 9 topologías de cuatro términos.}}}
""", [
    "Parte tres. ¿Cuándo es topología una colección de cuatro términos: el vacío, A, be, y equis? Solo hay que mirar "
    "A unión be, y A intersección be. Si uno contiene al otro, todo funciona: es una cadena. Si no son comparables, "
    "la unión tiene que ser equis, y la intersección tiene que ser vacía: son complementarios. "
    "Esas son las únicas posibilidades.",
    "En el conjunto dos, cuatro, seis: cadenas de un punto dentro de un par, hay tres por dos, seis. "
    "Pares complementarios, un punto y los otros dos, hay tres. En total, nueve topologías de cuatro términos. "
    "Con el mismo criterio se construyen las diez que piden los problemas dos y tres.",
])

# ---------------------------------------------------------------- 15
cuadro(r"Problema III.4: las 29 topologías sobre $\{a,b,c\}$", "5 · Topologías pequeñas y comparación", r"""
\only<1>{
\caja{0.94\linewidth}{\etiqueta{Comparación}
$\tau$ y $\tau'$ son \textbf{comparables} si $\tau\subseteq\tau'$ o $\tau'\subseteq\tau$.\quad
Si $\tau\subseteq\tau'$: \ $\tau'$ es \textbf{más fina}, \ $\tau$ es \textbf{más gruesa}.}

\vspace{3mm}
{\renewcommand{\arraystretch}{1.3}
\begin{tabular}{@{}l|cccccc|c@{}}
número de abiertos & 2 & 3 & 4 & 5 & 6 & 8 & total\\ \hline
cuántas topologías & 1 & 6 & 9 & 6 & 6 & 1 & \textbf{29}
\end{tabular}}

\vspace{4mm}
La indiscreta $\{\vac,X\}$ está contenida en todas; la discreta las contiene a todas.}
\only<2>{
\begin{columns}[c]
\begin{column}{0.60\linewidth}
\resizebox{\linewidth}{!}{\input{../../fuente/gen/hasse_III4}}
\end{column}
\begin{column}{0.36\linewidth}
\caja[verde]{0.95\linewidth}{\etiqueta[verde]{Resultado}
$\binom{29}{2}=406$ pares\\[1mm]
\textbf{163} comparables\\
\textbf{243} no comparables}

\vspace{2mm}
{\small Dos topologías distintas con el mismo número de abiertos \textbf{nunca} son comparables.}
\end{column}
\end{columns}}
""", [
    "Dos topologías sobre el mismo conjunto son comparables si una está contenida en la otra. La que tiene más "
    "abiertos se llama más fina. En un conjunto de tres puntos hay exactamente veintinueve topologías. La indiscreta "
    "está contenida en todas, y la discreta las contiene a todas.",
    "Este diagrama ordena las veintinueve por inclusión. Dos topologías son comparables cuando se puede subir de una "
    "a la otra siguiendo las líneas. De los cuatrocientos seis pares posibles, ciento sesenta y tres son comparables, "
    "y doscientos cuarenta y tres no lo son. Un atajo: dos topologías distintas con el mismo número de abiertos, "
    "nunca son comparables.",
])

# ---------------------------------------------------------------- 16
cuadro(r"Problema III.6: una topología en $\mathbb{Z}$", "5 · Topologías pequeñas y comparación", r"""
\[\tau=\{A\subseteq\Z:\ \ 2n\in A\iff 2n-1\in A\ \ \text{para todo } n\in\Z\}\]

\vspace{-2mm}
\begin{center}
\begin{tikzpicture}[x=1.05cm,font=\small]
\foreach \a/\b [count=\i] in {-1/0,1/2,3/4,5/6,7/8} {
  \draw[tinta2,fill=tinta2!10,rounded corners=3pt] (2.2*\i-0.85,-0.38) rectangle (2.2*\i+0.85,0.38);
  \node at (2.2*\i-0.4,0) {$\a$}; \node at (2.2*\i+0.4,0) {$\b$};}
\node at (0.6,0) {$\cdots$}; \node at (12.6,0) {$\cdots$};
\end{tikzpicture}\\[1mm]
{\small Los abiertos son las uniones de bloques $\s{2n-1,\,2n}$.}
\end{center}

\uncover<2->{
\begin{columns}[T]
\begin{column}{0.55\linewidth}
\caja{0.96\linewidth}{\etiqueta{Demostración (con elementos)}
{\small (T1) En $\vac$ ambas afirmaciones son falsas; en $\Z$, verdaderas.\\
(T2) $2n\in\bigcup A_i\iff\exists i:2n\in A_i\iff\exists i:2n-1\in A_i$.\\
(T3) $2n\in A\cap B\iff 2n-1\in A$ y $2n-1\in B$.}}
\end{column}
\begin{column}{0.40\linewidth}
\caja[verde]{0.95\linewidth}{\etiqueta[verde]{Vecindades de 5}
$5=2\cdot 3-1$ \ $\Rightarrow$ \ $U_5=\s{5,6}$\\[1mm]
$\N_5=\{N\subseteq\Z:\ \s{5,6}\subseteq N\}$}
\end{column}
\end{columns}}
""", [
    "Problema seis. En los enteros, un conjunto es abierto si, para cada ene, contiene a dos ene, exactamente cuando "
    "contiene a dos ene menos uno. Es decir, no puede separar a cada impar del par que le sigue. Los abiertos son las "
    "uniones de bloques: uno dos, tres cuatro, cinco seis, y así sucesivamente.",
    "La demostración se hace con elementos. El vacío y los enteros cumplen la condición. Si dos ene está en una unión, "
    "está en algún miembro, y ese miembro contiene a dos ene menos uno. Y para la intersección, se aplica la condición "
    "a cada conjunto. Para las vecindades de cinco: todo abierto que contiene a cinco, contiene a seis, y el conjunto "
    "cinco seis es abierto. Así que las vecindades de cinco son los conjuntos que contienen a cinco y a seis.",
])

# ---------------------------------------------------------------- 17
cuadro(r"Problema III.7: la topología del punto incluido", "5 · Topologías pequeñas y comparación", r"""
\[\tau^0=\{A\subseteq\R:\ 0\in A\}\ \ \colorbox{bueno}{$\cup\ \{\vac\}$}\]

\vspace{-1mm}
\caja[ambar]{0.94\linewidth}{\etiqueta[ambar]{Errata del enunciado}
Tal como está escrito, $\vac\notin\tau^0$ (porque $0\notin\vac$) y fallaría (T1). La definición correcta agrega el vacío.}

\vspace{1mm}
{\small (T2) Si algún $A_j\neq\vac$, entonces $0\in A_j\subseteq\bigcup A_i$.\qquad
(T3) Si $A,B\neq\vac$, entonces $0\in A\cap B$; si alguno es vacío, $A\cap B=\vac$.}

\vspace{3mm}
\uncover<2->{\caja[verde]{0.94\linewidth}{\etiqueta[verde]{Vecindades de 1}
Un abierto que contiene a $1$ no es vacío, luego contiene a $0$: \ $U_1=\s{0,1}$.\\[1mm]
$\N_1=\{N\subseteq\R:\ \s{0,1}\subseteq N\}$}}
""", [
    "Problema siete. En los reales, se declaran abiertos los conjuntos que contienen al cero. Tal como está escrito "
    "hay un problema: el vacío no contiene al cero, así que faltaría en la familia. La definición correcta agrega el "
    "vacío. Con esa corrección, los axiomas se verifican enseguida: una unión de conjuntos que contienen al cero, "
    "contiene al cero; y lo mismo una intersección.",
    "Para las vecindades de uno: un abierto que contiene a uno no es vacío, así que también contiene al cero. "
    "El abierto mínimo de uno es el conjunto cero, uno. Las vecindades de uno son todos los subconjuntos de los reales "
    "que contienen al cero y al uno.",
])

# ---------------------------------------------------------------- 18
cuadro("Bases, sub-bases y topología generada", "6 · Bases y sub-bases", r"""
\begin{center}
\begin{tikzpicture}[font=\small,
  c/.style={draw=tinta,fill=tinta!6,rounded corners=2pt,inner sep=5pt,minimum height=8mm},
  f/.style={-{Stealth[length=2.2mm]},draw=tinta!70,line width=0.6pt}]
\node[c] (s) at (0,0) {sub-base $\mathcal{S}$};
\node[c] (b) at (5.4,0) {base $\B$};
\node[c] (t) at (10.6,0) {topología $\tau$};
\draw[f] (s) -- node[above,font=\scriptsize]{intersecciones finitas} node[below,font=\scriptsize]{(más $X$)} (b);
\draw[f] (b) -- node[above,font=\scriptsize]{uniones} node[below,font=\scriptsize]{(más $\vac$)} (t);
\end{tikzpicture}
\end{center}
{\small \textbf{Base:} todo abierto es unión de básicos.\quad \textbf{Sub-base:} sus intersecciones finitas forman una base.\quad
\textbf{Generada:} la menor topología que contiene a la familia.}

\vspace{2mm}
\uncover<2->{\caja[verde]{0.94\linewidth}{\etiqueta[verde]{Problema III.8: $\C=\{\s{a,b,c},\s{c,d},\s{d,e}\}$}
\textbf{1.} Intersecciones: \ $\s{a,b,c}\cap\s{c,d}=\s{c}$,\ \ $\s{c,d}\cap\s{d,e}=\s{d}$,\ \ $\s{a,b,c}\cap\s{d,e}=\vac$\\[0.5mm]
\textbf{2.} Uniones nuevas: \ $\s{c}\cup\s{d,e}=\s{c,d,e}$,\ \ $\s{d}\cup\s{a,b,c}=\s{a,b,c,d}$\\[1mm]
$\tau(\C)=\{\vac,\s{c},\s{d},\s{c,d},\s{d,e},\s{c,d,e},\s{a,b,c},\s{a,b,c,d},X\}$ \ \ (9 abiertos)\\[0.5mm]
{\small\color{ambar}III.9: el punto $e$ no está en ningún miembro; $X$ se agrega aparte.}}}
""", [
    "Una base es un catálogo reducido de abiertos, con el que se arman todos los demás por unión. Una sub base es un "
    "catálogo todavía más pequeño: con intersecciones finitas de sus miembros se obtiene una base. La topología "
    "generada por una familia es la menor topología que la contiene. La receta tiene dos pasos, y el orden importa: "
    "primero intersecciones finitas, después uniones.",
    "Problema ocho. La familia tiene tres conjuntos: a be ce; ce de; y de e. Las intersecciones dan el punto ce, "
    "el punto de, y el vacío. Con ellos, más equis, tenemos la base. Las uniones producen dos conjuntos nuevos: "
    "ce de e; y a be ce de. La topología generada tiene nueve abiertos. En el problema nueve pasa algo más: "
    "el punto e no está en ningún miembro de la familia, y equis hay que agregarlo aparte.",
])

# ---------------------------------------------------------------- 19
cuadro("Problemas III.11 y III.12", "6 · Bases y sub-bases", r"""
\caja{0.94\linewidth}{\etiqueta{III.11: $\C=\{[a,a+1]:\ a\in\R\}$}
\begin{tikzpicture}[x=1.45cm,font=\small]
\draw[black!60,-{Stealth[length=2mm]}] (-0.4,0) -- (4.4,0);
\draw[tinta2,line width=2.2pt] (1,0.18) -- (2,0.18);
\draw[verde,line width=2.2pt] (2,-0.18) -- (3,-0.18);
\fill[rojo] (2,0) circle (2.2pt);
\node[above] at (1.5,0.2) {$[x-1,x]$}; \node[below] at (2.5,-0.2) {$[x,x+1]$};
\node[above,rojo] at (2.08,0.42) {$x$};
\node[anchor=west] at (4.6,0) {$[x-1,x]\cap[x,x+1]=\{x\}$};
\end{tikzpicture}\\[1mm]
Todo punto es abierto \ $\Longrightarrow$ \ la topología generada es la \textbf{discreta}, $\mathcal{P}(\R)$.}

\vspace{3mm}
\uncover<2->{\caja{0.94\linewidth}{\etiqueta{III.12 (corregido)}
Si $\B$ es base de $\tau$ y $\B\subseteq\B_1\subseteq\tau$, entonces $\B_1$ es base de $\tau$.\\[0.5mm]
{\small (i) Los miembros de $\B_1$ son abiertos, por hipótesis.\quad
(ii) Todo abierto es unión de miembros de $\B$, que también están en $\B_1$.\\
\color{ambar}El enunciado impreso concluye «$\B$ es una base», que es la hipótesis: es una errata.}}}
""", [
    "Problema once. En los reales, la familia son todos los intervalos cerrados de longitud uno. Para cualquier "
    "punto, el intervalo que termina en él, y el intervalo que empieza en él, se cortan solamente en ese punto. "
    "Entonces todos los puntos son abiertos, y la topología generada es la discreta.",
    "Problema doce. El enunciado tiene una errata. Lo que se demuestra es que, si a una base se le agregan abiertos, "
    "sigue siendo base. La prueba es directa: los miembros de la familia grande son abiertos; y todo abierto es unión "
    "de miembros de la base original, que también están en la familia grande.",
])

# ---------------------------------------------------------------- 20
cuadro("Continuidad", "7 · Funciones", r"""
\caja{0.94\linewidth}{\etiqueta{Definición}
$f:X\to Y$ es \textbf{continua} si \ $f^{-1}(V)$ es abierto en $X$ para todo abierto $V$ de $Y$.\\[1mm]
$f^{-1}(V)=\{x\in X:\ f(x)\in V\}$ \ {\small (no hace falta que $f$ tenga inversa)}\\[1.5mm]
$f$ es \textbf{continua en $p$} si para todo abierto $V\ni f(p)$ existe un abierto $U\ni p$ con $f(U)\subseteq V$.\\[1mm]
{\small $f$ es continua \ $\iff$ \ lo es en cada punto.}}

\vspace{1.5mm}
\uncover<2->{\caja[rojo]{0.94\linewidth}{\etiqueta[rojo]{El error más común: revisar imágenes directas $f(U)$}
{\small\begin{tabular}{@{}l@{\quad}l@{}}
\textbf{continua}: & imágenes \emph{inversas} de abiertos de la llegada\\
\textbf{abierta}: & imágenes \emph{directas} de abiertos de la salida\\
\textbf{cerrada}: & imágenes \emph{directas} de cerrados de la salida
\end{tabular}}}}
""", [
    "Pasamos a las funciones. Una función entre espacios topológicos es continua, si la imagen inversa de todo abierto "
    "de la llegada es un abierto de la salida. La imagen inversa de un conjunto son todos los puntos cuya flecha cae "
    "en ese conjunto; no hace falta que la función tenga inversa. Y es continua en un punto pe, si para todo abierto "
    "que contiene a la imagen de pe, hay un abierto alrededor de pe que cae dentro.",
    "El error más común es revisar imágenes directas de abiertos. Eso no es continuidad: es la definición de función "
    "abierta, que es otra propiedad distinta. Continua, con imágenes inversas. Abierta y cerrada, con imágenes directas.",
])

# ---------------------------------------------------------------- 21
cuadro(r"Problema IV.1", "7 · Funciones", r"""
\begin{columns}[c]
\begin{column}{0.31\linewidth}\centering
\scalebox{0.72}{\diagrama{f}{a,b,c,d}{a,b,c,d}{1/2,2/4,3/2,4/3}}
\end{column}
\begin{column}{0.66\linewidth}
$X=\s{a,b,c,d}$,\quad $\tau=\{X,\vac,\s{a},\s{b},\s{a,b},\s{b,c,d}\}$

\vspace{3mm}
\uncover<2->{
{\small\renewcommand{\arraystretch}{1.3}
\begin{tabular}{@{}l|cccccc@{}}
$V$ & $\vac$ & $\s{a}$ & $\s{b}$ & $\s{a,b}$ & $\s{b,c,d}$ & $X$\\ \hline
$f^{-1}(V)$ & $\vac$ & $\vac$ & \colorbox{malo}{$\s{a,c}$} & \colorbox{malo}{$\s{a,c}$} & $X$ & $X$\\
¿abierto? & \ok & \ok & \mal & \mal & \ok & \ok
\end{tabular}}

\vspace{2mm}
\textbf{(a)} $f^{-1}(\s{b})=\s{a,c}\notin\tau$ \ $\Longrightarrow$ \ $f$ \textbf{no es continua}.}
\end{column}
\end{columns}

\vspace{2mm}
\uncover<3->{\caja[verde]{0.94\linewidth}{\textbf{(b)} $f(d)=c$. Abiertos que contienen a $c$: $\s{b,c,d}$ y $X$.\quad
$f^{-1}(\s{b,c,d})=X$, vecindad de $d$ \ $\Longrightarrow$ \ $f$ \textbf{sí es continua en $d$}.\\
{\small Solo falla en $c$: $f(c)=b\in\s{b}$, pero $f(\s{b,c,d})\not\subseteq\s{b}$.}}}
""", [
    "Problema uno de la parte cuatro. El espacio tiene cuatro puntos, con abiertos: el conjunto a; el conjunto be; "
    "a be; y be ce de. La función lleva a en be; be en de; ce en be; y de en ce.",
    "Calculamos las imágenes inversas. Los puntos que van a parar a be, son a y ce. Entonces la imagen inversa del "
    "abierto be, es el conjunto a ce, que no es abierto. La función no es continua.",
    "¿Y en el punto de? La imagen de de, es ce. Los abiertos que contienen a ce son: be ce de; y equis. La imagen "
    "inversa de be ce de es todo equis, que es una vecindad de de. Entonces la función sí es continua en de. "
    "De hecho, solo falla en el punto ce. Pero un solo punto de discontinuidad basta para que la función no sea continua.",
])

# ---------------------------------------------------------------- 22
cuadro(r"Problema IV.2: ¿es abierta $f(x)=x^2$?", "7 · Funciones", r"""
\begin{columns}[c]
\begin{column}{0.42\linewidth}\centering
\begin{tikzpicture}[x=1.55cm,y=1.55cm,font=\small]
\draw[black!55,-{Stealth[length=2mm]}] (-1.6,0) -- (1.7,0) node[below] {$x$};
\draw[black!55,-{Stealth[length=2mm]}] (0,-0.25) -- (0,2.3) node[left] {$y$};
\draw[tinta,line width=1pt,domain=-1.45:1.45,samples=60] plot (\x,{\x*\x});
\draw[verde,line width=2.6pt] (-1,0) -- (1,0);
\draw[verde,fill=fondo,line width=1pt] (-1,0) circle (2pt); \draw[verde,fill=fondo,line width=1pt] (1,0) circle (2pt);
\node[verde,below] at (-0.5,-0.02) {$(-1,1)$};
\uncover<2->{
\draw[rojo,line width=2.6pt] (0,0) -- (0,1);
\fill[rojo] (0,0) circle (2.2pt); \draw[rojo,fill=fondo,line width=1pt] (0,1) circle (2pt);
\draw[black!35,dashed] (-1,0) -- (-1,1) -- (1,1) -- (1,0);
\node[rojo,right] at (0.05,0.55) {$[0,1)$};}
\end{tikzpicture}
\end{column}
\begin{column}{0.54\linewidth}
\caja{0.96\linewidth}{\etiqueta{Definiciones}
\textbf{Abierta:} $f(U)$ abierto para todo abierto $U$.\\
\textbf{Cerrada:} $f(F)$ cerrado para todo cerrado $F$.}

\vspace{2mm}
\uncover<2->{\caja[rojo]{0.96\linewidth}{
$U=(-1,1)$ es abierto, pero\\[1mm]
$f(U)=[0,1)$ \textbf{no es abierto}: ningún intervalo $(-\varepsilon,\varepsilon)$ cabe en $[0,1)$.\\[1mm]
$\Longrightarrow$ \ $f$ \textbf{no es abierta} (aunque sí es continua).}}
\end{column}
\end{columns}
""", [
    "Una función es abierta, si la imagen directa de todo abierto es abierta. Y es cerrada, si la imagen de todo "
    "cerrado es cerrada. Problema dos: ¿es abierta la función equis al cuadrado, en los reales? Tomemos el intervalo "
    "abierto de menos uno a uno.",
    "Su imagen es el intervalo de cero a uno, que incluye al cero, y no incluye al uno. Ese conjunto no es abierto, "
    "porque ningún intervalo alrededor de cero cabe dentro. Entonces la función no es abierta, aunque sí es continua. "
    "Continua y abierta son propiedades independientes.",
])

# ---------------------------------------------------------------- 23
cuadro(r"Problema IV.3: cuatro funciones", "7 · Funciones", r"""
{\small $X=\s{1,2,3,4}$,\ \ $\tau_1=\{X,\vac,\s{2},\s{3},\s{2,3},\s{2,4},\s{2,3,4},\s{1,2,4},\s{1,2,3}\}$\qquad
$Y=\s{a,b,c,d}$,\ \ $\tau_2=\{Y,\vac,\s{c},\s{c,d},\s{a,b,c}\}$}

\vspace{1mm}
\begin{center}
\scalebox{0.60}{\diagrama{f}{1,2,3,4}{a,b,c,d}{1/1,2/1,3/4,4/3}}\hfill
\scalebox{0.60}{\diagrama{g}{1,2,3,4}{a,b,c,d}{1/2,2/3,3/3,4/4}}\hfill
\scalebox{0.60}{\diagrama{h}{a,b,c,d}{1,2,3,4}{1/2,2/3,3/4,4/1}}\hfill
\scalebox{0.60}{\diagrama{k}{a,b,c,d}{1,2,3,4}{1/2,2/4,3/3,4/3}}
\end{center}

\vspace{-1mm}
\only<1>{{\small Tres pruebas independientes por función: $f^{-1}$(abiertos) para la continuidad; $f$(abiertos) para ver si
es abierta; $f$(cerrados) para ver si es cerrada.}}
\only<2>{\caja[ambar]{0.94\linewidth}{\etiqueta[ambar]{Advertencia: $\tau_1$ no es cerrada bajo intersecciones}
$\s{1,2,4}\cap\s{1,2,3}=\colorbox{malo}{$\s{1,2}$}\notin\tau_1$. \ Se resolvió con la lista tal cual y agregando
$\s{1,2}$: \textbf{las respuestas no cambian}.}}
""", [
    "Problema tres. Hay cuatro funciones, entre un espacio equis de cuatro puntos, y un espacio ye de cuatro puntos. "
    "Para cada una se hacen tres pruebas independientes: imágenes inversas de abiertos, para la continuidad. "
    "Imágenes directas de abiertos, para ver si es abierta. E imágenes de cerrados, para ver si es cerrada.",
    "Antes de empezar, una advertencia. La colección tau uno del enunciado no es cerrada bajo intersecciones: "
    "uno dos cuatro, intersecado con uno dos tres, da uno dos, que no está en la lista. Lo comprobamos de las dos "
    "maneras: con la lista tal cual, y agregando ese conjunto. Las respuestas no cambian.",
])

# ---------------------------------------------------------------- 24
cuadro(r"Problema IV.3: resultados", "7 · Funciones", r"""
{\renewcommand{\arraystretch}{1.45}\small
\begin{tabular}{@{}l|ccc|l@{}}
función & continua & abierta & cerrada & testigos\\ \hline
$f:X\to Y$ & \no & \no & \no & $f^{-1}(\s{c})=\s{4}$;\ \ $f(\s{2})=\s{a}$;\ \ $f(\s{1})=\s{a}$\\
$g:X\to Y$ & \si & \no & \no & $g^{-1}(V)$ siempre abierto;\ \ $g(X)=\s{b,c,d}$\\
\uncover<2->{$h:Y\to X$} & \uncover<2->{\no} & \uncover<2->{\no} & \uncover<2->{\no} & \uncover<2->{$h^{-1}(\s{2})=\s{a}$;\ \ $h(\s{c})=\s{4}$;\ \ $h(\s{a,b})=\s{2,3}$}\\
\uncover<2->{$k:Y\to X$} & \uncover<2->{\no} & \uncover<2->{\si} & \uncover<2->{\no} & \uncover<2->{$k^{-1}(\s{2})=\s{a}$;\ \ $k(Y)=\s{2,3,4}$ no cerrado}
\end{tabular}}

\vspace{3mm}
\only<2>{{\small $g$ es continua y no abierta; $k$ es abierta y no continua: las dos nociones son \textbf{independientes}.}}
\only<3>{\caja[rojo]{0.94\linewidth}{\etiqueta[rojo]{(b) «Pruebe que $X\cong Y$»: es falso con los datos impresos}
Un homeomorfismo empareja los abiertos uno a uno. $X$ tiene \textbf{9} abiertos (10 con la corrección) y $Y$ tiene
\textbf{5}. \ Lo demostrable es \ $X\not\cong Y$. \ Conviene comentarlo con el profesor.}}
""", [
    "Efe no es continua: la imagen inversa del abierto ce, es el conjunto cuatro, que no es abierto. Tampoco es "
    "abierta, ni cerrada. Ge sí es continua: las imágenes inversas de los abiertos de ye son: dos tres; dos tres "
    "cuatro; y uno dos tres. Todas abiertas. Pero ge no es abierta, ni cerrada.",
    "Hache es biyectiva, pero no es continua, ni abierta, ni cerrada. Y ka no es continua, pero sí es abierta: "
    "las imágenes de los abiertos son el conjunto tres, y el conjunto dos tres cuatro, que son abiertos. "
    "No es cerrada, porque la imagen de todo ye es dos tres cuatro, que no es cerrado. Ge y ka muestran que continua "
    "y abierta son independientes.",
    "El inciso be pide probar que equis y ye son homeomorfos. Con los datos impresos, eso es falso. Un homeomorfismo "
    "hace corresponder los abiertos uno a uno. Y aquí equis tiene nueve abiertos, o diez con la corrección, mientras "
    "que ye tiene cinco. Lo que se puede demostrar es que no son homeomorfos, y conviene comentarlo con el profesor.",
])

# ---------------------------------------------------------------- 25
cuadro("Homeomorfismos", "7 · Funciones", r"""
\caja{0.94\linewidth}{\etiqueta{Definición}
$f:X\to Y$ es \textbf{homeomorfismo} si es biyectiva, continua y $f^{-1}$ es continua.\\[1mm]
Equivale a: $f$ es una biyección y \ $U$ abierto en $X$ $\iff$ $f(U)$ abierto en $Y$.\qquad Se escribe $X\homeo Y$.}

\vspace{3mm}
\uncover<2->{
\begin{columns}[T]
\begin{column}{0.46\linewidth}
\caja[rojo]{0.95\linewidth}{\etiqueta[rojo]{Para negar}
Un \textbf{invariante} que no coincida:\\ número de puntos, número de abiertos, cuántos puntos son abiertos,
tamaños de los abiertos\dots}
\end{column}
\begin{column}{0.46\linewidth}
\caja[verde]{0.95\linewidth}{\etiqueta[verde]{Para afirmar}
\textbf{Construir} la biyección y tabular $U\mapsto\varphi(U)$.\\[1mm]
{\small Que coincida el número de abiertos \emph{no} basta.}}
\end{column}
\end{columns}}
""", [
    "Un homeomorfismo es una biyección continua, cuya inversa también es continua. Equivale a una biyección entre los "
    "puntos, que hace corresponder exactamente los abiertos de un espacio con los del otro. Dos espacios homeomorfos "
    "son, topológicamente, el mismo espacio con los puntos renombrados.",
    "La estrategia tiene dos caras. Para negar, basta un invariante que no coincida: el número de puntos, el número de "
    "abiertos, cuántos puntos son abiertos. Para afirmar, hay que construir la biyección, y comprobar que lleva "
    "abiertos en abiertos. Ojo: que coincida el número de abiertos no basta para afirmar.",
])

# ---------------------------------------------------------------- 26
cuadro(r"Problema IV.4", "7 · Funciones", r"""
{\small\renewcommand{\arraystretch}{1.3}
\begin{tabular}{@{}l@{\ \ }l@{\qquad}c@{}}
$X=\s{a,b,c,d,e}$ & $\tau_1=\{X,\vac,\textcolor{rojo}{\s{a}},\textcolor{verde}{\s{c,d}},\s{a,c,d},\s{b,c,d,e}\}$ & 6 abiertos\\
$Y=\s{v,w,x,y,z}$ & $\tau_2=\{Y,\vac,\textcolor{rojo}{\s{v}},\textcolor{verde}{\s{w,z}},\s{v,w,z},\s{w,x,y,z}\}$ & 6 abiertos\\
$Z=\s{1,2,3,4,5}$ & $\tau_3=\{Z,\vac,\s{1},\s{1,2},\s{1,3,4},\s{1,2,3,4},\s{1,2,5}\}$ & \textbf{7} abiertos
\end{tabular}}

\vspace{2mm}
$\varphi:X\to Y$:\quad \textcolor{rojo}{$a\mapsto v$},\quad \textcolor{verde}{$c\mapsto w,\ d\mapsto z$},\quad $b\mapsto x,\ e\mapsto y$

\vspace{1mm}
\uncover<2->{
{\small\renewcommand{\arraystretch}{1.25}
\begin{tabular}{@{}l|cccccc@{}}
$U\in\tau_1$ & $\vac$ & $\s{a}$ & $\s{c,d}$ & $\s{a,c,d}$ & $\s{b,c,d,e}$ & $X$\\ \hline
$\varphi(U)$ & $\vac$ & $\s{v}$ & $\s{w,z}$ & $\s{v,w,z}$ & $\s{w,x,y,z}$ & $Y$
\end{tabular}}
\quad $\Longrightarrow\ X\homeo Y$}

\vspace{2mm}
\uncover<3->{\caja[verde]{0.94\linewidth}{{\small\textbf{Respuestas:}\ \ (a) $X\homeo X$ \si\ \ \ (b) $X\homeo Y$ \si\ \ \
(c) $Y\homeo Z$ \no\ \ \ (d) $Z\homeo X$ \no\ \ \ (e) $Z\homeo Z$ \si\\
(a) y (e): la identidad. \ (c) y (d): $7\neq 6$ abiertos.}}}
""", [
    "Problema cuatro. En el espacio equis, el único punto abierto es a. En el espacio ye, es uve. El único par abierto "
    "de equis es ce de. El de ye es uve doble, zeta. Eso dicta la correspondencia: a va en uve. Ce y de van en uve "
    "doble y zeta. Y los dos puntos que quedan en cada lado se corresponden entre sí.",
    "Verificamos con la tabla: la imagen de cada abierto del primer espacio es un abierto del segundo, y así se "
    "recorren todos. Por lo tanto, los dos espacios son homeomorfos.",
    "El espacio zeta tiene siete abiertos, y los otros dos tienen seis. Así que zeta no es homeomorfo a ninguno de "
    "ellos. Y todo espacio es homeomorfo a sí mismo, mediante la identidad. Respuestas: inciso a, sí. Inciso be, sí. "
    "Inciso ce, no. Inciso de, no. Inciso e, sí.",
])

# ---------------------------------------------------------------- 27
cuadro("Recetario para el parcial", "Cierre", r"""
\only<1>{
{\small\renewcommand{\arraystretch}{1.42}
\begin{tabular}{@{}l@{\quad}l@{}}
\textbf{Primero} & tabla de abiertos mínimos $U_x$ \ $\to$ \ vecindades, derivado, clausura, interior\\
\textbf{Cerrados} & complemento de cada abierto\\
\textbf{Frontera} & $\cl{A}\sm\inte{A}$; \ comprobar $X=\inte{A}\sqcup\Fr(A)\sqcup\Ext(A)$\\
\textbf{Relativa} & $\{U\cap H\}$, sin repetidos\\
\textbf{Generada} & primero intersecciones finitas, después uniones\\
\textbf{Continua} & imágenes inversas de abiertos\\
\textbf{Abierta / cerrada} & imágenes directas de abiertos / de cerrados\\
\textbf{Homeomorfos} & negar con un invariante, o construir la biyección
\end{tabular}}}
\only<2>{
\caja[rojo]{0.94\linewidth}{\etiqueta[rojo]{Los errores que más cuestan}
\begin{enumerate}\setlength{\itemsep}{1.2mm}
\item Revisar solo uniones o solo intersecciones.
\item Creer que «cerrado» significa «no abierto».
\item Olvidar que en el derivado el propio punto no cuenta.
\item Calcular $f(U)$ en vez de $f^{-1}(V)$ para la continuidad.
\item No leer el enunciado con cuidado: si un dato es inconsistente, se señala y se dice qué se asumió.
\end{enumerate}}}
""", [
    "Para cerrar, el recetario. Primero, haga la tabla de abiertos mínimos: con ella salen las vecindades, el derivado, "
    "la clausura y el interior. Los cerrados son complementos. La frontera es clausura menos interior. La topología "
    "relativa se obtiene intersecando. Para generar una topología: primero intersecciones, después uniones. "
    "Continuidad, con imágenes inversas. Función abierta, con imágenes directas. Y homeomorfismo: negar con un "
    "invariante, o construir la biyección.",
    "Y los errores que más cuestan puntos. Revisar solo uniones, o solo intersecciones. Creer que cerrado significa "
    "no abierto. Olvidar que, en el derivado, el propio punto no cuenta. Calcular imágenes directas para la "
    "continuidad. Y no leer con cuidado el enunciado. Este taller tiene varias erratas, y en un examen lo correcto "
    "es señalarlas, y decir qué se asumió.",
])

# ---------------------------------------------------------------- 28
cuadro("", "Cierre", r"""
\vspace*{14mm}
\begin{center}
{\LARGE\bfseries\color{tinta} Siguiente paso}\\[6mm]
{\large Resolver la \textbf{autoevaluación} de la guía de estudio (sección 17)\\[1mm] sin mirar las respuestas.}\\[10mm]
{\small\color{black!60}
\begin{tabular}{@{}l@{\quad}l@{}}
Solución completa del taller: & \texttt{Taller2\_Topologia\_Solucion.pdf}\\
Guía de estudio: & \texttt{Guia\_de\_Estudio\_Taller2\_Topologia.pdf}
\end{tabular}}
\end{center}
""", [
    "Eso es todo. El siguiente paso es resolver la autoevaluación que está al final de la guía de estudio, "
    "sin mirar las respuestas. Mucho éxito en el parcial.",
])
