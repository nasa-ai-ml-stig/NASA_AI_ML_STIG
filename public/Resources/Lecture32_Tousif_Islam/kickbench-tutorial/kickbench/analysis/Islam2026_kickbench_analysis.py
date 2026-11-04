"""Score every KickBench session, audit its transcript, and make the tables and figures.

Reference lines are published kick models on the same test rows: v2 and v1 gwModelRemS (Islam,
Wadekar & Khanna, arXiv:2608.00934), HLZ2014 (arXiv:1406.7295), HL2018 (arXiv:1801.08162), IW2025
(arXiv:2511.11536) and NRSur3dq8Remnant. The ranking is the mean of the median rank and the p90
rank on numerical relativity, as in Sec. 7 of the v2 FITTING_PROTOCOL.md.

Outputs in analysis/results and analysis/figures. One panel per figure:
    hist_nr.png, hist_bhpt.png   errors of the three models, all sessions pooled
    hist_<model>.png             errors of one model, one curve per session
    median_p90.png               every session and reference on median against p90
    estimate.png                 each session's stated NR median against the measured one

Env: base.
"""

import csv
import importlib.util
import json
import re
from pathlib import Path

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

matplotlib.rcParams["text.usetex"] = True
matplotlib.rcParams["font.family"] = "STIXGeneral"
matplotlib.rcParams["mathtext.fontset"] = "stix"
matplotlib.rcParams["font.size"] = 16

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
WORKS = ROOT / "agentic_works"
REF_KEY = "v2 gwModelRemS"
REF_LABEL = "gwModelRemS (literature best, Islam+)"
MODELS = ["claude-haiku-4-5", "claude-sonnet-4-5", "claude-opus-4-5"]
NAMES = {
    "claude-haiku-4-5": "Haiku 4.5",
    "claude-sonnet-4-5": "Sonnet 4.5",
    "claude-opus-4-5": "Opus 4.5",
}
COLORS = {
    "claude-haiku-4-5": "#2f9e73",
    "claude-sonnet-4-5": "#2a78b5",
    "claude-opus-4-5": "#d9622b",
}
LINESTYLES = {"claude-haiku-4-5": "-", "claude-sonnet-4-5": "--", "claude-opus-4-5": "-."}
MARKERS = {"claude-haiku-4-5": "o", "claude-sonnet-4-5": "s", "claude-opus-4-5": "D"}
GREY = "#555555"
SIZE = (6.6, 4.86)
DPI = 200
BINS_NR = np.geomspace(1.0e-2, 1.0e3, 31)
BINS_BHPT = np.geomspace(1.0e-5, 1.0e2, 36)
AUDIT_TERMS = [
    "gwModels", "surfinBH", "hidden_test", "reference_predictions", "aligned_spin_circular",
    "pip install", "kickbench/private", "../private", "kick_runs", "miniforge3", "sxs.load", "arxiv.org", "curl ", "wget ",
]


def display(name):
    """Return the name shown in tables and figures for a model or reference."""
    return REF_LABEL if name == REF_KEY else name


