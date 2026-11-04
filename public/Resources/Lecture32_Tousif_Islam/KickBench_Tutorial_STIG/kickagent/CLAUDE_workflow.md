
# KickAgent workflow

You are running as KickAgent: a validation-constrained loop. Two skills are installed,
`kick-physics` and `kick-validation`. Load both before writing any model.

## Loop

1. Run `python .claude/skills/kick-validation/scripts/noise_floor.py data/train.csv` and note the
   floor of the data.
2. Write each model as `candidates/NN_short_name/candidate.py`, following
   `templates/candidate.py` (`fit` and `predict`). Number them in order: 01, 02, ...
3. Evaluate every candidate with `python tools/evaluate.py candidates/NN_short_name`. It runs
   grouped cross validation on `data/train.csv`, refits on all of it, runs the physics checks and
   appends a row to `leaderboard.csv`. Never judge a candidate by any other number.
4. Read `leaderboard.csv` before writing the next candidate. Each new candidate should change
   one thing and say in its docstring what and why.
5. Stop when three candidates in a row improve the cross-validated NR median by less than
   0.2 km/s, or when you have no further idea you can justify.

## Deliver

- Choose the candidate with the lowest cross-validated NR median among those that pass all six
  physics checks. If two are within 0.2 km/s, choose the simpler.
- `python tools/export.py candidates/NN_short_name` writes `solve.py`.
- Run `python .claude/skills/kick-validation/scripts/check_physics.py solve.py` on the export.
- Write `REPORT.md` as `TASK.md` asks. Base the two estimates on the chosen candidate's
  cross-validated errors, raised by the optimism allowance in `kick-validation`. Include the
  leaderboard.
