# Raja Ampat Snorkel Day Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate `raja_ampat_snorkel_day.html` alongside `ulun_danu_lake_bratan_material_studies.html` in an on-demand, click-to-load 3D carousel that prevents GPU context exhaustion and respects the 0MB-RAM static VPS architecture.

**Architecture:** Create an on-demand Dual 3D Material Studies carousel (`MaterialStudiesCarousel.tsx`) inside the second grid card. The component displays editorial diorama cards with a click-to-activate trigger, only mounting the active slide's WebGL iframe upon user interaction, and unmounting inactive slides to guarantee that no more than 1 WebGL context exists in the browser DOM at any time.

**Tech Stack:** Next.js 16 (React 19), Three.js / GLSL HTML dioramas, Tailwind CSS, Node.js Test Runner (`node:test`).

## Global Constraints

- Static export compatibility: `next build` produces static files in `out/`, no Node.js runtime required.
- Zero WebGL leak: At most one 3D iframe mounted simultaneously; inactive slide unmounted on switch.
- No canvas gesture collisions: Carousel navigation must use external tactile pill/arrow controls, never swipe handlers over the 3D canvas that hijack Three.js `OrbitControls`.
- Readability minimums: Minimum 15px for case descriptions, 12px for badges/triggers.
- Automated tests pass with 100% success before committing.

---

### Task 1: Static Asset Provisioning & Test Suite Expansion

**Files:**
- Create/Copy: `frontend/public/raja_ampat_snorkel_day.html`
- Modify: `tests/portfolio_integrity.test.mjs`

**Interfaces:**
- Consumes: `raja_ampat_snorkel_day.html` in project root
- Produces: `frontend/public/raja_ampat_snorkel_day.html` accessible at `/raja_ampat_snorkel_day.html`

- [ ] **Step 1: Write failing tests for Raja Ampat presence and carousel mechanics**

Add tests to `tests/portfolio_integrity.test.mjs`:
1. Verify `raja_ampat_snorkel_day.html` exists in both root and `frontend/public/`.
2. Verify carousel preview component exists and implements on-demand click-to-load gating.
3. Verify carousel controls prevent multi-WebGL context instantiation.
4. Verify `WorkGrid.tsx` and `index.html` showcase both studies in the 3D material series.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: FAIL on missing `frontend/public/raja_ampat_snorkel_day.html` and carousel mechanics.

- [ ] **Step 3: Copy static asset into frontend public folder**

Copy `raja_ampat_snorkel_day.html` into `frontend/public/raja_ampat_snorkel_day.html`.

- [ ] **Step 4: Verify test progression**

Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: Passes static file check, fails carousel component check.

---

### Task 2: Build On-Demand Click-to-Load Carousel Component

**Files:**
- Create: `frontend/src/components/previews/MaterialStudiesCarousel.tsx`
- Modify: `frontend/src/components/previews/UlunDanuPreview.tsx` (re-export or alias for backwards compatibility)
- Modify: `frontend/src/components/WorkGrid.tsx`

**Interfaces:**
- Consumes: `/ulun_danu_lake_bratan_material_studies.html`, `/raja_ampat_snorkel_day.html`
- Produces: `MaterialStudiesCarousel` React component with dual study slides:
  - Slide 0: Ulun Danu Bratan (Bali · 1,239M ASL · Meru Architecture & Volcanic Mist)
  - Slide 1: Raja Ampat Snorkel Day (Papua · Coral Reefs, Caustics & Marine Ecosystem)
  - State: `activeSlide: 0 | 1`, `loadedSlides: { [key: number]: boolean }`
  - Controls: Tactile switcher pills `[ 01 · ULUN DANU ]` / `[ 02 · RAJA AMPAT ]`, `←` / `→` arrows, `[ ▶ Load Interactive 3D ]` activation trigger.

- [ ] **Step 1: Implement `MaterialStudiesCarousel.tsx`**

Implement full click-to-load carousel with:
- IntersectionObserver viewport gating (unmounts if scrolled out of view).
- Click-to-load poster screen with culture coordinates, shader badge, and activation button.
- Clean unmounting of inactive iframe when switching between slides.
- Direct external link `Open Full 3D Study ↗` corresponding to the active study.

- [ ] **Step 2: Connect carousel into `WorkGrid.tsx`**

Update project #2 metadata and preview in `frontend/src/components/WorkGrid.tsx` to reflect the Indonesian Procedural Diorama series (Lake Bratan & Raja Ampat).

- [ ] **Step 3: Run automated tests**

Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: PASS for frontend carousel integration.

---

### Task 3: Sync Static `index.html` & Build Verification

**Files:**
- Modify: `index.html`
- Test: Static production build via `npm run build`

**Interfaces:**
- Consumes: Updated project definition
- Produces: Mirrored dual-study showcase and case dossier in static `index.html`

- [ ] **Step 1: Update `index.html` card #02**

Update Card #02 in `index.html` to showcase the dual procedural studies with tab switching between Lake Bratan and Raja Ampat, updating the dossier details accordingly.

- [ ] **Step 2: Run all automated tests**

Run: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`
Expected: 30+ tests PASS.

- [ ] **Step 3: Run static export build**

Run: `npm run build` in `frontend/`
Expected: Successful compile and export to `out/` with 0 errors.

---

### Task 4: Visual & Interactive Verification

**Files:**
- Verification only

- [ ] **Step 1: Verify in browser via Playwright**
Navigate to the running preview on port 3000, test clicking to load the 3D scene, toggling between Ulun Danu and Raja Ampat, and checking responsive layout.

- [ ] **Step 2: Commit changes**
Stage and commit root repo and `frontend` submodule.
