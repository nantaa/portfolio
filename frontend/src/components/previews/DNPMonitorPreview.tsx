"use client";

import { useState, useRef } from "react";

// ─── Industrial K3 Compliance Engine (MORIKU / DNP) ──────────────────────────
// Authentic 1:1 parity with PT Delta Nusantara Persada (DNP) Disnaker PJK3 statutory workflow.
// Models the complete 16-stage compliance lifecycle across 4 statutory phases:
// Phase 1: Masuk Berkas (Stage 1 - 3: PO/SPK, Verifikasi Dokumen, Penjadwalan)
// Phase 2: Teknis Lapangan (Stage 4 - 6: Pelaksanaan RU, Aktualisasi Unit, Penyusunan LHPP, Review Ahli K3)
// Phase 3: Disnaker (Stage 7 - 9: Verifikasi Dinas, Proses Disnaker [30d SLA], Pengurusan Suket)
// Phase 4: Tagihan & Suket (Stage 10 - 16: Invoice, Penagihan, Verifikasi Lunas, Kirim Suket, Closing Kas, Selesai)

export const DOCKET_TABS = ["Inspection Kanban", "SLA Pipeline", "Statutory Forms"] as const;

const TABS = ["Kanban", "SLA", "Forms"] as const;
type Tab = (typeof TABS)[number];

export type RoleCode = "MKT" | "ADM" | "TRU" | "AHLI" | "FIN" | "SUP";
export type PhaseCode = "all" | "p1" | "p2" | "p3" | "p4";

export interface Stage {
  id: number;
  name: string;
  short: string;
  role: RoleCode;
  phase: "p1" | "p2" | "p3" | "p4";
  displayId: string;
  sla: string;
}

export const STAGES: Stage[] = [
  // Phase 1: Masuk Berkas (1 - 3)
  { id: 1, name: "PO / SPK / PROPOSAL", short: "PO / SPK", role: "MKT", phase: "p1", displayId: "01", sla: "1-2 Hari" },
  { id: 2, name: "Verifikasi Dokumen", short: "Verifikasi", role: "ADM", phase: "p1", displayId: "02", sla: "1 Hari" },
  { id: 3, name: "Penjadwalan", short: "Penjadwalan", role: "ADM", phase: "p1", displayId: "03", sla: "1 Hari" },

  // Phase 2: Teknis Lapangan (4, 4b, 5, 6)
  { id: 4, name: "PELAKSANAAN RU", short: "Pelaksanaan RU", role: "TRU", phase: "p2", displayId: "04", sla: "Inspeksi Fisik" },
  { id: 13, name: "Aktualisasi Unit", short: "Aktualisasi Unit", role: "MKT", phase: "p2", displayId: "04b", sla: "1 Hari" },
  { id: 5, name: "Penyusunan LHPP", short: "Penyusunan LHPP", role: "TRU", phase: "p2", displayId: "05", sla: "3 Hari" },
  { id: 6, name: "Review Laporan Teknis", short: "Review Ahli K3", role: "AHLI", phase: "p2", displayId: "06", sla: "1 Hari" },

  // Phase 3: Disnaker (7 - 9)
  { id: 7, name: "Verifikasi ke Dinas", short: "Kirim Dinas", role: "ADM", phase: "p3", displayId: "07", sla: "1 Hari" },
  { id: 8, name: "Proses Disnaker", short: "Disnaker", role: "ADM", phase: "p3", displayId: "08", sla: "30 Hari" },
  { id: 9, name: "Pengurusan Suket", short: "Ambil Suket", role: "ADM", phase: "p3", displayId: "09", sla: "1 Hari" },

  // Phase 4: Tagihan & Suket (10, 11, 11b, 11c, 12, 16)
  { id: 10, name: "Invoice & Kwitansi", short: "Invoice 1 Pintu", role: "FIN", phase: "p4", displayId: "10", sla: "1 Hari" },
  { id: 11, name: "Penagihan / Follow-up", short: "Penagihan MKT", role: "MKT", phase: "p4", displayId: "11", sla: "3-7 Hari" },
  { id: 14, name: "Verifikasi Bayar: Lunas", short: "Verifikasi Lunas", role: "FIN", phase: "p4", displayId: "11b", sla: "1 Hari" },
  { id: 15, name: "Kirim SUKET ke Klien", short: "Kirim Suket / Resi", role: "MKT", phase: "p4", displayId: "11c", sla: "1 Hari" },
  { id: 12, name: "Final Financial Closing", short: "Closing Kas", role: "FIN", phase: "p4", displayId: "12", sla: "1 Hari" },
  { id: 16, name: "Selesai & Arsip", short: "Arsip Selesai", role: "SUP", phase: "p4", displayId: "16", sla: "Permanen" },
];

