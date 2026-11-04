# kickbench-tutorial

**Does a skill help an AI agent on your scientific problem? A starter kit for finding out.**

This repository goes with the talk *Skills and Benchmarks: Teaching an agent your domain, and
measuring whether it learned*, given by Tousif Islam on 2 November 2026 in the
[NASA AI/ML Science and Technology Interest Group (AI/ML STIG)](https://science.nasa.gov/astrophysics/programs/cosmic-origins/community/artificial-intelligence-machine-learning-science-technology-interest-group-ai-ml-stig/)
lecture series.

The talk makes two points:

- A **skill** is expert know-how written down as a plain markdown file (`SKILL.md`) that an
  agent loads only when the task needs it.
- A **benchmark** is an exam the agent cannot mark. It has a task, hidden data, and a grader
  written as code that re-runs the agent's solution.

You only learn whether a skill helps by running the same agent on the same benchmark, with and
without the skill. Everything here is built around one example from gravitational-wave physics,
the **black hole kick**: when two black holes merge, the remnant recoils, and the task is to model
the recoil speed for binaries with spins aligned with the orbit.

## What is here

| Folder | What it is | In the talk |
|---|---|---|
| [`starter_kit/`](starter_kit/) | A small, self-contained benchmark: task, training data, hidden data, grader, and a script that makes one run folder per arm. Start here. | Section 5 |
| [`kickskills/`](kickskills/) | The two skills used in the talk: `kick-physics` (conventions, structure, limits, a worked form) and `kick-validation` (noise floor, grouped cross validation, physics self-check). | Section 4, KickSkills |
| [`kickagent/`](kickagent/) | A validation-constrained workflow: the agent writes candidate models, a fixed tool scores each by cross validation and physics checks, and the best valid one is delivered. | Section 4, KickAgent |
| [`kickbench/`](kickbench/) | The full benchmark behind the results in the talk: task, house rules, training data, grader code, run scripts, analysis, tables and figures. The hidden test set is not included. | Sections 3 and 4 |

## Quick start

```
cd starter_kit
python make_run.py none 1          # the bare task
python make_run.py skill 1         # the task plus one short skill
python make_run.py kickskills 1    # the task plus both KickSkills
python make_run.py agent 1         # both KickSkills plus the KickAgent loop
```

Run the **same** coding agent in each folder (Claude Code, Codex CLI, Gemini CLI, or any other),
then score each one:

```
cd runs/agent_s1 && claude -p "Read TASK.md and complete the task."
cd ../.. && python grader/score.py runs/agent_s1
```

No agent and no subscription? `starter_kit/ask_llm.py` sends the same files to any
OpenAI-compatible chat API, such as a free Gemini key or a local model with Ollama. Details,
requirements and how to adapt the kit to your own problem are in
[`starter_kit/README.md`](starter_kit/README.md).

## Honest use

- **Keep the grader out of the agent's reach.** The kit keeps it outside the run folder, which is
  enough for a demonstration but not a guarantee. For a real benchmark, run the agent in a
  sandbox that cannot read the grader or its data.
- **Change one thing at a time.** Compare arms with the same agent, model and route. Repeat each
  arm with at least three seeds: agents vary from run to run.
- **The benchmark firewall.** If a sentence in a skill would raise the score without making the
  agent that reads it more competent in general, it does not belong in the skill.
- **Know whose knowledge you are measuring.** The skills, the benchmark and the published
  reference fit were all written by the same person. A gain from these skills shows that this
  knowledge transfers to an agent, not that an independent expert's would.

## Relation to KickBench

The results in the talk come from the full KickBench benchmark in [`kickbench/`](kickbench/):
1510 training and 380 hidden simulations, a sandboxed 45 minute session per run, and a stricter
grader. Its code, prompts, training data and results are here; its hidden test set is not, so the
grader can be read but not run, and nothing here can contaminate the hidden set. The starter kit's
train and hidden files are both carved out of KickBench's training set, split by binary
(`starter_kit/tools/make_split.py`). KickSkills and KickAgent were written from the training data
and the literature only, and were never tuned on the hidden test set.

## Data

The simulations come from the SXS, RIT and MAYA numerical-relativity catalogs and from black
hole perturbation theory (BHPT) at large mass ratio, as curated in Islam, Wadekar & Khanna,
arXiv:2608.00934. The convention is `q = m1/m2 >= 1`, `chi1z` belongs to the heavier hole, and
kicks are in km/s.

## Citation

If you use this repository, please cite the talk and the data source:

- T. Islam, *Skills and Benchmarks*, NASA AI/ML STIG lecture, 2 November 2026.
- T. Islam, D. Wadekar and G. Khanna, arXiv:2608.00934.

## License

MIT, see [LICENSE](LICENSE).
