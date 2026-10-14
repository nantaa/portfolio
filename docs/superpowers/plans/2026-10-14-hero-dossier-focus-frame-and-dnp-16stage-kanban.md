# Hero Cleanup, Focus Frame Removal & 16-Stage DNP Statutory Kanban Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the Hero section label, eliminate the default browser white focus outline from selected project cards, and upgrade the Industrial K3 Compliance Engine preview into an authentic 16-stage Disnaker statutory Kanban simulator stripped of all emojis and AI signatures.

**Architecture:** 
1. Replace pseudo-military `// DOSSIER` labels in `HeroTelemetryHUD.tsx` and `index.html` with explicit architectural domain labels (`SYSTEM TOPOLOGY` / `PRODUCTION TELEMETRY`).
2. Neutralize browser default focus ring on `.wc` / `.wc-interactive` cards across `WorkGrid.tsx`, `globals.css`, and `index.html` to eliminate the jarring white line frame.
3. Overhaul `DNPMonitorPreview.tsx` to mirror the authentic 16-stage statutory lifecycle from `KANBAN_FLOW_SIMULATOR.html` with 4 statutory phase filters (`F1: Berkas [1-3]`, `F2: Lapangan [4-6]`, `F3: Disnaker [7-9]`, `F4: Suket & Fin [10-16]`), 6 operational roles (`MKT`, `ADM`, `TRU`, `AHLI`, `FIN`, `SUP`), interactive forward/backward stage advancement, and realistic Indonesian PJK3 data, completely stripped of emojis and AI artifacts.

**Tech Stack:** Next.js 16 (React 19), TypeScript, Tailwind CSS v4, Vanilla HTML/CSS/JS, Node.js Test Runner (`node --test`).

## Global Constraints
- Strictly adhere to `DESIGN.md` (no generic AI emojis, no cartoonish gradients, high-contrast dark architectural editorial palette).
- Maintain 100% test pass rate across `tests/portfolio_integrity.test.mjs` and `tests/e2e_hero_and_conversion.test.mjs`.
- Never break keyboard accessibility while removing the visual white outline.

---

### Task 1: Clean Up Hero Section Labels & Purge "// DOSSIER"

**Files:**
- Modify: `frontend/src/components/HeroTelemetryHUD.tsx:365-375`
- Modify: `index.html:1225-1240`
- Test: `tests/portfolio_integrity.test.mjs`

**Interfaces:**
- Consumes: `HeroTelemetryHUD` component state (`mode: "TOPOLOGY" | "TELEMETRY"`)
- Produces: Clear architectural header label (`SYSTEM TOPOLOGY & MESH` vs `SYSTEM TELEMETRY & SCALE`)

- [ ] **Step 1: Write the failing test**
Update `tests/portfolio_integrity.test.mjs` to assert that HeroTelemetryHUD and `index.html` hero headers do not contain pseudo-military `// DOSSIER` and instead use professional architectural labels.

