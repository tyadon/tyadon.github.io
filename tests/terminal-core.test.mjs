import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runCommand } from '../assets/js/apps/terminal-core.js';
import { readJSON } from './helpers.mjs';

const ctx = { apps: ['readme', 'darkroom', 'maps'], content: readJSON('_data/content.json') };

test('help lists open', () => {
  assert.ok(runCommand('help', ctx).lines.join('\n').includes('open'));
});

test('open a known app', () => {
  assert.equal(runCommand('open darkroom', ctx).open, 'darkroom');
});

test('open an unknown app prints an error', () => {
  const r = runCommand('open nope', ctx);
  assert.equal(r.open, undefined);
  assert.match(r.lines[0], /nope/);
});

test('trims and ignores case', () => {
  assert.match(runCommand('  WHOAMI ', ctx).lines[0], /trey/i);
});

test('unknown command', () => {
  assert.equal(runCommand('rm -rf /', ctx).lines[0], 'command not found: rm');
});

test('clear', () => {
  assert.equal(runCommand('clear', ctx).clear, true);
});

test('ls lists apps and cat readme prints it', () => {
  assert.ok(runCommand('ls', ctx).lines.join(' ').includes('darkroom'));
  assert.ok(runCommand('cat readme', ctx).lines.join(' ').includes(ctx.content.readme.paragraphs[0]));
});

test('empty input prints nothing', () => {
  assert.deepEqual(runCommand('   ', ctx).lines, []);
});
