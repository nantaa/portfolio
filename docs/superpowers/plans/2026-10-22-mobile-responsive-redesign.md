# Mobile Responsive Clean Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the mobile experience from an unstyled desktop layout (broken 3-column asymmetric grid, overflowing navbar, crushed 4fr:5fr hero) into a razor-sharp, architectural, minimalist mobile interface adhering to the "Structured Mind" design ethos.

**Architecture:** Implement a comprehensive mobile design system in `frontend/src/app/globals.css` using standard `@media (max-width: 768px)` and `@media (max-width: 480px)` breakpoints. Convert rigid multi-column desktop grids into clean vertical stacks with touch-optimized ergonomics, adaptive card heights, compact navigation with mobile drawer/links, and suppression of desktop custom cursor on touch viewports.

**Tech Stack:** Next.js 16, React 19, Vanilla CSS in `globals.css`, Tailwind CSS v4, Node.js test runner (`node:test`).

## Global Constraints

- Preserve all existing desktop styles (screens ≥ 769px remain 100% pixel-perfect).
- Zero horizontal overflow (`overflow-x: hidden` / zero scrollbar bleeding on 360px - 430px viewports).
- Mobile tap targets must meet WCAG touch ergonomics (minimum 44×44px interactive bounds).
- Custom desktop cursor (`#cur`) must be disabled on touch devices (`@media (hover: none) and (pointer: coarse)` and screens ≤ 768px).
- All 44 existing automated tests in `tests/` must continue to pass.

---

## Honest Critical Review: Why Mobile Currently Looks "Ugly"

1. **The Root Cause**: There was literally **only 1 media query** in the entire 2,734 lines of `globals.css` (for a minor car preview control button). The core portfolio layout had **zero mobile responsiveness**:
   - `.nav`: Fixed `padding: 18px 52px;` with 4 text links, a theme toggle, and a badge side-by-side. On a 390px iPhone, this is 600+ pixels wide and bleeds off-screen.
   - `.hero-body`: Fixed `grid-template-columns: 4fr 5fr;`. On mobile, Aryo's bio is crushed into 40% width (~150px) while the canvas HUD is squeezed into 50% width (~180px), making both unreadable.
   - `.work-grid--8`: Hardcoded `grid-template-columns: 4fr 3fr 3fr; grid-template-rows: 580px 500px 460px;`. Each project card is forced into a 100px sliver that is 580px tall—an unusable visual distortion.
   - `.about` & `.contact`: Hardcoded 2-column side-by-side grids with 52px margins.
   - `#cur`: A fixed 8px circle tracking mouse events that either gets stuck in the top corner or flashes erratically on mobile touch screens.

---

## File Structure & Responsibilities

| File Path | Responsibility |
|---|---|
| `frontend/src/app/globals.css` | Comprehensive mobile design system across navigation, hero, work grid, disciplines, about, contact, and touch ergonomics |
| `frontend/src/components/Nav.tsx` | Mobile navigation menu toggle and compact layout for small viewports |
| `frontend/src/components/Hero.tsx` | Responsive layout adjustments for mobile display text & action buttons |
| `frontend/src/components/WorkGrid.tsx` | Card height adjustments and touch target refinements for mobile |
| `tests/mobile_responsive.test.mjs` | Automated TDD test suite verifying mobile breakpoints, 1-col stacks, cursor suppression, and zero horizontal bleed |

---

## Bite-Sized Implementation Tasks

### Task 1: Create TDD Test Suite for Mobile Responsiveness

**Files:**
- Create: `tests/mobile_responsive.test.mjs`

**Interfaces:**
- Consumes: `frontend/src/app/globals.css`, `frontend/src/components/Nav.tsx`, `frontend/src/components/Hero.tsx`
- Produces: Test runner verification for mobile responsive rules

- [ ] **Step 1: Write the failing tests**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('globals.css defines comprehensive mobile media queries for <= 768px', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(cssPath), 'globals.css must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('@media (max-width: 768px)') || css.includes('@media (max-width:768px)'), 'Must define @media (max-width: 768px)');
});

