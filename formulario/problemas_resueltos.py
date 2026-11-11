# -*- coding: utf-8 -*-
"""Problemas de Irodov (ed. Mir, español) resueltos paso a paso.

Marcado: _{x} = subindice, ^{x} = superindice, <b>..</b> = negrita.
Cada problema: (numero, tema, [(etiqueta, formula)...], respuesta, nota|None)
"""

P = []


def add(num, tema, pasos, resp, nota=None):
    P.append((num, tema, pasos, resp, nota))


# ====================================================== 1. CINEMATICA
add("1.1", "Cinemática · movimiento relativo (río)", [
    ("Pasar al sistema de la corriente (la balsa está quieta)",
     "la lancha se aleja y regresa con la misma rapidez (motor igual) ⇒ t_{ida} = t_{vuelta} = τ"),
    ("Tiempo total hasta reencontrar la balsa", "t = 2τ"),
    ("La balsa solo se mueve con la corriente", "l = v_{c}·t = v_{c}·2τ"),
    ("Despejar y calcular", "v_{c} = l/(2τ) = 6,0 km/(2·1,0 h)"),
], "v_{c} = 3,0 km/h")

add("1.2", "Cinemática · velocidad media", [
    ("Camino total s; tiempo de la 1.ª mitad", "t_{1} = (s/2)/v_{0}"),
    ("2.ª mitad: mitad del tiempo con v_{1}, mitad con v_{2} (dura t_{2})",
     "v_{1}t_{2}/2 + v_{2}t_{2}/2 = s/2  ⇒  t_{2} = s/(v_{1}+v_{2})"),
    ("Velocidad media = camino total / tiempo total", "⟨v⟩ = s/(t_{1}+t_{2}) = 1/[1/(2v_{0}) + 1/(v_{1}+v_{2})]"),
], "⟨v⟩ = 2v_{0}(v_{1}+v_{2}) / (2v_{0}+v_{1}+v_{2})")

add("1.3", "Cinemática · MRUA + MRU + frenado", [
    ("Distancia total", "s = ⟨v⟩τ = 20 m/s · 25 s = 500 m"),
    ("Arranque y frenada (aceleración w, velocidad máx. v)", "t_{a} = t_{f} = v/w ;  camino de ambas fases = v²/w"),
    ("Tiempo de velocidad uniforme", "τ = 2v/w + t  ⇒  t = τ − 2v/w"),
    ("Camino total", "s = v²/w + v t = vτ − v²/w"),
    ("Ecuación de 2.º grado", "v² − wτ v + w s = 0  ⇒  v² − 125v + 2500 = 0  ⇒  v = 25 m/s (v = 100 m/s da t &lt; 0)"),
    ("Tiempo uniforme", "t = 25 − 2·25/5 = 15 s"),
], "t = 15 s")

add("1.8", "Cinemática · botes en el río (a lo largo / a lo ancho)", [
    ("Velocidad de cada bote respecto al agua", "v = ηu  (u: corriente)"),
    ("Bote A (a lo largo): ida y vuelta", "τ_{A} = l/(v+u) + l/(v−u) = 2lv/(v²−u²)"),
    ("Bote B (a lo ancho, rumbo corregido): rapidez resultante √(v²−u²)", "τ_{B} = 2l/√(v²−u²)"),
    ("Cociente", "τ_{A}/τ_{B} = v/√(v²−u²) = η/√(η²−1)"),
    ("Numérico", "1,2/√(1,44−1) = 1,2/0,663 = 1,81"),
], "τ_{A}/τ_{B} ≈ 1,8")

add("1.9", "Cinemática · arrastre mínimo (bote)", [
    ("Corriente u = n·v (n = 2); θ = ángulo entre v (bote–agua) y u", "componentes sobre el suelo: ∥: u + v cosθ ;  ⊥: v sinθ"),
    ("Arrastre por unidad de ancho recorrido", "x/L = (u + v cosθ)/(v sinθ) = (n + cosθ)/sinθ"),
    ("Mínimo: derivar respecto a θ", "d/dθ = (−1 − n cosθ)/sin²θ = 0  ⇒  cosθ = −1/n"),
    ("Resolver", "θ = arccos(−1/2)"),
], "θ = 120° respecto a la dirección de la corriente (60° contra ella)")

