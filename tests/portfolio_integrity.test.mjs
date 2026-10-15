import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Portfolio static index.html has zero legacy dummy placeholders', () => {
  const indexPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(indexPath), 'index.html must exist');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Verify dummy placeholder titles and images are eradicated
  assert.ok(!content.includes('work1.jpg'), 'Legacy placeholder work1.jpg must not exist');
  assert.ok(!content.includes('Internal Operations Tool'), 'Placeholder Internal Operations Tool must be replaced');
  assert.ok(!content.includes('SaaS Onboarding Redesign'), 'Placeholder SaaS Onboarding Redesign must be replaced');
  assert.ok(!content.includes('Document Intelligence Pipeline'), 'Placeholder Document Intelligence Pipeline must be replaced');
});

test('Portfolio static index.html showcases verified real projects including Ulun Danu', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(content.includes('Industrial K3 Compliance Engine') || content.includes('K3 Statutory Compliance'), 'Must showcase descriptive Industrial K3 Compliance Engine');
  assert.ok(content.includes('Ulun Danu'), 'Must showcase Ulun Danu Material Studies');
  assert.ok(content.includes('Tata$'), 'Must showcase Tata$');
  assert.ok(content.includes('Thesis') || content.includes('Docket'), 'Must showcase Academic Thesis Docket');
  assert.ok(!content.includes('w-title">Vaultr</div>'), 'Vaultr must be replaced in active cards');
});

test('Frontend WorkGrid.tsx purges excluded stubs and showcases Ulun Danu and Tata$', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  assert.ok(fs.existsSync(workGridPath), 'WorkGrid.tsx must exist');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  // Must not have excluded stub / halfbaked projects
  assert.ok(!content.includes('Report Automation'), 'Report Automation stub must be removed');
  assert.ok(!content.includes('Kukujang'), 'Kukujang template must be replaced');
  assert.ok(!content.includes('title: "Vaultr"'), 'Vaultr must be replaced by Ulun Danu');

  // Must have approved real projects
  assert.ok(content.includes('Ulun Danu'), 'Must include Ulun Danu');
  assert.ok(content.includes('Tata$') || content.includes('TATA$'), 'Must include Tata$ or TATA$');
  assert.ok(content.includes('Geopetak'), 'Must include Geopetak');
  assert.ok(content.includes('Industrial K3 Compliance Engine'), 'Must name project descriptively as Industrial K3 Compliance Engine');
  assert.ok(content.includes('Delta IT Helpdesk'), 'Must include Delta IT Helpdesk');
  assert.ok(content.includes('Academic') || content.includes('Docket'), 'Must include Academic Docket');
});

test('Ulun Danu standalone static asset exists in public and root for low-resource zero-daemon hosting', () => {
  const publicPath = path.join(rootDir, 'frontend', 'public', 'ulun_danu_lake_bratan_material_studies.html');
  const rootHtmlPath = path.join(rootDir, 'ulun_danu_lake_bratan_material_studies.html');
  assert.ok(fs.existsSync(publicPath), 'frontend/public/ulun_danu_lake_bratan_material_studies.html must exist');
  assert.ok(fs.existsSync(rootHtmlPath), 'Root ulun_danu_lake_bratan_material_studies.html must exist');
});

test('UlunDanuPreview preview component embeds authentic diorama with resource-conscious query params and viewport gating', () => {
  const previewPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'UlunDanuPreview.tsx');
  assert.ok(fs.existsSync(previewPath), 'UlunDanuPreview.tsx must exist');
  const content = fs.readFileSync(previewPath, 'utf-8');
  assert.ok(content.includes('ulun_danu_lake_bratan_material_studies.html'), 'Must reference ulun_danu_lake_bratan_material_studies.html');
  assert.ok(content.includes('ui=0') && content.includes('compact=1'), 'Must pass embed parameters ui=0 and compact=1 to hide chrome');
  assert.ok(content.includes('quality=low') || content.includes('quality='), 'Must pass quality parameter to cap DPR on low resource devices');
  assert.ok(content.includes('IntersectionObserver'), 'Must implement IntersectionObserver to gate rendering strictly to viewport');
  assert.ok(content.includes('Open Full 3D Study') || content.includes('Launch 3D Diorama'), 'Must provide external action trigger for full unconstrained diorama');
});

