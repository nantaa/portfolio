"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Project } from "@/lib/api";
import { isTrustedSameOrigin, shouldBlockInspectShortcut } from "@/lib/inspectGuard";
// Commented out Delta IT Helpdesk preview per user request
// import HelpdeskPreview from "@/components/previews/HelpdeskPreview";
// import ExpenseTrackerPreview from "@/components/previews/ExpenseTrackerPreview";
// import AcademicDocketPreview from "@/components/previews/AcademicDocketPreview";
// import GeopetakPreview from "@/components/previews/GeopetakPreview";

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
  const isAutomatedBot = useSyncExternalStore(
    emptySubscribe,
    () => typeof navigator !== "undefined" && Boolean(navigator.webdriver),
    () => false
  );
  const [privacyVeil, setPrivacyVeil] = useState(false);
  const [activeStudyIndex, setActiveStudyIndex] = useState(0);
  const veilTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeCleanupRef = useRef<(() => void) | null>(null);

  const triggerTemporaryVeil = useCallback((clearClipboard: boolean, durationMs = 2000) => {
    setPrivacyVeil(true);
    if (clearClipboard && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText("").catch(() => {});
    }
    if (veilTimerRef.current) clearTimeout(veilTimerRef.current);
    veilTimerRef.current = setTimeout(() => setPrivacyVeil(false), durationMs);
  }, []);

  const handleCaptureKeyEvent = useCallback((e: KeyboardEvent, phase: "keydown" | "keyup") => {
    const keyLower = (e.key || "").toLowerCase();
    const isMetaShift =
      (e.shiftKey && (e.key === "Meta" || e.key === "OS")) || (e.metaKey && e.key === "Shift");
    const isCaptureCombo =
      e.key === "PrintScreen" || ((e.metaKey || e.ctrlKey) && e.shiftKey && keyLower === "s");

    if (isMetaShift && phase === "keydown") {
      triggerTemporaryVeil(false, 1800);
      return true;
    }

    if (shouldBlockInspectShortcut(e) || isCaptureCombo) {
      e.preventDefault();
      e.stopPropagation();
      if (isCaptureCombo) {
        triggerTemporaryVeil(e.key === "PrintScreen", 2000);
      }
      return true;
    }
    return false;
  }, [triggerTemporaryVeil]);

  const attachIframeGuards = (iframeEl: HTMLIFrameElement | null) => {
    iframeCleanupRef.current?.();
    iframeCleanupRef.current = null;
    if (!iframeEl) return;
    try {
      const win = iframeEl.contentWindow;
      if (!win) return;
      const onIframeBlur = () => {
        setTimeout(() => {
          if (!document.hasFocus()) setPrivacyVeil(true);
        }, 0);
      };
      const onIframeFocus = () => {
        if (document.hasFocus()) setPrivacyVeil(false);
      };
      const onIframeKeyDown = (e: KeyboardEvent) => handleCaptureKeyEvent(e, "keydown");
      const onIframeKeyUp = (e: KeyboardEvent) => handleCaptureKeyEvent(e, "keyup");

      win.addEventListener("blur", onIframeBlur);
      win.addEventListener("focus", onIframeFocus);
      win.addEventListener("keydown", onIframeKeyDown, true);
      win.addEventListener("keyup", onIframeKeyUp, true);

      iframeCleanupRef.current = () => {
        try {
          win.removeEventListener("blur", onIframeBlur);
          win.removeEventListener("focus", onIframeFocus);
          win.removeEventListener("keydown", onIframeKeyDown, true);
          win.removeEventListener("keyup", onIframeKeyUp, true);
        } catch {
          // Ignore detached cross-realm frame errors on cleanup
        }
      };
    } catch {
      // Non-same-origin guard
    }
  };

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

      if (handleCaptureKeyEvent(e, "keydown")) {
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

    const handleKeyUp = (e: KeyboardEvent) => {
      handleCaptureKeyEvent(e, "keyup");
    };

    const handleMessage = (e: MessageEvent) => {
      if (!isTrustedSameOrigin(e)) return;
      if (e.data === "close-modal") {
        onClose();
      }
    };

    const handleWindowBlur = () => {
      setTimeout(() => {
        if (!document.hasFocus()) {
          setPrivacyVeil(true);
        }
      }, 0);
    };

    const handleWindowFocus = () => {
      setPrivacyVeil(false);
    };

    const handleVisibilityChange = () => {
      setPrivacyVeil(document.visibilityState === "hidden");
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("message", handleMessage);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(focusTimer);
      if (veilTimerRef.current) clearTimeout(veilTimerRef.current);
      iframeCleanupRef.current?.();
      iframeCleanupRef.current = null;
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.body.style.overflow = originalOverflow;

      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
      }

      if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
        triggerElementRef.current.focus();
      }
    };
  }, [project, prevProject, nextProject, onSelectProject, onClose, handleCaptureKeyEvent]);

  if (!project || !mounted || typeof document === "undefined") return null;

  const getDirectUrl = (p: Project) => {
    if (p.id === 1) return "/projects/moriku/index.html?v=20261125c";
    if (p.id === 2) {
      if (activeStudyIndex === 2) return "/dusk_orbit.html";
      return activeStudyIndex === 1
        ? "/ulun_danu_lake_bratan_material_studies.html"
        : "/raja_ampat_snorkel_day.html";
    }
    if (p.id === 3) return "/projects/tata/index.html?v=20261125";
    if (p.id === 4) return "/projects/thesis-docket/index.html?v=20261125";
    if (p.id === 5) return "/projects/maknaworks/index.html?v=20261125";
    if (p.id === 6) return "/projects/geopetak/index.html?v=20261125";
    if (p.id === 7) return "/projects/vaultr/index.html?v=20261125b";
    return p.link || null;
  };

  const directUrl = ![1, 3, 6].includes(project.id) ? getDirectUrl(project) : null;

  // 1:1 Live project runtime with responsive viewports
  const renderLivePreview = (p: Project) => {
    if (p.id === 1) {
      return (
        <iframe
          src="/projects/moriku/index.html?v=20261125c"
          title="Moriku - DNP Compliance Engine"
          onLoad={(e) => attachIframeGuards(e.currentTarget)}
          className="w-full h-full border-0 block flex-1 min-h-0 bg-slate-950 pointer-events-auto"
          loading="eager"
        />
      );
    }
    if (p.id === 2) return <MaterialStudiesCarousel activeSlide={activeStudyIndex} />;
    if (p.id === 3) {
      return (
        <iframe
          src="/projects/tata/index.html?v=20261125"
          title="TATA$ 3D Showcase"
          onLoad={(e) => attachIframeGuards(e.currentTarget)}
          className="w-full h-full border-0 block flex-1 min-h-0 bg-black pointer-events-auto"
          loading="eager"
        />
      );
    }
    if (p.id === 4) {
      return (
        <iframe
          src="/projects/thesis-docket/index.html?v=20261125"
          title="Academic Thesis Docket - Optimization & Kanban"
          onLoad={(e) => attachIframeGuards(e.currentTarget)}
          className="w-full h-full border-0 block flex-1 min-h-0 bg-slate-50 pointer-events-auto"
          loading="eager"
        />
      );
    }
    if (p.id === 5) {
      return (
        <iframe
          src="/projects/maknaworks/index.html?v=20261125"
          title="MaknaWorks ERP - PPIC Dashboard"
          onLoad={(e) => attachIframeGuards(e.currentTarget)}
          className="w-full h-full border-0 block flex-1 min-h-0 bg-white pointer-events-auto"
          loading="eager"
        />
      );
    }
    if (p.id === 6) {
      return (
        <iframe
          src="/projects/geopetak/index.html?v=20261125"
          title="Geopetak - Spatial AI Platform"
          onLoad={(e) => attachIframeGuards(e.currentTarget)}
          className="w-full h-full border-0 block flex-1 min-h-0 bg-[#0b0c10] pointer-events-auto"
          loading="eager"
        />
      );
    }
    if (p.id === 7) {
      return (
        <iframe
          src="/projects/vaultr/index.html?v=20261125b"
          title="VAULTR - 3D Vault Showcase"
          onLoad={(e) => attachIframeGuards(e.currentTarget)}
          className="w-full h-full border-0 block flex-1 min-h-0 bg-black pointer-events-auto"
          loading="eager"
        />
      );
    }
    return (
      <div className="w-full flex-1 min-h-0 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[var(--s1)]">
        <div className="w-full max-w-4xl h-full max-h-[720px] flex flex-col">
          {/* Replaced AcademicDocketPreview, GeopetakPreview, and ExpenseTrackerPreview with live iframes above */}
          {/* Commented out Delta IT Helpdesk preview per user request */}
        </div>
      </div>
    );
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      data-nosnippet="true"
      className="case-modal-protected fixed inset-0 z-[9999] flex flex-col md:items-center md:justify-center p-0 md:p-6 lg:p-8 bg-black/85 backdrop-blur-md animate-fadeIn select-none overflow-hidden"
      onClick={onClose}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full h-full md:h-[92vh] md:max-h-[1020px] md:max-w-[1520px] flex flex-col bg-[var(--modal-bg)] md:border md:border-[var(--wire)] text-[var(--text)] shadow-2xl md:rounded-lg transition-colors outline-none overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Refined Single Header: Confident, Legible, Decluttered ── */}
        <header className="px-4 sm:px-6 py-2.5 sm:py-3.5 border-b border-[var(--wire)] bg-[var(--s1)] shrink-0 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
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
          </div>

          {project.id === 2 && (
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--wire)] flex-wrap">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)] mr-1">
                Diorama:
              </span>
              {[
                { label: "01 Raja Ampat", idx: 0 },
                { label: "02 Ulun Danu", idx: 1 },
                { label: "03 Dusk Orbit", idx: 2 },
              ].map((item) => {
                const isActive = activeStudyIndex === item.idx;
                return (
                  <button
                    key={item.idx}
                    type="button"
                    onClick={() => setActiveStudyIndex(item.idx)}
                    className={`px-3 py-1 font-mono text-xs uppercase tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white font-bold"
                        : "bg-[var(--s2)] hover:bg-[var(--s3)] border-[var(--card-border)] text-[var(--text)]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {/* ── Main Viewport: Scrollable, Interactive, Full-Bleed ── */}
        <main className="relative w-full flex-1 min-h-0 bg-[var(--s1)] overflow-y-auto pointer-events-auto flex flex-col">
          {isAutomatedBot ? (
            <div className="w-full h-full flex items-center justify-center p-8 text-center">
              <div className="max-w-md border border-[var(--wire)] bg-[var(--s2)] p-6 rounded">
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent2-text)] mb-2">
                  Protected Preview
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Automated scraping and headless capture are disabled for this project showcase.
                </p>
              </div>
            </div>
          ) : (
            renderLivePreview(project)
          )}

          {/* Subtle repeating attribution watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed md:absolute inset-0 z-20 opacity-[0.06] overflow-hidden"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='140'%3E%3Ctext x='12' y='78' transform='rotate(-22 130 70)' fill='%23888888' font-family='monospace' font-size='11' letter-spacing='2'%3EARYO %2F%2F PROTECTED%3C/text%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
            }}
          />

          {/* Privacy veil on window blur, tab switch, or PrintScreen */}
          {privacyVeil && (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--modal-bg)]/95 backdrop-blur-xl"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                Preview hidden while inactive
              </p>
            </div>
          )}
        </main>
      </div>
    </div>,
    document.body
  );
}
