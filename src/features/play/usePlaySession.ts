import { useCallback, useMemo, useState } from "react";
import type { ChemicalElement } from "../../domain/elements/element";
import { getSelectedElementsLiquidHue, hueToRgb } from "../../domain/elements/element-color";
import { ELEMENTS } from "../../domain/elements/element-catalog";
import type { Compound } from "../../domain/compounds/compound";
import { compoundsByDifficulty } from "../../domain/compounds/compound-catalog";
import {
  type BrewOutcome,
  evaluateChallengeBrew,
  evaluateFreeBrew,
  shouldLoseLife,
} from "../../domain/game/brewing-rules";
import {
  MAX_ELEMENTS_BY_CHALLENGE,
  type ChallengeMode,
  type PlayableMode,
} from "../../domain/game/game-mode";
import { randomFrom } from "../../domain/game/random";
import type { ChemHardwareControls } from "../../hooks/useChemHardware";
import type { HardwareResultKind } from "../../infra/serial/chem-hardware-controller";

const BREW_ANIMATION_MS = 1400;

interface UsePlaySessionParams {
  mode: PlayableMode;
  onScoreGained: (delta: number) => void;
  onLifeLost: () => void;
  hardware: ChemHardwareControls;
}

interface UsePlaySessionReturn {
  target: Compound | null;
  selectedIndices: readonly number[];
  selectedElements: readonly ChemicalElement[];
  brewing: boolean;
  lastOutcome: BrewOutcome | null;
  attemptedToExceedLimit: boolean;          
  maxElements: number | undefined;

  toggleElement: (idx: number) => void;
  clearSelection: () => void;
  brew: () => Promise<void>;
  acknowledgeOutcomeAndAdvance: () => void;
}

export function usePlaySession({
  mode,
  onScoreGained,
  onLifeLost,
  hardware,
}: UsePlaySessionParams): UsePlaySessionReturn {
  const isChallenge = mode !== "livre";
  const maxElements = isChallenge
    ? MAX_ELEMENTS_BY_CHALLENGE[mode as ChallengeMode]
    : undefined;

  const [target, setTarget] = useState<Compound | null>(() =>
    isChallenge ? pickTarget(mode as ChallengeMode) : null,
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [brewing, setBrewing]               = useState(false);
  const [lastOutcome, setLastOutcome]       = useState<BrewOutcome | null>(null);
  const [attemptedToExceedLimit, setAttemptedToExceedLimit] = useState(false);

  const selectedElements = useMemo(
    () => selectedIndices.map(i => ELEMENTS[i]!),
    [selectedIndices],
  );

  const toggleElement = useCallback((idx: number) => {
    if (brewing) return;
    setLastOutcome(null);
    setAttemptedToExceedLimit(false);
    setSelectedIndices(curr => {
      if (curr.includes(idx)) return curr.filter(i => i !== idx);
      if (maxElements && curr.length >= maxElements) {
        setAttemptedToExceedLimit(true);
        return curr;
      }
      return [...curr, idx];
    });
  }, [brewing, maxElements]);

  const clearSelection = useCallback(() => {
    if (brewing) return;
    setSelectedIndices([]);
    setLastOutcome(null);
  }, [brewing]);

  const brew = useCallback(async () => {
    if (selectedIndices.length === 0 || brewing) return;
    setBrewing(true);

    const syms = selectedIndices.map(i => ELEMENTS[i]!.sym);
    const brewElements = selectedIndices.map(i => ELEMENTS[i]!);
    const brewColor = hueToRgb(getSelectedElementsLiquidHue(brewElements));

    void hardware.mix(brewColor, BREW_ANIMATION_MS);
    await new Promise(resolve => setTimeout(resolve, BREW_ANIMATION_MS));

    const outcome: BrewOutcome = isChallenge && target
      ? evaluateChallengeBrew(mode as ChallengeMode, syms, target)
      : evaluateFreeBrew(syms);

    if (outcome.points > 0) onScoreGained(outcome.points);
    if (shouldLoseLife(outcome)) onLifeLost();

    void hardware.result(hardwareResultKind(outcome), hardwareResultColor(outcome, brewColor));

    setLastOutcome(outcome);
    setBrewing(false);
  }, [selectedIndices, brewing, hardware, isChallenge, target, mode, onScoreGained, onLifeLost]);

  const acknowledgeOutcomeAndAdvance = useCallback(() => {
    setLastOutcome(null);
    setSelectedIndices([]);
    if (isChallenge) {
      setTarget(pickTarget(mode as ChallengeMode));
    }
  }, [isChallenge, mode]);

  return {
    target,
    selectedIndices,
    selectedElements,
    brewing,
    lastOutcome,
    attemptedToExceedLimit,
    maxElements,
    toggleElement,
    clearSelection,
    brew,
    acknowledgeOutcomeAndAdvance,
  };
}

function pickTarget(diff: ChallengeMode): Compound {
  return randomFrom(compoundsByDifficulty(diff));
}

function hardwareResultKind(outcome: BrewOutcome): HardwareResultKind {
  switch (outcome.kind) {
    case "challenge-hit":
    case "discovery":
    case "free-potion":
      return "success";
    case "challenge-off":
      return "partial";
    case "challenge-miss":
    case "free-fizzle":
      return "fail";
  }
}

function hardwareResultColor(outcome: BrewOutcome, brewColor: ReturnType<typeof hueToRgb>) {
  switch (outcome.kind) {
    case "challenge-miss":
    case "free-fizzle":
      return { r: 255, g: 25, b: 0 };
    default:
      return brewColor;
  }
}
