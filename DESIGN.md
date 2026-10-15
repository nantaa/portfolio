# DESIGN.md — Google Stitch Prompt
## Portfolio: *Structured Mind*

---

## Project Intent

Design a minimalist personal portfolio for a multidisciplinary technologist — someone who operates across software, design, and infrastructure. The experience should feel like entering a structured but living system: quiet at first glance, revealing depth through interaction.

> **Core feeling**: *"I'm looking at someone who thinks in systems."*

---

## Visual Identity

### Palette
- **Background**: `#0A0A0A`
- **Surface (card rest)**: `#111111`
- **Surface (card hover)**: `#1A1A1A`
- **Primary text**: `#F0EDE8` (warm off-white)
- **Secondary text**: `#888880` (muted warm gray)
- **Accent — Primary**: `#7A1525` (maroon, sampled from portrait)
- **Accent — Hover/Active**: `#9B1E30` (maroon, brightened)
- **Accent — Subtle border**: `#5A0F1A` (maroon, darkened)
- **Accent — Grid lines on hover**: `rgba(122, 21, 37, 0.12)`
- **Never**: gradients, multiple accent colors, or decorative illustrations

### Typography
- **Display / Name / Headings**: A geometric or architectural typeface — something with precision and personality. Options: *Neue Haas Grotesk*, *Editorial New*, *Founders Grotesk*, or *DM Serif Display* for contrast
- **Body / Labels**: A clean monospaced or technical sans — *IBM Plex Mono*, *Söhne Mono*, or *Space Mono*
- **Hierarchy rule**: Size and weight only — no decorative flourishes, no underlines, no color shifts for hierarchy

### Grid System
- **Asymmetric, uneven column layout** — not a standard 12-col grid. Use something like a 7:5 or 3:2 column split
- **Faint grid lines** visible at ~5–8% opacity on rest state
- **On hover**: grid lines snap into full visibility (~40% opacity) revealing the underlying structure — as if the skeleton of the page becomes briefly visible
- Grid lines should feel architectural, not decorative

---

## Layout Structure

### Hero / Entry State
- Name in large display type, left-aligned or offset-left
- Single-line descriptor below: *"Solving problems across software, design, and infrastructure."*
- Hero Right: Active Architectural Wireframe Telemetry HUD (3D isometric perspective mesh, live system coordinates 06°14'S 107°00'E, and interactive TOPOLOGY vs TELEMETRY mode switch). Zero generic photo collages.
- Subtle animated cursor or breathing opacity on the accent line beneath the name

### Role Grid (Primary Showcase)
Four primary showcase projects displayed as grid cells, always visible:

| Cell | Role / Discipline | Featured Project | Core Technology & Scale |
|------|-------------------|------------------|-------------------------|
| 01 | Enterprise Fullstack | **Industrial K3 Compliance Engine** (MORIKU / DNP) | Laravel 11 · PostgreSQL · React 19 Inertia · 270+ Tests |
| 02 | 3D WebGL & Shaders | **Ulun Danu Bratan** | Three.js · Procedural Meru Architecture · GLSL Water & Atmospheric Moods |
| 03 | 3D Web Graphics | **Tata$** | Vue 3 · Three.js · GLTF Orbit Stage · Giant Typographic Staging |
| 04 | Systems & Optimization | **Academic Thesis Docket** | Laravel API · MySQL · Gale-Shapley & Hungarian · 88 Tests |

Each cell: role label in monospace, indexed with a zero-padded number, minimal border

### Role Grid (Secondary — Hidden by Default / Interactive Reveals)
Four secondary disciplines and systems revealed on interaction:

| Cell | Role / Discipline | Featured Project | Core Technology & Scale |
|------|-------------------|------------------|-------------------------|
| 05 | Enterprise Support | **Delta IT Helpdesk** | Next.js 16 · Laravel 11 · WhatsApp Cloud API · Soketi |
| 06 | Spatial AI & GIS | **Geopetak Web** | Vue 3 · Spatial AI X-Ray · GSAP (Bekasi Aerial Photo Sample) |
| 07 | AI Full-Stack | **AI Expense Tracker** | Next.js · Express · Prisma · Gemini 2.0 Flash |
| 08 | Visual Identity & Photo | **Ambient Studies** | Monochrome Portraiture · Architectural Light & Form |

