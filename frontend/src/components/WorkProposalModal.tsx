"use client";

import { useEffect, useRef, useState } from "react";

interface WorkProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-[var(--modal-bg)] border border-[var(--wire)] text-[var(--text)] rounded-[3px] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--wire)] pb-4 mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">
              Work Proposal
            </div>
            <h2 id="proposal-modal-title" className="font-serif text-2xl font-bold mt-1">
              Propose a Project or Role
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close work proposal modal"
            className="font-mono text-xs uppercase text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
          >
            Close [ESC]
          </button>
        </div>

        {submitted ? (
          <div className="py-6 space-y-4">
            <div className="p-4 border border-[var(--wire)] bg-[var(--s2)] rounded-[2px] text-sm">
              Your email client has been opened with the structured proposal for <strong>rifai.aryo@gmail.com</strong>.
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-4 py-2 bg-[var(--accent)] text-white font-mono text-xs uppercase tracking-wider rounded-[2px] cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Your Name / Company
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe · Acme Corp"
                  className="w-full px-3 py-2 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px] text-[var(--text)] text-xs focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@acme.com"
                  className="w-full px-3 py-2 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px] text-[var(--text)] text-xs focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Engagement Type
                </label>
                <select
                  value={engagementType}
                  onChange={(e) => setEngagementType(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px] text-[var(--text)] text-xs focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="Full-Time Role">Full-Time Role</option>
                  <option value="Contract / Freelance">Contract / Freelance</option>
                  <option value="Systems Architecture">Systems Architecture</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Target Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px] text-[var(--text)] text-xs focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 30 Days">Within 30 Days</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                Project Scope / Brief
              </label>
              <textarea
                required
                rows={4}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe your system goals, architecture needs, or team role..."
                className="w-full px-3 py-2 bg-[var(--s2)] border border-[var(--wire)] rounded-[2px] text-[var(--text)] text-xs focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[var(--wire)] font-mono text-xs uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)] rounded-[2px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent2)] text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-[2px] cursor-pointer"
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

