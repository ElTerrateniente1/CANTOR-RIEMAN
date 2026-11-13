#!/usr/bin/env Rscript
# =============================================================================
# Piloto Raphanus sativus: simulante LHS-1 vs arena de rio x 4 tratamientos
# Iteracion 1: control de calidad de las tablas resumen + inferencia preliminar
#
# Fuente UNICA de datos: tablas (media +/- DE) transcritas de las imagenes.
# Supuesto de diseno S1 (deducido del texto "160 seeds ... 40 experimental units"):
#   160 semillas / 40 unidades = 4 semillas por unidad
#   40 unidades / 8 celdas     = 5 unidades por celda (diseno balanceado)
# Solo R base. Ejecutar: Rscript analisis_preliminar.R
# =============================================================================

options(digits = 4, width = 120)
alpha <- 0.05   # significancia propuesta (a confirmar)
n_u   <- 5      # unidades por celda (S1)
n_s   <- 4      # semillas por unidad (S1)
titulo <- function(x) cat("\n", strrep("=", 100), "\n", x, "\n", strrep("=", 100), "\n", sep = "")

# ----------------------------------------------------------------------------
# 0. Datos transcritos
# ----------------------------------------------------------------------------
niv_sus <- c("LHS-1", "River sand")
niv_trt <- c("Control", "Additive 5%", "Additive 10%", "Conventional")

celdas <- data.frame(
  sustrato    = factor(rep(niv_sus, each = 4), levels = niv_sus),
  tratamiento = factor(rep(niv_trt, 2), levels = niv_trt),
  germ_m = c(100, 100, 95, 65, 100, 75, 95, 90),             # Germination (%)
  germ_s = c(0, 0, 11.2, 41.8, 0, 27.9, 11.2, 13.7),
  sup_m  = c(55, 65, 85, 63.3, 45, 55, 58.3, 48.3),          # Survival (%)
  sup_s  = c(32.4, 29.6, 22.4, 37.3, 20.4, 37.1, 39.1, 31.2),
  dli_m  = c(10.73, 10.73, 9.52, 9.52, 8.87, 8.87, 10.77, 10.77),  # DLI (mol m-2 d-1)
  dli_s  = c(1.02, 1.02, 1.00, 0.97, 1.10, 1.10, 1.08, 1.08)
)
marg_trt <- data.frame(nivel = niv_trt,
  germ_m = c(100, 87.5, 95, 77.5), germ_s = c(0, 21.8, 10.5, 32.4),
  sup_m  = c(50, 60, 71.7, 55.8),  sup_s  = c(26.7, 32.4, 31.4, 34.3),
  dli_m  = c(9.80, 9.80, 10.15, 10.15))
marg_sus <- data.frame(nivel = niv_sus,
  germ_m = c(90, 90), germ_s = c(23.7, 18.7),
  sup_m  = c(67.1, 51.7), sup_s = c(31.6, 32.4),
  dli_m  = c(10.13, 9.82))

titulo("0. DATOS TRANSCRITOS (por celda)")
print(celdas, row.names = FALSE)

# ----------------------------------------------------------------------------
# 1. Control de calidad: coherencia interna de las tablas
# ----------------------------------------------------------------------------
titulo("1a. QC - medias marginales reportadas vs. promedio de medias de celda")
qc_m <- function(v, f) round(tapply(celdas[[v]], celdas[[f]], mean), 2)
print(rbind(germ_calc = qc_m("germ_m", "tratamiento"), germ_rep = marg_trt$germ_m,
            sup_calc  = qc_m("sup_m",  "tratamiento"), sup_rep  = marg_trt$sup_m,
            dli_calc  = qc_m("dli_m",  "tratamiento"), dli_rep  = marg_trt$dli_m))
print(rbind(germ_calc = qc_m("germ_m", "sustrato"), germ_rep = marg_sus$germ_m,
            sup_calc  = qc_m("sup_m",  "sustrato"), sup_rep  = marg_sus$sup_m,
            dli_calc  = qc_m("dli_m",  "sustrato"), dli_rep  = marg_sus$dli_m))

