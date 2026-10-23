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
          className="absolute top-2.5 right-2.5 z-30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider bg-[var(--nav-bg)] hover:bg-[var(--s2)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--wire)] rounded transition-all backdrop-blur-md cursor-pointer pointer-events-auto"
        >
          Standby ↺
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none bg-[var(--s2)]">
      {/* Background Architectural Blueprint Wireframe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-25">
        {backdropPattern || (
          <svg
            className="w-full h-full blueprint-pattern"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="blueprint-grid-gate" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint-grid-gate)" className="text-[var(--wire)]" />

            {/* Topography Contours */}
            <path
              d="M 20 220 C 80 180, 160 260, 240 210 C 320 160, 360 220, 390 190"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
              className="text-[var(--accent2)]"
            />
            <path
              d="M 10 170 C 90 130, 180 210, 260 160 C 340 110, 370 170, 400 140"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-[var(--accent)]"
            />
            <path
              d="M 30 120 C 110 80, 200 160, 280 110 C 350 70, 380 120, 410 90"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2 4"
              className="text-[var(--wire-h)]"
            />

            {/* Architectural Crosshairs & Calipers */}
            <circle cx="200" cy="150" r="75" stroke="currentColor" strokeWidth="0.6" strokeDasharray="6 6" className="text-[var(--wire-h)]" />
            <circle cx="200" cy="150" r="115" stroke="currentColor" strokeWidth="0.4" className="text-[var(--wire)]" />
            <line x1="200" y1="20" x2="200" y2="280" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-[var(--wire)]" />
            <line x1="20" y1="150" x2="380" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-[var(--wire)]" />
          </svg>
        )}
      </div>

      {/* Standby Architectural Activation Hub */}
      <div className="relative z-10 max-w-[320px] flex flex-col items-center gap-3">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded border font-semibold"
          style={{
            color: accentColor,
            borderColor: `${accentColor}40`,
            background: `${accentColor}15`,
          }}
        >
          {badge}
        </span>

        {/* Tactile Activation Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsActivated(true);
          }}
          className="mt-2 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white font-semibold rounded transition-all duration-200 flex items-center gap-2 shadow-md hover:scale-[1.03] active:scale-[0.98] border cursor-pointer pointer-events-auto"
          style={{
            backgroundColor: accentColor,
            borderColor: `${accentColor}90`,
          }}
        >
          <span>{actionLabel}</span>
        </button>

        <span className="font-mono text-[10px] text-[var(--muted)] tracking-tight">
          {actionSubtext}
        </span>
      </div>
    </div>
  );
}
