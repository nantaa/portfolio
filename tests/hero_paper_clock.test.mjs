import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('HeroPaperClock.tsx renders a pure 3D WebGL canvas at back layer (z-0) via portal and DOM slot', () => {
  const clockPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroPaperClock.tsx');
  assert.ok(fs.existsSync(clockPath), 'HeroPaperClock.tsx must exist');
  const content = fs.readFileSync(clockPath, 'utf-8');

  assert.ok(content.includes('three'), 'HeroPaperClock must use Three.js');
  assert.ok(content.includes('createPortal'), 'HeroPaperClock must portal full-page flight canvas outside .hero transform');
  assert.ok(content.includes('z-0') || content.includes('zIndex: 0'), 'Flight canvas must sit on back layer z-0');
  assert.ok(content.includes('heroClockSlot'), 'Must anchor 3D calendar to #heroClockSlot rect');
  assert.ok(!content.includes('<button'), 'HeroPaperClock must contain zero buttons');
  assert.ok(!content.includes('Paper Flip'), 'HeroPaperClock must contain zero descriptive text tags');
  assert.ok(content.includes('prefers-reduced-motion'), 'HeroPaperClock must respect prefers-reduced-motion');
});

test('HeroPaperClock.tsx defines all 6 spline trajectories plus cross-section paths and contrast safeguard', () => {
  const clockPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroPaperClock.tsx');
  const content = fs.readFileSync(clockPath, 'utf-8');

  assert.ok(content.includes('#F7F4EE') && content.includes('#800020'), 'Must enforce Ivory #F7F4EE and Burgundy #800020 parity');
  assert.ok(content.includes('CatmullRomCurve3'), 'Must model smooth drawn trajectories with Three.js CatmullRomCurve3');
  assert.ok(content.includes('TRAJECTORY_PRESETS'), 'Must define the 6+ drawn spline trajectories');
  assert.ok(content.includes('window.scrollY'), 'Must convert trajectories in document scroll space for cross-section flights');
  assert.ok(content.includes('deformAirborneSheet'), 'Must dynamically bend full sheets along flight streamlines');
  assert.ok(!content.includes('purple-figure-eight'), 'Must remove erratic purple figure-eight path');
  assert.ok(content.includes('wz: 0.95') || content.includes('wz: 0.85'), 'Airborne paths must fly above pad plane (positive wz > clockGroup.z)');
});

test('HomeClient.tsx elevates content sections above the z-0 back flight layer', () => {
  const homeClientPath = path.join(rootDir, 'frontend', 'src', 'components', 'HomeClient.tsx');
  const homeClient = fs.readFileSync(homeClientPath, 'utf-8');
  assert.ok(homeClient.includes('z-[2]'), 'HomeClient must place content wrapper at z-[2] above background flight layer');
});

test('Hero.tsx and index.html embed pure back-layer 6-path Paper Flip clock', () => {
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const indexPath = path.join(rootDir, 'index.html');
  const hero = fs.readFileSync(heroPath, 'utf-8');
  const html = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(hero.includes('HeroPaperClock'), 'Hero.tsx must embed HeroPaperClock');
  assert.ok(html.includes('heroPaperClockCanvas') && html.includes('heroClockSlot'), 'index.html must include back-layer canvas and heroClockSlot');
  assert.ok(html.includes('evalSpline') && html.includes('TRAJECTORY_PATHS'), 'index.html must mirror all 6+ drawn trajectories');
});
