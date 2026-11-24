import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Hero.tsx purges HeroTelemetryHUD and renders editorial options', () => {
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');

  assert.ok(
    heroContent.includes('Option A'),
    'Hero.tsx must render editorial Option A'
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

test('HeroExecutiveSpecimen.tsx renders authentic engineering capability with verified outcome metrics', () => {
  const specimenPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroExecutiveSpecimen.tsx');
  const content = fs.readFileSync(specimenPath, 'utf-8');

  assert.ok(content.includes('SYSTEMS ARCHITECT') || content.includes('Systems Architecture'), 'Must include Systems Architecture');
  assert.ok(content.includes('350+') || content.includes('Passing Tests'), 'Must include 350+ passing tests metric');
  assert.ok(content.includes('SLA'), 'Must include SLA metric');
  assert.ok(content.includes('Downtime') || content.includes('Releases'), 'Must include deployment metric');
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

test('index.html hero renders all 3 editorial options cleanly', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(indexContent.includes('Option A'), 'index.html must display Option A');
  assert.ok(indexContent.includes('Option B'), 'index.html must display Option B');
  assert.ok(indexContent.includes('Option C'), 'index.html must display Option C');
});

