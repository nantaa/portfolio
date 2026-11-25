import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Next.js layout.tsx loads only 2 Hero-prioritized Google Fonts (Playfair_Display and Syne_Mono)', () => {
  const layout = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx'), 'utf-8');
  assert.ok(layout.includes('Playfair_Display') && layout.includes('Syne_Mono'), 'layout.tsx must import Playfair_Display and Syne_Mono');
  assert.ok(!/\bSyne\b/.test(layout), 'layout.tsx must not import Syne');
  assert.ok(layout.includes('preload: true') && layout.includes('display: "swap"'), 'layout.tsx must prioritize Hero fonts with preload and swap');
});

test('index.html and globals.css minimize Google Fonts to 2 families and map --sans to system-ui', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const css = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');

  assert.ok(indexHtml.includes('Playfair+Display') && indexHtml.includes('Syne+Mono'), 'index.html must load Playfair Display and Syne Mono');
  assert.ok(!indexHtml.includes('family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Syne:'), 'index.html must not load Syne Google Font');
  assert.ok(!css.includes("'Syne',"), 'globals.css must not reference Syne font family');
  assert.ok(css.includes('--sans: system-ui'), 'globals.css must map --sans to system-ui');
});

