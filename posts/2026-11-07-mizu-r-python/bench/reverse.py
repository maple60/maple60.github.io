"""Python -> R -> Python, with validation and separate startup timing."""
import argparse
import csv
from time import perf_counter

import numpy as np
import pymizu


def run(writer, rscript, repeats):
    x = np.random.default_rng(20261107).uniform(size=10001)
    probs = np.array([0.25, 0.5, 0.75])
    tasks = {
        "C": (pymizu.call("stats::median", x), np.median(x)),
        "D": (pymizu.call("stats::quantile", x, probs=probs, names=False),
              np.quantile(x, probs)),
    }
    start = perf_counter()
    with pymizu.Pool.create(1, launcher=pymizu.r_launcher(rscript=rscript)) as pool:
        ready = pool.submit(pymizu.call(source="1")).collect(timeout=60)
        np.testing.assert_allclose(ready, 1)
        writer.writerow(["init", "ready", 1, perf_counter() - start, "ok", ""])
        for test, (call, expected) in tasks.items():
            for iteration in range(repeats + 1):
                try:
                    start = perf_counter()
                    result = pool.submit(call).collect(timeout=60)
                    elapsed = perf_counter() - start
                    np.testing.assert_allclose(result, expected, rtol=1e-12, atol=1e-12)
                    if iteration:
                        writer.writerow([test, "roundtrip", iteration, elapsed, "ok", ""])
                except Exception as error:
                    writer.writerow([test, "roundtrip", iteration, "",
                                     "error", f"{type(error).__name__}: {error}"])
                    break


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("rscript")
    parser.add_argument("output")
    parser.add_argument("repeats", type=int)
    args = parser.parse_args()
    with open(args.output, "w", newline="", encoding="utf-8") as output:
        writer = csv.writer(output)
        writer.writerow(["test", "phase", "rep", "seconds", "status", "detail"])
        try:
            run(writer, args.rscript, args.repeats)
        except Exception as error:
            writer.writerow(["init", "ready", 1, "", "error",
                             f"{type(error).__name__}: {error}"])
            raise

