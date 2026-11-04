"""Score one KickBench solution on the hidden test set and the physics grid.

    python score.py <run_dir> [--json out.json]

The solution runs in a child process under the sandbox, which only ever receives inputs, so it
cannot reach the truth. Metrics follow Sec. 7 of the v2 FITTING_PROTOCOL.md (Islam, Wadekar &
Khanna, arXiv:2608.00934). All choices here were fixed before any agent was scored.

Env: base. The child uses ~/kickbench_runs/.venv, which has no GW packages.
"""

import ast
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
ALLOWED_IMPORTS = set(sys.stdlib_module_names) | {"numpy", "scipy", "sklearn", "joblib"}
VENV_PYTHON = Path.home() / "kickbench_runs" / ".venv" / "bin" / "python"
SANDBOX = (
    '(version 1)(allow default)(deny network*)'
    f'(deny file-read* (subpath "{Path.home()}/Research"))'
)


def sandbox_for(run_dir):
    """Return the scoring sandbox, which may read only the submission among files under ~/Research."""
    return SANDBOX + f'(allow file-read* (subpath "{Path(run_dir).resolve()}"))'

PREDICT_TIMEOUT_S = 600
MAX_SPEED_KMS = 700.0
ZERO_TOLERANCE_KMS = 1.0
SLOPE_TARGET = -2.0
SLOPE_TOLERANCE = 0.3
CHILD = """
import sys
import numpy as np
sys.path.insert(0, ".")
import solve
inputs = np.load(sys.argv[1])
outputs = {}
for name in inputs.files:
    rows = inputs[name]
    outputs[name] = np.asarray(solve.kick(rows[0], rows[1], rows[2]), dtype=float).ravel()
np.savez(sys.argv[2], **outputs)
"""


def imported_modules(path):
    """Return top-level modules imported anywhere in a Python file."""
    tree = ast.parse(path.read_text())
    names = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            names.add(node.module.split(".")[0])
    return names


def local_modules(run_dir):
    """Return names of Python modules the agent wrote next to solve.py."""
    return {path.stem for path in run_dir.glob("*.py")}


def physics_grid():
    """Return named input arrays for the physics checks, each with rows q, chi1, chi2."""
    spins = np.linspace(-1.0, 1.0, 21)
    ratios = np.geomspace(1.0, 1.0e4, 41)
    q_mesh, a_mesh, b_mesh = np.meshgrid(ratios, spins, spins, indexing="ij")
    grid = np.stack([q_mesh.ravel(), a_mesh.ravel(), b_mesh.ravel()])
    one = np.ones_like(spins)
    a_equal, b_equal = np.meshgrid(spins, spins, indexing="ij")
    large_spins = np.array([-0.8, -0.4, 0.0, 0.4, 0.8])
    zeros = np.zeros_like(large_spins)
    return {
        "grid": grid,
        "equal": np.stack([one, spins, spins]),
        "swap_a": np.stack([np.ones(a_equal.size), a_equal.ravel(), b_equal.ravel()]),
        "swap_b": np.stack([np.ones(a_equal.size), b_equal.ravel(), a_equal.ravel()]),
        "q1000": np.stack([1000.0 * np.ones(5), large_spins, zeros]),
        "q10000": np.stack([10000.0 * np.ones(5), large_spins, zeros]),
    }


def predict(run_dir, inputs):
    """Run solve.kick in a sandboxed child process. Return outputs and an error string."""
    with tempfile.TemporaryDirectory(dir=run_dir, prefix=".score_") as scratch:
        scratch = Path(scratch)
        np.savez(scratch / "in.npz", **inputs)
        (scratch / "child.py").write_text(CHILD)
        command = [
            "sandbox-exec", "-p", sandbox_for(run_dir), str(VENV_PYTHON), str(scratch / "child.py"),
            str(scratch / "in.npz"), str(scratch / "out.npz"),
        ]
        try:
            done = subprocess.run(
                command, cwd=run_dir, capture_output=True, text=True, timeout=PREDICT_TIMEOUT_S
            )
        except subprocess.TimeoutExpired:
            return None, "prediction timed out"
        if done.returncode != 0:
            return None, done.stderr[-800:]
        with np.load(scratch / "out.npz") as saved:
            return {name: saved[name] for name in saved.files}, ""


def error_summary(errors):
    """Return median, p90, p99 and maximum of absolute errors."""
    return {
        "n": int(errors.size),
        "median": float(np.median(errors)),
        "p90": float(np.percentile(errors, 90)),
        "p99": float(np.percentile(errors, 99)),
        "max": float(np.max(errors)),
    }


