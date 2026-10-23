# Eradicate Radial Black-White Gating & Unify Work Cards Architecture

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely eliminate the jarring `#07090b` pitch-black backgrounds, radial-gradient spotlights ("radient black-white"), and duplicate title blocks inside `ProjectPreviewGate` and `MaterialStudiesCarousel`, unifying all work card previews into clean, theme-adaptive surfaces (`var(--s1)` / `var(--s2)`) with zero visual clash in both Dark and Warm Linen modes.

**Architecture:**
1. **Purge Radial Gradients**: Remove `radial-gradient(circle at 50% 45%, ... #07090b)` from `ProjectPreviewGate.tsx` and `MaterialStudiesCarousel.tsx`. Use theme-aware surfaces `var(--s2)`.
2. **Ungate Geopetak**: `GeopetakPreview` is a lightweight 2D canvas over a real aerial photograph (`bekasi_saturated.jpg`). Eliminate `ProjectPreviewGate` wrapper so the aerial image and interactive cadastral X-Ray render immediately with zero black screens.
3. **Eliminate Duplicate Titles in Standby**: When `TataPreview` or `MaterialStudiesCarousel` is in standby, do NOT duplicate the project title, category, and specs already rendered in `WorkGrid`'s dock. Render a clean architectural stage with the branded watermark and a sleek tactile "Mount 3D Stage" trigger.
4. **Theme-Adaptive Previews**: Ensure all standby backgrounds, borders, and text use semantic CSS variables (`var(--bg)`, `var(--text)`, `var(--muted)`, `var(--wire)`, `var(--s2)`) so there is zero black-on-white or white-on-black radial dissonance.

**Tech Stack:** Next.js 16 (App Router), React 19, CSS Variables, Three.js, HTML5 Canvas.

## Global Constraints
- Strictly zero `radial-gradient` or hardcoded `#07090b` in work previews.
- Full compatibility with all 53 existing tests; update `portfolio_integrity.test.mjs` and `mobile_responsive.test.mjs` as required by TDD.
- Seamless dual-theme visual harmony (Dark: `#0A0A0A` / Light: `#F7F4EE` warm linen).

---

### Task 1: Write TDD Test Assertions for Zero Radial Gradients & Theme Adaptation

**Files:**
- Modify: `tests/mobile_responsive.test.mjs`
- Test: `tests/portfolio_integrity.test.mjs`

**Interfaces:**
- Consumes: Node.js `node:test`, `node:assert/strict`, `fs`, `path`
- Produces: Test assertion verifying no hardcoded `#07090b` or `radial-gradient` in `ProjectPreviewGate.tsx` and `MaterialStudiesCarousel.tsx`.

- [ ] **Step 1: Write failing test in `tests/mobile_responsive.test.mjs`**

Add assertion:
```javascript
test('work preview components eliminate hardcoded #07090b and radial-gradient spotlights', () => {
  const gatePath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ProjectPreviewGate.tsx');
  const carouselPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaterialStudiesCarousel.tsx');

  const gateContent = fs.readFileSync(gatePath, 'utf-8');
  const carouselContent = fs.readFileSync(carouselPath, 'utf-8');

  // Verify radial-gradient is purged
  assert.ok(!gateContent.includes('radial-gradient'), 'ProjectPreviewGate must not use radial-gradient');
  assert.ok(!carouselContent.includes('radial-gradient'), 'MaterialStudiesCarousel must not use radial-gradient');

  // Verify hardcoded #07090b is purged in favor of theme-aware tokens
  assert.ok(!gateContent.includes('#07090b'), 'ProjectPreviewGate must not hardcode #07090b');
  assert.ok(!carouselContent.includes('#07090b'), 'MaterialStudiesCarousel must not hardcode #07090b');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/mobile_responsive.test.mjs`
Expected: FAIL due to existing `radial-gradient` and `#07090b`.

---

### Task 2: Refactor `ProjectPreviewGate.tsx` to Theme-Adaptive Architectural Stage

**Files:**
- Modify: `frontend/src/components/previews/ProjectPreviewGate.tsx`

**Interfaces:**
- Consumes: React props `title`, `actionLabel`, `actionSubtext`, `backdropPattern`, `children`
- Produces: Clean theme-aware standby stage using `var(--s2)` without radial gradient and without duplicate metadata text.

- [ ] **Step 1: Update `ProjectPreviewGate.tsx`**

1. Replace `style={{ background: radial-gradient(...) }}` with `bg-[var(--s2)] border border-[var(--wire)]`.
2. Remove duplicate `<h4 className="font-serif">...</h4>` and `<p className="font-sans">...` from the standby screen, leaving the focused visual watermark (`backdropPattern`) and clean tactile activation trigger.
3. Replace hardcoded `text-neutral-100`, `text-neutral-300`, `bg-black/85` with `text-[var(--text)]`, `text-[var(--muted)]`, `bg-[var(--nav-bg)]`.

---

### Task 3: Ungate `GeopetakPreview.tsx` to Render Aerial Photography Directly

**Files:**
- Modify: `frontend/src/components/previews/GeopetakPreview.tsx`

**Interfaces:**
- Consumes: `GeopetakStage`
- Produces: Direct render of `GeopetakStage` so the real Bekasi aerial image and interactive cadastral X-Ray mesh render immediately without any black gating screen.

- [ ] **Step 1: Remove `ProjectPreviewGate` wrapper from `GeopetakPreview.tsx`**

Export `GeopetakStage` directly:
```tsx
export default function GeopetakPreview() {
  return <GeopetakStage />;
}
```

---

### Task 4: Refactor `MaterialStudiesCarousel.tsx` to Theme-Adaptive Surfaces

**Files:**
- Modify: `frontend/src/components/previews/MaterialStudiesCarousel.tsx`

**Interfaces:**
- Consumes: `STUDIES`, `currentStudy`
- Produces: Theme-adaptive background `var(--s2)`, clean navigation bar using `var(--nav-bg)` without hardcoded black gradients.

- [ ] **Step 1: Replace `radial-gradient` and `#07090b` in `MaterialStudiesCarousel.tsx`**

1. Change container `bg-[#07090b]` to `bg-[var(--s2)]`.
2. Replace click-to-load poster `radial-gradient` with clean `bg-[var(--s2)]` and subtle technical crosshairs / grid.
3. Replace `bg-gradient-to-b from-black/80` and `bg-gradient-to-t from-black/90` with `bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--wire)]`.

---

### Task 5: Verify Full Test Suite & Visual Build

**Files:**
- Verify: All tests and static build.

- [ ] **Step 1: Run full test suite**

Run: `node --test tests/*.test.mjs`
Expected: 53+ tests passing.

- [ ] **Step 2: Build static production export**

Run: `npm --prefix frontend run build`

- [ ] **Step 3: Visual audit with `browser_subagent` at 500x654**

Capture screenshots in Dark and Light modes:
1. Geopetak renders authentic Bekasi aerial photograph immediately (zero black screen).
2. Tata$ and Material Studies have clean, theme-matched standby stages without radial glow or duplicate titles.
3. Selected Work section flows cohesively with the rest of the portfolio.

- [ ] **Step 4: Git Commit**

```bash
git add frontend/src/components/previews/ tests/ docs/superpowers/plans/2026-10-23-eradicate-radial-black-white-in-work.md
git commit -m "fix(work): eradicate radial black-white gradients and hardcoded dark gating from previews"
```
