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

export const MATERIAL_STUDIES: StudyItem[] = [
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

interface MaterialStudiesCarouselProps {
  activeSlide?: number;
}

export default function MaterialStudiesCarousel({ activeSlide = 0 }: MaterialStudiesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

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

  const currentStudy = MATERIAL_STUDIES[activeSlide] || MATERIAL_STUDIES[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-neutral-950 select-none flex flex-col"
    >
      {/* ── Full-Bleed 3D WebGL Canvas (Header handles diorama switching) ── */}
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
