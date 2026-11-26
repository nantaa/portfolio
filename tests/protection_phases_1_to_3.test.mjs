import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ARCHIVED_MORIKU_FILES = [
  'user_manual_render.pdf',
  'check_raw_svg.html',
  'compare_cards.html',
  'final_verification.html',
  'inspect_final_comparison.html',
  'inspect_index_fixed.html',
  'inspect_v2.html',
  'manual_preview.html',
  'preview_layering.html',
  'preview_manual_wave.html',
  'preview_new_svgs.html',
  'preview_pic_color_coding.html',
  'test_preserve_none.html',
  'user_manual_preview.html',
  'verify_preview.html',
  'DNP-Logo-01.png',
  'target2.png',
  'favicon.png',
  'Vector 630.svg',
  'Vector 630_card.svg',
  'Vector 632.svg',
  'Vector 632_card.svg',
  'robots.txt',
];

test('Phase 1a: Verified unused Moriku & GeoPetak files are hidden in .internal_archive and preserved on disk', () => {
  const publicMoriku = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku');
  const rootMoriku = path.join(rootDir, 'projects', 'moriku');
  const archiveMoriku = path.join(rootDir, '.internal_archive', 'projects', 'moriku');

  for (const name of ARCHIVED_MORIKU_FILES) {
    assert.ok(!fs.existsSync(path.join(publicMoriku, name)), `public moriku/${name} must be hidden from public deploy`);
    assert.ok(!fs.existsSync(path.join(rootMoriku, name)), `root moriku/${name} must be hidden from root projects`);
    assert.ok(fs.existsSync(path.join(archiveMoriku, name)), `moriku/${name} must be preserved in .internal_archive`);
  }

  assert.ok(!fs.existsSync(path.join(publicMoriku, 'assets')), 'unused public moriku/assets must be archived');
  assert.ok(fs.existsSync(path.join(archiveMoriku, 'assets', 'index-COGktG1k.js')), 'moriku/assets must be preserved in .internal_archive');

  const dupGeoCssPublic = path.join(rootDir, 'frontend', 'public', 'projects', 'geopetak', 'assets', 'geolava-dev.webflow.shared.d563da239.min.css');
  const dupGeoCssArchive = path.join(rootDir, '.internal_archive', 'projects', 'geopetak', 'assets', 'geolava-dev.webflow.shared.d563da239.min.css');
  assert.ok(!fs.existsSync(dupGeoCssPublic), 'duplicate geopetak root CSS must be hidden from public assets');
  assert.ok(fs.existsSync(dupGeoCssArchive), 'duplicate geopetak CSS must be preserved in .internal_archive');

  // Actively referenced files must remain untouched in place
  assert.ok(fs.existsSync(path.join(rootDir, 'frontend', 'public', 'images', 'projects', 'bekasi_saturated.jpg')));
  assert.ok(fs.existsSync(path.join(publicMoriku, 'DNP Logo Baru.png')));
  assert.ok(fs.existsSync(path.join(publicMoriku, 'simulator.html')));
});

test('Phase 1b: Embedded project HTML fixtures scrub real corporate names, NIPs, and personal emails', () => {
  for (const base of ['frontend/public/projects', 'projects']) {
    const morikuHtml = fs.readFileSync(path.join(rootDir, base, 'moriku', 'index.html'), 'utf-8');
    for (const leaked of ['PT Indofood', 'PT Unilever', 'PT Krakatau Steel', 'PT Toyota Motor', 'PT Kalbe Farma', 'rifai.aryo@gmail.com']) {
      assert.ok(!morikuHtml.includes(leaked), `${base}/moriku/index.html must not expose ${leaked}`);
    }

    const maknaworksHtml = fs.readFileSync(path.join(rootDir, base, 'maknaworks', 'index.html'), 'utf-8');
    assert.ok(!maknaworksHtml.includes('aryo@maknaworks.co.id'), `${base}/maknaworks/index.html must scrub personal email`);
    assert.ok(maknaworksHtml.includes('window.self !== window.top'), `${base}/maknaworks/index.html must guard replaceState outside iframe`);

    const thesisHtml = fs.readFileSync(path.join(rootDir, base, 'thesis-docket', 'index.html'), 'utf-8');
    assert.ok(!thesisHtml.includes('ahmad.fauzi@upi.edu'), `${base}/thesis-docket/index.html must scrub staff email`);
    assert.ok(!thesisHtml.includes('197508202000032001'), `${base}/thesis-docket/index.html must scrub real NIP`);
  }
});

