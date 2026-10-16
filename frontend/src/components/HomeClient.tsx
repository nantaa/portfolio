"use client";

import { useEffect, useRef } from "react";
import { Project, Settings } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import Disciplines from "@/components/Disciplines";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

interface HomeClientProps {
  projects: Project[];
  settings: Settings;
}

export default function HomeClient({ projects, settings }: HomeClientProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = cursorRef.current;
    if (!cur) return;

    const moveCursor = (e: MouseEvent) => {
      cur.style.left = e.clientX + "px";
      cur.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", moveCursor);

    const addBig = () => cur.classList.add("big");
    const removeBig = () => cur.classList.remove("big");
    const addSq = () => cur.classList.add("sq");
    const removeSq = () => cur.classList.remove("sq");

    document
      .querySelectorAll("a, .nav-cta, .wc, .pc, .about-left, .ci, .hero-btn, .hero-img-cell")
      .forEach((el) => {
        el.addEventListener("mouseenter", addBig);
        el.addEventListener("mouseleave", removeBig);
      });

    document.querySelectorAll(".dr, .disc-expand").forEach((el) => {
      el.addEventListener("mouseenter", addSq);
      el.addEventListener("mouseleave", removeSq);
    });

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
      document.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cur" ref={cursorRef}></div>

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
