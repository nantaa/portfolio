import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--text)] text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-bold">
        Error 404 — Routing Fault
      </div>
      <h1 className="font-serif text-5xl md:text-6xl mb-4 font-normal tracking-tight">
        Structure Not Found<em>.</em>
      </h1>
      <p className="font-sans text-sm md:text-base text-[var(--muted)] max-w-md mb-8 leading-relaxed">
        The requested coordinate does not exist in this architectural matrix. It may have been relocated or decommissioned.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider bg-[var(--accent)] text-white rounded-[2px] hover:opacity-90 transition-opacity"
      >
        <span>Return to Portfolio</span>
        <span>→</span>
      </Link>
    </main>
  );
}

