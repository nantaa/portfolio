import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('HeroPaperClock.tsx renders a pure 3D WebGL canvas with zero buttons or extra text tags', () => {
  const clockPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroPaperClock.tsx');
  assert.ok(fs.existsSync(clockPath), 'HeroPaperClock.tsx must exist');
  const content = fs.readFileSync(clockPath, 'utf-8');

  assert.ok(content.includes('three'), 'HeroPaperClock must use Three.js');
  assert.ok(content.includes('requestAnimationFrame'), 'HeroPaperClock must animate smoothly');
  assert.ok(content.includes('<canvas'), 'HeroPaperClock must render a <canvas>');
  assert.ok(!content.includes('<button'), 'HeroPaperClock must contain zero buttons');
  assert.ok(!content.includes('Paper Flip'), 'HeroPaperClock must contain zero descriptive text tags');
  assert.ok(content.includes('prefers-reduced-motion'), 'HeroPaperClock must respect prefers-reduced-motion');
});

test('HeroPaperClock.tsx enforces Even=Ivory (#F7F4EE) and Odd=Burgundy (#800020) parity colors and rounded calendar geometry', () => {
  const clockPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroPaperClock.tsx');
  const content = fs.readFileSync(clockPath, 'utf-8');

  assert.ok(content.includes('#F7F4EE') && content.includes('#800020'), 'Must use Ivory #F7F4EE and Burgundy #800020 palette');
  assert.ok(content.includes('% 2 === 0'), 'Must compute even/odd parity dynamically');
  assert.ok(content.includes('ExtrudeGeometry') && content.includes('createRoundedRectShape'), 'Must use rounded Shape/ExtrudeGeometry so square box corners never leak');
});

test('HeroPaperClock.tsx launches full numbered sheets via APW rk4Step aerodynamics with zero mini confetti scraps', () => {
  const clockPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroPaperClock.tsx');
  const content = fs.readFileSync(clockPath, 'utf-8');

  assert.ok(content.includes('rk4Step') && content.includes('computeApwDerivatives'), 'Must use Andersen-Pesavento-Wang RK4 aerodynamic ODEs');
  assert.ok(content.includes('spawnAirborneSheet') && content.includes('deformAirborneSheet'), 'Must launch full-size flexing numbered sheets into flight');
  assert.ok(!content.includes('spawnPetals') && !content.includes('PETAL_POOL_SIZE = 44'), 'Must not spawn mini confetti scrap clouds');
});

test('Hero.tsx and index.html embed pure APW Paper Flip clock', () => {
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const indexPath = path.join(rootDir, 'index.html');
  const hero = fs.readFileSync(heroPath, 'utf-8');
  const html = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(hero.includes('HeroPaperClock'), 'Hero.tsx must embed HeroPaperClock');
  assert.ok(html.includes('heroPaperClockCanvas'), 'index.html must embed heroPaperClockCanvas');
  assert.ok(html.includes('#F7F4EE') && html.includes('#800020'), 'index.html clock must enforce Ivory/Burgundy parity');
  assert.ok(html.includes('spawnAirborneSheet') && html.includes('apwStep'), 'index.html must use full gliding numbered sheet aerodynamics');
});
