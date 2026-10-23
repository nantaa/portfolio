import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('globals.css defines comprehensive mobile media queries for <= 768px', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(cssPath), 'globals.css must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('@media (max-width: 768px)') || css.includes('@media (max-width:768px)'), 'Must define @media (max-width: 768px)');
});

test('globals.css collapses hero-body to 1 column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);
  assert.ok(mobileContent.includes('.hero-body') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('grid-template-columns:1fr') || mobileContent.includes('flex-direction: column')), 'Hero body must collapse to single column');
});

test('globals.css collapses work-grid and work-grid--8 to single column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);
  assert.ok(mobileContent.includes('.work-grid') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('flex-direction: column')), 'Work grid must collapse to 1fr or column');
  assert.ok(mobileContent.includes('.wc'), 'Work grid cards must unhook desktop grid-column/grid-row coordinate pinning');
});

test('globals.css collapses about and contact sections to single column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);
  assert.ok(mobileContent.includes('.about') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('display: flex')), 'About section must collapse');
  assert.ok(mobileContent.includes('.contact') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('display: flex')), 'Contact section must collapse');
});

test('globals.css suppresses custom desktop cursor on touch/mobile devices', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('#cur') && (css.includes('display: none') || css.includes('opacity: 0')), 'Custom cursor must be hidden on mobile/touch');
});

test('Nav.tsx implements responsive mobile menu or compact mobile layout', () => {
  const navPath = path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx');
  const content = fs.readFileSync(navPath, 'utf-8');

  assert.ok(content.includes('nav-links') && (content.includes('hidden') || content.includes('md:flex') || content.includes('mobile-menu') || content.includes('nav-menu-btn') || content.includes('nav-links-mobile')), 'Nav must adapt for mobile viewports');
});

test('globals.css applies restrained mobile hero typography and card proportions', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);

  // Check restrained card height (<= 340px)
  assert.ok(
    mobileContent.includes('min-height: 320px') || 
    mobileContent.includes('min-height: 330px') || 
    mobileContent.includes('min-height: 340px'),
    'Work card min-height must be restrained to <= 340px on mobile'
  );

  // Check about photo constraint
  assert.ok(
    mobileContent.includes('max-height: 240px') || 
    mobileContent.includes('max-height: 220px') ||
    mobileContent.includes('aspect-ratio: 16'),
    'About preview must be capped on mobile'
  );
});

test('globals.css eliminates card gradient fog in favor of architectural dock', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Verify --wo-gradient has been removed from design tokens
  assert.ok(!css.includes('--wo-gradient'), '--wo-gradient must be completely purged');

  // Verify .wo rule has transparent background
  const woMatch = css.match(/\.wo\s*\{([^}]+)\}/);
  assert.ok(woMatch && (woMatch[1].includes('background: transparent') || woMatch[1].includes('background: none')), '.wo must define transparent background');

  // Verify .w-bottom-bar implements architectural dock styling with backdrop blur
  const bottomBarMatch = css.match(/\.w-bottom-bar\s*\{([^}]+)\}/);
  assert.ok(
    bottomBarMatch && 
    bottomBarMatch[1].includes('backdrop-filter') && 
    (bottomBarMatch[1].includes('var(--nav-bg)') || bottomBarMatch[1].includes('var(--card-bg)')),
    'w-bottom-bar must be styled as a crisp architectural dock with backdrop-filter'
  );
});

test('HeroTelemetryHUD adapts node distribution for mobile screens', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');

  assert.ok(
    content.includes('isMobile') || 
    content.includes('width < 600') || 
    content.includes('w < 600') ||
    content.includes('mobileHomeNorm'),
    'HeroTelemetryHUD must adapt coordinates for narrow mobile viewports'
  );
});

test('work preview components eliminate hardcoded #07090b and radial-gradient spotlights', () => {
  const gatePath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ProjectPreviewGate.tsx');
  const carouselPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaterialStudiesCarousel.tsx');

  const gateContent = fs.readFileSync(gatePath, 'utf-8');
  const carouselContent = fs.readFileSync(carouselPath, 'utf-8');

  // Verify radial-gradient is purged
  assert.ok(!gateContent.includes('radial-gradient'), 'ProjectPreviewGate must not use radial-gradient');
  assert.ok(!carouselContent.includes('radial-gradient'), 'MaterialStudiesCarousel must not use radial-gradient');

  // Verify hardcoded #07090b is purged in favor of theme-aware tokens
  assert.ok(!gateContent.includes('#07090b'), 'ProjectPreviewGate must not hardcode #07090b');
  assert.ok(!carouselContent.includes('#07090b'), 'MaterialStudiesCarousel must not hardcode #07090b');
});

