import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const tridhataDir = 'D:\\Document Backup\\website-aryo\\tridhata';

test('tridhata repo has zero remaining tridhata or tridahata references in tracked files', () => {
  if (!fs.existsSync(tridhataDir)) return;

  const filesOut = execSync(`git -C "${tridhataDir}" grep -l -i -E "tridhata|tridahata" || exit 0`, {
    encoding: 'utf-8',
  }).trim();

  assert.equal(filesOut, '', `Expected 0 files matching tridhata/tridahata, found:\n${filesOut}`);
  assert.ok(fs.existsSync(path.join(tridhataDir, 'maknaworks.md')), 'maknaworks.md must exist');
  assert.ok(!fs.existsSync(path.join(tridhataDir, 'tridhata.md')), 'tridhata.md must not exist');
  assert.ok(
    fs.existsSync(path.join(tridhataDir, 'apps', 'web', 'src', 'components', 'img', 'maknaworks logo.png')),
    'maknaworks logo.png must exist'
  );
  assert.ok(
    !fs.existsSync(path.join(tridhataDir, 'apps', 'web', 'src', 'components', 'img', 'tridahata logo.png')),
    'tridahata logo.png must not exist'
  );
});

test('portfolio-website maknaworks showcase references existing rebuilt assets', () => {
  const dirs = [
    path.join(rootDir, 'frontend', 'public', 'projects', 'maknaworks'),
    path.join(rootDir, 'projects', 'maknaworks'),
  ];

  for (const dir of dirs) {
    const htmlPath = path.join(dir, 'index.html');
    const assetsDir = path.join(dir, 'assets');
    assert.ok(fs.existsSync(htmlPath), `${htmlPath} must exist`);
    assert.ok(fs.existsSync(assetsDir), `${assetsDir} must exist`);

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const jsMatch = html.match(/src="\.\/assets\/([^"]+\.js)"/);
    const cssMatch = html.match(/href="\.\/assets\/([^"]+\.css)"/);
    assert.ok(jsMatch, `${htmlPath} must reference a JS asset`);
    assert.ok(cssMatch, `${htmlPath} must reference a CSS asset`);
    assert.ok(fs.existsSync(path.join(assetsDir, jsMatch[1])), `${jsMatch[1]} must exist in ${assetsDir}`);
    assert.ok(fs.existsSync(path.join(assetsDir, cssMatch[1])), `${cssMatch[1]} must exist in ${assetsDir}`);

    const assetFiles = fs.readdirSync(assetsDir);
    assert.ok(!assetFiles.some((f) => /tridhata|tridahata/i.test(f)), `${assetsDir} must not contain old tridhata/tridahata asset names`);
  }
});

