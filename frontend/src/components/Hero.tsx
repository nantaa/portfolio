"use client";

import { useState, useEffect } from "react";
import ResumeModal from "@/components/ResumeModal";
import HeroWireframeCanvas from "@/components/HeroWireframeCanvas";

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
                <a
                  href="/docs/CV-Aryo-Update.pdf"
                  download="CV Aryo Update.pdf"
                  className="hero-btn cursor-pointer font-mono text-[12px]"
                >
                  Curriculum Vitae ↓
                </a>
              </div>
              <div className="scroll-hint">Scroll to explore</div>
            </div>
          </div>

          <div className="hero-right">
            <HeroWireframeCanvas />
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
