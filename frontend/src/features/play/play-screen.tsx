import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
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
import type { Compound } from "../../domain/compounds/compound";
import { useRotatingHints } from "./useRotatinghints";
import { usePlaySession } from "./usePlaySession";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { getSelectedElementsBottleColors, OFF_COLOR } from "../../domain/elements/element-color";
import type { ChemHardwareControls } from "../../hooks/useChemHardware";

const FreeModeVoiceActivity = lazy(async () => {
  const module = await import("./free-mode-voice-activity");
  return { default: module.FreeModeVoiceActivity };
});

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
  const freeModeInitializedRef = useRef(false);

  const session = usePlaySession({ mode, onScoreGained, onLifeLost, hardware });

  const [revealKey, setRevealKey] = useState(0);
  useEffect(() => {
    if (isChallenge && session.target) setRevealKey(k => k + 1);
  }, [isChallenge, session.target]);

  const [panelWizardSize, setPanelWizardSize] = useState(170);
  useEffect(() => {
    function fit() {
      const h = window.innerHeight;
      setPanelWizardSize(h >= 950 ? 210 : h >= 820 ? 190 : h >= 720 ? 165 : 135);
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (mode !== "livre") {
      freeModeInitializedRef.current = false;
      return;
    }

    let cancelled = false;
    freeModeInitializedRef.current = false;

    void (async () => {
      await hardware.off();
      if (cancelled) return;

      freeModeInitializedRef.current = true;
      await hardware.enterFreeMode();
    })();

    return () => {
      cancelled = true;
      freeModeInitializedRef.current = false;
    };
  }, [hardware, mode]);

  useEffect(() => {
    if (mode !== "livre") return;
    if (session.brewing || session.lastOutcome) return;

    if (session.selectedElements.length === 0) {
      if (freeModeInitializedRef.current) void hardware.off();
      return;
    }

    void hardware.preview({
      ...getSelectedElementsBottleColors(session.selectedElements),
      middle: OFF_COLOR,
    });
  }, [hardware, mode, session.brewing, session.lastOutcome, session.selectedElements]);

  useEffect(() => {
    if (mode !== "livre") return;

    return () => {
      void hardware.off();
    };
  }, [hardware, mode]);


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
            key={revealKey}
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
        <WizardPanel
          bubbleText={bubbleText}
          target={isChallenge ? session.target : null}
          selectedCount={session.selectedElements.length}
          maxElements={session.maxElements}
          wizardSize={panelWizardSize}
        />

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
        <>
          <ResultModal
            outcome={session.lastOutcome}
            message={composeOutcomeMessage(session.lastOutcome)}
            onContinue={session.acknowledgeOutcomeAndAdvance}
            onBackToMenu={onBack}
          />
          {mode === "livre" && (
            <Suspense fallback={null}>
              <FreeModeVoiceActivity
                mixedElementSymbols={session.selectedElements.map(element => element.sym)}
              />
            </Suspense>
          )}
        </>
      )}

      {isChallenge && session.target && revealKey > 0 && (
        <MissionReveal key={revealKey} target={session.target} />
      )}
    </div>
  );
}

function MissionReveal({ target }: { target: Compound }) {
  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none",
        background:
          "radial-gradient(ellipse at center, rgba(8,4,16,0.84) 0%, rgba(5,2,11,0.6) 55%, rgba(4,2,10,0) 100%)",
        animation: "mission-veil 1150ms ease-out both",
      }} />

      <div style={{
        position: "fixed", top: "50%", left: "50%", zIndex: 61,
        pointerEvents: "none", textAlign: "center",
        width: "min(90vw, 900px)",
        animation: "mission-reveal 1150ms cubic-bezier(0.4, 0, 0.2, 1) both",
      }}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 17, fontWeight: 700,
          letterSpacing: "0.35em", textTransform: "uppercase",
          color: "rgba(232,213,168,0.75)", marginBottom: 10,
        }}>
          Nova Missão
        </div>

        <div style={{
          fontFamily: '"Cinzel", serif', fontWeight: 900,
          fontSize: "clamp(40px, 7vw, 86px)", lineHeight: 1.05,
          color: "#f4d066",
          textShadow: "0 0 40px rgba(212,175,55,0.75), 0 0 90px rgba(212,175,55,0.4)",
        }}>
          {target.name}
        </div>
      </div>
    </>
  );
}

