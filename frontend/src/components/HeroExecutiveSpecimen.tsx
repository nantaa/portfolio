"use client";

export default function HeroExecutiveSpecimen() {
  return (
    <div
      className="hero-executive-specimen relative flex h-full w-full flex-col justify-between overflow-hidden border-l border-[var(--wire)] bg-[var(--s1)] p-8 sm:p-10 lg:p-14 select-none"
      aria-label="Executive Systems Architecture Specimen"
    >
      {/* ── Top Status Header ── */}
      <header className="border-b border-[var(--wire)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-widest uppercase">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            <span className="font-bold text-[var(--text)]">
              SYSTEMS ARCHITECT &amp; LEAD ENGINEER
            </span>
          </div>
          <span className="font-semibold text-[var(--accent)] tracking-wider">
            PRODUCTION VERIFIED
          </span>
        </div>
      </header>

      {/* ── Center Editorial Focal ── */}
      <div className="my-auto py-8 lg:py-12">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
            <span>[01] ENTERPRISE SYSTEMS & ERP</span>
            <span>·</span>
            <span>[02] CREATIVE MOTION & 3D WEBGL</span>
            <span>·</span>
            <span>[03] ALGORITHMIC OPTIMIZATION</span>
            <span>·</span>
            <span>[04] CLOUD & DEVOPS</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-[var(--text)]">
            Mission-critical web systems, statutory compliance engines, and automated cloud infrastructure.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)] max-w-xl">
            Designing resilient software with formal state machines, strict ACID transaction guarantees, and sub-second deterministic pipelines.
          </p>
        </div>

        {/* ── 3 Clean Benchmark Badges ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[var(--wire)]">
          <div className="p-3 border border-[var(--wire)] bg-[var(--s2)]/50 rounded-[2px]">
            <div className="font-mono text-[16px] font-bold text-[var(--text)]">350+</div>
            <div className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">Passing Tests</div>
          </div>
          <div className="p-3 border border-[var(--wire)] bg-[var(--s2)]/50 rounded-[2px]">
            <div className="font-mono text-[16px] font-bold text-[var(--text)]">&lt;2h SLA</div>
            <div className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">Event Latency</div>
          </div>
          <div className="p-3 border border-[var(--wire)] bg-[var(--s2)]/50 rounded-[2px]">
            <div className="font-mono text-[16px] font-bold text-[var(--text)]">0-Downtime</div>
            <div className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">Atomic Releases</div>
          </div>
        </div>
      </div>

      {/* ── Bottom Quality Verification Bar ── */}
      <footer className="border-t border-[var(--wire)] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-wider text-[var(--muted)] uppercase">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400">●</span>
            <span className="font-semibold text-[var(--text)]">Dual Architecture Verification</span>
          </div>
          <span>Next.js 15 &amp; Static Mirror Parity</span>
        </div>
      </footer>
    </div>
  );
}
