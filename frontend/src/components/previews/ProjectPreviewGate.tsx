"use client";

import { useState, ReactNode } from "react";

interface ProjectPreviewGateProps {
  title: string;
  category: string;
  specs: string;
  description: string;
  actionLabel?: string;
  actionSubtext?: string;
  badge?: string;
  accentColor?: string;
  accentSoft?: string;
  backdropPattern?: ReactNode;
  children: ReactNode;
}

export default function ProjectPreviewGate({
  title,
  category,
  specs,
  description,
  actionLabel = "▶ Launch Interactive Demo",
  actionSubtext = "Click to mount live interactive runtime (saves client GPU)",
  badge = "STANDBY · ON DEMAND",
  accentColor = "#ba6617",
  accentSoft = "rgba(186, 102, 23, 0.15)",
  backdropPattern,
  children,
}: ProjectPreviewGateProps) {
  const [isActivated, setIsActivated] = useState(false);

  if (isActivated) {
    return (
      <div className="relative w-full h-full">
        {children}
        {/* Standby toggle in top corner to release memory if desired */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsActivated(false);
          }}
          title="Return to Standby"
          className="absolute top-2.5 right-2.5 z-30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider bg-black/85 hover:bg-black text-neutral-400 hover:text-neutral-200 border border-white/10 rounded transition-all backdrop-blur-md cursor-pointer pointer-events-auto"
        >
          Standby ↺
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${accentSoft} 0%, #07090b 75%)`,
      }}
    >
      {/* Background Watermark/Pattern if provided */}
      {backdropPattern && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          {backdropPattern}
        </div>
      )}

      {/* Standby Architectural Briefing */}
      <div className="relative z-10 max-w-[360px] flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded border font-semibold"
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              background: `${accentColor}15`,
            }}
          >
            {category}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">
            {badge}
          </span>
        </div>

        <h4 className="font-serif text-xl sm:text-2xl text-neutral-100 font-normal tracking-wide">
          {title}
        </h4>

        <p className="font-sans text-[13px] text-neutral-300 leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="font-mono text-[11px] text-neutral-400">
          {specs}
        </div>

        {/* Tactile Activation Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsActivated(true);
          }}
          className="mt-2 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white font-semibold rounded transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/80 hover:scale-[1.03] active:scale-[0.98] border cursor-pointer pointer-events-auto"
          style={{
            backgroundColor: accentColor,
            borderColor: `${accentColor}90`,
          }}
        >
          <span>{actionLabel}</span>
        </button>

        <span className="font-mono text-[10px] text-neutral-500 tracking-tight">
          {actionSubtext}
        </span>
      </div>
    </div>
  );
}
