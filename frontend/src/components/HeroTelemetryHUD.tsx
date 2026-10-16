"use client";

import { useEffect, useRef, useState } from "react";

// ─── Authentic System Architecture Topology & Telemetry HUD ──────────────────
// Features:
// 1. Dual HUD modes: TOPOLOGY (animated interactive architecture) & TELEMETRY (benchmarks matrix)
// 2. 4 Authentic Engineering Stacks:
//    - Industrial K3 Statutory Compliance (Laravel 11, React 19, PostgreSQL, Redis)
//    - Procedural 3D & GLSL Shaders (Parametric SDF, Vertex Wave, Caustics, ACES Filmic)
//    - Interactive 3D Bag Showcase Landing Page (GLTF / GLB binary mesh, RoomEnvironment IBL, Orbit stage)
//    - Discrete Optimization (Gale-Shapley matching, Hungarian matrix, 9-stage Markov Chain)
// 3. Elastic spring physics kinematics (vx, vy, Hooke's law), draggable nodes, and shockwave ripples
// 4. Animated data packets/pulses traveling along architectural buses

type HUDMode = "TOPOLOGY" | "TELEMETRY";
type ArchitectureKey = "K3_ENTERPRISE" | "SHADER_PIPELINE" | "SHOWCASE_3D_LANDING" | "DISCRETE_OPT";

