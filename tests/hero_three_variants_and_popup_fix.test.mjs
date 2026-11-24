import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: CaseStudyModal and index.html load simulator.html with cache-buster for Moriku', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(modal.includes('/projects/moriku/simulator.html?v=20261125'), 'CaseStudyModal must load cache-busted simulator.html');
  assert.ok(indexHtml.includes('projects/moriku/simulator.html?v=20261125'), 'index.html must link to cache-busted simulator.html');
});

test('Criterion 2: Hero.tsx and index.html render all 3 Hero plans back-to-back without metric clutter', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  for (const label of ['PLAN A', 'PLAN B', 'PLAN C']) {
    assert.ok(hero.includes(label), `Hero.tsx must render ${label} for back-to-back review`);
    assert.ok(indexHtml.includes(label), `index.html must render ${label} for back-to-back review`);
  }

  // Must NOT contain unnecessary metrics or HeroExecutiveSpecimen bottom bar
  assert.ok(!hero.includes('HeroExecutiveSpecimen'), 'Hero.tsx must remove HeroExecutiveSpecimen bottom bar');
  assert.ok(!hero.includes('350+'), 'Hero.tsx must not contain 350+ metric clutter');
  assert.ok(!hero.includes('<2h SLA') && !hero.includes('2h SLA'), 'Hero.tsx must not contain SLA metric clutter');
  assert.ok(!hero.includes('60 FPS'), 'Hero.tsx must not contain 60 FPS metric clutter');
});

