"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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

interface ApwState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  theta: number; // Pitch angle in XY flight plane
  omega: number; // Pitch angular velocity
  bank: number;  // Lateral roll/bank angle coupled to horizontal speed
  yaw: number;   // Gentle Z rotation
}

interface AirborneSheet {
  group: THREE.Group;
  frontTex: SheetTextureEntry;
  frontMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  backMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  geo: THREE.PlaneGeometry;
  basePositions: Float32Array;
  baseUvs: Float32Array;
  state: ApwState;
  active: boolean;
  age: number;
  life: number;
  windBias: number;
  phase: number;
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

  // Top crease & perforated tear seam under binding bar
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

  // Soft bottom pad shading
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

  // Hairline paper rim inside alpha mask
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

/**
 * Arc-length-preserving cylindrical corner peel for the resting pad sheet.
 * Gentler wrap (max ~125 deg) prepares the visual anticipation before full detachment.
 */
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

/**
 * Andersen-Pesavento-Wang (2005, J. Fluid Mech.) dimensionless falling card ODEs.
 * Coupled circulation lift, angle-of-attack drag, and rotational damping produce
 * authentic air-pocket glides, stall peaks, and smooth petal trajectories.
 */
const APW_PARAM = {
  mass: 1.0,
  inertia: 0.16,
  g: 4.8,
  chord: 1.24,
  CD0: 0.24,
  CD90: 2.15,
  CL_rot: 2.3,
};

function computeApwDerivatives(st: ApwState) {
  const cosT = Math.cos(st.theta);
  const sinT = Math.sin(st.theta);

  // Global velocity resolved into the sheet chord frame
  const vPar = st.vx * cosT + st.vy * sinT;
  const vNorm = -st.vx * sinT + st.vy * cosT;
  const vMag = Math.hypot(vPar, vNorm) + 1e-5;
  const alpha = Math.atan2(vNorm, vPar);

  const CL = Math.sin(2 * alpha) + APW_PARAM.CL_rot * ((st.omega * APW_PARAM.chord) / (2 * vMag));
  const CD = APW_PARAM.CD0 * Math.cos(alpha) ** 2 + APW_PARAM.CD90 * Math.sin(alpha) ** 2;

  const q = 0.5 * vMag * vMag * APW_PARAM.chord;
  const liftX = -q * CL * (vNorm / vMag);
  const liftY = q * CL * (vPar / vMag);
  const dragX = -q * CD * (vPar / vMag);
  const dragY = -q * CD * (vNorm / vMag);

  const ax = (liftX + dragX) / APW_PARAM.mass;
  const ay = -APW_PARAM.g + (liftY + dragY) / APW_PARAM.mass;

  const torque =
    -0.5 *
    q *
    APW_PARAM.chord *
    APW_PARAM.chord *
    (0.28 * ((st.omega * APW_PARAM.chord) / vMag) + 0.55 * Math.sin(2 * alpha));

  return {
    dx: st.vx,
    dy: st.vy,
    dvx: ax,
    dvy: ay,
    dtheta: st.omega,
    domega: torque / APW_PARAM.inertia,
  };
}

function rk4Step(st: ApwState, dt: number) {
  const k1 = computeApwDerivatives(st);
  const s2: ApwState = {
    ...st,
    x: st.x + 0.5 * dt * k1.dx,
    y: st.y + 0.5 * dt * k1.dy,
    vx: st.vx + 0.5 * dt * k1.dvx,
    vy: st.vy + 0.5 * dt * k1.dvy,
    theta: st.theta + 0.5 * dt * k1.dtheta,
    omega: st.omega + 0.5 * dt * k1.domega,
  };
  const k2 = computeApwDerivatives(s2);
  const s3: ApwState = {
    ...st,
    x: st.x + 0.5 * dt * k2.dx,
    y: st.y + 0.5 * dt * k2.dy,
    vx: st.vx + 0.5 * dt * k2.dvx,
    vy: st.vy + 0.5 * dt * k2.dvy,
    theta: st.theta + 0.5 * dt * k2.dtheta,
    omega: st.omega + 0.5 * dt * k2.domega,
  };
  const k3 = computeApwDerivatives(s3);
  const s4: ApwState = {
    ...st,
    x: st.x + dt * k3.dx,
    y: st.y + dt * k3.dy,
    vx: st.vx + dt * k3.dvx,
    vy: st.vy + dt * k3.dvy,
    theta: st.theta + dt * k3.dtheta,
    omega: st.omega + dt * k3.domega,
  };
  const k4 = computeApwDerivatives(s4);

  st.x += (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
  st.y += (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);
  st.vx += (dt / 6) * (k1.dvx + 2 * k2.dvx + 2 * k3.dvx + k4.dvx);
  st.vy += (dt / 6) * (k1.dvy + 2 * k2.dvy + 2 * k3.dvy + k4.dvy);
  st.theta += (dt / 6) * (k1.dtheta + 2 * k2.dtheta + 2 * k3.dtheta + k4.dtheta);
  st.omega += (dt / 6) * (k1.domega + 2 * k2.domega + 2 * k3.domega + k4.domega);
}

/**
 * Supple airfoil bend + trailing-edge wave across the detached sheet chord.
 */
function deformAirborneSheet(
  geo: THREE.PlaneGeometry,
  basePositions: Float32Array,
  baseUvs: Float32Array,
  age: number,
  speedNorm: number,
  omega: number,
  phase: number
) {
  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const camber = Math.max(-0.22, Math.min(0.22, -omega * 0.045));
  const waveAmp = 0.055 + Math.min(0.08, speedNorm * 0.02);

  for (let i = 0; i < posAttr.count; i++) {
    const ox = basePositions[i * 3];
    const oy = basePositions[i * 3 + 1];
    const u = baseUvs[i * 2];
    const v = baseUvs[i * 2 + 1];

    // Arch across chord + trailing ripple along flight stream
    const wingCurve = Math.sin(u * Math.PI) * 0.14 + (u - 0.5) * (u - 0.5) * camber;
    const trailLag = Math.pow(1 - v, 1.35);
    const wave = Math.sin(age * 4.2 + phase + v * 3.1) * waveAmp * trailLag;

    posAttr.setXYZ(i, ox, oy, wingCurve + wave);
  }

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
}

export default function HeroPaperClock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);

