import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Perf 1: Optimized WebP display assets exist below strict KB budgets without overwriting originals', () => {
  const budgets = [
    { rel: 'frontend/public/images/geopetak-cover.webp', maxBytes: 100 * 1024 },
    { rel: 'frontend/public/images/tata-cover.webp', maxBytes: 70 * 1024 },
    { rel: 'frontend/public/images/aryo.webp', maxBytes: 70 * 1024 },
    { rel: 'frontend/public/images/logo-nav.webp', maxBytes: 10 * 1024 },
    { rel: 'frontend/public/images/noise-tile.png', maxBytes: 8 * 1024 },
  ];

  for (const item of budgets) {
    const abs = path.join(rootDir, item.rel);
    assert.ok(fs.existsSync(abs), `${item.rel} must exist`);
    const size = fs.statSync(abs).size;
    assert.ok(
      size <= item.maxBytes,
      `${item.rel} (${size} B) exceeds budget ${item.maxBytes} B`
    );
  }

  // Protected originals must stay untouched for watermarking & provenance checks
  assert.ok(
    fs.existsSync(path.join(rootDir, 'frontend', 'public', 'images', 'projects', 'bekasi_saturated.jpg')),
    'bekasi_saturated.jpg must stay intact'
  );
  assert.ok(
    fs.existsSync(path.join(rootDir, 'frontend', 'public', 'images', 'aryo.png')),
    'aryo.png must stay intact'
  );
  assert.ok(
    fs.existsSync(path.join(rootDir, 'frontend', 'public', 'logo-svg.svg')),
    'logo-svg.svg must stay intact'
  );
});

test('Perf 2: Nav, About, and WorkGrid use optimized WebP covers with lazy/async loading hints', () => {
  const nav = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx'), 'utf-8');
  const about = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'About.tsx'), 'utf-8');
  const grid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');

  assert.ok(nav.includes('/images/logo-nav.webp'), 'Nav must use lightweight /images/logo-nav.webp icon');
  assert.ok(!nav.includes('src="/logo-svg.svg"'), 'Nav must not ship 364 KB /logo-svg.svg for a 26px icon');

  assert.ok(about.includes('<picture>') && about.includes('/images/aryo.webp'), 'About must serve /images/aryo.webp via <picture>');
  assert.ok(about.includes('loading="lazy"') && about.includes('decoding="async"'), 'About portrait must lazy-load and decode async');
  assert.ok(about.includes('width={624}') && about.includes('height={936}'), 'About portrait must set explicit dimensions');

  assert.ok(grid.includes('/images/tata-cover.webp'), 'WorkGrid Card 03 must use /images/tata-cover.webp');
  assert.ok(!grid.includes('/projects/tata/cards/1.png'), 'WorkGrid Card 03 must drop unoptimized 1.png');
  assert.ok(grid.includes('/images/geopetak-cover.webp'), 'WorkGrid Card 06 must use /images/geopetak-cover.webp');
  assert.ok(!grid.includes('/images/projects/bekasi_saturated.jpg'), 'WorkGrid Card 06 must drop 2.1 MB bekasi_saturated.jpg');
});

test('Perf 3: Hero defers HeroPaperClock dynamically and WebGL loop pauses/throttles cleanly', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  const clock = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'HeroPaperClock.tsx'), 'utf-8');

  assert.ok(hero.includes('next/dynamic') && hero.includes('ssr: false'), 'Hero must dynamically import HeroPaperClock with ssr: false');

  assert.ok(clock.includes('visibilitychange') && clock.includes('document.hidden'), 'HeroPaperClock must pause RAF when document.hidden');
  assert.ok(clock.includes('IntersectionObserver'), 'HeroPaperClock must observe slot visibility via IntersectionObserver');
  assert.ok(clock.includes('viewportW < 768 ? 1.5 : 2'), 'HeroPaperClock must cap mobile pixel ratio at 1.5');
  assert.ok(clock.includes('prefersReducedMotion') && !clock.includes('if (prefersReducedMotion) {\n        pads.forEach'), 'prefers-reduced-motion branch must render once without spinning RAF');

  // Ensure syncClockSlot is not forced inside every animate() tick
  const animateSlice = clock.slice(clock.indexOf('const animate ='), clock.indexOf('rafId = requestAnimationFrame(animate);'));
  assert.ok(!animateSlice.includes('syncClockSlot()'), 'animate() must not call getBoundingClientRect()-based syncClockSlot() every frame');
});

test('Perf 4: globals.css replaces live feTurbulence filter and sets content-visibility on offscreen sections', () => {
  const css = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');

  assert.ok(!css.includes('feTurbulence'), 'globals.css must remove runtime SVG feTurbulence filter from body::after');
  assert.ok(css.includes('/images/noise-tile.png'), 'globals.css must use pre-baked static /images/noise-tile.png');
  assert.ok(css.includes('content-visibility: auto'), 'globals.css must apply content-visibility: auto to offscreen sections');
});

test('Veil 5: CaseStudyModal catches iframe blur via document.hasFocus(), keyup PrintScreen, and Meta+Shift before OS capture', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');

  assert.ok(!modal.includes('if (activeTag === "IFRAME") return;'), 'Must remove unconditional activeTag === IFRAME blur bypass');
  assert.ok(modal.includes('document.hasFocus()'), 'Must distinguish iframe interaction vs leaving browser window via document.hasFocus()');
  assert.ok(modal.includes('"keyup"') && modal.includes('handleKeyUp'), 'Must hook capture-phase keyup for PrintScreen delivery timing');
  assert.ok(modal.includes('e.shiftKey') && modal.includes('Meta'), 'Must preemptively veil when Meta+Shift shortcut begins');
  assert.ok(modal.includes('contentWindow'), 'Must attach listeners onto same-origin preview iframe contentWindow');
});

