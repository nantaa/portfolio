import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Hero eliminates 50/50 4fr 5fr split in favor of full-width architectural editorial layout', () => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(!globalsCss.includes('grid-template-columns: 4fr 5fr'), 'globals.css must remove 4fr 5fr split on .hero-body');
  assert.ok(!indexHtml.includes('grid-template-columns: 4fr 5fr'), 'index.html must remove 4fr 5fr split on .hero-body');
});

test('Criterion 2: index.html #work renders all-in-one project grid without tag selector tabs', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(!indexHtml.includes('role="tablist"'), 'index.html must not render category tablist');
  assert.ok(!indexHtml.includes('filterProjects('), 'index.html must not render filterProjects tag selector');
});

test('Criterion 3: index.html caseModal uses semantic var(--modal-bg) and purges CASE DOSSIER /', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(!indexHtml.includes('CASE DOSSIER /'), 'index.html must purge legacy CASE DOSSIER label');
  assert.ok(!indexHtml.includes('background:#0D0D0D'), 'index.html caseModal must not hardcode #0D0D0D');
  assert.ok(indexHtml.includes('var(--modal-bg)'), 'index.html caseModal must use var(--modal-bg)');
});

test('Criterion 4: index.html Contact includes interactive inquiry intent chips', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('selectIntent('), 'index.html must implement selectIntent function');
  assert.ok(indexHtml.includes('Fullstack Systems'), 'index.html must include Fullstack Systems intent');
  assert.ok(indexHtml.includes('Systems Architecture'), 'index.html must include Systems Architecture intent');
});

test('Criterion 5: index.html About renders /images/aryo.png and Footer includes Back to top', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('/images/aryo.png') || indexHtml.includes('images/aryo.png'), 'index.html About must render aryo.png');
  assert.ok(indexHtml.includes('Back to top'), 'index.html Footer must include Back to top button');
});

test('Criterion 6: Nav.tsx closes mobile drawer on Escape key and locks body overflow', () => {
  const nav = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx'), 'utf-8');
  assert.ok(nav.includes('Escape') && nav.includes('setMobileMenuOpen(false)'), 'Nav.tsx must close mobile menu on Escape');
  assert.ok(nav.includes('document.body.style.overflow'), 'Nav.tsx must lock body overflow when mobile menu is open');
});

