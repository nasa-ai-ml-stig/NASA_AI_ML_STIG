"""Assemble the public KickBench release in kickbench_public/. Nothing is uploaded.

Contents: curated train and test data with a data card, the prompts exactly as sent, the scorer,
the baselines, every session's submission and transcript, and the tables and figures. Local paths
and the user name are removed from all text files. A forbidden-string scan runs at the end.
v2 gwModelRemS predictions and scores are left out until that paper version is public.

Env: base.
"""

import csv
import json
import re
import shutil
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
WORKS = HERE / "agentic_works"
OUT = HERE / "kickbench_public"
MODELS = ["claude-haiku-4-5", "claude-sonnet-4-5", "claude-opus-4-5"]
SUBMISSION_SKIP = {"__pycache__", "data", "TASK.md", "AGENTS.md", "hidden_predictions.npy"}
PICKLE_SUFFIXES = {".pkl", ".pickle", ".joblib"}
TEXT_SUFFIXES = {".py", ".md", ".txt", ".json", ".jsonl", ".csv", ".sh"}
HOME = str(Path.home())
SCRUB = [(HOME, "/home/user"), ("tousifislam24@gmail.com", "user@example.com")]
EXCLUDED_REFERENCE = "v2 gwModelRemS"
EXCLUDED_LABELS = [EXCLUDED_REFERENCE, "gwModelRemS (literature best"]
FORBIDDEN = ["/Users/", "tousifislam24", "gmail.com"]


def scrub_text(text):
    """Remove local paths and addresses from text."""
    for old, new in SCRUB:
        text = text.replace(old, new)
    return text


def copy_clean(source, target):
    """Copy one file, scrubbing it if it is text."""
    target.parent.mkdir(parents=True, exist_ok=True)
    if source.suffix in TEXT_SUFFIXES:
        target.write_text(scrub_text(source.read_text(errors="replace")))
    else:
        shutil.copy2(source, target)


def write_test_csv():
    """Write the now public test set as a CSV."""
    with np.load(HERE / "private" / "hidden_test.npz") as test:
        rows = zip(test["sim_id"], test["catalog"], test["q"], test["chi1z"], test["chi2z"], test["vkick_kms"])
        target = OUT / "data" / "test.csv"
        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "w", newline="") as handle:
            writer = csv.writer(handle)
            writer.writerow(["sim_id", "catalog", "q", "chi1z", "chi2z", "vkick_kms"])
            writer.writerows(rows)


def copy_submissions():
    """Copy every session's files, without the data and hidden predictions."""
    for model in MODELS:
        for run_dir in sorted((WORKS / model.replace("claude-", "")).glob("single_s*")):
            target = OUT / "submissions" / f"{model}_s{run_dir.name.rsplit('_s', 1)[1]}"
            for path in sorted(run_dir.rglob("*")):
                relative = path.relative_to(run_dir)
                if path.is_dir() or relative.parts[0] in SUBMISSION_SKIP or relative.name.startswith(".score_"):
                    continue
                copy_clean(path, target / relative)
            predictions = run_dir / "hidden_predictions.npy"
            if predictions.exists():
                copy_clean(predictions, target / "hidden_predictions.npy")


def copy_tables():
    """Copy results and figures, dropping the unreleased v2 reference from the tables."""
    source = HERE / "analysis" / "results"
    target = OUT / "results"
    target.mkdir(parents=True, exist_ok=True)
    for path in sorted(source.glob("*")):
        lines = path.read_text().splitlines()
        kept = [line for line in lines if not any(label in line for label in EXCLUDED_LABELS)]
        (target / path.name).write_text(scrub_text("\n".join(kept)) + "\n")
    with np.load(HERE / "private" / "reference_predictions.npz") as saved:
        public = {name: saved[name] for name in saved.files if name != EXCLUDED_REFERENCE}
    np.savez(OUT / "data" / "reference_predictions.npz", **public)


def scan():
    """Fail if a forbidden string survives in any text file."""
    problems = []
    for path in OUT.rglob("*"):
        if path.is_file() and path.suffix in TEXT_SUFFIXES:
            text = path.read_text(errors="replace")
            problems.extend(f"{path}: {word}" for word in FORBIDDEN if word in text)
    if problems:
        raise SystemExit("\n".join(problems[:20]))


def main():
    """Build the release folder."""
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    write_test_csv()
    copy_clean(HERE / "workspace" / "data" / "train.csv", OUT / "data" / "train.csv")
    for name in ["TASK.md", "AGENTS.md"]:
        copy_clean(HERE / "workspace" / name, OUT / "prompts" / name)
    (OUT / "prompts" / "PROMPT.txt").write_text("Read TASK.md and complete the task.\n")
    for name in ["README.md", "DATA_CARD.md"]:
        copy_clean(HERE / "release_docs" / name, OUT / ("data/DATA_CARD.md" if name == "DATA_CARD.md" else name))
    copy_clean(HERE / "private" / "score.py", OUT / "scoring" / "score.py")
    copy_clean(HERE / "run_model.py", OUT / "scoring" / "run_model.py")
    copy_clean(HERE / "analysis" / "Islam2026_kickbench_analysis.py", OUT / "scoring" / "analysis.py")
    for path in sorted((HERE / "baselines").rglob("solve.py")):
        copy_clean(path, OUT / "baselines" / path.relative_to(HERE / "baselines"))
    copy_submissions()
    copy_tables()
    for path in sorted((HERE / "analysis" / "figures").glob("*.png")):
        copy_clean(path, OUT / "results" / "figures" / path.name)
    scan()
    size = sum(path.stat().st_size for path in OUT.rglob("*") if path.is_file())
    print("release ready", OUT, round(size / 1.0e6, 1), "MB")


if __name__ == "__main__":
    main()
