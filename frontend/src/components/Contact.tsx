"use client";

import { Settings } from "@/lib/api";

interface ContactProps {
  settings?: Settings;
}

export default function Contact({ settings = {} }: ContactProps) {
  const email = settings["contact_email"] ?? "rifaiaryoananta@email.com";
  const linkedin = settings["contact_linkedin"] ?? "linkedin.com/in/rifai-aryo-ananta";
  const github = settings["contact_github"] ?? "github.com/nantaa";
  const instagram = settings["contact_instagram"] ?? "@rfrynny";
  const codepen = settings["contact_codepen"] ?? "https://codepen.io/Rifai-Aryo-Ananta";

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
        </div>
        <div className="contact-right">
          <a href={`mailto:${email}`} className="ci">
            <span className="ci-lbl">Email</span>
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