test('WorkGrid.tsx places .w-num-dock inside .w-bottom-bar alongside category to eliminate preview header collisions', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  // Must not have floating .w-num directly under .wo
  assert.ok(!content.includes('<span className="w-num">'), 'Must not have floating top-left .w-num overlay');

  // Must have dock-integrated w-num alongside category
  assert.ok(content.includes('w-num-dock'), 'Must render w-num-dock integrated into the card dock');
});

test('globals.css eliminates absolute top-left .w-num overlay styling', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(!css.includes('.w-num {'), 'globals.css must purge legacy floating .w-num overlay class');
  assert.ok(css.includes('.w-num-dock'), 'globals.css must define .w-num-dock dock styling');
});

test('HeroTelemetryHUD hides secondary chip clutter on compact mobile viewports', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');

  // The 4 secondary node chips must have responsive hiding (e.g., hidden sm:flex or md:flex)
  assert.ok(
    content.includes('hidden sm:flex') || 
    content.includes('hidden md:flex'),
    'HeroTelemetryHUD secondary chips must hide on narrow viewports to prevent coordinate ticker clipping'
  );
});

test('DNPMonitorPreview suppresses secondary statutory sub-label on mobile viewports', () => {
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');
  const content = fs.readFileSync(dnpPath, 'utf-8');

  assert.ok(
    content.includes('hidden md:inline') || 
    content.includes('hidden sm:inline') ||
    content.includes('hidden md:block'),
    'DNPMonitorPreview must hide verbose statutory subtitle on mobile'
  );
});

test('ProjectPreviewGate renders rich architectural SVG blueprint background when in standby state', () => {
  const gatePath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ProjectPreviewGate.tsx');
  const content = fs.readFileSync(gatePath, 'utf-8');

  assert.ok(
    content.includes('<svg') && (content.includes('blueprint') || content.includes('contour') || content.includes('grid-pattern') || content.includes('meru') || content.includes('topography')),
    'ProjectPreviewGate must render an architectural SVG blueprint background rather than an empty blank box'
  );
});

test('DNPMonitorPreview hides bottom status ticker and uses scrollbar-none for invisible horizontal scrolling', () => {
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');
  const content = fs.readFileSync(dnpPath, 'utf-8');

  // Must purge native chunky scrollbar-thin class
  assert.ok(!content.includes('scrollbar-thin'), 'DNPMonitorPreview must not use chunky native scrollbar-thin');

  // Must use invisible scrollbar-none for horizontal scrolling
  assert.ok(content.includes('scrollbar-none'), 'DNPMonitorPreview must use scrollbar-none for sleek scrolling');

  // Must purge cluttered bottom status footer
  assert.ok(!content.includes('PT Delta Nusantara Persada · Disnaker PJK3 Accredited'), 'Must purge cluttered bottom ticker footer');
});

test('DNPMonitorPreview eliminates redundant phase filter button strip to reduce cognitive clutter', () => {
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');
  const content = fs.readFileSync(dnpPath, 'utf-8');

  // Must purge redundant 5-button phase filter row
  assert.ok(!content.includes('F1: Berkas'), 'Must purge redundant phase filter buttons');

  // Must have SVG icon-enhanced concise tab names (conforming to DESIGN.md zero-emoji rule)
  assert.ok(content.includes('Kanban') && content.includes('<svg'), 'Tabs must be concise and SVG icon-enhanced');
});

test('HeroTelemetryHUD uses compact single-token tech chips and streamlined summary', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');

  // Must purge verbose multi-word sentence chips
  assert.ok(!content.includes('{n.name} · {n.tech}'), 'Must purge verbose {n.name} · {n.tech} chip strings');

  // Must render concise tech badge
  assert.ok(content.includes('{n.tech}'), 'Must render concise tech badge');
});