export interface KanbanJob {
  id: string;
  spk: string;
  client: string;
  units: string;
  stageId: number;
  inspector?: string;
  sla?: string;
}

const INITIAL_JOBS: KanbanJob[] = [
  {
    id: "JOB-01",
    spk: "SPK-2026-0891",
    client: "PT ASTRA HONDA MOTOR",
    units: "2 Unit Pesawat Uap (Boiler Form 6)",
    stageId: 4,
    inspector: "ADI OCTA PR",
    sla: "OVERDUE 7/1d",
  },
  {
    id: "JOB-02",
    spk: "SPK-2026-0902",
    client: "PT DENSO INDONESIA",
    units: "5 Unit Forklift Diesel, 2 Unit Genset",
    stageId: 8,
    inspector: "DENI STEVAN",
    sla: "IN DISNAKER (14d)",
  },
  {
    id: "JOB-03",
    spk: "SPK-2026-0915",
    client: "PT KALBE FARMA TBK",
    units: "2 Unit Passenger Lift, 1 Unit Dumbwaiter",
    stageId: 10,
    sla: "INVOICE ISSUED",
  },
  {
    id: "JOB-04",
    spk: "SPK-2026-0920",
    client: "PT INDOFOOD CBP SUKSES",
    units: "4 Unit Bejana Tekan, 2 Unit Kompresor",
    stageId: 1,
    sla: "IN SLA (2d)",
  },
  {
    id: "JOB-05",
    spk: "SPK-2026-0928",
    client: "PT UNILEVER INDONESIA",
    units: "Instalasi Listrik & Penyalur Petir (Form 55 L)",
    stageId: 5,
    inspector: "ADI OCTA PR",
    sla: "DRAFTING LHPP",
  },
  {
    id: "JOB-06",
    spk: "SPK-2026-0935",
    client: "PT TOYOTA MOTOR MFG",
    units: "Proteksi Kebakaran Hydrant (Form 65 K)",
    stageId: 14,
    sla: "PAID / PENDING SUKET",
  },
];

