"""Run one model through KickBench, in a fresh sandboxed copy of the workspace.

    python run_model.py claude-sonnet-4-6 1
    python run_model.py claude-sonnet-4-6 1 explore
    python run_model.py claude-sonnet-4-6 1 single skill
    python run_model.py claude-sonnet-4-6 1 single agent

Arms (fourth argument, default none): none is the bare task. skill installs KickSkills
(../kickskills/) at .claude/skills/ and allows the Skill tool. agent adds KickAgent (../kickagent/): its
tools and template, and its workflow appended to AGENTS.md
(copied to CLAUDE.md at launch, the name Claude Code reads). Sessions of the skill and agent arms
go to <protocol-session>_<arm>, e.g. single_s1_skill; the none arm keeps the original names.

Every session works in agentic_works/<agent>/ in this directory, <agent> being the model name
without "claude-", and keeps all its files there: code, data, outputs, transcript and metadata.
The default protocol copies workspace/ to agentic_works/<agent>/single_s<seed>/ and has a 45 minute
limit. The explore protocol copies explore/workspace/ to agentic_works/<agent>/explore/
(explore_s<seed> for seeds other than 1), writes START_TIME and stops the agent after 15 minutes. It
asks for as many different approaches as possible, each kept in approaches/NN_name/. Under
~/Research the sandbox lets the agent read only its own session directory.

The macOS sandbox denies reads of ~/Research, the conda environments, earlier demo runs, other
KickBench sessions and other Claude projects, so the hidden test set, gwModels and surfinBH cannot be opened. Python comes from
~/kickbench_runs/.venv, which holds only numpy, scipy, scikit-learn and matplotlib.

Every model gets the same prompt, tools, wall clock limit and spending limit.
"""

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOME = Path.home()
RUNS = HOME / "kickbench_runs"
VENV_BIN = RUNS / ".venv" / "bin"
WORKS = HERE / "agentic_works"
PROMPT = "Read TASK.md and complete the task."
BUDGET_USD = "5"
PROTOCOLS = {
    "single": {"workspace": HERE / "workspace", "wall_s": 45 * 60, "budget": BUDGET_USD},
    "explore": {"workspace": HERE / "explore" / "workspace", "wall_s": 15 * 60, "budget": "10"},
}
DENIED = [
    HOME / "Research",
    HOME / "kick_runs",
    HOME / "ringdown_runs",
    HOME / ".claude" / "projects",
    HOME / "miniforge3" / "envs",
    HOME / "miniforge3" / "lib" / "python3.12" / "site-packages",
]
ALLOWED_TOOLS = ["Read", "Write", "Edit", "Bash(python *)", "Bash(python3 *)", "Bash(ls *)"]
DISALLOWED_TOOLS = ["Bash(python -m pip *)", "Bash(python3 -m pip *)", "WebFetch", "WebSearch", "Agent"]
ARMS = ["none", "skill", "agent"]
SKILLS = HERE.parent / "kickskills"
AGENT = HERE.parent / "kickagent"


def sandbox_profile(run_dir):
    """Return the sandbox-exec profile for the agent process. Later rules take precedence."""
    rules = "".join(f'(deny file-read* (subpath "{path}"))' for path in DENIED)
    rules += f'(deny file-read* (subpath "{RUNS}"))'
    rules += f'(allow file-read* (subpath "{run_dir}") (subpath "{RUNS / ".venv"}"))'
    # Claude Code inspects every parent of its working directory before it allows a write. Without
    # this rule it refuses all Write and Edit calls under ~/Research. The parents themselves become
    # readable, so their names can be listed, but no file inside them.
    rules += "".join(f'(allow file-read* (literal "{parent}"))' for parent in Path(run_dir).parents)
    return f"(version 1)(allow default){rules}"


def session_dir(model, seed, protocol, arm="none"):
    """Return agentic_works/<agent>/<session> for one model, seed, protocol and arm."""
    agent = WORKS / model.replace("claude-", "")
    if protocol == "explore":
        name = "explore" if seed == "1" else f"explore_s{seed}"
    else:
        name = f"single_s{seed}"
    return agent / (name if arm == "none" else f"{name}_{arm}")


def install_arm(run_dir, arm):
    """Add KickSkills, and for the agent arm the KickAgent workflow, to a fresh session."""
    if arm == "none":
        return
    skills = run_dir / ".claude" / "skills"
    skills.mkdir(parents=True)
    for skill in ["kick-physics", "kick-validation"]:
        shutil.copytree(SKILLS / skill, skills / skill)
    if arm == "agent":
        shutil.copytree(AGENT / "tools", run_dir / "tools")
        shutil.copytree(AGENT / "templates", run_dir / "templates")
        (run_dir / "candidates").mkdir()
        rules = (run_dir / "AGENTS.md").read_text()
        (run_dir / "AGENTS.md").write_text(rules + (AGENT / "CLAUDE_workflow.md").read_text())


def main():
    """Create the run directory, launch the agent and save its transcript and metadata."""
    model = sys.argv[1]
    seed = sys.argv[2]
    protocol = sys.argv[3] if len(sys.argv) > 3 else "single"
    arm = sys.argv[4] if len(sys.argv) > 4 else "none"
    if arm not in ARMS:
        raise SystemExit(f"arm must be one of {ARMS}")
    setup = PROTOCOLS[protocol]
    run_dir = session_dir(model, seed, protocol, arm)
    if run_dir.exists():
        raise SystemExit(f"{run_dir} exists, remove it or use another seed")
    run_dir.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(setup["workspace"], run_dir)
    install_arm(run_dir, arm)
    shutil.copy(run_dir / "AGENTS.md", run_dir / "CLAUDE.md")
    allowed = ALLOWED_TOOLS + (["Skill"] if arm != "none" else [])
    if protocol == "explore":
        (run_dir / "START_TIME").write_text(f"{time.time():.0f}\n")
    environment = dict(os.environ)
    environment["PATH"] = f"{VENV_BIN}:/usr/bin:/bin"
    environment["VIRTUAL_ENV"] = str(RUNS / ".venv")
    environment["CLAUDE_CODE_DISABLE_AUTO_MEMORY"] = "1"
    environment.pop("PYTHONPATH", None)
    claude = shutil.which("claude")
    command = [
        "sandbox-exec", "-p", sandbox_profile(run_dir), claude, "-p", PROMPT,
        "--model", model,
        "--setting-sources", "project",
        "--strict-mcp-config",
        "--permission-mode", "acceptEdits",
        "--allowedTools", *allowed,
        "--disallowedTools", *DISALLOWED_TOOLS,
        "--max-budget-usd", setup["budget"],
        "--output-format", "stream-json",
        "--verbose",
    ]
    started = time.time()
    timed_out = False
    with open(run_dir / "transcript.jsonl", "w") as transcript:
        try:
            done = subprocess.run(
                command, cwd=run_dir, env=environment, stdout=transcript,
                stderr=subprocess.PIPE, text=True, timeout=setup["wall_s"],
            )
            return_code = done.returncode
            stderr = done.stderr[-2000:]
        except subprocess.TimeoutExpired:
            timed_out = True
            return_code = None
            stderr = ""
    meta = {
        "model": model,
        "seed": seed,
        "protocol": protocol,
        "arm": arm,
        "wall_s": time.time() - started,
        "timed_out": timed_out,
        "return_code": return_code,
        "stderr": stderr,
    }
    (run_dir / "run_meta.json").write_text(json.dumps(meta, indent=1))
    print(json.dumps(meta))


if __name__ == "__main__":
    main()
