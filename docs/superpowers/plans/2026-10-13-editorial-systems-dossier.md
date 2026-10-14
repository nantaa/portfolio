# Editorial Systems Dossier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from an overwhelming "miniature dashboard simulator" into an authoritative, executive **Editorial Systems Dossier** where the Hero Right column and Project Cards lead with high-clarity **Problem → Architecture → Impact** narratives while maintaining elegant, focused visual previews.

**Architecture:**
1. **Hero Section (Right Column)**: Replace the mock sci-fi server telemetry (`99.98% SLA`, `18ms backbone latency`) with an **Executive Systems Matrix & Technical Dossier** adhering strictly to `DESIGN.md`. Highlights verified production scale (`350+ automated tests across codebases`, `zero-downtime deployment`, `sub-2h SLA`), 4 core disciplines (Enterprise ERP, Creative Motion & 3D, Algorithmic Optimization, DevOps & Infrastructure), and current availability.
2. **Project Cards (Inline Narrative Layer)**: Bring the core story out from behind the modal click! Each card directly displays:
   - **Executive Problem Statement**: The high-stakes operational/business bottleneck.
   - **Engineering Solution**: The core technical breakthrough.
   - **Verified Metric**: Clear badge/pill (e.g., `270+ Tests Passing · 0 SLA Errors · Zero-Downtime Deploy`).
   - **Focused Visual**: Calm, legible visual representation (eliminating tiny 7px fonts, unreadable widgets, and cognitive overload).
3. **Case Study Modal**: Retained as the deep-dive postmortem for technical recruiters wanting full problem/thinking/execution/result retrospectives.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, TailwindCSS / CSS variables, Node.js test runner.

## Global Constraints
- Follow TDD phase order strictly: plan → test → implement → review → verify → document/remember → refactor/improve.
- Do NOT begin implementation before user explicitly approves this plan.
- All non-public assets remain archived in `.internal_archive/` and ignored in `.gitignore`.
- Maintain clean, brutalist Swiss typography with zero generic cartoon illustrations or mock datacenter gimmicks.

---

### Task 1: Update Test Specifications (TDD Red Phase)

**Files:**
- Modify: `tests/portfolio_integrity.test.mjs`
- Modify: `tests/e2e_hero_and_conversion.test.mjs`

**Interfaces:**
- Asserts that Hero Right displays the **Executive Systems Matrix & Technical Dossier** with real competencies (`Enterprise ERP`, `Creative Motion & 3D`, `Algorithmic Optimization`, `DevOps & Infrastructure`) and verified production metrics (`350+ Automated Tests`, `Zero-Downtime Deployment`), and asserts zero mock telemetry gimmicks (`99.98% SLA`, `18ms backbone latency`).
- Asserts that WorkGrid project cards display inline **Problem**, **Architecture**, and **Impact** narrative elements directly on the card surface without requiring modal clicks.
- Asserts that `Industrial K3 Compliance Engine` and `Academic Thesis Docket` previews are calm, legible, and dignified.

- [ ] **Step 1: Write the failing tests**
Update both test files to assert the narrative-first requirements and the removal of mock server telemetry.

- [ ] **Step 2: Run tests to verify failure (RED)**
Run: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`
Expected: FAIL due to missing inline narrative fields and presence of legacy mock telemetry in Hero.

---

### Task 2: Implement Hero Executive Systems Dossier

**Files:**
- Modify: `frontend/src/components/Hero.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces: `Hero.tsx` with:
  - Header: `SYSTEMS ARCHITECT & IT LEAD // TECHNICAL DOSSIER` · `06°14'S 107°00'E`
  - 4 Core Engineering Domains with authentic tech and production scale:
    - `01 ENTERPRISE ERP & WORKFLOWS`: Laravel 11 · React 19 Inertia · PostgreSQL (270+ automated tests, Disnaker statutory state machine).
    - `02 CREATIVE MOTION & 3D WEBGL`: Vue 3 · Three.js · GSAP ScrollTrigger (60fps scrubbed timelines, shader pipelines).
    - `03 ALGORITHMIC SYSTEMS`: Discrete Mathematics · Gale-Shapley & Hungarian Bipartite Matching (88 passing unit tests).
    - `04 INFRASTRUCTURE & DEVOPS`: Linux · Docker · WhatsApp Cloud API webhooks · Zero-downtime atomic symlink switching.
  - Verified Operational Track Record:
    - `350+ Automated Tests Passing Across Production Systems`
    - `Zero SLA Calculation Errors Across 15 Inspection Stages`
    - `Sub-2h Incident Resolution Window for Field Teams`
  - Availability & Location: `BEKASI, INDONESIA · AVAILABLE FOR SYSTEMS ARCHITECTURE & LEAD FULLSTACK`
- Produces: Matching structure in static `index.html`.

- [ ] **Step 1: Update `Hero.tsx` with the Executive Systems Dossier**
- [ ] **Step 2: Update static `index.html` with matching structure**
- [ ] **Step 3: Run test suite to verify Hero tests pass**

---

### Task 3: Elevate Project Cards with Inline Narrative (Problem → System → Impact)

**Files:**
- Modify: `frontend/src/components/WorkGrid.tsx`
- Modify: `frontend/src/components/previews/DNPMonitorPreview.tsx`
- Modify: `frontend/src/components/previews/AcademicDocketPreview.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces: `WorkGrid.tsx` rendering structured inline narrative blocks for each featured project:
  - **Problem Strip**: e.g., *"Disnaker 30-day statutory SLA calculation bugs and silent error swallowing caused missed inspection deadlines across 15 industrial stages."*
  - **Architectural Breakthrough**: e.g., *"Replaced fragile cron jobs with an event-driven state machine in Laravel 11 & React 19 Inertia with strict RBAC inspector locks."*
  - **Verified Result Pill**: e.g., `270+ Tests Passed · 0 SLA Errors · Zero-Downtime Deploy`.
  - **Action**: `[ Read Full Case Study ↗ ]`.
- Calms the preview components so they act as dignified, legible visual evidence rather than noisy miniature applications.
- Produces: Matching inline narrative cards in static `index.html`.

- [ ] **Step 1: Update `WorkGrid.tsx` to render inline narrative blocks**
- [ ] **Step 2: Streamline `DNPMonitorPreview.tsx` and `AcademicDocketPreview.tsx` for optimal clarity**
- [ ] **Step 3: Update `index.html` with matching card structure**
- [ ] **Step 4: Run unit and integrity tests (GREEN)**
Run: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`
Expected: PASS (18/18 tests pass)

---

### Task 4: Production Build & Visual Verification via Playwright

**Files:**
- Build: `npm run build` in `frontend/`
- Restart Next.js server on port 3000
- Run Playwright screenshots across both port 3000 and port 3005

- [ ] **Step 1: Execute `npm run build` to verify TypeScript compile**
- [ ] **Step 2: Capture screenshots of Hero section and WorkGrid**
- [ ] **Step 3: Validate that narrative is immediately readable in under 5 seconds without requiring modal interaction**

---

### Task 5: Memory Documentation & Archive Audit

**Files:**
- Update `DESIGN.md`
- Record state in Serena memory
- Verify `.internal_archive/` remains untouched and git working tree is spotless.
