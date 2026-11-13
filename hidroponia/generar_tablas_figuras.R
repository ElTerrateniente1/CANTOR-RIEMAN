#!/usr/bin/env Rscript
# =============================================================================
# Genera las tablas (.tex) y figuras (.pdf y .png) de los documentos LaTeX,
# en ingles (en) y espanol (es), a partir de los resultados de
# analisis_preliminar.R y prueba_hipotesis.R (no se recalcula nada a mano).
# Solo R base. Ejecutar desde hidroponia/: LC_ALL=C.utf8 Rscript generar_tablas_figuras.R
# =============================================================================
invisible(Sys.setlocale("LC_ALL", "C.utf8"))   # las etiquetas de las figuras llevan acentos

silencio <- function(f) { e <- new.env(); invisible(capture.output(sys.source(f, envir = e))); e }
e1 <- silencio("analisis_preliminar.R")   # QC, ANOVA factorial, germinacion
e2 <- silencio("prueba_hipotesis.R")      # prueba de la hipotesis (C1, C2)
for (d in c("latex/tablas", "latex/figuras", "png")) dir.create(d, recursive = TRUE, showWarnings = FALSE)

alpha <- 0.05; n_u <- 5
cme <- e2$cme; gl_e <- e2$gl_e; ee_media <- sqrt(cme / n_u)

# ----------------------------------------------------------------------------
# Utilidades de formato LaTeX
# ----------------------------------------------------------------------------
num  <- function(x, d = 1) paste0("$", formatC(x, format = "f", digits = d), "$")
ic   <- function(a, b, d = 1) paste0("$[", formatC(a, format = "f", digits = d), ",\\ ", formatC(b, format = "f", digits = d), "]$")
pv   <- function(p) ifelse(is.na(p), "", ifelse(p < 0.001, "$<0.001$", paste0("$", formatC(p, format = "f", digits = 3), "$")))
pm   <- function(m, s, d = 1) paste0("$", formatC(m, format = "f", digits = d), " \\pm ", formatC(s, format = "f", digits = d), "$")
fila <- function(...) paste(paste(c(...), collapse = " & "), "\\\\")
secc <- function(txt, k) sprintf("\\multicolumn{%d}{l}{\\textit{%s}} \\\\", k, txt)
escribir <- function(nombre, lang, alin, cab, cuerpo, notas = NULL, cab_extra = NULL) {
  lin <- c(sprintf("\\begin{tabular}{%s}", alin), "\\hline\\hline", cab_extra,
           fila(sprintf("\\textbf{%s}", cab)), "\\hline", cuerpo, "\\hline", "\\end{tabular}")
  if (!is.null(notas)) lin <- c(lin, "\\par\\vspace{4pt}", sprintf("\\parbox{0.94\\linewidth}{\\footnotesize %s}", notas))
  writeLines(lin, sprintf("latex/tablas/%s_%s.tex", nombre, lang))
}

