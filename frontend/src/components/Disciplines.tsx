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
    title: "Systems & Enterprise Architecture",
    subtitle: "ACID compliance pipelines, statutory Disnaker SLA state engines, and zero-downtime releases.",
    stack: "Laravel 11 · PostgreSQL · React 19 Inertia · Docker",
    deliverables: "270+ Passing Tests · Automated Daily Dispatch · Atomic Symlinks",
  },
  {
    num: "02",
    title: "Real-Time 3D & Creative Engineering",
    subtitle: "Procedural WebGL dioramas, custom GLSL wave/caustic shaders, and GPU-safe staging.",
    stack: "Three.js · GLSL · RoomEnvironment IBL · WebGL",
    deliverables: "60 FPS Mobile Orbit · Zero-RAM Static Export · Parametric Architecture",
  },
  {
    num: "03",
    title: "Algorithms & Combinatorial Optimization",
    subtitle: "Stable matching and bipartite assignment optimization with verified convergence.",
    stack: "Gale-Shapley · Hungarian Matrix · Markov Chains · REST",
    deliverables: "88 Algorithm Tests · Zero Deadlocks · 9-Stage Academic Progression",
  },
  {
    num: "04",
    title: "Cloud Infrastructure & Reliability Operations",
    subtitle: "Virtual private networking, encrypted mesh nodes, and zero-daemon static pipelines.",
    stack: "WireGuard VPN · Nginx · Linux VPS · GitHub Actions",
    deliverables: "Strict Timeout CI/CD · 512MB RAM Budget · Isolated Mesh Tunnels",
  },
];

const SECONDARY_CAPABILITIES: DisciplinePillar[] = [
  {
    num: "05",
    title: "Spatial AI & GIS Analytics",
    subtitle: "High-resolution satellite imagery inspection and spatial raster analysis.",
    stack: "Vue 3 · Spatial AI X-Ray · GSAP · Aerial Rasters",
    deliverables: "Bekasi Sample Case · Seamless Multi-Spectrum Imagery Inspection",
  },
  {
    num: "06",
    title: "AI Agent Workflows & LLM Integration",
    subtitle: "Structured schema pipelines and multi-turn financial record categorization.",
    stack: "Next.js · Prisma · Express · Gemini 2.0 Flash",
    deliverables: "Direct Financial Extraction · Structured OCR Parsing",
  },
  {
    num: "07",
    title: "Enterprise Support & Real-Time Messaging",
    subtitle: "Automated ticket escalation with multi-channel WhatsApp Cloud webhooks.",
    stack: "Next.js 16 · Laravel 11 · WhatsApp Cloud API · Soketi",
    deliverables: "Sub-Second Ticket Updates · Dual-Channel Helpdesk Routing",
  },
  {
    num: "08",
    title: "Visual Identity & Design Systems",
    subtitle: "High-contrast architectural typography, design tokens, and accessible ergonomics.",
    stack: "Figma · Design Tokens · WCAG 2.2 AA · Micro-Motion",
    deliverables: "Complete Dark/Light Linen Palettes · Zero Layout Shift",
  },
];

export default function Disciplines() {
  const [discOpen, setDiscOpen] = useState(false);

  return (
    <>
      <div className="sec-hd" id="disciplines">
        <span className="sec-lbl">Architectural Capabilities</span>
        <span className="sec-ct">08 Verified Engineering Domains</span>
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
            {discOpen ? "Collapse secondary capabilities" : "Expand secondary capabilities (05 — 08)"}
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3.5 bg-[var(--s1)] border-t border-[var(--wire)] gap-2">
          <span className="font-mono text-xs text-[var(--muted)]">All capabilities backed by verified production artifacts</span>
          <a
            href="#work"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent2)] transition-colors"
          >
            <span>See related projects in Selected Work</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </>
  );
}
