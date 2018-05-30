"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var path = require("path");
var exec = path.resolve(__dirname + '/lib/run.sh');
exports.run = function ($commands, args) {
    var commands = $commands.map(function (c) {
        return String(c).trim();
    });
    return cp.spawn(exec, (args || []), {
        env: Object.assign({}, process.env, {
            GENERIC_SUBSHELL_COMMANDS: commands.join('\n')
        })
    });
};
