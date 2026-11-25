import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('WorkProposalModal.tsx and index.html use Consultant option and FormSubmit email autosender', () => {
  const modal = fs.readFileSync(path.join(rootDir, 'frontend', 'src', 'components', 'WorkProposalModal.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

  assert.ok(modal.includes('<option value="Consultant">Consultant</option>'), 'WorkProposalModal.tsx must offer Consultant');
  assert.ok(!modal.includes('value="Systems Architecture"'), 'WorkProposalModal.tsx must replace Systems Architecture with Consultant');
  assert.ok(modal.includes('https://formsubmit.co/ajax/rifai.aryo@gmail.com'), 'WorkProposalModal.tsx must auto-send via FormSubmit AJAX');

  assert.ok(indexHtml.includes('<option value="Consultant">Consultant</option>'), 'index.html #wpType must offer Consultant');
  assert.ok(!indexHtml.includes('value="Systems Architecture"'), 'index.html #wpType must replace Systems Architecture with Consultant');
  assert.ok(indexHtml.includes('https://formsubmit.co/ajax/rifai.aryo@gmail.com'), 'index.html submitProposal must auto-send via FormSubmit AJAX');
});

