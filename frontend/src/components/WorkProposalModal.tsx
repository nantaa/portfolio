"use client";

import { useEffect, useRef, useState } from "react";

interface WorkProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontFamily: "var(--mono)",
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text)",
  fontWeight: 600,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--s2)",
  border: "1px solid var(--wire)",
  borderRadius: "3px",
  color: "var(--text)",
  fontSize: "14px",
  lineHeight: 1.5,
  outline: "none",
};

export default function WorkProposalModal({ isOpen, onClose }: WorkProposalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [engagementType, setEngagementType] = useState("Contract / Freelance");
  const [timeline, setTimeline] = useState("Immediate");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, engagementType, timeline, brief }),
      }).catch(() => null);
    } catch {
      // Static export fallback handled below
    }

    const subject = encodeURIComponent(`Work Proposal (${engagementType}): ${name}`);
    const body = encodeURIComponent(
      `Name / Organization: ${name}\nReply Email: ${email}\nEngagement: ${engagementType}\nTimeline: ${timeline}\n\nProject Brief:\n${brief}\n`
    );
    window.location.href = `mailto:rifai.aryo@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--modal-bg)",
          border: "1px solid var(--wire)",
          color: "var(--text)",
          borderRadius: "4px",
          padding: "32px 36px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            borderBottom: "1px solid var(--wire)",
            paddingBottom: "18px",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--accent)",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              Work Proposal
            </div>
            <h2
              id="proposal-modal-title"
              style={{
                fontFamily: "var(--display)",
                fontSize: "26px",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Propose a Project or Role
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close work proposal modal"
            style={{
              background: "transparent",
              border: "none",
              fontFamily: "var(--mono)",
              fontSize: "12px",
              textTransform: "uppercase",
              color: "var(--muted)",
              cursor: "pointer",
              padding: "4px 6px",
            }}
          >
            Close [ESC]
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                padding: "16px 18px",
                border: "1px solid var(--wire)",
                background: "var(--s2)",
                borderRadius: "3px",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Your email client has been opened with the structured proposal for <strong>rifai.aryo@gmail.com</strong>.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                style={{
                  padding: "11px 24px",
                  background: "var(--accent)",
                  color: "#ffffff",
                  border: "none",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
              <div>
                <label style={labelStyle}>Your Name / Company</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe · Acme Corp"
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@acme.com"
                  style={fieldStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
              <div>
                <label style={labelStyle}>Engagement Type</label>
                <select
                  value={engagementType}
                  onChange={(e) => setEngagementType(e.target.value)}
                  style={fieldStyle}
                >
                  <option value="Full-Time Role">Full-Time Role</option>
                  <option value="Contract / Freelance">Contract / Freelance</option>
                  <option value="Systems Architecture">Systems Architecture</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Target Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  style={fieldStyle}
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 30 Days">Within 30 Days</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Project Scope / Brief</label>
              <textarea
                required
                rows={4}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe your system goals, architecture needs, or team role..."
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "4px",
                paddingTop: "20px",
                borderTop: "1px solid var(--wire)",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "11px 22px",
                  border: "1px solid var(--wire)",
                  background: "transparent",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "11px 24px",
                  border: "none",
                  background: "var(--accent)",
                  color: "#ffffff",
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Send Proposal →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
