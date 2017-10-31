#!/usr/bin/env bash

# to build you must install type script compiler
set -e;

if [[ ! -f "package.json" ]]; then
    echo "no package.json in current directory";
    exit 1;
fi

rm -rf node_modules
npm install
./scripts/transpile.sh
echo "generic subshell has been built successfully"
