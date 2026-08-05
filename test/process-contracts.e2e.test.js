'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {run} = require('../index.js');

const quote = value => `'${String(value).replace(/'/g, `'"'"'`)}'`;

function fixtureDir(t, prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  return directory;
}

function collect(child, timeoutMillis = 5000) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`generic-subshell did not exit within ${timeoutMillis}ms`));
    }, timeoutMillis);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      stdout += chunk;
    });
    child.stderr.on('data', chunk => {
      stderr += chunk;
    });
    child.once('error', error => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('close', (code, signal) => {
      clearTimeout(timeout);
      resolve({code, signal, stdout, stderr});
    });
  });
}

test('commands start concurrently and each successful exit is reported', async t => {
  const directory = fixtureDir(t, 'generic-subshell-barrier-');
  const script = path.join(directory, 'barrier.js');
  const firstMarker = path.join(directory, 'first.ready');
  const secondMarker = path.join(directory, 'second.ready');
  fs.writeFileSync(script, `
    const fs = require('node:fs');
    const [own, peer, label] = process.argv.slice(2);
    fs.writeFileSync(own, 'ready');
    const deadline = Date.now() + 2000;
    (function poll() {
      if (fs.existsSync(peer)) {
        console.log(label);
        process.exit(0);
      }
      if (Date.now() >= deadline) {
        console.error('peer command never started');
        process.exit(9);
      }
      setTimeout(poll, 10);
    })();
  `);

  const command = (own, peer, label) => [
    quote(process.execPath),
    quote(script),
    quote(own),
    quote(peer),
    quote(label),
  ].join(' ');
  const result = await collect(run([
    command(firstMarker, secondMarker, 'first-observed-peer'),
    command(secondMarker, firstMarker, 'second-observed-peer'),
  ]));

  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /first-observed-peer/);
  assert.match(result.stdout, /second-observed-peer/);
  assert.match(result.stdout, /GENERIC_SUBSHELL_RESULT index=0 exit_code=0/);
  assert.match(result.stdout, /GENERIC_SUBSHELL_RESULT index=1 exit_code=0/);
  assert.match(result.stdout, /GENERIC_SUBSHELL_EXIT_CODE=0/);
});

test('one failed command makes the parent fail after all peers finish', async t => {
  const directory = fixtureDir(t, 'generic-subshell-failure-');
  const completionMarker = path.join(directory, 'peer-finished');
  const failScript = path.join(directory, 'fail.js');
  const successScript = path.join(directory, 'success.js');
  fs.writeFileSync(failScript, 'setTimeout(() => process.exit(7), 25);\n');
  fs.writeFileSync(
    successScript,
    `const fs = require('node:fs'); setTimeout(() => { fs.writeFileSync(${JSON.stringify(completionMarker)}, 'done'); process.exit(0); }, 100);\n`,
  );

  const result = await collect(run([
    `${quote(process.execPath)} ${quote(failScript)}`,
    `${quote(process.execPath)} ${quote(successScript)}`,
  ]));

  assert.equal(result.code, 1);
  assert.equal(fs.readFileSync(completionMarker, 'utf8'), 'done');
  assert.match(result.stdout, /GENERIC_SUBSHELL_RESULT index=0 exit_code=7/);
  assert.match(result.stdout, /GENERIC_SUBSHELL_RESULT index=1 exit_code=0/);
  assert.match(result.stdout, /GENERIC_SUBSHELL_EXIT_CODE=1/);
});

test('execution leaves global Git configuration untouched and rejects empty work', async t => {
  const home = fixtureDir(t, 'generic-subshell-home-');
  const previousHome = process.env.HOME;
  process.env.HOME = home;
  let child;
  try {
    child = run([`${quote(process.execPath)} -e ${quote("process.stdout.write('ok')")}`]);
  }
  finally {
    if (previousHome === undefined) {
      delete process.env.HOME;
    }
    else {
      process.env.HOME = previousHome;
    }
  }

  const result = await collect(child);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(home, '.gitconfig')), false);
  assert.throws(() => run([]), /at least one command/);
  assert.throws(() => run(['   ']), /command at index 0 is empty/);
});
