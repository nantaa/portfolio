"use client";

import { useState } from "react";

interface DisciplinePillar {
  num: string;
  title: string;
  subtitle: string;
  stack: string;
  deliverables: string;
}

const PRIMARY_CAPABILITIES: DisciplinePillar[] = [
  {
    num: "01",
    title: "Full-Stack Web Applications",
    subtitle: "End-to-end web apps, internal ERPs, and multi-step business workflows.",
    stack: "Laravel · NestJS · React · TypeScript · PostgreSQL",
    deliverables: "REST APIs · Role-Based Access · Production Releases",
  },
  {
    num: "02",
    title: "3D Web & Interactive Graphics",
    subtitle: "Browser-based 3D scenes, custom shaders, and smooth scroll choreography.",
    stack: "Three.js · WebGL2 · GLSL · GSAP",
    deliverables: "Interactive Viewports · Custom Shaders · Responsive Canvas",
  },
  {
    num: "03",
    title: "Backend Systems & Optimization",
    subtitle: "REST APIs, role-based access control, and scheduling or matching logic.",
    stack: "Node.js · PHP · MySQL · PostgreSQL · REST",
    deliverables: "Data Modeling · Automated Testing · Query Tuning",
  },
  {
    num: "04",
    title: "Deployment & Infrastructure",
    subtitle: "Linux server setup, reverse proxies, private networking, and CI/CD pipelines.",
    stack: "Linux · Nginx · Docker · WireGuard · GitHub Actions",
    deliverables: "Automated Builds · SSL & Reverse Proxy · Zero-Downtime Deploys",
  },
];

const SECONDARY_CAPABILITIES: DisciplinePillar[] = [
  {
    num: "05",
    title: "Spatial & Data Visualization",
    subtitle: "Interactive map overlays, raster inspection tools, and real-time dashboards.",
    stack: "Vue 3 · Canvas 2D · GIS · WebSockets",
    deliverables: "Multi-Layer Inspection · Live Telemetry Views",
  },
  {
    num: "06",
    title: "UI Systems & Brand Design",
    subtitle: "Design systems, responsive layouts, accessibility, and visual brand guidelines.",
    stack: "Figma · Tailwind CSS · Design Tokens · WCAG AA",
    deliverables: "Component Libraries · Light & Dark Themes",
  },
];

export default function Disciplines() {
  const [discOpen, setDiscOpen] = useState(false);

  return (
    <>
      <div className="sec-hd" id="disciplines">
        <span className="sec-lbl">Disciplines</span>
        <span className="sec-ct">06 Core Disciplines</span>
      </div>

      <div className="disc-table">
        {PRIMARY_CAPABILITIES.map((p) => (
          <div key={p.num} className="dr py-5 hover:bg-[var(--s1)] transition-colors">
            <span className="d-num font-mono text-[11px] text-[var(--accent)]">{p.num}</span>
            <div className="flex flex-col gap-1 pr-4">
              <span className="d-name text-[15px] font-bold text-[var(--text)] tracking-tight">{p.title}</span>
              <span className="text-[12px] text-[var(--muted)] leading-relaxed">{p.subtitle}</span>
            </div>
            <div className="flex flex-col gap-1 text-right sm:text-right">
              <span className="d-tag font-mono text-[11px] text-[var(--text)]">{p.stack}</span>
              <span className="font-mono text-[10px] text-[var(--muted)]">{p.deliverables}</span>
            </div>
          </div>
        ))}

        <div
          className={`disc-expand ${discOpen ? "open" : ""}`}
          onClick={() => setDiscOpen(!discOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDiscOpen(!discOpen);
            }
          }}
          aria-expanded={discOpen}
        >
          <div className="dx-icon"></div>
          <span className="dx-lbl">
            {discOpen ? "Collapse additional disciplines" : "Expand additional disciplines (05 — 06)"}
          </span>
        </div>

        <div className={`disc-reveal ${discOpen ? "open" : ""}`}>
          {SECONDARY_CAPABILITIES.map((p) => (
            <div key={p.num} className="dr sec py-4 hover:bg-[var(--s2)] transition-colors">
              <span className="d-num font-mono text-[11px] text-[var(--muted)]">{p.num}</span>
              <div className="flex flex-col gap-0.5 pr-4">
                <span className="d-name text-[14px] font-semibold text-[var(--text)]">{p.title}</span>
                <span className="text-[12px] text-[var(--muted)]">{p.subtitle}</span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="d-tag font-mono text-[11px] text-[var(--text)]">{p.stack}</span>
                <span className="font-mono text-[10px] text-[var(--muted)]">{p.deliverables}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end px-5 py-3.5 bg-[var(--s1)] border-t border-[var(--wire)] gap-2">
          <a
            href="#work"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent2)] transition-colors"
          >
            <span>Explore selected work</span>
            <span>↑</span>
          </a>
        </div>
      </div>
    </>
  );
}
