---
name: kick-physics
description: >
  Load before fitting or extending a model of the recoil (kick) speed of a merging binary
  black hole with aligned spins. Conventions, the structure of the kick, and how to keep its
  physical limits while fitting data.
sources: [Fitchett 1983 MNRAS 203 1049, gr-qc/0610154, arXiv:1406.7295]
---

# The aligned-spin kick

## Conventions (check first)

`q = m1/m2 >= 1` and `chi1` is the heavier hole. Many papers use `q <= 1`: convert before
copying a formula, or you swap the holes.

Bounded variables: `eta = q/(1+q)^2`, `dm = (q-1)/(q+1)`, `D = (chi2 - q chi1)/(1+q)`.

## Structure

The kick is the sum of a mass part and a spin part at an angle `xi`:

    v^2 = vm^2 + vs^2 + 2 vm vs cos(xi)
    vm  = A eta^2 dm (1 + B eta)          Gonzalez et al. 2007, Eq. (2)
    vs  = H eta^2 D (1 + ...)             Healy, Lousto & Zlochower 2014

Fit `A`, `B`, `H`, `xi` (and any extra terms) to the data with `scipy.optimize.least_squares`.

## Limits, and how this form keeps them

| Limit | Kept by |
|---|---|
| no kick for identical holes | `dm = 0` and `D = 0` there |
| same speed when the holes are relabelled at q = 1 | `vs` is odd in `D`, all else even |
| falls as `q^-2` far beyond the data | the `eta^2` prefactor, with bounded factors |

A free regressor on `q, chi1, chi2` fits the data and breaks these limits where there is no
data. To add flexibility, fit a bounded correction `r` to `log(v / v0)` on `eta, D^2, dm` and
predict `v = v0 exp(r)`: the limits survive.

## Honest errors

The same binary appears in several catalogs. Cross-validate by binary (group rows by rounded
`q, chi1, chi2`), never by row, or your error estimate is too optimistic.
