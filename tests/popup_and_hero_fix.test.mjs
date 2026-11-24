import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Moriku index.html preserves real Inertia app with offline X-Inertia interceptor', () => {
  const publicMoriku = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html'), 'utf-8');
  const rootMoriku = fs.readFileSync(path.join(rootDir, 'projects', 'moriku', 'index.html'), 'utf-8');

  // Must preserve the real Inertia app bundle
  assert.ok(publicMoriku.includes('app-CLJ6yzA7.js'), 'public moriku must load real app-CLJ6yzA7.js');
  assert.ok(rootMoriku.includes('app-CLJ6yzA7.js'), 'root moriku must load real app-CLJ6yzA7.js');

  // Must intercept XHR/fetch to return synthetic X-Inertia JSON instead of loading /
  assert.ok(publicMoriku.includes('X-Inertia') && publicMoriku.includes('XMLHttpRequest.prototype'), 'public moriku must embed X-Inertia XHR/fetch interceptor');
  assert.ok(rootMoriku.includes('X-Inertia') && rootMoriku.includes('XMLHttpRequest.prototype'), 'root moriku must embed X-Inertia XHR/fetch interceptor');
});

test('Criterion 2: CaseStudyModal embeds Moriku iframe with cache-busting query string and sandbox', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  assert.ok(modal.includes('/projects/moriku/index.html?v=20261125'), 'CaseStudyModal must cache-bust Moriku iframe URL');
  assert.ok(modal.includes('sandbox='), 'CaseStudyModal must specify sandbox on iframes');
  assert.ok(!modal.includes('allow-top-navigation'), 'CaseStudyModal must not allow top-level navigation');
});

test('Criterion 3: Hero.tsx renders HeroWireframeCanvas and 2 CTA buttons without metric clutter', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  assert.ok(hero.includes('HeroWireframeCanvas'), 'Hero.tsx must embed HeroWireframeCanvas');
  assert.ok(hero.includes('View work'), 'Hero.tsx must include View work button');
  assert.ok(hero.includes('Curriculum Vitae'), 'Hero.tsx must include clean CV button');
  assert.ok(!hero.includes('HeroExecutiveSpecimen'), 'Hero.tsx must remove HeroExecutiveSpecimen bar');
  assert.ok(!hero.includes('350+') && !hero.includes('<2h SLA') && !hero.includes('60 FPS'), 'Hero.tsx must purge unnecessary metric clutter');
});

test('Criterion 4: Hero top padding is >= 96px in globals.css and index.html to prevent nav collision', () => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(globalsCss.includes('padding-top: 112px') || globalsCss.includes('padding-top: 96px'), 'globals.css must set hero top padding >= 96px');
  assert.ok(indexHtml.includes('padding-top: 112px') || indexHtml.includes('padding-top: 96px'), 'index.html must set hero top padding >= 96px');
});

test('Criterion 5: Hero purges 3-column bottom bar and unnecessary metrics in index.html', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(!indexHtml.includes('CORE ARCHITECTURE FOCUS'), 'index.html must purge bottom 3-column bar');
  assert.ok(indexHtml.includes('heroWireframeCanvas'), 'index.html must render moving 3D wireframe canvas in hero');
});