Secondary cells appear with a subtle fade-in + slight upward translate. They should feel *discovered*, not presented.

---

## Interaction Design

### Hover State (Grid Cell)
- Grid lines become visible across the full layout
- Hovered cell: slight scale increase (`1.02x`), border becomes accent color
- Cell reveals: **role title** (already visible) + **one-line descriptor** (fades in beneath)
- All other cells dim slightly (`opacity: 0.5`)
- Transition duration: `280ms ease-out`

### Click / Expand State (Project Detail)
- Selected cell expands to fill the viewport (or a large modal-like panel, no overlay/backdrop)
- All other cells fade to near-invisible (`opacity: 0.08`)
- Expanded panel reveals a **Case Framework**:

```
Problem       →   [1–2 sentences]
Thinking      →   [Strategic approach, bullet or short para]
Execution     →   [Tools, methods, decisions]
Result        →   [Outcome — quantified if possible]
```

- Content stays concise. No long paragraphs. Think: structured brief, not essay.
- Close via `Esc`, back-arrow glyph, or clicking outside

---

## Photography Integration

- **Do not** create a separate photography section or gallery page
- Photography appears as:
  - **Background texture** on select cells (low opacity, desaturated, `mix-blend-mode: multiply` or `luminosity`)
  - **Hover element**: on the Photography cell, hovering reveals a full-bleed photo beneath the text instead of a description
- Photos should feel embedded in the system, not showcased

---

## Motion Principles

- **Page load**: Staggered reveal — grid lines appear first (`0ms`), then cells fade in sequentially (`100ms`, `200ms`, `300ms`…)
- **Hover**: Fast in, slow out — `200ms ease-in` on enter, `350ms ease-out` on leave
- **Expand**: Panel slides in from the hovered cell's position — not a generic center-modal animation
- **Secondary roles reveal**: `opacity 0 → 1` + `translateY(8px → 0)` over `400ms`
- **No bouncing, no springy easing, no looping animations** — everything is deliberate and still

---

## Component Specifications

### Grid Cell (Resting)
```
background: #111111
border: 1px solid rgba(255,255,255,0.06)
padding: 32px
index label: monospace, 11px, opacity 0.3, top-left
role title: display font, 20–24px, opacity 0.9
```

### Grid Cell (Hovered)
```
border-color: accent color
background: #161616
descriptor text: monospace, 13px, opacity 0.65, appears below title
grid lines: visible globally
```

### Case Framework Panel
```
background: #0D0D0D
max-width: 720px or full-width on mobile
section labels: monospace, uppercase, 10px, letter-spacing 0.15em, accent color
section content: display/body font, 15–16px, line-height 1.6
divider: 1px horizontal rule, opacity 0.1
```

---

## Positioning Copy

Use exactly this framing across the portfolio:

> *"I solve problems across systems — software, design, and infrastructure."*

Tagline variations (use one):
- *"Fullstack. Designed. Engineered."*
- *"Systems thinker. Interface maker."*
- *"Built for complexity. Presented with clarity."*

---

## What NOT to Do

- ❌ No hero illustrations or stock photos in layout
- ❌ No purple gradients, glassmorphism, or neon glows
- ❌ No card hover shadows that feel "material"
- ❌ No separate "About Me" wall of text
- ❌ No skills bar charts or circular progress indicators
- ❌ No generic icon sets (Font Awesome, Material Icons)
- ❌ No full-page scroll hijacking
- ❌ No animated hero text that types itself out

---

## Deliverable Checklist for Stitch

- [ ] Desktop layout: asymmetric 4-cell primary grid
- [ ] Mobile layout: stacked single-column with same reveal logic
- [ ] Hover state: grid lines + descriptor reveal
- [ ] Click state: case framework expansion
- [ ] Secondary roles: hidden → discovered on interaction
- [ ] Photography integration: texture / hover-reveal only
- [ ] Typography system applied consistently
- [ ] Single accent color applied to: borders on hover, index labels, case section labels
- [ ] Page load animation: staggered grid + cell reveal
- [ ] Dark theme only

---

*This document is a Stitch design prompt. All layout values, interaction timings, and copy are implementation-ready directives.*
