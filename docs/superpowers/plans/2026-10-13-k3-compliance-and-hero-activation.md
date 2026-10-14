# Industrial K3 Compliance Engine & Hero Architectural Activation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-formulate the DNP K3 Inspection card using the Academic Docket tabbed/side-scrolling architecture with descriptive recruiter-facing naming, and activate the empty Hero right column with an interactive 3D architectural wireframe telemetry canvas.

**Architecture:** 
1. **K3 Compliance Engine**: Replace the cramped 5-lane card with a 3-tab layout (`SLA Pipeline`, `Inspection Kanban` with horizontal scroll, and `Statutory Forms`) inspired by Academic Docket. Maintain full Disnaker statutory fidelity (Form 6, Form 45 A.1, Form 55 L, Form 65 K) while providing wide, readable 200px+ cards and isolated `e.stopPropagation()` controls.
2. **Hero Architectural Canvas**: Transform the empty right column from a static watermark into an interactive isometric wireframe blueprint with dynamic cursor tilt/parallax, real-time discipline telemetry HUD, and mode toggles (`SYSTEM TOPOLOGY` vs `OPERATIONAL HUD`).
3. **Descriptive Renaming**: Upgrade "DNP Monitor" to "Industrial K3 Compliance Engine" in WorkGrid, modals, and tests, keeping DNP/MORIKU as domain provenance.

**Tech Stack:** Next.js 14 (App Router), React, TypeScript, TailwindCSS / Vanilla CSS, HTML5 Canvas / SVG Geometry, Node.js Test Runner.

## Global Constraints
- Strictly follow TDD: tests must be written first and fail before writing implementation code.
- Every interactive element inside preview cards must call `e.stopPropagation()` so card-level case study modal is not triggered inadvertently.
- Maintain brutalist architectural discipline per DESIGN.md: no decorative non-functional fluff, authentic data only.
- Never hardcode or expose private customer credentials.

---

### Task 1: Update Test Specifications (TDD Red Phase)

**Files:**
- Modify: `tests/portfolio_integrity.test.mjs`
- Modify: `tests/e2e_hero_and_conversion.test.mjs`

**Interfaces:**
- Asserts that project card is titled "Industrial K3 Compliance Engine" (or includes both K3 and Compliance).
- Asserts that `DNPMonitorPreview.tsx` implements the 3-tab architecture (`SLA Pipeline`, `Inspection Kanban`, `Statutory Forms`).
- Asserts that `Hero.tsx` renders an interactive architectural telemetry canvas (`hero-canvas` or `hero-interactive-blueprint`) and no longer relies on the empty static negative-space placeholder.

- [ ] **Step 1: Write the failing tests**

Update `tests/portfolio_integrity.test.mjs` and `tests/e2e_hero_and_conversion.test.mjs` to require:
1. Descriptive project title "Industrial K3 Compliance Engine" in both `WorkGrid.tsx` and `index.html`.
2. Tabbed architecture in `DNPMonitorPreview.tsx` (`SLA Pipeline`, `Inspection Kanban`, `Statutory Forms`).
3. Interactive architectural telemetry component in `Hero.tsx` (`hero-telemetry` or `hero-blueprint-canvas`).

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`
Expected: FAIL due to missing tab definitions, missing descriptive name in WorkGrid, or missing Hero canvas element.

---

### Task 2: Refactor K3 Inspection Preview (Docket Tabbed Architecture & Side Scroll)

**Files:**
- Modify: `frontend/src/components/previews/DNPMonitorPreview.tsx`
- Modify: `frontend/src/components/WorkGrid.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces: `DNPMonitorPreview` exporting 3 tabs:
  - `Tab 1: SLA Pipeline`: Metric cards (Disnaker compliance rate, overdue alerts, unit volume, inspection velocity).
  - `Tab 2: Inspection Kanban`: Horizontal side-scroller (`overflow-x-auto`) with wide 210px columns for 5 Disnaker stages (`01 PO/SPK`, `02 VERIFIKASI`, `03 PENJADWALAN`, `04 PELAKSANAAN RU`, `04b AKTUALISASI`), allowing stage advancement with `e.stopPropagation()`.
  - `Tab 3: Statutory Forms`: Disnaker form inspector (Pesawat Uap Form 6, Bejana Tekan Form 45 A.1, Instalasi Listrik Form 55 L, Proteksi Kebakaran Form 65 K) with technical specifications.
- Produces: `WorkGrid.tsx` renaming title to `Industrial K3 Compliance Engine` with subtitle `MORIKU · PT Delta Nusantara Persada`.

- [ ] **Step 1: Implement tabbed container and horizontal scroll in `DNPMonitorPreview.tsx`**
- [ ] **Step 2: Update project title and description in `WorkGrid.tsx` and static `index.html`**
- [ ] **Step 3: Run unit tests to verify passes**

Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: PASS

---

### Task 3: Activate Hero Section with Interactive Architectural Wireframe & Telemetry HUD

**Files:**
- Modify: `frontend/src/components/Hero.tsx`
- Modify: `index.html`
- Modify: `frontend/src/app/globals.css` (or inline styles)

**Interfaces:**
- Produces: `Hero.tsx` with:
  - Interactive SVG/Canvas wireframe mesh with mouse-reactive 3D parallax tilt (`transform: perspective(600px) rotateX(...) rotateY(...)`).
  - Active telemetry HUD: Regional coordinates (`06°14'S 107°00'E`), System Reliability (`99.98%`), Active Core Engines (`NEXT.JS · FASTAPI · WEBGL GIS · DOCKER`).
  - Mode toggle: `[01_TOPOLOGY]` vs `[02_TELEMETRY]` allowing recruiter to interact immediately.
- Produces: Equivalent interactive architectural block in static `index.html`.

- [ ] **Step 1: Build the interactive wireframe blueprint and telemetry in `Hero.tsx`**
- [ ] **Step 2: Port the interactive structure to `index.html`**
- [ ] **Step 3: Run E2E & Integrity tests**

Run: `node --test tests/e2e_hero_and_conversion.test.mjs`
Expected: PASS

---

### Task 4: Visual Regression & Playwright Verification

**Files:**
- Run production build: `npm run build`
- Browser validation via Playwright MCP tools on port 3000 (Next.js) and 3005 (static HTML).

- [ ] **Step 1: Build Next.js frontend to verify zero TypeScript or syntax errors**
Run: `npm run build` in `frontend/`
- [ ] **Step 2: Restart Next.js server on port 3000**
- [ ] **Step 3: Capture browser screenshots using Playwright**
Verify:
  - Hero section has dynamic architectural presence, no empty void.
  - K3 Compliance Engine has Docket-level readability, clean tabs, and smooth side-scrolling kanban.
  - Clicking interactive buttons inside preview does not open case study modal.
  - Clicking `[ Read Case ↗ ]` opens the modal properly.

---

### Task 5: Memory Documentation & Plan Signoff

**Files:**
- Update `DESIGN.md` reflecting the new descriptive naming and hero architecture.
- Store pattern in Serena memory.
