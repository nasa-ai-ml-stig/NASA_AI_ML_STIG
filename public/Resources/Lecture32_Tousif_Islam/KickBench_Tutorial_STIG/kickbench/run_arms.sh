#!/bin/zsh
# Run the KickSkills and KickAgent arms of KickBench, then compare them with the bare task.
#
#   ./run_arms.sh            seeds 1 2 3
#   ./run_arms.sh 4 5        more seeds
#
# For each seed and arm, Haiku, Sonnet and Opus 4.5 run in parallel (single-answer protocol, 45
# minutes, $5), in agentic_works/<agent>/single_s<seed>_<arm>/. A session that already exists is
# skipped. Stops after a step in which any session hit the usage limit or had its writes refused.
# Env: base.

set -uo pipefail

HERE=${0:A:h}
PYTHON=${PYTHON:-python}
WORKS=$HERE/agentic_works
MODELS=(claude-haiku-4-5 claude-sonnet-4-5 claude-opus-4-5)
if (( $# )); then
  SEEDS=($@)
else
  SEEDS=(1 2 3)
fi
ARMS=(skill agent)

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

for seed in $SEEDS; do
  for arm in $ARMS; do
    echo "$(date) seed $seed arm $arm starting"
    transcripts=()
    for model in $MODELS; do
      dir=$WORKS/${model#claude-}/single_s${seed}_${arm}
      transcripts+=($dir/transcript.jsonl)
      if [[ -d $dir ]]; then
        echo "$(date) $dir exists, skipped"
        continue
      fi
      $PYTHON $HERE/run_model.py $model $seed single $arm &
    done
    wait
    if limit_hit $transcripts; then
      exit 1
    fi
  done
done

echo "$(date) comparing arms"
cd $HERE/analysis
$PYTHON Islam2026_kickbench_arms_analysis.py
echo "$(date) all done"
