"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Project } from "@/lib/api";
import HelpdeskPreview from "@/components/previews/HelpdeskPreview";
import DNPMonitorPreview from "@/components/previews/DNPMonitorPreview";
import ExpenseTrackerPreview from "@/components/previews/ExpenseTrackerPreview";
import AcademicDocketPreview from "@/components/previews/AcademicDocketPreview";
import GeopetakPreview from "@/components/previews/GeopetakPreview";
import MaknaMoodboardPreview from "@/components/previews/MaknaMoodboardPreview";
import CaseStudyModal from "@/components/CaseStudyModal";

// Three.js components must not run on SSR
const UlunDanuPreview = dynamic(
  () => import("@/components/previews/UlunDanuPreview"),
  { ssr: false }
);
const TataPreview = dynamic(
  () => import("@/components/previews/TataPreview"),
  { ssr: false }
);

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
              className="wc wc-interactive group focus:outline-none focus-visible:outline-none"
            >
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image_url} alt={project.title} />
              ) : project.id === 1 ? (
                <DNPMonitorPreview />
              ) : project.id === 2 ? (
                <UlunDanuPreview />
              ) : project.id === 3 ? (
                <TataPreview />
              ) : project.id === 4 ? (
                <AcademicDocketPreview />
              ) : project.id === 5 ? (
                <HelpdeskPreview />
              ) : project.id === 6 ? (
                <GeopetakPreview />
              ) : project.id === 7 ? (
                <ExpenseTrackerPreview />
              ) : (
                <MaknaMoodboardPreview />
              )}

              <div className="wo">
                <span className="w-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="w-bottom-bar flex items-end justify-between pointer-events-auto">
                  <div className="flex-1 pr-4">
                    <div className="w-cat text-[#9b1e30] font-mono text-xs font-bold tracking-widest uppercase mb-1">{project.category}</div>
                    <div className="w-title text-2xl font-serif text-neutral-100">{project.title}</div>
                    {project.subtitle && (
                      <div className="w-sub text-neutral-300 font-mono text-[13px] mt-1 line-clamp-1">{project.subtitle}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="case-dossier-btn px-3.5 py-1.5 text-xs font-mono font-medium uppercase tracking-wider bg-white/10 hover:bg-[#7a1525] text-white border border-white/20 hover:border-[#9b1e30] rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    aria-label={`Open case dossier for ${project.title}`}
                  >
                    <span>Read Case</span>
                    <span className="text-white/60">↗</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Framework Modal */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

