import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Hero.tsx embeds HeroExecutiveSpecimen and purges HeroTelemetryHUD', () => {
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');

  assert.ok(
    heroContent.includes('HeroExecutiveSpecimen'),
    'Hero.tsx must import and embed HeroExecutiveSpecimen'
  );
  assert.ok(
    !heroContent.includes('HeroTelemetryHUD'),
    'Hero.tsx must not embed the old HeroTelemetryHUD canvas'
  );
});

test('HeroExecutiveSpecimen.tsx exists and contains zero <canvas> elements or physics loops', () => {
  const specimenPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroExecutiveSpecimen.tsx');
  assert.ok(fs.existsSync(specimenPath), 'HeroExecutiveSpecimen.tsx must exist');

  const content = fs.readFileSync(specimenPath, 'utf-8');
  assert.ok(!content.includes('<canvas'), 'HeroExecutiveSpecimen must not contain <canvas>');
  assert.ok(!content.includes('requestAnimationFrame'), 'HeroExecutiveSpecimen must not run requestAnimationFrame loops');
  assert.ok(!content.includes('spring') && !content.includes('Hooke'), 'HeroExecutiveSpecimen must not contain spring physics');
  assert.ok(!content.includes('LATENCY: 14ms'), 'HeroExecutiveSpecimen must not contain fake arcade latency tickers');
});

test('HeroExecutiveSpecimen.tsx renders 4 authentic discipline cards with verified outcome metrics', () => {
  const specimenPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroExecutiveSpecimen.tsx');
  const content = fs.readFileSync(specimenPath, 'utf-8');

  // Discipline 01: Enterprise
  assert.ok(content.includes('ENTERPRISE SYSTEMS & ERP'), 'Must include Enterprise Systems discipline');
  assert.ok(content.includes('Laravel 11') && content.includes('React 19'), 'Must include Enterprise stack');
  assert.ok(content.includes('270+ Automated Tests') || content.includes('270+ Passing Tests'), 'Must include 270+ tests metric');

  // Discipline 02: 3D WebGL
  assert.ok(content.includes('CREATIVE MOTION & 3D WEBGL'), 'Must include Creative Motion & 3D WebGL discipline');
  assert.ok(content.includes('Three.js') && content.includes('GLSL'), 'Must include 3D WebGL stack');
  assert.ok(content.includes('60 FPS') || content.includes('60fps'), 'Must include 60 FPS metric');

  // Discipline 03: Algorithms
  assert.ok(content.includes('ALGORITHMIC OPTIMIZATION'), 'Must include Algorithmic Optimization discipline');
  assert.ok(content.includes('Gale-Shapley') || content.includes('Hungarian'), 'Must include discrete algorithms');
  assert.ok(content.includes('88 Unit Tests Passing') || content.includes('88 Passing Tests'), 'Must include 88 tests metric');

  // Discipline 04: DevOps
  assert.ok(content.includes('CLOUD & DEVOPS INFRASTRUCTURE') || content.includes('DEVOPS & INFRASTRUCTURE'), 'Must include DevOps discipline');
  assert.ok(content.includes('Sub-2h SLA'), 'Must include Sub-2h SLA metric');

  // Summary footer
  assert.ok(content.includes('350+ Passing') || content.includes('350+ Automated Tests'), 'Must include 350+ overall tests benchmark');
});

test('HeroExecutiveSpecimen.tsx uses semantic theme tokens and high-contrast typography', () => {
  const specimenPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroExecutiveSpecimen.tsx');
  const content = fs.readFileSync(specimenPath, 'utf-8');

  assert.ok(content.includes('var(--s1)') || content.includes('var(--s2)'), 'Must bind to semantic surface variables');
  assert.ok(content.includes('var(--wire)') || content.includes('border-[var(--wire)]'), 'Must bind to semantic wire border variable');
  assert.ok(content.includes('var(--accent)'), 'Must bind to semantic accent color variable');
  assert.ok(content.includes('var(--text)'), 'Must bind to semantic text color variable');
  assert.ok(content.includes('var(--muted)'), 'Must bind to semantic muted color variable');
});

test('index.html .hero-right matrix maintains content and metric parity with HeroExecutiveSpecimen', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(indexContent.includes('hero-right'), 'index.html must define .hero-right');
  assert.ok(indexContent.includes('ENTERPRISE SYSTEMS &amp; ERP') || indexContent.includes('ENTERPRISE SYSTEMS & ERP'), 'index.html must display Enterprise discipline');
  assert.ok(indexContent.includes('270+ Automated Tests'), 'index.html must display 270+ Automated Tests metric');
  assert.ok(indexContent.includes('CREATIVE MOTION &amp; 3D WEBGL') || indexContent.includes('CREATIVE MOTION & 3D WEBGL'), 'index.html must display Creative Motion discipline');
  assert.ok(indexContent.includes('ALGORITHMIC OPTIMIZATION'), 'index.html must display Algorithmic Optimization discipline');
  assert.ok(indexContent.includes('88 Unit Tests Passing'), 'index.html must display 88 Unit Tests metric');
  assert.ok(indexContent.includes('DEVOPS &amp; INFRASTRUCTURE') || indexContent.includes('DEVOPS & INFRASTRUCTURE'), 'index.html must display DevOps discipline');
  assert.ok(indexContent.includes('Sub-2h SLA'), 'index.html must display Sub-2h SLA metric');
  assert.ok(indexContent.includes('350+ Passing Automated Tests'), 'index.html must display 350+ passing tests summary');
});