    const updateCameraForViewport = (w: number, h: number) => {
      const aspect = Math.max(0.5, w / Math.max(1, h));
      camera.aspect = aspect;
      const dist = Math.max(9.2 / aspect, 6.4);
      camera.position.set(0.08, 0.08, dist);
      camera.lookAt(0, -0.05, 0);
      camera.updateProjectionMatrix();
    };
    updateCameraForViewport(width, height);

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
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;

    const ambientLight = new THREE.AmbientLight(0xfff6f0, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf5, 1.85);
    keyLight.position.set(-2.6, 4.4, 5.8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfde8ea, 0.8);
    rimLight.position.set(4.5, -1.6, 3.4);
    scene.add(rimLight);

    const backIvoryTex = createRoundedSolidTexture(IVORY);
    const backBurgundyTex = createRoundedSolidTexture(BURGUNDY);

    const clockGroup = new THREE.Group();
    clockGroup.rotation.set(-0.09, -0.22, 0.045);
    scene.add(clockGroup);

    const sheetW = 1.24;
    const sheetH = 1.5;
    const cornerRadius = 0.078;
    const padGap = 0.065;
    const padOffsetsX = [-(sheetW + padGap), 0, sheetW + padGap];

    // 1. Soft studio shadow behind desk calendar
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

    // 2. Sculpted Rounded Burgundy Top Binding Bar (ExtrudeGeometry)
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

    // 3. Three Metallic Brushed Rivets
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

    // 4. Rounded Pad Stack Geometry (No sharp box corners leaking behind rounded pages)
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

