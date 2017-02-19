"use strict";
var cp = require("child_process");
var path = require("path");
var run = path.resolve(__dirname + '/lib/run.sh');
function default_1($commands, args) {
    var commands = $commands.map(function (c) {
        return String(c).trim();
    });
    return cp.spawn(run, (args || []), {
        env: Object.assign({}, process.env, {
            GENERIC_SUBSHELL_COMMANDS: commands.join('\n')
        })
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
