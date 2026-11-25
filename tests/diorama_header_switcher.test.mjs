import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('3D Studies diorama switcher sits in CaseStudyModal header instead of floating over the canvas', () => {
  const carousel = fs.readFileSync(
    path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaterialStudiesCarousel.tsx'),
    'utf-8'
  );
  const modal = fs.readFileSync(
    path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'),
    'utf-8'
  );

  assert.ok(!carousel.includes('absolute top-3 left-4'), 'MaterialStudiesCarousel must not float a switcher over the canvas');
  assert.ok(modal.includes('01 Raja Ampat') && modal.includes('02 Ulun Danu'), 'CaseStudyModal header must render 01 Raja Ampat and 02 Ulun Danu switcher');
  assert.ok(modal.includes('activeStudyIndex'), 'CaseStudyModal must manage activeStudyIndex for project 2');
});

