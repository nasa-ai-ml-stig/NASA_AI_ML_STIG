---
name: kick-physics
description: >
  Load before choosing, fitting or extending a model of the recoil (kick) speed of a merging
  binary black hole with aligned spins. Conventions, the two-vector structure of the kick, the
  limits every model must obey, and how to keep those limits while using a flexible ML fit.
sources: [gr-qc/0610154, arXiv:1406.7295, Fitchett 1983 MNRAS 203 1049]
---

# Physics of the aligned-spin kick

## Conventions (check these first)

- `q = m1 / m2 >= 1`, `chi1` is the heavier hole. Many papers use `q <= 1` or put `chi1` on the
  lighter hole. Copying a formula without converting swaps the holes.
- Bounded mass variables: `eta = q / (1 + q)^2` (0.25 at q = 1, about `1/q` at large q) and
  `dm = (q - 1) / (q + 1)` (0 at q = 1, 1 as q grows).
- Spin variables, bounded for every q:
  `S = (q^2 chi1 + chi2) / (1 + q)^2` and `D = (chi2 - q chi1) / (1 + q)`.
  At q = 1, `S = (chi1 + chi2) / 4` is symmetric and `D = (chi2 - chi1) / 2` changes sign when
  the holes are relabelled. As q grows, `S -> chi1` and `D -> -chi1`.

## Structure: two vectors in the orbital plane

For aligned spins the kick lies in the orbital plane. It is the sum of a mass part and a spin
part at an angle `xi` (Fitchett 1983; Gonzalez et al. 2007; Healy, Lousto & Zlochower 2014):

    v^2 = vm^2 + vs^2 + 2 vm vs cos(xi)
    vm  = eta^2 dm  * Fm(eta, S, D^2)                       mass part, zero at q = 1
    vs  = eta^2 D   * Fs(eta, S, D^2, dm D)                 spin part, odd in D at q = 1
    xi  = xi(eta, S, dm D)                                  angle between them

The non-spinning limit is Gonzalez et al. (2007), gr-qc/0610154, Eq. (2):
`vm = A eta^2 sqrt(1 - 4 eta) (1 + B eta)`, with `A` about 1.2e4 km/s, `B` about -0.93, and
`sqrt(1 - 4 eta) = dm`. The spin part starts linear in `D`. Low-order polynomials in `S`, `D`
and `dm D` for `Fm`, `Fs` and `xi` are the published starting point
(arXiv:1406.7295, Eqs. 4 to 6). Refit every coefficient on the data you have.

See `references/forms.md` for a worked parametric form and the fitting recipe.

## Limits a model must obey, and why the form above obeys them

| Limit | Physical reason | Built in by |
|---|---|---|
| Zero kick at q = 1 with `chi1 = chi2` | the binary is symmetric, no direction is preferred | `dm = 0` and `D = 0` |
| Same speed when the holes are relabelled at q = 1 | relabelling flips the kick vector, not its length | `vm = 0` and `vs` odd in `D`, everything else even in `D` |
| `v ~ q^-2` as q grows, well beyond any data | momentum flux scales as `eta^2` | the `eta^2` prefactor times factors of bounded inputs |
| Finite, non-negative, below about 700 km/s for aligned spins | aligned-spin kicks never exceed about 500 km/s | the magnitude form, bounded factors |

A model that learns these from data instead will break them somewhere outside the data. Data
reach q of about 1000, so the large-q slope matters at q of 10^3 to 10^4.

## Flexible fits that keep the limits

Black-box regressors fitted to `v` in terms of `q, chi1, chi2` reach good accuracy and then fail
the limits: they do not vanish at the symmetric point, are not symmetric under relabelling, and
do not fall as `q^-2` where there is no data. Keep the structure and put the flexibility inside:

1. **Multiplicative correction.** Fit the parametric form `v0` first. Then fit a regressor `r`
   to `log(v / v0)` on bounded, relabelling-symmetric inputs (`eta`, `S`, `D^2`, `dm D`,
   `dm`), clip it to a bounded range, and predict `v = v0 exp(r)`. Zeros of `v0` stay zeros,
   symmetry is kept, and bounded `r` keeps the `q^-2` fall. Skip points where `v0` or `v` is
   below about 1 km/s when fitting `r`.
2. **Flexible factors.** Replace the polynomials `Fm`, `Fs` or `xi` by smooth functions of the
   same bounded inputs (a small kernel ridge or a spline basis), and fit them through the
   magnitude formula with `scipy.optimize.least_squares`.

Do not feed `q`, `log q` or raw `chi1, chi2` to a regressor whose output is not multiplied by
`eta^2`: its behaviour beyond the data is then unconstrained.

## Data facts

- Several catalogs simulate the same physical binary. Most such pairs agree closely, but a
  tail disagrees by several km/s, which no model can beat. `kick-validation` shows how to
  measure it.
- Perturbation theory (BHPT) rows have tiny kicks at large q. An absolute loss ignores them, a
  relative loss there is what fixes the large-q behaviour.
