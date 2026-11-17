"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Project } from "@/lib/api";
import HelpdeskPreview from "@/components/previews/HelpdeskPreview";
import DNPMonitorPreview from "@/components/previews/DNPMonitorPreview";
import ExpenseTrackerPreview from "@/components/previews/ExpenseTrackerPreview";
import AcademicDocketPreview from "@/components/previews/AcademicDocketPreview";
import GeopetakPreview from "@/components/previews/GeopetakPreview";
import MaknaMoodboardPreview from "@/components/previews/MaknaMoodboardPreview";

// Three.js interactive previews dynamically imported to prevent SSR issues
const TataPreview = dynamic(
  () => import("@/components/previews/TataPreview"),
  { ssr: false }
);
const MaterialStudiesCarousel = dynamic(
  () => import("@/components/previews/MaterialStudiesCarousel"),
  { ssr: false }
);

interface CaseStudyModalProps {
  project: Project | null;
  initialMode?: "live" | "dossier";
  onClose: () => void;
}

export default function CaseStudyModal({ project, initialMode = "live", onClose }: CaseStudyModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "dossier">(initialMode);

  useEffect(() => {
    if (!project) return;

    // Capture the triggering element that invoked the modal
    triggerElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent background scrolling and interaction
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
      (mainContent as HTMLElement & { inert?: boolean }).inert = true;
    }

    // Automatically focus the first focusable element upon opening
    const focusTimer = setTimeout(() => {
      if (modalContainerRef.current) {
        const focusableSelector =
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusables = Array.from(
          modalContainerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusables.length > 0) {
          focusables[0].focus();
        }
      }
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trapping: cycle focus only through focusable elements inside the dialog
      if (e.key === "Tab") {
        if (!modalContainerRef.current) return;

        const focusableSelector =
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusables = Array.from(
          modalContainerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalContainerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalContainerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;

      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
        (mainContent as HTMLElement & { inert?: boolean }).inert = false;
      }

      if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
        triggerElementRef.current.focus();
      }
    };
  }, [project, onClose]);

  // Extract technology tokens from subtitle or execution text into distinct chips
  const techStack = useMemo(() => {
    if (!project) return [];
    const source = project.subtitle || "";
    return source
      .split(/[·,+]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.includes("PT Delta") && !s.includes("MORIKU"));
  }, [project]);

  if (!project) return null;

  const cs = project.case_study;

  // Render the corresponding live functional project preview
  const renderLivePreview = (p: Project) => {
    if (p.id === 1) return <DNPMonitorPreview />;
    if (p.id === 2) return <MaterialStudiesCarousel />;
    if (p.id === 3) return <TataPreview />;
    if (p.id === 4) return <AcademicDocketPreview />;
    if (p.id === 5) return <HelpdeskPreview />;
    if (p.id === 6) return <GeopetakPreview />;
    if (p.id === 7) return <ExpenseTrackerPreview />;
    return <MaknaMoodboardPreview />;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full max-w-[1080px] max-h-[94vh] overflow-y-auto bg-[var(--modal-bg)] border border-[var(--card-border)] p-4 sm:p-8 md:p-10 text-[var(--text)] shadow-2xl rounded-[3px] transition-colors outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Metadata Ribbon */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--wire)] font-mono text-xs sm:text-[13px]">
          <div className="flex items-center gap-2.5 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
            <span className="text-[var(--accent2-text)] font-bold">PROJECT THEATER</span>
            <span className="text-[var(--muted)] opacity-40">/</span>
            <span className="text-[var(--muted)]">{project.category}</span>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-2 tracking-wider uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Close project modal"
          >
            <span>CLOSE</span>
            <span className="text-[var(--accent2-text)] font-bold group-hover:translate-x-0.5 transition-transform">[ESC]</span>
          </button>
        </div>

        {/* Project Title & Stack Ribbon */}
        <div className="mb-6">
          <div className="flex flex-wrap items-baseline gap-3.5 mb-2">
            <h2 id="case-modal-title" className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-[var(--text)] tracking-tight">
              {project.title}
            </h2>
            {project.year && (
              <span className="font-mono text-xs text-[var(--muted)] bg-[var(--s2)] px-2.5 py-1 rounded-[2px] border border-[var(--card-border)]">
                CYCLE {project.year}
              </span>
            )}
          </div>

          {/* Interactive Technology Stack Chips */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-chip px-3 py-1 bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--card-border)] text-[var(--text)] font-mono text-[11px] sm:text-xs tracking-wider uppercase rounded-[2px] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ─── Dual-Mode Theater Tab Switcher ─── */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-[var(--s2)] border border-[var(--wire)] rounded-[3px] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className={`px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span>⚡</span>
            <span>Live Interactive System</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "dossier"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <span>📋</span>
            <span>Case Dossier</span>
          </button>
        </div>

        {/* ─── Tab Content: Live Interactive Theater or Case Framework Dossier ─── */}
        {activeTab === "live" ? (
          <div className="live-theater-viewport relative w-full h-[500px] sm:h-[580px] bg-[var(--s1)] border border-[var(--wire)] rounded-[3px] overflow-hidden mb-6 shadow-inner">
            {renderLivePreview(project)}
          </div>
        ) : (
          <div className="dossier-viewport animate-fadeIn">
            {/* ─── Elevated Impact Highlight Banner ─── */}
            <div className="cs-impact-banner mb-8 p-5 sm:p-6 rounded-[2px] bg-[var(--s1)] border border-[#27ae60]/40 shadow-lg">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#27ae60]/20 font-mono text-xs sm:text-[13px] tracking-wider uppercase">
                <span className="flex items-center gap-2.5 text-[#27ae60] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#27ae60] animate-pulse"></span>
                  QUANTIFIED IMPACT &amp; KEY OUTCOME
                </span>
                <span className="text-[var(--muted)] text-[11px]">PRODUCTION CERTIFIED</span>
              </div>
              <p className="text-base sm:text-[17px] leading-relaxed text-[var(--text)] font-sans font-medium">
                {cs?.result ?? "Sub-second operational performance with zero statutory SLA leaks and production test verification."}
              </p>
            </div>

            {/* ─── 2×2 Architectural Engineering Dossier Grid ─── */}
            <div className="cs-grid grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8 font-mono">
              {/* Card 01: Bottleneck & Problem */}
              <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[#f39c12]/40 transition-colors">
                <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
                  <span className="text-[#f39c12] font-bold tracking-wider uppercase">[01] THE BOTTLENECK</span>
                  <span className="text-[var(--muted)] text-[10px]">DIAGNOSTIC</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-bold">PROBLEM</h4>
                <p className="text-base sm:text-[16px] text-[var(--text)] leading-relaxed font-sans font-normal">
                  {cs?.problem ?? "Unaddressed latency and manual friction in legacy deployment pipelines."}
                </p>
              </div>

              {/* Card 02: Systems Architecture & Strategy */}
              <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[var(--accent2)]/40 transition-colors">
                <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
                  <span className="text-[var(--accent2-text)] font-bold tracking-wider uppercase">[02] STRATEGIC FRAME</span>
                  <span className="text-[var(--muted)] text-[10px]">APPROACH</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-bold">THINKING</h4>
                <p className="text-base sm:text-[16px] text-[var(--text)] leading-relaxed font-sans font-normal">
                  {cs?.thinking ?? "Deconstructed domain bottlenecks and isolated stateful concerns with transactional guarantees."}
                </p>
              </div>

              {/* Card 03: Concrete Execution & Tooling */}
              <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[#3498db]/40 transition-colors">
                <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
                  <span className="text-[#3498db] font-bold tracking-wider uppercase">[03] PRODUCTION RIGOR</span>
                  <span className="text-[var(--muted)] text-[10px]">STACK</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-bold">EXECUTION</h4>
                <p className="text-base sm:text-[16px] text-[var(--text)] leading-relaxed font-sans font-normal">
                  {cs?.execution ?? "Built with modern frameworks, automated unit test suites, and strict CI/CD pipelines."}
                </p>
              </div>

              {/* Card 04: Verified Benchmark Result */}
              <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[#27ae60]/40 transition-colors">
                <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
                  <span className="text-[#27ae60] font-bold tracking-wider uppercase">[04] VERIFIED METRIC</span>
                  <span className="text-[var(--muted)] text-[10px]">SUCCESS</span>
                </div>
                <h4 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2 font-bold">RESULT</h4>
                <p className="text-base sm:text-[16px] text-[var(--text)] leading-relaxed font-sans font-medium">
                  {cs?.result ?? "100% test coverage with verifiable performance gains and production validation."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation within Modal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--wire)] font-mono text-xs">
          <div className="text-[var(--muted)] text-center sm:text-left">
            <span>PRESS </span>
            <kbd className="px-1.5 py-0.5 bg-[var(--s2)] rounded-[2px] border border-[var(--card-border)] text-[var(--text)]">ESC</kbd>
            <span> OR CLICK OUTSIDE TO DISMISS</span>
          </div>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent2)] text-white font-bold tracking-wider uppercase rounded-[2px] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Launch Fullscreen Diorama</span>
              <span>↗</span>
            </a>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[var(--s2)] hover:bg-[var(--s3)] text-[var(--text)] border border-[var(--card-border)] font-medium tracking-wider uppercase rounded-[2px] transition-colors cursor-pointer"
            >
              Return to Grid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
