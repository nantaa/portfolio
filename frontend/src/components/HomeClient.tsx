"use client";

import { Project, Settings } from "@/lib/api";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import Disciplines from "@/components/Disciplines";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// System initialized immediately without artificial loading delays
interface HomeClientProps {
  projects?: Project[];
  settings?: Settings;
}

export default function HomeClient({ projects = [], settings = {} }: HomeClientProps = {}) {
  return (
    <>
      <Nav />

      <Hero />

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
