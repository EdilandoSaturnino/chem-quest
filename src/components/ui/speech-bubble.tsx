import type { ReactNode } from "react";

interface SpeechBubbleProps {
  children: ReactNode;
  small?: boolean;
}

export function SpeechBubble({ children, small = false }: SpeechBubbleProps) {
  return (
    <div style={{
      position: "relative", flex: 1,
      background: "linear-gradient(160deg, rgba(40,28,15,0.85), rgba(20,14,8,0.95))",
      border: "1px solid rgba(212,175,55,0.4)", borderRadius: 10,
      padding: small ? "10px 14px" : "14px 18px",
      boxShadow: "inset 0 0 14px rgba(0,0,0,0.4)",
      fontSize: small ? 14 : 16,
      lineHeight: 1.4,
      color: "#e8d5a8",
    }}>
      <div style={{
        position: "absolute", left: -7, top: small ? 16 : 22,
        width: 0, height: 0,
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderRight: "8px solid rgba(212,175,55,0.4)",
      }} />
      <div style={{
        position: "absolute", left: -5, top: small ? 17 : 23,
        width: 0, height: 0,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderRight: "7px solid rgba(30,20,12,0.95)",
      }} />
      {children}
    </div>
  );
}

export function BubbleText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p style={{ whiteSpace: "pre-line", margin: 0 }}>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i} style={{ color: "#d4af37" }}>{p.slice(2, -2)}</strong>;
        }
        return <span key={i}>{p}</span>;
      })}
    </p>
  );
}