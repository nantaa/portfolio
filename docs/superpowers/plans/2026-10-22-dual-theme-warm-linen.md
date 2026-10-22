# Dual-Theme System (Dark Default + Warm Linen & Oxblood) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dual-theme system featuring the existing Dark mode as default and an editorial Warm Linen & Oxblood Light mode, toggled via a minimalist Sun/Moon icon in the navigation bar with zero-FOUC static export support and dynamic Canvas HUD theming.

**Architecture:** Use CSS custom property token inversion via `[data-theme="light"]` on the root HTML element. An inline blocking script in `layout.tsx` prevents Flash of Unstyled Content (FOUC) on Next.js static export. Subcomponents and modals migrate from hardcoded dark hexes to semantic CSS variables. `HeroTelemetryHUD` subscribes to theme changes via a mutation observer / theme hook to dynamically re-color the 2D canvas topology schematic.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, Tailwind CSS v4, HTML5 2D Canvas, Node.js test runner (`node:test`).

## Global Constraints

- Default theme MUST be `"dark"` on initial unconfigured visit.
- User theme selection MUST persist in `localStorage` under key `'portfolio-theme'`.
- Static export compatibility: zero hydration mismatch and zero FOUC during page loads.
- Contrast compliance: Warm Linen background (`#F7F4EE`) paired with Charcoal Ink (`#161615`) and Oxblood (`#851726`) must meet WCAG AA contrast (≥ 4.5:1 for body text, ≥ 3:1 for large display/ui controls).
- Canvas telemetry HUD in `HeroTelemetryHUD.tsx` must render seamlessly on both themes without canvas recreation or animation stutter.
- All existing 25 tests in `tests/portfolio_integrity.test.mjs` must continue to pass.

---

## Technical Critical Analysis & Honest Idea Rating (8.5 / 10)

1. **Why Naive CSS Variable Swapping Fails (5/10 without component fixes)**:
   - Simply setting `:root { --bg: ... }` fails because `CaseStudyModal.tsx`, `WorkGrid.tsx`, and preview components contain hardcoded Tailwind utilities like `bg-[#0a0a0b]`, `border-white/15`, and `text-[#eeebe5]`. On a linen cream background, these cards look like detached black blocks unless migrated to semantic theme variables.
2. **Why Canvas Telemetry HUD Needs Explicit Support**:
   - Canvas elements do not automatically inherit CSS properties into `ctx.fillStyle` or `ctx.strokeStyle`. The canvas rendering loop in `HeroTelemetryHUD.tsx` must be parameter-driven by the active theme (`dark` vs `light`), recalculating node fill, wire stroke, and pulse glow colors.
3. **Anti-FOUC Mechanism**:
   - Because Next.js exports static HTML with dark theme default, reading `localStorage` in React `useEffect` creates a visible 150-300ms flash on initial paint. A synchronous, un-deferred `<script>` inside `<head>` sets `document.documentElement.setAttribute('data-theme', theme)` prior to DOM rendering.

---

## File Structure & Responsibilities

| File Path | Responsibility |
|---|---|
| `frontend/src/app/globals.css` | Define `:root, [data-theme="dark"]` and `[data-theme="light"]` token palettes, transition properties, and theme-aware utility classes |
| `frontend/src/app/layout.tsx` | Inject anti-FOUC inline blocking script in `<head>` and default `data-theme="dark"` attribute |
| `frontend/src/components/Nav.tsx` | Add accessible Sun/Moon icon toggle button with theme state toggle and localStorage synchronization |
| `frontend/src/components/CaseStudyModal.tsx` | Refactor hardcoded dark hexes (`#0a0a0b`, `text-[#eeebe5]`, `border-white/15`) to semantic theme tokens |
| `frontend/src/components/WorkGrid.tsx` | Refactor card backgrounds and borders to adapt cleanly to both themes |
| `frontend/src/components/HeroTelemetryHUD.tsx` | Pass dynamic theme palette into canvas drawing routine to render warm ink nodes and wires in light mode |
| `tests/theme_system.test.mjs` | Automated TDD test suite validating CSS variables, anti-FOUC script, Nav toggle, and component theme compliance |

---

## Bite-Sized Implementation Tasks

### Task 1: Create TDD Test Suite for Dual-Theme System

**Files:**
- Create: `tests/theme_system.test.mjs`

**Interfaces:**
- Consumes: `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx`, `frontend/src/components/Nav.tsx`, `frontend/src/components/CaseStudyModal.tsx`, `frontend/src/components/HeroTelemetryHUD.tsx`
- Produces: Test runner entry point for theme verification

