#!/usr/bin/env node
'use strict';

const suman = require('suman');
const {Test} = suman.init(module);

Test.create(function (assert, $core, runPath, it) {

  const cp = $core.child_process;

  const gsc = [
      '{ echo "4"; exit 0; }',
      '{ echo "5"; exit 0; }',
      '{ echo "99"; exit 0; }']
    ;

  it.cb('runs', t => {

    const k = cp.spawn(runPath, [], {
      env: Object.assign({}, process.env, {
        GENERIC_SUBSHELL_COMMANDS: gsc.join('\n')
      })
    });

    k.stdout.setEncoding('utf8');
    k.stderr.setEncoding('utf8');

    k.stdout.pipe(process.stdout);
    k.stderr.pipe(process.stderr);

    k.once('exit', function (code) {
      console.log('exit code => ', code);
      t.done(code);
    })

  });

});
