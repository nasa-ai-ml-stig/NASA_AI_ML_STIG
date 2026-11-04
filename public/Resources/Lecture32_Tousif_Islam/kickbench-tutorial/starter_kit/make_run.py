"""Make a fresh run folder for one arm of the experiment, for any coding agent.

    python make_run.py none 1          # runs/none_s1: the bare task
    python make_run.py skill 1         # runs/skill_s1: the task plus skills/kick-physics
    python make_run.py kickskills 1    # runs/kickskills_s1: the task plus both KickSkills
    python make_run.py agent 1         # runs/agent_s1: both KickSkills plus the KickAgent loop

The run folder is a copy of workspace/. AGENTS.md is also copied to CLAUDE.md and GEMINI.md,
the names Claude Code and Gemini CLI read by default. Skills are placed where the common agents
look for them (.agents/skills and .claude/skills). The agent arm also appends the KickAgent
workflow to the house rules and copies its tools/ and templates/ into the run folder, as the
agent arm of the talk did. The grader and its hidden data stay outside the run folder.

Env: any Python 3. The agent arm's tools/evaluate.py also needs scikit-learn.
"""

import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
KICKSKILLS = REPO / "kickskills"
KICKAGENT = REPO / "kickagent"
PROMPT = "Read TASK.md and complete the task."
SKILL_DIRS = [".agents/skills", ".claude/skills"]
ARMS = ["none", "skill", "kickskills", "agent"]
HOUSE_RULES = ["AGENTS.md", "CLAUDE.md", "GEMINI.md"]


def install_skills(run_dir, source_dirs):
    """Copy each skill folder into every skill location of the run folder."""
    for folder in SKILL_DIRS:
        for source in source_dirs:
            shutil.copytree(source, run_dir / folder / source.name)


def main():
    """Create runs/<arm>_s<seed> and print how to run an agent in it."""
    if len(sys.argv) != 3 or sys.argv[1] not in ARMS:
        raise SystemExit("usage: python make_run.py {" + ",".join(ARMS) + "} <seed>")
    arm = sys.argv[1]
    seed = sys.argv[2]
    run_dir = HERE / "runs" / f"{arm}_s{seed}"
    if run_dir.exists():
        raise SystemExit(f"{run_dir} exists: use another seed")
    shutil.copytree(HERE / "workspace", run_dir)
    if arm == "skill":
        install_skills(run_dir, [HERE / "skills" / "kick-physics"])
    if arm in ("kickskills", "agent"):
        install_skills(run_dir, [KICKSKILLS / "kick-physics", KICKSKILLS / "kick-validation"])
    if arm == "agent":
        shutil.copytree(KICKAGENT / "tools", run_dir / "tools")
        shutil.copytree(KICKAGENT / "templates", run_dir / "templates")
        rules = (run_dir / "AGENTS.md").read_text()
        workflow = (KICKAGENT / "CLAUDE_workflow.md").read_text()
        (run_dir / "AGENTS.md").write_text(rules.rstrip() + "\n\n" + workflow)
    for name in HOUSE_RULES[1:]:
        shutil.copy(run_dir / "AGENTS.md", run_dir / name)
    relative = run_dir.relative_to(HERE)
    print(f"Made {relative}. Run ONE of these, then score it:\n")
    print(f"  cd {relative} && claude -p \"{PROMPT}\"      # Claude Code")
    print(f"  cd {relative} && codex exec \"{PROMPT}\"     # OpenAI Codex CLI")
    print(f"  cd {relative} && gemini -p \"{PROMPT}\"      # Gemini CLI")
    if arm == "agent":
        print("  (the agent arm needs a coding agent: its loop runs tools, so ask_llm.py cannot do it)\n")
    else:
        print(f"  python ask_llm.py {relative}                    # no agent: one call to any chat API\n")
    print(f"  python grader/score.py {relative}")


if __name__ == "__main__":
    main()
