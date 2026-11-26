"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const IVORY = "#F7F4EE";
const BURGUNDY = "#800020";
const INK = "#1C1917";

interface SheetTextureEntry {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  tex: THREE.CanvasTexture;
  value: number;
}

interface PadRig {
  group: THREE.Group;
  anchorX: number;
  baseGeo: THREE.PlaneGeometry;
  frontMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  backMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  underMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  frontTex: SheetTextureEntry;
  underTex: SheetTextureEntry;
  basePositions: Float32Array;
  baseUvs: Float32Array;
  currentVal: number;
  flipProgress: number;
  flipDuration: number;
  isFlipping: boolean;
}

interface WaypointSpec {
  nx: number;
  docYVh: number;
  wz: number;
}

interface TrajectoryPreset {
  id: string;
  duration: number;
  waypoints: WaypointSpec[];
}

/**
 * 5 clean swept trajectories originating at the live SS pad corner plus
 * 2 downward cross-section paths traveling across Work, Disciplines, About, and Contact.
 * Positive depth wz keeps airborne cards above the calendar pads (z = 0) while canvas z-0 stays behind all DOM text.
 */
const TRAJECTORY_PRESETS: TrajectoryPreset[] = [
  // 1. Yellow: Upper-left sweep across Aryo Ananta / Rifa'i off top-left
  {
    id: "yellow-upper-left",
    duration: 4.5,
    waypoints: [
      { nx: 0.64, docYVh: 0.50, wz: 0.72 },
      { nx: 0.44, docYVh: 0.42, wz: 0.85 },
      { nx: 0.25, docYVh: 0.30, wz: 0.95 },
      { nx: 0.08, docYVh: 0.22, wz: 0.88 },
      { nx: -0.18, docYVh: 0.27, wz: 0.75 },
    ],
  },
  // 2. Dark Green: Lower sweep under calendar pads, behind CTA buttons off bottom-left
  {
    id: "green-lower-left",
    duration: 4.7,
    waypoints: [
      { nx: 0.72, docYVh: 0.71, wz: 0.68 },
      { nx: 0.50, docYVh: 0.80, wz: 0.82 },
      { nx: 0.30, docYVh: 0.67, wz: 0.92 },
      { nx: 0.12, docYVh: 0.75, wz: 0.88 },
      { nx: -0.18, docYVh: 0.94, wz: 0.76 },
    ],
  },
  // 3. Light Lime: Orbit loop swooping across and over calendar pads, exiting right
  {
    id: "lime-calendar-orbit",
    duration: 4.3,
    waypoints: [
      { nx: 0.69, docYVh: 0.64, wz: 0.74 },
      { nx: 0.55, docYVh: 0.58, wz: 0.96 },
      { nx: 0.63, docYVh: 0.43, wz: 1.12 },
      { nx: 0.79, docYVh: 0.40, wz: 1.08 },
      { nx: 0.96, docYVh: 0.45, wz: 0.90 },
      { nx: 1.18, docYVh: 0.49, wz: 0.72 },
    ],
  },
  // 4. Pink: Clockwise upper-right loop behind AVAILABLE FOR WORK nav button
  {
    id: "pink-top-right-loop",
    duration: 4.1,
    waypoints: [
      { nx: 0.76, docYVh: 0.38, wz: 0.76 },
      { nx: 0.74, docYVh: 0.19, wz: 0.95 },
      { nx: 0.86, docYVh: 0.05, wz: 1.05 },
      { nx: 1.02, docYVh: 0.14, wz: 0.92 },
      { nx: 1.18, docYVh: 0.34, wz: 0.74 },
    ],
  },
  // 5. Cyan: Clean brisk peel down-right off Hero corner
  {
    id: "cyan-bottom-right",
    duration: 2.9,
    waypoints: [
      { nx: 0.86, docYVh: 0.68, wz: 0.68 },
      { nx: 0.92, docYVh: 0.81, wz: 0.78 },
      { nx: 1.18, docYVh: 0.86, wz: 0.74 },
    ],
  },
  // 6. Cross-section glide left: Travels down across Work -> Disciplines -> About
  {
    id: "cascade-section-left",
    duration: 9.6,
    waypoints: [
      { nx: 0.76, docYVh: 0.82, wz: 0.72 },
      { nx: 0.54, docYVh: 1.18, wz: 0.88 },
      { nx: 0.26, docYVh: 1.62, wz: 0.98 },
      { nx: 0.62, docYVh: 2.18, wz: 0.90 },
      { nx: 0.22, docYVh: 2.74, wz: 0.84 },
      { nx: 0.48, docYVh: 3.45, wz: 0.75 },
    ],
  },
  // 7. Cross-section glide right: Travels down across Disciplines -> About -> Contact
  {
    id: "cascade-section-right",
    duration: 10.4,
    waypoints: [
      { nx: 0.80, docYVh: 0.90, wz: 0.72 },
      { nx: 0.68, docYVh: 1.40, wz: 0.86 },
      { nx: 0.38, docYVh: 1.95, wz: 0.96 },
      { nx: 0.74, docYVh: 2.55, wz: 0.90 },
      { nx: 0.34, docYVh: 3.15, wz: 0.84 },
      { nx: 0.64, docYVh: 3.95, wz: 0.75 },
    ],
  },
];

