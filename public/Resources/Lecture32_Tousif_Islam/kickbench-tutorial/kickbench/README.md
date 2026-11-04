# KickBench

The full benchmark behind Sections 3 and 4 of the talk. An agent gets 1510 aligned-spin black
hole mergers with their recoil (kick) speeds and must deliver `solve.py` with `kick(q, chi1, chi2)`
and a `REPORT.md` with its own error estimate. A grader it cannot see runs that code on 380 hidden
simulations (288 numerical relativity, 92 perturbation theory) and checks six physics conditions
out to mass ratio q = 10^4.

**The hidden test set is not in this repository.** `private/score.py` is published so the grading
rules can be read, but it cannot run without `private/hidden_test.npz`, which stays with the
author. To run the same kind of experiment yourself, use [`../starter_kit/`](../starter_kit/),
whose hidden data are carved out of the KickBench training set.

## Layout

```
workspace/              what every single-answer session sees
  TASK.md               the task, deliverables and scoring rules, as given to every session
  AGENTS.md             house rules (copied to CLAUDE.md at launch)
  data/train.csv        1510 training simulations
explore/workspace/      the 15 minute exploration protocol: as many different approaches as possible
private/                the grader side; never visible to a session
  score.py              runs kick() on the hidden set and the physics grid; reports accuracy and
                        physics separately and compares the stated error with the measured one
  Islam2026_kickbench_dataset.py              builds train.csv and the hidden set from the
                                              curated data, with a frozen split hash
  Islam2026_kickbench_reference_predictions.py  published models on the hidden set, as reference
baselines/              constant_median and gpr_black_box, for scale
run_model.py            one model, one seed, one protocol, one arm, in a fresh sandboxed folder
run_all.sh, run_arms.sh the runs in the talk: three models, three seeds, three arms
analysis/               scripts, tables (results/) and figures (figures/) from those runs
export_public.py        assembles a scrubbed public release of sessions and transcripts
```

## How the runs in the talk were made

`run_model.py` copies `workspace/` to a fresh session folder and launches Claude Code with the
one-sentence prompt `Read TASK.md and complete the task.`, a 45 minute limit and a $5 spending
limit. A macOS sandbox lets the agent read only its own session folder, so the hidden set and the
published models cannot be opened, and Python comes from an environment with only numpy, scipy,
scikit-learn and matplotlib. Arms (fourth argument):

- `none`: the bare task;
- `skill`: KickSkills ([`../kickskills/`](../kickskills/)) installed at `.claude/skills/`;
- `agent`: KickSkills plus the KickAgent workflow and tools ([`../kickagent/`](../kickagent/)).

```
python run_model.py claude-sonnet-4-5 1 single agent
python private/score.py agentic_works/sonnet-4-5/single_s1_agent
```

The sandbox profile and environment paths are specific to the author's machine; adapt them before
running. `run_all.sh` and `run_arms.sh` read the Python interpreter from `$PYTHON`. The two
`private/` data scripts need the curated data set and the author's model code, located with the
environment variables `KICKBENCH_SOURCE`, `KICKBENCH_KICK_DIR` and `GWMODELS_DIR`.

## Results

Summary tables are in `analysis/results/` (`leaderboard.md`, `arms_summary.md`,
`explore_summary.md`, and per-session `sessions.csv` and `arms_sessions.md`), and the figures
shown in the talk are in `analysis/figures/`. These hold only per-session summary metrics, never
the hidden values themselves.

Read them with the caveats from the talk: three seeds per cell is a picture of the spread, not a
ranking; the agent arm bundles skills, structured search and more evaluations; and the author of
the skills also wrote the benchmark and the published reference fit, so a gain shows that this
author's knowledge transfers, not that an independent expert's would.

## Data

Clean aligned-spin table of Islam, Wadekar & Khanna, arXiv:2608.00934 (SXS, RIT and MAYA
numerical relativity, and black hole perturbation theory), with its frozen train and test split.
No binary appears on both sides. Convention: `q = m1/m2 >= 1`, `chi1z` belongs to the heavier
hole, kicks in km/s.