    // 5. Full-Size Airborne Sheet Pool (Detached numbered sheets gliding out of frame via APW RK4)
    const FLIGHT_POOL_SIZE = 6;
    const airbornePool: AirborneSheet[] = Array.from({ length: FLIGHT_POOL_SIZE }, (_, idx) => {
      const g = new THREE.Group();
      g.visible = false;
      clockGroup.add(g);

      const geo = new THREE.PlaneGeometry(sheetW, sheetH, 16, 20);
      const basePositions = new Float32Array(geo.attributes.position.array);
      const baseUvs = new Float32Array(geo.attributes.uv.array);

      const frontTex = createSheetTexture(idx % 60);
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex.tex,
        alphaTest: 0.5,
        roughness: 0.65,
        metalness: 0.03,
        transparent: true,
        opacity: 1,
        side: THREE.FrontSide,
      });
      const backMat = new THREE.MeshStandardMaterial({
        map: backBurgundyTex,
        alphaTest: 0.5,
        roughness: 0.72,
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
        state: {
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          theta: 0,
          omega: 0,
          bank: 0,
          yaw: 0,
        },
        active: false,
        age: 0,
        life: 3.1,
        windBias: 0,
        phase: 0,
      };
    });

    const spawnAirborneSheet = (padIndex: number, departedValue: number) => {
      if (prefersReducedMotion) return;
      // Pick first idle sheet, or recycle oldest active sheet
      let slot = airbornePool.find((s) => !s.active);
      if (!slot) {
        slot = airbornePool.reduce((oldest, curr) => (curr.age > oldest.age ? curr : oldest), airbornePool[0]);
      }

      const isEven = departedValue % 2 === 0;
      updateSheetTexture(slot.frontTex, departedValue);
      slot.frontMesh.material.opacity = 1;
      slot.backMesh.material.map = isEven ? backBurgundyTex : backIvoryTex;
      slot.backMesh.material.needsUpdate = true;
      slot.backMesh.material.opacity = 1;

      slot.state = {
        x: padOffsetsX[padIndex] + 0.06,
        y: -0.02,
        z: 0.06,
        vx: 1.55 + Math.random() * 0.65,
        vy: 0.65 + Math.random() * 0.45,
        vz: 1.15 + Math.random() * 0.45,
        theta: -0.45 - Math.random() * 0.3,
        omega: (Math.random() - 0.35) * 2.2,
        bank: 0.18,
        yaw: -0.14,
      };
      slot.active = true;
      slot.age = 0;
      slot.life = 2.9 + Math.random() * 0.4;
      slot.windBias = 0.8 + Math.random() * 0.5;
      slot.phase = Math.random() * Math.PI * 2;
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
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      targetTiltY = Math.max(-0.22, Math.min(0.22, nx * 0.14));
      targetTiltX = Math.max(-0.16, Math.min(0.16, -ny * 0.1));
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 480;
      updateCameraForViewport(w, h);
      renderer.setSize(w, h, false);
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

      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const frac = d.getMilliseconds() / 1000;

      if (s !== prevS) {
        const departedS = prevS;
        prevS = s;
        updatePadMaterials(pads[2], s, 60);
        spawnAirborneSheet(2, departedS);
      }
      if (m !== prevM) {
        const departedM = prevM;
        prevM = m;
        updatePadMaterials(pads[1], m, 60);
        pads[1].isFlipping = true;
        pads[1].flipProgress = 0;
        spawnAirborneSheet(1, departedM);
      }
      if (h !== prevH) {
        const departedH = prevH;
        prevH = h;
        updatePadMaterials(pads[0], h, 24);
        pads[0].isFlipping = true;
        pads[0].flipProgress = 0;
        spawnAirborneSheet(0, departedH);
      }

      if (prefersReducedMotion) {
        pads.forEach((pad) => deformPadSheet(pad.baseGeo, pad.basePositions, pad.baseUvs, sheetW, sheetH, 0.02));
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Resting second pad curls subtly at bottom-right just prior to tearing off
      const rawSecCurl = frac < 0.35 ? 0.03 + frac * 0.12 : 0.072 + Math.pow((frac - 0.35) / 0.65, 1.5) * 0.52;
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

      // Update detached airborne sheets with APW RK4 fluid physics + airfoil flexing
      const subSteps = 4;
      const subDt = dt / subSteps;

      for (let i = 0; i < airbornePool.length; i++) {
        const sh = airbornePool[i];
        if (!sh.active) continue;

        sh.age += dt;
        for (let step = 0; step < subSteps; step++) {
          sh.state.vx += (sh.windBias + currentTiltY * 2.2) * subDt;
          rk4Step(sh.state, subDt);
        }

        sh.state.z += sh.state.vz * dt;
        sh.state.vz *= 1 - 1.15 * dt;
        sh.state.bank = Math.sin(sh.age * 3.1 + sh.phase) * 0.38 + sh.state.vx * 0.14;
        sh.state.yaw += sh.state.omega * 0.28 * dt;

        sh.group.position.set(sh.state.x, sh.state.y, sh.state.z);
        sh.group.rotation.set(
          -0.25 + sh.state.theta * 0.65,
          sh.state.bank,
          sh.state.yaw
        );

        const speedNorm = Math.hypot(sh.state.vx, sh.state.vy);
        deformAirborneSheet(
          sh.geo,
          sh.basePositions,
          sh.baseUvs,
          sh.age,
          speedNorm,
          sh.state.omega,
          sh.phase
        );

        const exitProgress = Math.max(
          sh.age / sh.life,
          (sh.state.x - 1.8) / 3.4,
          (-1.6 - sh.state.y) / 2.2
        );
        const fade = exitProgress > 0.72 ? 1 - (exitProgress - 0.72) / 0.28 : 1;
        const opacity = Math.max(0, Math.min(1, fade));
        sh.frontMesh.material.opacity = opacity;
        sh.backMesh.material.opacity = opacity;

        if (sh.age >= sh.life || opacity <= 0.01) {
          sh.active = false;
          sh.group.visible = false;
        }
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] sm:min-h-[380px] md:min-h-[480px] flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
