"use strict";

Object.defineProperty(exports, "__esModule", {value: true});

var cp = require("child_process");
var path = require("path");
var executable = path.resolve(__dirname, 'lib', 'run.sh');

exports.run = function ($commands, args) {
    if (!Array.isArray($commands)) {
        throw new TypeError('generic-subshell.run requires an array of shell commands.');
    }

    var commands = $commands.map(function (command, index) {
        var normalized = String(command).trim();
        if (!normalized) {
            throw new TypeError('generic-subshell command at index ' + index + ' is empty.');
        }
        return normalized;
    });

    if (commands.length < 1) {
        throw new TypeError('generic-subshell.run requires at least one command.');
    }

    if (args !== undefined && !Array.isArray(args)) {
        throw new TypeError('generic-subshell args must be an array when provided.');
    }

    return cp.spawn(executable, args || [], {
        env: Object.assign({}, process.env, {
            GENERIC_SUBSHELL_COMMANDS: commands.join('\n')
        }),
        stdio: ['ignore', 'pipe', 'pipe']
    });
};
