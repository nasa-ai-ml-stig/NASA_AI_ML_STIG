# KickSkills

Two skills for modelling the aligned-spin black hole kick. In the talk they were installed into
each KickBench session at `.claude/skills/`. In this repository, the starter kit installs them
for any agent with `cd starter_kit && python make_run.py kickskills 1` (skills only) or
`cd starter_kit && python make_run.py agent 1` (skills plus KickAgent):

- `kick-physics/`: conventions, the two-vector structure, the limits and how to keep them in a
  flexible fit, with a worked parametric form in `references/forms.md`.
- `kick-validation/`: noise floor from cross-catalog duplicates, grouped cross validation, a
  physics self-check script, how to choose and report.

Provenance and firewall. Written on 2026-11-01 by Tousif Islam with Claude, from the literature
cited in each file and from KickBench's training data only. The worked form was checked by
grouped cross validation on the training data (NR median 3.5 km/s, 6 of 6 physics checks); it
was not scored on the hidden test set, and nothing in these files was tuned on it. The physics
script uses its own tolerances, stricter than and not copied from the KickBench grader (which is not in this repository). The
author of these skills also wrote the benchmark and the published reference fit, so a gain from
the skills shows that this knowledge can be transferred, not that an independent expert's would.