titulo("1b. QC - DE marginal reportada vs. DE implicada por las celdas (n = 5 por celda)")
# Ley de la varianza total: SC_total = SC_dentro + SC_entre
de_marg <- function(m, s, n = n_u)
  sqrt((sum((n - 1) * s^2) + n * sum((m - mean(m))^2)) / (n * length(m) - 1))
de_por <- function(vm, vs, f)
  sapply(split(celdas, celdas[[f]]), function(d) de_marg(d[[vm]], d[[vs]]))
print(round(rbind(
  germ_implicada = c(de_por("germ_m", "germ_s", "tratamiento"), de_por("germ_m", "germ_s", "sustrato")),
  germ_reportada = c(marg_trt$germ_s, marg_sus$germ_s),
  sup_implicada  = c(de_por("sup_m", "sup_s", "tratamiento"), de_por("sup_m", "sup_s", "sustrato")),
  sup_reportada  = c(marg_trt$sup_s, marg_sus$sup_s)), 1))

titulo("1c. QC - reconstruccion de conteos por unidad (5 unidades x 4 semillas)")
coincide <- function(v, ref, tol = 0.05 + 1e-6) abs(v - ref) <= tol   # redondeo a 1 decimal
fila_de  <- function(P) {            # DE muestral por fila, admite NA
  k <- rowSums(!is.na(P)); m <- rowMeans(P, na.rm = TRUE)
  sqrt(rowSums((P - m)^2, na.rm = TRUE) / (k - 1))
}
g_all <- as.matrix(expand.grid(rep(list(n_s:0), n_u)))
g_all <- g_all[apply(g_all, 1, function(r) all(diff(r) <= 0)), ]     # multiconjuntos (orden descendente)
g_pct <- 100 * g_all / n_s

rec_germ <- vector("list", nrow(celdas))
cat("Germinacion: configuraciones (germinadas por unidad) compatibles con media +/- DE\n")
for (i in seq_len(nrow(celdas))) {
  m_ok <- coincide(rowMeans(g_pct), celdas$germ_m[i])
  s_i  <- fila_de(g_pct)
  hit  <- which(m_ok & coincide(s_i, celdas$germ_s[i]))
  if (length(hit) == 0) {            # sin coincidencia: se guardan las 2 mas cercanas
    cand <- which(m_ok); hit2 <- cand[order(abs(s_i[cand] - celdas$germ_s[i]))][1:2]
    rec_germ[[i]] <- g_all[hit2, , drop = FALSE]
    txt <- paste0("NINGUNA. Mas cercanas: ",
                  paste(apply(g_all[hit2, , drop = FALSE], 1, paste, collapse = ","),
                        sprintf("(DE=%.1f)", s_i[hit2]), collapse = " | "))
  } else {
    rec_germ[[i]] <- g_all[hit, , drop = FALSE]
    txt <- paste(apply(g_all[hit, , drop = FALSE], 1, paste, collapse = ","), collapse = " | ")
  }
  cat(sprintf("  %-10s %-13s %5.1f +/- %4.1f  ->  %s\n", celdas$sustrato[i], celdas$tratamiento[i],
              celdas$germ_m[i], celdas$germ_s[i], txt))
}

