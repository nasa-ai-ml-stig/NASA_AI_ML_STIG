# KickAgent

A validation-constrained agent workflow for KickBench, in the spirit of gwAgent
(arXiv:2605.11280): the agent proposes candidate models, each is scored by a fixed tool on the
training data only, and the final answer is chosen by that score among physically valid models.

Installed into a session as:

- `CLAUDE_workflow.md`, appended to the session's `CLAUDE.md`: the loop and the delivery rules;
- `tools/evaluate.py`: grouped 5-fold cross validation on `data/train.csv`, refit, physics checks,
  `leaderboard.csv`;
- `tools/export.py`: writes `solve.py` from the chosen candidate;
- `templates/candidate.py`: the `fit` / `predict` interface;
- both KickSkills.

In the talk, KickBench ran three arms: `none` (bare task), `skill` (KickSkills only) and `agent`
(KickSkills plus this workflow and tools), with the same model, prompt, budget and wall clock in
every arm. In this repository, `cd starter_kit && python make_run.py agent 1` builds the agent arm on the
starter kit's task for any coding agent. There the workflow is appended to `AGENTS.md`, `CLAUDE.md`
and `GEMINI.md`, and the skills are placed in both `.claude/skills/` and `.agents/skills/`.

The agent arm bundles three things: the skills, a structured search, and more evaluations. A gain
over the skill arm therefore shows what the loop adds on top of the skills, under the same budget.
