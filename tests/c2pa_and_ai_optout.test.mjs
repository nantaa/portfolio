import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SVG_TARGETS = [
  'logo-svg.svg',
  'frontend/public/logo-svg.svg',
  'frontend/public/projects/geopetak/assets/geopetak-logo.svg',
  'frontend/public/projects/geopetak/assets/geopetak-footer-logo.svg',
  'frontend/public/projects/geopetak/assets/geopetak-icon.svg',
  'projects/geopetak/assets/geopetak-logo.svg',
  'projects/geopetak/assets/geopetak-footer-logo.svg',
  'projects/geopetak/assets/geopetak-icon.svg',
];

test('Brand and GeoPetak SVGs embed C2PA-structured signed metadata manifests', () => {
  const scriptPath = path.join(rootDir, 'scripts', 'sign_svgs_c2pa.py');
  assert.ok(fs.existsSync(scriptPath), 'scripts/sign_svgs_c2pa.py must exist');

  for (const rel of SVG_TARGETS) {
    const svg = fs.readFileSync(path.join(rootDir, rel), 'utf-8');
    assert.ok(svg.includes('<metadata>') && svg.includes('xmlns:c2pa="http://c2pa.org/manifest"'), `${rel} must embed <metadata> with c2pa namespace`);
    assert.ok(svg.includes('<c2pa:manifest '), `${rel} must embed <c2pa:manifest> payload`);
  }

  const out = execFileSync('python', [scriptPath, 'verify'], { cwd: rootDir, encoding: 'utf-8' });
  const report = JSON.parse(out);
  assert.equal(report.total_svgs, SVG_TARGETS.length);
  assert.equal(report.failed.length, 0, `All SVGs must pass ECDSA + SHA-256 verification: ${out}`);
});

test('robots.ts and robots.txt explicitly block AI crawlers alongside /projects/ and /models/', () => {
  const aiBots = ['GPTBot', 'CCBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'Bytespider', 'Meta-ExternalAgent', 'OAI-SearchBot'];
  const robotsTs = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'app', 'robots.ts'), 'utf-8');
  const publicRobots = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'robots.txt'), 'utf-8');
  const rootRobots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf-8');

  for (const bot of aiBots) {
    assert.ok(robotsTs.includes(bot), `robots.ts must list ${bot}`);
    assert.ok(publicRobots.includes(bot), `frontend/public/robots.txt must list ${bot}`);
    assert.ok(rootRobots.includes(bot), `robots.txt must list ${bot}`);
  }
});

test('docs/nginx-portfolio.conf enforces noai and noimageai X-Robots-Tag directives', () => {
  const nginxConf = fs.readFileSync(path.join(rootDir, 'docs', 'nginx-portfolio.conf'), 'utf-8');
  assert.ok(nginxConf.includes('noai') && nginxConf.includes('noimageai'), 'docs/nginx-portfolio.conf must enforce noai, noimageai');
});

