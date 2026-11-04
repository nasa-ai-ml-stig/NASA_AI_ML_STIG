"""KickBench sanity baseline: the median training kick, for every binary."""

from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
TRAIN = HERE / "data" / "train.csv"
VALUE = np.median(np.loadtxt(TRAIN, delimiter=",", skiprows=1, usecols=4))


def kick(q, chi1, chi2):
    """Return the same speed for every input."""
    return np.full(np.shape(q), VALUE)
