"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Project } from "@/lib/api";
import HelpdeskPreview from "@/components/previews/HelpdeskPreview";
import ExpenseTrackerPreview from "@/components/previews/ExpenseTrackerPreview";
import AcademicDocketPreview from "@/components/previews/AcademicDocketPreview";
import GeopetakPreview from "@/components/previews/GeopetakPreview";
import MaknaMoodboardPreview from "@/components/previews/MaknaMoodboardPreview";

// Dynamic import for WebGL Three.js diorama studies
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

    triggerElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent background body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
      (mainContent as HTMLElement & { inert?: boolean }).inert = true;
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
        (mainContent as HTMLElement & { inert?: boolean }).inert = false;
      }

      if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
        triggerElementRef.current.focus();
      }
    };
  }, [project, onClose]);

  if (!project) return null;

  const getDirectUrl = (p: Project) => {
    if (p.id === 1) return "/projects/moriku/index.html";
    if (p.id === 2) return "/raja_ampat_snorkel_day.html";
    if (p.id === 3) return "/projects/tata/index.html";
    return p.link || null;
  };

  const directUrl = getDirectUrl(project);

  // 1:1 Live project runtime
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full max-w-[1400px] h-[94vh] max-h-[980px] flex flex-col bg-[var(--modal-bg)] border border-[var(--wire)] text-[var(--text)] shadow-2xl rounded-[4px] transition-colors outline-none overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Refined Clean Single-Header: Confident, Legible, Decluttered ── */}
        <header className="px-5 sm:px-6 py-3.5 border-b border-[var(--wire)] bg-[var(--s1)] shrink-0 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 id="case-modal-title" className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[var(--text)]">
                {project.title}
              </h2>
              <span className="px-2 py-0.5 bg-[var(--s2)] border border-[var(--card-border)] rounded text-[11px] font-mono text-[var(--muted)] uppercase font-semibold">
                {project.category}
              </span>
              {project.year && (
                <span className="text-xs font-mono text-[var(--muted)] opacity-60">
                  {project.year}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-sans truncate">
              {project.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--s2)] hover:bg-rose-500/20 text-[var(--text)] hover:text-rose-400 border border-[var(--card-border)] font-mono text-xs font-bold rounded-[2px] transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <span>✕</span>
              <span className="tracking-wider">CLOSE</span>
              <span className="text-[var(--muted)] font-normal text-[10px] hidden sm:inline">[ESC]</span>
            </button>
          </div>
        </header>

        {/* ── Main Viewport: Scrollable, Interactive, Full-Bleed ── */}
        <main className="relative w-full flex-1 bg-[var(--s1)] overflow-y-auto overflow-x-hidden pointer-events-auto flex flex-col">
          {renderLivePreview(project)}
        </main>
      </div>
    </div>
  );
}
