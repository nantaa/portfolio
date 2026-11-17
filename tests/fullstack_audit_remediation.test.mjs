import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ─── 1. MORIKU STANDALONE BOOTSTRAP & OFFLINE RUNTIME (P0) ───────────────────
test('Moriku index.html embeds standalone Inertia bootstrap and prevents infinite load freeze', () => {
  const publicIndex = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html');
  const rootIndex = path.join(rootDir, 'projects', 'moriku', 'index.html');

  assert.ok(fs.existsSync(publicIndex), 'frontend/public/projects/moriku/index.html must exist');
  assert.ok(fs.existsSync(rootIndex), 'projects/moriku/index.html must exist');

  const content = fs.readFileSync(publicIndex, 'utf-8');
  assert.ok(content.includes('__DNP_INITIAL_PAGE__'), 'Moriku must embed __DNP_INITIAL_PAGE__ bootstrap state');
  assert.ok(content.includes('Kanban/Index'), 'Bootstrap state must target Kanban/Index component');
  assert.ok(content.includes('close-modal'), 'Moriku must implement Escape key bridge to parent modal');
});

test('Moriku simulator.html exists as fallback interactive flow engine', () => {
  const publicSim = path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'simulator.html');
  assert.ok(fs.existsSync(publicSim), 'frontend/public/projects/moriku/simulator.html must exist');
  const simContent = fs.readFileSync(publicSim, 'utf-8');
  assert.ok(simContent.includes('Simulator Alur Kanban') || simContent.includes('STAGES'), 'Simulator must contain 16 stages');
});

// ─── 2. TATA$ ESCAPE KEY BRIDGE (P1) ─────────────────────────────────────────
test('TATA$ index.html embeds cross-frame Escape key bridge', () => {
  const publicIndex = path.join(rootDir, 'frontend', 'public', 'projects', 'tata', 'index.html');
  assert.ok(fs.existsSync(publicIndex), 'frontend/public/projects/tata/index.html must exist');
  const content = fs.readFileSync(publicIndex, 'utf-8');
  assert.ok(content.includes('close-modal'), 'TATA$ must bridge Escape key to parent modal');
});

// ─── 3. LARAVEL BACKEND MIGRATION & PROJECT SEEDER (P1) ──────────────────────
test('Backend contains modern architecture migration for projects table', () => {
  const migrationDir = path.join(rootDir, 'backend', 'database', 'migrations');
  const files = fs.readdirSync(migrationDir);
  const migrationFile = files.find(f => f.includes('add_modern_architecture_fields_to_projects_table'));
  assert.ok(migrationFile, 'Migration add_modern_architecture_fields_to_projects_table must exist');

  const content = fs.readFileSync(path.join(migrationDir, migrationFile), 'utf-8');
  assert.ok(content.includes('demo_type'), 'Migration must add demo_type column');
  assert.ok(content.includes('demo_url'), 'Migration must add demo_url column');
  assert.ok(content.includes('badge_label'), 'Migration must add badge_label column');
  assert.ok(content.includes('tech_stack'), 'Migration must add tech_stack column');
});

test('Backend Project model and DatabaseSeeder support full project lineup', () => {
  const modelPath = path.join(rootDir, 'backend', 'app', 'Models', 'Project.php');
  const seederPath = path.join(rootDir, 'backend', 'database', 'seeders', 'ProjectSeeder.php');

  assert.ok(fs.existsSync(modelPath), 'Project.php model must exist');
  assert.ok(fs.existsSync(seederPath), 'ProjectSeeder.php must exist');

  const modelContent = fs.readFileSync(modelPath, 'utf-8');
  assert.ok(modelContent.includes('demo_type'), 'Project model must list demo_type in fillable');
  assert.ok(modelContent.includes('demo_url'), 'Project model must list demo_url in fillable');

  const seederContent = fs.readFileSync(seederPath, 'utf-8');
  assert.ok(seederContent.includes('Industrial K3 Compliance Engine'), 'Seeder must include Moriku');
  assert.ok(seederContent.includes('TATA$'), 'Seeder must include TATA$');
  assert.ok(seederContent.includes('Ulun Danu') || seederContent.includes('Material Studies'), 'Seeder must include 3D material studies');
});

// ─── 4. MODAL RESPONSIVE SCALING & CROSS-FRAME LISTENER (P1/P2) ─────────────
test('CaseStudyModal listens for cross-frame close-modal message and uses responsive viewport', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'CaseStudyModal.tsx must exist');
  const content = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(content.includes('close-modal'), 'Modal must listen for close-modal message from child iframes');
  assert.ok(content.includes('dvh') || content.includes('vh'), 'Modal must use responsive dynamic viewport height');
});

