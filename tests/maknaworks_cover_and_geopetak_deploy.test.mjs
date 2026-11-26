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
    const jsMatch = html.match(/src="\.\/assets\/(index-[^"]+\.js)"/);
    const cssMatch = html.match(/href="\.\/assets\/(index-[^"]+\.css)"/);
    assert.ok(jsMatch, `${htmlPath} must reference relative ./assets/index-*.js bundle`);
    assert.ok(cssMatch, `${htmlPath} must reference relative ./assets/index-*.css bundle`);
    assert.ok(!html.includes('"/assets/'), `${htmlPath} must not leave root-relative /assets/ paths`);

    const bundleJsPath = path.join(assetsDir, jsMatch[1]);
    const bundleCssPath = path.join(assetsDir, cssMatch[1]);
    assert.ok(fs.existsSync(bundleJsPath), `${bundleJsPath} must exist`);
    assert.ok(fs.existsSync(bundleCssPath), `${bundleCssPath} must exist`);

    const assetEntries = fs.readdirSync(assetsDir);
    const badNames = assetEntries.filter((n) => n.includes('%2F') || n.includes('%2C') || n.includes('%20'));
    assert.deepEqual(badNames, [], `${assetsDir} must contain zero percent-encoded asset names`);

    assert.ok(fs.existsSync(path.join(assetsDir, 'geopetak-logo.svg')), `geopetak-logo.svg must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'geopetak-footer-logo.svg')), `geopetak-footer-logo.svg must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'geopetak-icon.svg')), `geopetak-icon.svg must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'bekasi_saturated.jpg')), `bekasi_saturated.jpg must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'bekasi_xray.jpg')), `bekasi_xray.jpg must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, 'bekasi_mesh.jpg')), `bekasi_mesh.jpg must exist in ${assetsDir}`);

    const js = fs.readFileSync(bundleJsPath, 'utf-8');
    assert.ok(js.includes('bekasi_saturated.jpg') && js.includes('bekasi_xray.jpg') && js.includes('bekasi_mesh.jpg'), `compiled bundle in ${assetsDir} must wire all 3 Bekasi randomizer layers`);
    assert.ok(!/cdn\.prod\.website-files\.com/i.test(js), `compiled bundle in ${assetsDir} must localize all CDN assets`);
    assert.ok(!/415 mission street|980 Peralta|hello@geolava/i.test(js), `compiled bundle in ${assetsDir} must remove legacy US/Geolava strings`);
    assert.ok(js.includes('Jakarta') && js.includes('Bekasi'), `compiled bundle in ${assetsDir} must include localized Jakarta & Bekasi context`);

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

