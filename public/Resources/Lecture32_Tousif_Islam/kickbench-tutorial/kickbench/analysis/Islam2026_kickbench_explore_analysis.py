"""Score every approach saved in the KickBench exploration round and make its tables and figures.

In this round each agent had 15 minutes to try as many different approaches as it could, each saved
in agentic_works/<agent>/explore/approaches/NN_name/ (see explore/workspace/TASK.md). Every approach is scored by
private/score.py on the full hidden test set, unchanged from the single-answer round.

Outputs:
    results/explore_approaches.md, .csv   one row per approach
    results/explore_summary.md            one row per agent, published models for context
    figures/explore_hist_<model>_nr.png   NR error histogram, best three approaches in colour, rest grey
    figures/explore_hist_<model>_bhpt.png the same on perturbation theory
    figures/explore_hist_<model>_all.png  the same on all 380 test simulations, NR and BHPT together
    figures/explore_hist_best_all.png     best approach of each agent and the reference, all 380

Env: base.
"""

import csv
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

import Islam2026_kickbench_analysis as base

WORKS = base.WORKS
OUT = base.HERE / "results"
REFERENCE = base.REF_KEY
BINS_ALL = np.geomspace(1.0e-5, 1.0e3, 41)
SIZE_EXPLORE = (7.4, 5.0)
SIZE_BEST = (5.8, 5.0)
BEST_COLORS = ["#C8352B", "#2A78B5", "#2F9E73"]
TEX_SPECIAL = {"_": r"\_", "%": r"\%", "&": r"\&", "#": r"\#", "$": r"\$"}


def tex(text):
    """Escape characters that LaTeX treats as special."""
    return "".join(TEX_SPECIAL.get(character, character) for character in text)


def start_time(run_dir):
    """Return the session start in Unix seconds, or NaN."""
    path = run_dir / "START_TIME"
    return float(path.read_text().strip()) if path.exists() else float("nan")


def score_session(scorer, run_dir, model, seed):
    """Score every approach of one session. Return rows, predictions and a session row."""
    result, tool_text, tool_calls = base.read_transcript(run_dir)
    meta_path = run_dir / "run_meta.json"
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    started = start_time(run_dir)
    rows = []
    predictions = {}
    approach_dirs = sorted(path for path in (run_dir / "approaches").glob("*") if path.is_dir())
    for approach in approach_dirs:
        record, prediction = scorer.score(approach)
        (approach / "score.json").write_text(json.dumps(record, indent=1))
        solve_path = approach / "solve.py"
        minute = (solve_path.stat().st_mtime - started) / 60.0 if solve_path.exists() else float("nan")
        row = {
            "model": model,
            "session": seed,
            "approach": approach.name,
            "saved_min": minute,
            "valid": record["valid"],
            "error": record.get("error", ""),
        }
        if record["valid"]:
            accuracy = record["accuracy"]
            row.update(
                nr_median=accuracy["NR"]["median"],
                nr_p90=accuracy["NR"]["p90"],
                bhpt_median=accuracy["BHPT"]["median"],
                bhpt_p90=accuracy["BHPT"]["p90"],
                physics_passed=record["physics_passed"],
                physics_failed=";".join(k for k, v in record["physics"].items() if not v["pass"]),
                estimate_median=record["estimates"].get("ESTIMATE_NR_MEDIAN_KMS", float("nan")),
                estimate_p90=record["estimates"].get("ESTIMATE_NR_P90_KMS", float("nan")),
            )
            predictions[approach.name] = prediction
            np.save(approach / "hidden_predictions.npy", prediction)
        rows.append(row)
    hits = sorted(term for term in base.AUDIT_TERMS if term in tool_text)
    session = {
        "model": model,
        "session": seed,
        "approaches": len(approach_dirs),
        "valid": sum(row["valid"] for row in rows),
        "cost_usd": result.get("total_cost_usd", float("nan")),
        "wall_min": meta.get("wall_s", float("nan")) / 60.0,
        "stopped_at_limit": meta.get("timed_out", False),
        "tool_calls": tool_calls,
        "audit_hits": ";".join(hits),
    }
    return rows, predictions, session