# Supervivencia: se prueban 3 definiciones posibles del porcentaje por unidad
#   A0: sobrevivientes/germinadas, unidad sin germinacion = 0 %
#   A1: sobrevivientes/germinadas, unidad sin germinacion excluida
#   B : sobrevivientes/sembradas (denominador 4)
cat("\nSupervivencia: existe alguna configuracion entera que reproduzca media +/- DE?\n")
cat("  (entre parentesis: DE alcanzable mas cercana cuando la media si coincide)\n")
prueba <- function(P, m, s) {
  mm <- rowMeans(P, na.rm = TRUE); ss <- fila_de(P); okm <- coincide(mm, m)
  c(any(okm & coincide(ss, s), na.rm = TRUE),
    if (any(okm)) ss[okm][which.min(abs(ss[okm] - s))] else NA)
}
for (i in seq_len(nrow(celdas))) {
  tot <- round(celdas$germ_m[i] / 100 * n_u * n_s)
  G   <- g_all[rowSums(g_all) == tot, , drop = FALSE]
  out <- matrix(NA, 0, 6)
  for (r in seq_len(nrow(G))) {
    g <- G[r, ]
    S <- as.matrix(expand.grid(lapply(g, function(k) 0:k)))
    A <- 100 * sweep(S, 2, g, "/")                 # NaN donde g = 0
    A0 <- A; A0[is.nan(A0)] <- 0
    A1 <- A; A1[is.nan(A1)] <- NA
    out <- rbind(out, c(prueba(A0, celdas$sup_m[i], celdas$sup_s[i]),
                        prueba(A1, celdas$sup_m[i], celdas$sup_s[i]),
                        prueba(100 * S / n_s, celdas$sup_m[i], celdas$sup_s[i])))
  }
  res <- sapply(c(1, 3, 5), function(j) {
    cerca <- out[, j + 1]; cerca <- cerca[!is.na(cerca)]
    sprintf("%-2s (%s)", if (any(out[, j] == 1)) "SI" else "NO",
            if (length(cerca)) sprintf("%.1f", cerca[which.min(abs(cerca - celdas$sup_s[i]))]) else "media imposible")
  })
  cat(sprintf("  %-10s %-13s %5.1f +/- %4.1f  ->  A0: %-22s A1: %-22s B: %s\n", celdas$sustrato[i],
              celdas$tratamiento[i], celdas$sup_m[i], celdas$sup_s[i], res[1], res[2], res[3]))
}

titulo("1d. QC - estructura del DLI (confusion con el diseno)")
print(aggregate(cbind(sup_m, germ_m) ~ dli_m, data = celdas, FUN = function(x) paste(x, collapse = " / ")))
cat("Celdas por valor de DLI:\n")
print(tapply(paste(celdas$sustrato, celdas$tratamiento, sep = ":"), celdas$dli_m, paste, collapse = "  +  "))

# ----------------------------------------------------------------------------
# 2. ANOVA factorial 2x4 a partir de estadisticos resumen (balanceado, n = 5)
# ----------------------------------------------------------------------------
anova_resumen <- function(m, s, A, B, n) {
  a <- nlevels(A); b <- nlevels(B); gm <- mean(m)
  sc_a   <- n * b * sum((tapply(m, A, mean) - gm)^2)
  sc_b   <- n * a * sum((tapply(m, B, mean) - gm)^2)
  sc_ab  <- n * sum((m - gm)^2) - sc_a - sc_b
  gl_e   <- a * b * (n - 1); cme <- mean(s^2); sc_e <- cme * gl_e
  tab <- data.frame(gl = c(a - 1, b - 1, (a - 1) * (b - 1), gl_e),
                    SC = c(sc_a, sc_b, sc_ab, sc_e),
                    row.names = c("Sustrato", "Tratamiento", "Sustrato x Tratamiento", "Error"))
  tab$CM <- tab$SC / tab$gl
  tab$F  <- c(tab$CM[1:3] / cme, NA)
  tab$p  <- c(pf(tab$F[1:3], tab$gl[1:3], gl_e, lower.tail = FALSE), NA)
  tab$eta2_parcial <- c(tab$SC[1:3] / (tab$SC[1:3] + sc_e), NA)
  list(tabla = tab, cme = cme, gl_e = gl_e)
}

titulo("2a. SUPERVIVENCIA (%) - ANOVA 2x4 desde medias y DE de celda")
av_sup <- anova_resumen(celdas$sup_m, celdas$sup_s, celdas$sustrato, celdas$tratamiento, n_u)
print(round(av_sup$tabla, 4))
cat(sprintf("Razon de varianzas max/min entre celdas: %.2f\n", max(celdas$sup_s^2) / min(celdas$sup_s^2)))

cme <- av_sup$cme; gl_e <- av_sup$gl_e
d_sus  <- diff(rev(tapply(celdas$sup_m, celdas$sustrato, mean)))        # LHS-1 - River sand
ee_sus <- sqrt(cme * 2 / (4 * n_u))
cat(sprintf("\nDiferencia LHS-1 - River sand: %.1f puntos; IC %g%%: [%.1f, %.1f]; d de Cohen = %.2f\n",
            d_sus, 100 * (1 - alpha), d_sus - qt(1 - alpha / 2, gl_e) * ee_sus,
            d_sus + qt(1 - alpha / 2, gl_e) * ee_sus, d_sus / sqrt(cme)))

