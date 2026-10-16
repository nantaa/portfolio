"use client";

import { useEffect, useRef, useState } from "react";

// ─── AI Expense Tracker — Architectural Communication Data Nodes Illustration ─
// Replaces cluttered mock buttons and oversized icons with an authentic,
// high-impact architectural schematic illustrating the end-to-end communication
// flow between Client Ingest, Express Gateway, Gemini 2.0 Flash, and Prisma Ledger.

interface ArchNode {
  id: string;
  num: string;
  title: string;
  stack: string;
  role: string;
  latency: string;
  status: "ACTIVE" | "VERIFIED" | "INFERENCE";
  xNorm: number;
  yNorm: number;
}

const NODES: ArchNode[] = [
  {
    id: "ingest",
    num: "01",
    title: "Client Ingest",
    stack: "Next.js 16 / React 19",
    role: "Multipart Receipt Buffer (<10MB)",
    latency: "0ms",
    status: "ACTIVE",
    xNorm: 0.14,
    yNorm: 0.38,
  },
  {
    id: "gateway",
    num: "02",
    title: "Express Gateway",
    stack: "Node.js · Multer Ingest",
    role: "Buffer Stream & Auth Token Middleware",
    latency: "8ms",
    status: "ACTIVE",
    xNorm: 0.38,
    yNorm: 0.38,
  },
  {
    id: "gemini",
    num: "03",
    title: "Gemini 2.0 Flash",
    stack: "@google/generative-ai",
    role: "Multimodal Vision OCR & JSON Schema",
    latency: "~820ms",
    status: "INFERENCE",
    xNorm: 0.63,
    yNorm: 0.38,
  },
  {
    id: "prisma",
    num: "04",
    title: "Database Ledger",
    stack: "Prisma ORM · PostgreSQL",
    role: "ACID Structured Record Persistence",
    latency: "12ms",
    status: "VERIFIED",
    xNorm: 0.88,
    yNorm: 0.38,
  },
];

interface SamplePayload {
  merchant: string;
  amount: string;
  category: string;
  confidence: string;
  reasoning: string;
}

const SAMPLE_PAYLOADS: SamplePayload[] = [
  {
    merchant: "Whole Foods Market",
    amount: "$64.20",
    category: "Food & Dining",
    confidence: "98.4%",
    reasoning: "Itemized grocery produce & bakery goods identified on receipt invoice",
  },
  {
    merchant: "AWS Cloud Infrastructure",
    amount: "$142.30",
    category: "Infrastructure",
    confidence: "99.1%",
    reasoning: "Monthly EC2 compute & S3 storage allocation invoice",
  },
  {
    merchant: "Grab Urban Transport",
    amount: "$18.50",
    category: "Transport",
    confidence: "96.8%",
    reasoning: "Direct passenger trip receipt with distance metadata",
  },
];

