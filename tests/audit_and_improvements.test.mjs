import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('index.html contains full 8-project roster and zero legacy 04 count', () => {
  const indexPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(indexPath), 'index.html must exist');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Must declare 08 projects
  assert.ok(content.includes('08 projects'), 'index.html must state 08 projects in section header');
  assert.ok(!content.includes('04 projects'), 'index.html must not retain legacy 04 projects count');

  // Must include all 8 project cards
  assert.ok(content.includes('Industrial K3 Compliance Engine') || content.includes('K3 Statutory Compliance'), 'Must include K3 project');
  assert.ok(content.includes('Indonesian 3D Material Studies') || content.includes('Ulun Danu'), 'Must include 3D Material Studies');
  assert.ok(content.includes('Tata$') || content.includes('TATA$'), 'Must include Tata$');
  assert.ok(content.includes('Thesis') || content.includes('Docket'), 'Must include Academic Thesis Docket');
  assert.ok(content.includes('Delta IT Helpdesk') || content.includes('Helpdesk'), 'Must include Helpdesk');
  assert.ok(content.includes('Geopetak'), 'Must include Geopetak Aerial AI');
  assert.ok(content.includes('Expense Tracker'), 'Must include Expense Tracker');
  assert.ok(content.includes('Makna Works'), 'Must include Makna Works');

  // Must include verified outcome metrics on cards
  assert.ok(content.includes('270+ Passing Tests') || content.includes('270+ Tests'), 'Must include Moriku outcome metric');
  assert.ok(content.includes('60 FPS'), 'Must include 3D shader outcome metric');
  assert.ok(content.includes('88 Tests') || content.includes('88 automated tests') || content.includes('88 Passing Tests'), 'Must include Thesis Docket outcome metric');
});

test('index.html nav uses adaptive background and theme toggle', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Nav styling must not be hardcoded to dark background
  assert.ok(!content.includes('background: rgba(10, 10, 10, 0.9);') && !content.includes('background:rgba(10,10,10,0.9);'), 'index.html nav must not hardcode dark background in light mode');
  assert.ok(content.includes('--nav-bg') || content.includes('rgba(247, 244, 238') || content.includes('rgba(247,244,238'), 'index.html nav must use light warm linen background');

  // Must support theme toggle or active theme mechanism
  assert.ok(content.includes('theme-toggle') || content.includes('toggleTheme') || content.includes('data-theme'), 'index.html must support theme switching or data-theme management');
});

test('index.html caseModal implements Prev and Next project pagination', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Case study modal must support sequential navigation
  assert.ok(
    content.includes('prevProject') || content.includes('nextProject') || content.includes('Previous Project') || content.includes('Next Project') || content.includes('navigateCase'),
    'index.html caseModal must support sequential Next and Previous project browsing'
  );
});

test('WorkGrid.tsx renders all 8 projects in an all-in-one grid without tag selector tabs', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  assert.ok(fs.existsSync(workGridPath), 'WorkGrid.tsx must exist');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  assert.ok(!content.includes('FILTER_TABS'), 'WorkGrid.tsx must not render category tag selector tabs');
  assert.ok(!content.includes('role="tablist"'), 'WorkGrid.tsx must not render tablist');
  assert.ok(content.includes('items.map'), 'WorkGrid.tsx must render all projects in one grid');
});

test('globals.css and index.html enforce darkened --muted contrast (> 5.5:1) and global :focus-visible', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const indexPath = path.join(rootDir, 'index.html');
  const css = fs.readFileSync(cssPath, 'utf-8');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Darkened muted token
  assert.ok(css.includes('--muted: #545049') || css.includes('--muted: #545049;'), 'globals.css must darken --muted to #545049 for WCAG AA+ contrast');
  assert.ok(html.includes('--muted: #545049') || html.includes('--muted: #545049;'), 'index.html must darken --muted to #545049 for WCAG AA+ contrast');

  // Global focus visible
  assert.ok(css.includes(':focus-visible') && css.includes('outline-offset:'), 'globals.css must include global focus-visible styling');
  assert.ok(html.includes(':focus-visible') && html.includes('outline-offset:'), 'index.html must include global focus-visible styling');
});

test('CaseStudyModal.tsx supports ArrowLeft and ArrowRight keyboard navigation', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'CaseStudyModal.tsx must exist');
  const content = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(content.includes('ArrowLeft') && content.includes('ArrowRight'), 'CaseStudyModal.tsx must handle ArrowLeft and ArrowRight keyboard navigation');
});

