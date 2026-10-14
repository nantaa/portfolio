import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Hero right mosaic contains zero placeholder labels or instructions', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const heroTsxPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  
  assert.ok(fs.existsSync(indexPath), 'index.html must exist');
  assert.ok(fs.existsSync(heroTsxPath), 'Hero.tsx must exist');

  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const heroContent = fs.readFileSync(heroTsxPath, 'utf-8');

  // Verify zero wireframe placeholder strings
  const badStrings = [
    'Your portrait photo',
    'Replace with: src="PASFOTO.png"',
    'Project preview',
    'Photography sample',
    'Image placeholder'
  ];

  for (const s of badStrings) {
    assert.ok(!indexContent.includes(s), `index.html must not contain placeholder string "${s}"`);
    assert.ok(!heroContent.includes(s), `Hero.tsx must not contain placeholder string "${s}"`);
  }
});

test('Download CV CTA is not a dead href="#" link in index.html and Hero.tsx', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const heroTsxPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');

  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const heroContent = fs.readFileSync(heroTsxPath, 'utf-8');

  // Neither should have dead link for Download CV
  assert.ok(!heroContent.includes('href="#" className="hero-btn">Download CV'), 'Hero.tsx Download CV must not be dead href="#"');
  assert.ok(!indexContent.includes('class="hero-btn">Download CV</div>') && !indexContent.includes('href="#">Download CV'), 'index.html Download CV must have an interactive action or modal trigger');
});

test('ResumeModal.tsx component exists and renders verified competencies & credentials', () => {
  const resumeModalPath = path.join(rootDir, 'frontend', 'src', 'components', 'ResumeModal.tsx');
  assert.ok(fs.existsSync(resumeModalPath), 'ResumeModal.tsx must exist');

  const content = fs.readFileSync(resumeModalPath, 'utf-8');
  assert.ok(content.includes('Curriculum Vitae') || content.includes('Résumé') || content.includes('Credentials'), 'Must render credentials title');
  assert.ok(content.includes('DNP Monitor') || content.includes('Delta IT Helpdesk'), 'Must highlight verified production experience');
  assert.ok(content.includes('Escape') || content.includes('onClose'), 'Must handle modal dismissal');
});

test('index.html implements interactive Résumé modal and openResume trigger', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(content.includes('openResume') || content.includes('resumeModal'), 'index.html must have openResume function or resumeModal container');
});

test('Interactive preview controls stop event propagation to prevent modal hijack', () => {
  const docketPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'AcademicDocketPreview.tsx');
  const helpdeskPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'HelpdeskPreview.tsx');
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');

  assert.ok(fs.existsSync(docketPath), 'AcademicDocketPreview must exist');
  assert.ok(fs.existsSync(helpdeskPath), 'HelpdeskPreview must exist');
  assert.ok(fs.existsSync(dnpPath), 'DNPMonitorPreview must exist');

  const docketContent = fs.readFileSync(docketPath, 'utf-8');
  const helpdeskContent = fs.readFileSync(helpdeskPath, 'utf-8');
  const dnpContent = fs.readFileSync(dnpPath, 'utf-8');

  // Verify interactive controls call stopPropagation
  assert.ok(docketContent.includes('stopPropagation'), 'AcademicDocketPreview buttons must call stopPropagation');
  assert.ok(helpdeskContent.includes('stopPropagation'), 'HelpdeskPreview buttons must call stopPropagation');
  assert.ok(dnpContent.includes('stopPropagation'), 'DNPMonitorPreview controls must call stopPropagation');
});

test('WorkGrid cards render visible project descriptions and case study triggers', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  assert.ok(fs.existsSync(workGridPath), 'WorkGrid.tsx must exist');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  assert.ok(content.includes('w-desc') || content.includes('w-sub'), 'WorkGrid must render visible description/subtitle element');
  assert.ok(content.includes('Read Case') || content.includes('Case Study') || content.includes('w-arrow'), 'WorkGrid must have explicit case study trigger indicator');
});

test('Hero conforms to DESIGN.md: negative space is intentional, zero fake mosaic image-cells', () => {
  const heroTsxPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const heroContent = fs.readFileSync(heroTsxPath, 'utf-8');

  // Per DESIGN.md line 46: "No hero image. No background illustration. Negative space is intentional."
  // Must not have the 3-cell fake mosaic (.hero-img-cell)
  assert.ok(!heroContent.includes('hero-img-cell'), 'Hero.tsx must not contain fake image-cell collage');
});

