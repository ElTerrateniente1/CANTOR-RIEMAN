#!/usr/bin/env Rscript
# =============================================================================
# Prueba de la hipotesis del manuscrito (piloto Raphanus sativus)
#
# "...plants grown in the amended simulant will show higher survival [...] than
#  those grown in unamended LHS-1, and this response will vary with the
#  proportion of ionitoponic substrate in the growth medium."
#
# Poblacion de la hipotesis: sustrato LHS-1, proporcion de sustrato ionitoponico
# 0 % (Control), 5 % (Additive 5%) y 10 % (Additive 10%). Respuesta: supervivencia.
#
#   C1 (efecto de la enmienda, direccional):
#       H0: (mu5 + mu10)/2 <= mu0      H1: (mu5 + mu10)/2 > mu0
#   C2 (dependencia de la proporcion, no direccional):
#       H0: mu10 = mu5                 H1: mu10 != mu5
#   C1 y C2 son contrastes ortogonales (Helmert): particionan los 2 gl del
#   factor dosis del ANOVA.
#
# Fuente unica de datos: tablas (media +/- DE) de las imagenes.
# Supuesto S1: 5 unidades por celda, 4 semillas por unidad.
# Solo R base. Ejecutar: Rscript prueba_hipotesis.R
# =============================================================================

options(digits = 4, width = 120)
alpha <- 0.05; n_u <- 5
titulo <- function(x) cat("\n", strrep("=", 100), "\n", x, "\n", strrep("=", 100), "\n", sep = "")

# Orden de celdas: LHS-1 (Control, A5, A10, Conventional), River sand (idem)
celdas <- data.frame(
  sustrato    = rep(c("LHS-1", "River sand"), each = 4),
  tratamiento = rep(c("Control", "Additive 5%", "Additive 10%", "Conventional"), 2),
  germ_m = c(100, 100, 95, 65, 100, 75, 95, 90),
  sup_m  = c(55, 65, 85, 63.3, 45, 55, 58.3, 48.3),
  sup_s  = c(32.4, 29.6, 22.4, 37.3, 20.4, 37.1, 39.1, 31.2),
  dli_m  = c(10.73, 10.73, 9.52, 9.52, 8.87, 8.87, 10.77, 10.77))

# Termino de error principal: CME agrupado de las 8 celdas del experimento
cme <- mean(celdas$sup_s^2); gl_e <- 8 * (n_u - 1)

contraste <- function(w, lado = "dos", s = celdas$sup_s, error = "agrupado") {
  est <- sum(w * celdas$sup_m)
  if (error == "agrupado") { ee <- sqrt(mean(s^2) * sum(w^2) / n_u); gl <- gl_e }
  if (error == "celdas")   { u <- w != 0; ee <- sqrt(mean(s[u]^2) * sum(w^2) / n_u); gl <- sum(u) * (n_u - 1) }
  if (error == "welch")    { v <- w^2 * s^2 / n_u; ee <- sqrt(sum(v)); gl <- sum(v)^2 / sum(v^2 / (n_u - 1)) }
  tt <- est / ee
  data.frame(estimacion = est, EE = ee, t = tt, gl = gl,
             p = if (lado == "mayor") pt(tt, gl, lower.tail = FALSE) else 2 * pt(-abs(tt), gl),
             IC95_inf = est - qt(1 - alpha / 2, gl) * ee, IC95_sup = est + qt(1 - alpha / 2, gl) * ee,
             cota_inf_95_unilateral = est - qt(1 - alpha, gl) * ee)
}
w_C1 <- c(-1, .5, .5, 0, 0, 0, 0, 0)     # enmendado (5 % y 10 %) - sin enmendar
w_C2 <- c( 0, -1,  1, 0, 0, 0, 0, 0)     # 10 % - 5 %

# ----------------------------------------------------------------------------
titulo("1. Datos de la hipotesis: supervivencia (%) en LHS-1 segun proporcion de sustrato ionitoponico")
print(cbind(proporcion = c("0 %", "5 %", "10 %"), celdas[1:3, c("sup_m", "sup_s", "germ_m", "dli_m")], n = n_u),
      row.names = FALSE)

# ----------------------------------------------------------------------------
titulo("2. ANOVA de una via (dosis en LHS-1) con particion ortogonal; error = CME agrupado (32 gl)")
m3 <- celdas$sup_m[1:3]
sc <- c(n_u * sum((m3 - mean(m3))^2),
        n_u * sum(w_C1 * celdas$sup_m)^2 / sum(w_C1^2),
        n_u * sum(w_C2 * celdas$sup_m)^2 / sum(w_C2^2))
