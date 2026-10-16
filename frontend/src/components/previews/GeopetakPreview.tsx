"use client";

import { useEffect, useRef } from "react";
import ProjectPreviewGate from "./ProjectPreviewGate";

// ─── Geopetak — 3-Layer Canvas XRay Tile Effect ──────────────────────────────
// Ported directly from HeroXray.vue in the Geopetak project.
// Default: real aerial city photo (geopetak-hero.webp)
// On hover: tiles reveal mesh wireframe or B&W xray layers from the canvas

function GeopetakStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;

    const C = {
      sz: 32,
      rX: 0.1, dX: 0.18,
      rF: 0.1, dF: 0.18,
      tA: 0.92,
      tSC: "rgba(255,255,255,0.35)",
      tSW: 1,
      fF: "rgba(255,255,255,0.04)",
      fS_color: "rgba(255,255,255,0.12)",
      dC: "#FFFFFF",
      dSz: 8,
      uT: 0.02,
      mF: 0.06,
      iC: 0.01,
      iDel: 900,
      iOut: 0.06,
      iIn: 0.14,
    };

    // Layer 1 = Saturated aerial, Layer 2 = X-Ray monochrome, Layer 3 = GIS Vector Mesh
    const imageUrls = [
      "/images/projects/bekasi_saturated.jpg",
      "/images/projects/bekasi_xray.jpg",
      "/images/projects/bekasi_mesh.jpg",
    ];
    const imgs: HTMLImageElement[] = [];

    let on = false, rndr = false;
    let rafId = 0;
    let rect = container.getBoundingClientRect();
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0, rows = 0;

    type Cell = {
      c: number; r: number; x: number; y: number;
      xS: number; fS: number; l: number; type: string;
      lg: boolean; cv: boolean; keep: boolean; hD: boolean;
    };
    let cells: Cell[] = [];
    let meta: { img: HTMLImageElement; sX: number; sY: number; oX: number; oY: number }[] = [];

    let ptr = { x: -9e3, y: -9e3, act: false };
    let lC = -9e3, lR = -9e3;
    let lT = performance.now();
    let gF = 1;

    const clamp = (v: number, n: number, x: number) => Math.max(n, Math.min(x, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const getC = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < cols && y < rows ? cells[y * cols + x] : null;

    function getCoverMeta(img: HTMLImageElement) {
      const iRatio = img.naturalWidth / img.naturalHeight;
      const bRatio = rect.width / rect.height;
      let sX: number, sY: number, oX = 0, oY = 0;
      if (iRatio > bRatio) {
        sY = sX = img.naturalHeight / rect.height;
        oX = (rect.height * iRatio - rect.width) / 2;
      } else {
        sX = sY = img.naturalWidth / rect.width;
        oY = (rect.width / iRatio - rect.height) / 2;
      }
      return { img, sX, sY, oX, oY };
    }

    function rs() {
      rect = container!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / C.sz);
      rows = Math.ceil(h / C.sz);
      cells = Array.from({ length: cols * rows }, (_, i) => ({
        c: i % cols, r: Math.floor(i / cols),
        x: (i % cols) * C.sz, y: Math.floor(i / cols) * C.sz,
        xS: 0, fS: 0, l: 1, type: "", lg: false, cv: false, keep: false, hD: false,
      }));
      meta = imgs.map((img) => getCoverMeta(img));
    }

    function applyBrush(cx: number, cy: number) {
      const center = getC(cx, cy);
      if (!center) return;
      const r = getC(cx + 1, cy), b = getC(cx, cy + 1), br = getC(cx + 1, cy + 1);
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nb = getC(cx + dx, cy + dy);
          if (nb?.lg) nb.lg = false;
        }
      const baseLayer = center.type === "X" ? center.l : (Math.floor(Math.random() * imgs.length) + 1) % (imgs.length + 1) || 1;
      if (r && b && br) {
        [center, r, b, br].forEach((cl) => { cl.l = baseLayer; cl.type = "X"; cl.keep = true; cl.hD = false; cl.lg = false; });
        center.lg = true;
      } else {
        center.l = baseLayer; center.type = "X"; center.keep = true; center.lg = false; center.hD = false;
      }
      const ring = [
        getC(cx - 1, cy), getC(cx - 1, cy + 1), getC(cx, cy - 1), getC(cx + 1, cy - 1),
        getC(cx + 2, cy), getC(cx + 2, cy + 1), getC(cx, cy + 2), getC(cx + 1, cy + 2),
      ].filter(Boolean) as Cell[];
      const free = ring.filter(cell => !(cell.keep && cell.type === "X"));
      const pool = free.length >= 4 ? free : ring.filter(cell => cell !== center && cell !== r && cell !== b && cell !== br);
      const shuffled = pool.slice().sort(() => Math.random() - 0.5);
      const smalls = shuffled.slice(0, 1);
      const empties = shuffled.slice(1, 4);
      const layers = [1, 2, 3].sort(() => Math.random() - 0.5);
      smalls.forEach((cell, i) => { if (cell.type !== "X") cell.l = layers[i % layers.length]; cell.type = "X"; cell.keep = true; cell.lg = false; cell.hD = false; });
      empties.forEach((cell, i) => {
        if (cell.keep && cell.type === "X") return;
        cell.type = "F"; cell.keep = true; cell.lg = false;
        if (i === 0) { cells.forEach(x => x.hD = false); cell.hD = true; }
      });
    }

    function spwn(cC: number, cR: number) {
      if (cC === lC && cR === lR) return;
      if (lC !== -9e3) {
        const dx = cC - lC, dy = cR - lR;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 1; i <= steps; i++)
          applyBrush(Math.round(lC + dx * (i / steps)), Math.round(lR + dy * (i / steps)));
      } else applyBrush(cC, cR);
      lC = cC; lR = cR;
    }

    function drw() {
      if (!on) { rndr = false; rafId = 0; return; }
      ctx.clearRect(0, 0, rect.width, rect.height);
      const nw = performance.now();
      if (ptr.act) spwn(Math.floor(ptr.x / C.sz), Math.floor(ptr.y / C.sz));
      gF = lerp(gF, ptr.act && nw - lT < C.iDel ? 1 : 0, ptr.act && nw - lT < C.iDel ? C.iIn : C.iOut);
      cells.forEach((cl) => {
        if (cl.keep) {
          const dist = Math.max(Math.abs(cl.c - lC), Math.abs(cl.r - lR));
          if (!ptr.act || dist > 2) cl.keep = false;
        }
        const tX = cl.keep && cl.type === "X" ? 1 : 0;
        const tF = cl.keep && cl.type === "F" ? 1 : 0;
        cl.xS = lerp(cl.xS, tX, tX > cl.xS ? C.rX : C.dX);
        cl.fS = lerp(cl.fS, tF, tF > cl.fS ? C.rF : C.dF);
        if (cl.xS <= C.uT && cl.fS <= C.uT) { cl.type = ""; cl.lg = false; cl.cv = false; cl.keep = false; cl.hD = false; }
      });
      cells.forEach((cl) => {
        if (cl.lg && cl.xS > C.uT) {
          const r = getC(cl.c + 1, cl.r), b = getC(cl.c, cl.r + 1), br = getC(cl.c + 1, cl.r + 1);
          if (!r || !b || !br || r.type !== "X" || b.type !== "X" || br.type !== "X" || r.l !== cl.l || b.l !== cl.l || br.l !== cl.l) {
            cl.lg = false;
            [cl, r, b, br].filter((s): s is Cell => !!s && !s.keep && s.type === "X").forEach(s => { s.type = ""; s.xS *= 0.4; });
          }
        }
      });
      cells.forEach(cl => cl.cv = false);
      cells.forEach(cl => {
        if (cl.lg && cl.xS > C.uT) {
          const r = getC(cl.c + 1, cl.r), b = getC(cl.c, cl.r + 1), br = getC(cl.c + 1, cl.r + 1);
          if (r) r.cv = true; if (b) b.cv = true; if (br) br.cv = true;
        }
      });
      cells.forEach(cl => {
        if (!cl.cv && cl.xS >= 0.03) {
          const ds = cl.lg ? C.sz * 2 : C.sz;
          const is = C.tSW / 2;
          let va = cl.xS;
          if (cl.lg) {
            const r = getC(cl.c + 1, cl.r), b = getC(cl.c, cl.r + 1), br = getC(cl.c + 1, cl.r + 1);
            if (r && b && br) va = (cl.xS + r.xS + b.xS + br.xS) / 4;
          }
          ctx.globalAlpha = va * C.tA * gF;
          const m = meta[cl.l - 1];
          if (m?.img?.naturalWidth) {
            let sx = (cl.x + m.oX) * m.sX, sy = (cl.y + m.oY) * m.sY;
            let sw = ds * m.sX, sh = ds * m.sY;
            let dx = cl.x, dy = cl.y;
            if (sx < 0) { sw += sx; dx -= sx / m.sX; sx = 0; }
            if (sy < 0) { sh += sy; dy -= sy / m.sY; sy = 0; }
            if (sw > 0 && sh > 0)
              ctx.drawImage(m.img, sx, sy, Math.min(sw, m.img.naturalWidth - sx), Math.min(sh, m.img.naturalHeight - sy), dx, dy, sw / m.sX, sh / m.sY);
          }
          ctx.globalAlpha = va * gF;
          ctx.strokeStyle = C.tSC; ctx.lineWidth = C.tSW;
          ctx.strokeRect(cl.x + is, cl.y + is, ds - C.tSW, ds - C.tSW);
        }
        if (!cl.cv && !cl.lg && cl.fS >= C.mF && cl.xS <= 0.15) {
          ctx.globalAlpha = cl.fS * gF;
          ctx.fillStyle = C.fF; ctx.strokeStyle = C.fS_color; ctx.lineWidth = 1;
          ctx.fillRect(cl.x + 0.5, cl.y + 0.5, C.sz - 1, C.sz - 1);
          ctx.strokeRect(cl.x + 0.5, cl.y + 0.5, C.sz - 1, C.sz - 1);
          ctx.fillStyle = C.dC;
          const hf = (C.dSz * (1 - Math.pow(1 - clamp(cl.fS, 0, 1), 3))) / 2;
          if (hf > 0.01) {
            [[cl.x, cl.y], [cl.x + C.sz, cl.y], [cl.x, cl.y + C.sz], [cl.x + C.sz, cl.y + C.sz]].forEach(([dx, dy]) => {
              ctx.beginPath(); ctx.moveTo(dx, dy - hf); ctx.lineTo(dx + hf, dy);
              ctx.lineTo(dx, dy + hf); ctx.lineTo(dx - hf, dy); ctx.fill();
            });
          }
        }
      });
      ctx.globalAlpha = 1;
      if (ptr.act || gF > 0.01 || cells.some(x => Math.max(x.xS, x.fS) > C.iC)) {
        rafId = requestAnimationFrame(drw);
      } else { rndr = false; rafId = 0; }
    }

    const handleMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.act = true;
      lT = performance.now(); gF = 1;
      if (!rndr) { rndr = true; drw(); }
    };
    const handleLeave = () => { ptr.act = false; lC = lR = -9e3; };

    Promise.all(
      imageUrls.map(url => {
        const img = new Image();
        img.src = url;
        imgs.push(img);
        return new Promise<void>(res => { img.onload = img.onerror = () => res(); });
      })
    ).then(() => {
      on = true;
      rs();
      container.addEventListener("pointermove", handleMove, { passive: true });
      container.addEventListener("pointerleave", handleLeave, { passive: true });
      rndr = true;
      drw();
    });

    const resizeObs = new ResizeObserver(() => { rs(); if (!rndr) { rndr = true; drw(); } });
    resizeObs.observe(container);

    return () => {
      on = false;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObs.disconnect();
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="gp-preview">
      {/* Real aerial city photo — the default "physical" layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/projects/bekasi_saturated.jpg" alt="Bekasi Spatial GIS" className="gp-base-img" />

      {/* Interactive XRay canvas — mesh/xray tiles appear on hover */}
      <canvas ref={canvasRef} className="gp-canvas" />

      {/* Layer legend */}
      <div className="gp-legend">
        <span className="gp-legend-dot" style={{ background: "#3af" }} />
        <span className="gp-legend-dot" style={{ background: "#fff" }} />
        <span className="gp-legend-dot" style={{ background: "#8f4" }} />
      </div>

      {/* Label */}
      <div className="gp-label">
        <span className="gp-label-title">Geopetak</span>
        <span className="gp-label-sub">Bekasi Aerial Photo Sample · 3 data layers</span>
      </div>
    </div>
  );
}

export default function GeopetakPreview() {
  return (
    <ProjectPreviewGate
      title="Geopetak Spatial GIS Engine"
      category="Spatial AI & GIS"
      specs="Vue 3 · Three.js Canvas · 3-Layer Spatial X-Ray · GSAP · Sample: Bekasi Aerial Photo"
      description="Interactive multi-layer geospatial interface utilizing a real-world Bekasi Aerial Photo sample to reveal physical aerial photography, underground infrastructure, and vector cadastral mesh layers."
      actionLabel="▶ Inspect GIS Layers"
      actionSubtext="Interactive 3-layer canvas inspection · Bekasi Aerial Photo Sample"
      badge="STANDBY · ON DEMAND"
      accentColor="#0ea5e9"
      accentSoft="rgba(14, 165, 233, 0.15)"
      backdropPattern={
        <div className="font-mono text-xs text-cyan-500/10 tracking-widest uppercase">
          BEKASI CADASTRE · BEKASI AERIAL PHOTO SAMPLE · 06°14'S 107°00'E
        </div>
      }
    >
      <GeopetakStage />
    </ProjectPreviewGate>
  );
}
