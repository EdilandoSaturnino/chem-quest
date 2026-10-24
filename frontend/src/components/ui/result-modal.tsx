import type { BrewOutcome } from "../../domain/game/brewing-rules";
import { useIsDesktop } from "../../hooks/useIsDesktop";
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
  const isDesktop = useIsDesktop();
  const positive  = isPositive(outcome.kind);
  const accent    = positive ? "#d4af37" : "#f87171";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50, padding: isDesktop ? 24 : 16,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(4,2,10,0.85)", backdropFilter: "blur(8px)",
    }}>
      <div style={{
        maxWidth: 680, width: "100%", maxHeight: "100%", overflowY: "auto",
        padding: isDesktop ? 40 : 22,
        borderRadius: 16, textAlign: "center",
        background: positive
          ? "linear-gradient(160deg, rgba(40,30,10,0.96), rgba(20,15,5,0.98))"
          : "linear-gradient(160deg, rgba(30,18,18,0.96), rgba(15,8,8,0.98))",
        border: `1px solid ${positive ? "#d4af37" : "#7c2d2d"}`,
        boxShadow: `0 0 60px ${positive ? "rgba(212,175,55,0.5)" : "rgba(180,40,40,0.35)"}`,
        animation: "result-rise 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{
          fontSize: isDesktop ? 30 : 22, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: isDesktop ? 20 : 14, color: accent,
        }}>
          {ICONS[outcome.kind]} {TITLES[outcome.kind]}
        </div>

        <div style={{
          display: "flex", alignItems: "flex-start", gap: isDesktop ? 18 : 10,
          textAlign: "left", marginBottom: isDesktop ? 28 : 20,
        }}>
          <Wizard size={isDesktop ? 120 : 72} intensity={0.6} />
          <SpeechBubble>
            <div style={{ fontSize: isDesktop ? 21 : 17, lineHeight: 1.45 }}>
              <BubbleText text={message} />
            </div>
          </SpeechBubble>
        </div>

        {outcome.points > 0 && (
          <div style={{ marginBottom: isDesktop ? 28 : 20 }}>
            <div style={{
              fontFamily: '"Cinzel", serif', fontSize: isDesktop ? 56 : 44, fontWeight: 700,
              color: "#10d96a", textShadow: "0 0 18px rgba(16,217,106,0.5)",
            }}>
              +{outcome.points}
            </div>
            <div style={{
              fontSize: 16, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(232,213,168,0.55)",
            }}>
              pontos
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <GhostButton
            onClick={onBackToMenu}
            style={{ fontSize: isDesktop ? 21 : 18, padding: isDesktop ? "14px 28px" : "12px 20px" }}
          >
            MENU
          </GhostButton>
          <GoldButton
            onClick={onContinue}
            style={{ fontSize: isDesktop ? 21 : 18, padding: isDesktop ? "14px 40px" : "12px 28px" }}
          >
            CONTINUAR
          </GoldButton>
        </div>
      </div>
    </div>
  );
}