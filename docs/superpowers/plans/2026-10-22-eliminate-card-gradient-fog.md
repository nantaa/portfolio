# Eliminate Card Gradient Fog & Implement Architectural Lower Dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the full-card gradient wash (black in dark mode, cream/white in light mode) that covers 70% of the interactive work previews, replacing it with an unobstructed 100%-clarity canvas and a crisp, frosted architectural lower dock.

**Architecture:**
1. Strip all full-card gradient fills from `.wo` and `.wc:hover .wo` in `frontend/src/app/globals.css`. Set `.wo` background to `transparent`.
2. Redesign `.w-bottom-bar` as an architectural floating dock with `backdrop-filter: blur(14px)`, `background: var(--nav-bg)`, and a hairline `var(--wire)` border.
3. Anchor `.w-num` as a minimal corner spec badge (`0.5px solid var(--wire)`) with crisp contrast in both themes.

**Tech Stack:** Next.js 16 (App Router), Vanilla CSS Custom Properties, Tailwind CSS v4, HTML5/WebGL Canvas.

## Global Constraints
- Strictly zero opaque gradient haze over the work previews.
- Maintain dual-theme support (Dark mode and Warm Linen light mode).
- 53 existing tests must remain passing; update `mobile_responsive.test.mjs` to enforce zero-gradient architecture.
- Follow TDD: failing test first → implementation → verification → visual proof.

---

### Task 1: Update TDD Test Suite to Assert Zero-Gradient Architecture

**Files:**
- Modify: `tests/mobile_responsive.test.mjs:80-98`

**Interfaces:**
- Consumes: Node.js `node:test`, `node:assert/strict`
- Produces: Test assertion verifying `.wo` does NOT use full-card gradient coverage and `.w-bottom-bar` uses architectural dock styling.

- [ ] **Step 1: Replace obsolete gradient test with zero-gradient architectural dock test**

In `tests/mobile_responsive.test.mjs`, update `globals.css implements theme-aware work overlay gradients` to `globals.css eliminates gradient fog and uses crisp architectural lower dock`:

```javascript
test('globals.css eliminates card gradient fog in favor of architectural dock', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  // Verify .wo has no full-card linear gradient covering the preview
  assert.ok(
    !css.includes('.wo {\n      position: absolute;\n      inset: 0;\n      padding: 32px 36px;\n      display: flex;\n      flex-direction: column;\n      justify-content: flex-end;\n      background: var(--wo-gradient);') &&
    (css.includes('.wo {\n      position: absolute;\n      inset: 0') || css.includes('.wo {')),
    '.wo must not blanket the preview in a full-card gradient'
  );

  // Verify .w-bottom-bar implements architectural dock styling with backdrop blur
  assert.ok(
    css.includes('.w-bottom-bar') && 
    (css.includes('backdrop-filter') || css.includes('background: var(--nav-bg)') || css.includes('background: var(--card-bg)')),
    'w-bottom-bar must be styled as a crisp architectural dock'
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/mobile_responsive.test.mjs`
Expected: FAIL until CSS is updated.

---

### Task 2: Refactor Work Card Overlays in `frontend/src/app/globals.css`

**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Consumes: CSS variables `--nav-bg`, `--card-bg`, `--wire`, `--text`, `--muted`
- Produces: Completely transparent `.wo` overlay and frosted glass `.w-bottom-bar` dock.

- [ ] **Step 1: Remove `--wo-gradient` tokens from `:root` and `[data-theme="light"]`**

Delete `--wo-gradient` from `:root` and `[data-theme="light"]`.

- [ ] **Step 2: Update `.wo` to be transparent and non-destructive**

```css
.wo {
  position: absolute;
  inset: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: transparent !important;
  pointer-events: none;
  z-index: 3;
}

.wc:hover .wo,
.wc-interactive:hover .wo {
  background: transparent !important;
}
```

- [ ] **Step 3: Style `.w-bottom-bar` as an Architectural Dock**

```css
.w-bottom-bar {
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 0.5px solid var(--wire);
  border-radius: 3px;
  padding: 14px 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
  transition: border-color 220ms ease, transform 220ms ease;
}

.wc:hover .w-bottom-bar {
  border-color: var(--wire-h);
}
```

- [ ] **Step 4: Update `.w-num` as an Architectural Spec Chip**

```css
.w-num {
  position: static;
  align-self: flex-start;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--muted);
  background: var(--nav-bg);
  backdrop-filter: blur(12px);
  border: 0.5px solid var(--wire);
  padding: 3px 8px;
  border-radius: 2px;
}
```

- [ ] **Step 5: Mobile adaptations in `@media (max-width: 768px)`**

Ensure `.w-bottom-bar` on mobile has:
- `padding: 12px 14px;`
- Clean row layout with title on the left and `Read Case ↗` pill on the right.
- Zero gradient overlay on mobile.

- [ ] **Step 6: Run test suite to verify tests pass**

Run: `node --test tests/*.test.mjs`
Expected: 53 passing tests.

---

### Task 3: Build & Visual Verification

**Files:**
- Verify: Static build and live visual rendering at 500x654 (current active user viewport).

- [ ] **Step 1: Build static production export**

Run: `npm --prefix frontend run build`

- [ ] **Step 2: Inspect in Browser Subagent**

1. Verify 3D Bag, Meru Temple, Coral Reef, Disnaker Kanban, and Bekasi GIS Map are 100% visible, razor sharp, and have ZERO milky white or muddy black fog.
2. Verify title, subtitle, and "Read Case" button are crisp and legible inside the floating frosted dock.
3. Verify both Dark Mode and Warm Linen Light Mode.
4. Capture screenshots.

- [ ] **Step 3: Git Commit**

```bash
git add frontend/src/app/globals.css tests/mobile_responsive.test.mjs docs/superpowers/plans/2026-10-22-eliminate-card-gradient-fog.md
git commit -m "style(work): eliminate card gradient fog in favor of pristine previews with architectural dock"
```
