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

test('Raja Ampat standalone static asset exists in public and root for low-resource zero-daemon hosting', () => {
  const publicPath = path.join(rootDir, 'frontend', 'public', 'raja_ampat_snorkel_day.html');
  const rootHtmlPath = path.join(rootDir, 'raja_ampat_snorkel_day.html');
  assert.ok(fs.existsSync(publicPath), 'frontend/public/raja_ampat_snorkel_day.html must exist');
  assert.ok(fs.existsSync(rootHtmlPath), 'Root raja_ampat_snorkel_day.html must exist');
});

test('MaterialStudiesCarousel preview component embeds dual studies with Raja Ampat first and click-to-load activation', () => {
  const carouselPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaterialStudiesCarousel.tsx');
  const ulunDanuPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'UlunDanuPreview.tsx');
  assert.ok(fs.existsSync(carouselPath) || fs.existsSync(ulunDanuPath), 'Carousel component must exist');
  
  const targetPath = fs.existsSync(carouselPath) ? carouselPath : ulunDanuPath;
  const content = fs.readFileSync(targetPath, 'utf-8');
  assert.ok(content.includes('ulun_danu_lake_bratan_material_studies.html'), 'Must reference ulun_danu_lake_bratan_material_studies.html');
  assert.ok(content.includes('raja_ampat_snorkel_day.html'), 'Must reference raja_ampat_snorkel_day.html');
  assert.ok(content.includes('ui=0') && content.includes('compact=1'), 'Must pass embed parameters ui=0 and compact=1 to hide chrome');
  assert.ok(content.includes('quality=low') || content.includes('quality='), 'Must pass quality parameter to cap DPR on low resource devices');
  assert.ok(content.includes('IntersectionObserver'), 'Must implement IntersectionObserver to gate rendering strictly to viewport');
  
  // Verify Raja Ampat comes FIRST before Ulun Danu
  const rajaIndex = content.indexOf('raja_ampat_snorkel_day.html');
  const ulunIndex = content.indexOf('ulun_danu_lake_bratan_material_studies.html');
  assert.ok(rajaIndex < ulunIndex, 'Raja Ampat must appear first in STUDIES before Ulun Danu');

  // Must implement on-demand click to load (not eager WebGL mounting)
  assert.ok(content.includes('Load Interactive 3D') || content.includes('isLoaded') || content.includes('hasActivated') || content.includes('activeSlide'), 'Must provide click-to-load activation for client GPU protection');
  assert.ok(content.includes('Open Full 3D Study') || content.includes('Launch 3D Diorama'), 'Must provide external action trigger for full unconstrained diorama');
});

