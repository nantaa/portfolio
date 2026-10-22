# Mobile Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the mobile experience from clunky, oversized layout blocks into a refined, high-end editorial presentation across both Dark and Warm Linen light modes.

**Architecture:** 
1. Refactor mobile CSS in `globals.css` to fix typographic hierarchy, card aspect ratios, and theme consistency.
2. Update `HeroTelemetryHUD.tsx` with responsive node topologies and adaptive viewport scaling (< 600px).
3. Modernize Disciplines and About components for compact, balanced mobile geometry without vertical dead space.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, HTML5 Canvas, Vanilla CSS Custom Properties.

## Global Constraints
- Preserve static export compatibility (`output: "export"`).
- Maintain all existing tests (50 passing tests across 4 test suites).
- Zero new external runtime dependencies.
- Strict dual-theme compliance (Dark: `#0A0A0A` / Light: `#F7F4EE` warm linen).
- Follow TDD: failing tests first, implementation, verification.

---

### Task 1: Extend Test Suite for Mobile Visual Polishing

**Files:**
- Modify: `tests/mobile_responsive.test.mjs:1-63`

**Interfaces:**
- Consumes: Node.js `node:test`, `node:assert/strict`, `fs`, `path`
- Produces: Failing assertions for mobile typography clamp, card height constraint, light theme gradient tokens, and responsive HUD coordinates.

- [ ] **Step 1: Write the failing tests in `tests/mobile_responsive.test.mjs`**

Add tests that verify:
1. `globals.css` uses restrained hero title sizing (`clamp(28px` or smaller upper bound) on mobile.
2. `globals.css` constrains mobile `.wc` min-height to <= 350px (preventing 440px monolithic blocks).
3. `globals.css` defines theme-aware `.wo` overlay gradients (avoiding hardcoded pitch-black overlay in light mode).
4. `globals.css` constrains About photo placeholder height on mobile (<= 240px).
5. `HeroTelemetryHUD.tsx` includes mobile layout adaptation for screens < 600px.

```javascript
test('globals.css applies restrained mobile hero typography and card proportions', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const mobileStartIndex = css.indexOf('@media (max-width: 768px)');
  assert.ok(mobileStartIndex !== -1, 'Mobile block must exist');
  const mobileContent = css.slice(mobileStartIndex);

  // Check restrained card height
  assert.ok(
    mobileContent.includes('min-height: 320px') || 
    mobileContent.includes('min-height: 330px') || 
    mobileContent.includes('min-height: 340px'),
    'Work card min-height must be restrained to <= 340px on mobile'
  );

  // Check about photo constraint
  assert.ok(
    mobileContent.includes('max-height: 240px') || 
    mobileContent.includes('max-height: 220px') ||
    mobileContent.includes('aspect-ratio: 16'),
    'About preview must be capped on mobile'
  );
});

test('globals.css implements theme-aware work overlay gradients', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(
    css.includes('--wo-gradient') || 
    (css.includes('[data-theme="light"]') && css.includes('.wo')),
    'Must provide theme-specific card gradient for light mode'
  );
});

test('HeroTelemetryHUD adapts node distribution for mobile screens', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');

  assert.ok(
    content.includes('isMobile') || 
    content.includes('width < 600') || 
    content.includes('w < 600') ||
    content.includes('mobileHomeNorm'),
    'HeroTelemetryHUD must adapt coordinates for narrow mobile viewports'
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/mobile_responsive.test.mjs`
Expected: FAIL on the newly added assertions.

---

### Task 2: Refine Theme & Mobile CSS in `globals.css`

**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Consumes: CSS variables `--bg`, `--text`, `--wire`, `--s1`, `--s2`, `--accent`
- Produces: Streamlined mobile styles for `.hero-name`, `.hero-btn`, `.wc`, `.wo`, `.dr`, `.about-left`, `.about-ph`

- [ ] **Step 1: Define `--wo-gradient` token in `:root` and `[data-theme="light"]`**

```css
:root, [data-theme="dark"] {
  --wo-gradient: linear-gradient(170deg, transparent 30%, rgba(10, 10, 10, 0.92) 100%);
}

[data-theme="light"] {
  --wo-gradient: linear-gradient(170deg, transparent 30%, rgba(247, 244, 238, 0.94) 100%);
}
```