add("1.10", "Cinemática · tiro de dos cuerpos (marco en caída libre)", [
    ("En caída libre el movimiento relativo es uniforme", "v_{rel} = v_{2} − v_{1} = cte"),
    ("Ángulo entre las velocidades iniciales", "90° − 60° = 30°"),
    ("Módulo de la velocidad relativa (|v_{1}| = |v_{2}| = v_{0})", "v_{rel} = 2v_{0} sin(30°/2) = 2·25·sin15° = 12,94 m/s"),
    ("Distancia", "d = v_{rel}·t = 12,94 · 1,70"),
], "d ≈ 22 m")

add("1.11", "Cinemática · velocidades perpendiculares (campo g)", [
    ("Velocidades (x horizontal, y hacia arriba)", "<b>v</b>_{1} = (v_{1}, −gt) ;  <b>v</b>_{2} = (−v_{2}, −gt)"),
    ("Perpendiculares: producto escalar = 0", "−v_{1}v_{2} + g²t² = 0  ⇒  t = √(v_{1}v_{2})/g = √12/9,8 = 0,353 s"),
    ("Misma altura en todo instante ⇒ solo separación horizontal", "d = (v_{1}+v_{2})t = (v_{1}+v_{2})√(v_{1}v_{2})/g"),
    ("Numérico", "d = 7,0·3,464/9,8"),
], "d ≈ 2,5 m")

add("1.12", "Cinemática · persecución en triángulo equilátero", [
    ("Por simetría el triángulo sigue siendo equilátero y se contrae hacia el centro", "cada punto avanza hacia el siguiente con rapidez v"),
    ("Rapidez de acercamiento de dos puntos vecinos (el perseguido avanza 60° respecto a la línea)", "−dl/dt = v + v cos60° = (3/2)v"),
    ("Integrar desde l = a hasta l = 0", "t = a/(3v/2)"),
], "t = 2a/(3v)")

add("1.13", "Cinemática · persecución con velocidad dirigida a B", [
    ("Variables: l = AB ; Δx = x_{B} − x_{A} (eje de u) ; φ = ángulo entre u y la línea AB", "Δx = l cosφ"),
    ("Cambio de la distancia", "dl/dt = u cosφ − v"),
    ("Cambio de Δx", "dΔx/dt = u − v cosφ"),
    ("Combinación integrable", "d(v·l + u·Δx)/dt = v(u cosφ − v) + u(u − v cosφ) = u² − v²"),
    ("Condiciones (t = 0: φ = 90°, Δx = 0 ; encuentro: l = 0, Δx = 0)", "0 − v·l = (u² − v²)t"),
], "t = v·l / (v² − u²)")

# ====================================================== GRAVITACION / CONSERVACION (1.200 ..)
add("1.200", "Gravitación · órbita circular", [
    ("Gravedad = fuerza centrípeta", "GM_{S}m/r² = mv²/r  ⇒  r = GM_{S}/v²"),
    ("Período", "T = 2πr/v = 2πGM_{S}/v³"),
    ("Dato: GM_{S} = 6,67·10^{−11}·1,99·10^{30}", "GM_{S} = 1,33·10^{20} m³/s² ;  v³ = (3,49·10^{4})³ = 4,25·10^{13}"),
    ("Calcular", "T = 2π·1,33·10^{20}/4,25·10^{13}"),
], "T ≈ 1,96·10^{7} s ≈ 227 días ≈ 0,62 años (la masa M del planeta no interviene)")

add("1.201", "Gravitación · 3.ª ley de Kepler (Júpiter)", [
    ("3.ª ley de Kepler", "(r_{J}/r_{T})³ = (T_{J}/T_{T})²"),
    ("a) cociente de distancias", "r_{J}/r_{T} = 12^{2/3} = 5,24"),
    ("b) velocidad: v = 2πr/T", "v_{J} = v_{T}·(r_{J}/r_{T})/(T_{J}/T_{T}) = 29,8·5,24/12 = 13,0 km/s"),
    ("b) aceleración: a = v²/r", "a_{J} = a_{T}/(r_{J}/r_{T})² = 5,92·10^{−3}/27,5 = 2,2·10^{−4} m/s²"),
], "a) 5,2 veces ;  b) v ≈ 13 km/s ,  a ≈ 0,22 mm/s²")

