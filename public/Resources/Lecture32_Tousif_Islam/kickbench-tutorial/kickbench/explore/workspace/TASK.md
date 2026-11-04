# KickBench, exploration round

When two black holes merge, the remnant recoils. Model the recoil speed for binaries with spins
aligned with the orbit and no eccentricity.

In this round the goal is breadth. **Try as many genuinely different approaches as you can in
15 minutes.** Different means a different model family or physical idea, not the same model with
another hyperparameter. Every approach you save is scored, so keep the weak ones too.

## Time

The session is stopped 15 minutes after the time in `START_TIME` (Unix seconds). Check the clock
with `python -c "import time; print(time.time())"`. Work not saved when the session stops is lost,
so save each approach as soon as it works.

## Data

`data/train.csv` has 1510 simulations.

| Column | Meaning |
|---|---|
| `catalog` | SXS, RIT, MAYA: numerical relativity. BHPT: perturbation theory at large mass ratio |
| `q` | mass ratio m1/m2, always >= 1 |
| `chi1z` | dimensionless spin of the heavier hole along the orbital angular momentum |
| `chi2z` | the same for the lighter hole |
| `vkick_kms` | recoil speed in km/s |

## Deliver, once per approach

Make a directory `approaches/NN_short_name/`, numbered in the order you try them (`01_`, `02_`, ...).
In it put:

1. `solve.py`, defining `kick(q, chi1, chi2)`. It takes three numpy arrays of equal length and
   returns an array of speeds in km/s. It may load only files inside its own directory. It may
   import only the Python standard library, numpy, scipy and scikit-learn.
2. `REPORT.md`, two or three sentences on the idea, ending with your own estimate of its hidden
   test errors for numerical relativity, in exactly this form:

       ESTIMATE_NR_MEDIAN_KMS: <number>
       ESTIMATE_NR_P90_KMS: <number>

Do not delete or overwrite an earlier approach. Fitting scripts may live anywhere in this directory.

## Scoring

Each approach's `kick` is run on 380 hidden simulations from the same catalogs (288 numerical
relativity, 92 perturbation theory). No binary in the hidden set appears in `data/train.csv`.

- **Accuracy.** Median and 90th percentile of the absolute error in km/s, reported separately
  for numerical relativity and perturbation theory.
- **Physics.** Checked on a dense grid over 1 <= q <= 10000 and -1 <= chi <= 1, well outside the
  data: finite and non-negative everywhere, speed at most 700 km/s, no kick at q = 1 with equal
  spins, unchanged by relabelling the holes at q = 1, and falling as q^-2 at very large q.