# ----------------------------------------------------------------------------
# Tablas
# ----------------------------------------------------------------------------
tablas <- function(lang) {
  L   <- function(en, es) if (lang == "en") en else es
  pct <- function(x) L(paste0(x, "\\%"), paste0(x, "\\,\\%"))
  trt <- c("Control", L("Additive 5\\%", "Aditivo 5\\,\\%"), L("Additive 10\\%", "Aditivo 10\\,\\%"), L("Conventional", "Convencional"))
  sus <- c("LHS-1", L("River sand", "Arena de r\\'io"))
  c1 <- e1$celdas; c2 <- e2$celdas

  # --- A. Datos de la hipotesis ---------------------------------------------
  escribir("tabA_datos_hipotesis", lang, "llccc",
    c(L("Proportion", "Proporci\\'on"), L("Treatment", "Tratamiento"), L("Germination (\\%)", "Germinaci\\'on (\\%)"),
      L("Survival (\\%)", "Supervivencia (\\%)"), L("DLI (mol$\\cdot$m$^{-2}\\cdot$day$^{-1}$)", "DLI (mol$\\cdot$m$^{-2}\\cdot$d\\'ia$^{-1}$)")),
    sapply(1:3, function(i) fila(pct(c(0, 5, 10)[i]), trt[i], pm(c1$germ_m[i], c1$germ_s[i]),
                                 pm(c1$sup_m[i], c1$sup_s[i]), pm(c1$dli_m[i], c1$dli_s[i], 2))))

  # --- B. ANOVA de una via con particion ------------------------------------
  av <- e2$av
  escribir("tabB_anova_dosis", lang, "lccccc",
    c(L("Source of variation", "Fuente de variaci\\'on"), L("df", "gl"), L("SS", "SC"), L("MS", "CM"), "$F$", "$p$"),
    c(fila(L("Proportion of ionitoponic substrate", "Proporci\\'on de sustrato ionitop\\'onico"),
           "$2$", num(av$SC[1]), num(av$CM[1]), num(av$F[1], 2), pv(av$p_bilateral[1])),
      fila(L("\\quad C1: amended vs. unamended", "\\quad C1: enmendado vs. sin enmendar"),
           "$1$", num(av$SC[2]), num(av$CM[2]), num(av$F[2], 2), pv(av$p_bilateral[2])),
      fila(L("\\quad C2: 10\\% vs. 5\\%", "\\quad C2: 10\\,\\% vs. 5\\,\\%"),
           "$1$", num(av$SC[3]), num(av$CM[3]), num(av$F[3], 2), pv(av$p_bilateral[3])),
      fila(L("Error (pooled, eight groups)", "Error (agrupado, ocho grupos)"), paste0("$", gl_e, "$"), num(cme * gl_e), num(cme), "", "")),
    L("df: degrees of freedom; SS: sum of squares; MS: mean square. The $p$ values of the $F$ tests are two-sided.",
      "gl: grados de libertad; SC: suma de cuadrados; CM: cuadrado medio. Los valores $p$ de las pruebas $F$ son bilaterales."))

  # --- C. Contrastes planificados -------------------------------------------
  fc <- function(etq, r, nota = "") fila(etq, num(r$estimacion), num(r$EE), ic(r$IC95_inf, r$IC95_sup), num(r$t, 2),
                                         paste0(pv(r$p), nota), pv(r$p_Holm))
  pr <- e2$prim; co <- e2$comp
  escribir("tabC_contrastes", lang, "lcccccc",
    c(L("Contrast", "Contraste"), L("Difference (pp)", "Diferencia (pp)"), L("SE", "EE"), L("95\\% CI", "IC 95\\,\\%"), "$t_{32}$", "$p$", L("Holm $p$", "$p$ de Holm")),
    c(secc(L("Planned contrasts (hypothesis)", "Contrastes planificados (hip\\'otesis)"), 7),
      fc(L("C1: amended $-$ unamended", "C1: enmendado $-$ sin enmendar"), pr[1, ], "$^{a}$"),
      fc(L("C2: 10\\% $-$ 5\\%", "C2: 10\\,\\% $-$ 5\\,\\%"), pr[2, ]),
      "\\hline",
      secc(L("Complementary comparisons", "Comparaciones complementarias"), 7),
      fc(L("5\\% $-$ 0\\%", "5\\,\\% $-$ 0\\,\\%"), co[1, ], "$^{a}$"),
      fc(L("10\\% $-$ 0\\% (linear trend)", "10\\,\\% $-$ 0\\,\\% (tendencia lineal)"), co[2, ], "$^{a}$")),
    L(sprintf("pp: percentage points; SE: standard error; CI: two-sided confidence interval. $^{a}$One-sided $p$ value (directional hypothesis); the two-sided $p$ value of C1 is %s. The Holm adjustment was applied within each pair of contrasts.",
              formatC(e2$contraste(e2$w_C1)$p, format = "f", digits = 3)),
      sprintf("pp: puntos porcentuales; EE: error est\\'andar; IC: intervalo de confianza bilateral. $^{a}$Valor $p$ unilateral (hip\\'otesis direccional); el valor $p$ bilateral de C1 es %s. El ajuste de Holm se aplic\\'o dentro de cada par de contrastes.",
              formatC(e2$contraste(e2$w_C1)$p, format = "f", digits = 3))))

  # --- D. Sensibilidad -------------------------------------------------------
  s1 <- e2$sens(e2$w_C1, "mayor"); s2 <- e2$sens(e2$w_C2, "dos")
  fs <- function(etq, i) fila(etq, num(s1$t[i], 2), num(s1$gl[i], if (s1$gl[i] %% 1 == 0) 0 else 1), pv(s1$p[i]),
                              num(s2$t[i], 2), num(s2$gl[i], if (s2$gl[i] %% 1 == 0) 0 else 1), pv(s2$p[i]))
  escribir("tabD_sensibilidad", lang, "lcccccc",
    c(L("Analysis", "An\\'alisis"), "$t$", L("df", "gl"), "$p$", "$t$", L("df", "gl"), "$p$"),
    c(fs(L("Pooled error, eight groups (primary)", "Error agrupado, ocho grupos (principal)"), 1),
      fs(L("Error from the groups in the contrast", "Error de los grupos del contraste"), 2),
      fs(L("Welch--Satterthwaite (unequal variances)", "Welch--Satterthwaite (varianzas desiguales)"), 3),
      fila(L("Fisher's exact test at the seed level", "Prueba exacta de Fisher a nivel de semilla"), "--", "--", pv(e2$f1$p.value), "--", "--", pv(e2$f2$p.value))),
    L("C1 was evaluated with a one-sided test and C2 with a two-sided test. df: degrees of freedom.",
      "C1 se evalu\\'o con una prueba unilateral y C2 con una prueba bilateral. gl: grados de libertad."),
    cab_extra = c("& \\multicolumn{3}{c}{\\textbf{C1}} & \\multicolumn{3}{c}{\\textbf{C2}} \\\\"))

  # --- E. Contrastes de contexto --------------------------------------------
  cx <- e2$ctx
  etq <- c(L("LHS-1: unamended $-$ conventional solution", "LHS-1: sin enmendar $-$ soluci\\'on convencional"),
           L("Unamended: LHS-1 $-$ river sand", "Sin enmendar: LHS-1 $-$ arena de r\\'io"),
           L("LHS-1: amended $-$ conventional solution", "LHS-1: enmendado $-$ soluci\\'on convencional"),
           L("River sand: amended $-$ unamended", "Arena de r\\'io: enmendada $-$ sin enmendar"),
           L("Amendment effect: LHS-1 $-$ river sand", "Efecto de la enmienda: LHS-1 $-$ arena de r\\'io"))
  escribir("tabE_contexto", lang, "lcccc",
    c(L("Contrast", "Contraste"), L("Difference (pp)", "Diferencia (pp)"), L("95\\% CI", "IC 95\\,\\%"), "$t_{32}$", "$p$"),
    sapply(1:5, function(i) fila(etq[i], num(cx$estimacion[i]), ic(cx$IC95_inf[i], cx$IC95_sup[i]), num(cx$t[i], 2), pv(cx$p[i]))),
    L("pp: percentage points; CI: two-sided confidence interval. Two-sided $p$ values, without adjustment for multiplicity (exploratory analysis).",
      "pp: puntos porcentuales; IC: intervalo de confianza bilateral. Valores $p$ bilaterales, sin ajuste por multiplicidad (an\\'alisis exploratorio)."))

  # --- F. ANOVA factorial ----------------------------------------------------
  a2 <- e1$av_sup$tabla
  escribir("tabF_anova_factorial", lang, "lcccccc",
    c(L("Source of variation", "Fuente de variaci\\'on"), L("df", "gl"), L("SS", "SC"), L("MS", "CM"), "$F$", "$p$", L("Partial $\\eta^2$", "$\\eta^2$ parcial")),
    c(sapply(1:3, function(i) fila(c(L("Substrate", "Sustrato"), L("Treatment", "Tratamiento"), L("Substrate $\\times$ treatment", "Sustrato $\\times$ tratamiento"))[i],
                                   paste0("$", a2$gl[i], "$"), num(a2$SC[i]), num(a2$CM[i]), num(a2$F[i], 2), pv(a2$p[i]), num(a2$eta2_parcial[i], 3))),
      fila("Error", paste0("$", a2$gl[4], "$"), num(a2$SC[4]), num(a2$CM[4]), "", "", "")),
    L("df: degrees of freedom; SS: sum of squares; MS: mean square.", "gl: grados de libertad; SC: suma de cuadrados; CM: cuadrado medio."))

  # --- G. Germinacion por grupo ----------------------------------------------
  cuerpo <- unlist(lapply(1:2, function(s) c(
    secc(paste0(L("Substrate: ", "Sustrato: "), sus[s]), 4),
    sapply(1:4, function(t) { i <- (s - 1) * 4 + t
      fila(trt[t], sprintf("$%d/%d$", c1$germ_k[i], c1$n_sem[i]), num(100 * c1$germ_k[i] / c1$n_sem[i]),
           ic(100 * e1$ic[i, 1], 100 * e1$ic[i, 2])) }),
    if (s == 1) "\\hline")))
  escribir("tabG_germinacion", lang, "lccc",
    c(L("Treatment", "Tratamiento"), L("Germinated/sown", "Germinadas/sembradas"), L("Germination (\\%)", "Germinaci\\'on (\\%)"), L("95\\% CI", "IC 95\\,\\%")),
    cuerpo)

  # --- H. Contrastes de germinacion ------------------------------------------
  g <- e1$tab_g; rownames(g) <- g$contraste
  sel <- c("Sustrato: LHS-1 - River sand", "Primer escalon: A5 - Control (global)", "A5 - Convencional (global)",
           "A10 - Convencional (global)", "A5 - Convencional en LHS-1", "A10 - Convencional en LHS-1",
           "LHS-1 - River sand en A5", "LHS-1 - River sand en Convencional")
  etq <- c(L("LHS-1 $-$ river sand (overall)", "LHS-1 $-$ arena de r\\'io (global)"),
           L("Additive 5\\% $-$ control", "Aditivo 5\\,\\% $-$ control"),
           L("Additive 5\\% $-$ conventional", "Aditivo 5\\,\\% $-$ convencional"),
           L("Additive 10\\% $-$ conventional", "Aditivo 10\\,\\% $-$ convencional"),
           L("LHS-1: additive 5\\% $-$ conventional", "LHS-1: aditivo 5\\,\\% $-$ convencional"),
           L("LHS-1: additive 10\\% $-$ conventional", "LHS-1: aditivo 10\\,\\% $-$ convencional"),
           L("Additive 5\\%: LHS-1 $-$ river sand", "Aditivo 5\\,\\%: LHS-1 $-$ arena de r\\'io"),
           L("Conventional: LHS-1 $-$ river sand", "Convencional: LHS-1 $-$ arena de r\\'io"))
  p_unidad <- function(a, b) { r <- formatC(range(a, b), format = "f", digits = 3)
    if (r[1] == r[2]) paste0("$", r[1], "$") else paste0("$", r[1], "$--$", r[2], "$") }
  escribir("tabH_contrastes_germinacion", lang, "lcccc",
    c(L("Contrast", "Contraste"), L("Difference (pp)", "Diferencia (pp)"), L("95\\% CI", "IC 95\\,\\%"),
      L("$p$ (seed)", "$p$ (semilla)"), L("$p$ (unit)", "$p$ (unidad)")),
    sapply(seq_along(sel), function(i) { r <- g[sel[i], ]
      fila(etq[i], num(r$dif), ic(r$IC_inf, r$IC_sup), pv(r$p_exacta), p_unidad(r$p_perm_a, r$p_perm_b)) }),
    L("pp: percentage points; CI: Newcombe confidence interval (seed level). $p$ (seed): Fisher's exact test, which assumes independent seeds; $p$ (unit): permutation test with the experimental unit as the unit of analysis. Unadjusted $p$ values.",
      "pp: puntos porcentuales; IC: intervalo de confianza de Newcombe (nivel de semilla). $p$ (semilla): prueba exacta de Fisher, que supone semillas independientes; $p$ (unidad): prueba de permutaci\\'on con la unidad experimental como unidad de an\\'alisis. Valores $p$ sin ajustar."))

  # --- I. Potencia y tamano de muestra ---------------------------------------
  d_sus <- unname(e1$d_sus); de <- sqrt(cme)
  pot_sus <- power.t.test(n = 4 * n_u, delta = d_sus, sd = de, sig.level = alpha)$power
  n_sus   <- ceiling(power.t.test(delta = d_sus, power = 0.80, sd = de, sig.level = alpha)$n)
  escribir("tabI_potencia", lang, "lccc",
    c(L("Comparison", "Comparaci\\'on"), L("Difference (pp)", "Diferencia (pp)"), L("Power", "Potencia"),
      L("Units per group", "Unidades por grupo")),
    c(fila(L("C1: amended $-$ unamended (one-sided)", "C1: enmendado $-$ sin enmendar (unilateral)"), num(pr$estimacion[1]),
           num(e2$potencia(n_u, pr$estimacion[1], e2$w_C1, "mayor", gl_e), 2), paste0("$", e2$n_req(pr$estimacion[1], e2$w_C1, "mayor"), "$")),
      fila(L("C2: 10\\% $-$ 5\\% (two-sided)", "C2: 10\\,\\% $-$ 5\\,\\% (bilateral)"), num(pr$estimacion[2]),
           num(e2$potencia(n_u, pr$estimacion[2], e2$w_C2, "dos", gl_e), 2), paste0("$", e2$n_req(pr$estimacion[2], e2$w_C2, "dos"), "$")),
      fila(L("LHS-1 $-$ river sand, overall (two-sided)", "LHS-1 $-$ arena de r\\'io, global (bilateral)"), num(d_sus),
           num(pot_sus, 2), paste0("$", n_sus, "^{b}$"))),
    L(sprintf("pp: percentage points. Calculations assume the differences observed in the pilot phase and a residual standard deviation of %.1f pp. Units per group: experimental units required in each group for a power of 0.80. $^{b}$Units per substrate.", de),
      sprintf("pp: puntos porcentuales. Los c\\'alculos suponen las diferencias observadas en la fase piloto y una desviaci\\'on est\\'andar residual de %.1f pp. Unidades por grupo: unidades experimentales requeridas en cada grupo para una potencia de 0.80. $^{b}$Unidades por sustrato.", de)))
}

