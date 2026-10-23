import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('globals.css defines [data-theme="light"] palette with warm linen & oxblood tokens', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(cssPath), 'globals.css must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('[data-theme="light"]'), 'Must define [data-theme="light"] selector');
  assert.ok(css.toLowerCase().includes('--bg: #f7f4ee') || css.toLowerCase().includes('--bg:#f7f4ee'), 'Must define warm linen background');
  assert.ok(css.toLowerCase().includes('--text: #161615') || css.toLowerCase().includes('--text:#161615'), 'Must define charcoal ink primary text');
  assert.ok(css.toLowerCase().includes('--accent: #851726') || css.toLowerCase().includes('--accent:#851726'), 'Must define oxblood accent');
  assert.ok(css.includes('--s1:') && css.includes('--s2:') && css.includes('--s3:'), 'Must define surface elevation tokens in light theme');
});

test('layout.tsx contains anti-FOUC inline blocking script for theme initialization', () => {
  const layoutPath = path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf-8');

  assert.ok(content.includes('portfolio-theme') || content.includes('data-theme'), 'Must read theme from localStorage');
  assert.ok(content.includes('dangerouslySetInnerHTML'), 'Must inject synchronous inline script');
});

test('Nav.tsx includes accessible Sun/Moon theme toggle button', () => {
  const navPath = path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx');
  const content = fs.readFileSync(navPath, 'utf-8');

  assert.ok(content.includes('theme-toggle') || content.includes('aria-label="Toggle theme"'), 'Must have theme toggle button');
  assert.ok(content.includes('toggleTheme') || content.includes('setTheme'), 'Must have theme toggle function');
});

test('CaseStudyModal.tsx uses theme semantic tokens instead of hardcoded pitch black', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  const content = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(!content.includes('bg-[#0a0a0b]'), 'Must replace hardcoded bg-[#0a0a0b] with theme-aware class or CSS variable');
});

test('HeroTelemetryHUD.tsx contains theme-aware palette configuration', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');

  assert.ok(content.includes('data-theme') || content.includes('isLight') || content.includes('theme'), 'Canvas HUD must detect or receive theme');
});

test('Selected Work preview components eliminate hardcoded dark hex backgrounds in favor of semantic CSS tokens', () => {
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');
  const dnpContent = fs.readFileSync(dnpPath, 'utf-8');
  assert.ok(!dnpContent.includes('#0b0c0d'), 'DNPMonitorPreview must not hardcode #0b0c0d');
  assert.ok(!dnpContent.includes('#121315'), 'DNPMonitorPreview must not hardcode #121315');

  const docketPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'AcademicDocketPreview.tsx');
  const docketContent = fs.readFileSync(docketPath, 'utf-8');
  assert.ok(!docketContent.includes('#0e0e0e'), 'AcademicDocketPreview must not hardcode #0e0e0e');

  const expensePath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ExpenseTrackerPreview.tsx');
  const expenseContent = fs.readFileSync(expensePath, 'utf-8');
  assert.ok(!expenseContent.includes('#0a0b0c'), 'ExpenseTrackerPreview must not hardcode #0a0b0c');

  const maknaPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaknaMoodboardPreview.tsx');
  const maknaContent = fs.readFileSync(maknaPath, 'utf-8');
  assert.ok(!maknaContent.includes('#0a0a0a'), 'MaknaMoodboardPreview must not hardcode #0a0a0a');
  assert.ok(!maknaContent.includes('#0b0c0d'), 'MaknaMoodboardPreview must not hardcode #0b0c0d');

  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  assert.ok(!cssContent.includes('background: #0d0d0d;'), 'globals.css must not have hardcoded background: #0d0d0d for hd-preview or et-preview');
  assert.ok(cssContent.includes('.hd-preview') && cssContent.includes('background: var(--s2)'), 'HelpdeskPreview must use var(--s2)');
  assert.ok(cssContent.includes('[data-theme="light"] .tata-bg'), 'Tata preview must have light theme background adaptation');
});

