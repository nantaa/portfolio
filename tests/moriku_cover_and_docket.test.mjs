import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Moriku cover uses TATA$ style with Modern Laptop Displaying Kanban Board.png', () => {
  const publicImg = path.join(rootDir, 'frontend', 'public', 'images', 'Modern Laptop Displaying Kanban Board.png');
  assert.ok(fs.existsSync(publicImg), 'frontend/public/images/Modern Laptop Displaying Kanban Board.png must exist');

  const workGrid = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx'), 'utf-8');
  assert.ok(workGrid.includes('/images/Modern%20Laptop%20Displaying%20Kanban%20Board.png'), 'WorkGrid.tsx must reference Modern Laptop Displaying Kanban Board.png');
  assert.ok(workGrid.includes('MORIKU') && workGrid.includes('object-cover filter contrast-125'), 'WorkGrid.tsx Moriku card must apply TATA$ cover style');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('Modern%20Laptop%20Displaying%20Kanban%20Board.png'), 'index.html card 01 must reference Modern Laptop Displaying Kanban Board.png');
});

