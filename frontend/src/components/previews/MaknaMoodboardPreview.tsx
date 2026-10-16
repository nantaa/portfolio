"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function MaknaMoodboardPreview() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    if (!isDetailOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDetailOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isDetailOpen]);

  return (
    <>
      {/* ── Grid Card Interactive Thumbnail ── */}
      <div
        className="relative w-full h-full overflow-hidden bg-[#0a0a0a] group cursor-pointer select-none"
        onClick={(e) => {
          e.stopPropagation();
          setIsDetailOpen(true);
        }}
        role="button"
        tabIndex={0}
        aria-label="View Makna Works branding moodboard details"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsDetailOpen(true);
          }
        }}
      >
        {/* Background Moodboard Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/makna_works_branding_moodboard.webp"
          alt="Makna Works Branding & Visual Identity Moodboard"
          className="w-full h-full object-cover object-center filter grayscale-[30%] brightness-[0.82] contrast-[1.08] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Top-Right Badge */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/10 rounded-[2px] font-mono text-[9px] text-neutral-300 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9B1E30] animate-pulse"></span>
          <span>Brand Guidelines</span>
        </div>

        {/* Center Hover Prompt */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-[2px] font-mono text-[11px] text-white tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-2xl">
            <span className="text-[#9B1E30]">🔍</span>
            <span>View Brand Guidelines</span>
          </div>
        </div>

        {/* Bottom Hint Bar */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between font-mono text-[10px] text-neutral-400 pointer-events-none">
          <span className="tracking-wider">MAKNA WORKS</span>
          <span className="text-neutral-500">Brand Guidelines &amp; Design System</span>
        </div>
      </div>

      {/* ── Detail Pop-Up Modal (Lightbox) via Portal ── */}
      {mounted &&
        isDetailOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="moodboard-modal-title"
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/90 backdrop-blur-lg animate-fadeIn select-text"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailOpen(false);
            }}
          >
            <div
              className="relative w-full max-w-[1180px] max-h-[94vh] flex flex-col bg-[#0b0c0d] border border-white/15 rounded-[3px] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-[#0e0f10]">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#7a1525] text-white font-mono text-[9px] font-bold tracking-widest uppercase rounded-[2px]">
                    ARCH-08
                  </span>
                  <div>
                    <h3
                      id="moodboard-modal-title"
                      className="font-serif text-lg sm:text-xl text-white font-medium tracking-tight"
                    >
                      Makna Works — Brand Guidelines &amp; Visual Identity System
                    </h3>
                    <p className="font-mono text-[10px] sm:text-[11px] text-neutral-400">
                      Brand Architecture · Logo Geometry · Color Tokens · Typographic Scale · 2025
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailOpen(false);
                  }}
                  className="group flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white font-mono text-[11px] tracking-wider uppercase transition-all rounded-[2px] cursor-pointer"
                  aria-label="Close moodboard popup"
                >
                  <span>Close</span>
                  <span className="text-[#9B1E30] font-bold">[Esc]</span>
                </button>
              </div>

              {/* Modal Main Image Container */}
              <div
                className="relative flex-1 overflow-auto bg-[#070707] flex items-center justify-center p-4 sm:p-6 min-h-[320px] select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="relative max-w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-[2px] border border-white/10 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/makna_works_branding_moodboard.webp"
                    alt="Makna Works Branding & Visual Identity Moodboard — High Resolution Full Inspection"
                    className="max-w-full max-h-[70vh] object-contain transition-transform pointer-events-none select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* ── Anti-Theft Watermark Overlay ── */}
                  <div
                    className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center opacity-30"
                    aria-hidden="true"
                  >
                    <div className="w-[200%] h-[200%] rotate-[-22deg] flex flex-wrap content-center justify-around gap-y-14 gap-x-16 font-mono text-[11px] sm:text-[13px] font-bold tracking-[0.22em] text-white/45 uppercase">
                      {Array.from({ length: 32 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                          <span className="text-[#9B1E30]">©</span>
                          <span>RIFA&apos;I ARYO ANANTA</span>
                          <span className="text-white/30">·</span>
                          <span>MAKNA WORKS</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Corner Provenance Security Stamp */}
                  <div className="absolute bottom-3 right-3 z-20 pointer-events-none select-none px-3 py-1.5 bg-black/85 backdrop-blur-md border border-white/20 rounded-[2px] font-mono text-[9px] sm:text-[10px] text-white/90 shadow-2xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B1E30] animate-pulse"></span>
                    <span>WATERMARK PROTECTED // RIFA&apos;I ARYO ANANTA · 2025</span>
                  </div>
                </div>
              </div>

              {/* Modal Dossier Footer */}
              <div className="px-5 sm:px-7 py-4 bg-[#0e0f10] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10.5px]">
                <div className="flex flex-wrap items-center gap-4 text-neutral-400">
                  <span>
                    <strong className="text-white">Deliverable:</strong> Brand Guidelines &amp; Identity System
                  </span>
                  <span className="text-white/20">|</span>
                  <span>
                    <strong className="text-white">Specs:</strong> Logo Geometry, Color Tokens, Typographic Grid
                  </span>
                  <span className="text-white/20">|</span>
                  <span>
                    <strong className="text-white">Entity:</strong> Makna Works Creative Agency
                  </span>
                </div>

                <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px]">
                  <span className="text-[#9B1E30]">🔒</span>
                  <span>Protected Brand Asset · All Rights Reserved</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