av <- data.frame(gl = c(2, 1, 1), SC = sc, CM = sc / c(2, 1, 1),
                 row.names = c("Dosis (0, 5, 10 %)", "  C1: enmendado vs sin enmendar", "  C2: 10 % vs 5 %"))
av$F <- av$CM / cme; av$p_bilateral <- pf(av$F, av$gl, gl_e, lower.tail = FALSE)
print(round(rbind(av, Error = c(gl_e, cme * gl_e, cme, NA, NA)), 4))

# ----------------------------------------------------------------------------
titulo("3. PRUEBA DE HIPOTESIS (contrastes planificados; diferencias en puntos porcentuales)")
prim <- rbind("C1 enmendado - sin enmendar (unilateral, H1: > 0)" = contraste(w_C1, "mayor"),
              "C2 10 % - 5 % (bilateral)"                         = contraste(w_C2, "dos"))
prim$p_Holm <- p.adjust(prim$p, "holm")
prim$decision <- ifelse(prim$p_Holm < alpha, "Rechazar H0", "No rechazar H0")
print(cbind(round(prim[, 1:9], 3), decision = prim$decision))
cat(sprintf("p bilateral de C1 (referencia): %.3f\n", contraste(w_C1)$p))

cat("\nComplementarios: cada proporcion frente a 0 % (unilateral, Holm). Con dosis equiespaciadas,\n",
    "'10 % - 0 %' coincide con el contraste de tendencia lineal.\n", sep = "")
comp <- rbind(" 5 % - 0 %"                      = contraste(c(-1, 1, 0, 0, 0, 0, 0, 0), "mayor"),
              "10 % - 0 % (= tendencia lineal)" = contraste(c(-1, 0, 1, 0, 0, 0, 0, 0), "mayor"))
comp$p_Holm <- p.adjust(comp$p, "holm"); print(round(comp, 3))

# ----------------------------------------------------------------------------
titulo("4. Sensibilidad del resultado al termino de error")
de_alt <- c(32.6, 28.5, 22.4, 37.5, 20.9, 37.1, 37.3, 30.3)  # DE reproducibles mas cercanas (analisis_preliminar.R, 1c)
sens <- function(w, lado) rbind(
  "CME agrupado, 8 celdas (principal)"   = contraste(w, lado)[, c("EE", "t", "gl", "p")],
  "CME solo celdas del contraste"        = contraste(w, lado, error = "celdas")[, c("EE", "t", "gl", "p")],
  "Welch-Satterthwaite (sin agrupar)"    = contraste(w, lado, error = "welch")[, c("EE", "t", "gl", "p")],
  "CME agrupado con DE alternativas"     = contraste(w, lado, s = de_alt)[, c("EE", "t", "gl", "p")])
cat("C1 (unilateral):\n"); print(round(sens(w_C1, "mayor"), 3))
cat("C2 (bilateral):\n");  print(round(sens(w_C2, "dos"), 3))

# Analisis a nivel de semilla (anticonservador: ignora el agrupamiento por maceta).
# El total de sobrevivientes se deduce de la media de razones y de las germinadas por unidad.
cat("\nSensibilidad a nivel de semilla (supone semillas independientes):\n")
g_cfg <- list(c(4, 4, 4, 4, 4), c(4, 4, 4, 4, 4), c(4, 4, 4, 4, 3))   # germinadas por unidad (analisis_preliminar.R, 1c)
sob <- sapply(1:3, function(i) {
  g <- g_cfg[[i]]; S <- as.matrix(expand.grid(lapply(g, function(x) 0:x)))
  ok <- abs(rowMeans(100 * sweep(S, 2, g, "/")) - celdas$sup_m[i]) <= 0.05 + 1e-6
  u <- unique(rowSums(S[ok, , drop = FALSE])); stopifnot(length(u) == 1); u })
ger <- sapply(g_cfg, sum)
print(data.frame(proporcion = c("0 %", "5 %", "10 %"), sobrevivientes = sob, germinadas = ger, prop = round(sob / ger, 3)))
f1 <- fisher.test(matrix(c(sum(sob[2:3]), sum(ger[2:3] - sob[2:3]), sob[1], ger[1] - sob[1]), 2), alternative = "greater")
f2 <- fisher.test(matrix(c(sob[3], ger[3] - sob[3], sob[2], ger[2] - sob[2]), 2))
gr <- as.matrix(expand.grid(lapply(ger, function(x) 0:x))); gr <- gr[rowSums(gr) == sum(sob), ]
pr <- apply(gr, 1, function(r) prod(choose(ger, r))) / choose(sum(ger), sum(sob))
p_tend <- sum(pr[gr %*% c(0, 5, 10) >= sum(sob * c(0, 5, 10)) - 1e-9])
cat(sprintf("  C1 Fisher unilateral, enmendado (%d/%d) vs sin enmendar (%d/%d): p = %.3f\n",
            sum(sob[2:3]), sum(ger[2:3]), sob[1], ger[1], f1$p.value))
