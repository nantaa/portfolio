import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: CV Aryo Update.pdf is staged in docs/ and frontend/public/docs/', () => {
  const rootPdf = path.join(rootDir, 'docs', 'CV Aryo Update.pdf');
  const publicPdf = path.join(rootDir, 'frontend', 'public', 'docs', 'CV-Aryo-Update.pdf');

  assert.ok(fs.existsSync(rootPdf), 'docs/CV Aryo Update.pdf must exist');
  assert.ok(fs.existsSync(publicPdf), 'frontend/public/docs/CV-Aryo-Update.pdf must exist for Next.js static export');
});

test('Criterion 2: Nav.tsx removes CV quick trigger from desktop and mobile navbar', () => {
  const nav = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx'), 'utf-8');
  assert.ok(!nav.includes('openResume'), 'Nav.tsx must remove openResume CV trigger');
  assert.ok(!nav.includes('View Résumé / CV'), 'Nav.tsx mobile menu must remove CV button');
});

test('Criterion 3: index.html removes CV quick trigger from navbar', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const navMatch = indexHtml.match(/<nav>[\s\S]*?<\/nav>/);
  assert.ok(navMatch, 'index.html must contain <nav>');
  assert.ok(!navMatch[0].includes('openResume'), 'index.html navbar must remove openResume CV trigger');
});

test('Criterion 4: Hero.tsx and index.html Hero CV button automatically downloads CV Aryo Update.pdf', () => {
  const hero = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(hero.includes('href="/docs/CV-Aryo-Update.pdf"'), 'Hero.tsx must link to /docs/CV-Aryo-Update.pdf');
  assert.ok(hero.includes('download="CV Aryo Update.pdf"'), 'Hero.tsx must set download="CV Aryo Update.pdf"');

  assert.ok(indexHtml.includes('download="CV Aryo Update.pdf"'), 'index.html Hero CV button must set download="CV Aryo Update.pdf"');
  assert.ok(
    indexHtml.includes('href="docs/CV%20Aryo%20Update.pdf"') || indexHtml.includes('href="/docs/CV-Aryo-Update.pdf"'),
    'index.html Hero CV button must link to CV Aryo Update.pdf'
  );
});

