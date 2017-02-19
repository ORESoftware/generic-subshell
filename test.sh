#!/usr/bin/env bash


# you may wish to run build.sh before running test.sh

cd $(dirname "$0") &&
./link.sh &&
./node_modules/.bin/suman
