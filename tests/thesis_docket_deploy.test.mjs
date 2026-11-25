import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Actual compiled Academic Thesis Docket app is deployed in public and root projects', () => {
  const dirs = [
    path.join(rootDir, 'frontend', 'public', 'projects', 'thesis-docket'),
    path.join(rootDir, 'projects', 'thesis-docket'),
  ];

  for (const dir of dirs) {
    const htmlPath = path.join(dir, 'index.html');
    const assetsDir = path.join(dir, 'assets');
    assert.ok(fs.existsSync(htmlPath), `${htmlPath} must exist`);
    assert.ok(fs.existsSync(assetsDir), `${assetsDir} must exist`);

    const html = fs.readFileSync(htmlPath, 'utf-8');
    assert.ok(html.includes('./assets/index-CQMAcOPm.js'), `${htmlPath} must reference ./assets/index-CQMAcOPm.js`);
    assert.ok(html.includes('./assets/index-BwnNCErF.css'), `${htmlPath} must reference ./assets/index-BwnNCErF.css`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'index-CQMAcOPm.js')), `index-CQMAcOPm.js must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'index-BwnNCErF.css')), `index-BwnNCErF.css must exist in ${assetsDir}`);
    assert.ok(html.includes('close-modal'), `${htmlPath} must bridge Escape key to parent modal`);
    assert.ok(html.includes('upi_academic_session_user'), `${htmlPath} must seed default session when unset`);
    assert.ok(html.includes('user-select: none') && html.includes('contextmenu'), `${htmlPath} must include anti-copy protection`);
    assert.ok(html.includes('@media print'), `${htmlPath} must include print-hide protection`);
  }
});

test('CaseStudyModal.tsx and index.html embed real Thesis Docket iframe for project 4', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(modal.includes('/projects/thesis-docket/index.html'), 'CaseStudyModal.tsx must embed /projects/thesis-docket/index.html');
  assert.ok(modal.includes('// import AcademicDocketPreview'), 'CaseStudyModal.tsx must comment out AcademicDocketPreview import');
  assert.ok(indexHtml.includes('projects/thesis-docket/index.html'), 'index.html must link Academic Thesis Docket to projects/thesis-docket/index.html');
});

