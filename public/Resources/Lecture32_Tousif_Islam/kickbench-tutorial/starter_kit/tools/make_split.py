"""Build the starter kit's data from the KickBench training set only.

The kit needs its own hidden set. It is carved out of kickbench/workspace/data/train.csv, grouped
by binary so that no binary appears on both sides. KickBench's own hidden test set
(kickbench/private/) is never read, so the kit can be shared without leaking it.

Writes workspace/data/train.csv and grader/hidden.csv. Run once; the outputs are committed.

Env: base.
"""

from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
KIT = HERE.parent
SOURCE = KIT.parent / "kickbench" / "workspace" / "data" / "train.csv"
HIDDEN_FRACTION = 0.25
SEED = 2026


def main():
    """Split by rounded (q, chi1, chi2) and write the two CSV files."""
    header = SOURCE.read_text().splitlines()[0]
    rows = SOURCE.read_text().splitlines()[1:]
    keys = []
    for row in rows:
        catalog, q, chi1, chi2, _ = row.split(",")
        keys.append((round(float(q), 2), round(float(chi1), 2), round(float(chi2), 2)))
    groups = sorted(set(keys))
    rng = np.random.default_rng(SEED)
    hidden_groups = set(groups[i] for i in rng.permutation(len(groups))[: int(HIDDEN_FRACTION * len(groups))])
    train = [row for row, key in zip(rows, keys) if key not in hidden_groups]
    hidden = [row for row, key in zip(rows, keys) if key in hidden_groups]
    (KIT / "workspace" / "data").mkdir(parents=True, exist_ok=True)
    (KIT / "grader").mkdir(exist_ok=True)
    (KIT / "workspace" / "data" / "train.csv").write_text("\n".join([header] + train) + "\n")
    (KIT / "grader" / "hidden.csv").write_text("\n".join([header] + hidden) + "\n")
    print(f"train {len(train)} rows, hidden {len(hidden)} rows, {len(hidden_groups)} hidden binaries")


if __name__ == "__main__":
    main()