interface PipelineNode {
  id: string;
  name: string;
  tech: string;
  role: string;
  status: "ACTIVE" | "VERIFIED" | "OPTIMIZED";
  homeNormX: number; // 0 to 1
  homeNormY: number; // 0 to 1
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ArchitectureSchematic {
  key: ArchitectureKey;
  code: string;
  title: string;
  category: string;
  summary: string;
  throughput: string;
  latency: string;
  initialNodes: Omit<PipelineNode, "x" | "y" | "vx" | "vy">[];
  connections: [number, number][]; // index pairs connecting nodes
}

const ARCHITECTURES: ArchitectureSchematic[] = [
  {
    key: "K3_ENTERPRISE",
    code: "ARCH-01",
    title: "Industrial K3 Statutory Compliance Engine",
    category: "ENTERPRISE EVENT-DRIVEN BACKEND",
    summary: "Disnaker PJK3 statutory lifecycle with ACID immutable audit ledger and real-time inspector updates.",
    throughput: "1,200 req/sec",
    latency: "14ms p99",
    initialNodes: [
      { id: "k1", name: "Client Workspace", tech: "React 19 & Tailwind", role: "Optimistic UI State", status: "ACTIVE", homeNormX: 0.12, homeNormY: 0.35 },
      { id: "k2", name: "WebSocket Gateway", tech: "Echo / Pusher Protocol", role: "Bidirectional Pub/Sub", status: "ACTIVE", homeNormX: 0.36, homeNormY: 0.35 },
      { id: "k3", name: "State Machine", tech: "Laravel 11 Core", role: "16-Stage Transition Validator", status: "VERIFIED", homeNormX: 0.62, homeNormY: 0.35 },
      { id: "k4", name: "Compliance Ledger", tech: "PostgreSQL 16", role: "ACID Audit Trail", status: "VERIFIED", homeNormX: 0.88, homeNormY: 0.22 },
      { id: "k5", name: "Background Jobs", tech: "Redis Queue", role: "Statutory PDF & SLA Dispatch", status: "OPTIMIZED", homeNormX: 0.88, homeNormY: 0.48 },
    ],
    connections: [
      [0, 1], // Client -> WebSocket
      [1, 2], // WebSocket -> Laravel
      [2, 3], // Laravel -> PostgreSQL
      [2, 4], // Laravel -> Redis
    ],
  },
  {
    key: "SHADER_PIPELINE",
    code: "ARCH-02",
    title: "Procedural 3D & GLSL Shader Pipeline",
    category: "CREATIVE GRAPHICS & GPU RENDERING",
    summary: "Parametric geometry displacement with real-time caustics, dual-depth Fresnel reflection, and ACES tonemapping.",
    throughput: "60 FPS Constant",
    latency: "1.8ms Frame Time",
    initialNodes: [
      { id: "s1", name: "Parametric SDF", tech: "Three.js PlaneGeometry", role: "Dense Subdivided Mesh", status: "ACTIVE", homeNormX: 0.12, homeNormY: 0.35 },
      { id: "s2", name: "Vertex Wave Shader", tech: "GLSL Wave Function", role: "Multi-Octave Ocean Sine", status: "OPTIMIZED", homeNormX: 0.38, homeNormY: 0.35 },
      { id: "s3", name: "Caustic & Fresnel", tech: "GLSL Fragment Shader", role: "Internal Light Scattering", status: "VERIFIED", homeNormX: 0.65, homeNormY: 0.35 },
      { id: "s4", name: "Post-Processing", tech: "ACES Filmic & Tone Mapping", role: "Dynamic Atmospheric Color", status: "VERIFIED", homeNormX: 0.88, homeNormY: 0.35 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    key: "SHOWCASE_3D_LANDING",
    code: "ARCH-03",
    title: "Interactive 3D Bag Showcase Landing Page",
    category: "3D WEB & PRODUCT SHOWCASE LANDING PAGE",
    summary: "High-conversion product showcase landing page featuring compressed GLTF streaming, RoomEnvironment reflections, and real-time 3D bag orbit interaction.",
    throughput: "1.8MB Bundle Limit",
    latency: "0-Lag Touch Orbit",
    initialNodes: [
      { id: "t1", name: "Compressed Bag Mesh", tech: "GLTF / GLB Buffer", role: "Meshopt & Draco Compression", status: "ACTIVE", homeNormX: 0.12, homeNormY: 0.35 },
      { id: "t2", name: "Asset Streaming", tech: "GLTFLoader Stream", role: "Progressive Chunk Decoupling", status: "ACTIVE", homeNormX: 0.38, homeNormY: 0.35 },
      { id: "t3", name: "Studio Lighting", tech: "RoomEnvironment IBL", role: "HDR Studio Reflections", status: "OPTIMIZED", homeNormX: 0.64, homeNormY: 0.22 },
      { id: "t4", name: "Orbit Kinematics", tech: "Spherical Controller", role: "Inertial Pointer Capture", status: "ACTIVE", homeNormX: 0.64, homeNormY: 0.48 },
      { id: "t5", name: "Showcase Landing Page", tech: "Vue 3 · Three.js 60fps", role: "Interactive 3D Hero Stage", status: "VERIFIED", homeNormX: 0.88, homeNormY: 0.35 },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
    ],
  },
  {
    key: "DISCRETE_OPT",
    code: "ARCH-04",
    title: "Discrete Optimization & Matching Network",
    category: "COMBINATORIAL ALGORITHMS & MARKOV CHAINS",
    summary: "Polynomial-time stable bipartite matching coupled with Hungarian cost assignment and 9-stage state transition validation.",
    throughput: "88 Passing Tests",
    latency: "<180ms Batch Match",
    initialNodes: [
      { id: "m1", name: "Bipartite Proposers", tech: "Student & Faculty Pools", role: "Ranked Preference Vectors", status: "ACTIVE", homeNormX: 0.12, homeNormY: 0.35 },
      { id: "m2", name: "Gale-Shapley Matcher", tech: "Deferred Acceptance", role: "Stable Blocking Pair Elimination", status: "VERIFIED", homeNormX: 0.40, homeNormY: 0.22 },
      { id: "m3", name: "Hungarian Matrix", tech: "Cost-Matrix Solver", role: "Global Minima Optimization", status: "OPTIMIZED", homeNormX: 0.40, homeNormY: 0.48 },
      { id: "m4", name: "Markov Verifier", tech: "9-Stage Markov Chain", role: "Deadlock-Free State Traversal", status: "VERIFIED", homeNormX: 0.70, homeNormY: 0.35 },
      { id: "m5", name: "Docket Registry", tech: "Disnaker / Academic DB", role: "Statutory Defense Docket", status: "ACTIVE", homeNormX: 0.90, homeNormY: 0.35 },
    ],
    connections: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ],
  },
];

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface AnimatedPacket {
  connIndex: number;
  t: number;
  speed: number;
}

export default function HeroTelemetryHUD() {
  const [mode, setMode] = useState<HUDMode>("TOPOLOGY");
  const [activeKey, setActiveKey] = useState<ArchitectureKey>("K3_ENTERPRISE");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeArch = ARCHITECTURES.find((a) => a.key === activeKey) || ARCHITECTURES[0];

  // Dynamic spring physics state for the active architecture nodes
  const nodesRef = useRef<PipelineNode[]>([]);

  // Synchronize nodes on architecture change
  useEffect(() => {
    nodesRef.current = activeArch.initialNodes.map((n) => ({
      ...n,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }));
  }, [activeKey, activeArch]);

  useEffect(() => {
    if (mode !== "TOPOLOGY") return;
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

    let draggedNodeIndex: number | null = null;
    let mouse = { x: -9999, y: -9999, isDown: false };
    const ripples: Shockwave[] = [];

    // Animated packets on connections
    const packets: AnimatedPacket[] = activeArch.connections.map((_, i) => ({
      connIndex: i,
      t: (i * 0.25) % 1,
      speed: 0.006 + (i % 3) * 0.002,
    }));

    // Spring constants for elastic kinematics
    const SPRING_CONSTANT = 0.045;
    const DAMPING = 0.86;

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

      nodesRef.current.forEach((node) => {
        if (node.x === 0 && node.y === 0) {
          node.x = node.homeNormX * width;
          node.y = node.homeNormY * height;
        }
      });
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(container);

    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      mouse.x = px;
      mouse.y = py;
      mouse.isDown = true;

      let hit = -1;
      nodesRef.current.forEach((n, idx) => {
        const dist = Math.hypot(n.x - px, n.y - py);
        if (dist <= 35) hit = idx;
      });

      if (hit !== -1) {
        draggedNodeIndex = hit;
        setSelectedNodeId(nodesRef.current[hit].id);
      } else {
        // Shockwave ripple pulse on background click
        ripples.push({
          x: px,
          y: py,
          radius: 4,
          maxRadius: Math.min(width, height) * 0.45,
          opacity: 0.8,
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      mouse.x = px;
      mouse.y = py;

      if (draggedNodeIndex !== null) {
        const node = nodesRef.current[draggedNodeIndex];
        node.vx = (px - node.x) * 0.5;
        node.vy = (py - node.y) * 0.5;
        node.x = px;
        node.y = py;
      }
    };

    const onPointerUp = () => {
      mouse.isDown = false;
      draggedNodeIndex = null;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const render = () => {
      animId = requestAnimationFrame(render);
      frame++;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Update Spring Kinematics (Hooke's Spring Law) ──
      nodesRef.current.forEach((node, idx) => {
        if (idx !== draggedNodeIndex) {
          const homeX = node.homeNormX * width;
          const homeY = node.homeNormY * height;

          const forceX = (homeX - node.x) * SPRING_CONSTANT;
          const forceY = (homeY - node.y) * SPRING_CONSTANT;

          if (!mouse.isDown) {
            const mDist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
            if (mDist < 70 && mDist > 0) {
              const repel = (70 - mDist) * 0.03;
              node.vx += ((node.x - mouse.x) / mDist) * repel;
              node.vy += ((node.y - mouse.y) / mDist) * repel;
            }
          }

          node.vx = (node.vx + forceX) * DAMPING;
          node.vy = (node.vy + forceY) * DAMPING;
          node.x += node.vx;
          node.y += node.vy;
        }
      });

      // ── 2. Grid Background ──
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const step = 36;
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

      // ── 3. Shockwave Ripples ──
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 4.5;
        rip.opacity *= 0.94;

        ctx.strokeStyle = `rgba(155, 30, 48, ${rip.opacity * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (rip.opacity < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(r, 1);
        }
      }

      // ── 4. Main Topology Bus & Directed Pipeline Traces ──
      ctx.strokeStyle = "rgba(122, 21, 37, 0.22)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(width * 0.08, height * 0.35);
      ctx.lineTo(width * 0.92, height * 0.35);
      ctx.stroke();
      ctx.setLineDash([]);

      activeArch.connections.forEach(([sourceIdx, targetIdx]) => {
        const src = nodesRef.current[sourceIdx];
        const tgt = nodesRef.current[targetIdx];
        if (!src || !tgt) return;

        ctx.strokeStyle = "rgba(155, 30, 48, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
      });

      // ── 5. Data Packets Pulses Along Connections ──
      packets.forEach((p) => {
        p.t = (p.t + p.speed) % 1;
        const conn = activeArch.connections[p.connIndex];
        if (!conn) return;
        const src = nodesRef.current[conn[0]];
        const tgt = nodesRef.current[conn[1]];
        if (!src || !tgt) return;

        const px = src.x + (tgt.x - src.x) * p.t;
        const py = src.y + (tgt.y - src.y) * p.t;

        ctx.fillStyle = "rgba(238, 235, 229, 0.95)";
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(155, 30, 48, 0.55)";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── 6. Render Pipeline Nodes ──
      nodesRef.current.forEach((node, idx) => {
        const isSelected = selectedNodeId === node.id;
        const isDragged = draggedNodeIndex === idx;

        const boxW = 88;
        const boxH = 46;
        const bx = node.x - boxW * 0.5;
        const by = node.y - boxH * 0.5;

        // Pulse ring on selected or dragged
        if (isSelected || isDragged) {
          const pulseR = 30 + Math.sin(frame * 0.08) * 3;
          ctx.strokeStyle = "rgba(155, 30, 48, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isSelected ? "rgba(122, 21, 37, 0.35)" : "rgba(12, 13, 14, 0.88)";
        ctx.strokeStyle = isSelected ? "#9B1E30" : "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeRect(bx, by, boxW, boxH);

        // Status indicator
        ctx.fillStyle = node.status === "ACTIVE" ? "#2ECC71" : node.status === "VERIFIED" ? "#3498DB" : "#E67E22";
        ctx.beginPath();
        ctx.arc(bx + 6, by + 6, 2, 0, Math.PI * 2);
        ctx.fill();

        // Node title
        ctx.font = "bold 8.5px 'Syne', sans-serif";
        ctx.fillStyle = "#EEEBE5";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, by + 16);

        // Tech subtitle
        ctx.font = "7px 'Syne Mono', monospace";
        ctx.fillStyle = isSelected ? "#9B1E30" : "#888880";
        ctx.fillText(node.tech, node.x, by + 28);

        // Status label
        ctx.font = "6px 'Syne Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText(node.status, node.x, by + 38);
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [mode, activeKey, selectedNodeId, activeArch]);

  return (
    <div
      ref={containerRef}
      className="hero-telemetry-hud relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none"
    >
      {/* ── Top Header / Mode Switcher ── */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7a1525] animate-pulse"></span>
          <span className="text-neutral-200 font-bold tracking-wider uppercase">
            SYSTEM ARCHITECTURE {mode === "TOPOLOGY" ? `// TOPOLOGY [${activeArch.code}]` : "// TELEMETRY BENCHMARKS"}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#7a1525] font-bold tracking-widest hidden md:inline">
            BEKASI LATENCY: {activeArch.latency}
          </span>

          {/* Mode Switcher: TOPOLOGY vs TELEMETRY */}
          <div className="flex items-center border border-white/10 rounded-[2px] overflow-hidden bg-black/50">
            <button
              type="button"
              onClick={() => setMode("TOPOLOGY")}
              className={`px-2.5 py-1 text-[8.5px] uppercase tracking-wider transition-all cursor-pointer ${
                mode === "TOPOLOGY"
                  ? "bg-[#7a1525] text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              TOPOLOGY
            </button>
            <button
              type="button"
              onClick={() => setMode("TELEMETRY")}
              className={`px-2.5 py-1 text-[8.5px] uppercase tracking-wider transition-all cursor-pointer ${
                mode === "TELEMETRY"
                  ? "bg-[#7a1525] text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              TELEMETRY
            </button>
          </div>
        </div>
      </div>

      {/* ── Mode 1: TOPOLOGY Interactive Architecture ── */}
      {mode === "TOPOLOGY" && (
        <div className="relative flex-1 my-2 overflow-hidden min-h-[340px] flex flex-col justify-between cursor-crosshair">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Architecture Selector Tabs */}
          <div className="z-10 flex gap-1.5 self-start bg-black/60 p-1 border border-white/10 rounded-[2px] backdrop-blur-md">
            {ARCHITECTURES.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => {
                  setActiveKey(a.key);
                  setSelectedNodeId(null);
                }}
                className={`px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeKey === a.key
                    ? "bg-[#7a1525] text-white font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {a.code}
              </button>
            ))}
          </div>

          {/* Live Architecture Descriptor Box */}
          <div className="z-10 mt-auto p-5 sm:p-6 w-full max-w-[560px] bg-[#0c0d0e]/95 border border-white/12 backdrop-blur-md rounded-[3px] pointer-events-auto shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-mono text-[10.5px] sm:text-[11.5px]">
              <span className="text-[#9B1E30] font-bold uppercase tracking-wider">
                {activeArch.category}
              </span>
              <span className="text-neutral-400 font-mono">
                BUS: {activeArch.throughput}
              </span>
            </div>

            <div>
              <div className="text-[17px] sm:text-[20px] font-serif text-white font-bold tracking-tight">
                {activeArch.title}
              </div>
              <div className="text-[12px] sm:text-[13px] text-neutral-300 mt-1.5 leading-relaxed">
                {activeArch.summary}
              </div>
            </div>

            {/* Real stack indicators */}
            <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-white/10 font-mono text-[9px] sm:text-[10px]">
              {activeArch.initialNodes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(n.id);
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[2px] transition-all cursor-pointer ${
                    selectedNodeId === n.id
                      ? "bg-[#7a1525] text-white font-bold shadow-[0_0_12px_rgba(155,30,48,0.5)]"
                      : "bg-white/5 text-neutral-300 hover:bg-white/12 hover:text-white border border-white/5"
                  }`}
                >
                  {n.name} · {n.tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mode 2: TELEMETRY Production Matrix ── */}
      {mode === "TELEMETRY" && (
        <div className="relative flex-1 my-3 space-y-2 font-mono text-[10px] animate-fadeIn overflow-y-auto">
          <div className="text-[9px] text-neutral-500 uppercase tracking-widest pb-1 border-b border-white/5 flex justify-between">
            <span>Core Engineering Domains &amp; Production Scale</span>
            <span className="text-[#7a1525]">VERIFIED BENCHMARKS</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {ARCHITECTURES.map((arch) => (
              <div
                key={arch.key}
                className="p-3 bg-white/[0.02] border border-white/5 rounded-[2px] hover:border-white/15 transition-all"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-white mb-0.5">
                  <span className="text-[#f39c12]">[{arch.code}] {arch.category}</span>
                  <span className="text-[8px] text-neutral-400 font-normal">{arch.throughput}</span>
                </div>
                <div className="text-white text-xs font-serif mt-1 font-bold">{arch.title}</div>
                <div className="text-neutral-400 text-[10px] leading-relaxed mt-1">
                  Latency: <span className="text-neutral-200">{arch.latency}</span> · {arch.summary}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-white/[0.03] border border-white/10 rounded-[2px] flex justify-between items-center text-[9px]">
            <span className="text-white font-bold">● 350+ Passing Automated Tests</span>
            <span className="text-neutral-400">Zero SLA Calculation Errors</span>
            <span className="text-[#27ae60] font-bold">Production Verified</span>
          </div>
        </div>
      )}

      {/* ── Bottom Availability Status Ticker ── */}
      <div className="z-10 pt-3 border-t border-white/10 flex flex-wrap justify-between items-end font-mono text-[9px] text-neutral-400 tracking-wider">
        <span className="text-neutral-300">BEKASI, INDONESIA · 06°14&apos;S 107°00&apos;E</span>
        <span className="text-white font-bold">AVAILABLE FOR SYSTEMS ARCHITECTURE &amp; FULLSTACK ENGINEERING</span>
      </div>
    </div>
  );
}
