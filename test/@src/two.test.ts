#!/usr/bin/env node

import * as suman from 'suman';
const Test = suman.init(module);
import * as gs from 'generic-subshell';

Test.create(function (assert, $core, it) {

  const gsc = [
    '{ echo "4"; exit 0; }',
    '{ echo "5"; exit 1; }',
    '{ echo "99"; exit 0; }'];

  it.cb('runs', t => {

    const k = gs.run(gsc);

    k.stdout.setEncoding('utf8');
    k.stderr.setEncoding('utf8');

    k.stdout.pipe(process.stdout);
    k.stderr.pipe(process.stderr);

    k.once('close', function (code) {
      t.assert(code > 0);
      t.done();
    })

  });

});
