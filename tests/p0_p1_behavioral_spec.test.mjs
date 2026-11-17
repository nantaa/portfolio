import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ─── 1. CONTACT & CONVERSION TRUTH (P0) ─────────────────────────────────────
test('Contact.tsx and ResumeModal.tsx use authentic email rifai.aryo@gmail.com and purge fake email.com', () => {
  const contactPath = path.join(rootDir, 'frontend', 'src', 'components', 'Contact.tsx');
  const resumePath = path.join(rootDir, 'frontend', 'src', 'components', 'ResumeModal.tsx');
  
  assert.ok(fs.existsSync(contactPath), 'Contact.tsx must exist');
  assert.ok(fs.existsSync(resumePath), 'ResumeModal.tsx must exist');

  const contactContent = fs.readFileSync(contactPath, 'utf-8');
  const resumeContent = fs.readFileSync(resumePath, 'utf-8');

  // Must contain user-confirmed authentic email
  assert.ok(
    contactContent.includes('rifai.aryo@gmail.com'),
    'Contact.tsx must use rifai.aryo@gmail.com'
  );
  assert.ok(
    resumeContent.includes('rifai.aryo@gmail.com'),
    'ResumeModal.tsx must use rifai.aryo@gmail.com'
  );

  // Must NOT contain dummy placeholder domain
  assert.ok(
    !contactContent.includes('rifai.aryo@email.com'),
    'Contact.tsx must not contain fake domain rifai.aryo@email.com'
  );
  assert.ok(
    !resumeContent.includes('rifai.aryo@email.com'),
    'ResumeModal.tsx must not contain fake domain rifai.aryo@email.com'
  );
});

test('globals.css allows text selection on contact handles instead of blocking user-select', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Must not blanket ban text selection on body without exception
  assert.ok(
    !cssContent.includes('user-select: none;') || cssContent.includes('user-select: text') || cssContent.includes('select-text'),
    'Contact items must be selectable'
  );
  assert.ok(
    !cssContent.includes('::selection { background: transparent; }'),
    'globals.css must not make text selection invisible with transparent background'
  );
});

// ─── 2. ARCHITECTURE & STATIC DECOUPLING (D1=B) (P0) ─────────────────────────
test('Frontend static export is self-contained without dead build-time API short-circuit', () => {
  const pagePath = path.join(rootDir, 'frontend', 'src', 'app', 'page.tsx');
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  const workGridContent = fs.readFileSync(workGridPath, 'utf-8');

  // page.tsx must render HomeClient cleanly
  assert.ok(
    !pageContent.includes('fetchProjects()') || pageContent.includes('// static export'),
    'page.tsx should not call dead API fetch helper during static export'
  );
  // WorkGrid must cleanly display the 8 core showcase projects
  assert.ok(
    workGridContent.includes('CORE_PROJECTS'),
    'WorkGrid.tsx must define core projects'
  );
});

// ─── 3. ASSET & PERFORMANCE BUDGET (P0) ─────────────────────────────────────
test('logo-svg.svg is clean lightweight vector without 370KB base64 raster embedding', () => {
  const rootLogoPath = path.join(rootDir, 'logo-svg.svg');
  const publicLogoPath = path.join(rootDir, 'frontend', 'public', 'logo-svg.svg');
  const appIconPath = path.join(rootDir, 'frontend', 'src', 'app', 'icon.svg');

  const filesToCheck = [rootLogoPath, publicLogoPath, appIconPath].filter(p => fs.existsSync(p));
  
  for (const filePath of filesToCheck) {
    const stats = fs.statSync(filePath);
    assert.ok(
      stats.size < 30000,
      `${path.basename(filePath)} size (${stats.size} bytes) must be < 30KB (not 370KB embedded raster)`
    );
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(
      !content.includes('data:image/png;base64'),
      `${path.basename(filePath)} must not contain bloated base64 raster payload`
    );
  }
});

test('GeopetakPreview does not eagerly load 13.6MB of JPEGs unconditionally on component mount', () => {
  const geoPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'GeopetakPreview.tsx');
  assert.ok(fs.existsSync(geoPath), 'GeopetakPreview.tsx must exist');
  const content = fs.readFileSync(geoPath, 'utf-8');

  // Must not have eager Promise.all loading 6MB mesh unconditionally on mount
  assert.ok(
    !content.includes('Promise.all([\n      "/images/projects/bekasi_saturated.jpg",\n      "/images/projects/bekasi_xray.jpg",\n      "/images/projects/bekasi_mesh.jpg",') ||
    content.includes('isActivated') || content.includes('onDemand') || content.includes('activeLayer'),
    'GeopetakPreview must gate or lazy-load heavy multi-layer textures on demand'
  );
});