```javascript
test('Hero section purges pseudo-military // DOSSIER label in favor of clean architectural naming', () => {
  const heroHud = fs.readFileSync(path.resolve('frontend/src/components/HeroTelemetryHUD.tsx'), 'utf-8');
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  assert.ok(!heroHud.includes('// DOSSIER'), 'HeroTelemetryHUD should not use // DOSSIER');
  assert.ok(!indexHtml.includes('// TECHNICAL DOSSIER'), 'index.html should not use // TECHNICAL DOSSIER');
  assert.ok(heroHud.includes('SYSTEM TOPOLOGY'), 'HeroTelemetryHUD must display clean architectural title');
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: FAIL with assertion error.

- [ ] **Step 3: Update `HeroTelemetryHUD.tsx` and `index.html`**
Change `SYSTEMS ARCHITECT & IT LEAD // DOSSIER` to dynamic context header:
```tsx
<span className="text-neutral-200 font-bold tracking-wider uppercase">
  SYSTEM ARCHITECTURE // {mode === "TOPOLOGY" ? "NETWORK TOPOLOGY" : "PRODUCTION TELEMETRY"}
</span>
```
And in `index.html`:
```html
<span style="color:#EEEBE5; font-weight:bold;">SYSTEM ARCHITECTURE // PRODUCTION SYSTEMS</span>
```

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add tests/portfolio_integrity.test.mjs frontend/src/components/HeroTelemetryHUD.tsx index.html
git commit -m "fix(hero): replace pseudo-tactical dossier label with clean architectural header"
```

---

### Task 2: Remove Selected Card Box Effect / White Line Focus Frame

**Files:**
- Modify: `frontend/src/components/WorkGrid.tsx:185-198`
- Modify: `frontend/src/app/globals.css:475-485`
- Modify: `index.html:498-508`
- Test: `tests/portfolio_integrity.test.mjs`

**Interfaces:**
- Consumes: CSS `:focus` and `:focus-visible` pseudo-classes on `.wc`
- Produces: Clean borderless focus state (`outline: none; box-shadow: none;`) preventing browser default white stroke frame on click.

- [ ] **Step 1: Write the failing test**
Add test in `tests/portfolio_integrity.test.mjs` checking that CSS and WorkGrid cards suppress default white outline on focus.

```javascript
test('WorkGrid cards suppress intrusive default white focus outline on selection', () => {
  const globalsCss = fs.readFileSync(path.resolve('frontend/src/app/globals.css'), 'utf-8');
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  const workGrid = fs.readFileSync(path.resolve('frontend/src/components/WorkGrid.tsx'), 'utf-8');
  assert.ok(globalsCss.includes('.wc:focus') && globalsCss.includes('outline: none'), 'globals.css must reset .wc:focus outline');
  assert.ok(indexHtml.includes('.wc:focus') && indexHtml.includes('outline: none'), 'index.html must reset .wc:focus outline');
  assert.ok(workGrid.includes('focus:outline-none'), 'WorkGrid.tsx must include focus:outline-none class');
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Update CSS and WorkGrid component**
In `frontend/src/components/WorkGrid.tsx`:
```tsx
className={`wc wc-interactive cursor-pointer group focus:outline-none focus-visible:outline-none`}
```
In `frontend/src/app/globals.css` and `index.html`:
```css
.wc:focus,
.wc:focus-visible,
.wc-interactive:focus,
.wc-interactive:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add tests/portfolio_integrity.test.mjs frontend/src/components/WorkGrid.tsx frontend/src/app/globals.css index.html
git commit -m "fix(ui): eliminate abrasive white line focus frame on card selection"
```

---

### Task 3: Overhaul Industrial K3 Compliance Engine into Authentic 16-Stage Kanban Simulator

**Files:**
- Modify: `frontend/src/components/previews/DNPMonitorPreview.tsx`
- Modify: `index.html` (preview section for Industrial K3)
- Test: `tests/portfolio_integrity.test.mjs`

**Interfaces:**
- Consumes: 16 statutory Disnaker stages (`STAGES: 1 to 16`), 4 statutory phases (`p1: Berkas`, `p2: Lapangan`, `p3: Disnaker`, `p4: Tagihan`), 6 operational roles (`MKT`, `ADM`, `TRU`, `AHLI`, `FIN`, `SUP`)
- Produces: High-density interactive Kanban board with phase navigation filters, card forward/backward movement, statutory SLA tracking, and zero emoticons or AI boilerplate.

- [ ] **Step 1: Write the failing test**
Update `tests/portfolio_integrity.test.mjs` to assert that `DNPMonitorPreview.tsx` implements the authentic 16 stages, 4 phases, role tags, and has zero emoji characters (`💡`, `📜`, `🔄`, `👁️‍🗨️`).

```javascript
test('DNPMonitorPreview implements authentic 16-stage Disnaker statutory Kanban without emoticons', () => {
  const content = fs.readFileSync(path.resolve('frontend/src/components/previews/DNPMonitorPreview.tsx'), 'utf-8');
  assert.ok(content.includes('16 Tahap') || content.includes('16-Stage') || content.includes('16 Stages'), 'Must model 16 stages');
  assert.ok(content.includes('Pelaksanaan RU') && content.includes('Penyusunan LHPP') && content.includes('Proses Disnaker'), 'Must include statutory stages');
  assert.ok(content.includes('MKT') && content.includes('TRU') && content.includes('AHLI'), 'Must include operational role badges');
  // Assert zero emoji or AI artifacts
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(content), 'DNPMonitorPreview must not contain emojis or AI signatures');
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/portfolio_integrity.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement 16-stage statutory Kanban in `DNPMonitorPreview.tsx`**
1. Define all 16 statutory stages:
   - `01 PO / SPK / Proposal` (MKT, Phase 1)
   - `02 Verifikasi Dokumen` (ADM, Phase 1)
   - `03 Penjadwalan` (ADM, Phase 1)
   - `04 Pelaksanaan RU` (TRU, Phase 2)
   - `04b Aktualisasi Unit` (MKT, Phase 2)
   - `05 Penyusunan LHPP` (TRU, Phase 2)
   - `06 Review Laporan Teknis` (AHLI, Phase 2)
   - `07 Verifikasi ke Dinas` (ADM, Phase 3)
   - `08 Proses Disnaker (SLA 30d)` (ADM, Phase 3)
   - `09 Pengurusan Suket` (ADM, Phase 3)
   - `10 Invoice & Kwitansi` (FIN, Phase 4)
   - `11 Penagihan / Follow-up` (MKT, Phase 4)
   - `11b Verifikasi Bayar: Lunas` (FIN, Phase 4)
   - `11c Kirim SUKET ke Klien` (MKT, Phase 4)
   - `12 Final Financial Closing` (FIN, Phase 4)
   - `16 Selesai & Arsip` (SUP, Phase 4)
2. Phase filters:
   - `Semua (16)`
   - `Fase 1: Berkas [1-3]`
   - `Fase 2: Lapangan [4-6]`
   - `Fase 3: Disnaker [7-9]`
   - `Fase 4: Suket & Fin [10-16]`
3. Card controls:
   - Client name (`PT Astra Honda Motor`, `PT Unilever Indonesia`, `PT Denso Indonesia`, `PT Mayora Indah`)
   - SPK code, inspected equipment units (Boiler, Bejana Tekan, Forklift, Lift)
   - Role badges with subdued tactical colors (`MKT`, `ADM`, `TRU`, `AHLI`, `FIN`, `SUP`)
   - Step buttons: `[← Prev]` and `[Next →]` (or `[<]` and `[>]` with clean typography, NO emojis)
   - Active Riksa Uji stats bar.
4. Update `index.html` static preview to match the clean 16-stage statutory presentation.

- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`
Expected: PASS (all 24+ tests passing).

- [ ] **Step 5: Commit**
```bash
git add tests/portfolio_integrity.test.mjs frontend/src/components/previews/DNPMonitorPreview.tsx index.html
git commit -m "feat(kanban): implement authentic 16-stage Disnaker statutory Kanban flow without emojis"
```

---

### Task 4: Full Verification & E2E Validation

**Files:**
- Test: `tests/portfolio_integrity.test.mjs`
- Test: `tests/e2e_hero_and_conversion.test.mjs`

- [ ] **Step 1: Run complete test suite**
Run: `node --test tests/portfolio_integrity.test.mjs tests/e2e_hero_and_conversion.test.mjs`
Expected: All tests pass.

- [ ] **Step 2: Verify production build**
Run: `npm run --prefix frontend build`
Expected: Next.js static build succeeds with zero TypeScript or JSX errors.
