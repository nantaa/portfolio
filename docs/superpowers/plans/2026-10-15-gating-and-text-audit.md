# On-Demand Interactive Gating & Readability Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Invert the diorama order (Raja Ampat first, then Ulun Danu), introduce architectural click-to-activate gates for interactive project cards to prevent GPU/browser bogdown, and perform a full-portfolio text audit to cut bloat, maximize contrast, and enhance senior readability.

**Architecture:** 
1. `MaterialStudiesCarousel.tsx`: Re-index studies so Raja Ampat is Study 0 and Ulun Danu Bratan is Study 1.
2. `ProjectPreviewGate.tsx`: A reusable architectural standby gate component for interactive cards (DNP Monitor, Tata$, Academic Docket, Geopetak, Helpdesk, Expense Tracker) that shows an authoritative technical blueprint teaser with a tactile `[ ▶ Launch Interactive Simulator / 3D ]` trigger, mounting the live component only on demand.
3. Content & Typography Audit: Strip unnecessary adjectives and repetitive jargon; format case studies with tight, high-impact bulleted metrics; increase minimum body typography to 15px+ with high contrast (`#F0EDE8`).

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS, Node.js Test Runner (`node:test`).

## Global Constraints
- Zero initial WebGL/heavy canvas instantiation until user triggers preview activation.
- Mobile scroll safety: No interactive canvas/map gesture hijacking while scrolling through the grid.
- Minimum font sizes: 15px body copy, 12px technical badges/triggers.
- 0MB-RAM static VPS compatibility: `npm run build` static export must succeed with 0 errors.

---

### Task 1: Re-Order Diorama Studies (Raja Ampat First)

**Files:**
- Modify: `frontend/src/components/previews/MaterialStudiesCarousel.tsx`
- Modify: `frontend/src/components/WorkGrid.tsx`
- Modify: `index.html`
- Test: `tests/portfolio_integrity.test.mjs`

- [ ] **Step 1: Write failing test in `tests/portfolio_integrity.test.mjs`**
Verify that Raja Ampat is the initial active slide (`index: 0`) and Ulun Danu is the second slide (`index: 1`).

- [ ] **Step 2: Run test to confirm failure**
Run `node --test tests/portfolio_integrity.test.mjs`.

- [ ] **Step 3: Update `MaterialStudiesCarousel.tsx` and static files**
Swap array order in `STUDIES`: Raja Ampat Snorkel Day at index 0, Ulun Danu Bratan at index 1.

- [ ] **Step 4: Verify test passes**
Run `node --test tests/portfolio_integrity.test.mjs`.

---

### Task 2: Build Reusable Architectural Preview Gate (`ProjectPreviewGate.tsx`)

**Files:**
- Create: `frontend/src/components/previews/ProjectPreviewGate.tsx`
- Modify: `frontend/src/components/previews/TataPreview.tsx`
- Modify: `frontend/src/components/WorkGrid.tsx`
- Test: `tests/portfolio_integrity.test.mjs`

- [ ] **Step 1: Write failing test for interactive preview gating**
Verify that interactive previews (especially 3D Tata$) implement click-to-activate gates to prevent initial WebGL/animation overhead.

- [ ] **Step 2: Run test to confirm failure**
Run `node --test tests/portfolio_integrity.test.mjs`.

- [ ] **Step 3: Implement `ProjectPreviewGate.tsx`**
Create an architectural blueprint gate with technical badge, system architecture summary, tactile activation button (`▶ Launch Interactive Preview`), and instant unmount/mount state.

- [ ] **Step 4: Wrap Tata$ and interactive previews**
Integrate the gate so Tata$ 3D bag models and WebGL context only spin up when the user clicks to interact.

- [ ] **Step 5: Verify tests pass**
Run `node --test tests/portfolio_integrity.test.mjs`.

---

### Task 3: Text & Readability Audit Across Portfolio

**Files:**
- Modify: `frontend/src/components/CaseStudyModal.tsx`
- Modify: `frontend/src/components/WorkGrid.tsx`
- Modify: `frontend/src/components/Hero.tsx`
- Modify: `index.html`
- Test: `tests/portfolio_integrity.test.mjs`

- [ ] **Step 1: Audit and tighten text copy**
Eliminate fluff, pseudo-military filler, and long paragraphs. Replace with punchy, metric-backed statements.
Ensure typography across modals and cards uses clear, comfortable font sizing (15px-17px body, 12px tags).

- [ ] **Step 2: Run all automated tests**
Run `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`.

- [ ] **Step 3: Verify static export build**
Run `npm run build` in `frontend/`.

---

### Task 4: Interactive Verification & Commit

- [ ] **Step 1: Verify in browser via Playwright**
Inspect the gated previews, click to activate, test slide order, and verify text readability.

- [ ] **Step 2: Commit changes to submodule and root repository**
