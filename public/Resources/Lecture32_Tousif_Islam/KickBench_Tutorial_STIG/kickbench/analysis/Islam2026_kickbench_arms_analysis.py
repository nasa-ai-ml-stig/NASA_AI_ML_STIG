"""Compare the KickBench arms: bare task, KickSkills, and KickAgent.

Sessions (see run_model.py):
    agentic_works/<agent>/single_s<seed>          arm none, the bare task
    agentic_works/<agent>/single_s<seed>_skill    arm skill, KickSkills installed
    agentic_works/<agent>/single_s<seed>_agent    arm agent, KickSkills plus the KickAgent workflow

Every session is scored by private/score.py on the hidden test set, unchanged. The session is the
statistical unit. With a few sessions per cell the table shows spread, not significance.

Outputs:
    results/arms_sessions.md     one row per session
    results/arms_summary.md      one row per model and arm
    figures/arms_nr_median.png   NR median of each session, by arm, one marker per model
    figures/arms_physics.png     physics checks passed by each session, by arm

Env: base.
"""

import re

import matplotlib.pyplot as plt
import numpy as np

import Islam2026_kickbench_analysis as base

ARMS = ["none", "skill", "agent"]
ARM_LABELS = {"none": r"no skill", "skill": r"KickSkills", "agent": r"KickAgent"}
PATTERN = re.compile(r"^single_s(\d+)(?:_(skill|agent))?$")
OFFSETS = {"claude-haiku-4-5": -0.18, "claude-sonnet-4-5": 0.0, "claude-opus-4-5": 0.18}


def collect(scorer):
    """Score every single-answer session of every arm."""
    rows = []
    for model in base.MODELS:
        folder = base.WORKS / model.replace("claude-", "")
        for run_dir in sorted(folder.glob("single_s*")):
            found = PATTERN.match(run_dir.name)
            if found is None or not (run_dir / "transcript.jsonl").exists():
                continue
            row, _, _ = base.session_row(scorer, run_dir, model, found.group(1))
            row["arm"] = found.group(2) or "none"
            rows.append(row)
    return rows


def number(value, digits=2):
    """Format a float, blank for NaN or missing."""
    return "" if value is None or not np.isfinite(value) else f"{value:.{digits}f}"


def write_tables(rows):
    """Write the per-session and per-cell tables."""
    base.HERE.joinpath("results").mkdir(exist_ok=True)
    session_table = []
    for row in rows:
        if row["valid"]:
            cells = [number(row["nr_median"]), number(row["nr_p90"]), number(row["bhpt_median"], 3),
                     row["physics_passed"], row["physics_failed"], number(row["estimate_median"])]
        else:
            cells = ["invalid", row["error"][:50], "", "", "", ""]
        session_table.append([base.NAMES[row["model"]], row["arm"], row["session"]] + cells
                             + [number(row["wall_min"], 1), number(row["cost_usd"]), row["audit_hits"]])
    header = ["Agent", "Arm", "Session", "NR median", "NR p90", "BHPT median", "Physics of 6",
              "Failed checks", "Stated median", "Minutes", "Cost USD", "Audit hits"]
    (base.HERE / "results" / "arms_sessions.md").write_text(base.markdown_table(header, session_table))
    summary = []
    for model in base.MODELS:
        for arm in ARMS:
            cell = [row for row in rows if row["model"] == model and row["arm"] == arm]
            if not cell:
                continue
            valid = [row for row in cell if row["valid"]]
            medians = np.array([row["nr_median"] for row in valid])
            physics = [row["physics_passed"] for row in valid]
            summary.append([
                base.NAMES[model], ARM_LABELS[arm].replace(r"\ ", " "), len(cell), len(valid),
                number(np.median(medians)) if medians.size else "",
                f"{medians.min():.2f} to {medians.max():.2f}" if medians.size else "",
                f"{min(physics)} to {max(physics)}" if physics else "",
                number(np.nanmedian([row["cost_usd"] for row in cell])),
            ])
    header = ["Agent", "Arm", "Sessions", "Valid", "NR median of session medians", "Range",
              "Physics of 6", "Median cost USD"]
    text = base.markdown_table(header, summary)
    (base.HERE / "results" / "arms_summary.md").write_text(text)
    print(text)


def reference_nr_median():
    """NR median of the published v2 gwModelRemS fit on the same hidden rows."""
    with np.load(base.ROOT / "private" / "hidden_test.npz") as saved:
        truth = saved["vkick_kms"]
        catalog = saved["catalog"]
    with np.load(base.ROOT / "private" / "reference_predictions.npz") as saved:
        reference = saved[base.REF_KEY]
    nr = catalog != "BHPT"
    return float(np.median(np.abs(reference - truth)[nr]))


def plot_by_arm(rows, key, ylabel, name, log, reference=None):
    """One marker per session, arms along x, models offset and styled as elsewhere."""
    plt.figure(figsize=base.SIZE)
    if reference is not None:
        plt.axhline(reference, color=base.GREY, linestyle=":", linewidth=2.2,
                    label=rf"gwModelRemS, published fit ({reference:.2f})")
    for model in base.MODELS:
        x = []
        y = []
        for index, arm in enumerate(ARMS):
            for row in rows:
                if row["model"] == model and row["arm"] == arm and row["valid"]:
                    x.append(index + OFFSETS[model])
                    y.append(row[key])
        plt.scatter(x, y, s=60, marker=base.MARKERS[model], color=base.COLORS[model], label=base.NAMES[model])
    plt.xticks(range(len(ARMS)), [ARM_LABELS[arm] for arm in ARMS])
    plt.xlim(-0.5, len(ARMS) - 0.5)
    if log:
        plt.yscale("log")
        plt.ylim(1.4, 60.0)
    plt.ylabel(ylabel)
    base.finish(name)


def main():
    """Score all arms and write the tables and figures."""
    scorer = base.load_scorer()
    rows = collect(scorer)
    write_tables(rows)
    plot_by_arm(rows, "nr_median", r"median $|\Delta v|$ on hidden NR [km/s]", "arms_nr_median.png", True,
                reference_nr_median())
    plot_by_arm(rows, "physics_passed", r"physics checks passed (of 6)", "arms_physics.png", False)


if __name__ == "__main__":
    main()