cat(sprintf("  C2 Fisher bilateral, 10 %% (%d/%d) vs 5 %% (%d/%d): p = %.3f\n", sob[3], ger[3], sob[2], ger[2], f2$p.value))
cat(sprintf("  Tendencia exacta unilateral 0 -> 5 -> 10 %%: p = %.3f\n", p_tend))

# Las semillas de una misma maceta no son independientes: la varianza observada entre
# macetas supera a la binomial. Correccion de la tendencia por ese factor (tipo Rao-Scott).
p_i <- sob / ger; n_bar <- ger / n_u
phi <- celdas$sup_s[1:3]^2 / (100^2 * p_i * (1 - p_i) / n_bar)
z_ca <- sqrt(unname(prop.trend.test(sob, ger, score = c(0, 5, 10))$statistic))
cat(sprintf("  Sobredispersion entre macetas (var. observada / var. binomial) en 0, 5 y 10 %%: %s; media = %.2f\n",
            paste(sprintf("%.2f", phi), collapse = ", "), mean(phi)))
cat(sprintf("  Tendencia de Cochran-Armitage unilateral: z = %.2f, p = %.3f | corregida por sobredispersion: z = %.2f, p = %.3f\n",
            z_ca, pnorm(z_ca, lower.tail = FALSE), z_ca / sqrt(mean(phi)), pnorm(z_ca / sqrt(mean(phi)), lower.tail = FALSE)))

# ----------------------------------------------------------------------------
titulo("5. Contexto de la hipotesis (secundario, bilateral, sin ajuste)")
ctx <- rbind(
  "Premisa: LHS-1 sin enmendar - LHS-1 con sol. convencional"  = contraste(c(1, 0, 0, -1, 0, 0, 0, 0)),
  "Premisa: LHS-1 sin enmendar - River sand sin enmendar"      = contraste(c(1, 0, 0, 0, -1, 0, 0, 0)),
  "Compensacion: LHS-1 enmendado - LHS-1 con sol. convencional" = contraste(c(0, .5, .5, -1, 0, 0, 0, 0)),
  "Efecto de la enmienda en River sand"                        = contraste(c(0, 0, 0, 0, -1, .5, .5, 0)),
  "Especificidad: efecto en LHS-1 - efecto en River sand"      = contraste(c(-1, .5, .5, 0, 1, -.5, -.5, 0)))
print(round(ctx[, c("estimacion", "EE", "t", "p", "IC95_inf", "IC95_sup")], 3))

# ----------------------------------------------------------------------------
titulo("6. Potencia y tamano de muestra para el experimento confirmatorio (DE = raiz del CME)")
potencia <- function(n, delta, w, lado, gl = 3 * (n - 1)) {
  ncp <- delta / sqrt(cme * sum(w^2) / n)
  if (lado == "mayor") pt(qt(1 - alpha, gl), gl, ncp, lower.tail = FALSE)
  else pt(qt(1 - alpha / 2, gl), gl, ncp, lower.tail = FALSE) + pt(-qt(1 - alpha / 2, gl), gl, ncp)
}
n_req <- function(delta, w, lado) (2:1000)[which(sapply(2:1000, potencia, delta = delta, w = w, lado = lado) >= 0.80)[1]]
cat(sprintf("DE residual supuesta: %.1f puntos\n", sqrt(cme)))
cat(sprintf("C1: potencia del piloto para la diferencia observada (%.0f puntos): %.2f | unidades por grupo para potencia 0.80: %d\n",
            prim$estimacion[1], potencia(n_u, prim$estimacion[1], w_C1, "mayor", gl_e), n_req(prim$estimacion[1], w_C1, "mayor")))
cat(sprintf("C2: potencia del piloto para la diferencia observada (%.0f puntos): %.2f | unidades por grupo para potencia 0.80: %d\n",
            prim$estimacion[2], potencia(n_u, prim$estimacion[2], w_C2, "dos", gl_e), n_req(prim$estimacion[2], w_C2, "dos")))
