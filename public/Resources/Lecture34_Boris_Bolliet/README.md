# Lecture 34: Multi-Agent Systems and Orchestration (Boris Bolliet, 16 November 2026)

*Building a research harness.*

## Contents

- [`Multi-Agent_Systems_and_Orchestration_Slides_STIG.pdf`](Multi-Agent_Systems_and_Orchestration_Slides_STIG.pdf):
  the 27 lecture slides.
- [`Multi-Agent_Systems_and_Orchestration_Notes_STIG.pdf`](Multi-Agent_Systems_and_Orchestration_Notes_STIG.pdf):
  17 pages of lecture notes that follow the slides in more detail: building a research harness,
  roles and control flow in LangGraph, evaluation with Langfuse, existing harnesses (CMBAgent,
  Denario, OpenCode, Skepthical, CLArXivR), and the Pantheon+ experiment, with references.
- [`Research_Harness_Notebooks_STIG/`](Research_Harness_Notebooks_STIG/): local copy of the three
  companion notebooks. Each gives the same Pantheon+ supernova fit of the matter density to a
  different organisation of agents and compares the result with an independent fit:
  - [`class01/lecture01_single_agent.ipynb`](Research_Harness_Notebooks_STIG/class01/lecture01_single_agent.ipynb):
    one LangGraph agent that writes and runs Python scripts.
  - [`class01/lecture01_cmbagent_lg.ipynb`](Research_Harness_Notebooks_STIG/class01/lecture01_cmbagent_lg.ipynb):
    CMBAgent's planning and control workflow, traced with Langfuse.
  - [`class01/lecture01_opencode.ipynb`](Research_Harness_Notebooks_STIG/class01/lecture01_opencode.ipynb):
    the OpenCode coding agent with a reviewer subagent, traced with Langfuse.

  The `requirements*.txt` files next to them record the package versions of the saved runs.
- [`CMBAgent_LangGraph_STIG/`](CMBAgent_LangGraph_STIG/): local copy of the CMBAgent source
  (the `cmbagent_lg` Python package) at the exact commit the CMBAgent notebook's saved runs used.
  See [`CMBAgent_LangGraph_STIG/README.md`](CMBAgent_LangGraph_STIG/README.md) and
  [`CMBAgent_LangGraph_STIG/docs/ARCHITECTURE.md`](CMBAgent_LangGraph_STIG/docs/ARCHITECTURE.md).
- [`Pantheon_Plus_Data_STIG.tar.gz`](Pantheon_Plus_Data_STIG.tar.gz): local copy of the two
  Pantheon+ files the notebooks download (the supernova table, `Pantheon+SH0ES.dat`, and the full
  statistical and systematic covariance, `Pantheon+SH0ES_STAT+SYS.cov`), with the data release's
  README describing the columns. 10 MB compressed, 34 MB unpacked.

In Boris Bolliet's own course, *Multi-Agent Systems for Science*, this session is Lecture 0, and
the notebook titles use that numbering.

## Running from the local copies

The notebooks call a language model (Gemini by default, so they need a `GOOGLE_API_KEY`) and run
the code it writes, so run them in Google Colab or a container. To use the copies here instead of
downloading from GitHub, run these from this folder:

```bash
tar -xzf Pantheon_Plus_Data_STIG.tar.gz -C Research_Harness_Notebooks_STIG/class01
```

This creates `Research_Harness_Notebooks_STIG/class01/data/`. Each notebook checks that folder
first and downloads the data only if the files are missing.

For the CMBAgent notebook, also install the local CMBAgent copy and skip the notebook's first
code cell, which would otherwise install CMBAgent from GitHub:

```bash
pip install ./CMBAgent_LangGraph_STIG
```

Python packages still come from PyPI (versions in the `requirements*.txt` files). The OpenCode
notebook installs OpenCode 1.19.5 from npm, which needs Node.js; it is not copied here because it
is a platform-specific binary. Tracing needs a Langfuse account.

## Source and credit

The slides, notes and notebooks are by Boris Bolliet (University of Cambridge). The original
materials are on the course page,
**[teaching.borisbolliet.io/mas-2026/lectures/class01](https://teaching.borisbolliet.io/mas-2026/lectures/class01/)**,
and the notebooks are in
**[github.com/borisbolliet/mas-science-2026-notebooks](https://github.com/borisbolliet/mas-science-2026-notebooks)**,
where each opens in Google Colab; check there for updates.

- The slides and notes are the PDFs from the course page, renamed to this repository's convention.
- `Research_Harness_Notebooks_STIG/` is an unmodified snapshot of the notebook repository at commit
  `cd3d175` (16 November 2026), taken on 19 November 2026.
- `CMBAgent_LangGraph_STIG/` is an unmodified snapshot of
  **[github.com/CMBAgents/cmbagent](https://github.com/CMBAgents/cmbagent)** (MIT License, see
  [`CMBAgent_LangGraph_STIG/LICENSE`](CMBAgent_LangGraph_STIG/LICENSE)) at commit `56a4aea`
  (16 November 2026), the commit pinned in `requirements_lg.txt`, taken on 19 November 2026.
- The Pantheon+ files are unmodified copies from the Pantheon+ data release,
  **[github.com/PantheonPlusSH0ES/DataRelease](https://github.com/PantheonPlusSH0ES/DataRelease)**
  (commit `c447f0f`, folder `Pantheon+_Data/4_DISTANCES_AND_COVAR/`), taken on 19 November 2026.
  If you use them, cite Scolnic et al. 2022 (ApJ 938, 113) and Brout et al. 2022 (ApJ 938, 110).
  With them, the notebooks' reference fit gives Ωm = 0.3316 ± 0.0182 from 1590 light curves,
  matching the lecture notes.

These copies are kept here so the lecture still works if the originals move or change.
