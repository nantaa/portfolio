"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("portfolio-theme-change", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("portfolio-theme-change", callback);
  };
}

function getSnapshot(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "light";
}

function getServerSnapshot(): "dark" | "light" {
  return "light";
}

export default function Nav() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("work");

  // Scroll-spy: Track active section for clear spatial wayfinding
  useEffect(() => {
    const sectionIds = ["work", "disciplines", "about", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch { }
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: nextTheme }));
  };

  const openResume = () => {
    window.dispatchEvent(new CustomEvent("open-resume-modal"));
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav>
        <a
          href="#"
          onClick={scrollToTop}
          className="nav-logo flex items-center gap-2.5 group cursor-pointer"
          style={{ textDecoration: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-svg.svg"
            alt="Aryo Logo"
            width={26}
            height={26}
            className="nav-logo-icon w-[26px] h-[26px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span>Aryo<em>.</em></span>
        </a>
        <div className="nav-right">
          <ul className="nav-links hidden md:flex">
            <li>
              <a
                href="#work"
                className={`transition-colors flex items-center gap-1.5 ${activeSection === "work" ? "text-[var(--text)] font-semibold" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
              >
                {activeSection === "work" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block"></span>}
                <span>Work</span>
              </a>
            </li>
            <li>
              <a
                href="#disciplines"
                className={`transition-colors flex items-center gap-1.5 ${activeSection === "disciplines" ? "text-[var(--text)] font-semibold" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
              >
                {activeSection === "disciplines" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block"></span>}
                <span>Disciplines</span>
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={`transition-colors flex items-center gap-1.5 ${activeSection === "about" ? "text-[var(--text)] font-semibold" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
              >
                {activeSection === "about" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block"></span>}
                <span>About</span>
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`transition-colors flex items-center gap-1.5 ${activeSection === "contact" ? "text-[var(--text)] font-semibold" : "text-[var(--muted)] hover:text-[var(--text)]"}`}
              >
                {activeSection === "contact" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block"></span>}
                <span>Contact</span>
              </a>
            </li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={openResume}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider text-[var(--accent2)] hover:text-white bg-[var(--wire)] hover:bg-[var(--accent)] border border-[var(--wire)] rounded-[2px] transition-all cursor-pointer"
              title="Open verified credentials & CV"
            >
              <span>CV</span>
              <span className="text-[10px]">↗</span>
            </button>

            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
              title={`Switch to ${theme === "dark" ? "warm light" : "dark"} theme`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                background: "transparent",
                border: "0.5px solid var(--wire)",
                borderRadius: "2px",
                color: "var(--text)",
                cursor: "pointer",
                transition: "border-color 200ms, color 200ms",
              }}
            >
              {theme === "dark" ? (
                // Sun icon for switching to warm linen light
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                // Moon icon for switching to dark
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="nav-menu-btn md:hidden flex items-center justify-center w-8 h-8 rounded-[2px] border border-[var(--wire)] text-[var(--text)] cursor-pointer"
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {mobileMenuOpen ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>

            <div className="nav-cta hidden sm:block">Available for work</div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu md:hidden fixed top-[56px] left-0 right-0 z-[499] bg-[var(--modal-bg)] border-b border-[var(--wire)] shadow-2xl p-6 flex flex-col gap-5 font-mono text-xs uppercase tracking-widest animate-fadeIn"
          style={{ backdropFilter: "blur(16px)" }}
        >
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2.5 border-b border-[var(--wire)] flex justify-between items-center transition-colors ${activeSection === "work" ? "text-[var(--accent2)] font-bold" : "text-[var(--text)] hover:text-[var(--accent)]"}`}
          >
            <span>[01] Selected Work</span>
            <span className="text-[var(--accent2)]">{activeSection === "work" ? "●" : "→"}</span>
          </a>
          <a
            href="#disciplines"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2.5 border-b border-[var(--wire)] flex justify-between items-center transition-colors ${activeSection === "disciplines" ? "text-[var(--accent2)] font-bold" : "text-[var(--text)] hover:text-[var(--accent)]"}`}
          >
            <span>[02] Engineering Disciplines</span>
            <span className="text-[var(--accent2)]">{activeSection === "disciplines" ? "●" : "→"}</span>
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2.5 border-b border-[var(--wire)] flex justify-between items-center transition-colors ${activeSection === "about" ? "text-[var(--accent2)] font-bold" : "text-[var(--text)] hover:text-[var(--accent)]"}`}
          >
            <span>[03] Background &amp; Bio</span>
            <span className="text-[var(--accent2)]">{activeSection === "about" ? "●" : "→"}</span>
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2.5 border-b border-[var(--wire)] flex justify-between items-center transition-colors ${activeSection === "contact" ? "text-[var(--accent2)] font-bold" : "text-[var(--text)] hover:text-[var(--accent)]"}`}
          >
            <span>[04] Contact &amp; Connect</span>
            <span className="text-[var(--accent2)]">{activeSection === "contact" ? "●" : "→"}</span>
          </a>
          <div className="pt-2 flex justify-between items-center text-[10px] text-[var(--muted)]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openResume();
              }}
              className="flex items-center gap-1.5 text-[var(--accent2)] font-mono font-bold uppercase tracking-wider"
            >
              <span>View Résumé / CV ↗</span>
            </button>
            <span className="text-[var(--accent2)]">Available for work</span>
          </div>
        </div>
      )}
    </>
  );
}
