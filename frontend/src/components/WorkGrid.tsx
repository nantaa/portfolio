"use client";

import { useState } from "react";
import { Project } from "@/lib/api";
import MaknaMoodboardPreview from "@/components/previews/MaknaMoodboardPreview";
import CaseStudyModal from "@/components/CaseStudyModal";

// ─── Core Showcase Projects ────────────────────────────────────────────────
const CORE_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Industrial K3 Compliance Engine",
    category: "Enterprise Workflow",
    subtitle: "Laravel 11 · React 19 Inertia · PostgreSQL · Disnaker Statutory SLA Pipeline",
    image_url: null,
    link: null,
    year: "2025",
    sort_order: 0,
    is_featured: true,
    case_study: {
      problem: "Manual K3 inspection workflows suffered from Disnaker 30-day SLA calculation bugs, unhandled job errors, and silent failure states across 15 stages.",
      thinking: "Re-architected pipeline around official submission timestamps, enforced strict RBAC authorization, and automated zero-downtime atomic symlink deployments.",
      execution: "Laravel 11, PostgreSQL, React 19 Inertia, DocumentPreviewModal with inspector locks, DailyDigestService, and automated deploy scripts.",
      result: "270+ passing automated tests, 100% eliminated silent errors, zero-downtime releases, and automated daily dispatching for 5 roles.",
    },
  },
  {
    id: 2,
    title: "Indonesian 3D Material Studies",
    category: "3D WebGL & Shaders",
    subtitle: "Three.js · Raja Ampat Coral Reef & Ulun Danu Meru Temple · Realtime GLSL",
    image_url: null,
    link: "/raja_ampat_snorkel_day.html",
    year: "2026",
    sort_order: 1,
    is_featured: true,
    case_study: {
      problem: "Heavy gigabyte 3D models and server-side rendering pipelines exhaust VPS resources and lag client GPUs on mobile devices.",
      thinking: "Built procedural WebGL dioramas for Raja Ampat's marine ecosystem and Bali's Meru temple in pure Three.js and GLSL shaders with click-to-load gating.",
      execution: "Algorithmic coral reefs, realtime caustic refractions, 11-tier parametric Meru roofs, dynamic GLSL waves, and single-context lifecycle gating.",
      result: "0 MB server RAM overhead (static Nginx export), stable 60fps orbit controls, and zero client GPU context exhaustion.",
    },
  },
  {
    id: 3,
    title: "TATA$",
    category: "3D Web & Interactive Landing Page",
    subtitle: "Vue 3 · Three.js · Interactive 3D Bag Showcase Landing Page · RoomEnvironment IBL",
    image_url: null,
    link: null,
    year: "2026",
    sort_order: 2,
    is_featured: true,
    case_study: {
      problem: "Flat 2D photography fails to convey structural silhouettes, luxury leather textures, and hardware reflections in e-commerce.",
      thinking: "Engineered an interactive 3D showcase landing page staging compressed GLTF models with studio image-based lighting and smooth 360° bag orbit interaction.",
      execution: "Three.js perspective staging, RoomEnvironment HDR reflections, multi-bag model switching, and on-demand GPU gating.",
      result: "Smooth 60fps browser 3D inspection, instant leather grain rendering, and luxury brand fidelity.",
    },
  },
  {
    id: 4,
    title: "Academic Thesis Docket",
    category: "Systems & Algorithms",
    subtitle: "Laravel REST API · MySQL · Gale-Shapley & Hungarian Matching",
    image_url: null,
    link: null,
    year: "2026",
    sort_order: 3,
    is_featured: true,
    case_study: {
      problem: "University thesis administration faced advisor assignment deadlocks, examiner scheduling conflicts, and manual progression bottlenecks.",
      thinking: "Modeled advisor matching via Gale-Shapley, defense scheduling via Hungarian cost-optimization, and graduation velocity via Markov chains.",
      execution: "Laravel REST API, MySQL, React 19/TS, LiveCohortSeeder (20 student dossiers), and Kaprodi Algorithm Center.",
      result: "88 automated tests passing (100%), verified 9-stage academic progression, and zero scheduling deadlocks.",
    },
  },
  {
    id: 5,
    title: "Delta IT Helpdesk",
    category: "Enterprise Support",
    subtitle: "Next.js 16 · Laravel 11 · Meta WhatsApp Cloud API · Soketi WebSockets",
    image_url: null,
    link: null,
    year: "2025",
    sort_order: 4,
    is_featured: false,
    case_study: {
      problem: "Critical support tickets were delayed because field technicians missed web portal alerts.",
      thinking: "Connected ticket dispatching with live WebSocket queues and automated WhatsApp Cloud API escalation webhooks.",
      execution: "Next.js 16, Laravel 11, MariaDB, Soketi WebSockets, and Meta WhatsApp Cloud API webhooks.",
      result: "Sub-2h SLA compliance reached 94%, zero missed alerts, and realtime bidirectional field communication.",
    },
  },
  {
    id: 6,
    title: "Geopetak Web",
    category: "Spatial AI & GIS",
    subtitle: "Vue 3 · Three.js Canvas · 3-Layer Spatial X-Ray · GSAP (Bekasi Aerial Photo Sample)",
    image_url: null,
    link: null,
    year: "2025",
    sort_order: 5,
    is_featured: false,
    case_study: {
      problem: "Traditional tabular real estate data conceals structural, underground, and valuation risks from property analysts.",
      thinking: "Designed a 3-layer spatial X-Ray interface revealing aerial satellite, monochrome infrastructure, and vector cadastral mesh layers, using a real-world Bekasi Aerial Photo case study as the primary sample dataset.",
      execution: "Vue 3, Three.js canvas, GSAP interactive reveal, and custom Bekasi GIS coordinate shaders calibrated against high-resolution Bekasi Aerial Photo samples.",
      result: "Sub-second multi-layer inspection, clear infrastructure visibility, and streamlined spatial analysis verified across Bekasi municipal cadastre data.",
    },
  },
  {
    id: 7,
    title: "AI Expense Tracker",
    category: "AI / Full-stack",
    subtitle: "Next.js 16 · Express · Prisma · Google Gemini 2.0 Flash",
    image_url: null,
    link: null,
    year: "2025",
    sort_order: 6,
    is_featured: false,
    case_study: {
      problem: "Personal expense tracking suffers from high manual entry friction and inconsistent vendor receipt categorization.",
      thinking: "Engineered an automated parsing pipeline using Gemini 2.0 Flash to extract structured line items from raw receipts.",
      execution: "Next.js App Router, Node.js Express API, Prisma ORM, and Google Generative AI SDK with model fallback.",
      result: "Sub-second receipt categorization, zero manual tagging, and automated monthly spending summaries.",
    },
  },
  {
    id: 8,
    title: "Makna Works Brand Guidelines",
    category: "Brand & Design Systems",
    subtitle: "Brand Guidelines · Visual Identity & Geometric Design System",
    image_url: null,
    link: null,
    year: "2025",
    sort_order: 7,
    is_featured: false,
    case_study: {
      problem: "Makna Works lacked a unified brand guideline manual, causing fragmented color usage, inconsistent typography scales, and dilution of the agency's geometric identity across client deliverables.",
      thinking: "Engineered an authoritative brand guideline system establishing strict typographic hierarchy, optical logo clearspace, geometric grid construction, and high-contrast palette tokens.",
      execution: "Figma design tokens, vector logo geometry, editorial layout grid, multi-format collateral specs, and interactive digital guidelines.",
      result: "100% visual consistency across digital, print, and collateral merchandise with streamlined client design handover.",
    },
  },
];

