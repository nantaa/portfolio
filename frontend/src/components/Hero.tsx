"use client";

import { useState, useEffect } from "react";
import ResumeModal from "@/components/ResumeModal";
import HeroExecutiveSpecimen from "@/components/HeroExecutiveSpecimen";

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsResumeOpen(true);
    window.addEventListener("open-resume-modal", handleOpen);
    return () => window.removeEventListener("open-resume-modal", handleOpen);
  }, []);

  const copyEmail = () => {
    try {
      navigator.clipboard.writeText("rifai.aryo@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <>
      <section className="hero">
        <div className="hero-strip">
          <div className="hero-strip-left">
            <span className="hero-eyebrow">Portfolio — 2026</span>
            <span className="hero-location">Bekasi, Indonesia</span>
            <span className="font-mono text-[10px] text-[var(--accent)] font-bold tracking-wider uppercase ml-2 px-2 py-0.5 bg-[var(--wire)] rounded-[2px]">
              Available for Full-time &amp; Contract · Remote
            </span>
          </div>
          <div className="hero-strip-right">
            Solving problems across<br />
            <em>software, design,</em><br />
            and infrastructure.
          </div>
        </div>

        <div className="hero-body">
          <div className="hero-left">
            <h1 className="hero-name">
              Rifa&apos;i<em>Aryo Ananta.</em>
            </h1>
            <div className="hero-bottom">
              <div className="hero-descriptor">
                <strong>Systems Engineer</strong>&nbsp;·&nbsp;Multidisciplinary Technologist<br />
                Bridging fullstack architecture, real-time 3D WebGL graphics,<br />
                and mission-critical cloud infrastructure.
              </div>
              <div className="hero-cta-row flex flex-wrap gap-2.5">
                <a href="#work" className="hero-btn filled">View work</a>
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="hero-btn cursor-pointer font-mono text-[12px]"
                >
                  CV / Résumé Credentials
                </button>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="hero-btn cursor-pointer font-mono text-[12px] bg-[var(--s2)] text-[var(--text)] hover:border-[var(--accent)]"
                  title="Copy direct email address to clipboard"
                >
                  {copied ? "Copied! ✓" : "Copy Email"}
                </button>
              </div>
              <div className="scroll-hint">Scroll to explore</div>
            </div>
          </div>

          <div className="hero-right">
            <HeroExecutiveSpecimen />
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
