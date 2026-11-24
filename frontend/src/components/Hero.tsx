"use client";

import { useState, useEffect } from "react";
import ResumeModal from "@/components/ResumeModal";

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsResumeOpen(true);
    window.addEventListener("open-resume-modal", handleOpen);
    return () => window.removeEventListener("open-resume-modal", handleOpen);
  }, []);

  return (
    <>
      {/* ── PLAN A: Pure Centered Monumental Editorial (rauno.me / paco.me) ── */}
      <section className="hero relative" aria-label="Plan A Hero">
        <div className="hero-strip">
          <div className="hero-strip-left">
            <span className="hero-eyebrow">PLAN A — PURE CENTERED EDITORIAL</span>
            <span className="hero-location">Portfolio — 2026 · Bekasi, Indonesia</span>
          </div>
          <div className="hero-strip-right">
            Solving problems across<br />
            <em>software, design,</em><br />
            and infrastructure.
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 text-center flex flex-col items-center justify-center min-h-[72vh]">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)] mb-6">
            Systems Engineer · Multidisciplinary Technologist
          </span>
          <h1 className="hero-name text-center mb-8">
            Rifa&apos;i<em>Aryo Ananta.</em>
          </h1>
          <p className="font-mono text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed mb-10">
            Bridging fullstack architecture, real-time 3D WebGL graphics, and mission-critical cloud infrastructure.
          </p>
          <div className="hero-cta-row flex flex-wrap justify-center gap-3">
            <a href="#work" className="hero-btn filled">View work</a>
            <a
              href="/docs/CV-Aryo-Update.pdf"
              download="CV Aryo Update.pdf"
              className="hero-btn cursor-pointer font-mono text-[12px]"
            >
              Curriculum Vitae ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── PLAN B: Asymmetric Split + Quiet Geometric Wireframe (linear.app / Active Theory) ── */}
      <section className="border-b border-[var(--wire)]" aria-label="Plan B Hero">
        <div className="hero-strip">
          <div className="hero-strip-left">
            <span className="hero-eyebrow">PLAN B — ASYMMETRIC + GEOMETRIC WIREFRAME</span>
            <span className="hero-location">Portfolio 2026 · Bekasi, Indonesia</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-[52px] py-20 lg:py-28 gap-12 min-h-[72vh]">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h2 className="hero-name">
              Rifa&apos;i<em>Aryo Ananta.</em>
            </h2>
            <div className="hero-descriptor max-w-xl">
              <strong>Systems Engineer</strong>&nbsp;·&nbsp;Multidisciplinary Technologist<br />
              Bridging fullstack architecture, real-time 3D WebGL graphics,<br />
              and mission-critical cloud infrastructure.
            </div>
            <div className="hero-cta-row flex flex-wrap gap-3">
              <a href="#work" className="hero-btn filled">View work</a>
              <a
                href="/docs/CV-Aryo-Update.pdf"
                download="CV Aryo Update.pdf"
                className="hero-btn cursor-pointer font-mono text-[12px]"
              >
                Curriculum Vitae ↓
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            {/* Quiet Borderless Architectural Polyhedron SVG */}
            <svg
              viewBox="0 0 360 360"
              className="w-full max-w-[340px] h-auto opacity-85"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="180" cy="180" r="140" stroke="var(--wire)" strokeWidth="0.75" strokeDasharray="4 4" />
              <circle cx="180" cy="180" r="98" stroke="var(--wire)" strokeWidth="0.75" />
              <polygon points="180,32 308,106 308,254 180,328 52,254 52,106" stroke="var(--accent)" strokeWidth="1" />
              <polygon points="180,72 274,126 274,234 180,288 86,234 86,126" stroke="var(--muted)" strokeWidth="0.6" />
              <line x1="180" y1="32" x2="180" y2="328" stroke="var(--wire)" strokeWidth="0.75" />
              <line x1="52" y1="106" x2="308" y2="254" stroke="var(--wire)" strokeWidth="0.75" />
              <line x1="308" y1="106" x2="52" y2="254" stroke="var(--wire)" strokeWidth="0.75" />
              <circle cx="180" cy="180" r="4" fill="var(--accent)" />
              <circle cx="180" cy="32" r="2.5" fill="var(--text)" />
              <circle cx="308" cy="106" r="2.5" fill="var(--text)" />
              <circle cx="308" cy="254" r="2.5" fill="var(--text)" />
              <circle cx="180" cy="328" r="2.5" fill="var(--text)" />
              <circle cx="52" cy="254" r="2.5" fill="var(--text)" />
              <circle cx="52" cy="106" r="2.5" fill="var(--text)" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── PLAN C: Editorial Split + Author Portrait (Pentagram / Studio Freight) ── */}
      <section className="border-b border-[var(--wire)]" aria-label="Plan C Hero">
        <div className="hero-strip">
          <div className="hero-strip-left">
            <span className="hero-eyebrow">PLAN C — EDITORIAL SPLIT + AUTHOR PORTRAIT</span>
            <span className="hero-location">Portfolio 2026 · Bekasi, Indonesia</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-[52px] py-20 lg:py-28 gap-12 min-h-[72vh]">
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h2 className="hero-name">
              Rifa&apos;i<em>Aryo Ananta.</em>
            </h2>
            <div className="hero-descriptor max-w-xl">
              <strong>Systems Engineer</strong>&nbsp;·&nbsp;Multidisciplinary Technologist<br />
              Bridging fullstack architecture, real-time 3D WebGL graphics,<br />
              and mission-critical cloud infrastructure.
            </div>
            <div className="hero-cta-row flex flex-wrap gap-3">
              <a href="#work" className="hero-btn filled">View work</a>
              <a
                href="/docs/CV-Aryo-Update.pdf"
                download="CV Aryo Update.pdf"
                className="hero-btn cursor-pointer font-mono text-[12px]"
              >
                Curriculum Vitae ↓
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[360px] aspect-[4/5] border border-[var(--wire)] overflow-hidden bg-[var(--s1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aryo.png"
                alt="Rifa'i Aryo Ananta"
                className="w-full h-full object-cover grayscale contrast-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Résumé Credentials Drawer */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  );
}
