"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(current);

    const observer = new MutationObserver(() => {
      const updated = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
      setTheme(updated);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: nextTheme }));
  };

  return (
    <nav>
      <div className="nav-logo">
        Aryo<em>.</em>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#disciplines">Skills</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
          <div className="nav-cta">Available for work</div>
        </div>
      </div>
    </nav>
  );
}
