"use client";

import { useState } from "react";

// ─── Industrial K3 Compliance Engine (MORIKU / DNP) Preview ──────────────────
// Authentic parity with PT Delta Nusantara Persada (DNP) Disnaker PJK3 statutory workflow.
// Models the complete 16-stage compliance lifecycle across 4 statutory phases:
// Phase 1: Masuk Berkas (Stage 1 - 3: PO/SPK, Verifikasi Dokumen, Penjadwalan)
// Phase 2: Teknis Lapangan (Stage 4 - 6: Pelaksanaan RU, Aktualisasi Unit, Penyusunan LHPP, Review Ahli K3)
// Phase 3: Disnaker (Stage 7 - 9: Verifikasi Dinas, Proses Disnaker [30d SLA], Pengurusan Suket)
// Phase 4: Tagihan & Suket (Stage 10 - 16: Invoice, Penagihan, Verifikasi Lunas, Kirim Suket, Closing Kas, Selesai)

const TABS = ["Inspection Kanban", "SLA Pipeline", "Statutory Forms"] as const;
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

const PHASES = [
  { id: "all", label: "16 Tahap" },
  { id: "p1", label: "F1: Berkas [1-3]" },
  { id: "p2", label: "F2: Lapangan [4-6]" },
  { id: "p3", label: "F3: Disnaker [7-9]" },
  { id: "p4", label: "F4: Suket & Fin [10-16]" },
] as const;

