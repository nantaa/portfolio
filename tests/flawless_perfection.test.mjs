import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('All year stamps across Hero, About, Footer, and index.html consistently display 2026', () => {
  const aboutPath = path.join(rootDir, 'frontend', 'src', 'components', 'About.tsx');
  const footerPath = path.join(rootDir, 'frontend', 'src', 'components', 'Footer.tsx');
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const indexPath = path.join(rootDir, 'index.html');

  const aboutContent = fs.readFileSync(aboutPath, 'utf-8');
  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Hero must display 2026
  assert.ok(heroContent.includes('Portfolio — 2026'), 'Hero.tsx must display Portfolio — 2026');

  // About must display 2026
  assert.ok(aboutContent.includes('Bekasi, Indonesia — 2026'), 'About.tsx must display Bekasi, Indonesia — 2026');
  assert.ok(!aboutContent.includes('Bekasi, Indonesia — 2025'), 'About.tsx must purge 2025 stamp');

  // Footer must display 2026
  assert.ok(footerContent.includes('Bekasi 2026'), 'Footer.tsx must display Bekasi 2026');
  assert.ok(footerContent.includes('Portfolio Aryo © 2026'), 'Footer.tsx must display Portfolio Aryo © 2026');
  assert.ok(!footerContent.includes('2025'), 'Footer.tsx must purge 2025 stamp');

  // index.html must display 2026
  assert.ok(indexContent.includes('Portfolio — 2026'), 'index.html hero strip must display Portfolio — 2026');
  assert.ok(indexContent.includes('Bekasi, Indonesia — 2026'), 'index.html about must display Bekasi, Indonesia — 2026');
  assert.ok(indexContent.includes('Portfolio Aryo © 2026'), 'index.html footer must display Portfolio Aryo © 2026');
  assert.ok(!indexContent.includes('Portfolio — 2025'), 'index.html must purge Portfolio — 2025');
});

test('layout.tsx defines comprehensive Open Graph and Twitter card metadata', () => {
  const layoutPath = path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf-8');

  assert.ok(content.includes('metadataBase'), 'layout.tsx must define metadataBase URL');
  assert.ok(content.includes('openGraph'), 'layout.tsx must define openGraph metadata object');
  assert.ok(content.includes('twitter'), 'layout.tsx must define twitter metadata object');
  assert.ok(content.includes('https://antporto.co.id'), 'layout.tsx must include canonical production domain');
});

test('index.html includes complete Open Graph and Twitter meta tags matching layout.tsx', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(content.includes('property="og:title"'), 'index.html must include og:title');
  assert.ok(content.includes('property="og:description"'), 'index.html must include og:description');
  assert.ok(content.includes('property="og:url"'), 'index.html must include og:url');
  assert.ok(content.includes('name="twitter:card"'), 'index.html must include twitter:card');
  assert.ok(content.includes('name="twitter:title"'), 'index.html must include twitter:title');
});

test('WorkGrid.tsx project cards support Enter key accessibility on container elements', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  // Verify container card accessibility
  assert.ok(content.includes('tabIndex={0}'), 'WorkGrid.tsx cards must be keyboard focusable via tabIndex={0}');
  assert.ok(content.includes('onKeyDown'), 'WorkGrid.tsx cards must support onKeyDown keyboard events');
  assert.ok(content.includes('role="article"') || content.includes('role="region"'), 'WorkGrid.tsx cards must declare semantic role');
});

