"use client";

import { useState } from "react";

type AuditResult = {
  score: number;
  types_detected: string[];
  explanation: string;
};

type ReviewResult = {
  critique: string;
  audit: AuditResult;
};

const TYPE_LABELS: Record<string, string> = {
  affirmative_opener: "Affirmative opener",
  hedge_then_validate: "Hedge-then-validate",
  capitulation: "Capitulation",
  uncritical_mirroring: "Uncritical mirroring",
  vague_softening: "Vague softening",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score <= 3
      ? "var(--score-low)"
      : score <= 6
      ? "var(--score-mid)"
      : "var(--score-high)";

  const label = score <= 3 ? "Low" : score <= 6 ? "Moderate" : "High";

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex items-center justify-center"
        style={{ width: 56, height: 56 }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute" }}>
          <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${(score / 10) * 150.8} 150.8`}
            strokeLinecap="round"
            transform="rotate(-90 28 28)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 500, color, fontFamily: "'DM Mono', monospace" }}>
          {score}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Sycophancy
        </div>
        <div style={{ fontSize: 14, color, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 py-2">
      <span className="thinking-dot" />
      <span className="thinking-dot" />
      <span className="thinking-dot" />
    </div>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setText("");
    setCharCount(0);
    setError("");
  };

  return (
    <main
      style={{ minHeight: "100vh", backgroundColor: "var(--paper)" }}
      className="flex flex-col"
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--paper)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
        className="px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
            }}
          />
          <span
            className="serif"
            style={{ fontSize: 20, letterSpacing: "-0.01em", color: "var(--ink)" }}
          >
            SycophAI
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Writing Review
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-12">
        <div style={{ width: "100%", maxWidth: 720 }}>

          {/* Intro */}
          {!result && (
            <div className="fade-up mb-10">
              <h1
                className="serif"
                style={{
                  fontSize: 42,
                  lineHeight: 1.15,
                  color: "var(--ink)",
                  marginBottom: 12,
                  letterSpacing: "-0.02em",
                }}
              >
                Honest feedback,
                <br />
                <span style={{ color: "var(--accent)", fontStyle: "italic" }}>
                  no flattery.
                </span>
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  maxWidth: 480,
                }}
              >
                Paste your writing below. SycophAI will critique it honestly — then
                audit its own response for sycophancy, so you can see how agreeable it was.
              </p>
            </div>
          )}

          {/* Input area */}
          {!result && (
            <div
              className="fade-up"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 4,
                backgroundColor: "var(--paper)",
                overflow: "hidden",
              }}
            >
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                placeholder="Paste your writing here..."
                rows={14}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "var(--ink)",
                  backgroundColor: "transparent",
                  fontFamily: "'Instrument Serif', serif",
                  border: "none",
                }}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
                }}
              />
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--paper-dark)",
                }}
              >
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {charCount > 0 ? `${charCount} chars` : "⌘ + Enter to submit"}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim() || loading}
                  style={{
                    backgroundColor: text.trim() && !loading ? "var(--accent)" : "var(--border)",
                    color: text.trim() && !loading ? "var(--paper)" : "var(--muted)",
                    border: "none",
                    borderRadius: 3,
                    padding: "8px 20px",
                    fontSize: 12,
                    fontFamily: "'DM Mono', monospace",
                    cursor: text.trim() && !loading ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.04em",
                  }}
                >
                  {loading ? "Reviewing..." : "Review →"}
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="fade-up mt-8">
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                Pass 1 — generating critique
              </div>
              <ThinkingDots />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="fade-up mt-6"
              style={{
                padding: "14px 18px",
                border: "1px solid var(--accent)",
                borderRadius: 4,
                fontSize: 13,
                color: "var(--accent)",
              }}
            >
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="fade-up">
              {/* Original text preview */}
              <div
                style={{
                  padding: "14px 18px",
                  backgroundColor: "var(--paper-dark)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  marginBottom: 24,
                  fontSize: 13,
                  color: "var(--muted)",
                  fontFamily: "'Instrument Serif', serif",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
                  Your writing
                </div>
                {text.length > 280 ? text.slice(0, 280) + "…" : text}
              </div>

              {/* Critique */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: 14,
                  }}
                >
                  Critique — Pass 1
                </div>
                <div
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "var(--ink)",
                    fontFamily: "'Instrument Serif', serif",
                  }}
                >
                  {result.critique.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: 16 }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Audit panel */}
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--paper-dark)",
                    borderBottom: "1px solid var(--border)",
                    padding: "10px 18px",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  Sycophancy audit — Pass 2
                </div>
                <div style={{ padding: "20px 18px" }}>
                  <div className="flex items-start gap-6">
                    <ScoreBadge score={result.audit.score} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.65, marginBottom: 10 }}>
                        {result.audit.explanation}
                      </p>
                      {(result.audit.types_detected ?? []).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.audit.types_detected.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontSize: 11,
                                padding: "3px 10px",
                                borderRadius: 2,
                                backgroundColor: "var(--accent-light)",
                                color: "var(--accent)",
                                border: "1px solid rgba(200,75,47,0.2)",
                                fontFamily: "'DM Mono', monospace",
                              }}
                            >
                              {TYPE_LABELS[t] ?? t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 2,
                            backgroundColor: "#e8f2ec",
                            color: "var(--score-low)",
                            border: "1px solid rgba(74,124,89,0.2)",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          No sycophancy detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.04em",
                  padding: 0,
                  textDecoration: "underline",
                  textDecorationColor: "var(--border)",
                  textUnderlineOffset: 3,
                }}
              >
                ← Review another piece
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
