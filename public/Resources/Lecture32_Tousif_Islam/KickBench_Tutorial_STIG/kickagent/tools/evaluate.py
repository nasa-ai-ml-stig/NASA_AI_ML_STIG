"""Evaluate one KickAgent candidate: grouped cross validation on train.csv and physics checks.

    python tools/evaluate.py candidates/03_healy_form

The candidate directory holds candidate.py with
    fit(q, chi1, chi2, v, catalog) -> state       state must be picklable
    predict(state, q, chi1, chi2) -> v            numpy arrays in, km/s out

Steps:
    1. 5-fold GroupKFold on data/train.csv, groups = binaries rounded to two decimals, so that a
       binary simulated by two catalogs never sits on both sides of a split.
    2. Out-of-fold median and 90th percentile of |dv| on numerical relativity and on BHPT.
    3. Refit on all rows, save state.pkl, run the kick-validation physics checks on it.
    4. Write metrics.json in the candidate directory and append a row to leaderboard.csv.

Uses only data/train.csv. Needs numpy and scikit-learn.
"""

import csv
import importlib.util
import json
import pickle
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from sklearn.model_selection import GroupKFold

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "train.csv"
CHECKER = ROOT / ".claude" / "skills" / "kick-validation" / "scripts" / "check_physics.py"
LEADERBOARD = ROOT / "leaderboard.csv"
FOLDS = 5
DECIMALS = 2
FIELDS = ["candidate", "nr_median", "nr_p90", "bhpt_median", "bhpt_p90", "physics_passed", "physics_failed", "seconds"]


def load_train():
    """Return the training columns as numpy arrays."""
    with open(DATA) as handle:
        rows = list(csv.DictReader(handle))
    catalog = np.array([row["catalog"] for row in rows])
    q = np.array([float(row["q"]) for row in rows])
    chi1 = np.array([float(row["chi1z"]) for row in rows])
    chi2 = np.array([float(row["chi2z"]) for row in rows])
    v = np.array([float(row["vkick_kms"]) for row in rows])
    return catalog, q, chi1, chi2, v


def load_candidate(directory):
    """Import candidate.py from a candidate directory."""
    path = directory / "candidate.py"
    spec = importlib.util.spec_from_file_location(f"candidate_{directory.name}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def groups_of(q, chi1, chi2):
    """Return one integer label per binary, shared by its duplicates across catalogs."""
    keys = [(round(a, DECIMALS), round(b, DECIMALS), round(c, DECIMALS)) for a, b, c in zip(q, chi1, chi2)]
    index = {key: number for number, key in enumerate(sorted(set(keys)))}
    return np.array([index[key] for key in keys])


def summary(errors):
    """Median and 90th percentile, NaN for an empty set."""
    if errors.size == 0:
        return float("nan"), float("nan")
    return float(np.median(errors)), float(np.percentile(errors, 90))


def physics(directory):
    """Run the physics checks on the refitted candidate. Return passed count and failed names."""
    command = [sys.executable, str(CHECKER), str(directory / "candidate.py"), str(directory / "state.pkl")]
    done = subprocess.run(command, capture_output=True, text=True, cwd=directory)
    print(done.stdout.strip())
    if done.returncode not in (0, 1):
        print(done.stderr[-1500:])
        return 0, "crashed"
    failed = [line.split()[1] for line in done.stdout.splitlines() if line.startswith("FAIL")]
    passed = sum(1 for line in done.stdout.splitlines() if line.startswith("PASS"))
    return passed, ";".join(failed)


def main():
    """Evaluate one candidate and record the result."""
    directory = Path(sys.argv[1]).resolve()
    module = load_candidate(directory)
    catalog, q, chi1, chi2, v = load_train()
    started = time.time()
    predicted = np.full(v.shape, np.nan)
    for train, held in GroupKFold(n_splits=FOLDS).split(q, v, groups_of(q, chi1, chi2)):
        state = module.fit(q[train], chi1[train], chi2[train], v[train], catalog[train])
        predicted[held] = np.asarray(module.predict(state, q[held], chi1[held], chi2[held]), dtype=float)
    errors = np.abs(predicted - v)
    nr = catalog != "BHPT"
    nr_median, nr_p90 = summary(errors[nr])
    bhpt_median, bhpt_p90 = summary(errors[~nr])
    state = module.fit(q, chi1, chi2, v, catalog)
    with open(directory / "state.pkl", "wb") as handle:
        pickle.dump(state, handle)
    passed, failed = physics(directory)
    record = {
        "candidate": directory.name,
        "nr_median": round(nr_median, 3),
        "nr_p90": round(nr_p90, 3),
        "bhpt_median": round(bhpt_median, 4),
        "bhpt_p90": round(bhpt_p90, 4),
        "physics_passed": passed,
        "physics_failed": failed,
        "seconds": round(time.time() - started, 1),
    }
    (directory / "metrics.json").write_text(json.dumps(record, indent=1))
    new = not LEADERBOARD.exists()
    with open(LEADERBOARD, "a", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        if new:
            writer.writeheader()
        writer.writerow(record)
    print(json.dumps(record))


if __name__ == "__main__":
    main()
