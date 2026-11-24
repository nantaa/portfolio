import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Criterion 1: Moriku index.html seeds integer stage IDs 1..16 so all Kanban columns display jobs', () => {
  const publicMoriku = fs.readFileSync(path.join(rootDir, 'frontend', 'public', 'projects', 'moriku', 'index.html'), 'utf-8');
  const rootMoriku = fs.readFileSync(path.join(rootDir, 'projects', 'moriku', 'index.html'), 'utf-8');

  for (let s = 1; s <= 16; s++) {
    assert.ok(publicMoriku.includes(`"stage":${s},`), `public moriku must have integer "stage":${s}`);
    assert.ok(rootMoriku.includes(`"stage":${s},`), `root moriku must have integer "stage":${s}`);
  }
  assert.ok(!publicMoriku.includes('"stage":"1"'), 'public moriku must not use string stage IDs');
});

test('Criterion 2: Contact.tsx and index.html remove Copy Email button and inquiry intent clutter', () => {
  const contact = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Contact.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(!contact.includes('One-Click Clipboard') && !contact.includes('copyEmail'), 'Contact.tsx must remove Copy Email button');
  assert.ok(!contact.includes('Select inquiry intent'), 'Contact.tsx must remove Select inquiry intent chips');
  assert.ok(!indexHtml.includes('One-Click Clipboard') && !indexHtml.includes('Select inquiry intent'), 'index.html Contact must remove Copy Email and inquiry intent chips');
});

test('Criterion 3: WorkProposalModal.tsx exists and Nav.tsx + index.html open proposal form on Available for work click', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkProposalModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'WorkProposalModal.tsx must exist');

  const modal = fs.readFileSync(modalPath, 'utf-8');
  assert.ok(modal.includes('role="dialog"') && modal.includes('Escape'), 'WorkProposalModal must support dialog role and Escape close');
  assert.ok(modal.includes('mailto:rifai.aryo@gmail.com'), 'WorkProposalModal must include static-safe mailto fallback');
  assert.ok(modal.includes('32px 36px') && modal.includes('12px 14px'), 'WorkProposalModal must enforce explicit padding to resist CSS reset');

  const nav = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx'), 'utf-8');
  assert.ok(nav.includes('WorkProposalModal') || nav.includes('isProposalOpen'), 'Nav.tsx must wire WorkProposalModal on Available for work click');

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('openProposal()') && indexHtml.includes('workProposalModal'), 'index.html must open workProposalModal on Available for work click');
  assert.ok(indexHtml.includes('32px 36px') && indexHtml.includes('12px 14px'), 'index.html workProposalModal must enforce explicit padding');
});

