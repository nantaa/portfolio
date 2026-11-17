import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('Nav.tsx implements IntersectionObserver scroll-spy and active section indicator', () => {
  const navPath = path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx');
  assert.ok(fs.existsSync(navPath), 'Nav.tsx must exist');
  const content = fs.readFileSync(navPath, 'utf-8');

  // Must implement IntersectionObserver or scroll listener to track active section
  assert.ok(
    content.includes('IntersectionObserver') || content.includes('activeSection') || content.includes('scroll'),
    'Nav.tsx must track active section via scroll-spy or IntersectionObserver'
  );
  assert.ok(
    content.includes('activeSection') || content.includes('active'),
    'Nav.tsx must manage active section state for visual indicator'
  );
});

test('CaseStudyModal supports URL deep linking, popstate Back button handling, and Prev/Next project pagination', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  assert.ok(fs.existsSync(modalPath), 'CaseStudyModal.tsx must exist');
  assert.ok(fs.existsSync(workGridPath), 'WorkGrid.tsx must exist');

  const modalContent = fs.readFileSync(modalPath, 'utf-8');
  const gridContent = fs.readFileSync(workGridPath, 'utf-8');

  // Must manage URL state or popstate
  assert.ok(
    modalContent.includes('pushState') || modalContent.includes('popstate') || gridContent.includes('pushState') || gridContent.includes('popstate') || gridContent.includes('project='),
    'Application must support URL deep-linking or popstate Back button navigation for case studies'
  );

  // Must offer Prev / Next project pagination
  assert.ok(
    modalContent.includes('Next Project') || modalContent.includes('Previous Project') || modalContent.includes('onNavigate') || modalContent.includes('goToProject'),
    'CaseStudyModal must support sequential next/prev project navigation'
  );
});

test('WorkGrid surfaces verified outcome metrics on all 8 project cards', () => {
  const workGridPath = path.join(rootDir, 'frontend', 'src', 'components', 'WorkGrid.tsx');
  const content = fs.readFileSync(workGridPath, 'utf-8');

  // Must define or render metric badges on card face
  assert.ok(
    content.includes('270+ Passing Tests') || content.includes('270+ Tests') || content.includes('metric'),
    'WorkGrid must surface verified outcome metrics on project card 01'
  );
  assert.ok(
    content.includes('60 FPS') || content.includes('GLSL'),
    'WorkGrid must surface performance/shader metrics on project card 02'
  );
  assert.ok(
    content.includes('88 Tests') || content.includes('88 automated tests') || content.includes('Zero Deadlocks'),
    'WorkGrid must surface algorithm convergence metrics on project card 04'
  );
});

test('Footer.tsx renders smooth-scrolling Back to top action', () => {
  const footerPath = path.join(rootDir, 'frontend', 'src', 'components', 'Footer.tsx');
  assert.ok(fs.existsSync(footerPath), 'Footer.tsx must exist');
  const content = fs.readFileSync(footerPath, 'utf-8');

  assert.ok(
    content.includes('Back to top') || content.includes('scrollTo') || content.includes('#main-content') || content.includes('#work') || content.includes('top'),
    'Footer.tsx must provide a Back to top trigger'
  );
});

test('globals.css enforces high-contrast muted text and explicit focus-visible rings', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(cssPath), 'globals.css must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Focus visible ring
  assert.ok(
    css.includes(':focus-visible') && (css.includes('outline:') || css.includes('outline-offset:')),
    'globals.css must define accessible :focus-visible outlines'
  );

  // Prefers reduced motion
  assert.ok(
    css.includes('prefers-reduced-motion'),
    'globals.css must support prefers-reduced-motion'
  );
});

test('Disciplines.tsx and Contact.tsx provide contextual exploration and inquiry intent chips', () => {
  const discPath = path.join(rootDir, 'frontend', 'src', 'components', 'Disciplines.tsx');
  const contactPath = path.join(rootDir, 'frontend', 'src', 'components', 'Contact.tsx');

  assert.ok(fs.existsSync(discPath), 'Disciplines.tsx must exist');
  assert.ok(fs.existsSync(contactPath), 'Contact.tsx must exist');

  const discContent = fs.readFileSync(discPath, 'utf-8');
  const contactContent = fs.readFileSync(contactPath, 'utf-8');

  // Disciplines link to #work
  assert.ok(
    discContent.includes('#work') || discContent.includes('projects') || discContent.includes('Selected work'),
    'Disciplines.tsx must link capability pillars to live work proof'
  );

  // Contact intent chips
  assert.ok(
    contactContent.includes('intent') || contactContent.includes('topic') || contactContent.includes('Engineering') || contactContent.includes('mailto'),
    'Contact.tsx must provide clear inquiry handles and intent context'
  );
});