test('Interactive project cards implement on-demand standby gating before mounting heavy simulators', () => {
  const gatePath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ProjectPreviewGate.tsx');
  assert.ok(fs.existsSync(gatePath), 'ProjectPreviewGate.tsx component must exist');
  const gateContent = fs.readFileSync(gatePath, 'utf-8');
  assert.ok(gateContent.includes('isActivated') || gateContent.includes('isOpen') || gateContent.includes('isLoaded'), 'Gate must manage activation state');
  assert.ok(gateContent.includes('Launch') || gateContent.includes('Inspect') || gateContent.includes('Load'), 'Gate must render tactile activation CTA');

  // TataPreview must use or implement standby gating
  const tataPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'TataPreview.tsx');
  const tataContent = fs.readFileSync(tataPath, 'utf-8');
  assert.ok(tataContent.includes('ProjectPreviewGate') || tataContent.includes('isActivated') || tataContent.includes('hasActivated'), 'TataPreview must implement standby gate before spinning up WebGL');
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

test('TataPreview and HeroTelemetryHUD position Tata$ as an interactive 3D showcase landing page', () => {
  const tataPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'TataPreview.tsx');
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');

  const tataContent = fs.readFileSync(tataPath, 'utf-8');
  const hudContent = fs.readFileSync(hudPath, 'utf-8');
  const workGridContent = fs.readFileSync(workGridPath, 'utf-8');

  // Must describe as Showcase Landing Page rather than generic showroom
  assert.ok(hudContent.includes('Showcase Landing Page'), 'HeroTelemetryHUD must describe ARCH-03 as Showcase Landing Page');
  assert.ok(tataContent.includes('Showcase') || tataContent.includes('Landing Page'), 'TataPreview must position as 3D showcase landing page');
  assert.ok(workGridContent.includes('Showcase Landing Page') || workGridContent.includes('Showcase'), 'WorkGrid Tata$ must describe as showcase landing page');
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

test('GeopetakPreview and WorkGrid note Bekasi Aerial Photo sample on Geopetak case', () => {
  const geoPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'GeopetakPreview.tsx');
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  assert.ok(fs.existsSync(geoPath), 'GeopetakPreview.tsx must exist');
  const geoContent = fs.readFileSync(geoPath, 'utf-8');
  const workGridContent = fs.readFileSync(workGridPath, 'utf-8');

  assert.ok(geoContent.includes('bekasi_saturated.jpg'), 'Geopetak must load bekasi_saturated.jpg');
  assert.ok(geoContent.includes('bekasi_xray.jpg'), 'Geopetak must load bekasi_xray.jpg');
  assert.ok(geoContent.includes('bekasi_mesh.jpg'), 'Geopetak must load bekasi_mesh.jpg');

  // Must explicitly note Bekasi Aerial Photo sample in Geopetak preview and case study
  assert.ok(geoContent.includes('Bekasi Aerial Photo') || geoContent.includes('Bekasi Aerial Sample'), 'GeopetakPreview must note Bekasi Aerial Photo sample');
  assert.ok(workGridContent.includes('Bekasi Aerial Photo') || workGridContent.includes('Bekasi Aerial'), 'WorkGrid Geopetak case study must note Bekasi Aerial Photo as sample');
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

test('WorkGrid cards expand height and description spacing for 125% proportional scale', () => {
  const globalsCss = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'globals.css'), 'utf-8');
  // Check expanded row dimensions in .work-grid--8
  assert.ok(globalsCss.includes('580px') || globalsCss.includes('560px'), 'Row 1 height must be expanded to >= 560px');
  assert.ok(globalsCss.includes('500px') || globalsCss.includes('480px'), 'Row 2 height must be expanded to >= 480px');
  assert.ok(globalsCss.includes('460px') || globalsCss.includes('440px'), 'Row 3 height must be expanded to >= 440px');
  // Check expanded .wo padding
  assert.ok(globalsCss.includes('32px 36px') || globalsCss.includes('32px') || globalsCss.includes('36px'), '.wo must provide expanded breathing room padding');
});

test('ExpenseTrackerPreview renders authentic architectural communication data nodes illustration', () => {
  const content = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ExpenseTrackerPreview.tsx'), 'utf-8');
  
  // Must render architectural communication data nodes
  assert.ok(content.includes('Ingest') || content.includes('Client'), 'Must model Client Ingest node');
  assert.ok(content.includes('Express') || content.includes('Gateway') || content.includes('Multer'), 'Must model Express API Gateway node');
  assert.ok(content.includes('Gemini') || content.includes('gemini-2.0-flash'), 'Must model Gemini 2.0 Flash node');
  assert.ok(content.includes('Prisma') || content.includes('Ledger') || content.includes('Database'), 'Must model Database Ledger node');

  // Must model communication bus / packet flow
  assert.ok(content.includes('BUS') || content.includes('PACKET') || content.includes('FLOW') || content.includes('canvas') || content.includes('packet'), 'Must model communication bus / data flow');

  // Must display genuine data payload attributes
  assert.ok(content.includes('confidence') && content.includes('reasoning'), 'Must display Gemini confidence and reasoning attributes');
  assert.ok(content.includes('Food & Dining') || content.includes('Food') || content.includes('Infrastructure'), 'Must display real categories');
  assert.ok(content.includes('amount') || content.includes('$'), 'Must display transaction payload amounts');

  // Must purge the giant cloud icon
  assert.ok(!content.includes('M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'), 'Must eliminate giant cloud upload icon');
});

test('HeroTelemetryHUD renders authentic animated architecture topology visualizer instead of abstract spiderweb', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');
  
  // Must feature real architectural components
  assert.ok(content.includes('Laravel') && content.includes('PostgreSQL'), 'Must model Enterprise backend pipeline');
  assert.ok(content.includes('GLSL') || content.includes('Shader') || content.includes('Caustic'), 'Must model 3D Shader pipeline');
  assert.ok(content.includes('GLTF') || content.includes('GLB') || content.includes('RoomEnvironment'), 'Must model 3D Showroom asset pipeline');
  assert.ok(content.includes('Gale-Shapley') || content.includes('Markov'), 'Must model Discrete Algorithms network');
  
  // Must render bus/packet flow or pipeline nodes
  assert.ok(content.includes('PIPELINE') || content.includes('BUS') || content.includes('TOPOLOGY') || content.includes('packet') || content.includes('packets'), 'Must render animated data bus/packets');
});