def subsets(catalog, q):
    """Return the reporting subsets as boolean masks."""
    nr = catalog != "BHPT"
    return {
        "NR": nr,
        "BHPT": ~nr,
        "SXS": catalog == "SXS",
        "RIT": catalog == "RIT",
        "MAYA": catalog == "MAYA",
        "NR q<=4": nr & (q <= 4),
        "NR 4<q<=10": nr & (q > 4) & (q <= 10),
        "NR q>10": nr & (q > 10),
    }


def accuracy(prediction, test):
    """Return error summaries by subset and the signed error array."""
    signed = prediction - test["vkick_kms"]
    masks = subsets(test["catalog"], test["q"])
    summary = {name: error_summary(np.abs(signed[mask])) for name, mask in masks.items()}
    return summary, signed


def physics(outputs):
    """Return the pass or fail value of each physics check, with its measured number."""
    grid = outputs["grid"]
    slope = np.log10(np.abs(outputs["q10000"]) + 1.0e-300) - np.log10(np.abs(outputs["q1000"]) + 1.0e-300)
    swap = np.abs(outputs["swap_a"] - outputs["swap_b"])
    finite = bool(np.all(np.isfinite(grid)))
    checks = {
        "finite": {"pass": finite, "value": float(np.mean(np.isfinite(grid)))},
        "non_negative": {"pass": bool(np.nanmin(grid) >= 0.0), "value": float(np.nanmin(grid))},
        "max_speed": {"pass": bool(np.nanmax(grid) <= MAX_SPEED_KMS), "value": float(np.nanmax(grid))},
        "equal_zero": {
            "pass": bool(np.nanmax(np.abs(outputs["equal"])) <= ZERO_TOLERANCE_KMS),
            "value": float(np.nanmax(np.abs(outputs["equal"]))),
        },
        "exchange": {"pass": bool(np.nanmax(swap) <= ZERO_TOLERANCE_KMS), "value": float(np.nanmax(swap))},
        "slope": {
            "pass": bool(np.all(np.abs(slope - SLOPE_TARGET) <= SLOPE_TOLERANCE)),
            "value": float(slope[np.argmax(np.abs(slope - SLOPE_TARGET))]),
        },
    }
    return checks


def estimates(run_dir):
    """Return the agent's stated NR error estimates from REPORT.md, if present."""
    found = {}
    report = run_dir / "REPORT.md"
    if not report.exists():
        return found
    for line in report.read_text().splitlines():
        for key in ["ESTIMATE_NR_MEDIAN_KMS", "ESTIMATE_NR_P90_KMS"]:
            if line.strip().startswith(key + ":"):
                try:
                    found[key] = float(line.split(":", 1)[1].strip().split()[0])
                except (ValueError, IndexError):
                    pass
    return found


def score(run_dir):
    """Return the full score record for one run directory."""
    record = {"run": run_dir.name, "valid": False, "error": ""}
    solve_path = run_dir / "solve.py"
    if not solve_path.exists():
        record["error"] = "no solve.py"
        return record, None
    allowed = ALLOWED_IMPORTS | local_modules(run_dir)
    bad = imported_modules(solve_path) - allowed
    if bad:
        record["error"] = f"forbidden imports: {sorted(bad)}"
        return record, None
    with np.load(HERE / "hidden_test.npz") as saved:
        test = {name: saved[name] for name in saved.files}
    inputs = physics_grid()
    inputs["test"] = np.stack([test["q"], test["chi1z"], test["chi2z"]])
    outputs, error = predict(run_dir, inputs)
    if outputs is None:
        record["error"] = error
        return record, None
    if outputs["test"].size != test["q"].size:
        record["error"] = "wrong output length"
        return record, None
    if not np.all(np.isfinite(outputs["test"])):
        record["error"] = "non-finite test predictions"
        return record, None
    summary, _ = accuracy(outputs["test"], test)
    record["valid"] = True
    record["accuracy"] = summary
    record["physics"] = physics(outputs)
    record["physics_passed"] = int(sum(check["pass"] for check in record["physics"].values()))
    record["estimates"] = estimates(run_dir)
    return record, outputs["test"]


def main():
    """Score the run directory given on the command line and print the result."""
    run_dir = Path(sys.argv[1]).resolve()
    record, prediction = score(run_dir)
    if prediction is not None:
        np.save(run_dir / "hidden_predictions.npy", prediction)
    if "--json" in sys.argv:
        target = Path(sys.argv[sys.argv.index("--json") + 1])
        target.write_text(json.dumps(record, indent=1))
    print(json.dumps(record, indent=1))


if __name__ == "__main__":
    main()
