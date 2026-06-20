import { useEffect, useMemo } from "react";
import { Wizard } from "../../components/wizard/wizard";
import { BubbleText } from "../../components/ui/speech-bubble";
import { ElementCard } from "../../components/ui/element-card";
import { BottomBar } from "../../components/ui/bottom-bar";
import { ResultModal } from "../../components/ui/result-modal";
import { TopBar } from "../../components/layout/top-bar";
import { ELEMENTS } from "../../domain/elements/element-catalog";
import {
  MODE_CONFIG,
  type ChallengeMode,
  type PlayableMode,
} from "../../domain/game/game-mode";
import type { BrewOutcome } from "../../domain/game/brewing-rules";
import { useRotatingHints } from "./useRotatinghints";
import { usePlaySession } from "./usePlaySession";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { getSelectedElementsLiquidHue, hueToRgb } from "../../domain/elements/element-color";
import type { ChemHardwareControls } from "../../hooks/useChemHardware";

const FREE_MODE_HINTS = [
  "Modo Livre: misture o que quiser e descubra compostos.",
  "Toque um elemento — eu te conto algo sobre ele.",
  "Combinações com 2 elementos têm mais chance de virar poção.",
  "Tente Na + Cl. Aposto que conhece o resultado!",
  "H + O é a combinação mais famosa de todas.",
];

interface PlayScreenProps {
  mode: PlayableMode;
  score: number;
  lives: number;
  onScoreGained: (delta: number) => void;
  onLifeLost: () => void;
  onBack: () => void;
  onGameOver: () => void;
  hardware: ChemHardwareControls;
}

export function PlayScreen({
  mode, score, lives,
  onScoreGained, onLifeLost,
  onBack, onGameOver,
  hardware,
}: PlayScreenProps) {
  const isDesktop = useIsDesktop();
  const isChallenge = mode !== "livre";

  const session = usePlaySession({ mode, onScoreGained, onLifeLost, hardware });

  useEffect(() => {
    if (session.brewing || session.lastOutcome) return;

    if (session.selectedElements.length === 0) {
      void hardware.off();
      return;
    }

    const hue = getSelectedElementsLiquidHue(session.selectedElements);
    void hardware.preview(hueToRgb(hue));
  }, [hardware, session.brewing, session.lastOutcome, session.selectedElements]);

  useEffect(() => () => {
    void hardware.off();
  }, [hardware]);


  const currentHints = useMemo(() => {
    if (isChallenge && session.target) return session.target.hints;
    return FREE_MODE_HINTS;
  }, [isChallenge, session.target]);

  const { bubbleText, showTransient, resetHintIndex } = useRotatingHints({
    hints: currentHints,
    enabled: !session.brewing && !session.lastOutcome,
    fallback: "Que mistura tentar agora?",
  });


  useEffect(() => {
    resetHintIndex();
  }, [session.target, resetHintIndex]);


  useEffect(() => {
    if (session.attemptedToExceedLimit && session.maxElements) {
      showTransient(
        `Limite de **${session.maxElements} elementos** neste modo. Remova um para trocar.`,
        3500,
      );
    }
  }, [session.attemptedToExceedLimit, session.maxElements, showTransient]);

  function handleToggle(idx: number) {
    const wasSelected = session.selectedIndices.includes(idx);
    session.toggleElement(idx);
    if (!wasSelected) {
      const el = ELEMENTS[idx]!;
      showTransient(`**${el.real}** (${el.sym}) — ${el.fact}`);
    }
  }


  useEffect(() => {
    if (lives <= 0 && session.lastOutcome) {

      const id = setTimeout(onGameOver, 1200);
      return () => clearTimeout(id);
    }
  }, [lives, session.lastOutcome, onGameOver]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar
        onBack={onBack}
        modeLabel={`${MODE_CONFIG[mode].emoji} ${MODE_CONFIG[mode].title}`}
        score={score}
        lives={isChallenge ? lives : undefined}
        extra={isChallenge && session.target && (
          <MissionLabel
            name={session.target.name}
            elementCount={session.target.els.length}
            mode={mode as ChallengeMode}
          />
        )}
      />

      <main style={{
        flex: 1, display: "grid", gap: 16, padding: 16, minHeight: 0,
        gridTemplateColumns: isDesktop ? "300px 1fr" : "1fr",
      }}>
        <WizardPanel bubbleText={bubbleText} />

        <section style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{
            flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10, minHeight: 0, marginBottom: 12,
          }}>
            {ELEMENTS.map((el, i) => {
              const isSelected = session.selectedIndices.includes(i);
              const limitReached = session.maxElements
                ? !isSelected && session.selectedIndices.length >= session.maxElements
                : false;
              return (
                <ElementCard
                  key={i}
                  element={el}
                  selected={isSelected}
                  disabled={session.brewing}
                  limitReached={limitReached}
                  onClick={() => handleToggle(i)}
                />
              );
            })}
          </div>

          <BottomBar
            selectedElements={session.selectedElements}
            brewing={session.brewing}
            maxElements={session.maxElements}
            onRemoveAt={(idxInSelection) => {
              const realIdx = session.selectedIndices[idxInSelection];
              if (realIdx !== undefined) handleToggle(realIdx);
            }}
            onClear={session.clearSelection}
            onBrew={session.brew}
          />
        </section>
      </main>

      {session.lastOutcome && lives > 0 && (
        <ResultModal
          outcome={session.lastOutcome}
          message={composeOutcomeMessage(session.lastOutcome)}
          onContinue={session.acknowledgeOutcomeAndAdvance}
          onBackToMenu={onBack}
        />
      )}
    </div>
  );
}

