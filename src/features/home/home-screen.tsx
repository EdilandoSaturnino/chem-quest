import { Wizard } from "../../components/wizard/wizard";
import { SpeechBubble } from "../../components/ui/speech-bubble";
import { GhostButton, GoldButton } from "../../components/ui/button";
import { MODE_CONFIG, type GameMode, type ModeConfig } from "../../domain/game/game-mode";
import type { ChemHardwareControls, ChemHardwareStatus } from "../../hooks/useChemHardware";

interface HomeScreenProps {
  hardware: ChemHardwareControls;
  onPick: (mode: GameMode) => void;
}

export function HomeScreen({ hardware, onPick }: HomeScreenProps) {
  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 24px", maxWidth: 1200, margin: "0 auto",
      overflow: "auto",
      position: "relative",
    }} className="scrollbar">

      <Title />
      <Greeting />
      <ArduinoPanel hardware={hardware} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: 14, width: "100%", maxWidth: 1100,
      }}>
        {(Object.entries(MODE_CONFIG) as [GameMode, ModeConfig][]).map(([key, m]) => (
          <ModeCard key={key} mode={m} onClick={() => onPick(key)} />
        ))}
      </div>

      <p style={{
        textAlign: "center", fontStyle: "italic",
        color: "rgba(232,213,168,0.3)",
        fontSize: 11, marginTop: 28,
        letterSpacing: "0.2em", textTransform: "uppercase",
      }}>
        ✦ Onde a química vira magia ✦
      </p>
    </div>
  );
}

function ArduinoPanel({ hardware }: { hardware: ChemHardwareControls }) {
  const connected = hardware.status === "connected";
  const connecting = hardware.status === "connecting";
  const unsupported = hardware.status === "unsupported";

  return (
    <div style={{
      position: "absolute", top: 16, right: 16,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
      zIndex: 2,
    }}>
      {connected ? (
        <GhostButton onClick={() => void hardware.disconnect()} style={{ padding: "7px 12px", fontSize: 10 }}>
          DISCONNECT
        </GhostButton>
      ) : (
        <GoldButton
          onClick={() => void hardware.connect()}
          disabled={connecting || unsupported}
          style={{ padding: "7px 12px", fontSize: 10 }}
        >
          {connecting ? "CONNECTING..." : "CONNECT ARDUINO"}
        </GoldButton>
      )}
      {(hardware.status === "error" || unsupported) && (
        <span style={{
          maxWidth: 220, textAlign: "right", fontSize: 11,
          color: "rgba(248,113,113,0.72)", fontStyle: "italic",
        }}>
          {hardware.error ?? statusLabel(hardware.status)}
        </span>
      )}
    </div>
  );
}

function statusLabel(status: ChemHardwareStatus): string {
  switch (status) {
    case "unsupported":
      return "Use Chrome/Edge em localhost para conectar via Web Serial.";
    case "connecting":
      return "Escolha a porta serial do Arduino Nano.";
    case "connected":
      return "Conectado. O LED vai espelhar o cálice durante o jogo.";
    case "error":
      return "Conexão indisponível.";
    case "disconnected":
      return "Opcional: conecte antes de escolher um modo.";
  }
}

function Title() {
  return (
    <div style={{ textAlign: "center", marginBottom: 8 }}>
      <h1 style={{
        fontFamily: '"Cinzel", serif', fontWeight: 900,
        fontSize: "clamp(40px, 7vw, 64px)",
        color: "#d4af37", textShadow: "0 0 24px rgba(212,175,55,0.5)",
        margin: 0, letterSpacing: "0.05em",
      }}>
        ChemQuest
      </h1>
      <p style={{
        fontStyle: "italic", color: "rgba(232,213,168,0.55)",
        fontSize: 18, margin: "4px 0 0",
      }}>
        Códex do Alquimista
      </p>
    </div>
  );
}

function Greeting() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 24, marginBottom: 32,
      maxWidth: 700, width: "100%",
      animation: "fade-up 0.5s ease-out",
    }}>
      <Wizard size={180} />
      <SpeechBubble>
        <p style={{
          fontFamily: '"Cinzel", serif', color: "#d4af37",
          fontWeight: 600, margin: "0 0 4px",
        }}>
          Saudações, aprendiz!
        </p>
        <p style={{ margin: 0 }}>
          Sou o <em>Mestre</em>. Escolha um caminho — eu te guio em cada passo.
        </p>
      </SpeechBubble>
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
        borderRadius: 12, padding: 18, textAlign: "center",
        transition: "all 0.2s", color: "#e8d5a8", minHeight: 150,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 0 24px ${mode.accent}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 8 }}>{mode.emoji}</div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 18, fontWeight: 700,
        color: mode.accent, textShadow: `0 0 8px ${mode.accent}55`,
        marginBottom: 4,
      }}>
        {mode.title}
      </div>
      <div style={{
        fontSize: 13, fontStyle: "italic",
        color: "rgba(232,213,168,0.55)", lineHeight: 1.3,
      }}>
        {mode.desc}
      </div>
    </button>
  );
}
