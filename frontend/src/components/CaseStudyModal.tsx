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
      .filter((s) => s.length > 0 && !s.toLowerCase().includes("engineering") && !s.toLowerCase().includes("pipeline"));
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
          title="Moriku - DNP Monitoring System"
          className="w-full h-full border-0 bg-slate-900"
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
          className="w-full h-full border-0 bg-black"
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full max-w-[1240px] h-[92vh] max-h-[940px] flex flex-col bg-[var(--modal-bg)] border border-[var(--card-border)] text-[var(--text)] shadow-2xl rounded-[3px] transition-colors outline-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Editorial Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--wire)] bg-[var(--s1)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 id="case-modal-title" className="text-base sm:text-lg font-display font-medium text-[var(--text)] tracking-tight truncate">
              {project.title}
            </h2>
            {project.year && (
              <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--muted)] bg-[var(--s2)] px-2 py-0.5 rounded-[2px] border border-[var(--card-border)]">
                {project.year}
              </span>
            )}
            <span className="hidden md:inline-block text-xs font-mono text-[var(--muted)] truncate max-w-sm">
              {project.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {techStack.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 mr-2">
                {techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-[var(--s2)] border border-[var(--card-border)] text-[var(--muted)] font-mono text-[10px] uppercase rounded-[2px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1 bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--card-border)] text-[var(--text)] font-mono text-xs font-medium rounded-[2px] transition-colors"
                title="Launch in independent browser tab"
              >
                <span>Launch in Tab</span>
                <span>↗</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1 bg-[var(--s2)] hover:bg-rose-500/20 text-[var(--text)] hover:text-rose-400 border border-[var(--card-border)] font-mono text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <span>✕</span>
              <span className="hidden sm:inline">CLOSE</span>
              <span className="text-[var(--muted)] font-normal text-[10px] hidden md:inline">[ESC]</span>
            </button>
          </div>
        </div>

        {/* Main Interactive Live Viewport */}
        <div className="live-theater-viewport relative w-full flex-1 bg-[var(--s1)] overflow-hidden">
          {renderLivePreview(project)}
        </div>

        {/* Minimal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-t border-[var(--wire)] bg-[var(--s1)] shrink-0 font-mono text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Interactive Runtime Active</span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 bg-[var(--s2)] rounded text-[var(--text)] border border-[var(--card-border)]">ESC</kbd> or click outside to dismiss</span>
          </div>

          {directUrl && (
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent2-text)] hover:underline flex items-center gap-1 font-semibold"
            >
              Fullscreen Mode ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
