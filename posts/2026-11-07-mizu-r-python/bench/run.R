# Run from this article's directory with Rscript --vanilla.
main <- function() {
  set.seed(20261107)
  Sys.setenv(OPENBLAS_NUM_THREADS = "1", OMP_NUM_THREADS = "1", MKL_NUM_THREADS = "1",
             PYTHONDONTWRITEBYTECODE = "1")
  python <- Sys.getenv("MIZU_PYTHON", Sys.which("python"))
  stopifnot(nzchar(python), file.exists("bench/worker.py"))
  python <- normalizePath(python, winslash = "/", mustWork = TRUE)
  Sys.setenv(RETICULATE_PYTHON = python)
  repeats <- as.integer(Sys.getenv("MIZU_REPEATS", "7"))
  stopifnot(!is.na(repeats), repeats >= 3L)
  output <- Sys.getenv("MIZU_RESULTS", "results")
  dir.create(output, showWarnings = FALSE, recursive = TRUE)
  worker <- normalizePath("bench/worker.py", winslash = "/")
  python_run <- function(args, timeout = 300) {
    lines <- system2(python, shQuote(args), stdout = TRUE, stderr = TRUE, timeout = timeout)
    if (!is.null(attr(lines, "status"))) stop(paste(lines, collapse = "\n"))
    lines
  }
  metadata <- tryCatch(python_run(c(worker, "metadata")), error = conditionMessage)
  packages <- vapply(c("mizu", "reticulate"), function(pkg) {
    if (requireNamespace(pkg, quietly = TRUE)) as.character(packageVersion(pkg)) else "unavailable"
  }, "")
  writeLines(c(capture.output(sessionInfo()), metadata, paste(names(packages), packages, sep = "="),
               paste0("Seed=20261107\nRepeats=", repeats), "BLAS threads=1"),
             file.path(output, "environment.txt"))

  rows <- list()
  record <- function(test, method, variant, size, phase, rep, seconds = NA_real_,
                     status = "ok", detail = "") {
    rows[[length(rows) + 1L]] <<- data.frame(test, method, variant, size, phase, rep,
                                           seconds, status, detail)
  }
  now <- function() as.numeric(Sys.time())
  timed <- function(f) {
    start <- now()
    value <- f()
    list(value = value, seconds = now() - start)
  }
  check <- function(actual, expected) {
    stopifnot(isTRUE(all.equal(as.numeric(actual), as.numeric(expected), tolerance = 1e-12)))
  }
  measure <- function(test, method, variant, size, run, validate = identity, n = repeats) {
    for (i in seq.int(0L, n)) {
      ok <- tryCatch({
        observation <- run()
        validate(observation$value)
        if (i > 0L) {
          for (phase in names(observation$times)) {
            record(test, method, variant, size, phase, i, observation$times[[phase]])
          }
        }
        TRUE
      }, error = function(e) {
        record(test, method, variant, size, "roundtrip", i, status = "error",
               detail = conditionMessage(e))
        FALSE
      })
      if (!ok) break
    }
  }
  simple <- function(f, phase = "roundtrip") {
    t <- timed(f)
    list(value = t$value, times = setNames(t$seconds, phase))
  }
  setup <- function(method, variant, size, f) {
    tryCatch({
      t <- timed(f)
      record("init", method, variant, size, "ready", 1, t$seconds)
      t$value
    }, error = function(e) {
      record("init", method, variant, size, "ready", 1, status = "error",
             detail = conditionMessage(e))
      NULL
    })
  }
  collect <- function(task) {
    value <- mizu::mizu_collect(task, timeout = 120)
    if (inherits(value, "mizu_timeout")) stop("mizu collect timed out")
    value
  }
  ret <- setup("reticulate", "python", 1, function() {
    reticulate::import_from_path("worker", dirname(worker), convert = FALSE)
  })
  pool <- setup("mizu", "python", 1, function() {
    launcher <- mizu::mizu_py_launcher(python = python)
    p <- mizu::mizu_pool(1L, launcher = launcher)
    ready <- FALSE
    on.exit(if (!ready) mizu::mizu_pool_stop(p))
    # Import the same kernels used by reticulate and the CSV worker.
    worker_dir <- encodeString(dirname(worker), quote = '"')
    source <- paste0("import sys\nsys.path.insert(0, ", worker_dir, ")\nimport worker\n1")
    check(collect(mizu::mizu_submit_call(p, mizu::mizu_call(.source = source),
                                         .timeout = 60)), 1)
    ready <- TRUE
    p
  })
  on.exit(if (!is.null(pool)) mizu::mizu_pool_stop(pool), add = TRUE)
  remote <- function(name, x) {
    spec <- mizu::mizu_call(paste0("worker.", name), x)
    collect(mizu::mizu_submit_call(pool, spec, .timeout = 60))
  }
  ret_call <- function(name, x) {
    reticulate::py_to_r(ret[[name]](x))
  }
  absent <- function(test, method, variant, size) {
    record(test, method, variant, size, "roundtrip", 0, status = "skipped",
           detail = "See the corresponding initialization error")
  }
  for (method in c("reticulate", "mizu")) {
    ready <- if (method == "mizu") !is.null(pool) else !is.null(ret)
    call <- if (method == "mizu") remote else ret_call
    for (count in c(1L, 100L, 1000L, 10000L)) {
      if (!ready) {
        absent("A", method, "scalar", count)
        next
      }
      measure("A", method, "scalar", count, function() simple(function() {
        out <- numeric(count)
        for (i in seq_len(count)) out[i] <- call("tiny", 1.0)
        out
      }), function(y) check(y, rep(2, count)))
    }
    for (test in c("C", "D")) {
      x <- as.double(datasets::mtcars$mpg)
      variant <- "R-Python-R"
      if (!ready) {
        absent(test, method, variant, length(x))
        next
      }
      if (test == "C") {
        measure(test, method, variant, length(x), function() simple(function() {
          call("double", array(x))
        }), function(y) check(y, 2 * x))
      } else {
        expected <- (x - mean(x)) / sqrt(mean((x - mean(x))^2))
        measure(test, method, variant, length(x), function() simple(function() {
          y <- as.numeric(call("standardize", array(x)))
          list(y = y, by_cyl = tapply(y, datasets::mtcars$cyl, mean))
        }), function(y) {
          check(y$y, expected)
          check(y$by_cyl,
                tapply(expected, datasets::mtcars$cyl, mean))
        })
      }
    }
  }

  csv_ready <- setup("csv", "python", 1, function() {
    python_run(c("-c", "import numpy"))
    TRUE
  })
  input <- tempfile(fileext = ".csv")
  result <- tempfile(fileext = ".csv")
  on.exit(unlink(c(input, result)), add = TRUE)
  for (bytes in c(8000, 80000, 800000, 8000000, 80000000)) {
    generation <- timed(function() array(floor(runif(bytes / 8, -1000, 1000))))
    record("B", "common", "float64", bytes, "generate", 1, generation$seconds)
    x <- generation$value
    expected <- as.numeric(x) * 2
    validate <- function(y) check(y, expected)
    if (is.null(ret)) {
      for (variant in c("fresh", "reuse")) absent("B", "reticulate", variant, bytes)
    } else {
      # Dense R array -> NumPy view where supported. Reuse holds that view.
      shared <- NULL
      for (variant in c("fresh", "reuse")) {
        measure("B", "reticulate", variant, bytes, function() {
          start <- now()
          ingress <- timed(function() {
            if (variant == "reuse" && !is.null(shared)) return(shared)
            view <- reticulate::r_to_py(x, convert = FALSE)
            if (variant == "reuse") shared <<- view
            view
          })
          result <- ret$timed_double(ingress$value)
          compute <- reticulate::py_to_r(result[[0L]])
          egress <- timed(function() reticulate::py_to_r(result[[1L]]))
          list(value = egress$value, times = c(roundtrip = now() - start,
               prepare_input = ingress$seconds, compute = compute,
               collect_output = egress$seconds))
        }, validate)
      }
    }
    if (is.null(pool)) {
      for (variant in c("fresh", "reuse")) absent("B", "mizu", variant, bytes)
    } else {
      run_mizu <- function(input) {
        start <- now()
        y <- remote("timed_double", input)
        list(value = y[[2L]], times = c(roundtrip = now() - start,
                                       compute = as.numeric(y[[1L]])))
      }
      measure("B", "mizu", "fresh", bytes, function() run_mizu(x), validate)
      # A 1-D array on the pool path crosses the documented 32 KB floor.
      if (bytes >= 80000) {
        tryCatch({
          shared <- collect(mizu::mizu_submit_call(pool,
            mizu::mizu_call(.source = "x", x = x), .timeout = 60))
          measure("B", "mizu", "reuse", bytes, function() run_mizu(shared), validate)
        }, error = function(e) record("B", "mizu", "reuse", bytes, "roundtrip", 0,
                                      status = "error", detail = conditionMessage(e)))
      } else {
        record("B", "mizu", "reuse", bytes, "roundtrip", 0, status = "skipped",
               detail = "Below documented shared-view threshold")
      }
    }
    if (is.null(csv_ready)) {
      absent("B", "csv", "fresh", bytes)
    } else {
      measure("B", "csv", "fresh", bytes, function() {
        start <- now()
        write <- timed(function() write.table(x, input, sep = ",",
                                              row.names = FALSE, col.names = FALSE))
        process <- timed(function() python_run(c(worker, input, result)))
        phases <- scan(text = tail(process$value, 1), quiet = TRUE)
        stopifnot(length(phases) == 3L)
        read <- timed(function() scan(result, quiet = TRUE))
        list(value = read$value, times = c(roundtrip = now() - start,
             write_r = write$seconds, process = process$seconds, read_python = phases[1],
             compute = phases[2], write_python = phases[3], read_r = read$seconds))
      }, validate)
    }
  }

  physical <- suppressWarnings(as.integer(sub("^Physical cores=", "",
    grep("^Physical cores=", metadata, value = TRUE))))
  ram <- suppressWarnings(as.numeric(sub("^RAM bytes=", "",
    grep("^RAM bytes=", metadata, value = TRUE))))
  cap <- as.integer(Sys.getenv("MIZU_MAX_WORKERS", "8"))
  stopifnot(!is.na(cap), cap >= 1L)
  core_cap <- if (length(physical) && !is.na(physical)) max(1, physical - 1L) else 1L
  ram_cap <- if (length(ram) && !is.na(ram)) max(1, floor(ram / 2^30) - 1L) else 1L
  cap <- min(cap, core_cap, ram_cap)
  items <- seq_len(128L)
  light <- function(i) sqrt(i)
  heavy <- function(i) sum(sin(seq_len(100000L) * (i / 100)))
  environment(light) <- environment(heavy) <- baseenv()
  workloads <- list(light = light, heavy = heavy)
  run_parallel <- function(workers) {
    p <- setup("mizu", "R-workers", workers, function() {
      p <- mizu::mizu_pool(workers)
      ready <- FALSE
      on.exit(if (!ready) mizu::mizu_pool_stop(p))
      check(collect(mizu::mizu_submit(p, 1, .timeout = 60)), 1)
      ready <- TRUE
      p
    })
    on.exit(if (!is.null(p)) mizu::mizu_pool_stop(p))
    for (variant in names(workloads)) {
      f <- workloads[[variant]]
      if (is.null(p)) {
        absent("E", "mizu", variant, workers)
      } else {
        expected <- vapply(items, f, numeric(1))
        measure("E", "mizu", variant, workers, function() simple(function() {
          collect(mizu::mizu_map(p, items, f, .template = numeric(1), .timeout = 60))
        }), function(y) check(y, expected))
      }
    }
  }
  for (variant in names(workloads)) {
    f <- workloads[[variant]]
    expected <- vapply(items, f, numeric(1))
    measure("E", "sequential", variant, 0, function() simple(function() {
      vapply(items, f, numeric(1))
    }), function(y) check(y, expected))
  }
  for (workers in c(1L, 2L, 4L, 8L)) {
    if (workers <= cap) {
      run_parallel(workers)
    } else {
      for (variant in names(workloads)) record("E", "mizu", variant, workers,
        "roundtrip", 0, status = "skipped", detail = paste("Worker cap:", cap))
    }
  }

  rscript <- file.path(R.home("bin"), if (.Platform$OS.type == "windows") "Rscript.exe" else "Rscript")
  reverse <- tempfile(fileext = ".csv")
  on.exit(unlink(reverse), add = TRUE)
  tryCatch(python_run(c("bench/reverse.py", rscript, reverse, repeats)), error = function(e) {
    record("init", "mizu", "Python-R-Python", 1, "process", 1,
           status = "error", detail = conditionMessage(e))
  })
  if (file.exists(reverse) && file.size(reverse) > 0) {
    data <- read.csv(reverse, fileEncoding = "UTF-8")
    for (i in seq_len(nrow(data))) {
      row <- data[i, ]
      record(row$test, "mizu", "Python-R-Python", if (row$test == "init") 1 else 10001,
             row$phase, row$rep, row$seconds, row$status, row$detail)
    }
  }
  for (test in c("C", "D")) {
    present <- any(vapply(rows, function(row) {
      row$test == test && row$variant == "Python-R-Python"
    }, logical(1)))
    if (!present) absent(test, "mizu", "Python-R-Python", 10001)
  }
  results <- do.call(rbind, rows)
  write.csv(results, file.path(output, "samples.csv"), row.names = FALSE, fileEncoding = "UTF-8")
  source("bench/plots.R", local = TRUE)
  write.csv(summarize_results(results), file.path(output, "summary.csv"), row.names = FALSE)
  print(table(results$test, results$status))
}

main()



