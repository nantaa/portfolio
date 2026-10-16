"use client";

import { useEffect } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[800px] max-h-[92vh] overflow-y-auto bg-[#0d0d0d] border border-white/10 p-6 sm:p-10 text-[#eeebe5] shadow-2xl rounded-[3px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-[#7a1525] uppercase">
            <span>Verified Credentials</span>
            <span className="text-white/20">/</span>
            <span className="text-neutral-400">Curriculum Vitae</span>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-neutral-400 hover:text-white transition-colors"
          >
            <span>Close</span>
            <span className="text-[#7a1525] font-bold group-hover:translate-x-0.5 transition-transform">[Esc]</span>
          </button>
        </div>

        {/* Bio Summary */}
        <div className="mb-8">
          <h2 id="resume-modal-title" className="text-2xl sm:text-3xl font-display font-medium tracking-tight mb-2">
            Rifa&apos;i Aryo Ananta
          </h2>
          <p className="font-mono text-[12px] text-neutral-400 mb-4 tracking-wide">
            IT Lead · Fullstack Engineer · Creative Technologist · Systems Architect
          </p>
          <p className="text-[14px] leading-relaxed text-neutral-300 font-sans">
            Operating across software architecture, creative frontend engineering, and reliable infrastructure.
            Proven track record delivering mission-critical enterprise compliance platforms, Awwwards-caliber WebGL motion systems, and algorithmic optimization engines.
          </p>
        </div>

        {/* Verified Experience */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-white/5 pb-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#7a1525] uppercase font-bold">
              PROVEN ENTERPRISE & SYSTEMS EXPERIENCE
            </span>
          </div>

          <div className="space-y-4 font-sans text-[13px]">
            {/* DNP Monitor */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-neutral-100 text-[13px] font-sans">DNP Monitor — Enterprise K3 Compliance Engine</strong>
                <span className="text-[#7a1525]">Lead Fullstack Architect</span>
              </div>
              <p className="text-neutral-400 text-[12px] leading-relaxed mb-2">
                Engineered end-to-end industrial safety certification tracking for PT Delta Nusantara Persada. Architected Disnaker 30-day SLA calculation engines, RBAC document preview systems, daily digest dispatchers, and zero-downtime atomic symlink deployment with 270+ passing automated tests.
              </p>
              <span className="font-mono text-[10px] text-neutral-500">Stack: Laravel 11/13 · PostgreSQL · React 19 Inertia · Tailwind CSS</span>
            </div>

            {/* Delta Helpdesk */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-neutral-100 text-[13px] font-sans">Delta IT Helpdesk & Infrastructure Portal</strong>
                <span className="text-[#7a1525]">Systems & DevOps Engineer</span>
              </div>
              <p className="text-neutral-400 text-[12px] leading-relaxed mb-2">
                Built group-wide ticketing and technical incident resolution infrastructure. Integrated official Meta WhatsApp Cloud API webhooks with Soketi/Pusher websockets to ensure sub-2h SLA response compliance for operational field technicians.
              </p>
              <span className="font-mono text-[10px] text-neutral-500">Stack: Next.js 16 · Laravel 11 · MariaDB · Meta WhatsApp Cloud API · Soketi</span>
            </div>

            {/* Academic Thesis Docket */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-neutral-100 text-[13px] font-sans">Academic Thesis & Defense Optimization Docket</strong>
                <span className="text-[#7a1525]">Systems Architect</span>
              </div>
              <p className="text-neutral-400 text-[12px] leading-relaxed mb-2">
                Designed mathematical optimization center for UPI CS cohort governance: Gale-Shapley bipartite stable advisor matching, Hungarian minimum-cost defense schedule assignment, and Markov chain stage transition analytics.
              </p>
              <span className="font-mono text-[10px] text-neutral-500">Stack: Laravel REST API · MySQL · React 19 / TypeScript · 88 Unit & Integration Tests</span>
            </div>

            {/* Creative Engineering */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1 font-mono text-[11px]">
                <strong className="text-neutral-100 text-[13px] font-sans">Vaultr & TATA$ — Creative Motion & 3D WebGL Showcases</strong>
                <span className="text-[#7a1525]">Creative Frontend Engineer</span>
              </div>
              <p className="text-neutral-400 text-[12px] leading-relaxed mb-2">
                Developed Awwwards-caliber interactive web platforms featuring continuous scroll-scrubbed GSAP ScrollTrigger timelines, 4-layer parallax, and real-time Three.js GLTF WebGL staging with dynamic RoomEnvironment lighting.
              </p>
              <span className="font-mono text-[10px] text-neutral-500">Stack: Vue 3 · Three.js · GSAP ScrollTrigger · Lenis Smooth Scroll</span>
            </div>
          </div>
        </div>

        {/* Core Competencies Matrix */}
        <div className="mb-8">
          <div className="border-b border-white/5 pb-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#7a1525] uppercase font-bold">
              CORE TECHNICAL DISCIPLINES
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <span className="text-neutral-200 block font-bold mb-1">Architecture</span>
              <span className="text-neutral-400 text-[10px]">Clean Architecture, Modular &le; 250 LOC, State Machines</span>
            </div>
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <span className="text-neutral-200 block font-bold mb-1">Backend & DB</span>
              <span className="text-neutral-400 text-[10px]">Laravel, Next.js, Node, PostgreSQL, MySQL, Redis</span>
            </div>
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <span className="text-neutral-200 block font-bold mb-1">Frontend & 3D</span>
              <span className="text-neutral-400 text-[10px]">React 19, Vue 3, Three.js, GSAP, WebGL, Tailwind</span>
            </div>
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-[2px]">
              <span className="text-neutral-200 block font-bold mb-1">DevOps & Quality</span>
              <span className="text-neutral-400 text-[10px]">Docker, Atomic CI/CD, TDD, Playwright, Vitest</span>
            </div>
          </div>
        </div>

        {/* Direct Action Footer */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-3">
            <a
              href="mailto:rifaiaryoananta@email.com"
              className="px-4 py-2 bg-[#7a1525] hover:bg-[#9b1e30] text-white transition-colors rounded-[2px]"
            >
              Direct Email
            </a>
            <a
              href="https://github.com/nantaa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors rounded-[2px]"
            >
              GitHub Profile
            </a>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ← Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
