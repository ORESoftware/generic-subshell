#!/usr/bin/env bash

set -u
set -m

EXIT_CODE=0
commands=()
pids=()

while IFS= read -r line; do
  if [[ -n "${line//[[:space:]]/}" ]]; then
    commands+=("$line")
  fi
done <<< "${GENERIC_SUBSHELL_COMMANDS:-}"

if [[ "${#commands[@]}" -lt 1 ]]; then
  echo "generic-subshell: no commands were supplied" >&2
  exit 64
fi

function terminateChildren() {
  local signal_exit_code="$1"
  trap - INT TERM

  for pid in "${pids[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    fi
  done

  for pid in "${pids[@]}"; do
    wait "$pid" 2>/dev/null || true
  done

  exit "$signal_exit_code"
}

trap 'terminateChildren 130' INT
trap 'terminateChildren 143' TERM

for i in "${!commands[@]}"; do
  bash -c "${commands[$i]}" &
  pids[$i]=$!
  printf 'GENERIC_SUBSHELL_STARTED index=%s pid=%s\n' "$i" "${pids[$i]}"
done

for i in "${!pids[@]}"; do
  code=0
  wait "${pids[$i]}" || code=$?
  printf 'GENERIC_SUBSHELL_RESULT index=%s exit_code=%s\n' "$i" "$code"
  if [[ "$code" -ne 0 ]]; then
    EXIT_CODE=1
  fi
done

printf 'GENERIC_SUBSHELL_EXIT_CODE=%s\n' "$EXIT_CODE"
exit "$EXIT_CODE"
