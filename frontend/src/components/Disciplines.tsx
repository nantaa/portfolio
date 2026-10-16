"use client";

import { useState } from "react";

export default function Disciplines() {
  const [discOpen, setDiscOpen] = useState(false);

  return (
    <>
      <div className="sec-hd" id="disciplines">
        <span className="sec-lbl">Disciplines</span>
        <span className="sec-ct">08 total</span>
      </div>

      <div className="disc-table">
        <div className="dr">
          <span className="d-num">01</span>
          <span className="d-name">Fullstack / Web Development</span>
          <span className="d-tag">Next.js · Node.js · PostgreSQL · Docker</span>
          <div className="d-bar"></div>
        </div>
        <div className="dr">
          <span className="d-num">02</span>
          <span className="d-name">UI/UX Design</span>
          <span className="d-tag">Figma · Research · Prototyping · A/B</span>
          <div className="d-bar"></div>
        </div>
        <div className="dr">
          <span className="d-num">03</span>
          <span className="d-name">AI Projects</span>
          <span className="d-tag">LangChain · RAG · Agents · Python</span>
          <div className="d-bar"></div>
        </div>
        <div className="dr">
          <span className="d-num">04</span>
          <span className="d-name">IT Support</span>
          <span className="d-tag">Troubleshooting · Helpdesk · Infrastructure</span>
          <div className="d-bar"></div>
        </div>

        <div
          className={`disc-expand ${discOpen ? "open" : ""}`}
          onClick={() => setDiscOpen(!discOpen)}
        >
          <div className="dx-icon"></div>
          <span className="dx-lbl">
            {discOpen ? "Hide disciplines" : "Show more disciplines"}
          </span>
        </div>

        <div className={`disc-reveal ${discOpen ? "open" : ""}`}>
          <div className="dr sec">
            <span className="d-num">05</span>
            <span className="d-name">Electrical Engineering</span>
            <span className="d-tag">Schematics · PCB · Systems Design</span>
            <div className="d-bar"></div>
          </div>
          <div className="dr sec">
            <span className="d-num">06</span>
            <span className="d-name">Network Engineering</span>
            <span className="d-tag">Cisco · Routing · VLAN · Security</span>
            <div className="d-bar"></div>
          </div>
          <div className="dr sec">
            <span className="d-num">07</span>
            <span className="d-name">Multimedia</span>
            <span className="d-tag">Video · Motion · Audio · Editing</span>
            <div className="d-bar"></div>
          </div>
          <div className="dr sec">
            <span className="d-num">08</span>
            <span className="d-name">Photography</span>
            <span className="d-tag">Portrait · Environment · Brand Identity</span>
            <div className="d-bar"></div>
          </div>
        </div>
      </div>
    </>
  );
}
