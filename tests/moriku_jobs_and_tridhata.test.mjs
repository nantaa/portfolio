import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Moriku index.html seeds interactive jobs across all 16 Kanban stages', () => {
  const publicMoriku = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html'), 'utf-8');
  const rootMoriku = fs.readFileSync(path.join(rootDir, 'projects', 'moriku', 'index.html'), 'utf-8');

  for (let s = 1; s <= 16; s++) {
    assert.ok(publicMoriku.includes(`"stage":"${s}"`), `public moriku must have job at stage ${s}`);
    assert.ok(rootMoriku.includes(`"stage":"${s}"`), `root moriku must have job at stage ${s}`);
  }
});

test('Criterion 2: TridhataLaravelPreview.tsx exists and showcases Laravel 11 + Filament v3 resources', () => {
  const previewPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'TridhataLaravelPreview.tsx');
  assert.ok(fs.existsSync(previewPath), 'TridhataLaravelPreview.tsx must exist');

  const content = fs.readFileSync(previewPath, 'utf-8');
  assert.ok(content.includes('ProductionScheduleResource'), 'Must showcase ProductionScheduleResource');
  assert.ok(content.includes('BomResource'), 'Must showcase BomResource');
  assert.ok(content.includes('StockMovementResource'), 'Must showcase StockMovementResource');
  assert.ok(content.includes('LowStockAlertWidget'), 'Must showcase LowStockAlertWidget');
});

test('Criterion 3: WorkGrid.tsx and CaseStudyModal.tsx comment out Delta IT Helpdesk and showcase Tridhata PPIC ERP', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');

  assert.ok(workGrid.includes('Tridhata PPIC ERP'), 'WorkGrid.tsx must showcase Tridhata PPIC ERP');
  assert.ok(workGrid.includes('Filament v3'), 'WorkGrid.tsx must highlight Filament v3 stack');
  assert.ok(modal.includes('{p.id === 5 && <TridhataLaravelPreview />}'), 'CaseStudyModal.tsx must render TridhataLaravelPreview');
  assert.ok(modal.includes('// import HelpdeskPreview'), 'CaseStudyModal.tsx must comment out HelpdeskPreview import');
});

test('Criterion 4: index.html comments out Delta IT Helpdesk and showcases Tridhata PPIC ERP', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('Tridhata PPIC ERP'), 'index.html must showcase Tridhata PPIC ERP');
  assert.ok(indexHtml.includes('Filament v3'), 'index.html must highlight Filament v3');
});
