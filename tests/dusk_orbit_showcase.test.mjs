import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('dusk_orbit.html is a self-contained WebGL2 + 2D Canvas space flying toy with zero external assets', () => {
  const targets = [
    path.join(rootDir, 'frontend', 'public', 'dusk_orbit.html'),
    path.join(rootDir, 'dusk_orbit.html'),
  ];

  for (const file of targets) {
    assert.ok(fs.existsSync(file), `${file} must exist`);
    const html = fs.readFileSync(file, 'utf-8');

    assert.ok(!/<script[^>]+src=["']https?:/i.test(html), `${file} must have zero external script dependencies`);
    assert.ok(!/<link[^>]+href=["']https?:/i.test(html), `${file} must have zero external stylesheet/font links`);
    assert.ok(html.includes('Dusk Orbit') && html.includes('interceptor · megastation · long shadows'), `${file} must include title and subtitle`);
    assert.ok(html.includes('webgl2'), `${file} must use WebGL2`);
    assert.ok(html.includes('new Worker('), `${file} must generate megastation world in a Web Worker`);
    assert.ok(html.includes('Bringing the reactor up'), `${file} must show loading progress bar`);
    assert.ok(html.includes('Bayer') || html.includes('bayer'), `${file} must apply 4x4 Bayer dithering`);
    assert.ok(html.includes('AudioContext'), `${file} must synthesize audio via Web Audio API`);
    assert.ok(html.includes('Sound: off'), `${file} must include Sound: off toggle`);
    assert.ok(html.includes('prefers-reduced-motion'), `${file} must respect prefers-reduced-motion`);
    assert.ok(html.includes('close-modal'), `${file} must bridge Escape key to parent modal`);
    assert.ok(html.includes('user-select: none') && html.includes('contextmenu'), `${file} must include anti-copy protection`);
  }
});

test('MaterialStudiesCarousel, CaseStudyModal, and index.html wire 03 Dusk Orbit into 3D showcase', () => {
  const carousel = fs.readFileSync(
    path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaterialStudiesCarousel.tsx'),
    'utf-8'
  );
  const modal = fs.readFileSync(
    path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'),
    'utf-8'
  );
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(carousel.includes('/dusk_orbit.html'), 'MaterialStudiesCarousel must include /dusk_orbit.html');
  assert.ok(modal.includes('03 Dusk Orbit') && modal.includes('/dusk_orbit.html'), 'CaseStudyModal header must include 03 Dusk Orbit');
  assert.ok(indexHtml.includes('dusk_orbit.html'), 'index.html card 02 must link to dusk_orbit.html');
});

