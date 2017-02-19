
# Generic-Subshell

Run a dynamic number of bash commands in parallel, collect all exit codes.


### This project essentially has two interfaces.

1. You can interact with the shell script directly. Using NPM, install this project.* Then reference the script with:
./node_modules/generic-subshell/run.sh. Or just copy and paste the script in your project and make it your own :)

2. There is a node.js interface - pass the Node.js interface an array of commands, and this library with
a reference to the child process.

```js

import gs from 'generic-subshell';  // using es5 it's 

const commands = ['echo "foo"', 'echo "baz"', 'echo "bar"'];
const k = gs(commands);

k.once('close', function(code){
    // hopefull everything exits with code 0
});

```


* To use and install with npm:

```bash
cd '<project-root>'
npm init # if your project is not already an NPM project
npm install --save generic-subshell

```
