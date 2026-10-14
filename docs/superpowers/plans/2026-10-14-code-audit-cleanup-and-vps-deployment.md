# Code Audit, Dead-Code Elimination & Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit and eliminate orphaned preview components, dead CSS selectors, placeholder boilerplate assets, and align the test suite to guarantee 100% clean production builds without regression.

**Architecture:** 
1. **Dead Component & Asset Pruning**: Remove unreferenced preview components (`ReportAutomationPreview.tsx`, `KukujangPreview.tsx`), obsolete boilerplate SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`), obsolete project images (`kukujang-car.webp`, `kukujang-car2.jpg`, `uiux.png`, unreferenced `geopetak-*.webp`), while preserving active assets (`bekasi_*.jpg`, `tas*.glb`, `aryo.png`).
2. **Dead Selector & Placeholder Cleanup**: Purge ghost `.hero-img-cell` querySelectors and dead CSS rules in `frontend/src/components/HomeClient.tsx` and `index.html`. Refactor the mock `photo1.jpg` SVG placeholders in `HomeClient.tsx` to adhere to `DESIGN.md`.
3. **Automated Verification**: Extend `tests/portfolio_integrity.test.mjs` and `tests/e2e_hero_and_conversion.test.mjs` to enforce zero orphaned preview components and zero boilerplate SVGs.

**Tech Stack:** Next.js 16 (Turbopack), React 19, TypeScript, Node.js Native Test Runner (`node:test`).

## Global Constraints
- Strictly follow TDD: tests asserting clean state must be run and verified.
- Do NOT delete or modify active project previews (`DNPMonitorPreview.tsx`, `VaultrPreview.tsx`, `TataPreview.tsx`, `AcademicDocketPreview.tsx`, `HelpdeskPreview.tsx`, `GeopetakPreview.tsx`, `ExpenseTrackerPreview.tsx`).
- Verify all 24 existing tests continue to pass and `npm run build` succeeds cleanly.
- Do NOT begin implementation before user explicitly approves this plan.

---

### Task 1: Audit Test Specification (TDD Red Phase)

**Files:**
- Modify: `tests/portfolio_integrity.test.mjs`

**Interfaces:**
- Asserts that no orphaned preview components (`ReportAutomationPreview.tsx`, `KukujangPreview.tsx`) exist in `frontend/src/components/previews/`.
- Asserts that `frontend/src/components/HomeClient.tsx` does not reference obsolete `.hero-img-cell` selectors.
- Asserts that default Next.js boilerplate SVGs (`vercel.svg`, `next.svg`, `globe.svg`, `file.svg`, `window.svg`) are purged from `frontend/public/`.

- [ ] **Step 1: Add audit assertion tests to `tests/portfolio_integrity.test.mjs`**

Add test:
```javascript
test('Orphaned preview components and boilerplate SVGs are purged', () => {
  const previewsDir = path.join(rootDir, 'frontend', 'src', 'components', 'previews');
  const publicDir = path.join(rootDir, 'frontend', 'public');
  const homeClientPath = path.join(rootDir, 'frontend', 'src', 'components', 'HomeClient.tsx');

  assert.ok(!fs.existsSync(path.join(previewsDir, 'ReportAutomationPreview.tsx')), 'ReportAutomationPreview.tsx must be purged');
  assert.ok(!fs.existsSync(path.join(previewsDir, 'KukujangPreview.tsx')), 'KukujangPreview.tsx must be purged');
  assert.ok(!fs.existsSync(path.join(publicDir, 'vercel.svg')), 'vercel.svg boilerplate must be purged');
  assert.ok(!fs.existsSync(path.join(publicDir, 'next.svg')), 'next.svg boilerplate must be purged');

  const homeClientContent = fs.readFileSync(homeClientPath, 'utf-8');
  assert.ok(!homeClientContent.includes('hero-img-cell'), 'HomeClient.tsx must not reference dead .hero-img-cell selector');
});
```

- [ ] **Step 2: Run tests to verify failure (RED)**

Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: FAIL due to existence of `ReportAutomationPreview.tsx` and boilerplate SVGs.

---

### Task 2: Prune Dead Components & Boilerplate Assets

**Files:**
- Delete: `frontend/src/components/previews/ReportAutomationPreview.tsx`
- Delete: `frontend/src/components/previews/KukujangPreview.tsx`
- Delete: `frontend/public/file.svg`
- Delete: `frontend/public/globe.svg`
- Delete: `frontend/public/next.svg`
- Delete: `frontend/public/vercel.svg`
- Delete: `frontend/public/window.svg`
- Delete: `frontend/public/images/projects/kukujang-car.webp`
- Delete: `frontend/public/images/projects/kukujang-car2.jpg`
- Delete: `frontend/public/images/projects/uiux.png`
- Delete: `frontend/public/images/projects/geopetak-hero.webp`
- Delete: `frontend/public/images/projects/geopetak-mesh.webp`
- Delete: `frontend/public/images/projects/geopetak-xray.webp`

- [ ] **Step 1: Remove unreferenced preview components and obsolete assets**
- [ ] **Step 2: Verify `tests/portfolio_integrity.test.mjs` passes file checks**

---

### Task 3: Clean Dead CSS & Ghost Selectors

**Files:**
- Modify: `frontend/src/components/HomeClient.tsx:37`
- Modify: `index.html:360-377, 1585`

**Interfaces:**
- Removes `.hero-img-cell` from `document.querySelectorAll` in `HomeClient.tsx`.
- Removes dead `.hero-img-cell` CSS block from `index.html` lines 360-377.
- Removes `.hero-img-cell` from `document.querySelectorAll` in `index.html` line 1585.

- [ ] **Step 1: Clean selector in `HomeClient.tsx`**
- [ ] **Step 2: Clean dead CSS rules and selector in `index.html`**
- [ ] **Step 3: Run full test suite: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`**
Expected: PASS (25/25 tests pass).

---

### Task 4: Verify Frontend Production Build & Types

**Files:**
- Run build in: `frontend/`

- [ ] **Step 1: Run `npm run build` in `frontend/`**
Expected: Turbopack compilation succeeds with 0 TypeScript errors.

- [ ] **Step 2: Commit cleanup with descriptive message**
```bash
git add tests/ frontend/ index.html docs/
git commit -m "chore(cleanup): purge orphaned preview components, dead selectors, and boilerplate assets"
```