add("1.203", "Gravitación · tiempo de caída al Sol (Kepler)", [
    ("Caída radial desde el reposo = elipse degenerada", "semieje mayor a = r/2  (r: radio de la órbita terrestre)"),
    ("3.ª ley de Kepler", "(T'/T_{T})² = (a/r)³ = 1/8  ⇒  T' = T_{T}/(2√2)"),
    ("La caída es media órbita", "t = T'/2 = T_{T}/(4√2)"),
    ("Numérico", "t = 365 d / 5,66"),
], "t ≈ 64,6 días ≈ 65 días")

add("1.210", "Conservación · distancia mínima al Sol (parámetro de impacto l)", [
    ("Momento angular (fuerza central); en r_{min}, v ⊥ r", "v_{0}·l = v·r_{min}"),
    ("Energía (desde lejos, U ≈ 0)", "v_{0}²/2 = v²/2 − GM/r_{min}"),
    ("Sustituir v = v_{0}l/r", "v_{0}²r² + 2GM·r − v_{0}²l² = 0"),
    ("Raíz positiva", "r_{min} = (GM/v_{0}²)·[√(1 + (v_{0}²l/GM)²) − 1]"),
], "r_{min} = (GM/v_{0}²)[√(1 + (v_{0}²l/GM)²) − 1]",
    "En tu lista 1.210 aparece dos veces; resuelto una vez.")

add("1.218", "Gravitación · aproximación periódica de dos satélites", [
    ("Período orbital", "T = 2π√(r³/GM_{T})"),
    ("Aproximación máxima cada vez que el interior gana una vuelta", "τ = T_{1}T_{2}/(T_{1} − T_{2})"),
    ("Como T ∝ r^{3/2} y Δr &lt;&lt; r", "T_{1} − T_{2} ≈ (3/2)T_{1}Δr/r  ⇒  τ ≈ (2/3)(r/Δr)T_{1}"),
    ("Numérico: GM_{T} = 3,99·10^{14} m³/s²", "T_{1} = 2π√((7,0·10^{6})³/3,99·10^{14}) = 5,83·10³ s (1,62 h)"),
    ("Resultado", "τ ≈ (2/3)·100·5,83·10³ ≈ 3,9·10^{5} s  (exacto con r y r−Δr: 3,84·10^{5} s)"),
], "τ ≈ 3,9·10^{5} s ≈ 4,5 días")

add("1.228", "Gravitación · velocidades cósmicas de la Luna", [
    ("1.ª velocidad cósmica", "v_{1} = √(g_{L}R_{L}) = √(GM_{L}/R_{L})"),
    ("2.ª velocidad cósmica", "v_{2} = √2·v_{1}"),
    ("Datos Luna (tablas): M_{L} = 7,35·10^{22} kg ; R_{L} = 1,74·10^{6} m", "v_{1} = √(6,67·10^{−11}·7,35·10^{22}/1,74·10^{6}) = 1,68 km/s ;  v_{2} = 2,37 km/s"),
    ("Tierra (tablas)", "v_{1} = 7,9 km/s ;  v_{2} = 11,2 km/s"),
    ("Comparar", "7,9/1,68 ≈ 4,7 ;  11,2/2,37 ≈ 4,7"),
], "Luna: 1,7 km/s y 2,4 km/s, ≈ 4,7 veces menores que en la Tierra")

# ====================================================== SOLIDO
add("1.244", "Sólido · disco de Maxwell (barra que sube)", [
    ("El centro del disco no sube ni baja (a_{cm} = 0)", "2T − mg = 0"),
    ("Rotación del disco (dos hilos, brazo r)", "2T·r = I·β"),
    ("Tensión de cada hilo", "T = mg/2"),
    ("Aceleración angular", "β = mgr/I"),
    ("La barra sube con la aceleración del hilo en el eje", "a = βr = mgr²/I"),
], "T = mg/2 (cada hilo) ;  a = mgr²/I hacia arriba")

add("1.245", "Sólido · barra con fuerza de dirección fija", [
    ("Momento de inercia respecto al eje por B", "I = ml²/3"),
    ("Fuerza de dirección fija ⊥ posición inicial ⇒ brazo l cosφ", "M = F·l·cosφ"),
    ("Trabajo al girar φ", "A = ∫_{0}^{φ} F l cosφ dφ = F·l·sinφ"),
    ("Teorema trabajo–energía (parte del reposo)", "Iω²/2 = A"),
    ("Despejar", "ω = √(6F sinφ/(m·l))"),
], "ω = √(6F sinφ / (m·l))")

