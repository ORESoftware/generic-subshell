#!/usr/bin/env bash

# you may wish to run build.sh before running test.sh
# you may also wish to run link.sh before running test.sh

set -e;

if [[ ! -f "package.json" ]]; then
    echo "no package.json in current directory";
    exit 1;
fi

if [[ ! -d "node_modules/generic-subshell" ]]; then
    npm link
    npm link generic-subshell
fi

tsc --project tsconfig-test.json  || echo "tests may have compiled with errors"  # builds the tests
suman -r "test/@target"

