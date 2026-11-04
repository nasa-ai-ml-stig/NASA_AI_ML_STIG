"""No agent, no subscription: ask any chat model once for solve.py.

    export LLM_API_KEY=...                       # e.g. a free Gemini key from aistudio.google.com
    python ask_llm.py runs/skill_s1

    python ask_llm.py runs/none_s1 --base-url http://localhost:11434/v1 --model qwen2.5-coder
                                                 # a local model through Ollama, no key at all

Sends AGENTS.md, TASK.md, the head of train.csv and, in a skill run, the SKILL.md files, to any
OpenAI-compatible chat endpoint. Saves the reply to reply.md and its Python block to solve.py.
The model cannot run code here, so solve.py must fit itself to data/train.csv when imported.
A single call is weaker than an agent that can test its own code: compare arms with the same
route, never across routes.

Env: any Python 3, standard library only.
"""

import argparse
import json
import os
import re
import urllib.request
from pathlib import Path

GEMINI_OPENAI_URL = "https://generativelanguage.googleapis.com/v1beta/openai"
HEAD_ROWS = 8


def build_prompt(run_dir):
    """Return the single user message for this run folder."""
    parts = [(run_dir / "AGENTS.md").read_text(), (run_dir / "TASK.md").read_text()]
    for skill in sorted((run_dir / ".agents" / "skills").glob("*/SKILL.md")):
        parts.append(f"Skill available to you ({skill.parent.name}):\n\n{skill.read_text()}")
    lines = (run_dir / "data" / "train.csv").read_text().splitlines()
    parts.append(f"data/train.csv has {len(lines) - 1} rows. The first rows:\n\n" + "\n".join(lines[:HEAD_ROWS]))
    parts.append(
        "You cannot run code. Reply with the complete solve.py in one ```python block. "
        "It must read data/train.csv and fit its parameters when imported."
    )
    return "\n\n---\n\n".join(parts)


def ask(base_url, model, key, prompt):
    """POST one chat request and return the reply text."""
    body = json.dumps({"model": model, "messages": [{"role": "user", "content": prompt}]}).encode()
    request = urllib.request.Request(
        base_url.rstrip("/") + "/chat/completions", data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(request, timeout=600) as response:
        return json.loads(response.read())["choices"][0]["message"]["content"]


def main():
    """Ask the model and write reply.md and solve.py into the run folder."""
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("run_dir", type=Path)
    parser.add_argument("--base-url", default=GEMINI_OPENAI_URL)
    parser.add_argument("--model", default="gemini-3.5-flash")
    args = parser.parse_args()
    key = os.environ.get("LLM_API_KEY", os.environ.get("GEMINI_API_KEY", "none"))
    reply = ask(args.base_url, args.model, key, build_prompt(args.run_dir))
    (args.run_dir / "reply.md").write_text(reply)
    blocks = re.findall(r"```python\n(.*?)```", reply, flags=re.S)
    if not blocks:
        raise SystemExit("no ```python block in the reply; see reply.md")
    (args.run_dir / "solve.py").write_text(blocks[0])
    print(f"wrote {args.run_dir / 'solve.py'}; now: python grader/score.py {args.run_dir}")


if __name__ == "__main__":
    main()
