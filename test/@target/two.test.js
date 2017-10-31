#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var suman = require("suman");
var Test = suman.init(module);
var gs = require("generic-subshell");
Test.create(function (assert, $core, it) {
    var gsc = [
        '{ echo "4"; exit 0; }',
        '{ echo "5"; exit 1; }',
        '{ echo "99"; exit 0; }'
    ];
    it.cb('runs', function (t) {
        var k = gs.run(gsc);
        k.stdout.setEncoding('utf8');
        k.stderr.setEncoding('utf8');
        k.stdout.pipe(process.stdout);
        k.stderr.pipe(process.stderr);
        k.once('close', function (code) {
            t.assert(code > 0);
            t.done();
        });
    });
});
