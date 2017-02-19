#!/usr/bin/env bash

# you may wish to run build.sh before running test.sh
# you may also wish to run link.sh before running test.sh

cd $(dirname "$0") &&
./node_modules/.bin/suman -r
