"use client";

import { useState, useEffect } from "react";

// ─── Academic Docket Optimization Engine Preview ────────────────────────────
// Showcases the 3 flagship optimization modules:
// 1. Gale-Shapley stable advisor matching
// 2. Hungarian optimal defense schedule assignment
// 3. Markov chain stage transition analytics

const TABS = ["Gale-Shapley", "Hungarian Schedule", "Markov Analytics"] as const;
type Tab = (typeof TABS)[number];

const MATCH_DATA = [
  { student: "UPI-CS-2026-003 (Aditya)", advisor: "Dr. Hendra, M.T.", score: "96.4%", state: "Matched" },
  { student: "UPI-CS-2026-007 (Nadia)", advisor: "Prof. Suryo, Ph.D.", score: "94.8%", state: "Matched" },
  { student: "UPI-CS-2026-012 (Rizky)", advisor: "Dr. Farida, M.Kom.", score: "91.2%", state: "Matched" },
  { student: "UPI-CS-2026-018 (Zahra)", advisor: "Dr. Bambang, M.Eng.", score: "89.5%", state: "Matched" },
];

const SCHEDULE_DATA = [
  { time: "09:00 WIB", room: "Ruang Sidang Utama", candidate: "Nadia (UPI-CS-007)", examiner: "Prof. Suryo, Dr. Hendra", slot: "Optimal Cost: 0.12" },
  { time: "11:00 WIB", room: "Lab Rekayasa Perangkat Lunak", candidate: "Aditya (UPI-CS-003)", examiner: "Dr. Farida, Dr. Bambang", slot: "Optimal Cost: 0.08" },
  { time: "14:00 WIB", room: "Ruang Multimedia D-3", candidate: "Rizky (UPI-CS-012)", examiner: "Dr. Hendra, Prof. Suryo", slot: "Optimal Cost: 0.15" },
];

const MARKOV_DATA = [
  { stage: "Stage 7: Sidang Terbuka", probability: "88.4%", risk: "Low", status: "In Matrix" },
  { stage: "Stage 8: Revisi Naskah", probability: "94.2%", risk: "Minimal", status: "In Matrix" },
  { stage: "Stage 9: Yudisium & Kelulusan", probability: "91.0%", risk: "Optimal", status: "Converged" },
];

export default function AcademicDocketPreview() {
  const [tab, setTab] = useState<Tab>("Gale-Shapley");

  useEffect(() => {
    const timer = setInterval(() => {
      setTab((prev) => {
        const idx = TABS.indexOf(prev);
        return TABS[(idx + 1) % TABS.length];
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full p-4 flex flex-col justify-between bg-[var(--s2)] text-[var(--text)] font-mono text-[11px] select-none overflow-hidden border border-[var(--wire)]">
      {/* Top Header / Tab Switcher */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--wire)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7a1525] animate-pulse"></span>
            <span className="text-[10px] tracking-wider text-[var(--text)] uppercase font-bold">
              Kaprodi Algorithm Center
            </span>
          </div>
          <span className="text-[9px] text-[#7a1525] tracking-widest uppercase font-semibold">
            Live Cohort UPI-CS-2026
          </span>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex gap-1.5 mb-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={(e) => {
                e.stopPropagation();
                setTab(t);
              }}
              className={`px-2 py-0.5 text-[9px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ${
                tab === t
                  ? "bg-[#7a1525] text-white font-bold shadow-sm"
                  : "bg-[var(--s1)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--s3)] border border-[var(--wire)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dynamic View */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        {tab === "Gale-Shapley" && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex justify-between text-[9px] text-[var(--muted)] pb-0.5 border-b border-[var(--wire)]">
              <span>Student Candidate</span>
              <span>Matched Advisor &amp; Score</span>
            </div>
            {MATCH_DATA.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-1.5 bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)] rounded-[2px] transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#7a1525] text-[9px] font-bold">#{i + 1}</span>
                  <span className="text-[var(--text)] text-[10px] font-medium">{row.student}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted)] text-[10px]">{row.advisor}</span>
                  <span className="text-[#27ae60] text-[9px] font-bold">{row.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Hungarian Schedule" && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex justify-between text-[9px] text-[var(--muted)] pb-0.5 border-b border-[var(--wire)]">
              <span>Time Slot / Room</span>
              <span>Candidate &amp; Examiner Panel</span>
            </div>
            {SCHEDULE_DATA.map((row, i) => (
              <div
                key={i}
                className="p-1.5 bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)] rounded-[2px] transition-colors flex flex-col gap-0.5 shadow-xs"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#7a1525] font-bold">{row.time} · {row.room}</span>
                  <span className="text-emerald-500 font-semibold text-[9px]">{row.slot}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] text-[var(--muted)]">
                  <span className="text-[var(--text)] font-medium">{row.candidate}</span>
                  <span>{row.examiner}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Markov Analytics" && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex justify-between text-[9px] text-[var(--muted)] pb-0.5 border-b border-[var(--wire)]">
              <span>Defense Stage Pipeline</span>
              <span>Transition Probability</span>
            </div>
            {MARKOV_DATA.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-1.5 bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)] rounded-[2px] transition-colors shadow-xs"
              >
                <span className="text-[var(--text)] text-[10px] font-medium">{row.stage}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted)] text-[9px]">{row.status}</span>
                  <span className="text-[#7a1525] text-[10px] font-bold">{row.probability}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="pt-2 mt-2 border-t border-[var(--wire)] flex justify-between items-center text-[9px] text-[var(--muted)]">
        <span>Active Model: Bipartite Optimal Matching</span>
        <span className="text-emerald-500 font-semibold">88 Passing Tests (100%)</span>
      </div>
    </div>
  );
}
