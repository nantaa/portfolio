# Theme-Adaptive Selected Work Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eradicate all remaining hardcoded dark/black backgrounds and borders across all 8 Selected Work preview components so that in Light Theme (`[data-theme="light"]`) every preview flawlessly conforms to the warm linen (`#F7F4EE`), surface (`#FAF8F3` / `#FFFFFF`), and charcoal ink (`#1A1816`) design system without harsh pitch-black blocks.

**Architecture:** Replace hardcoded hex codes (`#0b0c0d`, `#0e0e0e`, `#0d0d0d`, `#060606`, `#0a0a0a`, `#0a0b0c`, `border-white/*`, etc.) with semantic CSS variables (`var(--s1)`, `var(--s2)`, `var(--s3)`, `var(--wire)`, `var(--text)`, `var(--muted)`). For dynamic canvas elements (Expense Tracker), dynamically adapt drawing palettes based on the active `[data-theme="light"]` attribute.

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS v4 / Vanilla CSS variables, HTML5 Canvas 2D API, Three.js GLTF/WebGL, Node.js native test runner (`node:test`).

## Global Constraints

- Never break existing dark mode aesthetics: in dark mode, surfaces must remain technical, high-contrast, and sleek.
- Never use arbitrary inline dark hex colors where CSS variables exist.
- In light mode (`[data-theme="light"]`), zero preview cards or containers may render pitch-black backgrounds (`#000000`, `#060606`, `#0b0c0d`, `#0e0e0e`, `#0d0d0d`, `#0a0b0c`, etc.).
- Maintain 100% test pass rate across all 54 existing tests in `tests/*.test.mjs`.
- Always verify in browser at 500x559 mobile viewport in Light Mode.

---

### Task 1: Write Failing Tests for Theme-Adaptive Work Previews

**Files:**
- Modify: `tests/theme_system.test.mjs:51-120`

**Interfaces:**
- Consumes: Node.js `node:test`, `node:assert/strict`, `fs`, `path`
- Produces: New unit tests asserting zero hardcoded dark backgrounds in work preview components and CSS

- [ ] **Step 1: Write the failing tests in `tests/theme_system.test.mjs`**

Add tests to verify:
1. `DNPMonitorPreview.tsx` contains NO hardcoded `#0b0c0d` or `#121315`.
2. `AcademicDocketPreview.tsx` contains NO hardcoded `#0e0e0e`.
3. `ExpenseTrackerPreview.tsx` contains NO hardcoded `#0a0b0c` or `#0e0f10`.
4. `globals.css` replaces `#0d0d0d` in `.hd-preview`, `#060606` in `.tata-preview`, `#070707` in `.gp-preview`, and includes `[data-theme="light"] .tata-bg`.
5. `MaknaMoodboardPreview.tsx` contains NO hardcoded `#0a0a0a` or `#0b0c0d`.

```javascript
test('Selected Work preview components eliminate hardcoded dark hex backgrounds in favor of semantic CSS tokens', () => {
  const dnpPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'DNPMonitorPreview.tsx');
  const dnpContent = fs.readFileSync(dnpPath, 'utf-8');
  assert.ok(!dnpContent.includes('#0b0c0d'), 'DNPMonitorPreview must not hardcode #0b0c0d');
  assert.ok(!dnpContent.includes('#121315'), 'DNPMonitorPreview must not hardcode #121315');

  const docketPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'AcademicDocketPreview.tsx');
  const docketContent = fs.readFileSync(docketPath, 'utf-8');
  assert.ok(!docketContent.includes('#0e0e0e'), 'AcademicDocketPreview must not hardcode #0e0e0e');

  const expensePath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'ExpenseTrackerPreview.tsx');
  const expenseContent = fs.readFileSync(expensePath, 'utf-8');
  assert.ok(!expenseContent.includes('#0a0b0c'), 'ExpenseTrackerPreview must not hardcode #0a0b0c');

  const maknaPath = path.join(rootDir, 'frontend', 'src', 'components', 'previews', 'MaknaMoodboardPreview.tsx');
  const maknaContent = fs.readFileSync(maknaPath, 'utf-8');
  assert.ok(!maknaContent.includes('#0a0a0a'), 'MaknaMoodboardPreview must not hardcode #0a0a0a');
  assert.ok(!maknaContent.includes('#0b0c0d'), 'MaknaMoodboardPreview must not hardcode #0b0c0d');

  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  assert.ok(!cssContent.includes('.hd-preview {\n      position: absolute;\n      inset: 0;\n      display: flex;\n      flex-direction: column;\n      background: #0d0d0d;'), 'HelpdeskPreview must not have hardcoded #0d0d0d');
  assert.ok(cssContent.includes('.hd-preview') && cssContent.includes('background: var(--s2)'), 'HelpdeskPreview must use var(--s2)');
  assert.ok(cssContent.includes('[data-theme="light"] .tata-bg'), 'Tata preview must have light theme background adaptation');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/theme_system.test.mjs`
