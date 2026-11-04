"""Export an evaluated KickAgent candidate as the deliverable solve.py.

    python tools/export.py candidates/03_healy_form

Copies candidate.py and state.pkl (written by tools/evaluate.py, fitted on all of train.csv) to
the run directory as candidate.py and model_state.pkl, and writes solve.py, whose kick() loads
them. Refuses a candidate that has not been evaluated.
"""

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOLVE = '''"""Kick model exported by KickAgent from {name}. See REPORT.md."""

import pickle
from pathlib import Path

import numpy as np

import candidate

HERE = Path(__file__).resolve().parent
with open(HERE / "model_state.pkl", "rb") as handle:
    STATE = pickle.load(handle)


def kick(q, chi1, chi2):
    """Recoil speed in km/s for q = m1/m2 >= 1 and aligned spins chi1 (heavier), chi2."""
    q = np.asarray(q, dtype=float)
    chi1 = np.asarray(chi1, dtype=float)
    chi2 = np.asarray(chi2, dtype=float)
    return np.asarray(candidate.predict(STATE, q, chi1, chi2), dtype=float)
'''


def main():
    """Copy the candidate and write solve.py."""
    directory = Path(sys.argv[1]).resolve()
    metrics = directory / "metrics.json"
    if not metrics.exists():
        raise SystemExit("evaluate the candidate first: python tools/evaluate.py " + sys.argv[1])
    shutil.copy(directory / "candidate.py", ROOT / "candidate.py")
    shutil.copy(directory / "state.pkl", ROOT / "model_state.pkl")
    (ROOT / "solve.py").write_text(SOLVE.format(name=directory.name))
    print("exported", directory.name, json.loads(metrics.read_text()))


if __name__ == "__main__":
    main()
