"""Predict the KickBench hidden test set with published kick models, as reference lines.

Models and implementations are the ones used in evaluate_all.py of the v2 work on
Islam, Wadekar & Khanna, arXiv:2608.00934: v2 and v1 gwModelRemS, HLZ2014 (arXiv:1406.7295),
HL2018 (arXiv:1801.08162), IW2025 (Islam & Wadekar, arXiv:2511.11536), NRSur3dq8Remnant (surfinBH).

Env: kitp-2026 (needs gwModels and surfinBH).
"""

import contextlib
import io
import json
import os
import sys
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

# Folder of the v2 kick fitting framework, and the gwModels package, from the author.
KICK_DIR = Path(os.environ.get("KICKBENCH_KICK_DIR", "aligned-spin/kick"))
sys.path.insert(0, str(KICK_DIR))
sys.path.insert(0, os.environ.get("GWMODELS_DIR", "gwModels"))

import framework as fw
import gwModels.remnants as gr
import surfinBH

HERE = Path(__file__).resolve().parent
KMS_PER_C = 299792.458


def v2_model():
    """Return the final v2 gwModelRemS kick model."""
    final = json.load(open(KICK_DIR / "final_v2_kick.json"))
    fw.BHPT_MODEL = final["bhpt_model"]
    fw.SIGMA_MOD = final["sigma_mod"]
    model = fw.KickModel(final["mass"], [tuple(term) for term in final["spin"]], final["xi"])
    model.p = np.array(final["coefficients"])
    return model


def surrogate_kick(q, chi1, chi2):
    """Return NRSur3dq8Remnant kick magnitudes, extrapolating outside its domain."""
    with contextlib.redirect_stdout(io.StringIO()):
        fit = surfinBH.LoadFits("NRSur3dq8Remnant")
        values = [
            np.linalg.norm(fit.all(a, [0, 0, b], [0, 0, c], allow_extrap=True)[2]) * KMS_PER_C
            for a, b, c in zip(q, chi1, chi2)
        ]
    return np.array(values)


def main():
    """Write private/reference_predictions.npz."""
    test = np.load(HERE / "hidden_test.npz")
    q = test["q"]
    chi1 = test["chi1z"]
    chi2 = test["chi2z"]
    frame = pd.DataFrame({"q": q, "chi1z": chi1, "chi2z": chi2})
    model = v2_model()
    predictions = {
        "v2 gwModelRemS": np.asarray(model.predict(fw.variables(frame))),
        "v1 gwModelRemS": np.asarray(gr.gwModelRemS_kick(q, chi1, chi2)),
        "HLZ2014": gr.bbh_final_kick_nonprecessing_HLZ2014(q, chi1, chi2),
        "HL2018": gr.bbh_final_kick_nonprecessing_HL2018(q, chi1, chi2),
        "IW2025": np.array(
            [float(np.atleast_1d(gr.gwModel_kick_q200(a, b, c))[0]) for a, b, c in zip(q, chi1, chi2)]
        ),
        "NRSur3dq8Remnant": surrogate_kick(q, chi1, chi2),
    }
    np.savez(HERE / "reference_predictions.npz", **predictions)
    print("wrote", list(predictions))


if __name__ == "__main__":
    main()