add("1.248", "Sólido · cilindro girando en una esquina (fricción)", [
    ("Fricciones: N_{1} suelo, N_{2} pared", "f_{1} = kN_{1} ;  f_{2} = kN_{2}"),
    ("Equilibrio horizontal (f_{1} aprieta contra la pared)", "N_{2} = kN_{1}"),
    ("Equilibrio vertical", "N_{1} + f_{2} = mg  ⇒  N_{1}(1 + k²) = mg"),
    ("Momento de frenado", "M = (f_{1}+f_{2})R = k(1+k)mgR/(1+k²)"),
    ("Aceleración angular (I = mR²/2)", "β = M/I = 2k(1+k)g/[(1+k²)R]"),
    ("Cinemática de rotación", "ω_{0}² = 2βφ  ⇒  φ = ω_{0}²/(2β)"),
    ("Número de vueltas", "N = φ/2π = ω_{0}²R(1+k²)/[8πk(1+k)g]"),
], "N = ω_{0}²R(1 + k²) / [8πk(1 + k)g]",
    "Se asume que el cilindro gira en el sentido en que ambas fricciones lo aprietan contra la esquina (flecha de la Fig. 1.58).")

# ====================================================== HIDRODINAMICA
add("1.316", "Hidrodinámica · tubo con dos manómetros (Venturi)", [
    ("Continuidad", "S_{1}v_{1} = S_{2}v_{2} = Q"),
    ("Bernoulli (misma altura)", "p_{1} + ρv_{1}²/2 = p_{2} + ρv_{2}²/2"),
    ("Diferencia de presiones = desnivel manométrico", "p_{1} − p_{2} = ρgΔh"),
    ("Combinar", "gΔh = (Q²/2)(1/S_{2}² − 1/S_{1}²)"),
    ("Despejar Q", "Q = S_{1}S_{2}·√(2gΔh/(S_{1}² − S_{2}²))"),
], "Q = S_{1}S_{2}√(2gΔh / (S_{1}² − S_{2}²))")

add("1.317", "Hidrodinámica · tubo de Pitot en gasoducto", [
    ("En la boca frontal del Pitot el gas se detiene", "p_{0} = p + ρv²/2"),
    ("Manómetro de líquido", "p_{0} − p = (ρ_{0} − ρ)gΔh ≈ ρ_{0}gΔh  (ρ &lt;&lt; ρ_{0})"),
    ("Velocidad del gas", "v = √(2ρ_{0}gΔh/ρ)"),
    ("Caudal (velocidad uniforme en S)", "Q = v·S"),
], "Q = S·√(2ρ_{0}gΔh / ρ)")

add("1.320", "Hidrodinámica · chorro en tubo doblado dentro de una corriente", [
    ("En la boca del tubo el agua se frena (presión de remanso)", "p_{ent} = p_{0} + ρv²/2"),
    ("Altura que alcanzaría el nivel sobre la superficie", "H = v²/(2g)"),
    ("El chorro sube sobre el agujero (situado a h_{0})", "h = v²/(2g) − h_{0}"),
    ("Numérico", "h = 6,25/19,6 − 0,12 = 0,319 − 0,12"),
], "h ≈ 0,20 m = 20 cm")

add("1.321", "Hidrodinámica · cilindro sobre un orificio (huelgo)", [
    ("Flujo radial en el huelgo: Q = 2πrδ·v(r) = cte", "v(r) = v_{1}R_{1}/r"),
    ("Bernoulli desde el depósito en reposo (p_{0} + ρgh)", "p(r) + ρv(r)²/2 = p_{0} + ρgh"),
    ("En el orificio sale a presión atmosférica: p(R_{1}) = p_{0}", "v_{1}² = 2gh"),
    ("Presión en el huelgo (R_{1} ≤ r ≤ R_{2})", "p(r) = p_{0} + ρgh·(1 − R_{1}²/r²)"),
    ("Fuerza que levanta el cilindro (exceso sobre p_{0})", "F = ∫_{R1}^{R2}(p − p_{0})2πr dr = 2πρgh[(R_{2}²−R_{1}²)/2 − R_{1}² ln(R_{2}/R_{1})]"),
], "p(r) = p_{0} + ρgh(1 − R_{1}²/r²) ;  F = πρgh[R_{2}² − R_{1}²(1 + 2 ln(R_{2}/R_{1}))]",
    "El enunciado de 1.321 está cortado en la foto; resolví lo habitual del Irodov: presión en el huelgo y fuerza de levantamiento. Mándame el resto del texto para confirmar.")

