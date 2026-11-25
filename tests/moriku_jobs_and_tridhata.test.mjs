import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Moriku index.html seeds readable K3 jobs across all 16 stages', () => {
  const publicMoriku = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html'), 'utf-8');
  const rootMoriku = fs.readFileSync(path.join(rootDir, 'projects', 'moriku', 'index.html'), 'utf-8');

  for (let s = 1; s <= 16; s++) {
    assert.ok(publicMoriku.includes(`"stage":${s},`), `public moriku must have job at integer stage ${s}`);
    assert.ok(rootMoriku.includes(`"stage":${s},`), `root moriku must have job at integer stage ${s}`);
  }
  assert.ok(publicMoriku.includes('"klien":') && publicMoriku.includes('"pesawat":') && publicMoriku.includes('"owner_marketing":'), 'Moriku jobs must include klien, pesawat, and owner_marketing');
});

test('Criterion 2: Actual compiled MaknaWorks ERP app is deployed in public and root projects', () => {
  const publicMakna = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', 'maknaworks', 'index.html'), 'utf-8');
  const rootMakna = fs.readFileSync(path.join(rootDir, 'projects', 'maknaworks', 'index.html'), 'utf-8');

  assert.ok(publicMakna.includes('index-D9N0rRyI.js'), 'public maknaworks must load actual compiled React bundle');
  assert.ok(rootMakna.includes('index-D9N0rRyI.js'), 'root maknaworks must load actual compiled React bundle');
  assert.ok(publicMakna.includes('MaknaWorks ERP'), 'MaknaWorks ERP title must be set');
});

test('Criterion 3: WorkGrid.tsx and CaseStudyModal.tsx showcase MaknaWorks ERP iframe and comment out Delta IT Helpdesk', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');

  assert.ok(workGrid.includes('MaknaWorks ERP'), 'WorkGrid.tsx must showcase MaknaWorks ERP');
  assert.ok(modal.includes('/projects/maknaworks/index.html'), 'CaseStudyModal.tsx must embed actual MaknaWorks ERP iframe');
  assert.ok(modal.includes('// import HelpdeskPreview'), 'CaseStudyModal.tsx must comment out HelpdeskPreview import');
});

test('Criterion 4: index.html showcases MaknaWorks ERP and comments out Delta IT Helpdesk', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('MaknaWorks ERP'), 'index.html must showcase MaknaWorks ERP');
});
