import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('WorkGrid.tsx and CaseStudyModal.tsx exclude Makna Works Brand Guidelines from project grid and render standalone section', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');

  assert.ok(!workGrid.includes('id: 8,'), 'CORE_PROJECTS must exclude id: 8');
  assert.ok(workGrid.includes('id="brand-guidelines"') && workGrid.includes('<MaknaMoodboardPreview />'), 'WorkGrid.tsx must render standalone #brand-guidelines section with MaknaMoodboardPreview');
  assert.ok(!workGrid.includes('max-w-5xl mx-auto'), 'Standalone #brand-guidelines section must fill full width without max-w-5xl gap');
  assert.ok(!modal.includes('p.id === 8'), 'CaseStudyModal.tsx must not handle project 8');
});

test('index.html excludes card 08 from work-grid and renders standalone clickable Brand Guidelines section', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('07 projects'), 'index.html must display 07 projects');
  assert.ok(!indexHtml.includes('openCase(8)'), 'index.html must not open CaseStudyModal for card 08');
  assert.ok(indexHtml.includes('id="brand-guidelines"') && indexHtml.includes('openBrandModal()'), 'index.html must render standalone clickable Brand Guidelines section');
});