# ====================================================== RELATIVIDAD
add("1.340", "Relatividad · contracción de longitud", [
    ("Contracción", "l = l_{0}√(1 − β²)"),
    ("Condición: η = 0,5 % menor", "l = l_{0}(1 − η)"),
    ("Despejar β", "β² = 1 − (1−η)² = η(2−η) = 0,005·1,995"),
    ("Velocidad", "v = c√(η(2−η)) = 0,0999c"),
], "v ≈ 0,10c ≈ 3,0·10^{4} km/s")

add("1.341", "Relatividad · perímetro de un triángulo en movimiento", [
    ("a) Movimiento a lo largo de un lado: ese lado se contrae", "a√(1−β²)"),
    ("a) Los otros 2 lados: componente ∥ = a/2 (se contrae), ⊥ = a√3/2 (no)", "√((a/2)²(1−β²) + 3a²/4) = a√(1 − β²/4)"),
    ("a) Perímetro", "P = a[√(1−β²) + √(4−β²)]"),
    ("b) Movimiento a lo largo de una bisectriz (altura a√3/2 ∥; base a ⊥ no cambia)", "lados: √(3a²(1−β²)/4 + a²/4) = a√(1 − 3β²/4)"),
    ("b) Perímetro", "P = a[1 + √(4 − 3β²)]"),
    ("Límites", "V &lt;&lt; c: P ≈ 3a(1 − β²/4) en ambos casos ;  V → c: P_{a} → a√3 ≈ 1,73a ;  P_{b} → 2a"),
], "a) P = a[√(1−β²) + √(4−β²)] ;  b) P = a[1 + √(4−3β²)]")

add("1.342", "Relatividad · longitud propia de una barra inclinada", [
    ("En el laboratorio", "l_{∥} = l cosθ ;  l_{⊥} = l sinθ"),
    ("Propias: solo la componente ∥ se alarga", "l_{0∥} = l_{∥}/√(1−β²) ;  l_{0⊥} = l_{⊥}"),
    ("Longitud propia", "l_{0} = l·√(sin²θ + cos²θ/(1−β²))"),
    ("Numérico (β = 0,5 ; θ = 45°)", "l_{0} = 1,00·√(0,5 + 0,5/0,75)"),
], "l_{0} ≈ 1,08 m")

add("1.343", "Relatividad · cono en movimiento", [
    ("Cono en reposo: radio R, altura H = R/tanθ ; solo H se contrae", "H' = H√(1−β²) ;  R' = R  (β = 4/5 ⇒ √(1−β²) = 0,6)"),
    ("a) Semiángulo", "tanθ' = R'/H' = tanθ/√(1−β²) = 1/0,6  ⇒  θ' = 59°"),
    ("b) Generatriz: L_{0} = R/sinθ → L'", "L'/L_{0} = √(sin²θ + cos²θ(1−β²)) = √(1 − β²cos²θ)"),
    ("Área lateral S = πRL (R no cambia)", "S = S_{0}√(1 − β²cos²θ) = 4,0·√(1 − 0,64·0,5) = 4,0·0,825"),
], "a) θ' ≈ 59° ;  b) S ≈ 3,3 m²")

add("1.344", "Relatividad · dilatación del tiempo", [
    ("Un reloj en movimiento marca el tiempo propio", "t' = t√(1−β²)"),
    ("Retraso Δt", "Δt = t − t' = t(1 − √(1−β²))  ⇒  √(1−β²) = 1 − Δt/t = 0,98"),
    ("Despejar", "β = √(1 − 0,98²) = 0,199"),
], "v ≈ 0,20c ≈ 6,0·10^{7} m/s")

add("1.345", "Relatividad · barra frente a una marca", [
    ("En K la marca pasa por la barra contraída", "Δt = l_{0}√(1−β²)/v"),
    ("En el sistema de la barra la marca recorre l_{0}", "Δt' = l_{0}/v"),
    ("Cociente", "Δt/Δt' = √(1−β²) = 20/25 = 0,8  ⇒  β = 0,6 ,  v = 1,8·10^{8} m/s"),
    ("Longitud propia", "l_{0} = vΔt' = 1,8·10^{8}·25·10^{−9}"),
], "l_{0} = 4,5 m")

