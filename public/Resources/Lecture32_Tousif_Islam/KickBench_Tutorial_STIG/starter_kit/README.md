# Starter kit: does a skill help?

A small, self-contained benchmark for the question in the talk *Skills and Benchmarks*
(NASA AI/ML STIG, 2 November 2026; see the [top-level README](../README.md)). Run the same agent
with and without a skill, grade both, and compare. It takes about 20 minutes, with any coding
agent, or with no agent and a free API key.

The example problem is the **black hole kick**: when two black holes merge, the remnant recoils,
and the task is to model the recoil speed for binaries with spins aligned with the orbit.

## What is here

```
workspace/                what the agent sees
  AGENTS.md               house rules, always loaded (copied to CLAUDE.md and GEMINI.md per run)
  TASK.md                 the task, and how it is scored
  data/train.csv          training data: 1142 simulations
skills/kick-physics/      the skill: SKILL.md, loaded when relevant
grader/                   the agent never sees this folder
  score.py                accuracy on hidden data, plus three physics limits
  hidden.csv              hidden test data: 368 simulations
make_run.py               makes a fresh run folder for one arm of the experiment
ask_llm.py                no agent: one call to any OpenAI-compatible chat API
tools/make_split.py       how the train and hidden files were made (already run)
```

## Requirements

Python 3 with `numpy`. Solutions written by the agent may also use `scipy`. The run and scoring
scripts use only the standard library and numpy; the `agent` arm's evaluation tool also needs
`scikit-learn`.

You also need one of:

