import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Disciplines.tsx and index.html use 06 Core Disciplines with general natural copy', () => {
  const disc = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Disciplines.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  const banned = [
    'Verified Engineering Domains',
    'verified production artifacts',
    'Disnaker SLA',
    'Bekasi Sample',
    'Gemini 2.0 Flash',
    'Soketi',
    '512MB RAM Budget',
    'Zero-RAM Static Export',
  ];

  const discSection = indexHtml.slice(indexHtml.indexOf('id="disciplines"'), indexHtml.indexOf('id="about"'));

  for (const file of [disc, discSection]) {
    assert.ok(file.includes('06 Core Disciplines'), 'Must render 06 Core Disciplines header');
    assert.ok(file.includes('Full-Stack Web Applications'), 'Must include Full-Stack Web Applications');
    assert.ok(file.includes('UI Systems &amp; Brand Design') || file.includes('UI Systems & Brand Design'), 'Must include UI Systems & Brand Design');
    for (const term of banned) {
      assert.ok(!file.includes(term), `Must not contain outdated/case-specific phrase: ${term}`);
    }
  }
});

test('WorkGrid.tsx and index.html remove Disnaker and institution/city-specific terms', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const terms = ['Disnaker', 'DISNAKER', 'Kaprodi', 'PT Delta Nusantara', 'Bogor', 'Nganjuk'];

  for (const term of terms) {
    assert.ok(!workGrid.includes(term), `WorkGrid.tsx must not contain ${term}`);
    assert.ok(!indexHtml.includes(term), `index.html must not contain ${term}`);
  }
});

