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
      <section className="hero">
        <div className="hero-strip">
          <div className="hero-strip-left">
            <span className="hero-eyebrow">Portfolio — 2026</span>
            <span className="hero-location">Bekasi, Indonesia</span>
          </div>
          <div className="hero-strip-right">
            Solving problems across<br />
            <em>software, design,</em><br />
            and infrastructure.
          </div>
        </div>

        {/* ── OPTION A: PURE CENTERED MONUMENTAL EDITORIAL ── */}
        <div className="px-6 sm:px-[52px] py-20 sm:py-28 border-b border-[var(--wire)] flex flex-col items-center text-center">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent)] mb-6">
            Option A — Pure Centered Monumental Editorial
          </div>
          <h1 className="hero-name max-w-4xl">
            Rifa&apos;i<em>Aryo Ananta.</em>
          </h1>
          <p className="hero-descriptor max-w-2xl mt-8">
            <strong>Systems Engineer</strong> bridging fullstack architecture, real-time 3D WebGL graphics, and Cloud Infrastructure.
          </p>
          <div className="hero-cta-row flex flex-wrap justify-center gap-3 mt-8">
            <a href="#work" className="hero-btn filled">View work</a>
            <a
              href="/docs/CV-Aryo-Update.pdf"
              download="CV Aryo Update.pdf"
              className="hero-btn cursor-pointer font-mono text-[12px]"
            >
              Curriculum Vitae ↓
            </a>
          </div>
          <div className="scroll-hint mt-12">Scroll to explore</div>
        </div>

        {/* ── OPTION B: ASYMMETRIC SPLIT + QUIET GEOMETRIC WIREFRAME ── */}
        <div className="px-6 sm:px-[52px] py-20 sm:py-24 border-b border-[var(--wire)] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent)]">
              Option B — Asymmetric Split + Quiet Geometric Wireframe
            </div>
            <div className="hero-name">
              Rifa&apos;i<em>Aryo Ananta.</em>
            </div>
            <p className="hero-descriptor max-w-xl">
              <strong>Systems Engineer</strong> bridging fullstack architecture, real-time 3D WebGL graphics, and Cloud Infrastructure.
            </p>
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
            <svg
              viewBox="0 0 320 320"
              className="w-64 h-64 sm:w-80 sm:h-80 text-[var(--accent)] opacity-80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              aria-hidden="true"
            >
              <circle cx="160" cy="160" r="130" strokeDasharray="3 5" />
              <circle cx="160" cy="160" r="92" strokeOpacity="0.45" />
              <polygon points="160,30 272,95 272,225 160,290 48,225 48,95" />
              <polygon points="160,30 272,225 48,225" strokeOpacity="0.6" />
              <polygon points="160,290 272,95 48,95" strokeOpacity="0.4" />
              <line x1="160" y1="30" x2="160" y2="290" strokeOpacity="0.35" />
              <line x1="48" y1="95" x2="272" y2="225" strokeOpacity="0.35" />
              <line x1="272" y1="95" x2="48" y2="225" strokeOpacity="0.35" />
              <circle cx="160" cy="160" r="4" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* ── OPTION C: EDITORIAL SPLIT + AUTHOR PORTRAIT ── */}
        <div className="px-6 sm:px-[52px] py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent)]">
              Option C — Editorial Split + Author Portrait
            </div>
            <div className="hero-name">
              Rifa&apos;i<em>Aryo Ananta.</em>
            </div>
            <p className="hero-descriptor max-w-xl">
              <strong>Systems Engineer</strong> bridging fullstack architecture, real-time 3D WebGL graphics, and Cloud Infrastructure.
            </p>
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
            <div className="w-full max-w-[360px] aspect-[4/5] overflow-hidden border border-[var(--wire)] bg-[var(--s1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aryo.png"
                alt="Rifa'i Aryo Ananta"
                className="w-full h-full object-cover grayscale contrast-105"
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
