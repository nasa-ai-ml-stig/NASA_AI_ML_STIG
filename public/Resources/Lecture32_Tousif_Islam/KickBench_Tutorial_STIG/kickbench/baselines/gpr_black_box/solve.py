"""KickBench sanity baseline: a Gaussian process on (log q, chi1, chi2), with no physics."""

from pathlib import Path

import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel

HERE = Path(__file__).resolve().parent
TRAIN = HERE / "data" / "train.csv"
SEED = 0


def features(q, chi1, chi2):
    """Return the model inputs."""
    return np.column_stack([np.log(q), chi1, chi2])


def fit():
    """Fit the Gaussian process to the training table."""
    table = np.loadtxt(TRAIN, delimiter=",", skiprows=1, usecols=(1, 2, 3, 4))
    kernel = RBF([1.0, 1.0, 1.0]) + WhiteKernel(1.0)
    process = GaussianProcessRegressor(kernel, normalize_y=True, random_state=SEED)
    process.fit(features(table[:, 0], table[:, 1], table[:, 2]), table[:, 3])
    return process


MODEL = fit()


def kick(q, chi1, chi2):
    """Return the Gaussian process mean, in km/s."""
    return MODEL.predict(features(q, chi1, chi2))