- [ ] **Step 1: Write the failing tests**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('globals.css defines [data-theme="light"] palette with warm linen & oxblood tokens', () => {
  const cssPath = path.join(rootDir, 'frontend', 'src', 'app', 'globals.css');
  assert.ok(fs.existsSync(cssPath), 'globals.css must exist');
  const css = fs.readFileSync(cssPath, 'utf-8');

  assert.ok(css.includes('[data-theme="light"]'), 'Must define [data-theme="light"] selector');
  assert.ok(css.includes('--bg: #F7F4EE') || css.includes('--bg:#F7F4EE') || css.includes('--bg: #f7f4ee'), 'Must define warm linen background');
  assert.ok(css.includes('--text: #161615') || css.includes('--text:#161615'), 'Must define charcoal ink primary text');
  assert.ok(css.includes('--accent: #851726') || css.includes('--accent:#851726'), 'Must define oxblood accent');
  assert.ok(css.includes('--s1:') && css.includes('--s2:') && css.includes('--s3:'), 'Must define surface elevation tokens in light theme');
});

test('layout.tsx contains anti-FOUC inline blocking script for theme initialization', () => {
  const layoutPath = path.join(rootDir, 'frontend', 'src', 'app', 'layout.tsx');
  const content = fs.readFileSync(layoutPath, 'utf-8');

  assert.ok(content.includes('portfolio-theme') || content.includes('data-theme'), 'Must read theme from localStorage');
  assert.ok(content.includes('dangerouslySetInnerHTML'), 'Must inject synchronous inline script');
});

test('Nav.tsx includes accessible Sun/Moon theme toggle button', () => {
  const navPath = path.join(rootDir, 'frontend', 'src', 'components', 'Nav.tsx');
  const content = fs.readFileSync(navPath, 'utf-8');

  assert.ok(content.includes('theme-toggle') || content.includes('aria-label="Toggle theme"'), 'Must have theme toggle button');
  assert.ok(content.includes('toggleTheme') || content.includes('setTheme'), 'Must have theme toggle function');
});

test('CaseStudyModal.tsx uses theme semantic tokens instead of hardcoded pitch black', () => {
  const modalPath = path.join(rootDir, 'frontend', 'src', 'components', 'CaseStudyModal.tsx');
  const content = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(!content.includes('bg-[#0a0a0b]'), 'Must replace hardcoded bg-[#0a0a0b] with theme-aware class or CSS variable');
});

test('HeroTelemetryHUD.tsx contains theme-aware palette configuration', () => {
  const hudPath = path.join(rootDir, 'frontend', 'src', 'components', 'HeroTelemetryHUD.tsx');
  const content = fs.readFileSync(hudPath, 'utf-8');

  assert.ok(content.includes('data-theme') || content.includes('isLight') || content.includes('theme'), 'Canvas HUD must detect or receive theme');
});
```

- [ ] **Step 2: Run test to verify it fails (RED)**

Run: `node --test tests/theme_system.test.mjs`
Expected: FAIL with multiple missing assertions (e.g., `globals.css does not contain [data-theme="light"]`).

---

### Task 2: Implement Warm Linen & Oxblood Palette in globals.css

**Files:**
- Modify: `frontend/src/app/globals.css:1-60`

**Interfaces:**
- Consumes: Existing `:root` variables
- Produces: `[data-theme="light"]` token overrides for all UI elements

- [ ] **Step 1: Add [data-theme="light"] definitions in globals.css**

```css
:root,
[data-theme="dark"] {
  --bg: #0A0A0A;
  --s1: #0F0F0F;
  --s2: #141414;
  --s3: #1C1C1C;
  --text: #EEEBE5;
  --muted: #888880;
  --faint: #252522;
  --accent: #7A1525;
  --accent2: #9B1E30;
  --accentd: #4A0C18;
  --wire: rgba(255, 255, 255, 0.055);
  --wire-h: rgba(122, 21, 37, 0.22);
  --modal-bg: #0D0D0E;
  --card-bg: #111111;
  --card-border: rgba(255, 255, 255, 0.08);
  --nav-bg: rgba(10, 10, 10, 0.9);
  --display: 'Playfair Display', Georgia, serif;
  --sans: 'Syne', sans-serif;
  --mono: 'Syne Mono', monospace;
}

