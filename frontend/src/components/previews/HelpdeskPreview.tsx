"use client";

import { useState, useEffect } from "react";

// ─── Mock data per role ──────────────────────────────────────────────────────
const ROLES = ["User", "Agent", "Admin"] as const;
type Role = (typeof ROLES)[number];

const TICKETS = {
  User: [
    { id: "#4821", title: "Billing edge case on payment", status: "Open", sla: "2h left", priority: "high" },
    { id: "#4818", title: "Login redirect loop after VPN", status: "Resolved", sla: null, priority: "med" },
    { id: "#4812", title: "WhatsApp webhook not firing", status: "In Progress", sla: "5h left", priority: "med" },
  ],
  Agent: [
    { id: "#4821", title: "Billing edge case on payment", status: "Open", sla: "2h left", priority: "high" },
    { id: "#4820", title: "User can't reset password", status: "Open", sla: "4h left", priority: "high" },
    { id: "#4819", title: "Report export stuck at 0%", status: "In Progress", sla: "6h left", priority: "med" },
    { id: "#4817", title: "Dark mode flicker on Safari", status: "Resolved", sla: null, priority: "low" },
  ],
  Admin: [
    { id: "Overview", title: "Open tickets", status: "14", sla: null, priority: "stat" },
    { id: "SLA", title: "Breached today", status: "2", sla: null, priority: "breach" },
    { id: "Agents", title: "Active agents", status: "5 / 6", sla: null, priority: "stat" },
    { id: "CSAT", title: "Satisfaction score", status: "94%", sla: null, priority: "good" },
  ],
};

const STATUS_COLOR: Record<string, string> = {
  Open: "#7A1525",
  "In Progress": "#8B6914",
  Resolved: "#1E6B3A",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "#C0392B",
  med: "#E67E22",
  low: "#27AE60",
  stat: "#7A1525",
  breach: "#C0392B",
  good: "#27AE60",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function HelpdeskPreview() {
  const [role, setRole] = useState<Role>("Agent");
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(false);

  // Auto-cycle role every 4 s for passive demo effect
  useEffect(() => {
    const t = setInterval(() => {
      setRole((r) => {
        const i = ROLES.indexOf(r);
        return ROLES[(i + 1) % ROLES.length];
      });
      setActive(0);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const tickets = TICKETS[role];

  return (
    <div className="hd-preview">
      {/* Top bar */}
      <div className="hd-topbar">
        <span className="hd-logo">Δ Helpdesk</span>
        <div className="hd-roles">
          {ROLES.map((r) => (
            <button
              key={r}
              className={`hd-role-btn${role === r ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setRole(r);
                setActive(0);
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list / stat cards */}
      <div className={`hd-body${pulse ? " hd-pulse" : ""}`}>
        {tickets.map((t, i) => (
          <div
            key={t.id}
            className={`hd-row${active === i ? " hd-row-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActive(i);
            }}
          >
            <span className="hd-dot" style={{ background: PRIORITY_DOT[t.priority] }} />
            <div className="hd-row-info">
              <span className="hd-tid">{t.id}</span>
              <span className="hd-ttitle">{t.title}</span>
            </div>
            <div className="hd-row-right">
              {t.sla && <span className="hd-sla">{t.sla}</span>}
              <span
                className="hd-status"
                style={{
                  background: STATUS_COLOR[t.status]
                    ? STATUS_COLOR[t.status] + "22"
                    : "rgba(255,255,255,0.06)",
                  color: STATUS_COLOR[t.status] ?? "var(--muted)",
                  borderColor: STATUS_COLOR[t.status] ?? "transparent",
                }}
              >
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom status bar */}
      <div className="hd-statusbar">
        <span className="hd-live">
          <span className="hd-live-dot" />
          Live · Realtime via Pusher
        </span>
        <span className="hd-wb">WA connected</span>
      </div>
    </div>
  );
}
