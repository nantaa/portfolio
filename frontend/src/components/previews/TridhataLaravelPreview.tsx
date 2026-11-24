"use client";

import { useState } from "react";

type FilamentTab = "production" | "bom" | "stock" | "opname";

interface ScheduleRow {
  id: string;
  batch: string;
  facility: "Bogor" | "Nganjuk";
  product: string;
  qty: string;
  status: "Scheduled" | "In Progress" | "Completed";
}

interface BomRow {
  code: string;
  product: string;
  materials: string;
  yieldRate: string;
}

interface StockRow {
  ref: string;
  item: string;
  type: "IN" | "OUT" | "ADJUSTMENT" | "OPNAME";
  qty: string;
  facility: "Bogor" | "Nganjuk";
}

const SCHEDULES: ScheduleRow[] = [
  { id: "PS-2026-01", batch: "B-BGR-084", facility: "Bogor", product: "Organic Fertilizer Granule 25kg", qty: "1,200 Zak", status: "In Progress" },
  { id: "PS-2026-02", batch: "B-NGJ-112", facility: "Nganjuk", product: "Liquid Bio-Stimulant 5L", qty: "850 Jerrycan", status: "Scheduled" },
  { id: "PS-2026-03", batch: "B-BGR-083", facility: "Bogor", product: "NPK Humic Compound 50kg", qty: "640 Zak", status: "Completed" },
];

const BOMS: BomRow[] = [
  { code: "BOM-001", product: "Organic Fertilizer Granule 25kg", materials: "Compost Base (70%), Dolomite (18%), Humic Acid (12%)", yieldRate: "98.4%" },
  { code: "BOM-002", product: "Liquid Bio-Stimulant 5L", materials: "Molasses (45%), Bio-Culture (35%), Micro-Nutrients (20%)", yieldRate: "99.1%" },
  { code: "BOM-003", product: "NPK Humic Compound 50kg", materials: "Urea (32%), Phosphate (28%), KCl (25%), Humic (15%)", yieldRate: "97.8%" },
];

const MOVEMENTS: StockRow[] = [
  { ref: "SM-9041", item: "Raw Compost Bulk (Ton)", type: "IN", qty: "+45.0 T", facility: "Bogor" },
  { ref: "SM-9042", item: "Woven PP Bag 25kg", type: "OUT", qty: "-1,200 Pcs", facility: "Bogor" },
  { ref: "SM-9043", item: "HDPE Jerrycan 5L", type: "ADJUSTMENT", qty: "-12 Pcs", facility: "Nganjuk" },
  { ref: "SM-9044", item: "Liquid Bio-Culture Drum", type: "OPNAME", qty: "18 Drums", facility: "Nganjuk" },
];

