"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroWireframeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    // Group holding nested architectural polyhedra
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.85, 1);
    const outerWireGeo = new THREE.WireframeGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x7a1525,
      transparent: true,
      opacity: 0.42,
    });
    const outerMesh = new THREE.LineSegments(outerWireGeo, outerMat);
    group.add(outerMesh);

    // 2. Middle Structural Dodecahedron Edges
    const midGeo = new THREE.DodecahedronGeometry(1.32, 0);
    const midEdges = new THREE.EdgesGeometry(midGeo);
    const midMat = new THREE.LineBasicMaterial({
      color: 0x1c1917,
      transparent: true,
      opacity: 0.55,
    });
    const midMesh = new THREE.LineSegments(midEdges, midMat);
    group.add(midMesh);

    // 3. Inner Core Octahedron
    const coreGeo = new THREE.OctahedronGeometry(0.75, 0);
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0x7a1525,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.LineSegments(coreEdges, coreMat);
    group.add(coreMesh);

    // 4. Orbital Architectural Rings
    const ringGeo = new THREE.TorusGeometry(2.35, 0.008, 8, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7a1525,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    group.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.y = Math.PI / 2.5;
    group.add(ringMesh2);

    const syncThemeColors = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      outerMat.color.setHex(isDark ? 0xb83248 : 0x7a1525);
      outerMat.opacity = isDark ? 0.5 : 0.42;
      midMat.color.setHex(isDark ? 0xeeebe5 : 0x1c1917);
      midMat.opacity = isDark ? 0.45 : 0.55;
      coreMat.color.setHex(isDark ? 0xd94b64 : 0x7a1525);
      ringMat.color.setHex(isDark ? 0xb83248 : 0x7a1525);
    };
    syncThemeColors();

    const observer = new MutationObserver(syncThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("portfolio-theme-change", syncThemeColors);

    // Pointer parallax state
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.45;
      targetY = ny * 0.35;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const speed = prefersReducedMotion ? 0.08 : 1;

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      outerMesh.rotation.y = t * 0.18 * speed + currentX * 0.6;
      outerMesh.rotation.x = t * 0.11 * speed - currentY * 0.5;

      midMesh.rotation.y = -t * 0.24 * speed + currentX * 0.4;
      midMesh.rotation.z = t * 0.14 * speed;

      coreMesh.rotation.x = t * 0.42 * speed;
      coreMesh.rotation.y = t * 0.35 * speed;

      ringMesh1.rotation.z = t * 0.12 * speed;
      ringMesh2.rotation.x = -t * 0.15 * speed;

      // Subtle breathing scale pulse
      const pulse = 1 + Math.sin(t * 1.4) * 0.025 * speed;
      group.scale.set(pulse, pulse, pulse);
      group.rotation.y = currentX * 0.35;
      group.rotation.x = -currentY * 0.35;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("portfolio-theme-change", syncThemeColors);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      outerGeo.dispose();
      outerWireGeo.dispose();
      outerMat.dispose();
      midGeo.dispose();
      midEdges.dispose();
      midMat.dispose();
      coreGeo.dispose();
      coreEdges.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] md:min-h-[480px] flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

