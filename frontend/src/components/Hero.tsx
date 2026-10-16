"use client";

import { useState } from "react";
import ResumeModal from "@/components/ResumeModal";
import HeroTelemetryHUD from "@/components/HeroTelemetryHUD";

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

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
            <div className="hero-name">
              Rifa&apos;i<em>Aryo Ananta.</em>
            </div>
            <div className="hero-bottom">
              <div className="hero-descriptor">
                <strong>IT Lead</strong>&nbsp;·&nbsp;Fullstack Developer&nbsp;·&nbsp;IT Support<br />
                Systems Architect&nbsp;·&nbsp;DevOps Engineer&nbsp;·&nbsp;Creative Frontend<br />
                Network Infrastructure&nbsp;·&nbsp;3D WebGL&nbsp;·&nbsp;Multimedia
              </div>
              <div className="hero-cta-row">
                <a href="#work" className="hero-btn filled">View work</a>
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="hero-btn cursor-pointer font-mono text-[12px]"
                >
                  Download CV / Résumé
                </button>
              </div>
              <div className="scroll-hint">Scroll to explore</div>
            </div>
          </div>

          <div className="hero-right">
            <HeroTelemetryHUD />
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