# ----------------------------------------------------------------------------
# Figuras (R base). Paleta validada con el validador del metodo de visualizacion:
# sustratos LHS-1 / arena (marron / verde, como en el manuscrito, con mas croma)
# y contrastes C1 / C2 (azul / naranja). Superficie blanca (impresion).
# ----------------------------------------------------------------------------
col <- list(lhs = "#96531C", riv = "#3FA37A", c1 = "#2a78d6", c2 = "#eb6834",
            tinta = "#0b0b0b", sec = "#52514e", mut = "#898781", grid = "#e1e0d9", eje = "#c3c2b7", gris = "#a3a19b")
dibujar <- function(nombre, ancho, alto, f) {
  png(file.path("png", paste0(nombre, ".png")), width = ancho, height = alto, units = "in", res = 300, type = "cairo", bg = "white")
  f(); dev.off()
  cairo_pdf(file.path("latex/figuras", paste0(nombre, ".pdf")), width = ancho, height = alto, family = "DejaVu Sans")
  f(); dev.off()
}
lienzo <- function(mar, xlim, ylim, xlab = "", ylab = "", grid_y = NULL, grid_x = NULL) {
  par(family = "DejaVu Sans", mar = mar, las = 1, mgp = c(2.5, 0.55, 0), tcl = 0, cex = 0.9,
      col.axis = col$sec, col.lab = col$sec, fg = col$eje, bty = "n", xaxs = "i", yaxs = "i")
  plot.new(); plot.window(xlim, ylim)
  if (!is.null(grid_y)) abline(h = grid_y, col = col$grid, lwd = 1)
  if (!is.null(grid_x)) abline(v = grid_x, col = col$grid, lwd = 1)
  title(xlab = xlab, ylab = ylab, cex.lab = 0.95)
}
punto <- function(x, y, color, pch = 21, cex = 1.5) points(x, y, pch = pch, bg = color, col = "white", lwd = 1.8, cex = cex)
intervalo <- function(x, lo, hi, color, horiz = FALSE, lwd = 1.6)
  if (horiz) segments(lo, x, hi, x, col = color, lwd = lwd, lend = "butt") else segments(x, lo, x, hi, col = color, lwd = lwd, lend = "butt")