const ALL_PROJECTS = CORE_PROJECTS.map((p) => ({ ...p, coming_soon: false }));

interface WorkGridProps {
  projects?: Project[];
}

export default function WorkGrid({ projects }: WorkGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const apiItems =
    projects && projects.length > 0
      ? projects.map((p) => ({ ...p, coming_soon: false }))
      : null;

  const items = apiItems ?? ALL_PROJECTS;
  const countLabel = String(items.length).padStart(2, "0");

  const renderCardCover = (project: Project, index: number) => {
    if (project.id === 1) {
      // 01: Moriku - Industrial K3 Compliance Engine
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#0c1015] via-[#101721] to-[#0a0d12] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#ba6617_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-[#0e1726] border border-cyan-500/30 flex items-center justify-center p-2.5 shadow-lg group-hover:border-cyan-400 transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/moriku/moriku-logo.png"
                alt="Moriku Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">DISNAKER SLA PIPELINE · LARAVEL 11</div>
            <div className="px-3 py-1 rounded-[2px] bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent2-text)] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              1:1 LIVE MORIKU RUNTIME ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 2) {
      // 02: Indonesian 3D Material Studies
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#06121a] via-[#091a24] to-[#050c12] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#00a8ff_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-[3px] bg-[var(--wire)]/60 border border-[var(--wire)] flex items-center justify-center shadow-lg group-hover:border-[#00a8ff] transition-colors">
              <span className="font-mono text-sm font-bold text-[#00a8ff]">3D</span>
            </div>
            <div className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">RAJA AMPAT &amp; ULUN DANU · REALTIME GLSL</div>
            <div className="px-3 py-1 rounded-[2px] bg-[#00a8ff]/15 border border-[#00a8ff]/40 text-[#00a8ff] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a8ff]"></span>
              1:1 LIVE SHADER DIORAMA ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 3) {
      // 03: TATA$ - Interactive 3D Bag Showcase Landing Page
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#121110] via-[#1a1816] to-[#0d0c0b] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 flex items-center justify-center opacity-35 group-hover:opacity-50 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/tata/cards/1.png"
              alt="TATA$ 3D Bag"
              className="w-full h-full object-cover filter brightness-75 contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="font-serif text-3xl font-bold tracking-tight text-white/90 drop-shadow-md">TATA$</div>
            <div className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">VUE 3 · REALTIME THREE.JS GLTF STAGE</div>
            <div className="px-3 py-1 rounded-[2px] bg-[var(--accent)]/20 border border-[var(--accent)]/50 text-[var(--accent2-text)] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              1:1 LIVE 3D SHOWCASE ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 6) {
      // 06: Geopetak Web (Spatial AI & GIS)
      return (
        <div className="relative w-full h-full overflow-hidden bg-[#0a0f0d] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.02] transition-transform duration-500">
          <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-55 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/projects/bekasi_saturated.jpg"
              alt="Bekasi Aerial Photo Sample"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-[3px] bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <span className="font-mono text-sm font-bold text-emerald-400">GIS</span>
            </div>
            <div className="font-mono text-xs text-white/80 tracking-widest uppercase">BEKASI AERIAL PHOTO SAMPLE · 3-LAYER X-RAY</div>
            <div className="px-3 py-1 rounded-[2px] bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              1:1 LIVE SPATIAL VIEWER ↗
            </div>
          </div>
        </div>
      );
    }

    // Default architectural blueprint cover for Academic Docket, Helpdesk, Expense Tracker
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[var(--s2)] via-[var(--s1)] to-[var(--bg)] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(var(--wire)_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-[3px] bg-[var(--wire)]/60 border border-[var(--wire)] flex items-center justify-center shadow-lg group-hover:border-[var(--accent)] transition-colors">
            <span className="font-mono text-sm font-bold text-[var(--accent2)]">0{index + 1}</span>
          </div>
          <div className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">{project.category}</div>
          <div className="px-3 py-1 rounded-[2px] bg-[var(--s2)] border border-[var(--wire)] text-[var(--text)] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
            1:1 LIVE SYSTEM ↗
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sec-hd" id="work">
        <span className="sec-lbl">Selected work</span>
        <span className="sec-ct">{countLabel} projects</span>
      </div>

      <div className="work-grid work-grid--8">
        {items.map((project, i) => {
          return (
            <div
              key={project.id}
              className="wc wc-interactive group focus:outline-none focus-visible:outline-none cursor-pointer"
              onClick={() => {
                setSelectedProject(project);
              }}
            >
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image_url} alt={project.title} />
              ) : project.id === 8 ? (
                <MaknaMoodboardPreview />
              ) : (
                renderCardCover(project, i)
              )}

              <div className="wo">
                <div className="w-bottom-bar flex items-end justify-between pointer-events-auto">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-num-dock font-mono text-[11px] font-bold tracking-widest text-[var(--accent2)] bg-[var(--wire)] px-1.5 py-0.5 rounded-[2px]">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <div className="w-cat text-[var(--accent2)] font-mono text-xs font-bold tracking-widest uppercase">{project.category}</div>
                    </div>
                    <div className="w-title text-2xl font-serif text-[var(--text)]">{project.title}</div>
                    {project.subtitle && (
                      <div className="w-sub text-[var(--muted)] font-mono text-[13px] mt-1 line-clamp-1">{project.subtitle}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="case-dossier-btn live-launch-btn px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[var(--accent)] hover:bg-[var(--accent2)] text-white rounded-[2px] transition-all duration-200 ease-out flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      aria-haspopup="dialog"
                      aria-label={`Launch live 1:1 interactive project or case study for ${project.title}`}
                    >
                      <span>1:1 Live Project</span>
                      <span className="w-arrow text-white/80 transition-transform group-hover:translate-x-0.5">↗</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1:1 Live Functional Project Pop-Up Modal */}
      <CaseStudyModal
        key={selectedProject ? selectedProject.id : "none"}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

