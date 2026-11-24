import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Moriku index.html is the self-contained 16-stage simulator without Inertia route visits', () => {
  const publicMoriku = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html'), 'utf-8');
  const rootMoriku = fs.readFileSync(path.join(rootDir, 'projects', 'moriku', 'index.html'), 'utf-8');

  // Both must be the standalone interactive Kanban board
  assert.ok(publicMoriku.includes('Simulator Alur Kanban') || publicMoriku.includes('16-stage'), 'public moriku must contain simulator');
  assert.ok(rootMoriku.includes('Simulator Alur Kanban') || rootMoriku.includes('16-stage'), 'root moriku must contain simulator');

  // Must not import the Inertia bundle that routes to root /
  assert.ok(!publicMoriku.includes('app-CLJ6yzA7.js'), 'public moriku must not load app-CLJ6yzA7.js');
  assert.ok(!rootMoriku.includes('app-CLJ6yzA7.js'), 'root moriku must not load app-CLJ6yzA7.js');
});

test('Criterion 2: CaseStudyModal embeds Moriku iframe with strict sandbox isolation', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  assert.ok(modal.includes('sandbox='), 'CaseStudyModal must specify sandbox on iframes');
  assert.ok(!modal.includes('allow-top-navigation'), 'CaseStudyModal must not allow top-level navigation');
});

test('Criterion 3: Hero.tsx renders exactly 2 CTA buttons without email copy button clutter', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  assert.ok(hero.includes('View work'), 'Hero.tsx must include View work button');
  assert.ok(hero.includes('Curriculum Vitae') || hero.includes('CV / Résumé'), 'Hero.tsx must include clean CV button');
  assert.ok(!hero.includes('copyEmail'), 'Hero.tsx must remove copyEmail button to prevent button bloat');
});

test('Criterion 4: Hero top padding is >= 96px in globals.css and index.html to prevent nav collision', () => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(globalsCss.includes('padding-top: 112px') || globalsCss.includes('padding-top: 96px') || globalsCss.includes('pt-28') || globalsCss.includes('pt-32'), 'globals.css must set hero top padding >= 96px');
  assert.ok(indexHtml.includes('padding-top: 112px') || indexHtml.includes('padding-top: 96px') || indexHtml.includes('padding-top:112px') || indexHtml.includes('padding-top:96px'), 'index.html must set hero top padding >= 96px');
});

test('Criterion 5: Hero right column purges cramped 4-card micro-spec blocks', () => {
  const specimen = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'HeroExecutiveSpecimen.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  // Must not have the dense 4-card micro-spec array in hero right
  assert.ok(!specimen.includes('Statutory state machines, Disnaker SLA calculation engines'), 'HeroExecutiveSpecimen must purge microscopic essay text');
  assert.ok(!specimen.includes('06°14'), 'HeroExecutiveSpecimen must purge fake GPS coordinates');

  assert.ok(!indexHtml.includes('06°14'), 'index.html must purge fake GPS coordinates from hero');
});

