"use client";

import { useState } from "react";

// ─── Report Automation Interactive Preview ───────────────────────────────────
// Simulates a customizable dataset exporter and PDF/Excel generation suite.
// Users can toggle reporting modules and click "Generate PDF" to see a live compile.

interface Module {
  id: string;
  name: string;
  enabled: boolean;
}

export default function ReportAutomationPreview() {
  const [modules, setModules] = useState<Module[]>([
    { id: "sales", name: "Sales Reports", enabled: true },
    { id: "inventory", name: "Inventory Log", enabled: true },
    { id: "sla", name: "SLA Violations", enabled: false },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [reportReady, setReportReady] = useState(false);

  const toggleModule = (id: string) => {
    if (isGenerating) return;
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
    setReportReady(false);
  };

  const generateReport = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setReportReady(false);
    setProgress(0);

    const steps = [
      { p: 20, t: "Querying MariaDB database..." },
      { p: 50, t: "Parsing dataset & computing metrics..." },
      { p: 80, t: "Building PDF layout & vector charts..." },
      { p: 100, t: "Compiling document successfully!" },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].t);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setReportReady(true);
      }
    }, 600);
  };

  return (
    <div className="ra-preview">
      {/* Workspace Header Info */}
      <div className="ra-top-info">
        <span className="ra-info-lbl">Active Exporter Suite</span>
        <span className="ra-info-status">Ready</span>
      </div>

      {/* Module Selector Panel */}
      <div className="ra-config">
        <span className="ra-section-title">Select Data Modules</span>
        <div className="ra-module-list">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`ra-module-item${m.enabled ? " active" : ""}${isGenerating ? " disabled" : ""}`}
              onClick={() => toggleModule(m.id)}
            >
              <div className="ra-checkbox">
                {m.enabled && <div className="ra-check-mark" />}
              </div>
              <span className="ra-module-name">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compiler / Output Stage */}
      <div className="ra-compiler">
        {isGenerating ? (
          <div className="ra-progress-container">
            <div className="ra-progress-track">
              <div className="ra-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="ra-progress-val">{progress}%</span>
            <span className="ra-status-text">{statusText}</span>
          </div>
        ) : reportReady ? (
          <div className="ra-result-container animate-pulse-once">
            {/* Miniature CSS PDF Page Preview */}
            <div className="ra-doc-sheet">
              <div className="ra-sheet-header">
                <div className="ra-sheet-line-sm" style={{ width: "30%" }} />
                <div className="ra-sheet-line-xs" style={{ width: "15%" }} />
              </div>
              <div className="ra-sheet-body">
                <div className="ra-sheet-line-lg" style={{ width: "75%" }} />
                <div className="ra-sheet-line-md" style={{ width: "90%" }} />
                {/* CSS Bar Chart Simulation */}
                <div className="ra-sheet-chart">
                  <div className="ra-chart-bar" style={{ height: "40%" }} />
                  <div className="ra-chart-bar" style={{ height: "75%" }} />
                  <div className="ra-chart-bar" style={{ height: "55%" }} />
                  <div className="ra-chart-bar" style={{ height: "90%" }} />
                </div>
                <div className="ra-sheet-line-sm" style={{ width: "50%" }} />
              </div>
            </div>

            <div className="ra-success-box">
              <svg className="ra-pdf-icon" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V7h2v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z" />
              </svg>
              <div className="ra-success-info">
                <span className="ra-success-title">DNP_Report_2026.pdf</span>
                <span className="ra-success-size">842 KB · 12 Pages</span>
              </div>
              <button className="ra-download-btn" onClick={() => alert("Report download triggered! (Demo)")}>
                Download
              </button>
            </div>
          </div>
        ) : (
          <div className="ra-idle-box">
            <button className="ra-generate-btn" onClick={generateReport}>
              Generate PDF Report
            </button>
            <span className="ra-idle-sub">Supports Excel, PDF & CSV export</span>
          </div>
        )}
      </div>
    </div>
  );
}
