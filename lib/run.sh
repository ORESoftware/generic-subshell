#!/usr/bin/env bash

git config --global url."https://".insteadOf git://

set -m # allow for job control
EXIT_CODE=0;  # exit code of overall script

function handleJobs() {
     for job in `jobs -p`; do
         echo "PID => ${job}"
#        if  ! wait ${job} ; then
         CODE=0;
         wait ${job} || CODE=$?
         if [[ "${CODE}" != "0" ]]; then
            echo "At least one test failed with exit code => ${CODE}" ;
            EXIT_CODE=1;
         fi
     done
}

trap 'handleJobs' CHLD
DIRN=$(dirname "$0");

commands=()

while read -r line; do
   commands+=("$line")
done <<< "${GENERIC_SUBSHELL_COMMANDS}"

clen=`expr "${#commands[@]}" - 1` # get length of commands - 1

for i in `seq 0 "$clen"`; do
    (echo "${commands[$i]}" | bash) &   # run the command via bash in subshell
    echo "$i ith command has been issued as a background job"
done


wait; # wait for all subshells to finish
echo "=> generic-subshell process exit code => $EXIT_CODE"
exit "$EXIT_CODE"
