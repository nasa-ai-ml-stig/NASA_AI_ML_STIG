# Task: the black hole kick

When two black holes merge, the remnant recoils. Model the recoil speed for binaries whose
spins are aligned with the orbit.

## Data

`data/train.csv`, one simulation per row:

| Column | Meaning |
|---|---|
| `catalog` | SXS, RIT, MAYA: numerical relativity (NR). BHPT: perturbation theory at large mass ratio |
| `q` | mass ratio m1/m2, always >= 1 |
| `chi1z` | spin of the heavier hole along the orbital axis, between -1 and 1 |
| `chi2z` | the same for the lighter hole |
| `vkick_kms` | recoil speed in km/s |

## Deliver

`solve.py`, defining `kick(q, chi1, chi2)`: three numpy arrays in, an array of speeds in km/s
out. It may read `data/train.csv` and fit when imported. Use only numpy and scipy.

## How it is scored

A grader you cannot see runs `kick` on hidden simulations of new binaries.

- **Accuracy:** median absolute error on the hidden NR rows, in km/s.
- **Physics, far outside the data (q up to 10^4):**
  1. no kick for identical holes (q = 1, chi1 = chi2),
  2. the same speed when the two holes are relabelled at q = 1,
  3. the speed falls as q^-2 at very large q.
