import { useMemo } from "react";
import { Wizard } from "../../components/wizard/wizard";
import { SpeechBubble } from "../../components/ui/speech-bubble";
import { MODE_CONFIG, type GameMode, type ModeConfig } from "../../domain/game/game-mode";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { leaderboardRepository } from "../../infra/local-storage-leaderboard-repository";
import type { LeaderboardEntry } from "../../domain/leaderboard/leaderboard-entry";

interface HomeScreenProps {
  onPick: (mode: GameMode) => void;
}

const PANEL_WIDTH = 300;
const PANEL_GUTTER = 20;
const CONTENT_MAX = 1180;

export function HomeScreen({ onPick }: HomeScreenProps) {
  const pinPanel = useIsDesktop(1120);
  const heroRow = useIsDesktop(760);
  const wide = useIsDesktop(1500);

  const topEntries = useMemo(
    () => [...leaderboardRepository.load()].sort((a, b) => b.score - a.score).slice(0, 8),
    [],
  );

  const hall = <HallOfFame entries={topEntries} onOpen={() => onPick("ranking")} />;

  return (
    <div
      className="scrollbar"
      style={{
        height: "100%", width: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "clamp(12px, 2vh, 26px)",
        paddingTop: "clamp(12px, 2vh, 26px)",
        paddingBottom: "clamp(12px, 2vh, 26px)",
        paddingLeft: pinPanel && wide ? PANEL_WIDTH + PANEL_GUTTER * 2 : 24,
        paddingRight: pinPanel ? PANEL_WIDTH + PANEL_GUTTER * 2 : 24,
        overflow: "auto",
      }}
    >
      {pinPanel && (
        <div style={{
          position: "fixed", top: PANEL_GUTTER, right: PANEL_GUTTER,
          width: PANEL_WIDTH, zIndex: 20,
          animation: "fade-up 0.5s ease-out",
        }}>
          {hall}
        </div>
      )}

      <Hero row={heroRow} wide={wide} />
      <ModeGrid onPick={onPick} threeUp={heroRow} />
      <Footer />

      {!pinPanel && (
        <div style={{ width: "100%", maxWidth: 560 }}>{hall}</div>
      )}
    </div>
  );
}

function Hero({ row, wide }: { row: boolean; wide: boolean }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: row ? "row" : "column",
      alignItems: "center", justifyContent: "center",
      gap: row ? 30 : 10,
      width: "100%", maxWidth: CONTENT_MAX,
      animation: "fade-up 0.5s ease-out",
    }}>
      <Wizard size={row ? (wide ? 236 : 190) : 150} />

      <div style={{
        flex: row ? 1 : "none", minWidth: 0, width: row ? undefined : "100%",
        textAlign: row ? "left" : "center",
      }}>
        <h1 style={{
          fontFamily: '"Cinzel", serif', fontWeight: 900,
          fontSize: "clamp(38px, 4.6vw, 78px)",
          lineHeight: 1.02,
          color: "#d4af37", textShadow: "0 0 30px rgba(212,175,55,0.55)",
          margin: 0, letterSpacing: "0.04em",
        }}>
          ChemQuest
        </h1>
        <p style={{
          fontStyle: "italic", color: "rgba(232,213,168,0.66)",
          fontSize: "clamp(17px, 1.35vw, 25px)", margin: "6px 0 16px",
          letterSpacing: "0.04em",
        }}>
          Códex do Alquimista
        </p>

        <SpeechBubble>
          <p style={{
            fontFamily: '"Cinzel", serif', color: "#d4af37",
            fontWeight: 700, fontSize: "clamp(19px, 1.5vw, 27px)",
            margin: "0 0 7px", letterSpacing: "0.02em",
          }}>
            Saudações, aprendiz!
          </p>
          <p style={{
            margin: 0, fontSize: "clamp(17px, 1.15vw, 22px)", lineHeight: 1.45,
          }}>
            Sou o <em>Mestre</em>. Escolha um caminho — eu te guio em cada passo.
          </p>
        </SpeechBubble>
      </div>
    </div>
  );
}

function ModeGrid({
  onPick, threeUp,
}: { onPick: (mode: GameMode) => void; threeUp: boolean }) {
  const modes = (Object.entries(MODE_CONFIG) as [GameMode, ModeConfig][])
    .filter(([key]) => key !== "ranking");

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: threeUp
        ? "repeat(3, minmax(0, 1fr))"
        : "repeat(auto-fit, minmax(148px, 1fr))",
      gap: 16, width: "100%", maxWidth: CONTENT_MAX,
    }}>
      {modes.map(([key, m]) => (
        <ModeCard key={key} mode={m} onClick={() => onPick(key)} />
      ))}
    </div>
  );
}

