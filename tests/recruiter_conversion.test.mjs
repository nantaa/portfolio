import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Resume modal contains verified employment date ranges across Next.js and static index.html', () => {
  const nextResume = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'ResumeModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(nextResume.includes('2023 — 2025'), 'ResumeModal.tsx must contain 2023 — 2025 date range');
  assert.ok(nextResume.includes('2022 — 2023'), 'ResumeModal.tsx must contain 2022 — 2023 date range');
  assert.ok(nextResume.includes('2024 — Present'), 'ResumeModal.tsx must contain 2024 — Present date range');

  assert.ok(indexHtml.includes('2023 — 2025'), 'index.html resume modal must contain 2023 — 2025 date range');
  assert.ok(indexHtml.includes('2022 — 2023'), 'index.html resume modal must contain 2022 — 2023 date range');
  assert.ok(indexHtml.includes('2024 — Present'), 'index.html resume modal must contain 2024 — Present date range');
});

test('Criterion 2: Resume modal contains university education entry in ResumeModal.tsx and index.html', () => {
  const nextResume = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'ResumeModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(nextResume.includes('Universitas Pendidikan Indonesia'), 'ResumeModal.tsx must display university education');
  assert.ok(nextResume.includes('Computer Science'), 'ResumeModal.tsx must specify Computer Science degree');

  assert.ok(indexHtml.includes('Universitas Pendidikan Indonesia'), 'index.html must display university education');
  assert.ok(indexHtml.includes('Computer Science'), 'index.html must specify Computer Science degree');
});

test('Criterion 3: Resume modal provides print/save PDF trigger in ResumeModal.tsx and index.html', () => {
  const nextResume = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'ResumeModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(nextResume.includes('window.print()') || nextResume.includes('handlePrint'), 'ResumeModal.tsx must support window.print');
  assert.ok(indexHtml.includes('window.print()'), 'index.html resume modal must support window.print');
});

test('Criterion 4: Print stylesheet @media print formats resume for export in globals.css and index.html', () => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(globalsCss.includes('@media print'), 'globals.css must define @media print styles');
  assert.ok(indexHtml.includes('@media print'), 'index.html must define @media print styles');
});

test('Criterion 5: One-click email copy functionality with visual confirmation exists across components', () => {
  const contact = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Contact.tsx'), 'utf-8');
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(contact.includes('copyEmail') || contact.includes('copied'), 'Contact.tsx must provide copy email functionality');
  assert.ok(hero.includes('copyEmail') || hero.includes('copied'), 'Hero.tsx must provide copy email functionality');
  assert.ok(indexHtml.includes('copyEmail'), 'index.html must provide copyEmail function');
});

test('Criterion 6: Hero section displays candidate availability badge in Hero.tsx and index.html', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(hero.includes('Available for') || hero.includes('Open to'), 'Hero.tsx must declare candidate availability');
  assert.ok(indexHtml.includes('Available for') || indexHtml.includes('Open to'), 'index.html must declare candidate availability');
});

test('Criterion 7: Email address is strictly standardized to rifai.aryo@gmail.com with zero legacy addresses', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const contact = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Contact.tsx'), 'utf-8');

  assert.ok(!indexHtml.includes('rifaiaryoananta@email.com'), 'index.html must not contain legacy email address');
  assert.ok(indexHtml.includes('rifai.aryo@gmail.com'), 'index.html must reference standardized email');
  assert.ok(contact.includes('rifai.aryo@gmail.com'), 'Contact.tsx must reference standardized email');
});

test('Criterion 8: Case study cards display source repository or NDA proprietary markers', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(workGrid.includes('GitHub') || workGrid.includes('Proprietary') || workGrid.includes('NDA'), 'WorkGrid.tsx must surface repository or NDA status');
  assert.ok(indexHtml.includes('GitHub') || indexHtml.includes('Proprietary') || indexHtml.includes('NDA'), 'index.html must surface repository or NDA status');
});

