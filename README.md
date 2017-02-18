
# Generic-Subshell

Run a dynamic number of commands in parallel, collect all exit codes.


### This project has two interfaces.

1. You can interact with the shell script directly. Using NPM, install this project.* Then reference the script with:
./node_modules/generic-subshell/run.sh

2. There is a node.js interface - pass the Node.js interface an array of commands, and this library will respond with the result.
You can choose to silence stdout/stderr.




* To install with npm:

```bash
cd '<project-root>'
npm init
npm install --save generic-subshell

```