[data-theme="light"] {
  --bg: #F7F4EE;
  --s1: #FFFFFF;
  --s2: #EFECE4;
  --s3: #E5E0D5;
  --text: #161615;
  --muted: #6E6A62;
  --faint: #DDD8CD;
  --accent: #851726;
  --accent2: #A31F32;
  --accentd: #610E1A;
  --wire: rgba(22, 22, 21, 0.065);
  --wire-h: rgba(133, 23, 38, 0.25);
  --modal-bg: #FAF8F3;
  --card-bg: #FFFFFF;
  --card-border: rgba(22, 22, 21, 0.09);
  --nav-bg: rgba(247, 244, 238, 0.92);
}
```

- [ ] **Step 2: Run test to verify Step 1 passes**

Run: `node --test tests/theme_system.test.mjs`
Expected: First test passes, remaining tests continue to fail.

---

### Task 3: Anti-FOUC Theme Script in layout.tsx

**Files:**
- Modify: `frontend/src/app/layout.tsx:1-41`

**Interfaces:**
- Consumes: `localStorage.getItem('portfolio-theme')`
- Produces: Synchronous `data-theme` attribute on `<html>` before first render

- [ ] **Step 1: Inject inline anti-FOUC script into `<head>`**

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${syne.variable} ${syneMono.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-theme');
                  var theme = saved === 'light' ? 'light' : 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run test to verify Step 2 passes**

Run: `node --test tests/theme_system.test.mjs`
Expected: `layout.tsx contains anti-FOUC inline blocking script` test PASSES.

---

### Task 4: Minimalist Sun/Moon Theme Toggle in Nav.tsx

**Files:**
- Modify: `frontend/src/components/Nav.tsx:1-23`

**Interfaces:**
- Consumes: Document `data-theme` and `localStorage`
- Produces: Interactive theme switch button with SVG icons

- [ ] **Step 1: Implement Theme Toggle in Nav.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    if (current) setTheme(current);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: nextTheme }));
  };

  return (
    <nav>
      <div className="nav-logo">
        Aryo<em>.</em>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#disciplines">Skills</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-actions flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="theme-toggle p-2 rounded-[2px] border border-[var(--wire)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "warm light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              // Sun icon for switching to light
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon icon for switching to dark
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <div className="nav-cta">Available for work</div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Run test to verify Step 3 passes**

Run: `node --test tests/theme_system.test.mjs`
Expected: `Nav.tsx includes accessible Sun/Moon theme toggle button` test PASSES.

---

### Task 5: Refactor CaseStudyModal and WorkGrid for Semantic Theme Support

**Files:**
- Modify: `frontend/src/components/CaseStudyModal.tsx`
- Modify: `frontend/src/components/WorkGrid.tsx`

**Interfaces:**
- Consumes: `--modal-bg`, `--card-bg`, `--card-border`, `--text`, `--muted`
- Produces: Theme-adaptive modal and work showcase cards

- [ ] **Step 1: Replace hardcoded colors in CaseStudyModal.tsx**

Update modal root:
```tsx
className="relative w-full max-w-[940px] max-h-[92vh] overflow-y-auto bg-[var(--modal-bg)] border border-[var(--card-border)] p-6 sm:p-10 text-[var(--text)] shadow-2xl rounded-[3px]"
```
And replace hardcoded `bg-[#0a0a0b]` and `text-[#eeebe5]` in internal sections with `bg-[var(--s2)]`, `text-[var(--text)]`, `text-[var(--muted)]`.

- [ ] **Step 2: Replace hardcoded card styles in WorkGrid.tsx**

Ensure `.wc` and `.w-cat` use `var(--card-bg)`, `var(--card-border)`, and `var(--accent)` so cards look crisp and high-contrast in both dark and light modes.

- [ ] **Step 3: Run test to verify Step 4 passes**

Run: `node --test tests/theme_system.test.mjs`
Expected: `CaseStudyModal.tsx uses theme semantic tokens` test PASSES.

---

### Task 6: Dynamically Theme HeroTelemetryHUD Canvas

**Files:**
- Modify: `frontend/src/components/HeroTelemetryHUD.tsx:320-440`

**Interfaces:**
- Consumes: Window event `portfolio-theme-change` or `document.documentElement.getAttribute('data-theme')`
- Produces: Dynamic canvas drawing colors:
  - Dark: node fill `rgba(12, 13, 14, 0.88)`, border `rgba(255, 255, 255, 0.16)`, text `#EEEBE5`
  - Light: node fill `rgba(255, 255, 255, 0.95)`, border `rgba(22, 22, 21, 0.18)`, text `#161615`

- [ ] **Step 1: Add dynamic theme detection and canvas color resolver in HeroTelemetryHUD.tsx**

```tsx
const isLight = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light";

// Inside render loop:
const nodeBg = isLight ? "rgba(255, 255, 255, 0.96)" : isSelected ? "rgba(122, 21, 37, 0.35)" : "rgba(12, 13, 14, 0.88)";
const nodeBorder = isSelected ? (isLight ? "#851726" : "#9B1E30") : (isLight ? "rgba(22, 22, 21, 0.18)" : "rgba(255, 255, 255, 0.16)");
const nodeTextColor = isLight ? "#161615" : "#EEEBE5";
const wireStrokeColor = isLight ? "rgba(133, 23, 38, 0.35)" : "rgba(155, 30, 48, 0.35)";
```

- [ ] **Step 2: Run all tests to verify GREEN**

Run: `node --test tests/theme_system.test.mjs && node --test tests/portfolio_integrity.test.mjs`
Expected: ALL tests PASS (0 failures).

---

### Task 7: Full Static Build Verification

**Files:**
- Build: `cd frontend && npm run build`

- [ ] **Step 1: Run production Next.js static export**

Run: `cd frontend && npm run build`
Expected: Static build completes cleanly with zero errors in `frontend/out/`.

- [ ] **Step 2: Commit all changes**

```bash
git add frontend/ tests/ docs/superpowers/plans/
git commit -m "feat(theme): implement dual-theme system with dark default and warm linen oxblood light mode"
```
