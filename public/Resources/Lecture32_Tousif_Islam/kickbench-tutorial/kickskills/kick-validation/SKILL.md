---
name: kick-validation
description: >
  Load before estimating the error of a black hole kick model, choosing between kick models, or
  reporting expected test errors. Grouped cross validation, the catalog noise floor, a physics
  self-check script, and how to state an error estimate you can defend.
sources: [arXiv:1406.7295, gr-qc/0610154]
---

# Validating a kick model

## 1. Measure the floor before chasing it

The same physical binary appears in several catalogs (SXS, RIT, MAYA). Run

    python .claude/skills/kick-validation/scripts/noise_floor.py data/train.csv

It groups rows with the same `(q, chi1, chi2)` to two decimals across catalogs and prints the
median and 90th percentile of the disagreement. The 90th percentile is the one to compare with
your model's 90th percentile: errors at that level in the tail are partly the data's, not the
model's.

## 2. Cross-validate by binary, not by row

Random K-fold leaks: a duplicate of a validation binary from another catalog sits in the
training fold. Use `sklearn.model_selection.GroupKFold` with groups from the rounded
`(q, chi1, chi2)` key, 5 folds. Report the median and 90th percentile of `|v_pred - v|` on the
out-of-fold numerical relativity rows, and the same on perturbation theory rows separately.

Every choice made while looking at these numbers (features, form, hyperparameters, which of
several models) makes the best of them optimistic. When you compare more than a handful of
models, keep one fold aside until the end, or add 10 to 20 per cent to the estimate.

## 3. Check the physics outside the data

    python .claude/skills/kick-validation/scripts/check_physics.py solve.py

It imports `kick` from the file and checks, on a grid well outside the data (q up to 10^4, all
spins in [-1, 1]): finite, non-negative, at most 700 km/s; zero kick at q = 1 with equal spins;
the same speed when the spins are swapped at q = 1; slope of `log v` against `log q` between
q = 10^3 and 10^4 equal to -2. It prints PASS or FAIL for each, with the worst case. It also
accepts a candidate module with a `predict(state, q, chi1, chi2)` and a pickled state, see its
docstring.

Run it on every model you might submit, not only the last one. A model that fails it is wrong
somewhere, even if its cross-validated error is the lowest.

## 4. Choose and report

- Choose among the models that pass every physics check. Prefer the simpler one when the
  cross-validated medians differ by less than about 0.2 km/s.
- State the estimate from out-of-fold errors of the model you submit, fitted the way you
  submit it, plus the optimism allowance from step 2.
- Do not report an error measured on data the model was fitted to.
