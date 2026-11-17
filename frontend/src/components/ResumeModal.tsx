"use client";

import { useEffect, useRef } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Capture triggering element before modal takes focus
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
          // Shift + Tab: moving backwards
          if (document.activeElement === firstElement || !modalContainerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: moving forwards
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

      // Restore focus back to the triggering element
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div
        ref={modalContainerRef}
        tabIndex={-1}
        className="relative w-full max-w-[800px] max-h-[92vh] overflow-y-auto bg-[var(--modal-bg)] border border-[var(--card-border)] p-6 sm:p-10 text-[var(--text)] shadow-2xl rounded-[3px] transition-colors outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--wire)]">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-[var(--accent2-text)] uppercase font-bold">
            <span>Verified Credentials</span>
            <span className="opacity-30">/</span>
            <span className="text-[var(--muted)] font-normal">Curriculum Vitae</span>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Close credentials modal"
          >
            <span>Close</span>
            <span className="text-[var(--accent2-text)] font-bold group-hover:translate-x-0.5 transition-transform">[Esc]</span>
          </button>
        </div>

        {/* Bio Summary */}
        <div className="mb-8">
          <h2 id="resume-modal-title" className="text-2xl sm:text-3xl font-display font-medium tracking-tight mb-2 text-[var(--text)]">
            Rifa&apos;i Aryo Ananta
          </h2>
          <p className="font-mono text-[12px] text-[var(--muted)] mb-4 tracking-wide">
            IT Lead · Fullstack Engineer · Creative Technologist · Systems Architect
          </p>
          <p className="text-[14px] leading-relaxed text-[var(--text)] opacity-90 font-sans">
            Operating across software architecture, creative frontend engineering, and reliable infrastructure.
            Proven track record delivering mission-critical enterprise compliance platforms, Awwwards-caliber WebGL motion systems, and algorithmic optimization engines.
          </p>
        </div>

        {/* Verified Experience */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-[var(--wire)] pb-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent2-text)] uppercase font-bold">
              PROVEN ENTERPRISE &amp; SYSTEMS EXPERIENCE
            </span>
          </div>

          <div className="space-y-4 font-sans text-[13px]">
            {/* DNP Monitor */}
            <div className="p-3.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-[var(--text)] text-[13px] font-sans">DNP Monitor — Enterprise K3 Compliance Engine</strong>
                <span className="text-[var(--accent2-text)] font-bold">Lead Fullstack Architect</span>
              </div>
              <p className="text-[var(--muted)] text-[12px] leading-relaxed mb-2">
                Engineered end-to-end industrial safety certification tracking for PT Delta Nusantara Persada. Architected Disnaker 30-day SLA calculation engines, RBAC document preview systems, daily digest dispatchers, and zero-downtime atomic symlink deployment with 270+ passing automated tests.
              </p>
              <span className="font-mono text-[10px] text-[var(--muted)] opacity-80">Stack: Laravel 11/13 · PostgreSQL · React 19 Inertia · Tailwind CSS</span>
            </div>

            {/* Delta Helpdesk */}
            <div className="p-3.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-[var(--text)] text-[13px] font-sans">Delta IT Helpdesk &amp; Infrastructure Portal</strong>
                <span className="text-[var(--accent2-text)] font-bold">Systems &amp; DevOps Engineer</span>
              </div>
              <p className="text-[var(--muted)] text-[12px] leading-relaxed mb-2">
                Built group-wide ticketing and technical incident resolution infrastructure. Integrated official Meta WhatsApp Cloud API webhooks with Soketi/Pusher websockets to ensure sub-2h SLA response compliance for operational field technicians.
              </p>
              <span className="font-mono text-[10px] text-[var(--muted)] opacity-80">Stack: Next.js 16 · Laravel 11 · MariaDB · Meta WhatsApp Cloud API · Soketi</span>
            </div>

            {/* Academic Thesis Docket */}
            <div className="p-3.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-[var(--text)] text-[13px] font-sans">Academic Thesis &amp; Defense Optimization Docket</strong>
                <span className="text-[var(--accent2-text)] font-bold">Systems Architect</span>
              </div>
              <p className="text-[var(--muted)] text-[12px] leading-relaxed mb-2">
                Designed mathematical optimization center for UPI CS cohort governance: Gale-Shapley bipartite stable advisor matching, Hungarian minimum-cost defense schedule assignment, and Markov chain stage transition analytics.
              </p>
              <span className="font-mono text-[10px] text-[var(--muted)] opacity-80">Stack: Laravel REST API · MySQL · React 19 / TypeScript · 88 Unit &amp; Integration Tests</span>
            </div>

            {/* Creative Engineering */}
            <div className="p-3.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-[var(--text)] text-[13px] font-sans">Vaultr &amp; TATA$ — Creative Motion &amp; 3D WebGL Showcases</strong>
                <span className="text-[var(--accent2-text)] font-bold">Creative Frontend Engineer</span>
              </div>
              <p className="text-[var(--muted)] text-[12px] leading-relaxed mb-2">
                Developed Awwwards-caliber interactive web platforms featuring continuous scroll-scrubbed GSAP ScrollTrigger timelines, 4-layer parallax, and real-time Three.js GLTF WebGL staging with dynamic RoomEnvironment lighting.
              </p>
              <span className="font-mono text-[10px] text-[var(--muted)] opacity-80">Stack: Vue 3 · Three.js · GSAP ScrollTrigger · Lenis Smooth Scroll</span>
            </div>
          </div>
        </div>

        {/* Core Competencies Matrix */}
        <div className="mb-8">
          <div className="border-b border-[var(--wire)] pb-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent2-text)] uppercase font-bold">
              CORE TECHNICAL DISCIPLINES
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
            <div className="p-2.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <span className="text-[var(--text)] block font-bold mb-1">Architecture</span>
              <span className="text-[var(--muted)] text-[10px]">Clean Architecture, Modular &le; 250 LOC, State Machines</span>
            </div>
            <div className="p-2.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <span className="text-[var(--text)] block font-bold mb-1">Backend &amp; DB</span>
              <span className="text-[var(--muted)] text-[10px]">Laravel, Next.js, Node, PostgreSQL, MySQL, Redis</span>
            </div>
            <div className="p-2.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <span className="text-[var(--text)] block font-bold mb-1">Frontend &amp; 3D</span>
              <span className="text-[var(--muted)] text-[10px]">React 19, Vue 3, Three.js, GSAP, WebGL, Tailwind</span>
            </div>
            <div className="p-2.5 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px]">
              <span className="text-[var(--text)] block font-bold mb-1">DevOps &amp; Quality</span>
              <span className="text-[var(--muted)] text-[10px]">Docker, Atomic CI/CD, TDD, Playwright, Vitest</span>
            </div>
          </div>
        </div>

        {/* Direct Action Footer */}
        <div className="pt-6 border-t border-[var(--wire)] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-3">
            <a
              href="mailto:rifai.aryo@gmail.com"
              className="px-4 py-2 bg-[#7a1525] hover:bg-[#9b1e30] text-white transition-colors rounded-[2px] shadow-sm cursor-pointer"
            >
              Direct Email
            </a>
            <a
              href="https://github.com/nantaa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--s2)] hover:bg-[var(--s3)] text-[var(--text)] border border-[var(--wire)] transition-colors rounded-[2px] cursor-pointer"
            >
              GitHub Profile
            </a>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            ← Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
