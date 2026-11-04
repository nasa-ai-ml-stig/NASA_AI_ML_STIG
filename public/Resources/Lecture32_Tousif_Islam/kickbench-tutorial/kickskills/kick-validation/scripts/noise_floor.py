"""Estimate the catalog noise floor of aligned-spin kicks from duplicated binaries.

Rows with the same (q, chi1, chi2), rounded to two decimals, from different catalogs simulate the
same physical binary. The spread of their kicks bounds how well any model can do.

    python noise_floor.py data/train.csv

Needs numpy only.
"""

import csv
import sys
from collections import defaultdict

import numpy as np

DECIMALS = 2


def main():
    """Print the median and 90th percentile of cross-catalog kick differences."""
    groups = defaultdict(list)
    with open(sys.argv[1]) as handle:
        for row in csv.DictReader(handle):
            if row["catalog"] == "BHPT":
                continue
            key = tuple(round(float(row[name]), DECIMALS) for name in ("q", "chi1z", "chi2z"))
            groups[key].append((row["catalog"], float(row["vkick_kms"])))
    differences = []
    for members in groups.values():
        for i in range(len(members)):
            for j in range(i + 1, len(members)):
                if members[i][0] != members[j][0]:
                    differences.append(abs(members[i][1] - members[j][1]))
    differences = np.array(differences)
    if differences.size == 0:
        print("no binary appears in more than one catalog")
        return
    print(f"pairs of duplicated binaries across catalogs: {differences.size}")
    print(f"median |dv|: {np.median(differences):.2f} km/s")
    print(f"90th percentile |dv|: {np.percentile(differences, 90):.2f} km/s")


if __name__ == "__main__":
    main()
