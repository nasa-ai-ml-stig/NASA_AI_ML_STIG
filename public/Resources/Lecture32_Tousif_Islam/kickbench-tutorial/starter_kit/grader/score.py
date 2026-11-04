"""Score one run of the starter-kit kick task: accuracy on hidden data, and three physics limits.

    python grader/score.py runs/skill_s1

Imports solve.py from the run folder in a child process, so a broken solve.py cannot crash the
grader, and evaluates kick(q, chi1, chi2) on:
    - grader/hidden.csv: median absolute error on numerical relativity (NR) rows, and on BHPT rows;
    - three physics limits far outside the data, as stated in TASK.md:
        twins     q = 1, chi1 = chi2 gives zero kick (Fitchett 1983; Gonzalez et al. 2007, gr-qc/0610154);
        relabel   at q = 1, swapping chi1 and chi2 leaves the speed unchanged;
        falloff   v ~ q^-2 between q = 10^3 and 10^4, from the eta^2 scaling of the momentum flux.

Writes score.json in the run folder and prints it.

Env: any Python with numpy.
"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
TIMEOUT_S = 300
ZERO_TOLERANCE_KMS = 1.0
SLOPE_TARGET = -2.0
SLOPE_TOLERANCE = 0.3
CHILD = """
import sys
import numpy as np
sys.path.insert(0, ".")
import solve
inputs = np.load(sys.argv[1])
out = {name: np.asarray(solve.kick(*inputs[name]), dtype=float).ravel() for name in inputs.files}
np.savez(sys.argv[2], **out)
"""


def load_hidden():
    """Return catalog labels and the (q, chi1, chi2, v) columns of the hidden set."""
    lines = (HERE / "hidden.csv").read_text().splitlines()[1:]
    catalog = np.array([line.split(",")[0] for line in lines])
    values = np.array([[float(x) for x in line.split(",")[1:]] for line in lines])
    return catalog, values.T


def inputs_for(hidden):
    """Return named input arrays, each with rows q, chi1, chi2."""
    spins = np.linspace(-1.0, 1.0, 21)
    a, b = np.meshgrid(spins, spins, indexing="ij")
    ones = np.ones(a.size)
    large = np.array([-0.8, -0.4, 0.4, 0.8])
    return {
        "hidden": np.stack(hidden[:3]),
        "twins": np.stack([np.ones_like(spins), spins, spins]),
        "relabel_a": np.stack([ones, a.ravel(), b.ravel()]),
        "relabel_b": np.stack([ones, b.ravel(), a.ravel()]),
        "q1e3": np.stack([1.0e3 * np.ones(4), large, np.zeros(4)]),
        "q1e4": np.stack([1.0e4 * np.ones(4), large, np.zeros(4)]),
    }


def predict(run_dir, inputs):
    """Run solve.kick in a child process inside run_dir. Return outputs, or None and the error."""
    with tempfile.TemporaryDirectory() as scratch:
        scratch = Path(scratch)
        np.savez(scratch / "in.npz", **inputs)
        (scratch / "child.py").write_text(CHILD)
        try:
            done = subprocess.run(
                [sys.executable, str(scratch / "child.py"), str(scratch / "in.npz"), str(scratch / "out.npz")],
                cwd=run_dir, capture_output=True, text=True, timeout=TIMEOUT_S,
            )
        except subprocess.TimeoutExpired:
            return None, "timed out"
        if done.returncode != 0:
            return None, done.stderr[-600:]
        with np.load(scratch / "out.npz") as saved:
            return {name: saved[name] for name in saved.files}, ""


def score(run_dir):
    """Return the score dictionary for one run folder."""
    catalog, hidden = load_hidden()
    out, error = predict(run_dir, inputs_for(hidden))
    if out is None:
        return {"valid": False, "error": error}
    errors = np.abs(out["hidden"] - hidden[3])
    nr = catalog != "BHPT"
    slope = np.log10(np.abs(out["q1e4"]) + 1.0e-300) - np.log10(np.abs(out["q1e3"]) + 1.0e-300)
    physics = {
        "twins": bool(np.max(np.abs(out["twins"])) <= ZERO_TOLERANCE_KMS),
        "relabel": bool(np.max(np.abs(out["relabel_a"] - out["relabel_b"])) <= ZERO_TOLERANCE_KMS),
        "falloff": bool(np.all(np.abs(slope - SLOPE_TARGET) <= SLOPE_TOLERANCE)),
    }
    return {
        "valid": bool(np.all(np.isfinite(out["hidden"]))),
        "nr_median_kms": round(float(np.median(errors[nr])), 3),
        "bhpt_median_kms": round(float(np.median(errors[~nr])), 4),
        "physics": physics,
        "physics_passed": f"{sum(physics.values())} of 3",
    }


def main():
    """Score the run folder named on the command line."""
    run_dir = Path(sys.argv[1]).resolve()
    result = score(run_dir)
    (run_dir / "score.json").write_text(json.dumps(result, indent=1) + "\n")
    print(json.dumps(result, indent=1))


if __name__ == "__main__":
    main()
