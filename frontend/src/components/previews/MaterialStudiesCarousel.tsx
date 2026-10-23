"use client";

import { useEffect, useRef, useState } from "react";

// ─── Dual 3D Material Studies Carousel ──────────────────────────────────────
// Showcases Indonesian Architectural & Marine Procedural Dioramas:
// 1. Pura Ulun Danu Bratan (Bali)
// 2. Raja Ampat Snorkel Day (Papua)
//
// Performance & GPU Safeguards:
// - IntersectionObserver gating: Pauses when outside viewport.
// - On-demand click-to-load: Client only instantiates WebGL iframe on user intent.
// - Single WebGL Context Lifecycle: Unmounts inactive slide iframe on slide switch,
//   preventing multiple concurrent WebGL contexts from exhausting browser limits.
// - Uses lightweight embed query params: ?ui=0&compact=1&quality=low&theme=noir

interface StudyItem {
  id: string;
  name: string;
  location: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  embedSrc: string;
  fullSrc: string;
  techSpecs: string;
  description: string;
}

const STUDIES: StudyItem[] = [
  {
    id: "raja-ampat",
    name: "Raja Ampat Snorkel Day",
    location: "PAPUA · ARCHIPELAGO",
    tagline: "Coral Reefs, Caustic Refraction & Marine Loop",
    accent: "#0ea5e9",
    accentSoft: "rgba(14, 165, 233, 0.18)",
    embedSrc: "/raja_ampat_snorkel_day.html?ui=0&compact=1&quality=low&theme=noir",
    fullSrc: "/raja_ampat_snorkel_day.html",
    techSpecs: "Three.js · GLSL Caustic Shaders · Organic Coral SDF",
    description: "Algorithmic coral colonies, procedural sea fans, and deterministic underwater snorkel pathing over limestone karsts.",
  },
  {
    id: "ulun-danu",
    name: "Pura Ulun Danu Bratan",
    location: "BALI · 1,239M ASL",
    tagline: "Sacred Meru Architecture & Volcanic Mist",
    accent: "#9b1e30",
    accentSoft: "rgba(155, 30, 48, 0.18)",
    embedSrc: "/ulun_danu_lake_bratan_material_studies.html?ui=0&compact=1&quality=low&theme=noir",
    fullSrc: "/ulun_danu_lake_bratan_material_studies.html",
    techSpecs: "Three.js · Procedural Tumpang Meru · GLSL Lake & Fog",
    description: "11-tier sacred Meru temple modeled parametrically in code with real-time wave displacement and twilight moods.",
  },
];

export default function MaterialStudiesCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentStudy = STUDIES[activeSlide];
  const isCurrentLoaded = !!loadedSlides[activeSlide];

  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadedSlides((prev) => ({ ...prev, [activeSlide]: true }));
  };

  const handleSlideSelect = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(index);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % STUDIES.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + STUDIES.length) % STUDIES.length);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[var(--s2)] flex flex-col justify-between select-none"
    >
      {/* ── 3D Viewport / Lazy Canvas Area ── */}
      <div className="absolute inset-0 z-0">
        {isInView && isCurrentLoaded ? (
          <iframe
            key={currentStudy.id}
            src={currentStudy.embedSrc}
            title={currentStudy.name}
            className="w-full h-full border-0 pointer-events-auto"
            loading="lazy"
          />
        ) : (
          /* High-Contrast Click-to-Load Poster Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 bg-[var(--s2)]">
            <div className="max-w-[340px] flex flex-col items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded border"
                style={{
                  color: currentStudy.accent,
                  borderColor: `${currentStudy.accent}40`,
                  background: `${currentStudy.accent}12`,
                }}
              >
                {currentStudy.location}
              </span>

              {/* On-Demand Click Trigger */}
              <button
                type="button"
                onClick={handleActivate}
                className="mt-3 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white font-semibold rounded transition-all duration-200 flex items-center gap-2 shadow-md hover:scale-[1.03] active:scale-[0.98] border cursor-pointer pointer-events-auto"
                style={{
                  backgroundColor: currentStudy.accent,
                  borderColor: `${currentStudy.accent}80`,
                }}
              >
                <span>▶ Load Interactive 3D</span>
                <span className="text-[10px] opacity-75 font-normal">(WebGL)</span>
              </button>

              <span className="font-mono text-[10px] text-[var(--muted)] tracking-tight">
                Click to mount 60fps WebGL canvas (saves client GPU)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Top Header Bar & Carousel Switcher Pills ── */}
      <div className="relative z-20 flex items-center justify-between p-2.5 pointer-events-auto bg-[var(--nav-bg)] border-b border-[var(--wire)] backdrop-blur-md">
        {/* Cultural Tag */}
        <div className="flex flex-col gap-0.5 pointer-events-none">
          <span
            className="font-mono text-[9px] tracking-[0.2em] font-bold uppercase transition-colors duration-300"
            style={{ color: currentStudy.accent }}
          >
            {currentStudy.location}
          </span>
          <span className="font-serif text-sm text-[var(--text)] tracking-wide font-normal">
            {currentStudy.name}
          </span>
        </div>

        {/* Carousel Slide Switcher Pills */}
        <div className="flex items-center gap-1 bg-[var(--s1)] border border-[var(--wire)] rounded p-1 backdrop-blur-md shadow-sm">
          {STUDIES.map((study, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={study.id}
                type="button"
                onClick={(e) => handleSlideSelect(idx, e)}
                className={`px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ${
                  isActive
                    ? "bg-[var(--accent)] text-white font-bold shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--s3)]"
                }`}
                style={
                  isActive
                    ? {
                        borderLeft: `2px solid ${study.accent}`,
                      }
                    : {}
                }
              >
                0{idx + 1} {study.id === "ulun-danu" ? "Bratan" : "Raja Ampat"}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Controls & External Link ── */}
      <div className="relative z-20 flex items-center justify-between p-2 pointer-events-auto bg-[var(--nav-bg)] border-t border-[var(--wire)] backdrop-blur-md">
        {/* Prev / Next Slide Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Study"
            className="w-7 h-7 flex items-center justify-center bg-[var(--s1)] hover:bg-[var(--s3)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--wire)] rounded text-xs font-mono transition-all cursor-pointer"
          >
            ←
          </button>
          <span className="font-mono text-[11px] text-[var(--muted)] px-1">
            0{activeSlide + 1} / 0{STUDIES.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Study"
            className="w-7 h-7 flex items-center justify-center bg-[var(--s1)] hover:bg-[var(--s3)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--wire)] rounded text-xs font-mono transition-all cursor-pointer"
          >
            →
          </button>
        </div>

        {/* Live Status & Launch Fullscreen */}
        <div className="flex items-center gap-2">
          {isCurrentLoaded ? (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[var(--s1)] border border-emerald-500/30 rounded backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-wider">
                Live 3D Active
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-[var(--s1)] border border-[var(--wire)] rounded backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider">
                Standby (Click to Load)
              </span>
            </div>
          )}

          <a
            href={currentStudy.fullSrc}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-white border rounded transition-all flex items-center gap-1.5 shadow-md hover:scale-[1.02]"
            style={{
              backgroundColor: `${currentStudy.accent}cc`,
              borderColor: `${currentStudy.accent}80`,
            }}
          >
            <span>Open Full 3D Study</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
