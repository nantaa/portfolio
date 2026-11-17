"use client";

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Project } from "@/lib/api";
import HelpdeskPreview from "@/components/previews/HelpdeskPreview";
import ExpenseTrackerPreview from "@/components/previews/ExpenseTrackerPreview";
import AcademicDocketPreview from "@/components/previews/AcademicDocketPreview";
import GeopetakPreview from "@/components/previews/GeopetakPreview";
import MaknaMoodboardPreview from "@/components/previews/MaknaMoodboardPreview";

// Three.js interactive previews dynamically imported to prevent SSR issues
const MaterialStudiesCarousel = dynamic(
  () => import("@/components/previews/MaterialStudiesCarousel"),
  { ssr: false }
);

interface CaseStudyModalProps {
  project: Project | null;
  initialMode?: "live" | "dossier";
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    // Capture the triggering element that invoked the modal
    triggerElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent background body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
      (mainContent as HTMLElement & { inert?: boolean }).inert = true;
    }

    // Automatically focus the close button upon opening
    const focusTimer = setTimeout(() => {
      if (modalContainerRef.current) {
        const closeBtn = modalContainerRef.current.querySelector<HTMLElement>('[aria-label="Close project modal"]');
        if (closeBtn) {
          closeBtn.focus();
        }
      }
    }, 10);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trapping
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

    const handleMessage = (e: MessageEvent) => {
      if (e.data === "close-modal") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("message", handleMessage);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("message", handleMessage);
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

  // Extract technology tokens from subtitle
  const techStack = useMemo(() => {
    if (!project) return [];
    const source = project.subtitle || "";
    return source
      .split(/[·,+]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.toLowerCase().includes("pipeline") && !s.toLowerCase().includes("engineering"));
  }, [project]);

  if (!project) return null;

  const getDirectUrl = (p: Project) => {
    if (p.id === 1) return "/projects/moriku/index.html";
    if (p.id === 2) return "/raja_ampat_snorkel_day.html";
    if (p.id === 3) return "/projects/tata/index.html";
    return p.link || null;
  };

  const directUrl = getDirectUrl(project);

  // Render the corresponding 1:1 live functional project
  const renderLivePreview = (p: Project) => {
    if (p.id === 1) {
      return (
        <iframe
          src="/projects/moriku/index.html"
          title="Moriku - DNP Compliance Engine"
          className="w-full h-full border-0 bg-slate-900 pointer-events-auto"
          loading="eager"
        />
      );
    }
    if (p.id === 2) return <MaterialStudiesCarousel />;
    if (p.id === 3) {
      return (
        <iframe
          src="/projects/tata/index.html"
          title="TATA$ 3D Showcase"
          className="w-full h-full border-0 bg-black pointer-events-auto"
          loading="eager"
        />
      );
    }
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full max-w-[1360px] h-[92vh] max-h-[960px] flex flex-col bg-[var(--modal-bg)] border border-[var(--wire)] text-[var(--text)] shadow-2xl rounded-[4px] transition-colors outline-none overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Refined Editorial Header: High Legibility & Clear Hierarchy ── */}
        <header className="px-5 sm:px-7 py-4 border-b border-[var(--wire)] bg-[var(--s1)] shrink-0 flex flex-col gap-3">
          {/* Top Control Strip */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted)] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--text)] font-semibold">{project.category}</span>
              {project.year && (
                <>
                  <span className="opacity-40">/</span>
                  <span className="px-2 py-0.5 bg-[var(--s2)] text-[var(--text)] border border-[var(--card-border)] rounded-[2px] font-mono text-[11px]">
                    {project.year}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {directUrl && (
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--card-border)] text-[var(--text)] hover:text-[var(--accent2-text)] font-mono text-xs font-semibold rounded-[2px] transition-colors"
                  title="Open live project in a dedicated browser tab"
                >
                  <span>Launch in Tab</span>
                  <span>↗</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--s2)] hover:bg-rose-500/20 text-[var(--text)] hover:text-rose-400 border border-[var(--card-border)] font-mono text-xs font-bold rounded-[2px] transition-colors cursor-pointer"
                aria-label="Close project modal"
              >
                <span>✕</span>
                <span className="hidden sm:inline tracking-wider">CLOSE</span>
                <span className="text-[var(--muted)] font-normal text-[10px] hidden md:inline">[ESC]</span>
              </button>
            </div>
          </div>

          {/* Headline & Tech Stack Strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-1">
            <div className="space-y-1 max-w-3xl">
              <h2 id="case-modal-title" className="text-xl sm:text-2xl lg:text-3xl font-display font-medium text-[var(--text)] tracking-tight">
                {project.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] font-sans line-clamp-2 leading-relaxed">
                {project.subtitle}
              </p>
            </div>

            {/* Redesigned Architectural Tech Stack Tags: Clean, Legible, Professional */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start md:self-end">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-[var(--s2)] border border-[var(--card-border)] text-[var(--text)] font-mono text-xs rounded-[2px] tracking-wide"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── Main Interactive Viewport: 100% Full-Bleed & Fully Interactive ── */}
        <main className="relative w-full flex-1 bg-[var(--s1)] overflow-hidden pointer-events-auto">
          {renderLivePreview(project)}
        </main>

        {/* ── Minimal Bottom Status Bar ── */}
        <footer className="px-5 sm:px-7 py-2 border-t border-[var(--wire)] bg-[var(--s1)] shrink-0 flex items-center justify-between font-mono text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[var(--text)]">1:1 Live System Active</span>
            <span className="opacity-40 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Interactive runtime · Press ESC to close</span>
          </div>

          {directUrl && (
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent2-text)] hover:underline font-semibold"
            >
              Fullscreen Mode ↗
            </a>
          )}
        </footer>
      </div>
    </div>
  );
}
