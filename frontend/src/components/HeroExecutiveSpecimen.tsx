"use client";

interface DisciplineSpecimen {
  number: string;
  discipline: string;
  tech: string;
  metric: string;
  metricTone: "amber" | "maroon" | "emerald" | "blue";
  description: string;
}

const DISCIPLINES: DisciplineSpecimen[] = [
  {
    number: "01",
    discipline: "ENTERPRISE SYSTEMS & ERP",
    tech: "Laravel 11 · React 19 · PostgreSQL 16 · Redis",
    metric: "270+ Automated Tests",
    metricTone: "amber",
    description:
      "Statutory state machines, Disnaker SLA calculation engines, and ACID audit ledgers in Laravel 11, React 19, & PostgreSQL.",
  },
  {
    number: "02",
    discipline: "CREATIVE MOTION & 3D WEBGL",
    tech: "Three.js · Vue 3 · GLSL Shaders · WebGL 2.0",
    metric: "60 FPS Constant Pipeline",
    metricTone: "maroon",
    description:
      "Parametric geometry displacement with real-time GLSL caustics, dual-depth Fresnel reflection, and studio lighting.",
  },
  {
    number: "03",
    discipline: "ALGORITHMIC OPTIMIZATION",
    tech: "Discrete Mathematics · Graph Theory · Python · REST",
    metric: "88 Unit Tests Passing",
    metricTone: "emerald",
    description:
      "Gale-Shapley stable advisor matching and Hungarian minimal-cost defense schedule assignment executing in <200ms.",
  },
  {
    number: "04",
    discipline: "CLOUD & DEVOPS INFRASTRUCTURE",
    tech: "Linux · Nginx · WhatsApp Cloud API · Soketi",
    metric: "Sub-2h SLA Compliance",
    metricTone: "blue",
    description:
      "Zero-downtime atomic symlink deployments, dual-channel event bus, Linux administration, and webhook telemetry.",
  },
];

export default function HeroExecutiveSpecimen() {
  return (
    <div
      className="hero-executive-specimen relative flex h-full w-full flex-col justify-between overflow-hidden border-l border-[var(--wire)] bg-[var(--s1)] p-6 select-none sm:p-8 lg:p-10"
      aria-label="Executive Systems Architecture Specimen"
    >
      {/* ── Top Metadata Coordinate Stamp ── */}
      <header className="border-b border-[var(--wire)] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"
              aria-hidden="true"
            />
            <span className="font-bold text-[var(--text)]">
              SYSTEMS ARCHITECT &amp; IT LEAD // PRODUCTION CAPABILITIES
            </span>
          </div>
          <span className="font-semibold text-[var(--accent)]">
            06°14&apos;S 107°00&apos;E · BEKASI
          </span>
        </div>
      </header>

      {/* ── Sub-header: Core Domains & Verification ── */}
      <div className="my-auto py-5 sm:py-6">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--wire)] pb-2 font-mono text-[9px] tracking-wider text-[var(--muted)] uppercase">
          <span>Core Engineering Disciplines &amp; Architecture</span>
          <span className="font-bold text-[var(--accent)]">VERIFIED BENCHMARKS</span>
        </div>

        {/* ── 4 Discipline Capability Cards ── */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {DISCIPLINES.map((item) => (
            <article
              key={item.number}
              className="group relative rounded-[2px] border border-[var(--wire)] bg-[var(--s2)]/40 p-3.5 transition-colors duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--s2)]/75"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider text-[var(--text)]">
                  <span className="text-[var(--accent)] font-semibold">[{item.number}]</span>
                  <span>{item.discipline}</span>
                </div>
                <span className="font-mono text-[9px] font-semibold tracking-wider uppercase text-[var(--accent)]">
                  {item.metric}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-[var(--muted)]">
                {item.description}
              </p>
              <div className="mt-2 font-mono text-[9px] tracking-wide text-[var(--muted)] opacity-85">
                {item.tech}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── Bottom Benchmark Verification Bar ── */}
      <footer className="border-t border-[var(--wire)] pt-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] tracking-wider text-[var(--muted)] uppercase">
          <div className="flex items-center gap-2 font-bold text-[var(--text)]">
            <span className="text-emerald-600 dark:text-emerald-400">●</span>
            <span>350+ Passing Automated Tests</span>
          </div>
          <span>Zero SLA Calculation Errors</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Production Verified
          </span>
        </div>
      </footer>
    </div>
  );
}