export default function TridhataLaravelPreview() {
  const [activeTab, setActiveTab] = useState<FilamentTab>("production");
  const [verifiedIds, setVerifiedIds] = useState<string[]>(["OPN-BGR-01"]);

  const toggleVerify = (id: string) => {
    setVerifiedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--s1)] border border-[var(--wire)] rounded-[3px] overflow-hidden font-sans text-[var(--text)]">
      {/* Filament v3 Top Bar */}
      <div className="px-4 py-3 border-b border-[var(--wire)] bg-[var(--s2)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded-[2px] bg-[var(--accent)] text-white font-mono text-[10px] font-bold tracking-wider">
            LARAVEL 11 · FILAMENT v3.2
          </span>
          <span className="font-semibold text-sm">Tridhata PPIC ERP — Admin Panel</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">
          PHP 8.2 · Spatie RBAC &amp; ActivityLog · Bogor &amp; Nganjuk
        </span>
      </div>

      {/* Filament Navigation Tabs */}
      <div className="px-4 py-2 border-b border-[var(--wire)] bg-[var(--s1)] flex flex-wrap gap-1.5 font-mono text-[11px]">
        {(
          [
            ["production", "ProductionScheduleResource"],
            ["bom", "BomResource"],
            ["stock", "StockMovementResource"],
            ["opname", "LowStockAlertWidget & Opname"],
          ] as [FilamentTab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab(key);
            }}
            className={`px-3 py-1.5 rounded-[2px] border cursor-pointer transition-colors ${
              activeTab === key
                ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold"
                : "bg-[var(--s2)] text-[var(--muted)] border-[var(--wire)] hover:text-[var(--text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Filament Workspace */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {activeTab === "production" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Production Schedules (PPIC)</h3>
              <span className="font-mono text-[10px] text-[var(--muted)]">ProductionScheduleResource.php</span>
            </div>
            <div className="border border-[var(--wire)] rounded-[2px] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--s2)] border-b border-[var(--wire)] font-mono text-[10px] uppercase text-[var(--muted)]">
                  <tr>
                    <th className="p-2.5">Batch</th>
                    <th className="p-2.5">Facility</th>
                    <th className="p-2.5">Product</th>
                    <th className="p-2.5">Target Qty</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--wire)]">
                  {SCHEDULES.map((row) => (
                    <tr key={row.id} className="hover:bg-[var(--s2)]/50">
                      <td className="p-2.5 font-mono font-semibold">{row.batch}</td>
                      <td className="p-2.5">{row.facility}</td>
                      <td className="p-2.5">{row.product}</td>
                      <td className="p-2.5 font-mono">{row.qty}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-[2px] bg-[var(--wire)] font-mono text-[10px] font-semibold">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bom" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Bill of Materials (BOM)</h3>
              <span className="font-mono text-[10px] text-[var(--muted)]">BomResource.php · ProductResource.php</span>
            </div>
            <div className="grid gap-2.5">
              {BOMS.map((b) => (
                <div key={b.code} className="p-3 border border-[var(--wire)] bg-[var(--s2)]/40 rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-mono text-[10px] text-[var(--accent)] font-bold">{b.code}</div>
                    <div className="font-semibold text-xs mt-0.5">{b.product}</div>
                    <div className="text-[11px] text-[var(--muted)] mt-1">{b.materials}</div>
                  </div>
                  <div className="font-mono text-xs font-bold shrink-0">Yield: {b.yieldRate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stock" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Stock Movement Ledger</h3>
              <span className="font-mono text-[10px] text-[var(--muted)]">StockMovementResource.php · StockMovementType Enum</span>
            </div>
            <div className="border border-[var(--wire)] rounded-[2px] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--s2)] border-b border-[var(--wire)] font-mono text-[10px] uppercase text-[var(--muted)]">
                  <tr>
                    <th className="p-2.5">Ref</th>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5">Movement Type</th>
                    <th className="p-2.5">Delta</th>
                    <th className="p-2.5">Facility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--wire)]">
                  {MOVEMENTS.map((m) => (
                    <tr key={m.ref} className="hover:bg-[var(--s2)]/50">
                      <td className="p-2.5 font-mono">{m.ref}</td>
                      <td className="p-2.5">{m.item}</td>
                      <td className="p-2.5 font-mono text-[10px] font-bold text-[var(--accent)]">{m.type}</td>
                      <td className="p-2.5 font-mono font-semibold">{m.qty}</td>
                      <td className="p-2.5">{m.facility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "opname" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">LowStockAlertWidget &amp; Opname Verification</h3>
              <span className="font-mono text-[10px] text-[var(--muted)]">StockOpnameVerificationPage.php</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { id: "OPN-BGR-01", title: "Bogor Warehouse — Woven PP Bag 25kg", stock: "420 Pcs (Min: 1,000)" },
                { id: "OPN-NGJ-02", title: "Nganjuk Plant — HDPE Jerrycan 5L", stock: "190 Pcs (Min: 500)" },
              ].map((item) => {
                const isVerified = verifiedIds.includes(item.id);
                return (
                  <div key={item.id} className="p-3.5 border border-[var(--wire)] bg-[var(--s2)]/50 rounded-[2px] flex flex-col justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] text-[var(--accent)] font-bold">{item.id}</div>
                      <div className="font-semibold text-xs mt-1">{item.title}</div>
                      <div className="font-mono text-[11px] text-[var(--muted)] mt-1">{item.stock}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVerify(item.id);
                      }}
                      className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-[2px] border cursor-pointer transition-colors ${
                        isVerified
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-[var(--s1)] text-[var(--text)] border-[var(--wire)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {isVerified ? "Verified & Logged ✓" : "Verify Stock Opname"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