cat("\nComparaciones entre tratamientos (Tukey HSD, IC simultaneos):\n")
mt <- tapply(celdas$sup_m, celdas$tratamiento, mean); pares <- t(combn(niv_trt, 2))
ee_t <- sqrt(cme * 2 / (2 * n_u)); dif <- mt[pares[, 2]] - mt[pares[, 1]]
hw <- qtukey(1 - alpha, 4, gl_e) / sqrt(2) * ee_t
print(data.frame(contraste = paste(pares[, 2], "-", pares[, 1]), dif = round(dif, 1),
                 IC_inf = round(dif - hw, 1), IC_sup = round(dif + hw, 1),
                 p_Tukey = round(ptukey(abs(dif) / ee_t * sqrt(2), 4, gl_e, lower.tail = FALSE), 3)),
      row.names = FALSE)

titulo("2b. GERMINACION (%) - mismo ANOVA, SOLO para mostrar por que no es adecuado aqui")
av_ger <- anova_resumen(celdas$germ_m, celdas$germ_s, celdas$sustrato, celdas$tratamiento, n_u)
print(round(av_ger$tabla, 4))
cat("Varianzas de celda:", round(celdas$germ_s^2, 0), " -> 3 celdas con varianza 0 (homocedasticidad violada)\n")

# ----------------------------------------------------------------------------
# 3. Germinacion como respuesta binomial (conteos derivados de las medias, S1)
# ----------------------------------------------------------------------------
titulo("3a. GERMINACION - conteos por celda e IC exactos de Clopper-Pearson")
celdas$n_sem  <- n_u * n_s
celdas$germ_k <- round(celdas$germ_m / 100 * celdas$n_sem)
ic <- t(sapply(seq_len(nrow(celdas)), function(i)
  binom.test(celdas$germ_k[i], celdas$n_sem[i], conf.level = 1 - alpha)$conf.int))
print(data.frame(celdas[, c("sustrato", "tratamiento", "germ_k", "n_sem")],
                 prop = celdas$germ_k / celdas$n_sem, IC_inf = round(ic[, 1], 3), IC_sup = round(ic[, 2], 3)),
      row.names = FALSE)

titulo("3b. GERMINACION - pruebas exactas (suponen semillas independientes)")
tabla2 <- function(f) with(celdas, rbind(germinadas = tapply(germ_k, f, sum),
                                         no_germinadas = tapply(n_sem - germ_k, f, sum)))
tab_trt <- tabla2(celdas$tratamiento); tab_sus <- tabla2(celdas$sustrato)
tab_cel <- tabla2(interaction(celdas$sustrato, celdas$tratamiento, lex.order = TRUE))
print(tab_trt); print(tab_sus)
cat(sprintf("Fisher exacto, sustrato (2x2):        p = %.4f\n", fisher.test(tab_sus)$p.value))
cat(sprintf("Fisher exacto, tratamiento (4x2):     p = %.4f\n", fisher.test(tab_trt)$p.value))
cat(sprintf("Fisher exacto, 8 celdas (8x2):        p = %.4f\n", fisher.test(tab_cel, workspace = 2e7)$p.value))
for (s in niv_sus) {
  d <- celdas[celdas$sustrato == s, ]
  cat(sprintf("Fisher exacto, tratamiento dentro de %-10s p = %.4f\n", s,
              fisher.test(rbind(d$germ_k, d$n_sem - d$germ_k))$p.value))
}
p_ctrl <- sapply(niv_trt[-1], function(t) fisher.test(tab_trt[, c("Control", t)])$p.value)
cat("\nCada tratamiento vs Control (marginal, n = 40 vs 40), p cruda y ajustada por Holm:\n")
print(round(rbind(p_cruda = p_ctrl, p_Holm = p.adjust(p_ctrl, "holm")), 4))

titulo("3c. GERMINACION - GLM binomial (logit), analisis de devianza secuencial")
# Hay celdas con 100 %: separacion completa -> los coeficientes divergen, pero la
# devianza (razon de verosimilitud) sigue siendo calculable.
glm_g <- suppressWarnings(glm(cbind(germ_k, n_sem - germ_k) ~ sustrato * tratamiento,
                              family = binomial, data = celdas))