Expected: FAIL with assertion errors indicating `#0b0c0d` or `#0e0e0e` found in preview files.

---

### Task 2: Adapt DNPMonitorPreview to Dual-Theme Semantic Tokens

**Files:**
- Modify: `frontend/src/components/previews/DNPMonitorPreview.tsx:210-505`

**Interfaces:**
- Consumes: Tailwind CSS theme variables (`var(--s1)`, `var(--s2)`, `var(--s3)`, `var(--wire)`, `var(--text)`, `var(--muted)`)
- Produces: Theme-responsive K3 compliance inspection dashboard

- [ ] **Step 1: Replace hardcoded colors in `DNPMonitorPreview.tsx`**
1. Change outer container: `bg-[#0b0c0d] text-[#e5e7eb] border border-white/5` → `bg-[var(--s2)] text-[var(--text)] border border-[var(--wire)]`.
2. Header divider: `border-b border-white/10` → `border-b border-[var(--wire)]`.
3. Header title: `text-neutral-300` → `text-[var(--text)]`.
4. Inactive tab buttons: `bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10` → `bg-[var(--s1)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--wire)]`.
5. Reset button: `text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10` → `text-[var(--muted)] hover:text-[var(--text)] bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)]`.
6. Kanban Column headers: `bg-white/5` → `bg-[var(--s3)] text-[var(--muted)]`.
7. Column card containers: `bg-white/[0.02] border` → `bg-[var(--s2)] border border-[var(--wire)]`.
8. Draggable job cards: `bg-[#121315] border border-white/5` → `bg-[var(--s1)] border border-[var(--wire)] text-[var(--text)] shadow-sm`.
9. Metric stat blocks: `bg-white/[0.03] border border-white/5` → `bg-[var(--s1)] border border-[var(--wire)]`.

- [ ] **Step 2: Verify unit test progress**

Run: `node --test tests/theme_system.test.mjs`
Expected: DNP preview assertion passes.

---

### Task 3: Adapt AcademicDocketPreview to Dual-Theme Semantic Tokens

**Files:**
- Modify: `frontend/src/components/previews/AcademicDocketPreview.tsx:45-163`

**Interfaces:**
- Consumes: Tailwind CSS theme variables
- Produces: Theme-responsive Academic Algorithm Center preview

- [ ] **Step 1: Replace hardcoded colors in `AcademicDocketPreview.tsx`**
1. Outer container: `bg-[#0e0e0e] text-[#eeebe5] border border-white/5` → `bg-[var(--s2)] text-[var(--text)] border border-[var(--wire)]`.
2. Header divider: `border-b border-white/10` → `border-b border-[var(--wire)]`.
3. Inactive tab buttons: `bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10` → `bg-[var(--s1)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--wire)]`.
4. Table headers: `text-neutral-500 border-white/5` → `text-[var(--muted)] border-[var(--wire)]`.
5. Table rows: `bg-white/[0.03] hover:bg-white/[0.06]` → `bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)] text-[var(--text)]`.
6. Student names & score badges: `text-neutral-200` → `text-[var(--text)]`.
7. Bottom telemetry bar: `border-t border-white/10` → `border-t border-[var(--wire)]`.

- [ ] **Step 2: Verify unit test progress**

Run: `node --test tests/theme_system.test.mjs`
Expected: Academic docket preview assertion passes.

---

### Task 4: Adapt HelpdeskPreview, TataPreview, and GeopetakPreview in globals.css

**Files:**
- Modify: `frontend/src/app/globals.css:1258-1375, 2544-2700`

**Interfaces:**
- Consumes: CSS root variables (`--s1`, `--s2`, `--s3`, `--wire`, `--text`, `--muted`)
- Produces: Clean, theme-aware CSS stylesheets for Helpdesk, Tata$, and Geopetak

- [ ] **Step 1: Update `.hd-preview` in `globals.css`**
1. Change `.hd-preview { background: #0d0d0d; }` to `background: var(--s2); color: var(--text);`.
2. Change `.hd-topbar` border: `border-bottom: 0.5px solid var(--wire);`.
3. Change `.hd-row` border: `border-bottom: 0.5px solid var(--wire);`.
4. Change `.hd-ttitle`: `color: var(--text);`.
5. Change `.hd-tid`: `color: var(--muted);`.