function MissionLabel({
  name, elementCount,
}: { name: string; elementCount: number; mode: ChallengeMode }) {
  return (
    <div style={{
      fontFamily: '"Cinzel", serif',
      fontSize: "clamp(20px, 2.4vw, 28px)",
      fontWeight: 900, color: "#f4d066", marginTop: 2,
      textShadow: "0 0 12px rgba(212,175,55,0.4)",
      animation: "mission-land 520ms ease-out 950ms",
    }}>
      {name}
      <span style={{
        fontSize: 17, fontWeight: 400,
        color: "rgba(232,213,168,0.6)", marginLeft: 10, letterSpacing: "0.06em",
      }}>
        ({elementCount} elementos)
      </span>
    </div>
  );
}

function WizardPanel({
  bubbleText, target, selectedCount, maxElements, wizardSize,
}: {
  bubbleText: string;
  target: Compound | null;
  selectedCount: number;
  maxElements: number | undefined;
  wizardSize: number;
}) {
  return (
    <aside style={{
      background: "linear-gradient(160deg, rgba(40,28,15,0.6), rgba(20,14,8,0.85))",
      border: "1px solid rgba(212,175,55,0.25)",
      borderRadius: 12, padding: 20,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16,
      textAlign: "center", overflow: "auto",
    }} className="scrollbar">
      <Wizard size={wizardSize} />

      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 17, fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "#d4af37", textShadow: "0 0 14px rgba(212,175,55,0.5)",
      }}>
        Mestre Alquimista
      </div>

      {target && <MissionCard target={target} />}

      <div
        key={bubbleText}
        style={{
          width: "100%",
          fontSize: 20, lineHeight: 1.5, color: "#f0e2bd",
          background: "linear-gradient(160deg, rgba(212,175,55,0.10), rgba(20,14,8,0.55))",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: 12, padding: "14px 16px",
          boxShadow: "inset 0 0 18px rgba(0,0,0,0.35)",
          animation: "fade-up 0.4s ease-out",
        }}
      >
        <BubbleText text={bubbleText} />
      </div>

      {maxElements !== undefined && (
        <ElementSlots filled={selectedCount} total={maxElements} />
      )}
    </aside>
  );
}

function MissionCard({ target }: { target: Compound }) {
  return (
    <div style={{
      width: "100%",
      background: "linear-gradient(160deg, rgba(212,175,55,0.16), rgba(20,14,8,0.6))",
      border: "1px solid rgba(212,175,55,0.5)",
      borderRadius: 12, padding: "14px 16px",
      boxShadow: "0 0 22px rgba(212,175,55,0.12)",
    }}>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 14, fontWeight: 700,
        letterSpacing: "0.28em", textTransform: "uppercase",
        color: "rgba(232,213,168,0.7)", marginBottom: 8,
      }}>
        Pedido do Mestre
      </div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontWeight: 900,
        fontSize: "clamp(22px, 1.7vw, 30px)", lineHeight: 1.1,
        color: "#f4d066", textShadow: "0 0 18px rgba(212,175,55,0.5)",
      }}>
        {target.name}
      </div>
      <div style={{
        marginTop: 10, fontSize: 17, color: "rgba(232,213,168,0.62)",
        letterSpacing: "0.04em",
      }}>
        {target.els.length} elementos
      </div>
    </div>
  );
}

function ElementSlots({ filled, total }: { filled: number; total: number }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 14, fontWeight: 700,
        letterSpacing: "0.24em", textTransform: "uppercase",
        color: "rgba(232,213,168,0.55)", marginBottom: 10,
      }}>
        No caldeirão
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} style={{
            width: 20, height: 20, borderRadius: "50%",
            border: `2px solid ${i < filled ? "#d4af37" : "rgba(212,175,55,0.28)"}`,
            background: i < filled ? "#d4af37" : "transparent",
            boxShadow: i < filled ? "0 0 12px rgba(212,175,55,0.7)" : "none",
            transition: "all 0.2s",
          }} />
        ))}
      </div>
    </div>
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