dev <- suppressWarnings(anova(glm_g, test = "Chisq")); print(dev)

titulo("3d. GERMINACION - sensibilidad a sobredispersion (la unidad experimental es la maceta)")
# phi = X2 de Pearson entre unidades / gl. Las celdas con 0 % o 100 % no aportan informacion,
# por eso se reporta tambien phi usando solo las celdas informativas.
n_cand <- nrow(rec_germ[[6]])
for (j in seq_len(n_cand)) {
  g_u <- lapply(seq_along(rec_germ), function(i) rec_germ[[i]][if (i == 6) j else 1, ])
  x2 <- sapply(g_u, function(g) { p <- mean(g) / n_s; if (p %in% c(0, 1)) 0 else sum((g - n_s * p)^2) / (n_s * p * (1 - p)) })
  inf <- sapply(g_u, function(g) !(mean(g) / n_s) %in% c(0, 1))
  gl_inf <- sum(inf) * (n_u - 1); phi <- max(1, sum(x2) / gl_inf)
  Fq <- dev$Deviance[2:4] / dev$Df[2:4] / phi
  cat(sprintf("River sand / Additive 5%% = (%s): X2 = %.1f; phi(32 gl) = %.2f; phi(celdas informativas, %d gl) = %.2f\n",
              paste(g_u[[6]], collapse = ","), sum(x2), sum(x2) / 32, gl_inf, sum(x2) / gl_inf))
  print(data.frame(efecto = rownames(dev)[2:4], F_cuasi = round(Fq, 2), gl1 = dev$Df[2:4], gl2 = gl_inf,
                   p = round(pf(Fq, dev$Df[2:4], gl_inf, lower.tail = FALSE), 4)), row.names = FALSE)
}

# ----------------------------------------------------------------------------
# 4. DLI vs respuesta (nivel de celda: 8 puntos, solo 4 valores distintos de DLI)
# ----------------------------------------------------------------------------
titulo("4. DLI - asociacion a nivel de celda (ecologica, n = 8)")
for (v in c("sup_m", "germ_m")) {
  ct <- cor.test(celdas$dli_m, celdas[[v]])
  sp <- suppressWarnings(cor.test(celdas$dli_m, celdas[[v]], method = "spearman", exact = FALSE))
  cat(sprintf("%-7s Pearson r = %6.3f, IC %g%% [%.2f, %.2f], p = %.3f | Spearman rho = %6.3f, p = %.3f\n",
              v, ct$estimate, 100 * (1 - alpha), ct$conf.int[1], ct$conf.int[2], ct$p.value, sp$estimate, sp$p.value))
}

# ----------------------------------------------------------------------------
# 5. Potencia: que puede detectar este piloto y que haria falta
# ----------------------------------------------------------------------------
titulo("5. POTENCIA (supervivencia; DE residual del ANOVA 2a)")
de_res <- sqrt(cme)
cat(sprintf("DE residual = %.1f puntos porcentuales\n", de_res))
cat(sprintf("Potencia actual para la diferencia observada entre sustratos (%.1f; 20 vs 20 unidades): %.2f\n",
            d_sus, power.t.test(n = 4 * n_u, delta = d_sus, sd = de_res, sig.level = alpha)$power))
cat(sprintf("Diferencia minima detectable con potencia 0.80 (20 vs 20): %.1f puntos\n",
            power.t.test(n = 4 * n_u, power = 0.80, sd = de_res, sig.level = alpha)$delta))
cat(sprintf("Unidades por sustrato para detectar %.1f puntos con potencia 0.80: %.0f\n", d_sus,
            ceiling(power.t.test(delta = d_sus, power = 0.80, sd = de_res, sig.level = alpha)$n)))
pa <- power.anova.test(groups = 4, between.var = var(mt), within.var = cme, power = 0.80, sig.level = alpha)
cat(sprintf("Unidades por tratamiento para detectar el patron observado entre tratamientos (potencia 0.80): %.0f\n",
            ceiling(pa$n)))