add("1.346", "Relatividad · distancia recorrida por partícula inestable", [
    ("Dilatación del tiempo", "Δt = Δt_{0}/√(1−β²)  ⇒  √(1−β²) = 10/20 = 0,5 ,  β = 0,866"),
    ("Distancia en el laboratorio", "l = vΔt = cΔt√(1 − (Δt_{0}/Δt)²)"),
    ("Numérico", "l = 3·10^{8}·20·10^{−9}·0,866"),
], "l ≈ 5,2 m")

add("1.347", "Relatividad · mesón μ", [
    ("Tiempo en K", "Δt = l/v = 3000/(0,990·3·10^{8}) = 10,1 μs"),
    ("a) Tiempo propio", "Δt_{0} = Δt√(1−β²) = 10,1 μs·0,141"),
    ("b) Distancia «desde su punto de vista» (contracción)", "l_{0}' = vΔt_{0} = l√(1−β²) = 3,0 km·0,141"),
], "a) Δt_{0} ≈ 1,4 μs ;  b) ≈ 0,42 km")

add("1.348", "Relatividad · distancia propia entre dos partículas", [
    ("Distancia entre ellas en el laboratorio", "l = vΔt = (3/4)·3·10^{8}·50·10^{−9} = 11,25 m"),
    ("Distancia propia (en su propio sistema)", "l_{0} = l/√(1−β²) = 11,25/√(1 − 9/16)"),
], "l_{0} ≈ 17 m")

add("1.349", "Relatividad · barra y regla (simultaneidad)", [
    ("Marcas simultáneas en el sistema de la regla: barra contraída", "Δx_{1} = l_{0}√(1−β²)"),
    ("Marcas simultáneas en el sistema de la barra: la separación es l_{0} y la regla se contrae", "l_{0} = Δx_{2}√(1−β²)  ⇒  Δx_{2} = l_{0}/√(1−β²)"),
    ("Multiplicar", "l_{0} = √(Δx_{1}Δx_{2}) = √36 = 6,0 m"),
    ("Dividir", "√(1−β²) = Δx_{1}/l_{0} = 2/3  ⇒  β = √(1 − Δx_{1}/Δx_{2}) = 0,745"),
], "l_{0} = 6,0 m ;  v ≈ 0,75c ≈ 2,2·10^{8} m/s")

add("1.350", "Relatividad · dos barras que se cruzan", [
    ("En el sistema de una barra, la otra mide", "l = l_{0}√(1−β²)"),
    ("Entre la coincidencia de extremos izq. y der., la otra barra avanza la diferencia de longitudes", "vΔt = l_{0} − l_{0}√(1−β²)"),
    ("Con D = cΔt/l_{0}: √(1−β²) = 1 − βD", "1 − β² = 1 − 2βD + β²D²  ⇒  β = 2D/(1 + D²)"),
    ("Velocidad relativa", "v = 2c·D/(1+D²) = 2l_{0}c²Δt/(l_{0}² + c²Δt²)"),
], "v = 2 l_{0} c² Δt / (l_{0}² + c²Δt²)")

add("1.351", "Relatividad · desintegración simultánea en el sistema propio", [
    ("Distancia propia entre partículas", "l_{0} = l/√(1−β²) = 120/0,141 = 851 m ;  γ = 7,09"),
    ("En su sistema: simultáneos, Δt_{0} = 0, Δx_{0} = l_{0}", "Δt = γ(Δt_{0} + vΔx_{0}/c²) = γ v l_{0}/c²"),
    ("Sustituir", "Δt = v·l/[c²(1−β²)] = 0,99·120/(3·10^{8}·0,0199)"),
    ("¿Cuál después? t = γ(t_{0} + v x_{0}/c²) crece con x_{0}", "se desintegra más tarde la partícula delantera"),
], "Δt ≈ 20 μs ;  más tarde la que va adelante")