- a coding agent: [Claude Code](https://docs.claude.com/en/docs/claude-code),
  [Codex CLI](https://github.com/openai/codex) or
  [Gemini CLI](https://github.com/google-gemini/gemini-cli), or
- no agent at all: an API key for any OpenAI-compatible chat endpoint, for example a free
  [Gemini key](https://aistudio.google.com/apikey) or a local model with
  [Ollama](https://ollama.com).

## Quick start: the experiment

Make two run folders, one without the skill and one with it:

```
python make_run.py none 1         # runs/none_s1: the bare task
python make_run.py skill 1        # runs/skill_s1: the same task, plus the skill
```

Run the **same** agent in both folders, for example

```
cd runs/skill_s1 && claude -p "Read TASK.md and complete the task."    # Claude Code
cd runs/skill_s1 && codex exec "Read TASK.md and complete the task."   # Codex CLI
cd runs/skill_s1 && gemini -p "Read TASK.md and complete the task."    # Gemini CLI
```

or, with no agent and no subscription:

```
export LLM_API_KEY=...            # free key: https://aistudio.google.com/apikey
python ask_llm.py runs/skill_s1
python ask_llm.py runs/none_s1 --base-url http://localhost:11434/v1 --model qwen2.5-coder   # Ollama
```

Each run must leave a `solve.py` that defines `kick(q, chi1, chi2)`. Then score both:

```
python grader/score.py runs/none_s1
python grader/score.py runs/skill_s1
```

The grader prints JSON:

```
{
 "valid": true,
 "nr_median_kms": ...,          median absolute error on hidden numerical-relativity rows, km/s
 "bhpt_median_kms": ...,        the same on hidden perturbation-theory rows
 "physics": {"twins": ..., "relabel": ..., "falloff": ...},
 "physics_passed": "N of 3"
}
```

The three physics checks are evaluated far outside the data, up to mass ratio 10^4: no kick for
identical holes, the same speed when the two holes are relabelled at q = 1, and a speed that
falls as q^-2 at very large q. `TASK.md` states all of them, so the agent knows what is checked but never
sees the answers.

Repeat with seeds 2 and 3 (`python make_run.py skill 2`, ...). One run per arm is an anecdote:
agents vary from run to run.

## More arms: KickSkills and KickAgent

Two more arms reproduce the comparison in Section 4 of the talk, using the folders
[`../kickskills/`](../kickskills/) and [`../kickagent/`](../kickagent/):

```
python make_run.py kickskills 1   # both KickSkills: kick-physics (longer, with a worked form)
                                  # and kick-validation (noise floor, grouped CV, self-check)
python make_run.py agent 1        # both KickSkills plus the KickAgent loop: tools/evaluate.py,
                                  # tools/export.py, templates/candidate.py, and the workflow
                                  # appended to AGENTS.md, CLAUDE.md and GEMINI.md
```

The agent arm needs a coding agent, because its loop runs tools; `ask_llm.py` cannot do it. In
that arm the agent writes `candidates/NN_name/candidate.py`, scores each one with
`python tools/evaluate.py candidates/NN_name` (grouped cross validation on `data/train.csv` and
six physics self-checks, logged in `leaderboard.csv`), and exports the best valid one to
`solve.py` with `tools/export.py`. The grader then scores `solve.py` as in every other arm.

The four arms differ in what the agent knows and how it searches, not in the task, the data or
the grader. The agent arm also gets a structured search and more evaluations, so a gain there is
not from the skills alone.

## Make it yours

Replace four files and the kit works for your problem:

1. **`workspace/TASK.md`:** one deliverable the grader can run (here `solve.py` with
   `kick(q, chi1, chi2)`), and the scoring rules stated in full. The agent should know what is
   checked, never the answers.
2. **`workspace/data/` and `grader/hidden.csv`:** split by object, not by row, if the same object
   appears more than once.
3. **`grader/score.py`:** your field's metric, as code, plus checks of the limits a correct answer
   must obey, evaluated where there is no data.
4. **`skills/<name>/SKILL.md`:** a `description` that says when to load it, then conventions,
   limits and the mistakes a good student would make. Nothing that only helps on the hidden data.

Five questions to start with:

1. What number would your community trust? That metric, as code, is your grader.
2. Where does ground truth come from? A simulation, an injection-recovery test, a held-out
   catalog. That is your hidden data.
3. What number in your field looks fine and means nothing on its own? That is a pitfall for
   your skill.
4. What did you warn your last student about? That is your first skill.
5. How would you cheat? Close that before you trust any score.

## Honest use

- **Keep `grader/` out of the agent's reach.** This kit keeps it outside the run folder, which is
  enough for a demonstration but not a guarantee. For a real benchmark, run the agent in a
  sandbox that cannot read the grader or its data.
- **Change one thing at a time.** Compare arms with the same agent, model and route. A single API
  call is weaker than an agent that can run its own code.
- **The benchmark firewall.** If a sentence in a skill would raise the score without making the
  agent that reads it more competent in general, it does not belong in the skill.
- **Know whose knowledge you are measuring.** If you wrote both the skill and the benchmark, a
  gain shows that your knowledge transfers to an agent, not that anyone's would.

## Data

The simulations come from the SXS, RIT and MAYA numerical-relativity catalogs and from black
hole perturbation theory (BHPT) at large mass ratio, as curated in Islam, Wadekar & Khanna,
arXiv:2608.00934. The convention is `q = m1/m2 >= 1`, `chi1z` belongs to the heavier hole, and
kicks are in km/s.

Both files in this kit are drawn from the training set of the full KickBench benchmark shown in
the talk, split by binary so that no binary appears on both sides (`tools/make_split.py`).
KickBench's own hidden test set is not included and is not reachable from this repository, so
running or publishing results with this kit does not contaminate it. `tools/make_split.py`
documents how the split was made; it needs the full KickBench folder and does not need to be
run again.

## Citation

If you use this kit, please cite the talk and the data source:

- T. Islam, *Skills and Benchmarks*, NASA AI/ML STIG lecture, 2 November 2026.
- T. Islam, D. Wadekar and G. Khanna, arXiv:2608.00934.

## License

MIT, see [LICENSE](../LICENSE).
