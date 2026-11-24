import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Sitemap and robots endpoints exist across Next.js and static root', () => {
  const nextSitemap = path.join(rootDir, 'frontend', 'src', 'app', 'sitemap.ts');
  const nextRobots = path.join(rootDir, 'frontend', 'src', 'app', 'robots.ts');
  const rootSitemap = path.join(rootDir, 'sitemap.xml');
  const rootRobots = path.join(rootDir, 'robots.txt');
  const publicSitemap = path.join(rootDir, 'frontend', 'public', 'sitemap.xml');
  const publicRobots = path.join(rootDir, 'frontend', 'public', 'robots.txt');

  assert.ok(fs.existsSync(nextSitemap), 'frontend/src/app/sitemap.ts must exist');
  assert.ok(fs.existsSync(nextRobots), 'frontend/src/app/robots.ts must exist');
  assert.ok(fs.existsSync(rootSitemap), 'root sitemap.xml must exist');
  assert.ok(fs.existsSync(rootRobots), 'root robots.txt must exist');
  assert.ok(fs.existsSync(publicSitemap), 'frontend/public/sitemap.xml must exist');
  assert.ok(fs.existsSync(publicRobots), 'frontend/public/robots.txt must exist');

  const robotsContent = fs.readFileSync(rootRobots, 'utf-8');
  assert.ok(robotsContent.includes('Sitemap: https://antporto.co.id/sitemap.xml'), 'robots.txt must declare sitemap URL');
});

test('Criterion 2: Schema.org JSON-LD structured data is embedded in layout.tsx and index.html', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(layout.includes('application/ld+json'), 'layout.tsx must embed ld+json script');
  assert.ok(layout.includes('https://schema.org'), 'layout.tsx must specify schema.org context');
  assert.ok(layout.includes("Rifa'i Aryo Ananta"), 'layout.tsx schema must identify author');

  assert.ok(index.includes('application/ld+json'), 'index.html must embed ld+json script');
  assert.ok(index.includes('https://schema.org'), 'index.html must specify schema.org context');
  assert.ok(index.includes("Rifa'i Aryo Ananta"), 'index.html schema must identify author');
});

test('Criterion 3: Canonical URLs reference https://antporto.co.id in layout.tsx and index.html', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(layout.includes('canonical'), 'layout.tsx metadata must configure canonical alternate');
  assert.ok(index.includes('<link rel="canonical" href="https://antporto.co.id">'), 'index.html must contain canonical link tag');
});

test('Criterion 4: Web Application Manifest exists and is linked in layout.tsx and index.html', () => {
  const publicManifest = path.join(rootDir, 'frontend', 'public', 'manifest.webmanifest');
  const rootManifest = path.join(rootDir, 'manifest.webmanifest');
  assert.ok(fs.existsSync(publicManifest), 'frontend/public/manifest.webmanifest must exist');
  assert.ok(fs.existsSync(rootManifest), 'root manifest.webmanifest must exist');

  const layout = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(layout.includes('manifest.webmanifest'), 'layout.tsx must link manifest');
  assert.ok(index.includes('rel="manifest" href="manifest.webmanifest"'), 'index.html must link manifest');
});

test('Criterion 5: Apple touch icon references apple-touch-icon.png in layout.tsx and index.html', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(layout.includes('apple-touch-icon.png'), 'layout.tsx must point apple icon to png');
  assert.ok(index.includes('<link rel="apple-touch-icon" href="apple-touch-icon.png">'), 'index.html must point apple-touch-icon to png');
});

test('Criterion 6: Theme color is configured as #800020 across layout.tsx viewport and index.html', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(layout.includes('#800020') || layout.includes('themeColor'), 'layout.tsx must export themeColor viewport');
  assert.ok(index.includes('<meta name="theme-color" content="#800020">'), 'index.html must contain theme-color meta tag');
});

test('Criterion 7: Bespoke architectural 404 page exists at frontend/src/app/not-found.tsx and root 404.html', () => {
  const nextNotFound = path.join(rootDir, 'frontend', 'src', 'app', 'not-found.tsx');
  const root404 = path.join(rootDir, '404.html');

  assert.ok(fs.existsSync(nextNotFound), 'frontend/src/app/not-found.tsx must exist');
  assert.ok(fs.existsSync(root404), 'root 404.html must exist');

  const nextContent = fs.readFileSync(nextNotFound, 'utf-8');
  const rootContent = fs.readFileSync(root404, 'utf-8');

  assert.ok(nextContent.includes('404'), 'not-found.tsx must display 404');
  assert.ok(rootContent.includes('404'), '404.html must display 404');
});

test('Criterion 8: prefers-reduced-motion media query is implemented in index.html', () => {
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(index.includes('prefers-reduced-motion: reduce'), 'index.html must include prefers-reduced-motion: reduce rules');
});

test('Criterion 9: Capabilities nav link is consistently labeled Disciplines in Nav.tsx and index.html', () => {
  const nav = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(nav.includes('href="#disciplines"'), 'Nav.tsx must link to #disciplines');
  assert.ok(nav.includes('>Disciplines<'), 'Nav.tsx must display Disciplines');
  assert.ok(index.includes('href="#disciplines">Disciplines</a>'), 'index.html nav must display Disciplines');
  assert.ok(!index.includes('href="#disciplines">Skills</a>'), 'index.html must not use outdated Skills label');
});

test('Criterion 10: About avatar uses absolute /images/aryo.png with Rifa\'i Aryo Ananta alt text', () => {
  const about = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'About.tsx'), 'utf-8');
  assert.ok(about.includes('src="/images/aryo.png"'), 'About.tsx must use absolute image path /images/aryo.png');
  assert.ok(about.includes('alt="Rifa\'i Aryo Ananta"'), 'About.tsx alt must be Rifa\'i Aryo Ananta');
});

test('Criterion 11: Nav logo triggers smooth scroll to top instead of abrupt # hash jump', () => {
  const nav = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx'), 'utf-8');
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(nav.includes('scrollTo') || nav.includes('scrollToTop'), 'Nav.tsx logo must support smooth scrolling to top');
  assert.ok(index.includes('scrollToTop') || index.includes('window.scrollTo'), 'index.html logo must support smooth scrolling to top');
});