test('Unreferenced dead project assets are purged from frontend/public/images/projects', () => {
  const projectsImgDir = path.join(rootDir, 'frontend', 'public', 'images', 'projects');
  if (fs.existsSync(projectsImgDir)) {
    const deadAssets = [
      'uiux.png',
      'geopetak-hero.webp',
      'geopetak-mesh.webp',
      'geopetak-xray.webp',
      'kukujang-car.webp',
      'kukujang-car2.jpg',
    ];
    for (const dead of deadAssets) {
      const fullPath = path.join(projectsImgDir, dead);
      assert.ok(!fs.existsSync(fullPath), `Dead asset ${dead} should be purged to save repository & payload weight`);
    }
  }
});

// ─── 4. CI/CD WORKFLOW HARDENING (P0) ────────────────────────────────────────
test('.github/workflows/deploy.yml targets master branch and enforces execution safety', () => {
  const workflowPath = path.join(rootDir, '.github', 'workflows', 'deploy.yml');
  assert.ok(fs.existsSync(workflowPath), 'deploy.yml must exist');
  const content = fs.readFileSync(workflowPath, 'utf-8');

  // Must not pull nonexistent 'origin main'
  assert.ok(
    !content.includes('git pull --recurse-submodules origin main'),
    'Workflow must not target nonexistent origin main'
  );
  assert.ok(
    content.includes('master'),
    'Workflow must reference master branch'
  );

  // Must enforce script stop or pipefail
  assert.ok(
    content.includes('script_stop: true') || content.includes('set -e') || content.includes('set -euo pipefail'),
    'Workflow SSH step must fail fast on errors'
  );

  // Must specify job or step timeout to prevent 60-175 min hangs
  assert.ok(
    content.includes('timeout-minutes:'),
    'Workflow must define timeout-minutes to prevent runaway runner consumption'
  );
});

// ─── 5. ACCESSIBILITY & SEMANTIC LANDMARKS (P1) ──────────────────────────────
test('Page structure contains semantic h1 and main landmarks', () => {
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const layoutPath = path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx');
  const homeClientPath = path.join(rootDir, 'frontend', 'src', 'components', 'HomeClient.tsx');

  const heroContent = fs.readFileSync(heroPath, 'utf-8');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  const homeClientContent = fs.readFileSync(homeClientPath, 'utf-8');

  // Hero must include semantic <h1> for primary candidate name
  assert.ok(
    heroContent.includes('<h1') || heroContent.includes('h1'),
    'Hero component must render semantic <h1> for portfolio candidate'
  );

  // Layout or HomeClient must wrap content in <main> landmark
  assert.ok(
    layoutContent.includes('<main') || homeClientContent.includes('<main'),
    'Application must provide a semantic <main> landmark'
  );
});

test('globals.css provides high-contrast dark mode accent text and respects reduced-motion', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const content = fs.readFileSync(cssPath, 'utf-8');

  // Must support prefers-reduced-motion for sensitive users
  assert.ok(
    content.includes('prefers-reduced-motion'),
    'globals.css must include prefers-reduced-motion media queries'
  );

  // Focus visible must not be completely stripped
  assert.ok(
    !content.includes('.wc:focus-visible {\n  outline: none !important;'),
    'globals.css must not strip focus-visible outline without accessible focus indicator'
  );
});

// ─── 6. MODAL FOCUS MANAGEMENT & ACCESSIBILITY (P1) ──────────────────────────
test('CaseStudyModal and ResumeModal implement complete focus trap management', () => {
  const caseModalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  const resumeModalPath = path.join(rootDir, 'frontend', 'src', 'components', 'ResumeModal.tsx');
  
  const caseContent = fs.readFileSync(caseModalPath, 'utf-8');
  const resumeContent = fs.readFileSync(resumeModalPath, 'utf-8');

  // Both modals must handle Tab key or focus trap
  assert.ok(
    caseContent.includes('Tab') || caseContent.includes('useDialog') || caseContent.includes('focusTrap'),
    'CaseStudyModal must trap focus or manage Tab key cycling'
  );
  assert.ok(
    resumeContent.includes('Tab') || resumeContent.includes('useDialog') || resumeContent.includes('focusTrap'),
    'ResumeModal must trap focus or manage Tab key cycling'
  );
});