- [ ] **Step 2: Update `.tata-preview` & `.tata-bg` in `globals.css`**
1. Change `.tata-preview { background: #060606; }` to `background: var(--s2);`.
2. Add light-theme adaptation:
```css
[data-theme="light"] .tata-bg {
  background: radial-gradient(circle at center, rgba(186, 102, 23, 0.08) 0%, rgba(247, 244, 238, 0.95) 100%);
  opacity: 0.9;
}
[data-theme="light"] .tata-watermark {
  color: rgba(186, 102, 23, 0.14);
  text-shadow: none;
}
[data-theme="light"] .tata-switch-btn {
  background: var(--s1);
  border-color: var(--wire);
  color: var(--muted);
}
[data-theme="light"] .tata-switch-btn:hover {
  background: var(--s3);
  color: var(--text);
}
```

- [ ] **Step 3: Update `.gp-preview` and legacy preview blocks in `globals.css`**
1. Change `.gp-preview { background: #070707; }` to `background: var(--s2);`.
2. Ensure `[data-theme="light"] .gp-base-img` uses full brightness and clean contrast over the linen surface (`opacity: 0.95`).
3. Update `.kj-preview`, `.dnp-preview`, `.et-preview`, `.ra-preview` to `background: var(--s2);`.

- [ ] **Step 4: Verify unit test progress**

Run: `node --test tests/theme_system.test.mjs`
Expected: CSS assertions pass.

---

### Task 5: Adapt ExpenseTrackerPreview and MaknaMoodboardPreview

**Files:**
- Modify: `frontend/src/components/previews/ExpenseTrackerPreview.tsx:165-375`
- Modify: `frontend/src/components/previews/MaknaMoodboardPreview.tsx:35-185`

**Interfaces:**
- Consumes: Canvas rendering context, DOM theme detection
- Produces: Theme-aware node bus canvas and clean moodboard thumbnail/lightbox

- [ ] **Step 1: Adapt `ExpenseTrackerPreview.tsx`**
1. Detect light theme in canvas render loop via `document.documentElement.getAttribute("data-theme") === "light"`.
2. Canvas grid lines: use `rgba(0,0,0,0.04)` in light mode, `rgba(255,255,255,0.025)` in dark mode.
3. Canvas node cards: use `rgba(255,255,255,0.96)` with `rgba(0,0,0,0.12)` border in light mode, `rgba(12,13,14,0.88)` with `rgba(255,255,255,0.16)` border in dark mode.
4. Canvas node typography: use `#1A1816` in light mode, `#EEEBE5` in dark mode.
5. Container and inspector elements:
   - Outer container: `background: "var(--s2)"`.
   - Communication bus header: border `var(--wire)`, title `color: "var(--text)"`.
   - Active Node inspector card: `background: "var(--s1)"`, border `var(--wire)`.
   - JSON payload box: `background: "var(--s2)"`, border `var(--wire)`.

- [ ] **Step 2: Adapt `MaknaMoodboardPreview.tsx`**
1. Card thumbnail outer container: `bg-[var(--s2)]`.
2. Ambient vignette: in light mode, use subtle vignette `from-[var(--s2)]/90 via-transparent to-transparent` so moodboard imagery looks vibrant and not blackened out.
3. Top-right badge: `bg-[var(--nav-bg)] border border-[var(--wire)] text-[var(--muted)] backdrop-blur-md`.
4. Bottom hint bar: `text-[var(--text)]` and `text-[var(--muted)]`.
5. Lightbox modal: `bg-[var(--s1)] border border-[var(--wire)] text-[var(--text)]`.
6. Lightbox header: `bg-[var(--s2)] border-b border-[var(--wire)]`.

- [ ] **Step 3: Verify all unit tests**

Run: `node --test tests/*.test.mjs`
Expected: All 54+ tests PASS (100%).

---

### Task 6: Visual Browser Verification & Production Build

**Files:**
- Test: Browser subagent at 500x559 in Light Mode
- Build: `npm --prefix frontend run build`

- [ ] **Step 1: Run production build**

Run: `npm --prefix frontend run build`
Expected: Successful Next.js static export without errors.

- [ ] **Step 2: Launch browser subagent in Light Mode**

Run browser subagent at 500x559 viewport on `http://localhost:3456/`, toggle theme to Light Mode (if not already), scroll through each of the 8 Selected Work cards, capture screenshots, and inspect that NO pitch-black blocks exist.

- [ ] **Step 3: Commit and document**

Run: `git add . && git commit -m "feat(theme): adapt all selected work previews to warm linen light theme"`
Expected: Clean git working tree.

---
