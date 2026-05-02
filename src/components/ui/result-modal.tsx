import type { BrewOutcome } from "../../domain/game/brewing-rules";
import { Wizard } from "../wizard/wizard";
import { BubbleText, SpeechBubble } from "./speech-bubble";
import { GhostButton, GoldButton } from "./button";

interface ResultModalProps {
  outcome: BrewOutcome;
  
  message: string;
  onContinue: () => void;
  onBackToMenu: () => void;
}

const TITLES: Record<BrewOutcome["kind"], string> = {
  "challenge-hit":  "Missão Cumprida!",
  "challenge-off":  "Quase lá... -1 vida",
  "challenge-miss": "Receita errada -1 vida",
  "discovery":      "Descoberta!",
  "free-potion":    "Poção Mágica",
  "free-fizzle":    "Sem reação",
};

const ICONS: Record<BrewOutcome["kind"], string> = {
  "challenge-hit":  "🏆",
  "challenge-off":  "💔",
  "challenge-miss": "💔",
  "discovery":      "🔮",
  "free-potion":    "🧪",
  "free-fizzle":    "💨",
};

function isPositive(kind: BrewOutcome["kind"]): boolean {
  return kind === "challenge-hit" || kind === "discovery" || kind === "free-potion";
}

export function ResultModal({ outcome, message, onContinue, onBackToMenu }: ResultModalProps) {
  const positive = isPositive(outcome.kind);
  const accent   = positive ? "#d4af37" : "#f87171";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50, padding: 24,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(4,2,10,0.85)", backdropFilter: "blur(8px)",
    }}>
      <div style={{
        maxWidth: 460, width: "100%", padding: 28,
        borderRadius: 12, textAlign: "center",
        background: positive
          ? "linear-gradient(160deg, rgba(40,30,10,0.96), rgba(20,15,5,0.98))"
          : "linear-gradient(160deg, rgba(30,18,18,0.96), rgba(15,8,8,0.98))",
        border: `1px solid ${positive ? "#d4af37" : "#7c2d2d"}`,
        boxShadow: `0 0 60px ${positive ? "rgba(212,175,55,0.5)" : "rgba(180,40,40,0.35)"}`,
        animation: "result-rise 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          textAlign: "left", marginBottom: 20,
        }}>
          <Wizard size={80} intensity={0.6} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10, letterSpacing: "0.3em",
              textTransform: "uppercase", marginBottom: 4, color: accent,
            }}>
              {ICONS[outcome.kind]} {TITLES[outcome.kind]}
            </div>
            <SpeechBubble small>
              <BubbleText text={message} />
            </SpeechBubble>
          </div>
        </div>

        {outcome.points > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: '"Cinzel", serif', fontSize: 36, fontWeight: 700,
              color: "#10d96a", textShadow: "0 0 18px rgba(16,217,106,0.5)",
            }}>
              +{outcome.points}
            </div>
            <div style={{
              fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(232,213,168,0.45)",
            }}>
              pontos
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <GhostButton onClick={onBackToMenu}>MENU</GhostButton>
          <GoldButton onClick={onContinue}>CONTINUAR</GoldButton>
        </div>
      </div>
    </div>
  );
}