interface AirborneSheet {
  group: THREE.Group;
  frontTex: SheetTextureEntry;
  frontMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  backMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  geo: THREE.PlaneGeometry;
  basePositions: Float32Array;
  baseUvs: Float32Array;
  curve: THREE.CatmullRomCurve3 | null;
  active: boolean;
  age: number;
  duration: number;
  baseScale: number;
  phase: number;
  spinBias: number;
}

function getParityStyle(n: number) {
  const isEven = n % 2 === 0;
  return {
    isEven,
    bg: isEven ? IVORY : BURGUNDY,
    fg: isEven ? INK : IVORY,
    underBg: isEven ? BURGUNDY : IVORY,
  };
}

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  const cr = Math.min(r, hw * 0.45, hh * 0.45);
  s.moveTo(-hw + cr, -hh);
  s.lineTo(hw - cr, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + cr);
  s.lineTo(hw, hh - cr);
  s.quadraticCurveTo(hw, hh, hw - cr, hh);
  s.lineTo(-hw + cr, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - cr);
  s.lineTo(-hw, -hh + cr);
  s.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
  return s;
}

function drawRoundedMask(ctx: CanvasRenderingContext2D, w: number, h: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(w - radius, 0);
  ctx.quadraticCurveTo(w, 0, w, radius);
  ctx.lineTo(w, h - radius);
  ctx.quadraticCurveTo(w, h, w - radius, h);
  ctx.lineTo(radius, h);
  ctx.quadraticCurveTo(0, h, 0, h - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
}

function drawDigitSheet(ctx: CanvasRenderingContext2D, value: number) {
  const { isEven, bg, fg } = getParityStyle(value);
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0, 0, w, h);

  ctx.save();
  drawRoundedMask(ctx, w, h, 24);
  ctx.clip();

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const topGrad = ctx.createLinearGradient(0, 0, 0, 58);
  topGrad.addColorStop(0, "rgba(0, 0, 0, 0.18)");
  topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, 58);

  ctx.strokeStyle = isEven ? "rgba(28, 25, 23, 0.14)" : "rgba(247, 244, 238, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.moveTo(14, 16);
  ctx.lineTo(w - 14, 16);
  ctx.stroke();
  ctx.setLineDash([]);

  const botGrad = ctx.createLinearGradient(0, h - 64, 0, h);
  botGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  botGrad.addColorStop(1, isEven ? "rgba(28, 25, 23, 0.05)" : "rgba(0, 0, 0, 0.15)");
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, h - 64, w, 64);

  const label = String(value).padStart(2, "0");
  ctx.fillStyle = fg;
  ctx.font = 'italic 600 186px "Playfair Display", Georgia, serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, w / 2, h * 0.56);

  drawRoundedMask(ctx, w, h, 24);
  ctx.strokeStyle = isEven ? "rgba(28, 25, 23, 0.14)" : "rgba(247, 244, 238, 0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function createSheetTexture(initialValue: number): SheetTextureEntry {
  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 440;
  const ctx = canvas.getContext("2d");
  if (ctx) drawDigitSheet(ctx, initialValue);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { canvas, ctx, tex, value: initialValue };
}

