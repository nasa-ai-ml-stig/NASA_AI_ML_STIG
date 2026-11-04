"""KickAgent candidate template: copy to candidates/NN_name/candidate.py and edit.

Interface used by tools/evaluate.py and tools/export.py:
    fit(q, chi1, chi2, v, catalog) -> state       any picklable object
    predict(state, q, chi1, chi2) -> v            km/s

This template is the non-spinning limit only (Gonzalez et al. 2007, gr-qc/0610154, Eq. 2) with
its two coefficients refitted. It ignores spin, so expect a large error. It is here to show the
interface, not as a starting model.
"""

import numpy as np
from scipy.optimize import least_squares


def kick_form(params, q):
    """Gonzalez et al. 2007 non-spinning kick in km/s."""
    amplitude, b = params
    eta = q / (1.0 + q) ** 2
    dm = (q - 1.0) / (q + 1.0)
    return amplitude * eta**2 * dm * (1.0 + b * eta)


def fit(q, chi1, chi2, v, catalog):
    """Fit the two coefficients with a robust loss."""
    result = least_squares(lambda p: kick_form(p, q) - v, x0=[1.2e4, -0.93], loss="soft_l1", f_scale=5.0)
    return {"params": result.x}


def predict(state, q, chi1, chi2):
    """Evaluate the fitted form."""
    return np.abs(kick_form(state["params"], np.asarray(q, dtype=float)))
