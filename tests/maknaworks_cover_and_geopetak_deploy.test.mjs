import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('MaknaWorks ERP cover uses TATA$ style with optimized lazy WebP under 150 KB', () => {
  const webp = path.join(rootDir, 'frontend', 'public', 'images', 'maknaworks-cover.webp');
  assert.ok(fs.existsSync(webp), 'frontend/public/images/maknaworks-cover.webp must exist');
  assert.ok(fs.statSync(webp).size < 150 * 1024, 'maknaworks-cover.webp must be under 150 KB');

  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  assert.ok(workGrid.includes('/images/maknaworks-cover.webp'), 'WorkGrid.tsx must reference /images/maknaworks-cover.webp');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('images/maknaworks-cover.webp'), 'index.html card 05 must reference images/maknaworks-cover.webp');
});

test('Actual compiled Geopetak landing page is deployed in public and root projects', () => {
  const dirs = [
    path.join(rootDir, 'frontend', 'public', 'projects', 'geopetak'),
    path.join(rootDir, 'projects', 'geopetak'),
  ];

  for (const dir of dirs) {
    const htmlPath = path.join(dir, 'index.html');
    const assetsDir = path.join(dir, 'assets');
    assert.ok(fs.existsSync(htmlPath), `${htmlPath} must exist`);
    assert.ok(fs.existsSync(assetsDir), `${assetsDir} must exist`);

    const html = fs.readFileSync(htmlPath, 'utf-8');
    assert.ok(html.includes('./assets/index-zd3DEfeL.js'), `${htmlPath} must reference ./assets/index-zd3DEfeL.js`);
    assert.ok(!html.includes('"/assets/'), `${htmlPath} must not leave root-relative /assets/ paths`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'index-zd3DEfeL.js')), `index-zd3DEfeL.js must exist in ${assetsDir}`);
    assert.ok(html.includes('close-modal'), `${htmlPath} must bridge Escape key to parent modal`);
    assert.ok(html.includes('user-select: none') && html.includes('contextmenu'), `${htmlPath} must include anti-copy protection`);
    assert.ok(html.includes('@media print'), `${htmlPath} must include print-hide protection`);
  }
});

test('CaseStudyModal.tsx and index.html embed real Geopetak landing page for project 6', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(modal.includes('/projects/geopetak/index.html'), 'CaseStudyModal.tsx must embed /projects/geopetak/index.html');
  assert.ok(modal.includes('// import GeopetakPreview'), 'CaseStudyModal.tsx must comment out GeopetakPreview import');
  assert.ok(indexHtml.includes('projects/geopetak/index.html'), 'index.html must link Geopetak to projects/geopetak/index.html');
});