const ROLE_STYLES: Record<RoleCode, string> = {
  MKT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ADM: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  TRU: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  AHLI: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  FIN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  SUP: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const STATUTORY_FORMS = [
  { code: "Form 6", name: "Pesawat Uap (Boiler)", standard: "Permenaker 01/1988", protocol: "Hydrostatic test & safety valve calibration" },
  { code: "Form 45 A.1", name: "Bejana Tekan & Tangki Timbun", standard: "Permenaker 37/2016", protocol: "NDT ultrasonic thickness & pressure cycle" },
  { code: "Form 55 L", name: "Instalasi Listrik & Penyalur Petir", standard: "Permenaker 12/2015", protocol: "Grounding resistance <5 ohm & thermal imaging" },
  { code: "Form 65 K", name: "Proteksi Kebakaran", standard: "Permenaker 04/1980", protocol: "Hydrant flow rate, pressure, & alarm integration" },
];

export default function DNPMonitorPreview() {
  const [tab, setTab] = useState<Tab>("Inspection Kanban");
  const [phaseFilter, setPhaseFilter] = useState<PhaseCode>("all");
  const [jobs, setJobs] = useState<KanbanJob[]>(INITIAL_JOBS);
  const [selectedForm, setSelectedForm] = useState<string>("Form 6");
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  // Filter stages according to active phase
  const visibleStages = phaseFilter === "all" ? STAGES : STAGES.filter((s) => s.phase === phaseFilter);

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

  return (
    <div className="w-full h-full p-4 flex flex-col justify-between bg-[var(--s2)] text-[var(--text)] font-mono text-[11px] select-none overflow-hidden border border-[var(--wire)]">
      {/* Top Header / View Controller */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--wire)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f39c12] animate-pulse"></span>
            <span className="text-[10px] tracking-wider text-[var(--text)] uppercase font-bold">
              MORIKU <span className="hidden md:inline">· Industrial K3 Compliance Engine</span>
            </span>
          </div>
          <span className="text-[9px] text-[#f39c12] tracking-widest uppercase">
            Disnaker Jawa Barat
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setTab(t);
                }}
                className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ${
                  tab === t
                    ? "bg-[#f39c12] text-black font-bold shadow-sm"
                    : "bg-[var(--s1)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--s3)] border border-[var(--wire)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Inspection Kanban" && (
            <button
              type="button"
              onClick={resetPipeline}
              className="px-2 py-0.5 text-[8px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)] bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)] rounded-[2px] transition-all cursor-pointer"
            >
              Reset Data Demo
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        {/* VIEW 1: 16-STAGE STATUTORY KANBAN SIMULATOR */}
        {tab === "Inspection Kanban" && (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn min-h-0">
            {/* Phase Filter Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-1.5 border-b border-[var(--wire)] text-[8px] scrollbar-none">
              <span className="text-[var(--muted)] uppercase tracking-wider shrink-0 pr-1">Fase:</span>
              {PHASES.map((ph) => (
                <button
                  key={ph.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhaseFilter(ph.id as PhaseCode);
                  }}
                  className={`px-2 py-0.5 rounded-[2px] whitespace-nowrap transition-all cursor-pointer ${
                    phaseFilter === ph.id
                      ? "bg-[var(--accent)] text-white font-bold border border-[var(--accent2)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)] bg-[var(--s1)] border border-[var(--wire)]"
                  }`}
                >
                  {ph.label}
                </button>
              ))}
              <span className="ml-auto text-[8px] text-[var(--muted)] shrink-0 pl-2">
                16 Stages Pipeline
              </span>
            </div>

            {/* Side-Scrolling Kanban Columns */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex-1 overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin"
            >
              <div className="flex gap-2 min-w-max h-full">
                {visibleStages.map((stage) => {
                  const stageJobs = jobs.filter((j) => j.stageId === stage.id);
                  const isDragTarget = draggedJobId !== null;

                  return (
                    <div
                      key={stage.id}
                      onClick={(e) => e.stopPropagation()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrop(stage.id);
                      }}
                      className={`w-[210px] flex-shrink-0 bg-[var(--s1)] border rounded-[2px] p-2 flex flex-col justify-between transition-colors ${
                        isDragTarget ? "border-[var(--accent)]" : "border-[var(--wire)]"
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Column Header */}
                        <div className="flex justify-between items-center pb-1.5 mb-1.5 border-b border-[var(--wire)] gap-1.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-4 h-4 rounded bg-[var(--s2)] text-[8px] text-[var(--muted)] font-bold flex items-center justify-center shrink-0 border border-[var(--wire)]">
                              {stage.displayId}
                            </span>
                            <span className="text-[9px] font-bold text-[var(--text)] truncate" title={stage.name}>
                              {stage.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`px-1 py-0.2 text-[7px] font-bold rounded border ${ROLE_STYLES[stage.role]}`}
                            >
                              {stage.role}
                            </span>
                            <span className="text-[7px] px-1 bg-[var(--s2)] text-[var(--muted)] rounded border border-[var(--wire)]">
                              {stageJobs.length}
                            </span>
                          </div>
                        </div>

                        {/* Cards Container */}
                        <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-0.5">
                          {stageJobs.map((job) => {
                            const currentIdx = STAGES.findIndex((s) => s.id === job.stageId);
                            const hasPrev = currentIdx > 0;
                            const hasNext = currentIdx < STAGES.length - 1;

                            return (
                              <div
                                key={job.id}
                                draggable
                                onDragStart={() => handleDragStart(job.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px] hover:border-[#f39c12]/60 transition-all cursor-grab active:cursor-grabbing shadow-sm"
                              >
                                <div className="flex justify-between items-start text-[8px]">
                                  <span className="text-[var(--muted)] font-bold">{job.spk}</span>
                                  {job.sla && (
                                    <span
                                      className={`text-[7px] font-semibold px-1 rounded ${
                                        job.sla.includes("OVERDUE")
                                          ? "text-rose-400 bg-rose-500/10"
                                          : "text-emerald-500 bg-emerald-500/10 font-bold"
                                      }`}
                                    >
                                      {job.sla}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] font-bold text-[var(--text)] mt-1 truncate">
                                  {job.client}
                                </div>
                                <div className="text-[8px] text-[var(--muted)] truncate mt-0.5">
                                  {job.units}
                                </div>

                                {job.inspector && (
                                  <div className="mt-1 text-[7px] text-[#f39c12] bg-[#f39c12]/10 px-1 py-0.5 rounded border border-[#f39c12]/20">
                                    TIM RIKSA UJI: {job.inspector}
                                  </div>
                                )}

                                {/* Forward / Backward Stepper Buttons */}
                                <div className="flex gap-1 mt-2 pt-1.5 border-t border-[var(--wire)]">
                                  <button
                                    type="button"
                                    disabled={!hasPrev}
                                    onClick={(e) => moveJobBackward(job.id, e)}
                                    className="flex-1 py-0.5 text-[8px] bg-[var(--s1)] hover:bg-[var(--s3)] border border-[var(--wire)] disabled:opacity-20 disabled:hover:bg-[var(--s1)] text-[var(--muted)] hover:text-[var(--text)] rounded transition-colors text-center cursor-pointer disabled:cursor-not-allowed"
                                    title="Mundur 1 Tahap"
                                  >
                                    [ Prev ]
                                  </button>
                                  <button
                                    type="button"
                                    disabled={!hasNext}
                                    onClick={(e) => moveJobForward(job.id, e)}
                                    className="flex-1 py-0.5 text-[8px] bg-[#f39c12]/15 hover:bg-[#f39c12] text-[#f39c12] hover:text-black font-bold disabled:opacity-20 disabled:hover:bg-[var(--s1)] disabled:text-[var(--muted)] rounded transition-colors text-center cursor-pointer disabled:cursor-not-allowed"
                                    title="Maju 1 Tahap"
                                  >
                                    [ Next ]
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {stageJobs.length === 0 && (
                            <div className="text-[8px] text-[var(--muted)] italic py-5 text-center border border-dashed border-[var(--wire)] rounded">
                              Tarik kartu ke sini
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SLA PIPELINE OVERVIEW */}
        {tab === "SLA Pipeline" && (
          <div className="space-y-2 animate-fadeIn py-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-[var(--s1)] border border-[var(--wire)] rounded-[2px]">
                <div className="text-[9px] text-[var(--muted)] uppercase">Compliance SLA</div>
                <div className="text-sm font-bold text-[#27ae60] mt-0.5">94.2%</div>
                <div className="text-[8px] text-[var(--muted)]">Within statutory window</div>
              </div>
              <div className="p-2 bg-[var(--s1)] border border-[var(--wire)] rounded-[2px]">
                <div className="text-[9px] text-[var(--muted)] uppercase">Active Riksa Uji</div>
                <div className="text-sm font-bold text-[var(--text)] mt-0.5">{jobs.length} Orders</div>
                <div className="text-[8px] text-[var(--muted)]">Boiler, Pressure, Electrical</div>
              </div>
              <div className="p-2 bg-[var(--s1)] border border-[var(--wire)] rounded-[2px]">
                <div className="text-[9px] text-[var(--muted)] uppercase">Disnaker Overdue</div>
                <div className="text-sm font-bold text-[#e74c3c] mt-0.5">1 Order</div>
                <div className="text-[8px] text-[#e74c3c]/80">Attention required</div>
              </div>
            </div>

            <div className="p-2 bg-[var(--s1)] border border-[var(--wire)] rounded-[2px] space-y-1.5">
              <div className="flex justify-between text-[9px] text-[var(--muted)]">
                <span>Statutory 16-Stage Pipeline Velocity</span>
                <span className="text-[#f39c12] font-semibold">Avg 4.8 Days / Stage</span>
              </div>
              <div className="w-full bg-[var(--wire)] h-1.5 rounded-full overflow-hidden flex">
                <div style={{ width: "25%" }} className="bg-[#f39c12]" title="Fase 1: Berkas"></div>
                <div style={{ width: "30%" }} className="bg-[#3498db]" title="Fase 2: Lapangan"></div>
                <div style={{ width: "25%" }} className="bg-[#9b59b6]" title="Fase 3: Disnaker"></div>
                <div style={{ width: "20%" }} className="bg-[#27ae60]" title="Fase 4: Suket & Fin"></div>
              </div>
              <div className="flex justify-between text-[8px] text-[var(--muted)] pt-0.5">
                <span>F1: Berkas [1-3]</span>
                <span>F2: Lapangan [4-6]</span>
                <span>F3: Disnaker [7-9]</span>
                <span>F4: Suket &amp; Fin [10-16]</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: STATUTORY FORMS SPECIFICATION */}
        {tab === "Statutory Forms" && (
          <div className="space-y-1.5 animate-fadeIn py-1">
            <div className="flex justify-between text-[9px] text-[var(--muted)] pb-0.5 border-b border-[var(--wire)]">
              <span>Disnaker Statutory Form</span>
              <span>Regulatory Standard &amp; Inspection Protocol</span>
            </div>
            {STATUTORY_FORMS.map((form) => (
              <div
                key={form.code}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedForm(form.code);
                }}
                className={`p-1.5 rounded-[2px] transition-all cursor-pointer border ${
                  selectedForm === form.code
                    ? "bg-[#f39c12]/15 border-[#f39c12]/60 text-[var(--text)]"
                    : "bg-[var(--s1)] border-[var(--wire)] text-[var(--muted)] hover:bg-[var(--s3)] hover:text-[var(--text)]"
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[#f39c12]">
                    {form.code} · {form.name}
                  </span>
                  <span className="text-[8px] text-[var(--muted)] bg-[var(--s2)] border border-[var(--wire)] px-1 rounded">{form.standard}</span>
                </div>
                <div className="text-[9px] text-[var(--muted)] mt-0.5">Protocol: {form.protocol}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="pt-2 border-t border-[var(--wire)] flex justify-between items-center text-[9px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]"></span>
          <span>PT Delta Nusantara Persada · Disnaker PJK3 Accredited</span>
        </span>
        <span className="text-[var(--muted)]">16 Statutory Stages · {jobs.length} Active Units</span>
      </div>
    </div>
  );
}
