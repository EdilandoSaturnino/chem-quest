import type { ReactNode } from "react";
import { Lives } from "../ui/lives";

interface TopBarProps {
  onBack: () => void;
  modeLabel: string;
  score?: number;
  lives?: number;
  extra?: ReactNode;
}


export function TopBar({ onBack, modeLabel, score, lives, extra }: TopBarProps) {
  return (
    <header style={{
      padding: "12px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid rgba(212,175,55,0.15)",
      flexShrink: 0,
    }}>
      <BackButton onClick={onBack} />

      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(232,213,168,0.55)",
        }}>
          {modeLabel}
        </div>
        {extra}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {lives !== undefined && <Lives count={lives} />}
        {score !== undefined && <ScoreDisplay score={score} />}
      </div>
    </header>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="press"
      style={{
        background: "transparent", border: "none",
        color: "rgba(232,213,168,0.6)",
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#e8d5a8";
        e.currentTarget.style.background = "rgba(212,175,55,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(232,213,168,0.6)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ fontSize: 18 }}>←</span>
      <span style={{
        fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
        fontFamily: '"Cinzel", serif',
      }}>
        Menu
      </span>
    </button>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontFamily: '"Cinzel", serif' }}>
      <span style={{
        color: "rgba(232,213,168,0.4)", fontSize: 10,
        letterSpacing: "0.25em", textTransform: "uppercase",
      }}>Score</span>
      <span style={{
        fontSize: 24, fontWeight: 700, color: "#d4af37",
        textShadow: "0 0 10px rgba(212,175,55,0.4)",
      }}>
        {score}
      </span>
    </div>
  );
}