test('TataPreview showcases 3D bag as focal point with bold Tata$ name behind bag', () => {
  const previewPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'TataPreview.tsx');
  const globalsCss = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(previewPath), 'TataPreview.tsx must exist');
  const previewContent = fs.readFileSync(previewPath, 'utf-8');
  const cssContent = fs.readFileSync(globalsCss, 'utf-8');

  // Must render big name Tata$ backdrop
  assert.ok(previewContent.includes('tata-watermark') || previewContent.includes('tata-backdrop-brand'), 'TataPreview must render big name watermark element');
  assert.ok(cssContent.includes('.tata-watermark') || cssContent.includes('.tata-backdrop-brand'), 'globals.css must style big name watermark element behind canvas');
});

test('DESIGN.md documents the approved project lineup', () => {
  const designPath = path.join(rootDir, 'DESIGN.md');
  assert.ok(fs.existsSync(designPath), 'DESIGN.md must exist');
  const content = fs.readFileSync(designPath, 'utf-8');
  assert.ok(content.includes('K3 Compliance Engine') || content.includes('DNP Monitor'), 'DESIGN.md must document K3 Compliance Engine');
  assert.ok(content.includes('Ulun Danu'), 'DESIGN.md must document Ulun Danu');
  assert.ok(content.includes('Tata$'), 'DESIGN.md must document Tata$');
});

test('CaseStudyModal component exists and implements readable DESIGN.md Case Framework without microscopic text', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'CaseStudyModal.tsx must exist');
  const content = fs.readFileSync(modalPath, 'utf-8');
  assert.ok(content.includes('PROBLEM'), 'Must have PROBLEM section');
  assert.ok(content.includes('THINKING'), 'Must have THINKING section');
  assert.ok(content.includes('EXECUTION'), 'Must have EXECUTION section');
  assert.ok(content.includes('RESULT'), 'Must have RESULT section');
  assert.ok(content.includes('Escape') || content.includes('onClose'), 'Must handle modal dismissal');

  // Verify readability: widened container, readable body copy (15px-17px) rather than microscopic 12px
  assert.ok(content.includes('max-w-[940px]') || content.includes('max-w-[920px]') || content.includes('max-w-4xl'), 'Modal container must be comfortably widened');
  assert.ok(content.includes('text-[15px]') || content.includes('text-[16px]') || content.includes('text-base'), 'Dossier body paragraphs must use comfortable readable font size');
});

test('Frontend WorkGrid.tsx wires dedicated button for CaseStudyModal to prevent 3D canvas click hijack', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  const content = fs.readFileSync(workGridPath, 'utf-8');
  assert.ok(content.includes('CaseStudyModal'), 'WorkGrid must import CaseStudyModal');
  assert.ok(content.includes('selectedProject') || content.includes('activeProject'), 'WorkGrid must manage selected project state');

  // Must NOT attach modal onClick to the outer .wc card container (which hijacks 3D dragging/controls)
  assert.ok(!content.includes('className={`wc wc-interactive cursor-pointer group focus:outline-none focus-visible:outline-none`}\n              onClick={() => setSelectedProject(project)}'), 'Outer card container must not hijack clicks with setSelectedProject');

  // Must have dedicated button for opening case dossier
  assert.ok(content.includes('case-dossier-btn') || content.includes('case-study-btn'), 'Must have dedicated button for opening case study');
});

test('Portfolio index.html implements interactive Case Framework modal', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');
  assert.ok(content.includes('case-modal') || content.includes('caseModal'), 'index.html must have case modal element or handler');
  assert.ok(content.includes('openCase') || content.includes('showCase'), 'index.html must have function to open case study');
});

