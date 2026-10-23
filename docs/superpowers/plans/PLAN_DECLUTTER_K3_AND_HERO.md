# Plan: Radical De-cluttering of K3 Compliance Card & Hero Descriptor Box

**Date:** October 2026  
**Status:** Awaiting User Approval (TDD Phase 0: Plan)  
**Target Areas:**
1. `frontend/src/components/previews/DNPMonitorPreview.tsx` (Card 01: K3 Compliance)
2. `frontend/src/components/HeroTelemetryHUD.tsx` (Hero Right Telemetry Box)
3. `frontend/src/app/globals.css` (Scrollbar & overflow suppression)

---

## 1. Direct Feedback & Honest Rating of User's Proposals

| Proposal from User | Honest Verdict | Rating (out of 10) | Rationale & Critique |
| :--- | :---: | :---: | :--- |
| **"hide sidescroll-bar from bottom card along with the small text below the sidescrollbar"** | **You are 100% right.** | **10 / 10** | The Windows native grey horizontal scrollbar (`◄ ══════ ►`) is 17px tall, clunky, and destroys the sleek architectural look. Furthermore, the footer text (`PT Delta Nusantara Persada...`) is half-covered by the bottom dock anyway. Removing both reclaims 35px of vertical space. |
| **"make it readable while using as little text as possible" in K3 Compliance** | **You are right, with a crucial caveat.** | **9.0 / 10** | Right now, 3 stacked rows of metadata (Header + Tabs + 5 Phase Filter pills) eat up 85px before a visitor sees a single job. Cutting the phase filter row and simplifying the header cuts 50% of the cognitive noise. |
| **"maybe use icon" for K3 tabs** | **You're partially wrong if used exclusively.** | **5.0 / 10 (Icons only)**<br/>**9.5 / 10 (Icon + short label)** | **Challenge to your assumption:** Pure icons without text (e.g. just a generic board icon, clock icon, doc icon) create "mystery meat navigation"—technical recruiters don't know what they're clicking. **The correct fix:** Pair compact icons with 1-word labels: `📋 Kanban` · `⏱ SLA` · `📄 Forms`. |
| **"on card hero section, the text, it's still too much"** | **You are right about visual heaviness.** | **8.8 / 10** | The 5 node chips (`Client Workspace · React 19 & Tailwind`, `State Machine · Laravel 11 Core`, etc.) are full sentences that wrap across two rows and crowd out the canvas. Simplifying to single-token tech chips (`[React 19]` `[Laravel 11]` `[PostgreSQL]` `[Redis]` `[Soketi]`) and tightening the summary to 1 crisp line cuts the visual weight in half. |

---

## 2. Before vs. After Specification

### Component 1: `DNPMonitorPreview.tsx` (Card 01)

#### Current State (Overcrowded):
```
[Row 1] ● MORIKU · INDUSTRIAL K3 COMPLIANCE ENGINE    DISNAKER JAWA BARAT
[Row 2] [INSPECTION KANBAN] [SLA PIPELINE] [STATUTORY FORMS]   [RESET DATA DEMO]
[Row 3] FASE: [16 Tahap] [F1: Berkas] [F2: Lapangan] [F3: Disnaker] [F4: Suket] (5 buttons)
[Row 4] Stage columns with full names ("PO / SPK / PROPOSAL", "PELAKSANAAN RU")
[Row 5] Chunky Windows native horizontal scrollbar (◄ ══════════════ ►)
[Row 6] ● PT Delta Nusantara Persada · Disnaker PJK3 Accredited ...
```

#### Proposed State (Radically Streamlined):
```
[Row 1] ● MORIKU // K3 ENGINE                           DISNAKER JABAR
[Row 2] [📋 Kanban] [⏱ SLA] [📄 Forms]                  [↺ Reset]
───────────────────────────────────────────────────────────────────────
[Side-Scrolling Kanban Area — scrollbar-none, 100% invisible scrollbar]
Columns use stage.short ("PO / SPK", "Verifikasi", "Pelaksanaan RU")
Job cards show clean title, SPK, and SLA badge
───────────────────────────────────────────────────────────────────────
[Bottom Status Footer]: PURGED completely.
[Bottom Native Scrollbar]: PURGED completely via .scrollbar-none.
```
- **Net Reduction:** 2 full rows eliminated (Phase Filter Row + Bottom Footer), 14 redundant text strings removed, native scrollbar hidden. +38px of visible height restored to Kanban cards.

---

### Component 2: `HeroTelemetryHUD.tsx` (Hero Right Box)

#### Current State (Heavy text wrap):
- **Category:** `ENTERPRISE EVENT-DRIVEN BACKEND`
- **Title:** `Industrial K3 Statutory Compliance Engine`
- **Summary:** `Disnaker PJK3 statutory lifecycle with ACID immutable audit ledger and real-time inspector updates.` (verbose 2-clause sentence)
- **Chips:**
  - `Client Workspace · React 19 & Tailwind`
  - `WebSocket Gateway · Echo / Pusher Protocol`
  - `State Machine · Laravel 11 Core`
  - `Compliance Ledger · PostgreSQL 16`
  - `Background Jobs · Redis Queue`
  *(Takes 2 to 3 wrapped lines)*

#### Proposed State (Architectural & Minimalist):
- **Top Row:** `ENTERPRISE BACKEND` · `1.2k req/s`
- **Title:** `Industrial K3 Statutory Engine`
- **Summary:** `ACID immutable audit ledger & real-time Disnaker inspector updates.` (1 single punchy line)
- **Chips (Single-line compact tech badges):**
  `[React 19]` `[Laravel 11]` `[PostgreSQL 16]` `[Redis Queue]` `[WebSockets]`
- **Net Reduction:** 50% fewer characters, zero multi-line chip wrapping, clean negative space.

---

## 3. TDD Implementation Plan

### Step 1: Write Failing Tests (RED Phase)
In `tests/mobile_responsive.test.mjs`:
1. `DNPMonitorPreview hides bottom status ticker and uses scrollbar-none for invisible horizontal scrolling`
   - Assert `scrollbar-thin` is purged.
   - Assert `PT Delta Nusantara Persada · Disnaker PJK3 Accredited` is purged.
2. `DNPMonitorPreview eliminates redundant phase filter button strip to reduce cognitive clutter`
   - Assert the 5-button `PHASES.map` row is removed or replaced with streamlined navigation.
3. `HeroTelemetryHUD uses compact single-token tech chips and single-line summary`
   - Assert chips render concise technology tokens without verbose filler sentences (`Client Workspace · React 19 & Tailwind`).

### Step 2: Implement Code (GREEN Phase)
1. In `DNPMonitorPreview.tsx`:
   - Simplify Top Row 1 title and location.
   - Add icons to tabs (`📋 Kanban`, `⏱ SLA`, `📄 Forms`).
   - Remove Row 3 (`PHASES.map` filter bar).
   - Change `scrollbar-thin` to `scrollbar-none`.
   - Remove the bottom status footer.
2. In `HeroTelemetryHUD.tsx`:
   - Simplify summary text to 1 line.
   - Simplify chip labels to concise tech tokens.

### Step 3: Verify & Review (REFACTOR / VERIFY Phase)
1. Run `node --test tests/*.test.mjs` (must pass 60+ tests).
2. Run `npm --prefix frontend run build` (must pass TypeScript & export).
3. Browser subagent verification with screenshots of Card 01 and Hero Right.

---

## 4. Decision Required

Please review and confirm:
- **Approve Plan:** Proceed with Step 1 (TDD failing tests) and implementation.
- **Adjustments:** Request specific wording or layout changes before starting.
