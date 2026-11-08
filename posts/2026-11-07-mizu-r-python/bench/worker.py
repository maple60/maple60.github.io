"""Shared NumPy kernels and one-shot CSV worker."""
import json
import os
import platform
import subprocess
import sys
from importlib.metadata import PackageNotFoundError, version
from time import perf_counter

if __name__ != "__main__" or sys.argv[1:] != ["metadata"]:
    import numpy as np


def tiny(x):
    return float(np.add(x, 1.0))


def double(x):
    return np.multiply(np.asarray(x), 2.0)


def timed_double(x):
    start = perf_counter()
    y = double(x)
    return [perf_counter() - start, y]


def standardize(x):
    x = np.asarray(x)
    return (x - np.mean(x)) / np.std(x)


def csv_roundtrip(input_path, output_path):
    start = perf_counter()
    x = np.loadtxt(input_path, delimiter=",", ndmin=1)
    read_s = perf_counter() - start
    compute_s, y = timed_double(x)
    start = perf_counter()
    np.savetxt(output_path, y, delimiter=",", fmt="%.17g")
    print(read_s, compute_s, perf_counter() - start)


def hardware():
    cpu = platform.processor() or os.environ.get("PROCESSOR_IDENTIFIER", "unknown")
    physical = None
    memory = None
    if sys.platform == "win32":
        command = (
            "$ErrorActionPreference='Stop'; $p=Get-CimInstance Win32_Processor;"
            "$m=Get-CimInstance Win32_ComputerSystem;"
            "@{cpu=($p.Name -join ', ');"
            "cores=($p | Measure-Object NumberOfCores -Sum).Sum;"
            "bytes=$m.TotalPhysicalMemory} | ConvertTo-Json -Compress"
        )
        try:
            data = json.loads(subprocess.check_output(
                ["powershell", "-NoProfile", "-Command", command],
                text=True, stderr=subprocess.PIPE, timeout=15
            ))
            return data["cpu"], data["cores"], data["bytes"]
        except (OSError, subprocess.SubprocessError, ValueError, KeyError):
            pass
    elif sys.platform == "darwin":
        def sysctl(key):
            return subprocess.check_output(["sysctl", "-n", key], text=True).strip()

        physical = int(sysctl("hw.physicalcpu"))
        memory = int(sysctl("hw.memsize"))
        cpu = sysctl("machdep.cpu.brand_string")
    elif sys.platform.startswith("linux"):
        with open("/proc/cpuinfo", encoding="utf-8") as file:
            entries = [dict(line.split(":", 1) for line in block.splitlines()
                            if ":" in line) for block in file.read().split("\n\n")]
        entries = [{key.strip(): value.strip() for key, value in entry.items()}
                   for entry in entries]
        pairs = {(entry["physical id"], entry["core id"]) for entry in entries
                 if {"physical id", "core id"} <= entry.keys()}
        physical = len(pairs) or None
        cpu = entries[0].get("model name", cpu)
        with open("/proc/meminfo", encoding="utf-8") as file:
            memory = int(file.readline().split()[1]) * 1024
    return cpu, physical, memory


def metadata():
    cpu, cores, memory = hardware()
    print("Python", sys.version.split()[0], sep="=")
    print("Python executable", sys.executable, sep="=")
    print("OS", platform.platform(), sep="=")
    print("CPU", cpu, sep="=")
    print("Physical cores", cores, sep="=")
    print("RAM bytes", memory, sep="=")
    for name in ("numpy", "pymizu"):
        try:
            print(name, version(name), sep="=")
        except PackageNotFoundError:
            print(name, "unavailable", sep="=")


if __name__ == "__main__":
    if sys.argv[1:] == ["metadata"]:
        metadata()
    else:
        csv_roundtrip(*sys.argv[1:])



