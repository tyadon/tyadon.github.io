import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from './helpers.mjs';
import * as project from '../assets/js/apps/project.js';
import * as archive from '../assets/js/apps/archive.js';
import * as trash from '../assets/js/apps/trash.js';
import * as mail from '../assets/js/apps/mail.js';
import * as readme from '../assets/js/apps/readme.js';
import * as bookshelf from '../assets/js/apps/bookshelf.js';
import * as garage from '../assets/js/apps/garage.js';

const content = readJSON('_data/content.json');
const byId = Object.fromEntries(content.projects.map((p) => [p.id, p]));

test('project renders links', () => {
  const out = String(project.renderHTML(byId.whosgotit));
  assert.ok(out.includes('https://apps.apple.com/us/app/whos-got-it/id6775676276'));
  assert.ok(out.includes('https://whosgotit.app'));
  assert.ok(out.includes('Solo founder'));
});

test('project escapes data', () => {
  const out = String(project.renderHTML({ ...byId.whosgotit, pitch: '<script>x</script>' }));
  assert.ok(out.includes('&lt;script&gt;'));
  assert.equal(out.includes('<script>'), false);
});

test('archive renders five entries', () => {
  const out = String(archive.renderHTML(content.archive));
  for (const id of ['felt', 'sharktank', 'microsoft', 'cre8r', 'rit']) assert.ok(out.includes(`data-entry="${id}"`), id);
  assert.match(String(archive.renderEntry(content.archive.find((a) => a.id === 'rit'))), /lacrosse/);
});

test('trash has linkswag', () => {
  assert.match(String(trash.renderHTML(content.trash)), /Linkswag/);
});

test('mail links', () => {
  const out = String(mail.renderHTML(content.mail));
  assert.ok(out.includes('mailto:itstreyyadon@gmail.com'));
  assert.ok(out.includes('https://www.linkedin.com/in/ryadon'));
  assert.ok(out.includes('https://github.com/tyadon'));
});

test('readme, bookshelf and garage render their content', () => {
  assert.ok(String(readme.renderHTML(content.readme)).includes("Hi, I&#39;m Trey."));
  assert.ok(String(bookshelf.renderHTML(content.bookshelf)).includes('Crime and Punishment'));
  assert.ok(String(garage.renderHTML(content.garage)).includes('2024 Ducati Monster Plus'));
});
