"use client";

import { useState } from "react";
import { Settings } from "@/lib/api";

interface ContactProps {
  settings?: Settings;
}

const INQUIRY_INTENTS = [
  "Fullstack Systems",
  "Realtime 3D / WebGL",
  "Systems Architecture",
  "Advisory / Full-Time",
];

export default function Contact({ settings = {} }: ContactProps) {
  const [selectedIntent, setSelectedIntent] = useState<string>("Fullstack Systems");
  const email = settings["contact_email"] ?? "rifai.aryo@gmail.com";
  const linkedin = settings["contact_linkedin"] ?? "linkedin.com/in/rifai-aryo-ananta";
  const github = settings["contact_github"] ?? "github.com/nantaa";
  const instagram = settings["contact_instagram"] ?? "@rfrynny";
  const codepen = settings["contact_codepen"] ?? "https://codepen.io/Rifai-Aryo-Ananta";

  const mailtoSubject = encodeURIComponent(`Project Inquiry: ${selectedIntent}`);
  const mailtoBody = encodeURIComponent(
    `Hi Aryo,\n\nI came across your portfolio and would like to discuss an opportunity regarding ${selectedIntent}.\n\nProject Scope / Timeline:\n\nBest regards,\n`
  );
  const dynamicMailto = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <>
      <section className="contact" id="contact">
        <div className="contact-left">
          <div className="c-label">Get in touch</div>
          <h2 className="c-heading">
            Let&apos;s build<br />
            something<br />
            <em>together.</em>
          </h2>
          <p className="c-body">
            Open to freelance projects,<br />
            collaborations, and full-time roles.<br />
            Based in Bekasi, Indonesia — working globally.
          </p>

          <div className="mt-8 pt-6 border-t border-[var(--wire)]">
            <span className="font-mono text-[11px] font-bold text-[var(--accent2)] tracking-wider uppercase block mb-3">
              Select inquiry intent:
            </span>
            <div className="flex flex-wrap gap-2">
              {INQUIRY_INTENTS.map((intent) => {
                const isActive = selectedIntent === intent;
                return (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => setSelectedIntent(intent)}
                    className={`px-3 py-1.5 font-mono text-xs rounded-[2px] transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-sm"
                        : "bg-[var(--s2)] text-[var(--muted)] border-[var(--card-border)] hover:border-[var(--accent)] hover:text-[var(--text)]"
                    }`}
                  >
                    {intent}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="contact-right">
          <a href={dynamicMailto} className="ci group bg-[var(--s1)] hover:bg-[var(--s2)] transition-colors">
            <span className="ci-lbl text-[var(--accent)] font-bold">Email (Pre-configured)</span>
            <span className="ci-val">{email} <span className="ci-arr">→</span></span>
          </a>
          <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="ci">
            <span className="ci-lbl">LinkedIn</span>
            <span className="ci-val">{linkedin} <span className="ci-arr">→</span></span>
          </a>
          <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="ci">
            <span className="ci-lbl">GitHub</span>
            <span className="ci-val">{github} <span className="ci-arr">→</span></span>
          </a>
          <a href={`https://instagram.com/${instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="ci">
            <span className="ci-lbl">Instagram</span>
            <span className="ci-val">{instagram} <span className="ci-arr">→</span></span>
          </a>
          <a href={`${codepen}`} target="_blank" rel="noopener noreferrer" className="ci">
            <span className="ci-lbl">CodePen</span>
            <span className="ci-val">{codepen} <span className="ci-arr">→</span></span>
          </a>
        </div>
      </section>
    </>
  );
}
