"use client";

import { useState, useEffect } from "react";
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
    outcome_metric: "270+ Passing Tests · Zero-Downtime Releases",
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
    outcome_metric: "60 FPS GLSL · Zero-RAM Static Export",
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
    outcome_metric: "360° Studio Orbit · Instant 3D Staging",
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
    outcome_metric: "88 Passing Tests · Zero Deadlocks",
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
    title: "MaknaWorks ERP",
    category: "Enterprise PPIC",
    subtitle: "React 19 · TypeScript · NestJS · PostgreSQL 16 · Google Sheets API v4",
    outcome_metric: "Multi-Site PPIC · Bogor & Nganjuk",
    image_url: null,
    link: null,
    year: "2025",
    sort_order: 4,
    is_featured: false,
    case_study: {
      problem: "Multi-site manufacturing across Bogor and Nganjuk lacked unified Bill of Materials tracking, stock opname verification, and real-time PPIC visibility.",
      thinking: "Architected an integrated PPIC ERP platform with role-based permissions, append-only audit logs, and automated Google Sheets synchronization.",
      execution: "React 19, TypeScript, Tailwind CSS, NestJS/Laravel ERP modules, PostgreSQL 16, and multi-facility inventory dashboards.",
      result: "Unified multi-facility PPIC planning, verified stock opname ledgers, and automated low-stock threshold alerts.",
    },
  },
  /* Commented out Delta IT Helpdesk per user request
  {
    id: 5,
    title: "Delta IT Helpdesk",
    category: "Enterprise Support",
    subtitle: "Next.js 16 · Laravel 11 · Meta WhatsApp Cloud API · Soketi WebSockets",
    outcome_metric: "94% Sub-2h SLA · WhatsApp Webhooks",
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
  */
  {
    id: 6,
    title: "Geopetak Web",
    category: "Spatial AI & GIS",
    subtitle: "Vue 3 · Three.js Canvas · 3-Layer Spatial X-Ray · GSAP (Bekasi Aerial Photo Sample)",
    outcome_metric: "3-Layer X-Ray · Cadastre Calibrated",
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
    outcome_metric: "Sub-1s OCR · Gemini 2.0 Flash",
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
    outcome_metric: "100% Brand Token System Specimen",
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
  const totalCount = items.length;
  const countLabel = String(totalCount).padStart(2, "0");

  // URL Deep-linking and Browser Back Button Support (?project=id)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get("project");
      if (projectId) {
        const found = items.find((p) => String(p.id) === projectId);
        if (found) {
          setSelectedProject(found);
          return;
        }
      }
      setSelectedProject(null);
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [items]);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("project", String(project.id));
      window.history.pushState({ projectId: project.id }, "", url.toString());
    } catch { }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      window.history.pushState({}, "", url.pathname + (url.hash || ""));
    } catch { }
  };

  const renderCardCover = (project: Project, index: number) => {
    // Chessboard pattern across grid:
    // Alternates between Maroon (#7a1525) and Cream (#f7f4ee)
    const isMaroon = index === 0 || index === 3 || index === 4 || index === 6;

    if (project.id === 1) {
      // 01: Moriku - Industrial K3 Compliance Engine (Maroon Square, TATA$ Cover Style)
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#7a1525] via-[#630f1c] to-[#4e0a15] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-45 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/moriku-cover.webp"
              alt="Moriku Disnaker Kanban Board"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#4e0a15]/90 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="font-serif text-3xl font-bold tracking-tight text-[#f7f4ee] drop-shadow-sm">MORIKU</div>
            <div className="font-mono text-xs text-[#f7f4ee]/85 tracking-widest uppercase">DISNAKER SLA PIPELINE · LARAVEL 11</div>
            <div className="px-3 py-1 rounded-[2px] bg-white/15 border border-white/35 text-[#f7f4ee] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f7f4ee]"></span>
              MORIKU RUNTIME ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 2) {
      // 02: Indonesian 3D Material Studies (Cream Square, TATA$ Cover Style)
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#f7f4ee] via-[#efece4] to-[#e5e0d5] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500 border border-[var(--wire)]">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-45 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/3d-cover.webp"
              alt="Indonesian 3D Material Studies"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#efece4]/90 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="font-serif text-3xl font-bold tracking-tight text-[#161615] drop-shadow-sm">3D STUDIES</div>
            <div className="font-mono text-xs text-[#6e6a62] tracking-widest uppercase">RAJA AMPAT &amp; ULUN DANU · REALTIME GLSL</div>
            <div className="px-3 py-1 rounded-[2px] bg-[#7a1525]/10 border border-[#7a1525]/30 text-[#7a1525] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a1525]"></span>
              SHADER DIORAMA ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 3) {
      // 03: TATA$ - Interactive 3D Bag Showcase Landing Page (Cream Square)
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#f7f4ee] via-[#efece4] to-[#e5e0d5] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500 border border-[var(--wire)]">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-45 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/tata/cards/1.png"
              alt="TATA$ 3D Bag"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#efece4]/90 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="font-serif text-3xl font-bold tracking-tight text-[#161615] drop-shadow-sm">TATA$</div>
            <div className="font-mono text-xs text-[#6e6a62] tracking-widest uppercase">VUE 3 · REALTIME THREE.JS GLTF STAGE</div>
            <div className="px-3 py-1 rounded-[2px] bg-[#7a1525]/10 border border-[#7a1525]/30 text-[#7a1525] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a1525]"></span>
              3D SHOWCASE ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 4) {
      // 04: Academic Thesis Docket (Maroon Square, TATA$ Cover Style)
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#7a1525] via-[#630f1c] to-[#4e0a15] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-45 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/docket-cover.webp"
              alt="Academic Thesis Docket Optimization Board"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#4e0a15]/90 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="font-serif text-3xl font-bold tracking-tight text-[#f7f4ee] drop-shadow-sm">ACADEMIC DOCKET</div>
            <div className="font-mono text-xs text-[#f7f4ee]/85 tracking-widest uppercase">GALE-SHAPLEY · HUNGARIAN · LARAVEL</div>
            <div className="px-3 py-1 rounded-[2px] bg-white/15 border border-white/35 text-[#f7f4ee] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f7f4ee]"></span>
              DOCKET RUNTIME ↗
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 6) {
      // 06: Geopetak Web (Spatial AI & GIS) (Cream Square)
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#f7f4ee] via-[#efece4] to-[#e5e0d5] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500 border border-[var(--wire)]">
          <div className="absolute inset-0 flex items-center justify-center opacity-35 group-hover:opacity-50 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/projects/bekasi_saturated.jpg"
              alt="Bekasi Aerial Photo Sample"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#efece4]/90 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-[3px] bg-emerald-950/15 border border-emerald-700/30 flex items-center justify-center shadow-sm backdrop-blur-sm">
              <span className="font-mono text-sm font-bold text-emerald-800">GIS</span>
            </div>
            <div className="font-mono text-xs text-[#6e6a62] tracking-widest uppercase">BEKASI AERIAL PHOTO SAMPLE · 3-LAYER X-RAY</div>
            <div className="px-3 py-1 rounded-[2px] bg-emerald-800/10 border border-emerald-800/30 text-emerald-900 font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-800"></span>
              SPATIAL VIEWER ↗
            </div>
          </div>
        </div>
      );
    }

    // Alternating Chessboard Cover for Academic Docket, Helpdesk, AI Expense Tracker
    if (isMaroon) {
      return (
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#7a1525] via-[#630f1c] to-[#4e0a15] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(247,244,238,0.14)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-[3px] bg-white/10 border border-white/20 flex items-center justify-center shadow-sm group-hover:border-white/40 transition-colors">
              <span className="font-mono text-sm font-bold text-[#f7f4ee]">0{index + 1}</span>
            </div>
            <div className="font-mono text-xs text-[#f7f4ee]/85 tracking-widest uppercase">{project.category}</div>
            <div className="px-3 py-1 rounded-[2px] bg-white/15 border border-white/35 text-[#f7f4ee] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f7f4ee]"></span>
              SYSTEM RUNTIME ↗
            </div>
          </div>
        </div>
      );
    }

    // Cream Square
    return (
      <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#f7f4ee] via-[#efece4] to-[#e5e0d5] flex flex-col items-center justify-center p-6 text-center select-none group-hover:scale-[1.01] transition-transform duration-500 border border-[var(--wire)]">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(122,21,37,0.08)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-[3px] bg-[#7a1525]/10 border border-[#7a1525]/30 flex items-center justify-center shadow-sm group-hover:border-[#7a1525] transition-colors">
            <span className="font-mono text-sm font-bold text-[#7a1525]">0{index + 1}</span>
          </div>
          <div className="font-mono text-xs text-[#6e6a62] tracking-widest uppercase">{project.category}</div>
          <div className="px-3 py-1 rounded-[2px] bg-[#7a1525]/10 border border-[#7a1525]/30 text-[#7a1525] font-mono text-[11px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7a1525]"></span>
            SYSTEM RUNTIME ↗
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
              role="article"
              tabIndex={0}
              aria-label={`Project card: ${project.title}`}
              className="wc wc-interactive group focus:outline-none focus-visible:outline-none cursor-pointer"
              onClick={() => {
                handleOpenProject(project);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOpenProject(project);
                }
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="w-num-dock font-mono text-[11px] font-bold tracking-widest text-[var(--accent2)] bg-[var(--wire)] px-1.5 py-0.5 rounded-[2px]">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <div className="w-cat text-[var(--accent2)] font-mono text-xs font-bold tracking-widest uppercase">{project.category}</div>
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--muted)] border border-[var(--wire)] px-1.5 py-0.5 rounded-[2px]">
                        {[1, 3, 6].includes(project.id) ? "Enterprise Proprietary / NDA" : "GitHub Verified Repository"}
                      </span>
                    </div>
                    <div className="w-title text-2xl font-serif text-[var(--text)]">{project.title}</div>
                    {project.subtitle && (
                      <div className="w-sub text-[var(--muted)] font-mono text-[13px] mt-1 line-clamp-1">{project.subtitle}</div>
                    )}
                    {project.outcome_metric && (
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-[var(--accent2)] font-semibold bg-[var(--wire)] px-2 py-0.5 rounded-[2px] mt-1.5 w-fit border border-[var(--wire)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0"></span>
                        <span className="truncate">{project.outcome_metric}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="case-dossier-btn live-launch-btn px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[var(--accent)] hover:bg-[var(--accent2)] text-white rounded-[2px] transition-all duration-200 ease-out flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project);
                      }}
                      aria-haspopup="dialog"
                      aria-label={`View project or case study for ${project.title}`}
                    >
                      <span>View Project</span>
                      <span className="w-arrow text-white/80 transition-transform group-hover:translate-x-0.5">↗</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study & Project Pop-Up Modal */}
      <CaseStudyModal
        key={selectedProject ? selectedProject.id : "none"}
        project={selectedProject}
        allProjects={items}
        onSelectProject={handleOpenProject}
        onClose={handleCloseProject}
      />
    </>
  );
}

