import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Actual compiled VAULTR app is deployed in public and root projects', () => {
  const dirs = [
    path.join(rootDir, 'frontend', 'public', 'projects', 'vaultr'),
    path.join(rootDir, 'projects', 'vaultr'),
  ];

  for (const dir of dirs) {
    const htmlPath = path.join(dir, 'index.html');
    const assetsDir = path.join(dir, 'assets');
    assert.ok(fs.existsSync(htmlPath), `${htmlPath} must exist`);
    assert.ok(fs.existsSync(assetsDir), `${assetsDir} must exist`);

    const html = fs.readFileSync(htmlPath, 'utf-8');
    assert.ok(html.includes('./assets/index-DEaGAN5o.js'), `${htmlPath} must reference ./assets/index-DEaGAN5o.js`);
    assert.ok(html.includes('./assets/index-BSnecMdg.css'), `${htmlPath} must reference ./assets/index-BSnecMdg.css`);
    assert.ok(!html.includes('"/assets/'), `${htmlPath} must not leave root-relative /assets/ paths`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'index-DEaGAN5o.js')), `index-DEaGAN5o.js must exist in ${assetsDir}`);
    assert.ok(html.includes('close-modal'), `${htmlPath} must bridge Escape key to parent modal`);
    assert.ok(html.includes('user-select: none') && html.includes('contextmenu'), `${htmlPath} must include anti-copy protection`);
    assert.ok(html.includes('@media print'), `${htmlPath} must include print-hide protection`);
  }
});

test('WorkGrid.tsx, CaseStudyModal.tsx, and index.html replace AI Expense Tracker with VAULTR', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(workGrid.includes('title: "VAULTR"'), 'WorkGrid.tsx must list VAULTR for project 7');
  assert.ok(modal.includes('/projects/vaultr/index.html'), 'CaseStudyModal.tsx must embed /projects/vaultr/index.html');
  assert.ok(modal.includes('// import ExpenseTrackerPreview'), 'CaseStudyModal.tsx must comment out ExpenseTrackerPreview import');
  assert.ok(indexHtml.includes('projects/vaultr/index.html') && indexHtml.includes('VAULTR'), 'index.html must replace Expense Tracker with VAULTR');
});