function ModeCard({ mode, onClick }: { mode: ModeConfig; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="press"
      style={{
        background: "linear-gradient(160deg, rgba(40,28,15,0.7), rgba(20,14,8,0.9))",
        border: `1.5px solid ${mode.accent}55`,
        borderRadius: 12, padding: "18px 14px", textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        color: "#e8d5a8", minHeight: 158,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 0 26px ${mode.accent}66`;
        e.currentTarget.style.borderColor = `${mode.accent}aa`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = `${mode.accent}55`;
      }}
    >
      <div style={{ fontSize: 40, lineHeight: 1 }}>{mode.emoji}</div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 20, fontWeight: 700,
        color: mode.accent, textShadow: `0 0 10px ${mode.accent}55`,
        lineHeight: 1.15,
      }}>
        {mode.title}
      </div>
      <div style={{
        fontSize: 17, fontStyle: "italic",
        color: "rgba(232,213,168,0.68)", lineHeight: 1.35,
      }}>
        {mode.desc}
      </div>
    </button>
  );
}

function Footer() {
  return (
    <p style={{
      textAlign: "center", fontStyle: "italic",
      color: "rgba(232,213,168,0.42)",
      fontSize: 15, margin: 0,
      letterSpacing: "0.22em", textTransform: "uppercase",
    }}>
      ✦ Onde a química vira magia ✦
    </p>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];
const MEDAL_COLORS = ["#facc15", "#cbd5e1", "#d97706"];

function HallOfFame({
  entries, onOpen,
}: { entries: readonly LeaderboardEntry[]; onOpen: () => void }) {
  return (
    <aside style={{
      background: "linear-gradient(160deg, rgba(44,31,16,0.94), rgba(18,12,7,0.96))",
      border: "1px solid rgba(212,175,55,0.42)",
      borderRadius: 14,
      padding: "16px 16px 14px",
      boxShadow: "0 18px 42px rgba(0,0,0,0.55), inset 0 0 22px rgba(212,175,55,0.06)",
    }}>
      <header style={{
        display: "flex", alignItems: "center", gap: 9,
        paddingBottom: 11, marginBottom: 12,
        borderBottom: "1px solid rgba(212,175,55,0.22)",
      }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>👑</span>
        <h2 style={{
          margin: 0, fontFamily: '"Cinzel", serif',
          fontSize: 17, fontWeight: 700, color: "#facc15",
          letterSpacing: "0.06em", textShadow: "0 0 12px rgba(250,204,21,0.45)",
        }}>
          Hall da Fama
        </h2>
      </header>

      {entries.length === 0 ? (
        <p style={{
          margin: "2px 0 12px", fontSize: 17, fontStyle: "italic",
          lineHeight: 1.5, color: "rgba(232,213,168,0.6)",
        }}>
          Nenhum alquimista registrou seu nome ainda. Seja o primeiro!
        </p>
      ) : (
        <ol style={{
          listStyle: "none", margin: "0 0 12px", padding: 0,
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          {entries.map((entry, i) => (
            <HallRow key={entry.ts} entry={entry} rank={i} />
          ))}
        </ol>
      )}

      <button
        onClick={onOpen}
        className="press"
        style={{
          width: "100%", background: "transparent",
          border: "1px solid rgba(212,175,55,0.35)",
          color: "rgba(232,213,168,0.78)",
          fontFamily: '"Cinzel", serif', fontSize: 14,
          letterSpacing: "0.16em", textTransform: "uppercase",
          padding: "9px 0", borderRadius: 8,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#e8d5a8";
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.7)";
          e.currentTarget.style.background = "rgba(212,175,55,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(232,213,168,0.78)";
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        Ver Hall completo →
      </button>
    </aside>
  );
}

function HallRow({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  const podium = rank < 3;
  return (
    <li style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "7px 10px", borderRadius: 9,
      background: podium
        ? `linear-gradient(150deg, rgba(212,175,55,${0.2 - rank * 0.05}), rgba(20,14,8,0.55))`
        : "rgba(255,255,255,0.03)",
      border: podium
        ? "1px solid rgba(212,175,55,0.42)"
        : "1px solid rgba(212,175,55,0.12)",
    }}>
      <span style={{
        width: 26, textAlign: "center", flexShrink: 0,
        fontFamily: '"Cinzel", serif', fontWeight: 700,
        fontSize: podium ? 17 : 14,
        color: podium ? MEDAL_COLORS[rank] : "rgba(232,213,168,0.55)",
      }}>
        {podium ? MEDALS[rank] : rank + 1}
      </span>
      <span style={{
        flex: 1, minWidth: 0,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        fontFamily: '"Cinzel", serif', fontSize: 17, color: "#e8d5a8",
      }}>
        {entry.name}
      </span>
      <span style={{
        flexShrink: 0, fontFamily: '"Cinzel", serif',
        fontSize: 17, fontWeight: 700, color: "#d4af37",
        textShadow: "0 0 10px rgba(212,175,55,0.35)",
      }}>
        {entry.score}
      </span>
    </li>
  );
}