figuras <- function(lang) {
  L   <- function(en, es) if (lang == "en") en else es
  pct <- function(x) L(paste0(x, "%"), paste0(x, " %"))
  trt <- c("Control", L("Additive 5%", "Aditivo 5 %"), L("Additive 10%", "Aditivo 10 %"), L("Conventional", "Convencional"))
  sus <- c("LHS-1", L("River sand", "Arena de río"))
  c1 <- e1$celdas

  # --- Fig. A: supervivencia en LHS-1 segun la proporcion --------------------
  dibujar(paste0("figA_supervivencia_dosis_", lang), 5.2, 3.6, function() {
    x <- c(0, 5, 10); y <- c1$sup_m[1:3]
    lienzo(c(3.6, 3.9, 0.6, 0.6), c(-1.5, 11.5), c(0, 104), grid_y = seq(0, 100, 20),
           xlab = L("Proportion of ionitoponic substrate in LHS-1", "Proporción de sustrato ionitopónico en LHS-1"),
           ylab = L("Survival (%)", "Supervivencia (%)"))
    axis(1, at = x, labels = pct(x), lwd = 0); axis(2, at = seq(0, 100, 20), lwd = 0); abline(h = 0, col = col$eje, lwd = 1)
    lines(x, y, col = col$lhs, lwd = 2); intervalo(x, y - ee_media, y + ee_media, col$lhs); punto(x, y, col$lhs, cex = 1.7)
  })

  # --- Fig. B: grafico de bosque de los contrastes ---------------------------
  dibujar(paste0("figB_contrastes_", lang), 6.5, 4.1, function() {
    r <- rbind(e2$prim[, c("estimacion", "IC95_inf", "IC95_sup")], e2$comp[, c("estimacion", "IC95_inf", "IC95_sup")],
               e2$ctx[c(3, 1, 4), c("estimacion", "IC95_inf", "IC95_sup")])
    etq <- c(L("C1: amended − unamended", "C1: enmendado − sin enmendar"), L("C2: 10% − 5%", "C2: 10 % − 5 %"),
             L("5% − 0%", "5 % − 0 %"), L("10% − 0% (linear trend)", "10 % − 0 % (tendencia lineal)"),
             L("LHS-1: amended − conventional", "LHS-1: enmendado − convencional"),
             L("LHS-1: unamended − conventional", "LHS-1: sin enmendar − convencional"),
             L("River sand: amended − unamended", "Arena de río: enmendada − sin enmendar"))
    cab <- c(L("Planned contrasts in LHS-1", "Contrastes planificados en LHS-1"),
             L("Complementary comparisons in LHS-1", "Comparaciones complementarias en LHS-1"), L("Context", "Contexto"))
    yy <- c(9, 8, 6, 5, 3, 2, 1); ycab <- c(10, 7, 4); prim <- c(TRUE, TRUE, rep(FALSE, 5))
    lienzo(c(4.1, 15.2, 0.4, 8.2), c(-60, 80), c(0.3, 10.7), grid_x = seq(-60, 80, 20),
           xlab = L("Difference in survival (percentage points)", "Diferencia en supervivencia (puntos porcentuales)"))
    axis(1, at = seq(-40, 80, 40), labels = gsub("-", "−", seq(-40, 80, 40)), lwd = 0)
    abline(v = 0, col = col$mut, lwd = 1.2)
    intervalo(yy, r$IC95_inf, r$IC95_sup, ifelse(prim, col$tinta, col$gris), horiz = TRUE, lwd = ifelse(prim, 2, 1.6))
    points(r$estimacion, yy, pch = 21, bg = ifelse(prim, col$tinta, col$gris), col = "white", lwd = 1.8, cex = ifelse(prim, 1.7, 1.4))
    mtext(etq, side = 2, at = yy, line = 14.4, adj = 0, cex = 0.8, col = col$tinta, font = ifelse(prim, 2, 1))
    mtext(cab, side = 2, at = ycab, line = 14.9, adj = 0, cex = 0.78, col = col$sec, font = 3)
    val <- sprintf("%.1f [%.1f, %.1f]", r$estimacion, r$IC95_inf, r$IC95_sup)
    mtext(gsub("-", "−", val), side = 4, at = yy, line = 0.6, adj = 0, cex = 0.78, col = col$sec)
    mtext(L("Difference [95% CI]", "Diferencia [IC 95 %]"), side = 4, at = 10, line = 0.6, adj = 0, cex = 0.78, col = col$sec, font = 3)
  })

  # --- Fig. C y D: supervivencia y germinacion por tratamiento y sustrato ----
  por_celda <- function(nombre, y, lo, hi, ylab, ylim, grid, leyenda_pos) {
    dibujar(paste0(nombre, "_", lang), 6.2, 3.7, function() {
      x <- rep(1:4, 2) + rep(c(-0.13, 0.13), each = 4); colr <- rep(c(col$lhs, col$riv), each = 4); pch <- rep(c(21, 24), each = 4)
      lienzo(c(3.9, 3.9, 0.6, 0.6), c(0.45, 4.55), ylim, grid_y = grid, xlab = L("Treatment", "Tratamiento"), ylab = ylab)
      axis(1, at = 1:4, labels = trt, lwd = 0); axis(2, at = grid, lwd = 0); abline(h = ylim[1], col = col$eje, lwd = 1)
      intervalo(x, lo, hi, colr); points(x, y, pch = pch, bg = colr, col = "white", lwd = 1.8, cex = ifelse(pch == 21, 1.6, 1.45))
      legend(leyenda_pos, legend = sus, pch = c(21, 24), pt.bg = c(col$lhs, col$riv), col = "white", pt.lwd = 1.5, pt.cex = 1.5,
             bty = "n", cex = 0.85, text.col = col$tinta, title = L("Substrate", "Sustrato"), title.col = col$sec, title.adj = 0.1, inset = c(0.01, 0.0))
    })
  }
  por_celda("figC_supervivencia_factorial", c1$sup_m, c1$sup_m - ee_media, c1$sup_m + ee_media,
            L("Survival (%)", "Supervivencia (%)"), c(0, 104), seq(0, 100, 20), "topright")
  por_celda("figD_germinacion", 100 * c1$germ_k / c1$n_sem, 100 * e1$ic[, 1], 100 * e1$ic[, 2],
            L("Germination (%)", "Germinación (%)"), c(0, 104), seq(0, 100, 20), "bottomleft")

  # --- Fig. E: curvas de potencia --------------------------------------------
  dibujar(paste0("figE_potencia_", lang), 5.8, 3.7, function() {
    n <- 3:60; d <- e2$prim$estimacion[1]
    p1 <- sapply(n, e2$potencia, delta = d, w = e2$w_C1, lado = "mayor"); p2 <- sapply(n, e2$potencia, delta = d, w = e2$w_C2, lado = "dos")
    n1 <- e2$n_req(d, e2$w_C1, "mayor"); n2 <- e2$n_req(d, e2$w_C2, "dos")
    lienzo(c(3.5, 3.9, 0.6, 0.6), c(0, 62), c(0, 1.04), grid_y = seq(0, 1, 0.2),
           xlab = L("Experimental units per group", "Unidades experimentales por grupo"), ylab = L("Statistical power", "Potencia estadística"))
    axis(1, at = seq(0, 60, 10), lwd = 0); axis(2, at = seq(0, 1, 0.2), labels = formatC(seq(0, 1, 0.2), format = "f", digits = 1), lwd = 0)
    abline(h = 0, col = col$eje, lwd = 1); abline(h = 0.8, col = col$mut, lwd = 1.2)
    lines(n, p1, col = col$c1, lwd = 2); lines(n, p2, col = col$c2, lwd = 2)
    punto(c(n_u, n1), c(p1[n == n_u], p1[n == n1]), col$c1); punto(c(n_u, n2), c(p2[n == n_u], p2[n == n2]), col$c2, pch = 24, cex = 1.35)
    text(n1, p1[n == n1], paste0("n = ", n1), pos = 3, offset = 0.6, cex = 0.8, col = col$tinta)
    text(n2, p2[n == n2], paste0("n = ", n2), pos = 1, offset = 0.7, cex = 0.8, col = col$tinta)
    text(n_u + 1.2, 0.07, L("pilot (n = 5)", "piloto (n = 5)"), adj = 0, cex = 0.8, col = col$sec)
    legend("bottomright", legend = c(L("C1: amended − unamended (one-sided)", "C1: enmendado − sin enmendar (unilateral)"),
                                      L("C2: 10% − 5% (two-sided)", "C2: 10 % − 5 % (bilateral)")),
           lwd = 2, col = c(col$c1, col$c2), pch = c(21, 24), pt.bg = c(col$c1, col$c2), pt.cex = 1.1, bty = "n", cex = 0.8,
           text.col = col$tinta, inset = c(0.0, 0.04))
  })
}

