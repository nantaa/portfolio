import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: CaseStudyModal uses cache-busted simulator.html for Moriku to bypass cached Inertia bundle', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  assert.ok(modal.includes('/projects/moriku/simulator.html?v=20261125'), 'CaseStudyModal must point Moriku iframe to /projects/moriku/simulator.html?v=20261125');
  assert.ok(modal.includes('/projects/tata/index.html?v=20261125'), 'CaseStudyModal must cache-bust TATA$ iframe');
});

test('Criterion 2: Hero.tsx renders all 3 hero options back-to-back without metric clutter', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  assert.ok(hero.includes('Option A'), 'Hero.tsx must render Option A');
  assert.ok(hero.includes('Option B'), 'Hero.tsx must render Option B');
  assert.ok(hero.includes('Option C'), 'Hero.tsx must render Option C');
  assert.ok(hero.includes('/images/aryo.png'), 'Hero.tsx Option C must use /images/aryo.png');
  assert.ok(!hero.includes('350+'), 'Hero.tsx must not render 350+ metric clutter');
  assert.ok(!hero.includes('HeroExecutiveSpecimen'), 'Hero.tsx must remove HeroExecutiveSpecimen bottom bar');
});

test('Criterion 3: index.html renders all 3 hero options back-to-back and uses cache-busted Moriku simulator', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('Option A'), 'index.html must render Option A');
  assert.ok(indexHtml.includes('Option B'), 'index.html must render Option B');
  assert.ok(indexHtml.includes('Option C'), 'index.html must render Option C');
  assert.ok(indexHtml.includes('projects/moriku/simulator.html?v=20261125'), 'index.html must link Moriku to simulator.html?v=20261125');
});

