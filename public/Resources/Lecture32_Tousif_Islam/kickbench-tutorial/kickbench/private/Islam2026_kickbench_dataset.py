"""Build the KickBench train and hidden test files from the clean aligned-spin data set.

Source: aligned_spin_circular.csv, the v2 curation of Islam, Wadekar & Khanna, arXiv:2608.00934
(rules and thresholds in its DATA_CARD.md and build_dataset.py). Rows with use_vkick are used and
no new cut is made here. The frozen split is kept: split == "train" is shown to the agent and
split == "test" is hidden. Duplicates of one physical binary never cross the split.

The hash of test_set_ids.txt is checked against the value frozen in FITTING_PROTOCOL.md.

Convention: q = m1 / m2 >= 1, chi1z belongs to the heavier hole, kick in km/s.

Env: base or kitp-2026, needs numpy and pandas only.
"""

import hashlib
import os
from pathlib import Path

import numpy as np
import pandas as pd

# Folder with aligned_spin_circular.csv and test_set_ids.txt from the curated data set.
SOURCE = Path(os.environ.get("KICKBENCH_SOURCE", "aligned-spin/data"))
FROZEN_HASH = "62896bf289016215908e62d5f4a44db3947d529689dd3b889d7afa8c1f19e63c"
HERE = Path(__file__).resolve().parent
PUBLIC_COLUMNS = ["catalog", "q", "chi1z", "chi2z", "vkick_kms"]


def main():
    """Write workspace/data/train.csv and private/hidden_test.npz."""
    digest = hashlib.sha256((SOURCE / "test_set_ids.txt").read_bytes()).hexdigest()
    if digest != FROZEN_HASH:
        raise RuntimeError("test_set_ids.txt changed, refusing to build")
    table = pd.read_csv(SOURCE / "aligned_spin_circular.csv")
    clean = table[table["use_vkick"]]
    train = clean[clean["split"] == "train"]
    test = clean[clean["split"] == "test"]
    shared = set(train["config_key"]) & set(test["config_key"])
    if shared:
        raise RuntimeError(f"{len(shared)} configurations are in both splits")
    train[PUBLIC_COLUMNS].to_csv(HERE.parent / "workspace" / "data" / "train.csv", index=False)
    np.savez(
        HERE / "hidden_test.npz",
        sim_id=test["sim_id"].to_numpy().astype(str),
        catalog=test["catalog"].to_numpy().astype(str),
        q=test["q"].to_numpy(),
        chi1z=test["chi1z"].to_numpy(),
        chi2z=test["chi2z"].to_numpy(),
        vkick_kms=test["vkick_kms"].to_numpy(),
    )
    print("train", train.groupby("catalog").size().to_dict(), len(train))
    print("test", test.groupby("catalog").size().to_dict(), len(test))


if __name__ == "__main__":
    main()
