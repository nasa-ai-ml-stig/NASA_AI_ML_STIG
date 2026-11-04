# A worked parametric form and fitting recipe

Variables as in `SKILL.md`: `eta`, `dm`, `S`, `D`, with `q >= 1` and `chi1` on the heavier hole.

## Form

    vm = A eta^2 dm (1 + a1 eta + a2 S)
    vs = H eta^2 D (1 + b1 dm^2 + b2 S + b3 S^2 + b4 D^2) + H eta^2 b5 S dm
    xi = c0 + c1 S + c2 dm D
    v  = sqrt(max(vm^2 + vs^2 + 2 vm vs cos(xi), 0))

The last term of `vs` (`S dm`) is allowed because it vanishes at q = 1. Every other term in `vs`
is odd in `D` there, as the relabelling symmetry requires. This is close to the structure of
Healy, Lousto & Zlochower 2014 (arXiv:1406.7295), rewritten for `q >= 1`. It has 12 parameters.

## Starting values

`A = 1.2e4`, `H = 7e3` km/s, `c0 = 2` rad (spin and mass parts roughly opposed), everything else
0. The fit is not convex: try several starts for `c0` in `[0, pi]` and keep the best.

## Loss

Use `scipy.optimize.least_squares` with `loss="soft_l1"` and `f_scale` of a few km/s. Residuals:

- numerical relativity: `v_model - v_data` in km/s;
- perturbation theory: `(v_model - v_data) / max(v_data, 1e-3)` times a few km/s, so that the
  large-q rows matter at all.

Fit in two stages if it struggles: first `A`, `a1` on the rows with `chi1 = chi2 = 0`, then the
rest with those fixed as starting values.

## What to expect

A form like this, well fitted, has a median error of a few km/s. It passes every limit in
`SKILL.md` by construction. Improvements beyond it should
come from the flexible factors or a multiplicative correction, judged by grouped cross
validation (`kick-validation`), not from a free regressor on `q, chi1, chi2`.