def number(value, digits=2):
    """Format a float, blank for NaN."""
    return "" if value is None or not np.isfinite(value) else f"{value:.{digits}f}"


def write_tables(rows, sessions, references, test, scorer):
    """Write the per-approach and per-agent tables."""
    OUT.mkdir(exist_ok=True)
    keys = sorted({key for row in rows for key in row})
    with open(OUT / "explore_approaches.csv", "w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=keys)
        writer.writeheader()
        writer.writerows(rows)
    table = []
    for row in rows:
        name = base.NAMES[row["model"]]
        if row["valid"]:
            table.append(
                [
                    name, row["session"], row["approach"], number(row["saved_min"], 1),
                    number(row["nr_median"]), number(row["nr_p90"]),
                    number(row["estimate_median"]), number(row["estimate_p90"]),
                    number(row["bhpt_median"], 3), number(row["bhpt_p90"]),
                    row["physics_passed"], row["physics_failed"],
                ]
            )
        else:
            table.append([name, row["session"], row["approach"], number(row["saved_min"], 1),
                          "invalid", row["error"][:60].replace("\n", " "), "", "", "", "", "", ""])
    header = [
        "Agent", "Session", "Approach", "Saved at min", "NR median", "NR p90", "Stated median",
        "Stated p90", "BHPT median", "BHPT p90", "Physics of 6", "Failed checks",
    ]
    (OUT / "explore_approaches.md").write_text(base.markdown_table(header, table))
    summary = []
    for session in sessions:
        valid = [row for row in rows if row["model"] == session["model"]
                 and row["session"] == session["session"] and row["valid"]]
        if valid:
            best = min(valid, key=lambda row: row["nr_median"])
            medians = [row["nr_median"] for row in valid]
            cells = [
                f"{best['approach']}", number(best["nr_median"]), number(best["nr_p90"]),
                f"{min(medians):.2f} to {max(medians):.2f}",
                f"{max(row['physics_passed'] for row in valid)} of 6",
            ]
        else:
            cells = ["", "", "", "", ""]
        summary.append(
            [base.NAMES[session["model"]], session["session"], session["approaches"], session["valid"]]
            + cells
            + [number(session["wall_min"], 1), number(session["cost_usd"]), session["audit_hits"]]
        )
    for name, prediction in references.items():
        result, _ = scorer.accuracy(prediction, test)
        summary.append([base.display(name), "published", "", "", "", number(result["NR"]["median"]),
                        number(result["NR"]["p90"]), "", "", "", "", ""])
    summary_header = [
        "Agent", "Session", "Approaches", "Valid", "Best approach", "Best NR median", "Best NR p90",
        "NR median range", "Most physics passed", "Minutes", "Cost USD", "Audit hits",
    ]
    (OUT / "explore_summary.md").write_text(base.markdown_table(summary_header, summary))
    print((OUT / "explore_summary.md").read_text())
    print((OUT / "explore_approaches.md").read_text())


def plot_agent(model, predictions, truth, mask, references, bins, suffix, xlabel):
    """Plot one agent's error histograms: its three best approaches in colour, the rest in grey."""
    names = sorted(predictions)
    if not names:
        return
    medians = {name: np.median(np.abs(predictions[name] - truth)[mask]) for name in names}
    ranked = sorted(names, key=lambda name: medians[name])
    best = ranked[:3]
    plt.figure(figsize=SIZE_EXPLORE)
    for index, name in enumerate(ranked[3:]):
        values = base.clip_low(np.abs(predictions[name] - truth)[mask], bins)
        label = rf"other {len(ranked) - 3} approaches" if index == 0 else None
        base.histogram(values, bins, label, "#B8B8B8", "-", 0.9)
    for name, color, style in zip(best, BEST_COLORS, ["-", "--", "-."]):
        values = base.clip_low(np.abs(predictions[name] - truth)[mask], bins)
        label = tex(name.split(" ", 1)[1]) + rf" ({medians[name]:.1f})"
        base.histogram(values, bins, label, color, style, 2.4)
    reference = base.clip_low(np.abs(references[REFERENCE] - truth)[mask], bins)
    label = base.REF_LABEL + rf" ({np.median(np.abs(references[REFERENCE] - truth)[mask]):.1f})"
    base.histogram(reference, bins, label, base.GREY, ":", 2.6)
    plt.xscale("log")
    plt.xlabel(xlabel)
    plt.ylabel(r"share of test simulations (\%)")
    plt.title(base.NAMES[model] + rf", {len(ranked)} approaches in 15 minutes")
    plt.grid(True, alpha=0.3)
    plt.legend(frameon=False, fontsize=11, title=r"best three, median in km/s", title_fontsize=11)
    plt.tight_layout()
    target = base.HERE / "figures"
    target.mkdir(exist_ok=True)
    tag = model.replace("claude-", "").replace("-", "_")
    plt.savefig(target / f"explore_hist_{tag}_{suffix}.png", dpi=base.DPI)
    plt.close()


def plot_best_combined(predictions, truth, references):
    """Plot the best approach of each agent and the reference on all test simulations together."""
    plt.figure(figsize=SIZE_BEST)
    for model in base.MODELS:
        found = predictions.get(model, {})
        if not found:
            continue
        medians = {name: np.median(np.abs(found[name] - truth)) for name in found}
        best = min(medians, key=medians.get)
        values = base.clip_low(np.abs(found[best] - truth), BINS_ALL)
        label = base.NAMES[model] + ": " + tex(best.split(" ", 1)[1]) + rf" ({medians[best]:.1f})"
        base.histogram(values, BINS_ALL, label, base.COLORS[model], base.LINESTYLES[model], 2.4)
    reference = np.abs(references[REFERENCE] - truth)
    label = rf"gwModelRemS, published ({np.median(reference):.1f})"
    base.histogram(base.clip_low(reference, BINS_ALL), BINS_ALL, label, base.GREY, ":", 2.6)
    plt.xscale("log")
    plt.xlabel(r"$|\Delta v|$ on all 380 test cases [km/s]")
    plt.ylabel(r"share of test simulations (\%)")
    plt.grid(True, alpha=0.3)
    plt.legend(frameon=False, fontsize=10, title=r"median in km/s", title_fontsize=10, loc="upper left")
    plt.tight_layout()
    target = base.HERE / "figures"
    target.mkdir(exist_ok=True)
    plt.savefig(target / "explore_hist_best_all.png", dpi=base.DPI)
    plt.close()


def main():
    """Score all exploration sessions and write the tables and figures."""
    scorer = base.load_scorer()
    with np.load(base.ROOT / "private" / "hidden_test.npz") as saved:
        test = {name: saved[name] for name in saved.files}
    with np.load(base.ROOT / "private" / "reference_predictions.npz") as saved:
        references = {name: saved[name] for name in saved.files}
    rows = []
    sessions = []
    predictions = {}
    for model in base.MODELS:
        short = model.replace("claude-", "")
        found_dirs = [WORKS / short / "explore"] + sorted((WORKS / short).glob("explore_s*"))
        for run_dir in [path for path in found_dirs if path.is_dir()]:
            seed = run_dir.name.rsplit("_s", 1)[1] if "_s" in run_dir.name else "1"
            session_rows, session_predictions, session = score_session(scorer, run_dir, model, seed)
            rows.extend(session_rows)
            sessions.append(session)
            for name, prediction in session_predictions.items():
                predictions.setdefault(model, {})[f"s{seed} {name}"] = prediction
    write_tables(rows, sessions, references, test, scorer)
    truth = test["vkick_kms"]
    nr = test["catalog"] != "BHPT"
    for model in base.MODELS:
        found = predictions.get(model, {})
        plot_agent(model, found, truth, nr, references, base.BINS_NR, "nr",
                   r"$|\Delta v|$ on numerical relativity [km/s]")
        plot_agent(model, found, truth, ~nr, references, base.BINS_BHPT, "bhpt",
                   r"$|\Delta v|$ on perturbation theory [km/s]")
        plot_agent(model, found, truth, np.ones_like(nr), references, BINS_ALL, "all",
                   r"$|\Delta v|$ on all 380 test simulations [km/s]")
    plot_best_combined(predictions, truth, references)


if __name__ == "__main__":
    main()