test('GeopetakPreview loads authentic Bekasi GIS layers (xray, saturated, mesh)', () => {
  const geoPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'GeopetakPreview.tsx');
  assert.ok(fs.existsSync(geoPath), 'GeopetakPreview.tsx must exist');
  const content = fs.readFileSync(geoPath, 'utf-8');

  assert.ok(content.includes('bekasi_saturated.jpg'), 'Geopetak must load bekasi_saturated.jpg');
  assert.ok(content.includes('bekasi_xray.jpg'), 'Geopetak must load bekasi_xray.jpg');
  assert.ok(content.includes('bekasi_mesh.jpg'), 'Geopetak must load bekasi_mesh.jpg');
});

test('DNPMonitorPreview implements Docket-inspired 3-tab architecture and horizontal side-scroll', () => {
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');
  assert.ok(fs.existsSync(dnpPath), 'DNPMonitorPreview.tsx must exist');
  const content = fs.readFileSync(dnpPath, 'utf-8');

  // Must implement Docket-inspired 3-tab formulation
  assert.ok(content.includes('SLA Pipeline'), 'Must have SLA Pipeline tab');
  assert.ok(content.includes('Inspection Kanban'), 'Must have Inspection Kanban tab');
  assert.ok(content.includes('Statutory Forms'), 'Must have Statutory Forms tab');

  // Must have horizontal side-scroll for kanban lanes to maintain readability
  assert.ok(content.includes('overflow-x-auto') || content.includes('overflow-x-scroll'), 'Kanban must have horizontal side scroll container');

  // Must reflect authentic production pipeline inspected from monitor-dnp.deltaindo.co.id
  assert.ok(content.includes('PO / SPK / PROPOSAL') || content.includes('PELAKSANAAN RU'), 'Must have authentic K3 stage names');
  assert.ok(content.includes('TIM RIKSA UJI') || content.includes('OVERDUE'), 'Must have authentic inspector or SLA badges');
  assert.ok(content.includes('Boiler') || content.includes('Form') || content.includes('Listrik'), 'Must have authentic statutory K3 inspection form standards');
});

test('Hero section purges pseudo-military // DOSSIER label in favor of clean architectural naming', () => {
  const heroHud = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(!heroHud.includes('// DOSSIER'), 'HeroTelemetryHUD should not use // DOSSIER');
  assert.ok(!indexHtml.includes('// TECHNICAL DOSSIER'), 'index.html should not use // TECHNICAL DOSSIER');
  assert.ok(heroHud.includes('SYSTEM ARCHITECTURE') || heroHud.includes('SYSTEM TOPOLOGY'), 'HeroTelemetryHUD must display clean architectural title');
});

test('WorkGrid cards suppress intrusive default white focus outline on selection', () => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  assert.ok(globalsCss.includes('.wc:focus') && globalsCss.includes('outline: none'), 'globals.css must reset .wc:focus outline');
  assert.ok(indexHtml.includes('.wc:focus') && indexHtml.includes('outline: none'), 'index.html must reset .wc:focus outline');
  assert.ok(workGrid.includes('focus:outline-none'), 'WorkGrid.tsx must include focus:outline-none class');
});

test('DNPMonitorPreview implements authentic 16-stage Disnaker statutory Kanban without emoticons', () => {
  const content = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx'), 'utf-8');
  assert.ok(content.includes('16 Tahap') || content.includes('16-Stage') || content.includes('16 Stages') || content.includes('16'), 'Must model 16 stages');
  assert.ok(content.includes('Pelaksanaan RU') && content.includes('Penyusunan LHPP') && content.includes('Proses Disnaker'), 'Must include statutory stages');
  assert.ok(content.includes('MKT') && content.includes('TRU') && content.includes('AHLI'), 'Must include operational role badges');
  
  // Assert zero emoji or AI artifacts (e.g. 💡, 📜, 🔄, 👁️, 📋, etc.)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(content), 'DNPMonitorPreview must not contain emojis or AI signatures');
});