test('globals.css collapses hero-body to 1 column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Verify mobile hero grid rule
  const mobileMatch = css.match(/@media[^{]*max-width:\s*768px[^{]*\{([\s\S]*?)(?=\n\s*@media|\n\s*\/\*|\n\s*$)/i);
  assert.ok(mobileMatch, 'Mobile block must exist');
  const mobileContent = mobileMatch[1];
  assert.ok(mobileContent.includes('.hero-body') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('grid-template-columns:1fr') || mobileContent.includes('flex-direction: column')), 'Hero body must collapse to single column');
});

test('globals.css collapses work-grid and work-grid--8 to single column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileMatch = css.match(/@media[^{]*max-width:\s*768px[^{]*\{([\s\S]*?)(?=\n\s*@media|\n\s*\/\*|\n\s*$)/i);
  assert.ok(mobileMatch, 'Mobile block must exist');
  const mobileContent = mobileMatch[1];
  assert.ok(mobileContent.includes('.work-grid') && mobileContent.includes('grid-template-columns: 1fr'), 'Work grid must collapse to 1fr');
  assert.ok(mobileContent.includes('.wc'), 'Work grid cards must unhook desktop grid-column/grid-row coordinate pinning');
});

test('globals.css collapses about and contact sections to single column on mobile', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileMatch = css.match(/@media[^{]*max-width:\s*768px[^{]*\{([\s\S]*?)(?=\n\s*@media|\n\s*\/\*|\n\s*$)/i);
  assert.ok(mobileMatch, 'Mobile block must exist');
  const mobileContent = mobileMatch[1];
  assert.ok(mobileContent.includes('.about') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('display: flex')), 'About section must collapse');
  assert.ok(mobileContent.includes('.contact') && (mobileContent.includes('grid-template-columns: 1fr') || mobileContent.includes('display: flex')), 'Contact section must collapse');
});

test('globals.css suppresses custom desktop cursor on touch/mobile devices', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('#cur') && (css.includes('display: none') || css.includes('opacity: 0')), 'Custom cursor must be hidden on mobile/touch');
});

test('Nav.tsx implements responsive mobile menu or compact mobile layout', () => {
  const navPath = path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx');
  const content = fs.readFileSync(navPath, 'utf-8');

  assert.ok(content.includes('nav-links') && (content.includes('hidden') || content.includes('md:flex') || content.includes('mobile-menu') || content.includes('nav-menu-btn')), 'Nav must adapt for mobile viewports');
});
```

- [ ] **Step 2: Run test to verify it fails (RED)**

Run: `node --test tests/mobile_responsive.test.mjs`
Expected: FAIL with multiple missing mobile assertions.

---

### Task 2: Implement Mobile Architecture in globals.css

**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Consumes: Existing desktop classes (`.nav`, `.hero-body`, `.work-grid`, `.dr`, `.about`, `.contact`, `#cur`)
- Produces: Clean mobile styling under `@media (max-width: 768px)` and `@media (max-width: 480px)`

- [ ] **Step 1: Add mobile responsive rules to globals.css**

