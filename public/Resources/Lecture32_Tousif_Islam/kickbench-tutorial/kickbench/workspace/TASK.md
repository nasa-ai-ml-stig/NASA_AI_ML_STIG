# KickBench

When two black holes merge, the remnant recoils. Build the best model you can of the recoil
speed for binaries with spins aligned with the orbit and no eccentricity.

## Data

`data/train.csv` has 1510 simulations.

| Column | Meaning |
|---|---|
| `catalog` | SXS, RIT, MAYA: numerical relativity. BHPT: perturbation theory at large mass ratio |
| `q` | mass ratio m1/m2, always >= 1 |
| `chi1z` | dimensionless spin of the heavier hole along the orbital angular momentum |
| `chi2z` | the same for the lighter hole |
| `vkick_kms` | recoil speed in km/s |

## Deliver

1. `solve.py`, defining `kick(q, chi1, chi2)`. It takes three numpy arrays of equal length and
   returns an array of speeds in km/s. It may load files you saved in this directory. It may
   import only the Python standard library, numpy, scipy and scikit-learn.
2. `REPORT.md`, describing the model and how you chose it, ending with your own estimate of the
   hidden test errors for numerical relativity, in exactly this form:

       ESTIMATE_NR_MEDIAN_KMS: <number>
       ESTIMATE_NR_P90_KMS: <number>

## Scoring

Your `kick` is run on 380 hidden simulations from the same catalogs (288 numerical relativity,
92 perturbation theory). No binary in the hidden set appears in `data/train.csv`.

- **Accuracy.** Median and 90th percentile of the absolute error in km/s, reported separately
  for numerical relativity and perturbation theory. The ranking uses numerical relativity.
- **Physics.** Checked on a dense grid over 1 <= q <= 10000 and -1 <= chi <= 1, well outside the
  data: finite and non-negative everywhere, speed at most 700 km/s, no kick at q = 1 with equal
  spins, unchanged by relabelling the holes at q = 1, and falling as q^-2 at very large q.

Stop when you have no further improvement you can justify.