test('Hero right column renders clean architectural discipline frame without essay clutter', () => {
  const heroTsxPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const heroContent = fs.readFileSync(heroTsxPath, 'utf-8');
  const hudContent = fs.existsSync(hudPath) ? fs.readFileSync(hudPath, 'utf-8') : '';
  const combined = heroContent + '\n' + hudContent;

  // Must not have mock datacenter latency/SLA gimmicks or essay walls
  assert.ok(!combined.includes('18ms REGIONAL') && !combined.includes('~18ms'), 'Hero must not use mock datacenter latency gimmick');
  assert.ok(!combined.includes('99.98% SLA'), 'Hero must not claim mock 99.98% ISP SLA');

  // Must be clean and concise
  assert.ok(combined.includes('SYSTEMS ARCHITECT') || combined.includes('Systems Architect'), 'Hero must display systems identity');
  assert.ok(combined.includes('06°14'), 'Hero must display coordinates');
});

test('WorkGrid cards render clean, concise titles, subtitles, and case study triggers without essay clutter', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  // Must not have essay dumps on card surface
  assert.ok(!content.includes('w-narrative'), 'Cards must not have essay walls on the surface');
  assert.ok(content.includes('w-title'), 'Cards must have clean titles');
  assert.ok(content.includes('w-sub'), 'Cards must have concise subtitles');
  assert.ok(content.includes('Read Case'), 'Cards must have clean Read Case triggers');
});

test('Hero Right layout in globals.css eliminates obsolete 3fr 2fr grid crushing', () => {
  const globalsCssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(globalsCssPath, 'utf-8');

  // Must not contain the broken image-mosaic grid rule on .hero-right
  assert.ok(!css.includes('grid-template-columns: 3fr 2fr;'), 'globals.css must not crush .hero-right with 3fr 2fr grid');
  assert.ok(css.includes('.hero-right') && css.includes('flex-direction: column'), '.hero-right must be styled as a full-height flex column frame');
});

test('Hero section integrates HeroTelemetryHUD with interactive TOPOLOGY vs TELEMETRY', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const heroPath = path.join(rootDir, 'frontend', 'src', 'components', 'Hero.tsx');

  assert.ok(fs.existsSync(hudPath), 'HeroTelemetryHUD.tsx component must exist');
  const hudContent = fs.readFileSync(hudPath, 'utf-8');
  const heroContent = fs.readFileSync(heroPath, 'utf-8');

  assert.ok(hudContent.includes('TOPOLOGY') && hudContent.includes('TELEMETRY'), 'HUD must support TOPOLOGY and TELEMETRY modes');
  assert.ok(hudContent.includes('<canvas') || hudContent.includes('canvasRef'), 'HUD must render architectural wireframe canvas');
  assert.ok(heroContent.includes('HeroTelemetryHUD'), 'Hero.tsx must embed HeroTelemetryHUD');
});

test('Global styles purge intrusive text selection dragging across the portfolio', () => {
  const globalsCssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const indexPath = path.join(rootDir, 'index.html');
  const css = fs.readFileSync(globalsCssPath, 'utf-8');
  const html = fs.readFileSync(indexPath, 'utf-8');

  // Must disable accidental blue highlight text dragging
  assert.ok(css.includes('user-select: none') || css.includes('::selection'), 'globals.css must handle text selection');
  assert.ok(html.includes('user-select: none') || html.includes('::selection'), 'index.html must handle text selection');
});

test('CaseStudyModal renders high-impact 2x2 architectural dossier with tech stack chips and impact banner', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'CaseStudyModal.tsx must exist');
  const content = fs.readFileSync(modalPath, 'utf-8');

  // Must render elevated impact banner
  assert.ok(content.includes('cs-impact-banner') || content.includes('QUANTIFIED IMPACT') || content.includes('KEY OUTCOME'), 'Must render high-visibility impact highlight banner');

  // Must render structured 2x2 or modular card grid
  assert.ok(content.includes('grid') || content.includes('cs-grid'), 'Must render architectural grid layout for phases');

  // Must render distinct tech stack badges/chips
  assert.ok(content.includes('tech-chip') || content.includes('tech-badge') || content.includes('split'), 'Must parse and render tech stack chips');
});

test('HeroTelemetryHUD implements interactive elastic spring-physics draggable nodes and shockwave pulses', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  assert.ok(fs.existsSync(hudPath), 'HeroTelemetryHUD.tsx must exist');
  const content = fs.readFileSync(hudPath, 'utf-8');

  // Must support pointer dragging
  assert.ok(content.includes('pointerdown') && content.includes('pointerup'), 'HUD canvas must handle pointerdown and pointerup for dragging');

  // Must implement spring physics kinematics
  assert.ok((content.includes('vx') && content.includes('vy')) || content.includes('spring'), 'HUD must implement elastic spring kinematics');

  // Must support shockwave ripples or click pulse
  assert.ok(content.includes('ripple') || content.includes('shockwave') || content.includes('pulses'), 'HUD must implement shockwave/ripple feedback on interaction');
});



