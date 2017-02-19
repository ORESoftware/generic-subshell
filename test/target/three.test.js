#!/usr/bin/env node
"use strict";
var suman = require("suman");
var Test = suman.init(module);
var gs = require('generic-subshell').default;
Test.create(function (assert, $core, it) {
    var cp = $core.child_process;
    var gsc = [
        '{ echo "4"; exit 0; }',
        '{ echo "5"; exit 0; }',
        '{ echo "99"; exit 0; }'
    ];
    it.cb('runs', function (t) {
        var k = gs(gsc);
        k.stdout.setEncoding('utf8');
        k.stderr.setEncoding('utf8');
        k.stdout.pipe(process.stdout);
        k.stderr.pipe(process.stderr);
        k.once('close', function (code) {
            console.log('exit code => ', code);
            t.done(code);
        });
    });
});