- [ ] **Step 2: Update `.wo` and `.hero-right` to use theme tokens**

Replace hardcoded `#080808` in `.hero-right` with `var(--s1)`.
Replace hardcoded `rgba(10, 10, 10, ...)` in `.wo` with `var(--wo-gradient)`.

- [ ] **Step 3: Update mobile media query (`@media (max-width: 768px)`)**

1. **Hero typography**:
   `font-size: clamp(28px, 8.5vw, 42px); line-height: 1.08; letter-spacing: -0.01em;`
2. **Hero buttons**:
   Replace 100% full-width stack with an inline flex row (`gap: 10px; flex-wrap: wrap;`), with `.hero-btn { flex: 1 1 140px; padding: 10px 14px; font-size: 10px; }`.
3. **Work grid cards**:
   `.wc { min-height: 330px; }`
   `.wo { padding: 16px 16px 14px; }`
   `.w-bottom-bar { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: 8px; }`
   `.case-dossier-btn { width: auto; padding: 6px 10px; font-size: 9.5px; }`
4. **Disciplines rows**:
   `.dr { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 14px 16px; }`
   Row 1: `.dr-main { display: flex; width: 100%; justify-content: space-between; align-items: center; }`
   Row 2: `.d-tag { font-size: 10px; opacity: 0.7; }`
5. **About section**:
   `.about-left { min-height: 180px; max-height: 220px; aspect-ratio: 16 / 9; }`
   `.about-ph { min-height: 180px; max-height: 220px; }`
   `.a-heading { font-size: 22px; }`
   `.a-stats { grid-template-columns: repeat(3, 1fr); gap: 12px; }` (clean 3-column stats row on mobile).

- [ ] **Step 4: Run test to verify CSS assertions pass**

Run: `node --test tests/mobile_responsive.test.mjs`

---

### Task 3: Mobile Adaptive Topology in `HeroTelemetryHUD.tsx`

**Files:**
- Modify: `frontend/src/components/HeroTelemetryHUD.tsx`

**Interfaces:**
- Consumes: Canvas `2d` context, `containerRef` width/height
- Produces: Dynamically scaled node positions and compact dimensions on viewports < 600px.

- [ ] **Step 1: Implement mobile coordinate adapter in `HeroTelemetryHUD.tsx`**

When `rect.width < 600`, calculate responsive node coordinates using a 2-tier staggered grid instead of single horizontal line:
- Node box width: `boxW = isMobile ? 74 : 88; boxH = isMobile ? 38 : 46;`
- Ingress/Client (top left), Gateway/Shader (top right), State/Post-process (bottom left), Storage/Jobs (bottom right).
- Prevent line clipping and label overflow beyond `12px` padding margins.

- [ ] **Step 2: Restrain HUD height on mobile in `globals.css`**

`.hero-right { min-height: 320px; max-height: 380px; }` on mobile, keeping the hero section compact and immediate.

- [ ] **Step 3: Run full test suite**

Run: `node --test tests/*.test.mjs`
Expected: 50+ passing tests.

---

### Task 4: Visual Verification & User Polish Gate

**Files:**
- Verify: Static build and live visual rendering at 500x749 and 390x844 viewports.

- [ ] **Step 1: Build static production export**

Run: `npm --prefix frontend run build`
Expected: Clean static export in `frontend/out/`.

- [ ] **Step 2: Launch browser subagent for visual audit**

Capture before/after screenshots at 500x749 (Dark mode and Warm Linen mode).
Confirm:
1. Editorial headline wraps cleanly without edge collisions.
2. Hero buttons are balanced and proportional.
3. Telemetry HUD is compact, theme-adaptive, and unclipped.
4. Work cards display with elegant 330px aspect ratio and compact "Read Case" pills.
5. Disciplines rows wrap without layout overflow.
6. About section flows naturally into bio and stats without giant image dead space.

- [ ] **Step 3: Git Commit**

```bash
git add frontend/src/app/globals.css frontend/src/components/HeroTelemetryHUD.tsx tests/mobile_responsive.test.mjs docs/superpowers/plans/2026-10-22-mobile-visual-refinement.md
git commit -m "style(mobile): refine editorial typography, card aspect ratios, and responsive HUD topology"
```