test('Phase 2a: WorkGrid.tsx and root index.html remove redundant View Project button while keeping card clicks interactive', () => {
  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  const rootIndex = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(!workGrid.includes('>View Project<') && !workGrid.includes('<span>View Project</span>'), 'WorkGrid must not render View Project button');
  assert.ok(workGrid.includes('role="button"') && workGrid.includes('aria-haspopup="dialog"'), 'WorkGrid card must act as accessible dialog trigger');
  assert.ok(workGrid.includes('e.key === "Enter" || e.key === " "'), 'WorkGrid card must activate on both Enter and Space');

  assert.ok(!rootIndex.includes('<span>View Project</span>'), 'root index.html must not render View Project button');
  assert.ok(rootIndex.includes('onclick="if(!event.target.closest(\'a\'))openCase('), 'root index.html .wc cards must open case study on box click without hijacking links');
});

test('Phase 2b: CaseStudyModal.tsx validates postMessage origin, drops broken sandbox, hides NDA direct launch, and iframes block inspect keys', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx'), 'utf-8');
  const guardLib = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'lib', 'inspectGuard.ts'), 'utf-8');

  assert.ok(guardLib.includes('isTrustedSameOrigin') && guardLib.includes('OriginCtor.from'), 'inspectGuard.ts must validate postMessage origin safely with Origin API + URL fallback');
  assert.ok(modal.includes('isTrustedSameOrigin(e)'), 'CaseStudyModal.tsx must verify e.origin before acting on postMessage');
  assert.ok(!modal.includes('sandbox="allow-scripts allow-same-origin allow-forms"'), 'CaseStudyModal.tsx must not combine allow-scripts and allow-same-origin in sandbox');
  assert.ok(modal.includes('![1, 3, 6].includes(p.id)') || modal.includes('![1, 3, 6].includes(project.id)'), 'CaseStudyModal.tsx must suppress direct tab bypass URL on NDA projects 1, 3, 6');

  for (const slug of ['geopetak', 'maknaworks', 'moriku', 'tata', 'thesis-docket', 'vaultr']) {
    const iframeHtml = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', slug, 'index.html'), 'utf-8');
    assert.ok(iframeHtml.includes('F12') && iframeHtml.includes('shiftKey'), `embedded ${slug}/index.html must block inspect shortcuts inside iframe window`);
  }
});

test('Phase 3: Next.js config, robots.txt, baked moodboard backup, and Nginx reference harden production deploy', () => {
  const nextConfig = fs.readFileSync(path.join(rootDir, 'frontend', 'next.config.ts'), 'utf-8');
  assert.ok(nextConfig.includes('productionBrowserSourceMaps: false'), 'next.config.ts must disable production source maps');
  assert.ok(nextConfig.includes('poweredByHeader: false'), 'next.config.ts must disable x-powered-by header');

  const robotsTs = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'robots.ts'), 'utf-8');
  const publicRobots = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'robots.txt'), 'utf-8');
  const rootRobots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf-8');
  for (const r of [robotsTs, publicRobots, rootRobots]) {
    assert.ok(r.includes('/projects/') && r.includes('/models/'), 'robots config must disallow /projects/ and /models/');
  }

  const nginxDoc = fs.readFileSync(path.join(rootDir, 'docs', 'nginx-portfolio.conf'), 'utf-8');
  assert.ok(nginxDoc.includes("frame-ancestors 'self'"), 'docs/nginx-portfolio.conf must lock frame-ancestors to self');
  assert.ok(nginxDoc.includes('X-Robots-Tag'), 'docs/nginx-portfolio.conf must emit X-Robots-Tag noindex for /projects/');
  assert.ok(nginxDoc.includes('X-Content-Type-Options'), 'docs/nginx-portfolio.conf must emit X-Content-Type-Options nosniff');

  assert.ok(fs.existsSync(path.join(rootDir, '.internal_archive', 'images', 'makna_works_branding_moodboard.original.webp')), 'unwatermarked original moodboard must be preserved in .internal_archive/images/');
});
