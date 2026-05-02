import { useState } from "react";
import { TopBar } from "../../components/layout/top-bar";
import { leaderboardRepository } from "../../infra/LocalStorageLeaderboardRepository";
import type { LeaderboardEntry } from "../../domain/leaderboard/leaderboard-entry";
import { MODE_CONFIG } from "../../domain/game/game-mode";

interface LeaderboardScreenProps {
  onBack: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = ["#facc15", "#cbd5e1", "#d97706"];

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [list, setList] = useState<readonly LeaderboardEntry[]>(() =>
    leaderboardRepository.load()
  );

  function handleClear() {
    if (!window.confirm("Apagar todo o Hall da Fama? Essa ação não pode ser desfeita.")) return;
    leaderboardRepository.clear();
    setList([]);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar onBack={onBack} modeLabel="👑 Hall da Fama" />

      <main style={{
        flex: 1, padding: 24, overflow: "auto",
        maxWidth: 800, margin: "0 auto", width: "100%",
        display: "flex", flexDirection: "column",
      }} className="scrollbar">
        {list.length === 0 ? <EmptyState /> : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {list.slice(0, 20).map((entry, i) => (
                <RankRow key={entry.ts} entry={entry} rank={i} />
              ))}
            </div>
            <ClearButton onClear={handleClear} />
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>📜</div>
      <p style={{
        fontStyle: "italic", color: "rgba(232,213,168,0.55)",
        fontSize: 18, lineHeight: 1.5,
      }}>
        Nenhum alquimista registrou seu nome ainda.<br />
        Seja o primeiro!
      </p>
    </div>
  );
}

function RankRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const isPodium  = rank < 3;
  const podiumIdx = rank;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "12px 18px", borderRadius: 10,
      background: isPodium
        ? `linear-gradient(160deg, rgba(212,175,55,${0.18 - rank * 0.05}), rgba(20,14,8,0.85))`
        : "linear-gradient(160deg, rgba(40,28,15,0.5), rgba(20,14,8,0.7))",
      border: isPodium ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(212,175,55,0.15)",
    }}>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 22, fontWeight: 700,
        color: isPodium ? MEDAL_COLORS[podiumIdx] : "rgba(232,213,168,0.55)",
        width: 50, textAlign: "center",
        textShadow: isPodium ? `0 0 12px ${MEDAL_COLORS[podiumIdx]}88` : "none",
      }}>
        {isPodium ? MEDALS[podiumIdx] : `#${rank + 1}`}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 18, color: "#e8d5a8",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {entry.name}
        </div>
        <div style={{
          fontSize: 11, color: "rgba(232,213,168,0.45)",
          letterSpacing: "0.15em", textTransform: "uppercase",
        }}>
          {MODE_CONFIG[entry.mode]?.title ?? entry.mode}
        </div>
      </div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 24, fontWeight: 700,
        color: "#d4af37", textShadow: "0 0 10px rgba(212,175,55,0.4)",
      }}>
        {entry.score}
      </div>
    </div>
  );
}

function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      style={{
        marginTop: 20, padding: "8px 16px", borderRadius: 6,
        background: "transparent", border: "1px solid rgba(248,113,113,0.4)",
        color: "rgba(248,113,113,0.7)",
        fontFamily: '"Cinzel", serif', fontSize: 11,
        letterSpacing: "0.2em", textTransform: "uppercase",
        alignSelf: "center", cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#f87171";
        e.currentTarget.style.borderColor = "#f87171";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(248,113,113,0.7)";
        e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
      }}
    >
      Limpar histórico
    </button>
  );
}