export default function ExpenseTrackerPreview() {
  const [activeNodeId, setActiveNodeId] = useState<string>("gemini");
  const [payloadIndex, setPayloadIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePayload = SAMPLE_PAYLOADS[payloadIndex % SAMPLE_PAYLOADS.length];
  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[2];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;

    const packets = [
      { from: 0, to: 1, t: 0.1, speed: 0.007 },
      { from: 1, to: 2, t: 0.45, speed: 0.006 },
      { from: 2, to: 3, t: 0.78, speed: 0.008 },
    ];

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(container);

    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      NODES.forEach((n) => {
        const nx = n.xNorm * width;
        const ny = n.yNorm * height;
        const dist = Math.hypot(nx - px, ny - py);
        if (dist <= 38) {
          setActiveNodeId(n.id);
          setPayloadIndex((prev) => prev + 1);
        }
      });
    };

    container.addEventListener("pointerdown", onPointerDown);

    const render = () => {
      animId = requestAnimationFrame(render);
      frame++;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Coordinate Bus Grid ──
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ── 2. Data Communication Bus Line ──
      ctx.strokeStyle = "rgba(122, 21, 37, 0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(NODES[0].xNorm * width, NODES[0].yNorm * height);
      ctx.lineTo(NODES[NODES.length - 1].xNorm * width, NODES[NODES.length - 1].yNorm * height);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── 3. Animated Data Packets Flow ──
      packets.forEach((p) => {
        p.t = (p.t + p.speed) % 1;
        const n1 = NODES[p.from];
        const n2 = NODES[p.to];
        const sx = n1.xNorm * width;
        const sy = n1.yNorm * height;
        const tx = n2.xNorm * width;
        const ty = n2.yNorm * height;

        const px = sx + (tx - sx) * p.t;
        const py = sy + (ty - sy) * p.t;

        // Packet Core
        ctx.fillStyle = "#EEEBE5";
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Packet Glow
        ctx.fillStyle = "rgba(155, 30, 48, 0.6)";
        ctx.beginPath();
        ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── 4. Render Architectural Nodes ──
      NODES.forEach((node) => {
        const nx = node.xNorm * width;
        const ny = node.yNorm * height;
        const isSelected = activeNodeId === node.id;

        const boxW = 82;
        const boxH = 46;
        const bx = nx - boxW * 0.5;
        const by = ny - boxH * 0.5;

        // Pulse ring on selected
        if (isSelected) {
          const pulseR = 28 + Math.sin(frame * 0.08) * 3;
          ctx.strokeStyle = "rgba(155, 30, 48, 0.45)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Node Card Fill & Stroke
        ctx.fillStyle = isSelected ? "rgba(122, 21, 37, 0.35)" : "rgba(12, 13, 14, 0.88)";
        ctx.strokeStyle = isSelected ? "#9B1E30" : "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeRect(bx, by, boxW, boxH);

        // Status Indicator Dot
        ctx.fillStyle = node.status === "ACTIVE" ? "#2ECC71" : node.status === "INFERENCE" ? "#E67E22" : "#3498DB";
        ctx.beginPath();
        ctx.arc(bx + 6, by + 6, 2, 0, Math.PI * 2);
        ctx.fill();

        // Node Title
        ctx.font = "bold 8px 'Syne', sans-serif";
        ctx.fillStyle = "#EEEBE5";
        ctx.textAlign = "center";
        ctx.fillText(node.title, nx, by + 16);

        // Tech Subtitle
        ctx.font = "6.5px 'Syne Mono', monospace";
        ctx.fillStyle = isSelected ? "#E67E22" : "#888880";
        ctx.fillText(node.stack, nx, by + 28);

        // Latency / Role Pill
        ctx.font = "6px 'Syne Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.fillText(node.latency, nx, by + 38);
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
    };
  }, [activeNodeId]);

  return (
    <div
      ref={containerRef}
      className="et-preview"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0b0c",
        fontFamily: "var(--mono)",
        padding: "16px 20px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── Top Header / Communication Bus Telemetry ── */}
      <div
        className="et-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "8px",
          borderBottom: "0.5px solid rgba(255, 255, 255, 0.08)",
          fontSize: "8.5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7a1525", display: "inline-block" }} />
          <span style={{ color: "#EEEBE5", fontWeight: 700, letterSpacing: "0.14em" }}>
            DATA COMMUNICATION BUS // PIPELINE FLOW
          </span>
          <span
            style={{
              fontSize: "7.5px",
              background: "rgba(122, 21, 37, 0.3)",
              border: "0.5px solid #7a1525",
              color: "#EEEBE5",
              padding: "1px 6px",
              borderRadius: "2px",
            }}
          >
            gemini-2.0-flash
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", fontSize: "7.5px", color: "#888880" }}>
          <span>THROUGHPUT: ~820ms</span>
          <span style={{ color: "#2ECC71", fontWeight: 700 }}>SCHEMA: VALIDATED</span>
        </div>
      </div>

      {/* ── Main Canvas View: Interactive Architecture Bus ── */}
      <div style={{ position: "relative", flex: 1, minHeight: "140px", cursor: "crosshair" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>

      {/* ── Active Node & Live Payload Inspector ── */}
      <div
        style={{
          background: "rgba(14, 15, 17, 0.94)",
          border: "0.5px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "3px",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginTop: "6px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "7.5px" }}>
          <span style={{ color: "#9b1e30", fontWeight: 700, letterSpacing: "0.12em" }}>
            NODE [{activeNode.num}] {activeNode.title.toUpperCase()} · {activeNode.role}
          </span>
          <span style={{ color: "#888880" }}>
            CLICK NODES TO INSPECT PAYLOADS
          </span>
        </div>

        {/* Real Structured JSON Schema Telemetry */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            border: "0.5px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "2px",
            padding: "6px 8px",
            fontSize: "7.5px",
            lineHeight: "1.4",
            color: "#D1D5DB",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
            <span style={{ color: "#EEEBE5", fontWeight: 600 }}>
              {activePayload.merchant} · <span style={{ color: "#E67E22" }}>{activePayload.category}</span>
            </span>
            <span style={{ color: "#EEEBE5", fontWeight: 700 }}>
              amount: {activePayload.amount}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#888880", fontSize: "7px" }}>
            <span>reasoning: &ldquo;{activePayload.reasoning}&rdquo;</span>
            <span style={{ color: "#2ECC71", fontWeight: 600, marginLeft: "8px", flexShrink: 0 }}>
              confidence: {activePayload.confidence}
            </span>
          </div>
        </div>

        {/* Fast Node Selector Strip */}
        <div style={{ display: "flex", gap: "6px" }}>
          {NODES.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveNodeId(n.id);
                setPayloadIndex((prev) => prev + 1);
              }}
              style={{
                flex: 1,
                padding: "3px 4px",
                fontSize: "7px",
                fontFamily: "var(--mono)",
                background: activeNodeId === n.id ? "#7a1525" : "rgba(255, 255, 255, 0.04)",
                color: activeNodeId === n.id ? "#FFF" : "#888880",
                border: "0.5px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              [{n.num}] {n.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
