import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Moriku and Docket covers use TATA$ style with optimized lazy WebP images under 150 KB', () => {
  const morikuWebp = path.join(rootDir, 'frontend', 'public', 'images', 'moriku-cover.webp');
  const docketWebp = path.join(rootDir, 'frontend', 'public', 'images', 'docket-cover.webp');

  assert.ok(fs.existsSync(morikuWebp), 'frontend/public/images/moriku-cover.webp must exist');
  assert.ok(fs.existsSync(docketWebp), 'frontend/public/images/docket-cover.webp must exist');
  assert.ok(fs.statSync(morikuWebp).size < 150 * 1024, 'moriku-cover.webp must be under 150 KB');
  assert.ok(fs.statSync(docketWebp).size < 150 * 1024, 'docket-cover.webp must be under 150 KB');

  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  assert.ok(workGrid.includes('/images/moriku-cover.webp'), 'WorkGrid.tsx must reference /images/moriku-cover.webp');
  assert.ok(workGrid.includes('/images/docket-cover.webp'), 'WorkGrid.tsx must reference /images/docket-cover.webp');
  assert.ok(workGrid.includes('loading="lazy"') && workGrid.includes('decoding="async"'), 'WorkGrid.tsx covers must use lazy async decoding');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('images/moriku-cover.webp'), 'index.html card 01 must reference images/moriku-cover.webp');
  assert.ok(indexHtml.includes('images/docket-cover.webp'), 'index.html card 04 must reference images/docket-cover.webp');
});
