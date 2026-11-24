import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('About.tsx and index.html remove unnecessary .a-stats metric counters', () => {
  const aboutPath = path.join(rootDir, 'frontend', 'src', 'components', 'About.tsx');
  const indexPath = path.join(rootDir, 'index.html');
  const about = fs.readFileSync(aboutPath, 'utf-8');
  const index = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(!about.includes('a-stats'), 'About.tsx must not render .a-stats');
  assert.ok(!about.includes('350+'), 'About.tsx must not contain 350+ counter');
  assert.ok(!about.includes('60 FPS'), 'About.tsx must not contain 60 FPS counter');
  assert.ok(!about.includes('SLA Pipeline Stages'), 'About.tsx must not contain SLA Pipeline Stages counter');

  assert.ok(!index.includes('<div class="a-stats">'), 'index.html must not render .a-stats HTML');
  assert.ok(!index.includes('350+'), 'index.html must not contain 350+ counter');
  assert.ok(!index.includes('SLA Pipeline Stages'), 'index.html must not contain SLA Pipeline Stages counter');
});

test('CaseStudyModal.tsx enforces anti-copy, anti-bot, print-hide, and focus-blur protections', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const modal = fs.readFileSync(modalPath, 'utf-8');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(!modal.includes('select-text'), 'CaseStudyModal.tsx must not enable select-text');
  assert.ok(modal.includes('select-none'), 'CaseStudyModal.tsx must disable text selection with select-none');
  assert.ok(modal.includes('case-modal-protected'), 'CaseStudyModal.tsx must mark root with case-modal-protected');
  assert.ok(modal.includes('data-nosnippet'), 'CaseStudyModal.tsx must include data-nosnippet against search/bot snippets');
  assert.ok(modal.includes('onCopy') && modal.includes('onCut') && modal.includes('onContextMenu') && modal.includes('onDragStart'), 'CaseStudyModal.tsx must block copy, cut, contextmenu, and dragstart');
  assert.ok(modal.includes('PrintScreen'), 'CaseStudyModal.tsx must intercept PrintScreen key');
  assert.ok(modal.includes('visibilitychange') && modal.includes('blur'), 'CaseStudyModal.tsx must blur/veil on window blur or tab switch');
  assert.ok(modal.includes('navigator.webdriver'), 'CaseStudyModal.tsx must detect automated webdriver bots');
  assert.ok(css.includes('@media print') && css.includes('case-modal-protected'), 'globals.css must hide case-modal-protected when printing');
});

test('index.html #caseModal enforces anti-copy, anti-bot, print-hide, and focus-blur protections', () => {
  const index = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(index.includes('case-modal-protected'), 'index.html #caseModal must have case-modal-protected class');
  assert.ok(index.includes('data-nosnippet'), 'index.html #caseModal must have data-nosnippet');
  assert.ok(index.includes('PrintScreen'), 'index.html must intercept PrintScreen when caseModal is open');
  assert.ok(index.includes('visibilitychange') && index.includes('caseModalPrivacyVeil'), 'index.html must show privacy veil on focus loss');
  assert.ok(index.includes('navigator.webdriver'), 'index.html #caseModal must guard against webdriver bots');
  assert.ok(index.includes('@media print') && index.includes('#caseModal'), 'index.html must hide #caseModal under @media print');
});

test('MaknaWorks ERP fixes infinite redirect loop and initializes /penjualan cleanly', () => {
  const targets = [
    path.join(rootDir, 'frontend', 'public', 'projects', 'maknaworks', 'index.html'),
    path.join(rootDir, 'projects', 'maknaworks', 'index.html'),
  ];
  for (const file of targets) {
    assert.ok(fs.existsSync(file), `${file} must exist`);
    const html = fs.readFileSync(file, 'utf-8');
    assert.ok(!html.includes('origPush.call(history, state, title, window.location.pathname'), `${file} must not trap BrowserRouter in infinite redirect loop`);
    assert.ok(html.includes("history.replaceState(null, '', '/penjualan')"), `${file} must initialize BrowserRouter to /penjualan`);
    assert.ok(html.includes('user-select: none') && html.includes('contextmenu'), `${file} must block copy and context menu`);
  }
});

test('Embedded Moriku and TATA$ previews include anti-copy and print-hide protections', () => {
  const targets = [
    path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html'),
    path.join(rootDir, 'projects', 'moriku', 'index.html'),
    path.join(rootDir, 'frontend', 'public', 'projects', 'tata', 'index.html'),
    path.join(rootDir, 'projects', 'tata', 'index.html'),
  ];
  for (const file of targets) {
    assert.ok(fs.existsSync(file), `${file} must exist`);
    const html = fs.readFileSync(file, 'utf-8');
    assert.ok(html.includes('user-select: none') && html.includes('contextmenu'), `${file} must block selection and right-click`);
    assert.ok(html.includes('@media print'), `${file} must hide content on print`);
  }
});

