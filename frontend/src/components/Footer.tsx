"use client";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer>
      <span className="f-id">Aryo Ananta — Systems Architect — Bekasi 2026</span>
      <div className="f-dot"></div>
      <span className="f-copy">Portfolio Aryo © 2026</span>
      <button
        type="button"
        onClick={scrollToTop}
        className="ml-auto font-mono text-xs tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] flex items-center gap-1"
        aria-label="Scroll back to top of page"
      >
        <span>Back to top</span>
        <span>↑</span>
      </button>
    </footer>
  );
}
