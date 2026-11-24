"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Project } from "@/lib/api";
// Commented out Delta IT Helpdesk preview per user request
// import HelpdeskPreview from "@/components/previews/HelpdeskPreview";
import TridhataLaravelPreview from "@/components/previews/TridhataLaravelPreview";
import ExpenseTrackerPreview from "@/components/previews/ExpenseTrackerPreview";
import AcademicDocketPreview from "@/components/previews/AcademicDocketPreview";
import GeopetakPreview from "@/components/previews/GeopetakPreview";

const emptySubscribe = () => () => {};

// Dynamic import for WebGL Three.js diorama studies
const MaterialStudiesCarousel = dynamic(
  () => import("@/components/previews/MaterialStudiesCarousel"),
  { ssr: false }
);

interface CaseStudyModalProps {
  project: Project | null;
  allProjects?: Project[];
  initialMode?: "live" | "dossier";
  onSelectProject?: (project: Project) => void;
  onClose: () => void;
}

export default function CaseStudyModal({
  project,
  allProjects,
  onSelectProject,
  onClose,
}: CaseStudyModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const currentIndex = allProjects && project ? allProjects.findIndex((p) => p.id === project.id) : -1;
  const prevProject = allProjects && currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    allProjects && currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  useEffect(() => {
    if (!project) return;

    triggerElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent background body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
    }

    // Auto-focus close button
    const focusTimer = setTimeout(() => {
      if (modalContainerRef.current) {
        const closeBtn = modalContainerRef.current.querySelector<HTMLElement>('[aria-label="Close project modal"]');
        if (closeBtn) closeBtn.focus();
      }
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft" && prevProject && onSelectProject) {
        e.preventDefault();
        onSelectProject(prevProject);
        return;
      }

      if (e.key === "ArrowRight" && nextProject && onSelectProject) {
        e.preventDefault();
        onSelectProject(nextProject);
        return;
      }

      // Trap focus inside modal
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
      }

      if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
        triggerElementRef.current.focus();
      }
    };
  }, [project, prevProject, nextProject, onSelectProject, onClose]);

  if (!project || !mounted || typeof document === "undefined") return null;

  const getDirectUrl = (p: Project) => {
    if (p.id === 1) return "/projects/moriku/index.html?v=20261125b";
    if (p.id === 2) return "/raja_ampat_snorkel_day.html";
    if (p.id === 3) return "/projects/tata/index.html?v=20261125";
    return p.link || null;
  };

  const directUrl = getDirectUrl(project);

  // 1:1 Live project runtime with responsive viewports
  const renderLivePreview = (p: Project) => {
    if (p.id === 1) {
      return (
        <iframe
          src="/projects/moriku/index.html?v=20261125b"
          title="Moriku - DNP Compliance Engine"
          className="w-full h-full border-0 block flex-1 min-h-0 bg-slate-950 pointer-events-auto"
          loading="eager"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      );
    }
    if (p.id === 2) return <MaterialStudiesCarousel />;
    if (p.id === 3) {
      return (
        <iframe
          src="/projects/tata/index.html?v=20261125"
          title="TATA$ 3D Showcase"
          className="w-full h-full border-0 block flex-1 min-h-0 bg-black pointer-events-auto"
          loading="eager"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      );
    }
    return (
      <div className="w-full flex-1 min-h-0 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[var(--s1)]">
        <div className="w-full max-w-4xl h-full max-h-[720px] flex flex-col">
          {p.id === 4 && <AcademicDocketPreview />}
          {/* Commented out Delta IT Helpdesk preview per user request: {p.id === 5 && <HelpdeskPreview />} */}
          {p.id === 5 && <TridhataLaravelPreview />}
          {p.id === 6 && <GeopetakPreview />}
          {p.id === 7 && <ExpenseTrackerPreview />}
          {p.id === 8 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/makna_works_branding_moodboard.webp"
                alt="Makna Works Brand Guidelines"
                className="max-h-[660px] w-auto max-w-full object-contain rounded-[2px] shadow-lg border border-[var(--wire)]"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      className="fixed inset-0 z-[9999] flex flex-col md:items-center md:justify-center p-0 md:p-6 lg:p-8 bg-black/85 backdrop-blur-md animate-fadeIn select-text overflow-hidden"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full h-full md:h-[92vh] md:max-h-[1020px] md:max-w-[1520px] flex flex-col bg-[var(--modal-bg)] md:border md:border-[var(--wire)] text-[var(--text)] shadow-2xl md:rounded-lg transition-colors outline-none overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Refined Single Header: Confident, Legible, Decluttered ── */}
        <header className="px-4 sm:px-6 py-2.5 sm:py-3.5 border-b border-[var(--wire)] bg-[var(--s1)] shrink-0 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <h2 id="case-modal-title" className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[var(--text)] truncate">
                {project.title}
              </h2>
              <span className="px-2 py-0.5 bg-[var(--s2)] border border-[var(--card-border)] rounded text-[10px] sm:text-[11px] font-mono text-[var(--muted)] uppercase font-semibold shrink-0">
                {project.category}
              </span>
              {project.year && (
                <span className="text-[11px] sm:text-xs font-mono text-[var(--muted)] opacity-60 shrink-0">
                  {project.year}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] font-sans line-clamp-1 sm:line-clamp-2 max-w-3xl leading-relaxed">
              {project.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {allProjects && allProjects.length > 1 && onSelectProject && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!prevProject}
                  onClick={() => prevProject && onSelectProject(prevProject)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--s2)] hover:bg-[var(--s3)] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--card-border)] text-[var(--text)] font-mono text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                  aria-label="Previous Project"
                  title={prevProject ? `Previous: ${prevProject.title}` : undefined}
                >
                  <span>←</span>
                  <span className="hidden md:inline">Previous Project</span>
                </button>
                <span className="font-mono text-[11px] text-[var(--muted)] px-1 hidden lg:inline">
                  {currentIndex + 1} / {allProjects.length}
                </span>
                <button
                  type="button"
                  disabled={!nextProject}
                  onClick={() => nextProject && onSelectProject(nextProject)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--s2)] hover:bg-[var(--s3)] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--card-border)] text-[var(--text)] font-mono text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                  aria-label="Next Project"
                  title={nextProject ? `Next: ${nextProject.title}` : undefined}
                >
                  <span className="hidden md:inline">Next Project</span>
                  <span>→</span>
                </button>
              </div>
            )}

            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--card-border)] text-[var(--text)] hover:text-[var(--accent2-text)] font-mono text-xs font-semibold rounded-[2px] transition-colors"
                title="Open in dedicated browser tab"
              >
                <span>Launch in Tab</span>
                <span>↗</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 min-w-[36px] sm:min-w-0 h-[36px] sm:h-auto px-3 sm:px-3.5 py-1.5 bg-[var(--s2)] hover:bg-rose-500/20 text-[var(--text)] hover:text-rose-400 border border-[var(--card-border)] font-mono text-xs font-bold rounded-[2px] transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <span>✕</span>
              <span className="tracking-wider hidden xs:inline sm:inline">CLOSE</span>
              <span className="text-[var(--muted)] font-normal text-[10px] hidden md:inline">[ESC]</span>
            </button>
          </div>
        </header>

        {/* ── Main Viewport: Scrollable, Interactive, Full-Bleed ── */}
        <main className="relative w-full flex-1 min-h-0 bg-[var(--s1)] overflow-y-auto pointer-events-auto flex flex-col">
          {renderLivePreview(project)}
        </main>
      </div>
    </div>,
    document.body
  );
}
