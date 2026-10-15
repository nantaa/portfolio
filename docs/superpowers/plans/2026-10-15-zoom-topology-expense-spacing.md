# 125% Scale, Hero Architecture Topology, AI Expense Console & Card Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a bold, spacious, senior-level experience by scaling proportional typography and layout to a 125% feel (without brittle CSS zoom), replacing the abstract 4-node hero spiderweb with an interactive 4-pillar animated system topology visualizer, completely rebuilding AI Expense Tracker into a live Gemini 2.0 Flash multimodal OCR console, and expanding WorkGrid card heights and spacing to eliminate cramped text.

**Architecture:**
1. **Design System & 125% Scale Tokens (`globals.css`, `Hero.tsx`, `WorkGrid.tsx`, `index.html`):**
   - Scale root base font size to `17px`/`18px` (`rem` scaling).
   - Expand layout constraints from `max-w-6xl` to `max-w-7xl` (`1380px`).
   - Increase section vertical margins and breathing room.
2. **Hero Architecture Topology Visualizer (`HeroTelemetryHUD.tsx`, `index.html`):**
   - Replace arbitrary 4-point spiderweb with a multi-pillar interactive Architecture Topology Engine.
   - 4 selectable pillars:
     - `[01] Enterprise Workflow`: Client ↔ WebSocket Gateway ↔ Laravel 11 State Engine ↔ PostgreSQL Audit Log + Redis Mailer Queue.
     - `[02] Procedural 3D & GLSL`: Parametric Meru/Island SDF ↔ GPU Vertex Displacement ↔ Realtime GLSL Caustics ↔ ACES Filmic Tone Mapping.
     - `[03] Real-time 3D Showroom`: Compressed GLB Mesh ↔ GLTFLoader Parser ↔ RoomEnvironment IBL ↔ Studio Lighting Stage.
     - `[04] Algorithmic Optimization`: Bipartite Graph Matching ↔ Gale-Shapley Stable Match ↔ Hungarian Cost Optimization ↔ 9-Stage Markov Chain.
   - Includes live animated packet pulses, latency meters, and node inspection.
3. **AI Expense Tracker Multimodal OCR Console (`ExpenseTrackerPreview.tsx`):**
   - Replace empty black screen with an active Gemini 2.0 Flash receipt extraction console.
   - Features active receipt voucher (Starbucks/AWS/Grab), real-time JSON extraction telemetry, category spending distribution chart, and tactile `[ ▶ Run Multimodal OCR Extraction ]` trigger.
4. **WorkGrid Card Height & Spacing Expansion (`globals.css`, `WorkGrid.tsx`, `index.html`):**
   - Increase grid row heights from `500px/380px/340px` to `580px/500px/460px`.
   - Expand `.wo` card description padding to `32px 36px` with comfortable margins (`mb-3`, `mb-4`, `mb-5`).
   - Ensure clean vertical separation between category badge, title, subtitle, and `Read Case ↗` button.

**Tech Stack:** Next.js 16 (React 19), Canvas 2D / WebGL / SVG, Tailwind CSS, Node.js Test Runner (`node:test`).

## Global Constraints
- Do NOT use CSS `zoom: 1.25` on body/html (which breaks modals, sticky nav, Three.js pointer coordinates, and non-Chromium browsers); use standard proportional token scaling (`rem`, container max-width, line-height).
- Zero WebGL/heavy canvas background leakage: Maintain on-demand gating for interactive previews.
- Readability minimums: 15px+ body copy, 13px+ subtitles, 12px technical badges.
- Automated tests pass 100% before committing.

---

### Task 1: Expand Card Heights & Spacing + Proportional 125% Scale

**Files:**
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/components/WorkGrid.tsx`
- Modify: `index.html`
- Test: `tests/portfolio_integrity.test.mjs`

- [ ] **Step 1: Write failing test in `tests/portfolio_integrity.test.mjs`**
Verify that WorkGrid card row heights are expanded (Row 1 >= 540px, Row 2 >= 480px, Row 3 >= 440px) and `.wo` container provides comfortable padding and vertical spacing.

- [ ] **Step 2: Run test to confirm failure**
Run `node --test tests/portfolio_integrity.test.mjs`.

- [ ] **Step 3: Update `globals.css` and `WorkGrid.tsx`**
Update grid template row dimensions, `.wo` padding, and typography scaling.

- [ ] **Step 4: Verify test passes**
Run `node --test tests/portfolio_integrity.test.mjs`.

---

### Task 2: Mirror Authentic AI Expense Tracker Application

**Files:**
- Modify: `frontend/src/components/previews/ExpenseTrackerPreview.tsx`
- Test: `tests/portfolio_integrity.test.mjs`

- [ ] **Step 1: Write failing test in `tests/portfolio_integrity.test.mjs`**
Verify that `ExpenseTrackerPreview.tsx` faithfully renders the actual features from the user's codebase (`D:\Document Backup\website-aryo\ai expense tracker`):
1. The genuine `ReceiptUploader` zone ("Click or drop receipt · Fastest way to add expenses").
2. Real transaction ledger items matching their schema (`description`, `amount`, `category`, `date`).
3. Authentic `aiService.js` Gemini categorization output: category, confidence score, and reasoning.
4. Total spend summary and category spending distribution from `Dashboard.tsx`.

- [ ] **Step 2: Run test to confirm failure**
Run `node --test tests/portfolio_integrity.test.mjs`.

- [ ] **Step 3: Implement authentic Expense Tracker UI in `ExpenseTrackerPreview.tsx`**
Mirror the authentic UI:
- Dashboard summary cards (Monthly Total, Budget Health, AI Status).
- Receipt upload dropzone with interactive sample receipt selection.
- Live Gemini categorization panel with genuine reasoning and confidence output.
- Recent transaction stream.

- [ ] **Step 4: Verify test passes**
Run `node --test tests/portfolio_integrity.test.mjs`.

---

### Task 3: Replace Hero 4-Point Spiderweb with Architecture Topology Visualizer

**Files:**
- Modify: `frontend/src/components/HeroTelemetryHUD.tsx`
- Modify: `index.html`
- Test: `tests/portfolio_integrity.test.mjs`

- [ ] **Step 1: Write failing test in `tests/portfolio_integrity.test.mjs`**
Verify that Hero HUD renders distinct system architecture schematics for each of the 4 engineering pillars (Enterprise, 3D Shaders, 3D Showroom, Algorithms) with animated data flow and component blocks.

- [ ] **Step 2: Run test to confirm failure**
Run `node --test tests/portfolio_integrity.test.mjs`.

- [ ] **Step 3: Implement Architecture Topology Visualizer in `HeroTelemetryHUD.tsx`**
Build the dynamic schematic renderer with node blocks, packet flow, latency telemetry, and interactive pillar switching.

- [ ] **Step 4: Mirror updates in static `index.html`**
Update the static fallback HUD in `index.html`.

- [ ] **Step 5: Verify tests pass**
Run `node --test tests/portfolio_integrity.test.mjs`.

---

### Task 4: Full Verification & Static Build

- [ ] **Step 1: Run all automated tests**
Run `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`.

- [ ] **Step 2: Run static production build**
Run `npm run build` in `frontend/`.

- [ ] **Step 3: Visual inspection via Playwright**
Inspect expanded card heights, AI Expense Tracker console, hero architecture visualizer, and 125% scale feel.

- [ ] **Step 4: Commit changes to submodule and root repo**
