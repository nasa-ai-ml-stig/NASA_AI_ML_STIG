"""Check a kick model against the limits it must obey outside the data.

    python check_physics.py solve.py                         a file defining kick(q, chi1, chi2)
    python check_physics.py candidate.py state.pkl           a module with predict(state, q, chi1, chi2)

Checks, on a grid 1 <= q <= 1e4 and -1 <= chi1, chi2 <= 1:
    finite        every output finite
    non_negative  every output >= 0
    max_speed     every output <= 700 km/s
    equal_zero    |v| below 0.5 km/s at q = 1 with chi1 = chi2
    exchange      at q = 1, |v(chi1, chi2) - v(chi2, chi1)| below 0.5 km/s
    slope         d log v / d log q between q = 1e3 and 1e4 within -2 +- 0.2, at several chi1

The tolerances are this script's own, chosen strict. Exit status 0 only if every check passes.
"""

import importlib.util
import pickle
import sys
from pathlib import Path

import numpy as np

TOLERANCE_KMS = 0.5
SLOPE_TOLERANCE = 0.2
MAX_SPEED_KMS = 700.0


def load(argv):
    """Return a function v(q, chi1, chi2) from the command line arguments."""
    path = Path(argv[1]).resolve()
    sys.path.insert(0, str(path.parent))
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    if len(argv) > 2:
        with open(argv[2], "rb") as handle:
            state = pickle.load(handle)
        return lambda q, a, b: np.asarray(module.predict(state, q, a, b), dtype=float)
    return lambda q, a, b: np.asarray(module.kick(q, a, b), dtype=float)


def report(name, passed, detail):
    """Print one line and return the result."""
    print(f"{'PASS' if passed else 'FAIL'}  {name:13s} {detail}")
    return passed


def main():
    """Run every check and print the results."""
    kick = load(sys.argv)
    q_axis = np.geomspace(1.0, 1.0e4, 41)
    spin_axis = np.linspace(-1.0, 1.0, 21)
    q, a, b = [grid.ravel() for grid in np.meshgrid(q_axis, spin_axis, spin_axis, indexing="ij")]
    v = kick(q, a, b)
    results = []
    results.append(report("finite", bool(np.all(np.isfinite(v))), f"{np.sum(~np.isfinite(v))} non-finite"))
    finite = np.where(np.isfinite(v), v, 0.0)
    results.append(report("non_negative", bool(np.all(finite >= 0.0)), f"min {finite.min():.3g} km/s"))
    results.append(report("max_speed", bool(np.all(finite <= MAX_SPEED_KMS)), f"max {finite.max():.1f} km/s"))
    ones = np.ones_like(spin_axis)
    equal = np.abs(kick(ones, spin_axis, spin_axis))
    results.append(report("equal_zero", bool(np.all(equal < TOLERANCE_KMS)), f"worst {equal.max():.3g} km/s"))
    a1, b1 = [grid.ravel() for grid in np.meshgrid(spin_axis, spin_axis, indexing="ij")]
    ones = np.ones_like(a1)
    swap = np.abs(kick(ones, a1, b1) - kick(ones, b1, a1))
    results.append(report("exchange", bool(np.all(swap < TOLERANCE_KMS)), f"worst {swap.max():.3g} km/s"))
    spins = np.array([-0.8, -0.4, 0.0, 0.4, 0.8])
    zero = np.zeros_like(spins)
    low = kick(np.full(spins.shape, 1.0e3), spins, zero)
    high = kick(np.full(spins.shape, 1.0e4), spins, zero)
    with np.errstate(divide="ignore", invalid="ignore"):
        slopes = np.log10(high) - np.log10(low)
    good = np.isfinite(slopes) & (np.abs(slopes + 2.0) <= SLOPE_TOLERANCE)
    detail = "slopes " + " ".join(f"{s:.2f}" for s in slopes)
    results.append(report("slope", bool(np.all(good)), detail))
    print(f"{sum(results)} of {len(results)} passed")
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