# Figuras del documento tecnico (solo espanol)
figuras_tecnicas <- function() {
  # --- Fig. T1: distribucion t y region de rechazo de C1 ---------------------
  dibujar("figT1_distribucion_t_es", 5.8, 3.4, function() {
    tt <- e2$prim$t[1]; tc <- qt(1 - alpha, gl_e); x <- seq(-4, 4, length.out = 801); y <- dt(x, gl_e)
    lienzo(c(3.5, 1.0, 0.6, 1.0), c(-4, 4), c(0, 0.475), xlab = expression(paste("Estadístico ", italic(t), " con 32 grados de libertad")))
    axis(1, at = -4:4, labels = gsub("-", "−", -4:4), lwd = 0); abline(h = 0, col = col$eje, lwd = 1)
    polygon(c(tt, x[x >= tt], 4), c(0, y[x >= tt], 0), col = adjustcolor(col$c1, 0.18), border = NA)
    polygon(c(tc, x[x >= tc], 4), c(0, y[x >= tc], 0), col = adjustcolor(col$c2, 0.55), border = NA)
    lines(x, y, col = col$tinta, lwd = 2)
    segments(tt, 0, tt, dt(tt, gl_e), col = col$c1, lwd = 2); segments(tc, 0, tc, dt(tc, gl_e), col = col$c2, lwd = 2)
    rect(-3.95, c(0.447, 0.417), -3.75, c(0.463, 0.433), col = c(adjustcolor(col$c1, 0.18), adjustcolor(col$c2, 0.55)), border = NA)
    text(-3.65, 0.455, sprintf("t observado = %.2f; el área a su derecha es el valor p = %.3f", tt, e2$prim$p[1]), adj = 0, cex = 0.8, col = col$tinta)
    text(-3.65, 0.425, sprintf("región de rechazo: t > %.2f (α = 0.05, prueba unilateral)", tc), adj = 0, cex = 0.8, col = col$tinta)
  })
  # --- Fig. T2: distribucion de permutacion (germinacion, LHS-1, A5 vs Conv) --
  dibujar("figT2_permutacion_es", 5.8, 3.4, function() {
    g <- c(e1$rec_germ[[2]][1, ], e1$rec_germ[[4]][1, ]); cmb <- combn(10, 5)
    d <- apply(cmb, 2, function(ix) (sum(g[ix]) - sum(g[-ix])) / 20 * 100)
    tb <- table(d) / length(d); xs <- as.numeric(names(tb)); obs <- (sum(g[1:5]) - sum(g[6:10])) / 20 * 100
    ext <- abs(xs) >= abs(obs) - 1e-9
    lienzo(c(3.5, 3.9, 0.6, 0.6), c(-42, 42), c(0, 0.24), grid_y = seq(0, 0.2, 0.05),
           xlab = "Diferencia de germinación entre grupos (puntos porcentuales)", ylab = "Proporción de reordenamientos")
    axis(1, at = seq(-35, 35, 10), labels = gsub("-", "−", seq(-35, 35, 10)), lwd = 0)
    axis(2, at = seq(0, 0.2, 0.05), labels = formatC(seq(0, 0.2, 0.05), format = "f", digits = 2), lwd = 0); abline(h = 0, col = col$eje, lwd = 1)
    rect(xs - 1.6, 0, xs + 1.6, as.numeric(tb), col = ifelse(ext, col$c1, col$gris), border = NA)
    text(obs, tb[xs == obs] + 0.012, sprintf("observado\n(+%.0f)", obs), cex = 0.8, col = col$tinta, pos = 3, offset = 0.1)
    text(0, 0.225, sprintf("p = %d/%d = %.3f", sum(abs(d) >= abs(obs) - 1e-9), length(d), mean(abs(d) >= abs(obs) - 1e-9)), cex = 0.85, col = col$tinta)
  })
}

for (lang in c("en", "es")) { tablas(lang); figuras(lang) }
figuras_tecnicas()
cat("Tablas:", length(list.files("latex/tablas", "^tab")), "| Figuras PNG:", length(list.files("png", "^fig")), "\n")
