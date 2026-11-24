import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Hero.tsx embeds HeroWireframeCanvas and purges HeroTelemetryHUD and HeroExecutiveSpecimen', () => {
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');

  assert.ok(
    heroContent.includes('HeroWireframeCanvas'),
    'Hero.tsx must import and embed HeroWireframeCanvas'
  );
  assert.ok(
    !heroContent.includes('HeroTelemetryHUD'),
    'Hero.tsx must not embed the old HeroTelemetryHUD'
  );
  assert.ok(
    !heroContent.includes('HeroExecutiveSpecimen'),
    'Hero.tsx must not embed HeroExecutiveSpecimen'
  );
});

test('HeroWireframeCanvas.tsx renders moving Three.js wireframe <canvas> cleanly without boxes or metrics', () => {
  const canvasPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroWireframeCanvas.tsx');
  assert.ok(fs.existsSync(canvasPath), 'HeroWireframeCanvas.tsx must exist');

  const content = fs.readFileSync(canvasPath, 'utf-8');
  assert.ok(content.includes('three'), 'HeroWireframeCanvas must use Three.js');
  assert.ok(content.includes('requestAnimationFrame'), 'HeroWireframeCanvas must animate smoothly');
  assert.ok(content.includes('<canvas'), 'HeroWireframeCanvas must render a <canvas>');
  assert.ok(!content.includes('350+') && !content.includes('SLA'), 'HeroWireframeCanvas must contain zero metric clutter');
});

test('index.html .hero-right renders moving 3D wireframe canvas with zero metric clutter', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(indexContent.includes('hero-right'), 'index.html must define .hero-right');
  assert.ok(indexContent.includes('heroWireframeCanvas'), 'index.html must include heroWireframeCanvas');
  assert.ok(!indexContent.includes('CORE ARCHITECTURE FOCUS'), 'index.html must not contain 3-column bottom bar');
});