function MissionLabel({
  name, elementCount,
}: { name: string; elementCount: number; mode: ChallengeMode }) {
  return (
    <div style={{
      fontFamily: '"Cinzel", serif',
      fontSize: "clamp(16px, 2vw, 22px)",
      fontWeight: 700, color: "#d4af37", marginTop: 2,
      textShadow: "0 0 12px rgba(212,175,55,0.4)",
    }}>
      {name}
      <span style={{
        fontSize: 12, fontWeight: 400,
        color: "rgba(232,213,168,0.5)", marginLeft: 8,
      }}>
        ({elementCount} elementos)
      </span>
    </div>
  );
}

function WizardPanel({ bubbleText }: { bubbleText: string }) {
  return (
    <aside style={{
      background: "linear-gradient(160deg, rgba(40,28,15,0.6), rgba(20,14,8,0.85))",
      border: "1px solid rgba(212,175,55,0.25)",
      borderRadius: 12, padding: 20,
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center", overflow: "auto",
    }} className="scrollbar">
      <Wizard size={200} />
      <div style={{
        marginTop: 16, width: "100%",
        animation: "fade-up 0.4s ease-out",
      }} key={bubbleText}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 10,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(232,213,168,0.5)", marginBottom: 8,
        }}>
          Mestre Alquimista
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>
          <BubbleText text={bubbleText} />
        </div>
      </div>
    </aside>
  );
}

function composeOutcomeMessage(outcome: BrewOutcome): string {
  switch (outcome.kind) {
    case "challenge-hit":
      return `Perfeito! Você criou **${outcome.compound.name}**. ${outcome.compound.fact}`;
    case "challenge-off":
      return `Você criou **${outcome.compound.name}**! ${outcome.compound.fact}\n\n` +
             `Mas a missão era **${outcome.target.name}**. Tente: ${outcome.target.els.join(" + ")}`;
    case "challenge-miss":
      return `Esses elementos não formam nada conhecido...\n\n` +
             `A receita para **${outcome.target.name}** é: ${outcome.target.els.join(" + ")}`;
    case "discovery":
      return `Você descobriu **${outcome.compound.name}**! ${outcome.compound.fact}`;
    case "free-potion":
      return "Uma poção mágica brotou no caldeirão!";
    case "free-fizzle":
      return "As essências não se misturaram. Tente combinações que existam na natureza.";
  }
}
