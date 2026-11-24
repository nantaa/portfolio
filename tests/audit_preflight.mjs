import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];

// 1. Audit frontend/public/projects/moriku/index.html
const indexHtmlPath = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  errors.push('Missing frontend/public/projects/moriku/index.html');
} else {
  const html = fs.readFileSync(indexHtmlPath, 'utf8');

  // Check CSS
  const cssMatches = [...html.matchAll(/href=["'](\.\/build\/assets\/[^"']+|\/projects\/moriku\/build\/assets\/[^"']+)["']/g)];
  for (const match of cssMatches) {
    const raw = match[1].replace('./build/', 'frontend/public/projects/moriku/build/');
    const full = path.join(rootDir, raw);
    if (!fs.existsSync(full)) {
      errors.push(`Missing CSS file referenced in index.html: ${raw}`);
    }
  }

  // Check JS modules
  const jsMatches = [...html.matchAll(/src=["'](\.\/build\/assets\/[^"']+|\/projects\/moriku\/build\/assets\/[^"']+)["']/g)];
  for (const match of jsMatches) {
    const raw = match[1].replace('./build/', 'frontend/public/projects/moriku/build/');
    const full = path.join(rootDir, raw);
    if (!fs.existsSync(full)) {
      errors.push(`Missing JS module referenced in index.html: ${raw}`);
    }
  }

  // Check initial data-page
  if (!html.includes('data-page=')) {
    errors.push('index.html is missing data-page attribute on #app');
  }
}

// 2. Audit manifest.json chunks against disk
const manifestPath = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'build', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  errors.push('Missing frontend/public/projects/moriku/build/manifest.json');
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const assetsDir = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'build');

  for (const [key, item] of Object.entries(manifest)) {
    if (item.file) {
      const filePath = path.join(assetsDir, item.file);
      if (!fs.existsSync(filePath)) {
        errors.push(`Manifest declares file that does not exist on disk: ${item.file}`);
      }
    }
  }
}

// 3. Audit iframe embeddability in entry JS
const appJsPath = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'build', 'assets', 'app-CLJ6yzA7.js');
if (!fs.existsSync(appJsPath)) {
  errors.push('Missing app-CLJ6yzA7.js');
} else {
  const appJs = fs.readFileSync(appJsPath, 'utf8');
  if (appJs.includes('window.top.location')) {
    errors.push('app-CLJ6yzA7.js contains hostile frame-buster script that hijacks window.top!');
  }
}

// 4. Audit migrations in projects/moriku/database/migrations
const migDir = path.join(rootDir, 'projects', 'moriku', 'database', 'migrations');
if (!fs.existsSync(migDir)) {
  errors.push('Missing projects/moriku/database/migrations directory');
} else {
  const migs = fs.readdirSync(migDir);
  if (migs.length < 30) {
    errors.push(`Found only ${migs.length} migrations in ${migDir} (expected at least 30)`);
  }
}

// 5. Audit CaseStudyModal.tsx
const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
if (!fs.existsSync(modalPath)) {
  errors.push('Missing CaseStudyModal.tsx');
} else {
  const modalCode = fs.readFileSync(modalPath, 'utf8');
  if (!modalCode.includes('overflow-y-auto')) {
    errors.push('CaseStudyModal.tsx does not have overflow-y-auto for scrollability');
  }
  if (!modalCode.includes('/projects/moriku/simulator.html') && !modalCode.includes('/projects/moriku/index.html')) {
    errors.push('CaseStudyModal.tsx does not reference Moriku runtime');
  }
  if (modalCode.includes('1:1 LIVE SYSTEM / ENTERPRISE WORKFLOW')) {
    errors.push('CaseStudyModal.tsx contains legacy AI slop badge');
  }
}

console.log('--- PREFLIGHT AUDIT REPORT ---');
console.log(`Status: ${errors.length === 0 ? 'PASSED' : 'FAILED'}`);
console.log(`Errors: ${errors.length}`);
errors.forEach(e => console.log(`  [ERROR] ${e}`));
console.log(`Warnings: ${warnings.length}`);
warnings.forEach(w => console.log(`  [WARN] ${w}`));

if (errors.length > 0) {
  process.exit(1);
}