const ROLE_STYLES: Record<RoleCode, string> = {
  MKT: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ADM: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  TRU: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  AHLI: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  FIN: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  SUP: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

const STATUTORY_FORMS = [
  { code: "Form 6", name: "Pesawat Uap (Boiler)", standard: "Permenaker 01/1988", protocol: "Hydrostatic test & safety valve calibration" },
  { code: "Form 45 A.1", name: "Bejana Tekan & Tangki Timbun", standard: "Permenaker 37/2016", protocol: "NDT ultrasonic thickness & pressure cycle" },
  { code: "Form 55 L", name: "Instalasi Listrik & Penyalur Petir", standard: "Permenaker 12/2015", protocol: "Grounding resistance <5 ohm & thermal imaging" },
  { code: "Form 65 K", name: "Proteksi Kebakaran", standard: "Permenaker 04/1980", protocol: "Hydrant flow rate, pressure, & alarm integration" },
];

export default function DNPMonitorPreview() {
  const [tab, setTab] = useState<Tab>("Kanban");
  const [jobs, setJobs] = useState<KanbanJob[]>(INITIAL_JOBS);
  const [selectedForm, setSelectedForm] = useState<string>("Form 6");
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const kanbanScrollRef = useRef<HTMLDivElement>(null);

  const visibleStages = STAGES;

  // Step job forward in the statutory 16-stage pipeline
  const moveJobForward = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const currentIndex = STAGES.findIndex((s) => s.id === j.stageId);
          if (currentIndex < STAGES.length - 1) {
            const nextStage = STAGES[currentIndex + 1];
            return {
              ...j,
              stageId: nextStage.id,
              inspector: nextStage.id === 4 ? "ADI OCTA PR" : j.inspector,
            };
          }
        }
        return j;
      })
    );
  };

  // Step job backward in the statutory 16-stage pipeline
  const moveJobBackward = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const currentIndex = STAGES.findIndex((s) => s.id === j.stageId);
          if (currentIndex > 0) {
            const prevStage = STAGES[currentIndex - 1];
            return {
              ...j,
              stageId: prevStage.id,
            };
          }
        }
        return j;
      })
    );
  };

  const handleDragStart = (jobId: string) => {
    setDraggedJobId(jobId);
  };

  const handleDrop = (targetStageId: number) => {
    if (!draggedJobId) return;
    setJobs((prev) =>
      prev.map((j) => (j.id === draggedJobId ? { ...j, stageId: targetStageId } : j))
    );
    setDraggedJobId(null);
  };

  const resetPipeline = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJobs(INITIAL_JOBS);
  };

  const addNewJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `JOB-0${jobs.length + 1}`;
    const newSpk = `SPK-2026-09${40 + jobs.length}`;
    const newJob: KanbanJob = {
      id: newId,
      spk: newSpk,
      client: "PT SCHNEIDER ELECTRIC",
      units: "1 Unit Transformator Daya & Panel LV",
      stageId: 1,
      sla: "NEW ORDER",
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  // Enable mouse wheel horizontal scrolling on the board
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (kanbanScrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      kanbanScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[var(--s1)] text-[var(--text)] select-text p-4 md:p-6 overflow-hidden min-h-0">
      {/* ── Control Bar: Tabs, Brand, and Quick Actions ── */}
      <div className="shrink-0 space-y-3 pb-3 border-b border-[var(--wire)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono font-bold text-xs tracking-wider text-[var(--text)] uppercase">
              MORIKU <span className="hidden md:inline">{"// "}DISNAKER K3 STATUTORY WORKFLOW</span>
            </span>
          </div>

          {/* View Switcher Tabs (Enhanced with SVG Icons) */}
          <div className="flex items-center gap-1.5 p-1 bg-[var(--s2)] rounded border border-[var(--card-border)]">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all cursor-pointer flex items-center gap-2 ${
                  tab === t
                    ? "bg-[var(--accent)] text-white shadow-sm font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--s3)]"
                }`}
              >
                {t === "Kanban" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block shrink-0">
                    <rect x="3" y="3" width="7" height="18" rx="1" />
                    <rect x="14" y="3" width="7" height="10" rx="1" />
                  </svg>
                ) : t === "SLA" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
                <span>{t}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addNewJob}
              className="px-3 py-1.5 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>+</span>
              <span>Tambah Pekerjaan</span>
            </button>
            <button
              type="button"
              onClick={resetPipeline}
              className="px-3 py-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--text)] bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--card-border)] rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>↺</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Viewport ── */}
      <div className="flex-1 min-h-0 pt-4 flex flex-col overflow-hidden">
        {/* VIEW 1: 16-STAGE STATUTORY KANBAN SIMULATOR */}
        {tab === "Kanban" && (
          <div
            ref={kanbanScrollRef}
            onWheel={handleWheel}
            className="flex-1 flex gap-3 overflow-x-auto overflow-y-auto pb-4 select-text scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {visibleStages.map((stage) => {
              const stageJobs = jobs.filter((j) => j.stageId === stage.id);
              const isDragTarget = draggedJobId !== null;

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDrop(stage.id);
                  }}
                  className={`w-[280px] shrink-0 bg-[var(--s2)] border rounded p-3 flex flex-col transition-colors ${
                    isDragTarget ? "border-[var(--accent)]" : "border-[var(--wire)]"
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--wire)]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-[var(--s3)] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 border border-[var(--card-border)] text-[var(--muted)]">
                        {stage.displayId}
                      </span>
                      <span className="text-xs font-bold text-[var(--text)] truncate" title={stage.name}>
                        {stage.short}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${ROLE_STYLES[stage.role]}`}>
                        {stage.role}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[var(--s3)] text-[var(--muted)] rounded border border-[var(--wire)]">
                        {stageJobs.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                    {stageJobs.map((job) => {
                      const currentIdx = STAGES.findIndex((s) => s.id === job.stageId);
                      const hasPrev = currentIdx > 0;
                      const hasNext = currentIdx < STAGES.length - 1;

                      return (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={() => handleDragStart(job.id)}
                          className="p-3 bg-[var(--s1)] border border-[var(--card-border)] rounded hover:border-[var(--accent)] transition-all cursor-grab active:cursor-grabbing shadow-sm"
                        >
                          <div className="flex justify-between items-start text-xs font-mono">
                            <span className="text-[var(--muted)] font-bold">{job.spk}</span>
                            {job.sla && (
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  job.sla.includes("OVERDUE")
                                    ? "text-rose-400 bg-rose-500/15 border border-rose-500/30"
                                    : "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30"
                                }`}
                              >
                                {job.sla}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-[var(--text)] mt-1.5 leading-snug">
                            {job.client}
                          </div>
                          <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                            {job.units}
                          </div>

                          {job.inspector && (
                            <div className="mt-2 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              TIM RIKSA: {job.inspector}
                            </div>
                          )}

                          {/* Forward / Backward Steppers */}
                          <div className="flex gap-1.5 mt-3 pt-2 border-t border-[var(--wire)]">
                            <button
                              type="button"
                              disabled={!hasPrev}
                              onClick={(e) => moveJobBackward(job.id, e)}
                              className="flex-1 py-1 text-xs font-mono bg-[var(--s2)] hover:bg-[var(--s3)] border border-[var(--wire)] disabled:opacity-20 text-[var(--muted)] hover:text-[var(--text)] rounded transition-colors text-center cursor-pointer disabled:cursor-not-allowed"
                              title="Mundur 1 Tahap"
                            >
                              ← Mundur
                            </button>
                            <button
                              type="button"
                              disabled={!hasNext}
                              onClick={(e) => moveJobForward(job.id, e)}
                              className="flex-1 py-1 text-xs font-mono bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white font-bold border border-sky-500/30 disabled:opacity-20 rounded transition-colors text-center cursor-pointer disabled:cursor-not-allowed"
                              title="Maju 1 Tahap"
                            >
                              Maju →
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {stageJobs.length === 0 && (
                      <div className="text-xs text-[var(--muted)] italic py-8 text-center border border-dashed border-[var(--wire)] rounded">
                        Tarik kartu ke sini
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: SLA PIPELINE OVERVIEW */}
        {tab === "SLA" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-[var(--s2)] border border-[var(--wire)] rounded">
                <div className="text-xs font-mono text-[var(--muted)] uppercase">Compliance SLA Rate</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">94.2%</div>
                <div className="text-xs text-[var(--muted)] mt-1">Within statutory timeline window</div>
              </div>
              <div className="p-4 bg-[var(--s2)] border border-[var(--wire)] rounded">
                <div className="text-xs font-mono text-[var(--muted)] uppercase">Active Riksa Uji</div>
                <div className="text-2xl font-bold text-[var(--text)] mt-1 font-mono">{jobs.length} Orders</div>
                <div className="text-xs text-[var(--muted)] mt-1">Boiler, Pressure, Electrical, Lift</div>
              </div>
              <div className="p-4 bg-[var(--s2)] border border-[var(--wire)] rounded">
                <div className="text-xs font-mono text-[var(--muted)] uppercase">Disnaker SLA Overdue</div>
                <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">1 Order</div>
                <div className="text-xs text-rose-400/80 mt-1">Direct intervention requested</div>
              </div>
            </div>

            <div className="p-4 bg-[var(--s2)] border border-[var(--wire)] rounded space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-semibold text-[var(--text)]">16-Stage Statutory Velocity</span>
                <span className="text-amber-400 font-bold">Avg 4.8 Days / Stage</span>
              </div>
              <div className="w-full bg-[var(--s3)] h-2 rounded-full overflow-hidden flex">
                <div style={{ width: "25%" }} className="bg-amber-500" title="Fase 1: Berkas" />
                <div style={{ width: "30%" }} className="bg-sky-500" title="Fase 2: Lapangan" />
                <div style={{ width: "25%" }} className="bg-purple-500" title="Fase 3: Disnaker" />
                <div style={{ width: "20%" }} className="bg-emerald-500" title="Fase 4: Suket & Fin" />
              </div>
              <div className="flex justify-between text-xs font-mono text-[var(--muted)]">
                <span>Berkas [01-03]</span>
                <span>Lapangan [04-06]</span>
                <span>Disnaker [07-09]</span>
                <span>Suket & Fin [10-16]</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: STATUTORY FORMS SPECIFICATION */}
        {tab === "Forms" && (
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="text-xs font-mono text-[var(--muted)] pb-1 border-b border-[var(--wire)]">
              Disnaker Statutory Inspection Forms & Technical Protocols
            </div>
            {STATUTORY_FORMS.map((form) => (
              <div
                key={form.code}
                onClick={() => setSelectedForm(form.code)}
                className={`p-3.5 rounded transition-all cursor-pointer border ${
                  selectedForm === form.code
                    ? "bg-[var(--s3)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                    : "bg-[var(--s2)] border-[var(--wire)] text-[var(--muted)] hover:bg-[var(--s3)] hover:text-[var(--text)]"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[var(--text)]">
                    {form.code} · {form.name}
                  </span>
                  <span className="text-xs font-mono bg-[var(--s1)] border border-[var(--card-border)] px-2 py-0.5 rounded text-[var(--muted)]">
                    {form.standard}
                  </span>
                </div>
                <div className="text-xs text-[var(--muted)] mt-1.5 font-sans leading-relaxed">
                  Testing Protocol: {form.protocol}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
