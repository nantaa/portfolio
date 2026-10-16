"use client";

import { useState } from "react";

// ─── Kukujang Luxury Product Showcase ────────────────────────────────────────
// Features a interactive car model switcher (Roadster vs Concept Coupe)
// with customizable finish overlay filters and detailed telemetry specs.

const SPECIFICATIONS = {
  coupe: { hp: "840 HP", engine: "V12 Quad-Turbo", zeroToSixty: "2.4s", topspeed: "350 km/h" },
  roadster: { hp: "820 HP", engine: "V12 Twin-Turbo", zeroToSixty: "2.6s", topspeed: "340 km/h" },
};

const FINISHES = [
  { name: "Raw Carbon", color: "#111", filter: "contrast(1.15) brightness(0.95)" },
  { name: "Crimson Red", color: "#7a1525", filter: "hue-rotate(-15deg) saturate(1.4) contrast(1.1)" },
  { name: "Liquid Gold", color: "#a1824a", filter: "sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.05)" },
];

export default function KukujangPreview() {
  const [model, setModel] = useState<"coupe" | "roadster">("coupe");
  const [finish, setFinish] = useState(0);

  const specs = SPECIFICATIONS[model];
  const activeFinish = FINISHES[finish];

  return (
    <div className="kj-preview">
      {/* Top telemetry specs */}
      <div className="kj-spec-bar">
        <div className="kj-spec">
          <span className="kj-spec-lbl">Power</span>
          <span className="kj-spec-val">{specs.hp}</span>
        </div>
        <div className="kj-spec">
          <span className="kj-spec-lbl">0–100 km/h</span>
          <span className="kj-spec-val">{specs.zeroToSixty}</span>
        </div>
        <div className="kj-spec">
          <span className="kj-spec-lbl">Vmax</span>
          <span className="kj-spec-val">{specs.topspeed}</span>
        </div>
      </div>

      {/* Main product display */}
      <div className="kj-display">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={model === "coupe" ? "images/projects/kukujang-car.webp" : "images/projects/kukujang-car2.jpg"}
          alt="Luxury Car Model"
          className="kj-car-image"
          style={{ filter: activeFinish.filter }}
        />
        <div className="kj-overlay" />
      </div>

      {/* Model & Config Controls */}
      <div className="kj-controls">
        <div className="kj-models">
          <button
            className={`kj-btn${model === "coupe" ? " active" : ""}`}
            onClick={() => setModel("coupe")}
          >
            Coupe
          </button>
          <button
            className={`kj-btn${model === "roadster" ? " active" : ""}`}
            onClick={() => setModel("roadster")}
          >
            Roadster
          </button>
        </div>

        <div className="kj-finishes">
          {FINISHES.map((f, i) => (
            <button
              key={f.name}
              className={`kj-finish-dot${finish === i ? " active" : ""}`}
              style={{ backgroundColor: f.color }}
              title={f.name}
              onClick={() => setFinish(i)}
            />
          ))}
        </div>
      </div>

      {/* Brand title overlay */}
      <div className="kj-title-overlay">
        <span className="kj-brand">AVCG LONGBOW</span>
        <span className="kj-model-type">{model === "coupe" ? "Concept V11" : "Roadster Edition"}</span>
      </div>
    </div>
  );
}
