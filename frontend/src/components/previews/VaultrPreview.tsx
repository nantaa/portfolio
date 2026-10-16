"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Vaultr WebGL Core Showcase ──────────────────────────────────────────────
// Adapting the exact Three.js configuration from useThreeHero.js in Vaultr:
// Features 1500 custom-shaded particle points and counter-rotating hex rings.

export default function VaultrPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let points: THREE.Points;
    let hexRing: THREE.Mesh;
    let hexRing2: THREE.Mesh;
    let animId = 0;
    let t = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    // ─── Init Three Scene ───
    scene = new THREE.Scene();
    
    // Fit camera inside the card container dimensions rather than window size
    const rect = containerRef.current.getBoundingClientRect();
    camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
    camera.position.z = 4.2;

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ─── Particle Buffer Geometry ───
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x7a1525, // Themed to match Aryo's accent color
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    points = new THREE.Points(geometry, material);
    scene.add(points);

    // ─── Inner Hex Ring (6-sided RingGeometry) ───
    const hexGeometry = new THREE.RingGeometry(1.6, 1.7, 6);
    const hexMaterial = new THREE.MeshBasicMaterial({
      color: 0x9b1e30,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    hexRing = new THREE.Mesh(hexGeometry, hexMaterial);
    scene.add(hexRing);

    // ─── Outer Hex Ring ───
    const hexGeometry2 = new THREE.RingGeometry(2.0, 2.05, 6);
    const hexMaterial2 = new THREE.MeshBasicMaterial({
      color: 0x7a1525,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    hexRing2 = new THREE.Mesh(hexGeometry2, hexMaterial2);
    scene.add(hexRing2);

    // ─── Events ───
    const handleResize = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseY = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    const handleScroll = () => {
      scrollVelocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ─── Loop ───
    const animate = () => {
      animId = requestAnimationFrame(animate);
      scrollVelocity *= 0.85;

      const speedBoost = 1 + Math.abs(scrollVelocity) * 0.08;
      t += 0.005 * speedBoost;

      // Rotations
      points.rotation.y = t * 0.25;
      points.rotation.x = t * 0.08;

      hexRing.rotation.z = t * 0.35;
      hexRing2.rotation.z = -t * 0.2;

      // Mouse interactive drift
      points.rotation.y += mouseX * 0.05;
      points.rotation.x -= mouseY * 0.03;

      // Update bottom progress bar (looping scroll simulator)
      const progress = ((Math.sin(t * 0.4) + 1) / 2) * 100;
      if (progressRef.current) {
        progressRef.current.style.width = `${progress.toFixed(1)}%`;
      }

      // Parallax drifting label
      if (textRef.current) {
        const y = Math.sin(t * 0.6) * 6;
        textRef.current.style.transform = `translateY(${y}px)`;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);

      renderer.dispose();
      geometry.dispose();
      material.dispose();
      hexGeometry.dispose();
      hexMaterial.dispose();
      hexGeometry2.dispose();
      hexMaterial2.dispose();
    };
  }, []);

  return (
    <div className="vp-wrap" ref={containerRef}>
      {/* Real WebGL Canvas */}
      <canvas className="vp-canvas" ref={canvasRef} />

      {/* Brand mark center overlay */}
      <div className="vp-center-mark">
        <div className="vp-mark-glow" />
        <span className="vp-brand">V</span>
      </div>

      {/* Drifting project labels */}
      <div className="vp-text-wrap" ref={textRef}>
        <span className="vp-label">Finance Infrastructure</span>
        <span className="vp-sublabel">GSAP · Three.js · Vue 3</span>
      </div>

      {/* Interactive scroll simulator tracking */}
      <div className="vp-scrollbar-wrap">
        <span className="vp-scroll-lbl">Scroll</span>
        <div className="vp-scrollbar-track">
          <div className="vp-scrollbar-fill" ref={progressRef} />
        </div>
      </div>

      {/* Tech stack pill badge */}
      <div className="vp-stack-pill">
        <span>Lenis</span>
        <span className="vp-sep">·</span>
        <span>ScrollTrigger</span>
        <span className="vp-sep">·</span>
        <span>Three.js</span>
      </div>
    </div>
  );
}
