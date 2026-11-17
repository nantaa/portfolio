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
      .filter((s) => s.length > 0 && !s.includes("PT Delta") && !s.includes("MORIKU"));
  }, [project]);

  if (!project) return null;

  // Direct fullscreen/standalone URL determination
  const getDirectUrl = (p: Project): string | null => {
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
        <div className="relative w-full h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--s2)] border-b border-[var(--wire)] text-xs font-mono text-[var(--muted)] shrink-0">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[var(--text)] font-semibold tracking-wider">LIVE 1:1 PRODUCTION INSTANCE: MORIKU / DNP COMPLIANCE ENGINE</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href="/projects/moriku/simulator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline flex items-center gap-1 font-semibold"
                title="Buka simulator alur 16 tahap DNP"
              >
                Simulator Alur ↗
              </a>
              <a
                href="/projects/moriku/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent2-text)] hover:underline flex items-center gap-1 font-semibold"
              >
                Open Fullscreen ↗
              </a>
            </div>
          </div>
          <iframe
            src="/projects/moriku/index.html"
            title="Moriku - DNP Monitoring System"
            className="w-full flex-1 border-0 bg-white"
            style={{ minHeight: "580px" }}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      );
    }
    if (p.id === 2) return <MaterialStudiesCarousel />;
    if (p.id === 3) {
      return (
        <div className="relative w-full h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--s2)] border-b border-[var(--wire)] text-xs font-mono text-[var(--muted)] shrink-0">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[var(--text)] font-semibold tracking-wider">LIVE 1:1 PRODUCTION INSTANCE: TATA$ REALTIME 3D GLTF RUNTIME</span>
            </span>
            <a
              href="/projects/tata/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent2-text)] hover:underline flex items-center gap-1 font-semibold"
            >
              Open Fullscreen ↗
            </a>
          </div>
          <iframe
            src="/projects/tata/index.html"
            title="TATA$ 3D Showcase"
            className="w-full flex-1 border-0 bg-black"
            style={{ minHeight: "580px" }}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
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
        className="relative w-full max-w-[1180px] max-h-[96vh] flex flex-col bg-[var(--modal-bg)] border border-[var(--card-border)] text-[var(--text)] shadow-2xl rounded-[3px] transition-colors outline-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--wire)] bg-[var(--s1)] shrink-0 font-mono text-xs sm:text-[13px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
              <span className="text-[var(--accent2-text)] font-bold">1:1 LIVE SYSTEM</span>
              <span className="text-[var(--muted)] opacity-40">/</span>
              <span className="text-[var(--muted)]">{project.category}</span>
            </div>
            {project.year && (
              <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--muted)] bg-[var(--s2)] px-2 py-0.5 rounded-[2px] border border-[var(--card-border)]">
                CYCLE {project.year}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--card-border)] text-[var(--text)] hover:text-[var(--accent2-text)] font-mono text-xs font-semibold rounded-[2px] transition-colors"
                title="Launch in independent browser tab"
              >
                <span>Launch in Tab</span>
                <span>↗</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1 bg-[var(--s2)] hover:bg-rose-500/20 text-[var(--text)] hover:text-rose-400 border border-[var(--card-border)] font-mono text-xs font-bold rounded-[2px] transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <span>✕</span>
              <span className="hidden sm:inline tracking-wider">CLOSE</span>
              <span className="text-[var(--muted)] font-normal text-[10px] hidden md:inline">[ESC]</span>
            </button>
          </div>
        </div>

        {/* Project Sub-header: Title & Stack Badges */}
        <div className="px-4 sm:px-6 py-3 bg-[var(--s1)]/80 border-b border-[var(--wire)]/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h2 id="case-modal-title" className="text-xl sm:text-2xl font-display font-medium text-[var(--text)] tracking-tight">
              {project.title}
            </h2>
            <div className="text-xs font-mono text-[var(--muted)] mt-0.5">
              {project.subtitle}
            </div>
          </div>

          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-chip px-2.5 py-0.5 bg-[var(--s2)] border border-[var(--card-border)] text-[var(--text)] font-mono text-[10px] sm:text-[11px] tracking-wider uppercase rounded-[2px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main 1:1 Live Interactive Viewport */}
        <div className="live-theater-viewport relative w-full flex-1 h-[65dvh] sm:h-[72dvh] min-h-[420px] max-h-[820px] bg-[var(--s1)] overflow-hidden">
          {renderLivePreview(project)}
        </div>

        {/* Bottom Status / Dismissal Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-[var(--wire)] bg-[var(--s1)] shrink-0 font-mono text-[11px]">
          <div className="text-[var(--muted)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>REALTIME INTERACTIVE SANDBOX</span>
            <span className="hidden sm:inline opacity-40">·</span>
            <span className="hidden sm:inline text-[var(--muted)]">Press <kbd className="px-1 py-0.5 bg-[var(--s2)] rounded text-[var(--text)] border border-[var(--card-border)]">ESC</kbd> or click outside to close</span>
          </div>

          {directUrl && (
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent2-text)] hover:underline flex items-center gap-1 font-semibold"
            >
              Open Fullscreen ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
