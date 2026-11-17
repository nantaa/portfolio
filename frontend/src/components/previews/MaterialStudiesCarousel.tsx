"use client";

import { useEffect, useRef, useState } from "react";

// ─── Dual 3D Material Studies Live Runtime ──────────────────────────────────
// Showcases Indonesian Architectural & Marine Procedural Dioramas:
// 1. Raja Ampat Snorkel Day (Papua)
// 2. Pura Ulun Danu Bratan (Bali)

interface StudyItem {
  id: string;
  name: string;
  location: string;
  embedSrc: string;
  fullSrc: string;
  accent: string;
}

const STUDIES: StudyItem[] = [
  {
    id: "raja-ampat",
    name: "Raja Ampat Snorkel Day",
    location: "Papua Archipelago",
    embedSrc: "/raja_ampat_snorkel_day.html?ui=0&compact=1&brand=0&mood=1&quality=low",
    fullSrc: "/raja_ampat_snorkel_day.html",
    accent: "#0ea5e9",
  },
  {
    id: "ulun-danu",
    name: "Pura Ulun Danu Bratan",
    location: "Bedugul, Bali",
    embedSrc: "/ulun_danu_lake_bratan_material_studies.html?ui=0&compact=1&brand=0&mood=1&quality=low",
    fullSrc: "/ulun_danu_lake_bratan_material_studies.html",
    accent: "#9b1e30",
  },
];

export default function MaterialStudiesCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentStudy = STUDIES[activeSlide];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-neutral-950 select-none flex flex-col"
    >
      {/* ── Floating Minimal Diorama Switcher (Zero AI Slop) ── */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 shadow-lg pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mr-1">
          Diorama:
        </span>
        {STUDIES.map((study, idx) => {
          const isActive = activeSlide === idx;
          return (
            <button
              key={study.id}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              0{idx + 1} {study.id === "ulun-danu" ? "Ulun Danu" : "Raja Ampat"}
            </button>
          );
        })}
        <a
          href={currentStudy.fullSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 font-mono text-[10px] text-sky-400 hover:text-sky-300 underline"
        >
          Open Full 3D Study ↗
        </a>
      </div>

      {/* ── Full-Bleed 3D WebGL Canvas ── */}
      <div className="relative w-full flex-1 bg-neutral-950">
        {isInView ? (
          <iframe
            key={currentStudy.id}
            src={currentStudy.embedSrc}
            title={currentStudy.name}
            className="w-full h-full border-0 pointer-events-auto bg-neutral-950"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-neutral-950 flex items-center justify-center text-neutral-500 font-mono text-xs">
            WebGL Context Dormant
          </div>
        )}
      </div>
    </div>
  );
}
