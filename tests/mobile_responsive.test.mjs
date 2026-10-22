import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('globals.css defines comprehensive mobile media queries for <= 768px', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(cssPath), 'globals.css must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('@media (max-width: 768px)') || css.includes('@media (max-width:768px)'), 'Must define @media (max-width: 768px)');
});

test('globals.css collapses hero-body to 1 column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);
  assert.ok(mobileContent.includes('.hero-body') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('grid-template-columns:1fr') || mobileContent.includes('flex-direction: column')), 'Hero body must collapse to single column');
});

test('globals.css collapses work-grid and work-grid--8 to single column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);
  assert.ok(mobileContent.includes('.work-grid') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('flex-direction: column')), 'Work grid must collapse to 1fr or column');
  assert.ok(mobileContent.includes('.wc'), 'Work grid cards must unhook desktop grid-column/grid-row coordinate pinning');
});

test('globals.css collapses about and contact sections to single column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);
  assert.ok(mobileContent.includes('.about') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('display: flex')), 'About section must collapse');
  assert.ok(mobileContent.includes('.contact') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('display: flex')), 'Contact section must collapse');
});

test('globals.css suppresses custom desktop cursor on touch/mobile devices', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('#cur') && (css.includes('display: none') || css.includes('opacity: 0')), 'Custom cursor must be hidden on mobile/touch');
});

test('Nav.tsx implements responsive mobile menu or compact mobile layout', () => {
  const navPath = path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx');
  const content = fs.readFileSync(navPath, 'utf-8');

  assert.ok(content.includes('nav-links') && (content.includes('hidden') || content.includes('md:flex') || content.includes('mobile-menu') || content.includes('nav-menu-btn') || content.includes('nav-links-mobile')), 'Nav must adapt for mobile viewports');
});
