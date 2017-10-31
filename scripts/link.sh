#!/usr/bin/env bash

# if you aren't using NVM, then you may need sudo

set -e;

if [[ ! -f "package.json" ]]; then
    echo "no package.json in current directory";
    exit 1;
fi

npm link
npm link generic-subshell