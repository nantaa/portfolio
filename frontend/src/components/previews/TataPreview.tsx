"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import ProjectPreviewGate from "./ProjectPreviewGate";

// ─── Tata$ — Real Three.js GLB Bag Viewer with Multi-Bag Switcher ─────────────
// Renders actual compressed GLB models from the Tata$ luxury bag project.
// Drag to rotate · Click a bag slot to switch model with scale pop animation.

const BAGS = [
  { id: "tas2a", label: "01", path: "/models/tas2a.glb" },
  { id: "tas3a", label: "02", path: "/models/tas3a.glb" },
  { id: "tas1a", label: "03", path: "/models/tas1a.glb" },
];

function TataStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBag, setActiveBag] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);

  // Refs for Three.js objects — stable across re-renders
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    bagGroup: THREE.Group | null;
    loadedModels: Record<string, THREE.Object3D>;
    currentBagId: string;
    rafId: number;
    isDragging: boolean;
    prevX: number;
    dragVelocity: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    bagGroup: null,
    loadedModels: {},
    currentBagId: BAGS[0].id,
    rafId: 0,
    isDragging: false,
    prevX: 0,
    dragVelocity: 0,
  });

  // Switch bag imperatively
  const switchBag = useCallback((index: number) => {
    const t = threeRef.current;
    if (!t.bagGroup || isSwapping) return;
    const newId = BAGS[index].id;
    if (newId === t.currentBagId) return;

    setIsSwapping(true);
    setActiveBag(index);

    // Scale down
    const scaleDown = () => {
      if (!t.bagGroup) return;
      t.bagGroup.scale.multiplyScalar(0.88);
      if (t.bagGroup.scale.x > 0.1) {
        requestAnimationFrame(scaleDown);
      } else {
        // Swap visibility
        Object.entries(t.loadedModels).forEach(([id, model]) => {
          model.visible = id === newId;
        });
        t.currentBagId = newId;

        // Scale back up to prominent 1.95x focal point
        const scaleUp = () => {
          if (!t.bagGroup) return;
          t.bagGroup.scale.multiplyScalar(1.14);
          if (t.bagGroup.scale.x < 1.95) {
            requestAnimationFrame(scaleUp);
          } else {
            t.bagGroup.scale.set(1.95, 1.95, 1.95);
            setIsSwapping(false);
          }
        };
        scaleUp();
      }
    };
    scaleDown();
  }, [isSwapping]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const t = threeRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    t.renderer = renderer;

    // Scene & Environment
    const scene = new THREE.Scene();
    t.scene = scene;

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Camera (centered & framed tight for large bag hero presence)
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 3.9);
    camera.lookAt(0, -0.05, 0);
    t.camera = camera;

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4e4ff, 1.4);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const warmUnder = new THREE.DirectionalLight(0xba6617, 1.1);
    warmUnder.position.set(0, -3, 2);
    scene.add(warmUnder);

    // Bag Group (centered, hero size: 1.95x)
    const bagGroup = new THREE.Group();
    bagGroup.position.set(0, -0.65, 0);
    bagGroup.scale.set(1.95, 1.95, 1.95);
    scene.add(bagGroup);
    t.bagGroup = bagGroup;

    // Contact shadow
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.22,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.15;
    scene.add(shadowMesh);

    // Load All Models
    const loader = new GLTFLoader();
    BAGS.forEach((bag, idx) => {
      loader.load(
        bag.path,
        (gltf) => {
          const model = gltf.scene;
          model.visible = idx === 0;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = false;
              child.receiveShadow = false;
            }
          });
          bagGroup.add(model);
          t.loadedModels[bag.id] = model;
        },
        undefined,
        (err) => console.warn(`[TataPreview] Failed to load ${bag.path}:`, err)
      );
    });

    // Resize Observer
    const resize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(container);
    resize();

    // Drag Orbit
    const onPointerDown = (e: PointerEvent) => {
      t.isDragging = true;
      t.prevX = e.clientX;
      t.dragVelocity = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!t.isDragging || !t.bagGroup) return;
      const deltaX = e.clientX - t.prevX;
      t.prevX = e.clientX;
      t.dragVelocity = deltaX * 0.008;
      t.bagGroup.rotation.y += t.dragVelocity;
    };

    const onPointerUp = (e: PointerEvent) => {
      t.isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      t.rafId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!t.isDragging && t.bagGroup) {
        t.dragVelocity *= 0.94;
        t.bagGroup.rotation.y += t.dragVelocity + 0.18 * dt;
      }

      if (t.renderer && t.scene && t.camera) {
        t.renderer.render(t.scene, t.camera);
      }
    };
    t.rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(t.rafId);
      resizeObs.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      t.renderer?.dispose();
      pmrem.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="tata-preview">
      <div className="tata-bg" />
      <div className="tata-watermark" aria-hidden="true">TATA$</div>
      <canvas ref={canvasRef} className="tata-canvas" />

      {/* Bag switcher buttons */}
      <div className="tata-switcher">
        {BAGS.map((bag, i) => (
          <button
            key={bag.id}
            className={`tata-switch-btn${activeBag === i ? " active" : ""}${isSwapping ? " disabled" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              switchBag(i);
            }}
          >
            {bag.label}
          </button>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="tata-hint">Drag to rotate · GLTF Stage</div>
    </div>
  );
}

export default function TataPreview() {
  return (
    <ProjectPreviewGate
      title="TATA$ 3D Interactive Showcase"
      category="3D Web & Interactive Landing Page"
      specs="Vue 3 · Three.js · Interactive 3D Bag Showcase Landing Page · RoomEnvironment IBL"
      description="Interactive 3D product showcase landing page featuring compressed GLB models, realistic leather reflections, and 360° bag orbit interaction."
      actionLabel="▶ Launch 3D Showcase"
      actionSubtext="WebGL 60fps · Interactive 3D Bag"
      badge="STANDBY · ON DEMAND"
      accentColor="#ba6617"
      accentSoft="rgba(186, 102, 23, 0.18)"
      backdropPattern={
        <div className="font-sans font-black text-[clamp(4rem,12vw,8rem)] text-[#ba6617]/15 tracking-tighter select-none">
          TATA$
        </div>
      }
    >
      <TataStage />
    </ProjectPreviewGate>
  );
}
