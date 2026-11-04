#!/bin/zsh
# Run the pending KickBench sessions and score them. Every session lives in agentic_works/<agent>/.
#
#   ./run_all.sh
#
# 1. Exploration round: Haiku, Sonnet and Opus 4.5 in parallel, 15 minutes each, in
#    agentic_works/<agent>/explore/. Then score every approach: tables and one histogram per agent.
# 2. Single-answer round: rerun the sessions the usage limit cut short (the cut-short copies are kept
#    in agentic_works/<agent>/aborted_rate_limit/), in parallel, then rescore that round.
# Stops after a step in which any session hit the usage limit or had its file writes refused. Env: base.

set -uo pipefail

HERE=${0:A:h}
PYTHON=${PYTHON:-python}
WORKS=$HERE/agentic_works
MODELS=(claude-haiku-4-5 claude-sonnet-4-5 claude-opus-4-5)
RERUNS=(claude-opus-4-5:2 claude-opus-4-5:3 claude-sonnet-4-5:3)

limit_hit() {
  local found=0
  for transcript in "$@"; do
    if [[ -f $transcript ]] && grep -q "hit your" $transcript; then
      echo "$(date) usage limit hit in $transcript"
      found=1
    fi
    if [[ -f $transcript ]] && grep -q "which is a sensitive file" $transcript; then
      echo "$(date) file writes were refused in $transcript"
      found=1
    fi
  done
  return $(( 1 - found ))
}

echo "$(date) exploration round starting"
for model in $MODELS; do
  $PYTHON $HERE/run_model.py $model 1 explore &
done
wait
if limit_hit $WORKS/*/explore/transcript.jsonl; then
  exit 1
fi

echo "$(date) scoring the exploration round"
cd $HERE/analysis
$PYTHON Islam2026_kickbench_explore_analysis.py

echo "$(date) single-answer reruns starting"
for spec in $RERUNS; do
  model=${spec%%:*}
  seed=${spec##*:}
  $PYTHON $HERE/run_model.py $model $seed &
done
wait
transcripts=()
for spec in $RERUNS; do
  model=${spec%%:*}
  transcripts+=($WORKS/${model#claude-}/single_s${spec##*:}/transcript.jsonl)
done
if limit_hit $transcripts; then
  exit 1
fi

echo "$(date) rescoring the single-answer round"
$PYTHON Islam2026_kickbench_analysis.py
echo "$(date) all done"
