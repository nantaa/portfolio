"use client";

import { useEffect, useState } from "react";
import { Project, Settings } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import Disciplines from "@/components/Disciplines";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

interface HomeClientProps {
  projects?: Project[];
  settings?: Settings;
}

export default function HomeClient({ projects = [], settings = {} }: HomeClientProps = {}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // High-precision architectural loading gate initialization (resolves in 380ms)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 380);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.08 }
    );

    document
      .querySelectorAll(".wc, .dr, .pc, .about, .contact, footer")
      .forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = "0";
        htmlEl.style.transform = "translateY(20px)";
        htmlEl.style.transition = `opacity 650ms ease ${i * 50}ms, transform 650ms ease ${i * 50}ms`;
        observer.observe(htmlEl);
      });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Telemetry Loading Gate Animation */}
      <div
        className={`loading-gate fixed inset-0 z-[10000] bg-[var(--bg)] flex flex-col items-center justify-center transition-all duration-500 ease-out pointer-events-none ${
          isLoading ? "opacity-100" : "opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!isLoading}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 relative flex items-center justify-center">
            <div className="absolute inset-0 border border-[var(--wire)] rounded-full animate-ping opacity-30"></div>
            <div className="w-8 h-8 border border-[var(--accent)] rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[var(--text)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
            <span>INITIALIZING SYSTEM ARCHITECTURE</span>
          </div>
          <div className="font-mono text-[9px] text-[var(--muted)] tracking-wider">
            [ 06°14&apos;S 107°00&apos;E · 60 FPS RUNTIME ]
          </div>
        </div>
      </div>

      <Nav />

      <Hero />

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <span>Fullstack Development</span><span className="dot">✦</span>
          <span>UI/UX Design</span><span className="dot">✦</span>
          <span>AI Projects</span><span className="dot">✦</span>
          <span>IT Support</span><span className="dot">✦</span>
          <span>Network Engineering</span><span className="dot">✦</span>
          <span>Electrical Engineering</span><span className="dot">✦</span>
          <span>Photography</span><span className="dot">✦</span>
          <span>Multimedia</span><span className="dot">✦</span>
          <span>Fullstack Development</span><span className="dot">✦</span>
          <span>UI/UX Design</span><span className="dot">✦</span>
          <span>AI Projects</span><span className="dot">✦</span>
          <span>IT Support</span><span className="dot">✦</span>
          <span>Network Engineering</span><span className="dot">✦</span>
          <span>Electrical Engineering</span><span className="dot">✦</span>
          <span>Photography</span><span className="dot">✦</span>
          <span>Multimedia</span><span className="dot">✦</span>
        </div>
      </div>

      <WorkGrid projects={projects} />

      <Disciplines />

      <About />

      {/* Photography / Other Works Strip — Temporarily hidden */}
      {/*
      <div className="sec-hd">
        <span className="sec-lbl">Other works</span>
        <span className="sec-ct">Some of the things I've done...</span>
      </div>

      <div className="photo-grid">
        {["Environmental", "Portrait", "Brand"].map((label, i) => (
          <div key={i} className="pc">
            <div className="pph">
              <svg width="36" height="36" viewBox="0 0 36 36" className="ph-s">
                <rect x="2" y="6" width="32" height="22" rx="2" />
                <circle cx="18" cy="17" r="6" />
                <path d="M12 6l2-4h8l2 4" />
              </svg>
              <span>photo{i + 1}.jpg</span>
            </div>
            <div className="p-overlay">
              <span className="p-ov-txt">{label}</span>
            </div>
          </div>
        ))}
      </div>
      */}

      <Contact settings={settings} />

      <Footer />
    </>
  );
}