function updateSheetTexture(entry: SheetTextureEntry, nextValue: number) {
  if (entry.value === nextValue) return;
  entry.value = nextValue;
  if (entry.ctx) drawDigitSheet(entry.ctx, nextValue);
  entry.tex.needsUpdate = true;
}

function createRoundedSolidTexture(colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 220;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    drawRoundedMask(ctx, canvas.width, canvas.height, 12);
    ctx.clip();
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "rgba(255,255,255,0.08)");
    grad.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function deformPadSheet(
  geo: THREE.PlaneGeometry,
  basePositions: Float32Array,
  baseUvs: Float32Array,
  sheetW: number,
  sheetH: number,
  curlAmount: number
) {
  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const count = posAttr.count;
  const p = Math.max(0, Math.min(1, curlAmount));

  const foldRadius = 0.28 + p * 0.06;
  const dirX = -0.76;
  const dirY = 0.65;
  const cornerProj = (sheetW * 0.5) * dirX + (-sheetH * 0.5) * dirY;
  const foldDist = cornerProj + p * 0.85;

  for (let i = 0; i < count; i++) {
    const ox = basePositions[i * 3];
    const oy = basePositions[i * 3 + 1];
    const u = baseUvs[i * 2];
    const v = baseUvs[i * 2 + 1];

    const freeWeight = Math.pow(1 - v, 1.65);
    const baseZ = freeWeight * 0.08 + Math.sin(u * Math.PI) * freeWeight * 0.014;

    if (p <= 0.005) {
      posAttr.setXYZ(i, ox, oy, baseZ);
      continue;
    }

    const proj = ox * dirX + oy * dirY;
    if (proj >= foldDist) {
      posAttr.setXYZ(i, ox, oy, baseZ);
      continue;
    }

    const distPast = foldDist - proj;
    const rawTheta = distPast / foldRadius;
    const theta = Math.min(rawTheta, Math.PI * 0.72);
    const excess = Math.max(0, rawTheta - Math.PI * 0.72) * foldRadius;

    const foldOriginX = ox + distPast * dirX;
    const foldOriginY = oy + distPast * dirY;

    const arcX = foldOriginX - dirX * (foldRadius * Math.sin(theta) - excess * Math.cos(theta));
    const arcY = foldOriginY - dirY * (foldRadius * Math.sin(theta) - excess * Math.cos(theta));
    const arcZ = baseZ + foldRadius * (1 - Math.cos(theta)) + excess * Math.sin(theta);

    const topPin = Math.min(1, Math.max(0, (0.92 - v) / 0.28));
    posAttr.setXYZ(
      i,
      ox + (arcX - ox) * topPin,
      oy + (arcY - oy) * topPin,
      baseZ + (arcZ - baseZ) * topPin
    );
  }

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
}

function deformAirborneSheet(
  geo: THREE.PlaneGeometry,
  basePositions: Float32Array,
  baseUvs: Float32Array,
  age: number,
  speedNorm: number,
  turnRate: number,
  phase: number
) {
  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const camber = Math.max(-0.22, Math.min(0.22, -turnRate * 0.14));
  const waveAmp = 0.055 + Math.min(0.08, speedNorm * 0.016);

  for (let i = 0; i < posAttr.count; i++) {
    const ox = basePositions[i * 3];
    const oy = basePositions[i * 3 + 1];
    const u = baseUvs[i * 2];
    const v = baseUvs[i * 2 + 1];

    const wingCurve = Math.sin(u * Math.PI) * 0.14 + (u - 0.5) * (u - 0.5) * camber;
    const trailLag = Math.pow(1 - v, 1.35);
    const wave = Math.sin(age * 4.2 + phase + v * 3.1) * waveAmp * trailLag;

    posAttr.setXYZ(i, ox, oy, wingCurve + wave);
  }

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
}