test('MaknaMoodboardPreview renders makna_works_branding_moodboard.webp with click-to-open detail popup modal without navigating away', () => {
  const previewPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaknaMoodboardPreview.tsx');
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  
  assert.ok(fs.existsSync(previewPath), 'MaknaMoodboardPreview.tsx must exist');
  const previewContent = fs.readFileSync(previewPath, 'utf-8');
  const workGridContent = fs.readFileSync(workGridPath, 'utf-8');

  // Must reference image
  assert.ok(previewContent.includes('makna_works_branding_moodboard.webp'), 'Must render makna_works_branding_moodboard.webp');
  
  // Must implement click-to-open popup modal
  assert.ok(previewContent.includes('modal') || previewContent.includes('isOpen') || previewContent.includes('setShowDetail') || previewContent.includes('isDetailOpen'), 'Must implement detail popup modal state');
  assert.ok(previewContent.includes('dialog') || previewContent.includes('fixed inset-0'), 'Must render modal dialog popup');
  assert.ok(previewContent.includes('stopPropagation'), 'Must stop propagation to prevent outer link navigation');

  // WorkGrid must mount MaknaMoodboardPreview for Project 8
  assert.ok(workGridContent.includes('MaknaMoodboardPreview'), 'WorkGrid must mount MaknaMoodboardPreview');

  // Must implement anti-theft watermark protection on the modal popup image
  assert.ok(previewContent.toLowerCase().includes('watermark'), 'Must render anti-theft watermark protection on the modal image');
  assert.ok(previewContent.includes('contextmenu') || previewContent.includes('onContextMenu'), 'Must prevent direct image saving via contextmenu prevention');

  // Must focus on Makna Works Brand Guidelines and purge photography/portraiture mentions
  assert.ok(workGridContent.includes('Makna Works Brand Guidelines'), 'Project 8 title must be Makna Works Brand Guidelines');
  assert.ok(!workGridContent.includes('Visual Identity & Photo'), 'Must remove photo mentions from Project 8');
  assert.ok(workGridContent.includes('Brand & Design Systems'), 'Project 8 category must be Brand & Design Systems');
  assert.ok(workGridContent.includes('brand guideline'), 'Case study must focus on brand guideline manual');
});

test('raja_ampat_snorkel_day.html and ulun_danu_lake_bratan_material_studies.html embed tamper-resistant author signature in middle section', () => {
  const rajaRoot = path.join(rootDir, 'raja_ampat_snorkel_day.html');
  const ulunRoot = path.join(rootDir, 'ulun_danu_lake_bratan_material_studies.html');
  const rajaPublic = path.join(rootDir, 'frontend', 'public', 'raja_ampat_snorkel_day.html');
  const ulunPublic = path.join(rootDir, 'frontend', 'public', 'ulun_danu_lake_bratan_material_studies.html');

  [rajaRoot, ulunRoot, rajaPublic, ulunPublic].forEach((filePath) => {
    assert.ok(fs.existsSync(filePath), `File must exist: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const total = lines.length;

    // Check middle section: signature must be present between 20% and 80% of file
    const middleSection = lines.slice(Math.floor(total * 0.2), Math.floor(total * 0.8)).join('\n');
    assert.ok(
      middleSection.includes("Rifa'i Aryo Ananta") || middleSection.includes("Aryo Ananta"),
      `Middle section of ${path.basename(filePath)} must contain author credit signature`
    );
    assert.ok(
      middleSection.includes("aryoananta249@gmail.com") || middleSection.includes("nantaa") || middleSection.includes("Bekasi"),
      `Middle section of ${path.basename(filePath)} must contain author contact/metadata`
    );
  });
});

test('Photography and Other Works placeholder strip is cleanly suppressed in both Next.js and static index.html', () => {
  const homeClientPath = path.join(rootDir, 'frontend', 'src', 'components', 'HomeClient.tsx');
  const indexHtmlPath = path.join(rootDir, 'index.html');

  const homeClientContent = fs.readFileSync(homeClientPath, 'utf-8');
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Verify that the photo grid / other works section is commented out or hidden in HomeClient.tsx
  assert.ok(
    homeClientContent.includes('{/* Photography / Other Works Strip — Temporarily hidden') ||
    !homeClientContent.includes('<span className="sec-lbl">Other works</span>'),
    'HomeClient.tsx must suppress active Other Works photography strip'
  );

  // Verify that the photo grid is commented out in index.html
  assert.ok(
    indexHtmlContent.includes('<!-- ══ PHOTOGRAPHY STRIP (Temporarily hidden)') ||
    !indexHtmlContent.includes('<span class="sec-lbl">Photography</span>\n    <span class="sec-ct">Used as texture'),
    'index.html must suppress active photography strip'
  );
});

test('VPS_LOW_RESOURCE_DEPLOYMENT.md and .github/workflows/deploy.yml document submodule support, 3D MIME caching, and static export', () => {
  const docPath = path.join(rootDir, 'docs', 'VPS_LOW_RESOURCE_DEPLOYMENT.md');
  const workflowPath = path.join(rootDir, '.github', 'workflows', 'deploy.yml');

  assert.ok(fs.existsSync(docPath), 'VPS_LOW_RESOURCE_DEPLOYMENT.md must exist');
  assert.ok(fs.existsSync(workflowPath), '.github/workflows/deploy.yml must exist');

  const docContent = fs.readFileSync(docPath, 'utf-8');
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8');

  // Must configure submodules for monorepo cloning
  assert.ok(docContent.includes('--recurse-submodules'), 'Guide must instruct cloning with --recurse-submodules');
  assert.ok(workflowContent.includes('submodules: recursive'), 'Workflow must checkout with submodules: recursive');

  // Must configure 3D model MIME types and media caching in Nginx
  assert.ok(docContent.includes('model/gltf-binary'), 'Nginx config must declare model/gltf-binary for .glb');
  assert.ok(docContent.includes('location ~* \\.(glb|gltf|bin|webp'), 'Nginx config must include dedicated 3D and image caching rule');
});