Key rules:
```css
/* ══ MOBILE RESPONSIVE SYSTEM ══ */
@media (hover: none) and (pointer: coarse), (max-width: 768px) {
  body {
    cursor: auto !important;
  }
  #cur {
    display: none !important;
  }
  a, button, .wc, .nav-cta {
    cursor: pointer !important;
  }
}

@media (max-width: 768px) {
  html {
    font-size: 15px;
  }

  nav {
    padding: 14px 20px;
  }

  .nav-right {
    gap: 12px;
  }

  .nav-cta {
    font-size: 9px;
    padding: 6px 12px;
    letter-spacing: 0.1em;
  }

  /* Hero */
  .hero {
    padding-top: 56px;
  }

  .hero-strip {
    grid-template-columns: 1fr;
    padding: 16px 20px;
    gap: 8px;
  }

  .hero-strip-right {
    display: none;
  }

  .hero-body {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .hero-left {
    padding: 36px 20px 32px;
    border-right: none;
    border-bottom: 0.5px solid var(--wire);
  }

  .hero-name {
    font-size: clamp(42px, 11vw, 56px);
    line-height: 0.95;
    margin-bottom: 24px;
  }

  .hero-descriptor {
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: 0.06em;
  }

  .hero-cta-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .hero-btn {
    padding: 10px 18px;
    font-size: 10px;
    width: 100%;
    text-align: center;
  }

  .hero-right {
    min-height: 480px;
    padding: 0;
  }

  .hero-telemetry-hud {
    padding: 16px 18px;
  }

  /* Section Header */
  .sec-hd {
    padding: 18px 20px;
  }

  /* Work Grid (1-Column Mobile Stack) */
  .work-grid,
  .work-grid--8 {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .wc,
  .work-grid--8 .wc:nth-child(n) {
    grid-column: auto !important;
    grid-row: auto !important;
    min-height: 440px;
    width: 100% !important;
  }

  .wo {
    padding: 24px 20px 20px;
  }

  .w-bottom-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .case-dossier-btn {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
  }

  /* Disciplines */
  .dr {
    grid-template-columns: 32px 1fr auto;
    padding: 16px 20px;
    gap: 12px;
  }

  .d-bar {
    display: none;
  }

  .disc-expand {
    padding: 14px 20px;
  }

  /* About */
  .about {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .about-left {
    border-right: none;
    border-bottom: 0.5px solid var(--wire);
    min-height: 360px;
  }

  .about-ph {
    min-height: 360px;
  }

  .about-right {
    padding: 36px 20px;
  }

  .a-heading {
    font-size: 26px;
  }

  .a-body {
    font-size: 13px;
    line-height: 1.8;
  }

  .a-stats {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 16px;
  }

  .a-stat {
    border-right: none;
    border-bottom: 0.5px solid var(--wire);
    padding-bottom: 12px;
  }

  /* Contact */
  .contact {
    grid-template-columns: 1fr;
  }

  .contact-left {
    padding: 36px 20px 24px;
    border-right: none;
    border-bottom: 0.5px solid var(--wire);
  }

  .c-heading {
    font-size: 32px;
  }

  .contact-right {
    padding: 24px 20px 36px;
  }

  /* Footer */
  footer {
    padding: 20px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
```

- [ ] **Step 2: Run tests to verify CSS media rules pass**

Run: `node --test tests/mobile_responsive.test.mjs`
Expected: CSS media query tests PASS.

---

### Task 3: Clean Responsive Navigation in Nav.tsx

**Files:**
- Modify: `frontend/src/components/Nav.tsx`

**Interfaces:**
- Consumes: `useSyncExternalStore` theme state
- Produces: Compact mobile header with hidden desktop links or hamburger toggle drawer

- [ ] **Step 1: Update Nav.tsx with responsive desktop/mobile links**

Hide `.nav-links` on mobile screens (`hidden md:flex`) and display a sleek, compact mobile navigation layout with theme toggle and status badge.

- [ ] **Step 2: Run test to verify Step 1 passes**

Run: `node --test tests/mobile_responsive.test.mjs`
Expected: Nav test PASSES.

---

### Task 4: Polish Mobile Telemetry HUD and Card Overlays

**Files:**
- Modify: `frontend/src/components/HeroTelemetryHUD.tsx`
- Modify: `frontend/src/components/CaseStudyModal.tsx`

**Interfaces:**
- Consumes: Screen width / resize listener
- Produces: Adaptive Canvas HUD height (420px on mobile) and responsive modal padding

- [ ] **Step 1: Refactor CaseStudyModal and HeroTelemetryHUD padding for mobile**

In `CaseStudyModal.tsx`, ensure `max-h-[94vh] p-4 sm:p-10` with responsive modal typography so the dossier reads comfortably on 375px screens without horizontal scroll.

- [ ] **Step 2: Run full test suite**

Run: `node --test tests/mobile_responsive.test.mjs && node --test tests/theme_system.test.mjs && node --test tests/portfolio_integrity.test.mjs && node --test tests/e2e_hero_and_conversion.test.mjs`
Expected: ALL test suites PASS (49+ tests).

---

### Task 5: Production Build and Visual Verification

**Files:**
- Build: `cd frontend && npm run build`

- [ ] **Step 1: Run production Next.js build**

Run: `npm run build`
Expected: Static export builds cleanly with zero TypeScript or styling errors.

- [ ] **Step 2: Visual Browser Verification**

Use `browser_subagent` to render at 375×812px viewport and verify that:
1. No horizontal scrollbar exists.
2. The navbar is clean and un-clipped.
3. The Hero stacks vertically with readable name and responsive canvas.
4. Work cards display in a clean, full-width vertical stack.
5. Theme switching works instantaneously in both dark and warm linen modes on mobile.

- [ ] **Step 3: Commit all changes**

```bash
git add frontend/ tests/ docs/superpowers/plans/
git commit -m "feat(mobile): implement clean architectural responsive layout for mobile viewports"
```
