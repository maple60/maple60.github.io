summarize_results <- function(samples) {
  keys <- c("test", "method", "variant", "size", "phase")
  groups <- unique(samples[keys])
  stats <- lapply(seq_len(nrow(groups)), function(i) {
    group <- groups[i, ]
    matching <- Reduce(`&`, lapply(keys, function(key) samples[[key]] == group[[key]]))
    rows <- samples[matching, ]
    values <- rows$seconds[rows$status == "ok" & is.finite(rows$seconds)]
    quartiles <- if (length(values)) unname(quantile(values, c(.25, .5, .75))) else rep(NA, 3)
    cbind(group, n = length(values), errors = sum(rows$status == "error"),
          skipped = sum(rows$status == "skipped"), q25 = quartiles[1],
          median = quartiles[2], q75 = quartiles[3])
  })
  do.call(rbind, stats)
}

plot_timings <- function(summary, test, xlab, variant = NULL, speedup = FALSE) {
  data <- summary[summary$test == test & summary$phase == "roundtrip" &
                    summary$errors == 0 & summary$skipped == 0 & summary$n >= 3, ]
  if (!is.null(variant)) data <- data[data$variant == variant, ]
  if (speedup) {
    baseline <- data[data$method == "reticulate" & data$variant == "fresh", ]
    base <- baseline$median[match(data$size, baseline$size)]
    data$median <- base / data$median
  }
  log_x <- test != "E"
  data <- data[is.finite(data$median) & data$median > 0, ]
  if (!nrow(data)) {
    plot.new()
    text(.5, .5, "No plottable measurements")
    return(invisible(NULL))
  }
  groups <- split(data, paste(data$method, data$variant, sep = " / "))
  colors <- hcl.colors(length(groups), "Dark 3")
  limits <- if (speedup) data$median else c(data$median, data$q25, data$q75)
  plot(data$size, data$median, type = "n", log = if (log_x) "xy" else "y",
       xlab = xlab, ylab = if (speedup) "Speedup vs reticulate / fresh" else "Seconds",
       ylim = range(limits[is.finite(limits) & limits > 0]))
  if (speedup) abline(h = 1, lty = 3)
  for (i in seq_along(groups)) {
    rows <- groups[[i]][order(groups[[i]]$size), ]
    lines(rows$size, rows$median, type = "b", pch = i, col = colors[i])
    if (!speedup) {
      valid <- rows$q25 > 0 & rows$q75 > rows$q25
      with(rows[valid, ], segments(size, q25, size, q75, col = colors[i]))
    }
  }
  legend("topleft", names(groups), col = colors, pch = seq_along(groups), lty = 1,
         cex = .75, bty = "n")
}


