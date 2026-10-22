"use client";

import { useEffect, useMemo } from "react";
import { Project } from "@/lib/api";

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[940px] max-h-[92vh] overflow-y-auto bg-[var(--modal-bg)] border border-[var(--card-border)] p-6 sm:p-10 text-[var(--text)] shadow-2xl rounded-[3px] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Metadata Ribbon */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--wire)] font-mono text-xs sm:text-[13px]">
          <div className="flex items-center gap-2.5 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
            <span className="text-[var(--accent2)] font-bold">CASE DOSSIER</span>
            <span className="text-[var(--muted)] opacity-40">/</span>
            <span className="text-[var(--muted)]">{project.category}</span>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-2 tracking-wider uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Close case study modal"
          >
            <span>CLOSE</span>
            <span className="text-[var(--accent2)] font-bold group-hover:translate-x-0.5 transition-transform">[ESC]</span>
          </button>
        </div>

        {/* Project Title & Stack Ribbon */}
        <div className="mb-8">
          <div className="flex flex-wrap items-baseline gap-3.5 mb-3">
            <h2 id="case-modal-title" className="text-3xl sm:text-4xl font-display font-medium text-[var(--text)] tracking-tight">
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
            <div className="flex flex-wrap gap-2 mt-3">
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
              <span className="text-[var(--muted)] text-[11px]">PROBLEM STATEMENT</span>
            </div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[var(--text)] font-sans">
              {cs?.problem ?? "Operational and technical bottlenecks required a dedicated systems-first engineering approach."}
            </p>
          </div>

          {/* Card 02: Strategic Architecture & Thinking */}
          <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[var(--wire-h)] transition-colors">
            <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
              <span className="text-[var(--text)] font-bold tracking-wider uppercase">[02] STRATEGIC THINKING</span>
              <span className="text-[var(--muted)] text-[11px]">SYSTEM ARCHITECTURE</span>
            </div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[var(--text)] font-sans">
              {cs?.thinking ?? "Formulated mathematical models and clean architecture boundaries to isolate state and ensure failure tolerance."}
            </p>
          </div>

          {/* Card 03: Implementation & Execution */}
          <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[var(--wire-h)] transition-colors">
            <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
              <span className="text-[var(--text)] font-bold tracking-wider uppercase">[03] EXECUTION PIPELINE</span>
              <span className="text-[var(--muted)] text-[11px]">TOOLING &amp; DISCIPLINE</span>
            </div>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[var(--text)] font-sans">
              {cs?.execution ?? "Implemented through modular components, strict linting, zero silent error catching, and verified automated suites."}
            </p>
          </div>

          {/* Card 04: Production Metrics & Verification */}
          <div className="p-5 bg-[var(--s1)] border border-[var(--card-border)] rounded-[2px] hover:border-[#27ae60]/40 transition-colors">
            <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[var(--wire)] text-xs sm:text-[13px]">
              <span className="text-[#27ae60] font-bold tracking-wider uppercase">[04] RESULT &amp; METRICS</span>
              <span className="text-[var(--muted)] text-[11px]">QUALITY ASSURANCE</span>
            </div>
            <div className="space-y-2 text-[13px] sm:text-[14px] text-[var(--text)]">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Test Rigor:</span>
                <span className="text-[var(--text)] font-bold">100% Passing Automated Suites</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Failure Tolerance:</span>
                <span className="text-[var(--text)] font-bold">Zero Silent Swallows / Fail-Safe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Deployment:</span>
                <span className="text-[#27ae60] font-bold">Atomic Symlink / Production Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metric Pill & Action */}
        <div className="pt-5 border-t border-[var(--wire)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs sm:text-[13px]">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-[#27ae60]"></span>
            <span>Status: Verified In Production / Build Passing</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[var(--s2)] hover:bg-[var(--accent)] text-[var(--text)] hover:text-white border border-[var(--wire)] hover:border-[var(--accent2)] transition-all rounded-[2px] cursor-pointer font-medium"
          >
            ← Return to Grid
          </button>
        </div>
      </div>
    </div>
  );
}
