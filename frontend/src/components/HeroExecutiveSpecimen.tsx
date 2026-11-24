"use client";

export default function HeroExecutiveSpecimen() {
  return (
    <div
      className="hero-executive-specimen relative w-full bg-[var(--s1)] select-none"
      aria-label="Architectural Engineering Ledger"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--wire)]">
        {/* Column 1: Domain Identity & Stack */}
        <div className="p-6 sm:p-8 lg:px-[52px] lg:py-8 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="font-bold text-[var(--text)]">SYSTEMS ARCHITECT &amp; LEAD ENGINEER</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
            <span>[01] ENTERPRISE SYSTEMS & ERP</span>
            <span>·</span>
            <span>[02] CREATIVE MOTION & 3D WEBGL</span>
            <span>·</span>
            <span>[03] ALGORITHMIC OPTIMIZATION</span>
            <span>·</span>
            <span>[04] CLOUD & DEVOPS</span>
          </div>
        </div>

        {/* Column 2: Engineering Focus */}
        <div className="p-6 sm:p-8 lg:py-8 flex flex-col justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Core Architecture Focus
          </div>
          <p className="text-sm leading-relaxed text-[var(--text)]">
            Formal state machines, strict ACID transaction guarantees, and sub-second deterministic pipelines.
          </p>
        </div>

        {/* Column 3: Verified Production Benchmarks */}
        <div className="p-6 sm:p-8 lg:px-[52px] lg:py-8 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">
            <span>Production Verified</span>
            <span className="text-[var(--accent)] font-bold">2026</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="font-mono text-base font-bold text-[var(--text)]">350+</div>
              <div className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider mt-0.5">Passing Tests</div>
            </div>
            <div>
              <div className="font-mono text-base font-bold text-[var(--text)]">&lt;2h SLA</div>
              <div className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider mt-0.5">Event Latency</div>
            </div>
            <div>
              <div className="font-mono text-base font-bold text-[var(--text)]">0-Downtime</div>
              <div className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider mt-0.5">Atomic Releases</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