export default function HeroPaperClock() {
  const slotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!mounted) return;
    const slotEl = slotRef.current;
    const canvas = canvasRef.current;
    if (!slotEl || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const Z_CAM = 14;
    const FOV = 36;
    const TAN_HALF = Math.tan((FOV * Math.PI) / 360);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      FOV,
      Math.max(0.5, window.innerWidth / Math.max(1, window.innerHeight)),
      0.1,
      100
    );
    camera.position.set(0, 0, Z_CAM);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "default",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;

    const getWorldDimsAtZ = (zPlane: number) => {
      const dist = Z_CAM - zPlane;
      const worldH = 2 * dist * TAN_HALF;
      const worldW = worldH * (window.innerWidth / Math.max(1, window.innerHeight));
      return { worldW, worldH };
    };

    const screenPxToWorld = (sx: number, sy: number, zPlane = 0) => {
      const { worldW, worldH } = getWorldDimsAtZ(zPlane);
      const nx = sx / Math.max(1, window.innerWidth) - 0.5;
      const ny = 0.5 - sy / Math.max(1, window.innerHeight);
      return new THREE.Vector3(nx * worldW, ny * worldH, zPlane);
    };

    const ambientLight = new THREE.AmbientLight(0xfff6f0, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf5, 1.85);
    keyLight.position.set(-4, 6, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfde8ea, 0.78);
    rimLight.position.set(6, -3, 6);
    scene.add(rimLight);

    const backIvoryTex = createRoundedSolidTexture(IVORY);
    const backBurgundyTex = createRoundedSolidTexture(BURGUNDY);

    // Desk calendar group sits at z = 0.0 so airborne paths (wz > +0.55) fly cleanly above the pads
    const clockGroup = new THREE.Group();
    clockGroup.position.set(0, 0, 0);
    scene.add(clockGroup);

    const sheetW = 1.24;
    const sheetH = 1.5;
    const cornerRadius = 0.078;
    const padGap = 0.065;
    const padOffsetsX = [-(sheetW + padGap), 0, sheetW + padGap];

    const shadowGeo = new THREE.PlaneGeometry(4.4, 2.2);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 64, 24, 128, 64, 124);
      grad.addColorStop(0, "rgba(28, 10, 14, 0.24)");
      grad.addColorStop(0.65, "rgba(28, 10, 14, 0.09)");
      grad.addColorStop(1, "rgba(28, 10, 14, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.78,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0.08, -0.22, -0.34);
    clockGroup.add(shadowMesh);

    const barW = sheetW * 3 + padGap * 2 + 0.08;
    const barH = 0.34;
    const barShape = createRoundedRectShape(barW, barH, 0.055);
    const barGeo = new THREE.ExtrudeGeometry(barShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.012,
      bevelSegments: 3,
    });
    barGeo.translate(0, 0, -0.19);
    const barMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(BURGUNDY),
      roughness: 0.45,
      metalness: 0.08,
    });
    const bindingBar = new THREE.Mesh(barGeo, barMat);
    bindingBar.position.set(0, sheetH * 0.5 + barH * 0.3, 0);
    clockGroup.add(bindingBar);

    const rivetGeo = new THREE.SphereGeometry(0.08, 24, 16);
    const rivetCollarGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.025, 24);
    rivetCollarGeo.rotateX(Math.PI / 2);
    const rivetMat = new THREE.MeshStandardMaterial({
      color: 0xebe3de,
      roughness: 0.2,
      metalness: 0.9,
    });
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x3b181e,
      roughness: 0.5,
      metalness: 0.4,
    });

    padOffsetsX.forEach((px) => {
      const collar = new THREE.Mesh(rivetCollarGeo, collarMat);
      collar.position.set(px, sheetH * 0.5 + 0.085, 0.048);
      clockGroup.add(collar);

      const rivet = new THREE.Mesh(rivetGeo, rivetMat);
      rivet.scale.set(1, 1, 0.62);
      rivet.position.set(px, sheetH * 0.5 + 0.085, 0.068);
      clockGroup.add(rivet);
    });

    const padShape = createRoundedRectShape(sheetW * 0.992, sheetH * 0.99, cornerRadius);
    const stackBlockGeo = new THREE.ExtrudeGeometry(padShape, {
      depth: 0.16,
      bevelEnabled: false,
      curveSegments: 8,
    });
    stackBlockGeo.translate(0, 0, -0.185);
    const stackEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xe6dfd6,
      roughness: 0.88,
      metalness: 0.02,
    });
    const ledgeGeo = new THREE.ShapeGeometry(padShape, 8);
    const underGeo = new THREE.PlaneGeometry(sheetW, sheetH, 1, 1);

    const nowInit = new Date();
    const initValues = [nowInit.getHours(), nowInit.getMinutes(), nowInit.getSeconds()];

    const pads: PadRig[] = padOffsetsX.map((px, idx) => {
      const val = initValues[idx];
      const modMax = idx === 0 ? 24 : 60;
      const nextVal = (val + 1) % modMax;

      const group = new THREE.Group();
      group.position.set(px, -0.02, 0);
      clockGroup.add(group);

      const stackBlock = new THREE.Mesh(stackBlockGeo, stackEdgeMat);
      stackBlock.position.set(0, -0.015, 0);
      group.add(stackBlock);

      for (let layer = 0; layer < 3; layer++) {
        const ledgeMat = new THREE.MeshStandardMaterial({
          color: layer % 2 === 0 ? 0xf2ece4 : 0xd8cec2,
          roughness: 0.9,
        });
        const ledge = new THREE.Mesh(ledgeGeo, ledgeMat);
        ledge.scale.setScalar(0.996 - layer * 0.005);
        ledge.position.set(0, -0.024 - layer * 0.014, -0.02 - layer * 0.022);
        group.add(ledge);
      }

      const underTex = createSheetTexture(nextVal);
      const underMat = new THREE.MeshStandardMaterial({
        map: underTex.tex,
        alphaTest: 0.5,
        roughness: 0.72,
        metalness: 0.02,
      });
      const underMesh = new THREE.Mesh(underGeo, underMat);
      underMesh.position.set(0, 0, -0.008);
      group.add(underMesh);

      const baseGeo = new THREE.PlaneGeometry(sheetW, sheetH, 32, 40);
      const basePositions = new Float32Array(baseGeo.attributes.position.array);
      const baseUvs = new Float32Array(baseGeo.attributes.uv.array);

      const frontTex = createSheetTexture(val);
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex.tex,
        alphaTest: 0.5,
        roughness: 0.65,
        metalness: 0.03,
        side: THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });
      const backMat = new THREE.MeshStandardMaterial({
        map: val % 2 === 0 ? backBurgundyTex : backIvoryTex,
        alphaTest: 0.5,
        roughness: 0.74,
        metalness: 0.02,
        side: THREE.BackSide,
      });

      const frontMesh = new THREE.Mesh(baseGeo, frontMat);
      frontMesh.position.z = 0.004;
      group.add(frontMesh);

      const backMesh = new THREE.Mesh(baseGeo, backMat);
      backMesh.position.z = 0.003;
      group.add(backMesh);

      deformPadSheet(baseGeo, basePositions, baseUvs, sheetW, sheetH, idx === 2 ? 0.3 : 0.02);

      return {
        group,
        anchorX: px,
        baseGeo,
        frontMesh,
        backMesh,
        underMesh,
        frontTex,
        underTex,
        basePositions,
        baseUvs,
        currentVal: val,
        flipProgress: 0,
        flipDuration: idx === 2 ? 0.92 : 0.62,
        isFlipping: false,
      };
    });

    // Airborne Flight Sheet Pool (lives in scene root so curves glide seamlessly behind clock & text)
    const FLIGHT_POOL_SIZE = 12;
    const airbornePool: AirborneSheet[] = Array.from({ length: FLIGHT_POOL_SIZE }, (_, idx) => {
      const g = new THREE.Group();
      g.visible = false;
      scene.add(g);

      const geo = new THREE.PlaneGeometry(sheetW, sheetH, 16, 20);
      const basePositions = new Float32Array(geo.attributes.position.array);
      const baseUvs = new Float32Array(geo.attributes.uv.array);

      const frontTex = createSheetTexture(idx % 60);
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex.tex,
        alphaTest: 0.5,
        roughness: 0.68,
        metalness: 0.02,
        transparent: true,
        opacity: 1,
        side: THREE.FrontSide,
      });
      const backMat = new THREE.MeshStandardMaterial({
        map: backBurgundyTex,
        alphaTest: 0.5,
        roughness: 0.74,
        metalness: 0.02,
        transparent: true,
        opacity: 1,
        side: THREE.BackSide,
      });

      const frontMesh = new THREE.Mesh(geo, frontMat);
      const backMesh = new THREE.Mesh(geo, backMat);
      backMesh.position.z = -0.002;
      g.add(frontMesh);
      g.add(backMesh);

      return {
        group: g,
        frontTex,
        frontMesh,
        backMesh,
        geo,
        basePositions,
        baseUvs,
        curve: null,
        active: false,
        age: 0,
        duration: 4.5,
        baseScale: 1,
        phase: 0,
        spinBias: 1,
      };
    });

    let currentClockScale = 1;
    const ssWorldVec = new THREE.Vector3();

    const syncClockSlot = () => {
      const rect = slotEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const worldCenter = screenPxToWorld(cx, cy, 0);
      clockGroup.position.set(worldCenter.x, worldCenter.y, 0);

      const { worldW } = getWorldDimsAtZ(0);
      const targetPixelW = Math.min(rect.width * 0.88, rect.height * 1.48, 560);
      const targetWorldW = (targetPixelW / Math.max(1, window.innerWidth)) * worldW;
      currentClockScale = Math.max(0.32, targetWorldW / 4.05);
      clockGroup.scale.setScalar(currentClockScale);
      clockGroup.visible = rect.bottom > -120 && rect.top < window.innerHeight + 120;
    };
    syncClockSlot();

    let trajectoryCursor = 0;

    const spawnAirborneSheet = (
      padIndex: number,
      departedValue: number,
      forceCascade = false
    ) => {
      if (prefersReducedMotion) return;
      let slot = airbornePool.find((s) => !s.active);
      if (!slot) {
        slot = airbornePool.reduce(
          (oldest, curr) => (curr.age / curr.duration > oldest.age / oldest.duration ? curr : oldest),
          airbornePool[0]
        );
      }

      // Compute exact world coordinate of departing pad center -> normalized document space
      clockGroup.updateMatrixWorld();
      ssWorldVec.set(padOffsetsX[padIndex], -0.02, 0.02).applyMatrix4(clockGroup.matrixWorld);
      const ndc = ssWorldVec.clone().project(camera);
      const startNx = (ndc.x + 1) * 0.5;
      const startScreenY = (1 - ndc.y) * 0.5;
      const scrollVh = window.scrollY / Math.max(1, window.innerHeight);

      let preset: TrajectoryPreset;
      if (forceCascade) {
        preset = TRAJECTORY_PRESETS[5 + (trajectoryCursor % 2)];
      } else {
        const pickIndex =
          trajectoryCursor % 6 === 4
            ? 5 + (Math.floor(trajectoryCursor / 6) % 2)
            : trajectoryCursor % 5;
        preset = TRAJECTORY_PRESETS[pickIndex];
      }
      trajectoryCursor++;

      const pts: THREE.Vector3[] = [
        new THREE.Vector3(startNx, startScreenY + scrollVh, 0.55),
        ...preset.waypoints.map((w) => new THREE.Vector3(w.nx, w.docYVh, w.wz)),
      ];

      slot.curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);

      const isEven = departedValue % 2 === 0;
      updateSheetTexture(slot.frontTex, departedValue);
      slot.frontMesh.material.opacity = 1;
      slot.backMesh.material.map = isEven ? backBurgundyTex : backIvoryTex;
      slot.backMesh.material.needsUpdate = true;
      slot.backMesh.material.opacity = 1;

      slot.active = true;
      slot.age = 0;
      slot.duration = preset.duration;
      slot.baseScale = currentClockScale * 0.94;
      slot.phase = Math.random() * Math.PI * 2;
      slot.spinBias = Math.random() < 0.5 ? 1 : -1;
      slot.group.scale.setScalar(slot.baseScale);
      slot.group.visible = true;
    };

    const updatePadMaterials = (pad: PadRig, value: number, modMax: number) => {
      const nextVal = (value + 1) % modMax;
      pad.currentVal = value;
      updateSheetTexture(pad.frontTex, value);
      updateSheetTexture(pad.underTex, nextVal);

      pad.backMesh.material.map = value % 2 === 0 ? backBurgundyTex : backIvoryTex;
      pad.backMesh.material.needsUpdate = true;
    };

    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
      targetTiltY = Math.max(-0.2, Math.min(0.2, nx * 0.12));
      targetTiltX = Math.max(-0.14, Math.min(0.14, -ny * 0.08));
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      camera.aspect = Math.max(0.5, window.innerWidth / Math.max(1, window.innerHeight));
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      syncClockSlot();
    };
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    let lastMs = performance.now();
    let prevH = nowInit.getHours();
    let prevM = nowInit.getMinutes();
    let prevS = nowInit.getSeconds();

    const animate = (nowMs: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastMs) / 1000));
      lastMs = nowMs;

      syncClockSlot();

      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const frac = d.getMilliseconds() / 1000;

      if (s !== prevS) {
        const departedS = prevS;
        prevS = s;
        updatePadMaterials(pads[2], s, 60);
        spawnAirborneSheet(2, departedS, false);
      }
      if (m !== prevM) {
        const departedM = prevM;
        prevM = m;
        updatePadMaterials(pads[1], m, 60);
        pads[1].isFlipping = true;
        pads[1].flipProgress = 0;
        spawnAirborneSheet(1, departedM, true);
      }
      if (h !== prevH) {
        const departedH = prevH;
        prevH = h;
        updatePadMaterials(pads[0], h, 24);
        pads[0].isFlipping = true;
        pads[0].flipProgress = 0;
        spawnAirborneSheet(0, departedH, true);
      }

      if (prefersReducedMotion) {
        pads.forEach((pad) =>
          deformPadSheet(pad.baseGeo, pad.basePositions, pad.baseUvs, sheetW, sheetH, 0.02)
        );
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
        return;
      }

      const rawSecCurl =
        frac < 0.35 ? 0.03 + frac * 0.12 : 0.072 + Math.pow((frac - 0.35) / 0.65, 1.5) * 0.52;
      deformPadSheet(pads[2].baseGeo, pads[2].basePositions, pads[2].baseUvs, sheetW, sheetH, rawSecCurl);

      [pads[0], pads[1]].forEach((pad) => {
        if (pad.isFlipping) {
          pad.flipProgress += dt / pad.flipDuration;
          if (pad.flipProgress >= 1) {
            pad.isFlipping = false;
            pad.flipProgress = 0;
            deformPadSheet(pad.baseGeo, pad.basePositions, pad.baseUvs, sheetW, sheetH, 0.02);
          } else {
            deformPadSheet(
              pad.baseGeo,
              pad.basePositions,
              pad.baseUvs,
              sheetW,
              sheetH,
              Math.sin(pad.flipProgress * Math.PI) * 0.52
            );
          }
        }
      });

      const scrollVh = window.scrollY / Math.max(1, window.innerHeight);

      for (let i = 0; i < airbornePool.length; i++) {
        const sh = airbornePool[i];
        if (!sh.active || !sh.curve) continue;

        sh.age += dt;
        const u = Math.min(1, sh.age / sh.duration);
        if (u >= 1) {
          sh.active = false;
          sh.group.visible = false;
          continue;
        }

        // Gentle aerodynamic ease so sheets glide briskly off pad and float across curves
        const easedU = Math.min(1, 0.08 * u + 0.92 * (1 - Math.pow(1 - u, 1.18)));
        const ptDoc = sh.curve.getPointAt(easedU);
        const tanDoc = sh.curve.getTangentAt(easedU);

        const screenX = ptDoc.x * window.innerWidth;
        const screenY = (ptDoc.y - scrollVh) * window.innerHeight;
        const worldPos = screenPxToWorld(screenX, screenY, ptDoc.z);
        sh.group.position.copy(worldPos);

        // Velocity-coupled banking + pitch tumble along spline
        const bank = Math.sin(sh.age * 2.6 + sh.phase) * 0.55 + tanDoc.x * 0.45;
        const pitch = -0.25 + tanDoc.y * 0.6 + Math.sin(sh.age * 1.9 + sh.phase) * 0.35;
        const yaw = tanDoc.x * -0.45 * sh.spinBias + Math.cos(sh.age * 2.1 + sh.phase) * 0.25;
        sh.group.rotation.set(pitch, bank, yaw);

        const speedNorm = Math.hypot(tanDoc.x, tanDoc.y);
        deformAirborneSheet(
          sh.geo,
          sh.basePositions,
          sh.baseUvs,
          sh.age,
          speedNorm,
          bank,
          sh.phase
        );

        // Contrast safeguard: soften sheets crossing behind left-side typography / lower text bands
        const isBehindTextZone = ptDoc.x < 0.58 || ptDoc.y > 0.95;
        const textVeil = isBehindTextZone ? 0.72 : 0.96;
        const edgeFade = u > 0.85 ? 1 - (u - 0.85) / 0.15 : 1;
        const opacity = Math.max(0, Math.min(1, textVeil * edgeFade));
        sh.frontMesh.material.opacity = opacity;
        sh.backMesh.material.opacity = opacity;
      }

      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;
      clockGroup.rotation.x = -0.09 + currentTiltX;
      clockGroup.rotation.y = -0.22 + currentTiltY;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      backIvoryTex.dispose();
      backBurgundyTex.dispose();
      shadowTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      barGeo.dispose();
      barMat.dispose();
      rivetGeo.dispose();
      rivetCollarGeo.dispose();
      rivetMat.dispose();
      collarMat.dispose();
      stackBlockGeo.dispose();
      stackEdgeMat.dispose();
      ledgeGeo.dispose();
      underGeo.dispose();

      pads.forEach((p) => {
        p.frontTex.tex.dispose();
        p.underTex.tex.dispose();
        p.baseGeo.dispose();
        p.frontMesh.material.dispose();
        p.backMesh.material.dispose();
        p.underMesh.material.dispose();
      });

      airbornePool.forEach((sh) => {
        sh.frontTex.tex.dispose();
        sh.geo.dispose();
        sh.frontMesh.material.dispose();
        sh.backMesh.material.dispose();
      });

      renderer.dispose();
    };
  }, [mounted]);

  return (
    <>
      <div
        ref={slotRef}
        id="heroClockSlot"
        className="relative w-full h-full min-h-[300px] sm:min-h-[380px] md:min-h-[480px] select-none pointer-events-none"
        aria-hidden="true"
      />
      {mounted &&
        createPortal(
          <canvas
            ref={canvasRef}
            id="heroPaperClockCanvas"
            className="fixed inset-0 w-screen h-screen block pointer-events-none select-none z-0"
            aria-hidden="true"
          />,
          document.body
        )}
    </>
  );
}
