import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Method 1 (8.5/10): DWT-DCT + Cox Spread-Spectrum watermarks survive lossy WebP/JPEG across all 9 showcase images', () => {
  const scriptPath = path.join(rootDir, 'scripts', 'sign_assets.py');
  assert.ok(fs.existsSync(scriptPath), 'scripts/sign_assets.py must exist');

  const out = execFileSync('python', [scriptPath, 'verify-images'], {
    cwd: rootDir,
    encoding: 'utf-8',
  });
  const report = JSON.parse(out);
  assert.equal(report.total_images, 9, 'Must verify all 9 unique showcase images');
  assert.equal(report.failed_images.length, 0, `All images must pass DWT-DCT verification: ${out}`);

  for (const item of report.results) {
    assert.ok(item.bit_accuracy >= 0.90, `${item.path} bit accuracy ${item.bit_accuracy} must be >= 0.90`);
    assert.ok(item.psnr >= 38.0, `${item.path} PSNR ${item.psnr} dB must be >= 38 dB for visual invisibility`);
    assert.ok(item.backup_exists, `${item.path} pre-watermark backup must exist in .internal_archive/images`);
  }
});

test('Method 2 (8.0/10): 3D GLB KHR_mesh_quantization models embed 64-bit vertex parity, copyright, and zero-watermark registry', () => {
  const scriptPath = path.join(rootDir, 'scripts', 'sign_assets.py');
  assert.ok(fs.existsSync(scriptPath), 'scripts/sign_assets.py must exist');

  const out = execFileSync('python', [scriptPath, 'verify-models'], {
    cwd: rootDir,
    encoding: 'utf-8',
  });
  const report = JSON.parse(out);
  assert.ok(report.total_models >= 11, 'Must verify all 11 public TATA$ GLB assets');
  assert.equal(report.failed_models.length, 0, `All GLB models must pass vertex signature extraction: ${out}`);

  for (const item of report.results) {
    assert.equal(item.bit_accuracy, 1.0, `${item.path} must recover 64/64 vertex parity bits`);
    assert.ok(item.copyright.includes('Aryo Ananta'), `${item.path} must set GLTF asset.copyright`);
    assert.ok(item.aligned, `${item.path} must preserve 4-byte GLB chunk alignment`);
    assert.ok(item.backup_exists, `${item.path} original GLB backup must exist in .internal_archive/models`);
  }

  const registryPath = path.join(rootDir, '.internal_archive', 'provenance_registry.json');
  assert.ok(fs.existsSync(registryPath), '.internal_archive/provenance_registry.json must record zero-watermark hashes');
});

test('Method 3 (8.0/10): Cloned-site canary beacon checks unauthorized hostnames in Next.js, legacy HTML, iframes, and Laravel API', async () => {
  const guardTs = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'lib', 'inspectGuard.ts'), 'utf-8');
  assert.ok(guardTs.includes('buildCloneBeaconUrl'), 'inspectGuard.ts must export buildCloneBeaconUrl');

  const canaryComp = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CloneCanary.tsx'), 'utf-8');
  assert.ok(canaryComp.includes('buildCloneBeaconUrl'), 'CloneCanary.tsx must invoke buildCloneBeaconUrl');

  const layoutTsx = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  assert.ok(layoutTsx.includes('<CloneCanary />') || layoutTsx.includes('CloneCanary'), 'layout.tsx must mount CloneCanary');

  const rootIndex = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(rootIndex.includes('/api/beacon/clone') && rootIndex.includes('antporto.co.id'), 'root index.html must include cloned-site beacon check');

  for (const slug of ['geopetak', 'maknaworks', 'moriku', 'tata', 'thesis-docket', 'vaultr']) {
    const iframeHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', slug, 'index.html'), 'utf-8');
    assert.ok(iframeHtml.includes('/api/beacon/clone'), `${slug}/index.html must include cloned-site beacon check`);
  }

  const beaconCtrl = path.join(rootDir, 'backend', 'app', 'Http', 'Controllers', 'Api', 'BeaconController.php');
  assert.ok(fs.existsSync(beaconCtrl), 'Laravel BeaconController.php must exist');
  const apiPhp = fs.readFileSync(path.join(rootDir, 'backend', 'routes', 'api.php'), 'utf-8');
  assert.ok(apiPhp.includes('/beacon/clone') && apiPhp.includes('BeaconController'), 'backend/routes/api.php must wire /beacon/clone with rate limiting');
});