def load_scorer():
    """Import private/score.py."""
    spec = importlib.util.spec_from_file_location("score", ROOT / "private" / "score.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_transcript(run_dir):
    """Return final result fields, tool command text and denied permission count."""
    result = {}
    tool_text = []
    tool_calls = 0
    path = run_dir / "transcript.jsonl"
    if not path.exists():
        return result, "", 0
    for line in path.read_text().splitlines():
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        if event.get("type") == "result":
            result = event
        if event.get("type") == "assistant":
            for block in event.get("message", {}).get("content", []):
                if isinstance(block, dict) and block.get("type") == "tool_use":
                    tool_calls += 1
                    tool_text.append(json.dumps(block.get("input", {})))
    return result, "\n".join(tool_text), tool_calls


def session_row(scorer, run_dir, model, seed):
    """Score one session and return a flat record with its predictions."""
    record, prediction = scorer.score(run_dir)
    (run_dir / "score.json").write_text(json.dumps(record, indent=1))
    result, tool_text, tool_calls = read_transcript(run_dir)
    meta_path = run_dir / "run_meta.json"
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    hits = sorted(term for term in AUDIT_TERMS if term in tool_text)
    row = {
        "model": model,
        "session": seed,
        "valid": record["valid"],
        "error": record.get("error", ""),
        "cost_usd": result.get("total_cost_usd", float("nan")),
        "turns": result.get("num_turns", 0),
        "tool_calls": tool_calls,
        "wall_min": meta.get("wall_s", float("nan")) / 60.0,
        "stop": result.get("subtype", "none"),
        "audit_hits": ";".join(hits),
    }
    if record["valid"]:
        accuracy = record["accuracy"]
        row.update(
            nr_median=accuracy["NR"]["median"],
            nr_p90=accuracy["NR"]["p90"],
            nr_p99=accuracy["NR"]["p99"],
            bhpt_median=accuracy["BHPT"]["median"],
            bhpt_p90=accuracy["BHPT"]["p90"],
            physics_passed=record["physics_passed"],
            physics_failed=";".join(k for k, v in record["physics"].items() if not v["pass"]),
            estimate_median=record["estimates"].get("ESTIMATE_NR_MEDIAN_KMS", float("nan")),
            estimate_p90=record["estimates"].get("ESTIMATE_NR_P90_KMS", float("nan")),
        )
    return row, record, prediction


def markdown_table(header, rows):
    """Return a Markdown table as a string."""
    lines = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    lines.extend("| " + " | ".join(str(cell) for cell in row) + " |" for row in rows)
    return "\n".join(lines) + "\n"


def rank_scores(entries):
    """Return the rank of each entry by the mean of its median and p90 ranks."""
    medians = np.array([entry["nr_median"] for entry in entries])
    p90s = np.array([entry["nr_p90"] for entry in entries])
    combined = (medians.argsort().argsort() + p90s.argsort().argsort()) / 2.0
    combined = combined + 1.0e-3 * medians.argsort().argsort()
    return combined.argsort().argsort() + 1


def write_tables(rows, records, test, references):
    """Write the per-session, leaderboard and per-subset tables."""
    out = HERE / "results"
    out.mkdir(exist_ok=True)
    keys = sorted({key for row in rows for key in row})
    with open(out / "sessions.csv", "w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)
    (out / "records.json").write_text(json.dumps(records, indent=1))
    scorer = load_scorer()
    entries = []
    for model in MODELS:
        valid = [row for row in rows if row["model"] == model and row["valid"]]
        if not valid:
            continue
        entries.append(
            {
                "name": NAMES[model],
                "kind": "agent",
                "sessions": len([row for row in rows if row["model"] == model]),
                "valid": len(valid),
                "nr_median": float(np.median([row["nr_median"] for row in valid])),
                "nr_p90": float(np.median([row["nr_p90"] for row in valid])),
                "bhpt_median": float(np.median([row["bhpt_median"] for row in valid])),
                "bhpt_p90": float(np.median([row["bhpt_p90"] for row in valid])),
                "physics": f"{min(row['physics_passed'] for row in valid)} to {max(row['physics_passed'] for row in valid)} of 6",
                "cost": sum(row["cost_usd"] for row in rows if row["model"] == model),
                "range": (min(row["nr_median"] for row in valid), max(row["nr_median"] for row in valid)),
            }
        )
    for name, prediction in references.items():
        summary, _ = scorer.accuracy(prediction, test)
        entries.append(
            {
                "name": display(name),
                "kind": "published",
                "sessions": "",
                "valid": "",
                "nr_median": summary["NR"]["median"],
                "nr_p90": summary["NR"]["p90"],
                "bhpt_median": summary["BHPT"]["median"],
                "bhpt_p90": summary["BHPT"]["p90"],
                "physics": "",
                "cost": float("nan"),
                "range": None,
            }
        )
    ranks = rank_scores(entries)
    order = np.argsort(ranks)
    table = []
    for index in order:
        entry = entries[index]
        spread = "" if entry["range"] is None else f"{entry['range'][0]:.2f} to {entry['range'][1]:.2f}"
        cost = "" if np.isnan(entry["cost"]) else f"{entry['cost']:.2f}"
        table.append(
            [
                ranks[index], entry["name"], entry["kind"], entry["valid"],
                f"{entry['nr_median']:.2f}", f"{entry['nr_p90']:.2f}", spread,
                f"{entry['bhpt_median']:.3f}", f"{entry['bhpt_p90']:.2f}", entry["physics"], cost,
            ]
        )
    header = [
        "Rank", "Model", "Kind", "Valid sessions", "NR median", "NR p90", "NR median range",
        "BHPT median", "BHPT p90", "Physics", "Cost USD",
    ]
    (out / "leaderboard.md").write_text(markdown_table(header, table))
    session_table = []
    for row in rows:
        if row["valid"]:
            session_table.append(
                [
                    NAMES[row["model"]], row["session"], f"{row['nr_median']:.2f}", f"{row['nr_p90']:.2f}",
                    f"{row['estimate_median']:.2f}", f"{row['estimate_p90']:.2f}", f"{row['bhpt_median']:.3f}",
                    f"{row['bhpt_p90']:.2f}", row["physics_passed"], row["physics_failed"],
                    f"{row['wall_min']:.1f}", f"{row['cost_usd']:.2f}", row["audit_hits"],
                ]
            )
        else:
            session_table.append(
                [NAMES[row["model"]], row["session"], "invalid", row["error"][:60], "", "", "", "", "", "",
                 f"{row['wall_min']:.1f}", f"{row['cost_usd']:.2f}", row["audit_hits"]]
            )
    session_header = [
        "Model", "Session", "NR median", "NR p90", "Stated median", "Stated p90", "BHPT median", "BHPT p90",
        "Physics of 6", "Failed checks", "Minutes", "Cost USD", "Audit hits",
    ]
    (out / "sessions.md").write_text(markdown_table(session_header, session_table))
    names = ["NR", "SXS", "RIT", "MAYA", "BHPT", "NR q<=4", "NR 4<q<=10", "NR q>10"]
    subset_rows = []
    for record in records:
        if record["valid"]:
            cells = [record["run"]]
            cells.extend(
                f"{record['accuracy'][name]['median']:.2f} / {record['accuracy'][name]['p90']:.2f}"
                for name in names
            )
            subset_rows.append(cells)
    for name, prediction in references.items():
        summary, _ = scorer.accuracy(prediction, test)
        cells = [display(name)]
        cells.extend(f"{summary[key]['median']:.2f} / {summary[key]['p90']:.2f}" for key in names)
        subset_rows.append(cells)
    (out / "subsets.md").write_text(markdown_table(["Model"] + names, subset_rows))
    print((out / "leaderboard.md").read_text())
    print((out / "sessions.md").read_text())


def finish(name):
    """Apply the shared figure style and save the current figure."""
    plt.grid(True, alpha=0.3)
    plt.legend(frameon=False, fontsize=13)
    plt.tight_layout()
    target = HERE / "figures"
    target.mkdir(exist_ok=True)
    plt.savefig(target / name, dpi=DPI)
    plt.close()


def histogram(values, bins, label, color, linestyle, linewidth=2.2):
    """Draw a step histogram as a fraction of its own rows."""
    weights = np.full(values.size, 100.0 / values.size)
    plt.hist(values, bins=bins, weights=weights, histtype="step", label=label,
             color=color, linestyle=linestyle, linewidth=linewidth)


def clip_low(values, bins):
    """Move errors below the first bin into it, so no row is lost from the plot."""
    return np.clip(values, bins[0] * 1.001, bins[-1] * 0.999)


def plot_pooled(predictions, truth, mask, references, bins, name, xlabel):
    """Plot pooled error histograms of the three models with the v2 reference."""
    plt.figure(figsize=SIZE)
    for model in MODELS:
        pooled = [np.abs(p - truth)[mask] for p in predictions.get(model, [])]
        if pooled:
            histogram(clip_low(np.concatenate(pooled), bins), bins, NAMES[model], COLORS[model], LINESTYLES[model])
    reference = np.abs(references[REF_KEY] - truth)[mask]
    histogram(clip_low(reference, bins), bins, REF_LABEL, GREY, ":", 2.6)
    plt.xscale("log")
    plt.xlabel(xlabel)
    plt.ylabel(r"share of test simulations (\%)")
    finish(name)


def plot_one_model(model, predictions, truth, mask, references):
    """Plot NR error histograms for one model, one curve per session."""
    plt.figure(figsize=SIZE)
    styles = ["-", "--", "-."]
    for index, prediction in enumerate(predictions.get(model, [])):
        values = clip_low(np.abs(prediction - truth)[mask], BINS_NR)
        histogram(values, BINS_NR, f"session {index + 1}", COLORS[model], styles[index % 3])
    reference = clip_low(np.abs(references[REF_KEY] - truth)[mask], BINS_NR)
    histogram(reference, BINS_NR, REF_LABEL, GREY, ":", 2.6)
    plt.xscale("log")
    plt.xlabel(r"$|\Delta v|$ on numerical relativity [km/s]")
    plt.ylabel(r"share of test simulations (\%)")
    plt.title(NAMES[model])
    finish("hist_" + model.replace("claude-", "").replace("-", "_") + ".png")


def plot_median_p90(rows, references, test):
    """Plot every session and published model on NR median against NR p90."""
    scorer = load_scorer()
    plt.figure(figsize=SIZE)
    for model in MODELS:
        valid = [row for row in rows if row["model"] == model and row["valid"]]
        if valid:
            plt.scatter([row["nr_median"] for row in valid], [row["nr_p90"] for row in valid],
                        s=90, marker=MARKERS[model], color=COLORS[model], label=NAMES[model], zorder=3)
    for name, prediction in references.items():
        summary, _ = scorer.accuracy(prediction, test)
        x_value = summary["NR"]["median"]
        y_value = summary["NR"]["p90"]
        plt.scatter(x_value, y_value, s=50, marker="x", color=GREY, zorder=2)
        plt.annotate(display(name), (x_value, y_value), textcoords="offset points", xytext=(7, 5), fontsize=11, color=GREY)
    plt.xscale("log")
    plt.yscale("log")
    plt.xlabel(r"median $|\Delta v|$, numerical relativity [km/s]")
    plt.ylabel(r"p90 $|\Delta v|$, numerical relativity [km/s]")
    finish("median_p90.png")


def plot_estimates(rows):
    """Plot each session's stated NR median against the measured value."""
    plt.figure(figsize=SIZE)
    bound = []
    for model in MODELS:
        valid = [row for row in rows if row["model"] == model and row["valid"] and np.isfinite(row["estimate_median"])]
        if valid:
            x_values = [row["estimate_median"] for row in valid]
            y_values = [row["nr_median"] for row in valid]
            bound.extend(x_values + y_values)
            plt.scatter(x_values, y_values, s=90, marker=MARKERS[model], color=COLORS[model], label=NAMES[model], zorder=3)
    if bound:
        low = min(bound) * 0.7
        high = max(bound) * 1.4
        plt.plot([low, high], [low, high], color=GREY, linestyle=":", label=r"stated = measured")
        plt.xlim(low, high)
        plt.ylim(low, high)
    plt.xscale("log")
    plt.yscale("log")
    plt.xlabel(r"median error the agent stated [km/s]")
    plt.ylabel(r"median error on hidden test [km/s]")
    finish("estimate.png")


def main():
    """Score all sessions and write every table and figure."""
    scorer = load_scorer()
    with np.load(ROOT / "private" / "hidden_test.npz") as saved:
        test = {name: saved[name] for name in saved.files}
    with np.load(ROOT / "private" / "reference_predictions.npz") as saved:
        references = {name: saved[name] for name in saved.files}
    rows = []
    records = []
    predictions = {}
    pattern = re.compile(r"_s(\d+)$")
    for model in MODELS:
        for run_dir in sorted((WORKS / model.replace("claude-", "")).glob("single_s*")):
            found = pattern.search(run_dir.name)
            if found is None:
                continue
            seed = found.group(1)
            row, record, prediction = session_row(scorer, run_dir, model, seed)
            rows.append(row)
            records.append(record)
            if prediction is not None:
                predictions.setdefault(model, []).append(prediction)
                np.save(run_dir / "hidden_predictions.npy", prediction)
    write_tables(rows, records, test, references)
    truth = test["vkick_kms"]
    nr = test["catalog"] != "BHPT"
    plot_pooled(predictions, truth, nr, references, BINS_NR, "hist_nr.png",
                r"$|\Delta v|$ on numerical relativity [km/s]")
    plot_pooled(predictions, truth, ~nr, references, BINS_BHPT, "hist_bhpt.png",
                r"$|\Delta v|$ on perturbation theory [km/s]")
    for model in MODELS:
        plot_one_model(model, predictions, truth, nr, references)
    plot_median_p90(rows, references, test)
    plot_estimates(rows)


if __name__ == "__main__":
    main()