add("1.352", "Relatividad · barra AB en K (A delante)", [
    ("En K, llevar la posición de B al instante t_{A}", "x_{B}(t_{A}) = x_{B} + v(t_{A} − t_{B})"),
    ("a) Longitud en K", "l = x_{A} − x_{B} − v(t_{A} − t_{B})"),
    ("a) Longitud propia", "l_{0} = l/√(1−β²) = [x_{A} − x_{B} + v(t_{B} − t_{A})]/√(1 − v²/c²)"),
    ("b) Marcar el extremo trasero un tiempo τ antes que el delantero", "x_{A} − x_{B}' = l + vτ = l_{0}"),
    ("b) Despejar τ", "τ = (l_{0} − l)/v = (l_{0}/v)(1 − √(1−β²))"),
], "a) l_{0} = [x_{A} − x_{B} + v(t_{B}−t_{A})]/√(1−v²/c²) ;  b) τ = (l_{0}/v)(1 − √(1−v²/c²)) (B antes que A)",
    "El texto de 1.352 sale partido entre dos fotos; lo uní. Verifica el sentido del signo en b).")

add("1.353", "Relatividad · relojes en dos barras (Fig. 1.91)", [
    ("Origen: B' frente a A ⇒ t = t' = 0 (K: barra AB ; K': barra A'B', se mueve a v)", "A en x = 0, B en x = l_{0} ;  B' en x' = 0, A' en x' = −l_{0}"),
    ("a) B' llega a B: en K recorre l_{0} a rapidez v", "reloj B marca t_{B} = l_{0}/v"),
    ("a) Reloj B' = tiempo propio del trayecto", "t'_{B'} = (l_{0}/v)√(1−β²)"),
    ("b) A' llega a A: en K, A' está a l_{0}√(1−β²) detrás", "reloj A marca t_{A} = (l_{0}/v)√(1−β²)"),
    ("b) Reloj A' (Lorentz, x = 0): t' = γt", "t'_{A'} = γ·(l_{0}/v)√(1−β²) = l_{0}/v"),
], "a) B: l_{0}/v ;  B': (l_{0}/v)√(1−β²).   b) A: (l_{0}/v)√(1−β²) ;  A': l_{0}/v")

add("1.355", "Relatividad · punto de relojes iguales", [
    ("Transformación del tiempo (K' se mueve con V en +x)", "t' = γ(t − Vx/c²)"),
    ("Condición: indicaciones iguales todo el tiempo", "t' = t  ⇒  t/γ = t − Vx/c²"),
    ("Despejar x(t)", "x = (c²/V)(1 − √(1−β²))·t"),
    ("Velocidad del punto (derivar)", "dx/dt = (c²/V)(1 − √(1−β²)) = V/(1 + √(1−β²))"),
    ("Verificar", "1/(1 + √(1−β²)) &lt; 1  ⇒  dx/dt &lt; V"),
], "dx/dt = V / (1 + √(1 − V²/c²)) &lt; V")

add("1.358", "Relatividad · transformación de velocidades en el plano", [
    ("K' se mueve con V en +x ; datos en K", "<b>v</b> = (v_{x}, v_{y}) ;  <b>V</b> = (V, 0)"),
    ("Componente x", "v'_{x} = (v_{x} − V)/(1 − V v_{x}/c²)"),
    ("Componente y", "v'_{y} = v_{y}√(1−V²/c²)/(1 − V v_{x}/c²)"),
    ("Módulo y dirección", "v' = √(v'_{x}² + v'_{y}²) ;  tanθ' = v'_{y}/v'_{x}"),
], "v' = √[(v_{x}−V)² + v_{y}²(1−V²/c²)] / (1 − V v_{x}/c²)")

SECCIONES = [
    ("A. Cinemática (1.1 – 1.13)", ["1.1", "1.2", "1.3", "1.8", "1.9", "1.10", "1.11", "1.12", "1.13"]),
    ("B. Gravitación y conservación (1.200 – 1.228)", ["1.200", "1.201", "1.203", "1.210", "1.218", "1.228"]),
    ("C. Mecánica del sólido (1.244 – 1.248)", ["1.244", "1.245", "1.248"]),
    ("D. Hidrodinámica (1.316 – 1.321)", ["1.316", "1.317", "1.320", "1.321"]),
    ("E. Mecánica relativista (1.340 – 1.358)", ["1.340", "1.341", "1.342", "1.343", "1.344", "1.345", "1.346", "1.347",
                                                    "1.348", "1.349", "1.350", "1.351", "1.352", "1.353", "1.355", "1.358"]),
]
