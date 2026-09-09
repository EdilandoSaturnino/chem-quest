import { useCallback, useMemo, useState } from "react";
import type { ChemicalElement } from "../../domain/elements/element";
import { getSelectedElementsBottleColors } from "../../domain/elements/element-color";
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

const VIRTUAL_BREW_ANIMATION_MS = 1400;

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
    const bottleColors = getSelectedElementsBottleColors(brewElements);
    const outcome: BrewOutcome = isChallenge && target
      ? evaluateChallengeBrew(mode as ChallengeMode, syms, target)
      : evaluateFreeBrew(syms);

    try {
      if (mode === "livre") {
        await hardware.mix(bottleColors, isSuccessfulOutcome(outcome));
      } else {
        await new Promise(resolve => setTimeout(resolve, VIRTUAL_BREW_ANIMATION_MS));
      }
    } catch {
      setBrewing(false);
      return;
    }

    if (outcome.points > 0) onScoreGained(outcome.points);
    if (shouldLoseLife(outcome)) onLifeLost();

    setLastOutcome(outcome);
    setBrewing(false);
  }, [selectedIndices, brewing, hardware, isChallenge, target, mode, onScoreGained, onLifeLost]);

  const acknowledgeOutcomeAndAdvance = useCallback(() => {
    setLastOutcome(null);
    setSelectedIndices([]);
    if (isChallenge) {
      setTarget(curr => pickTarget(mode as ChallengeMode, curr));
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

function pickTarget(diff: ChallengeMode, previous?: Compound | null): Compound {
  const pool = compoundsByDifficulty(diff);
  if (!previous || pool.length < 2) return randomFrom(pool);
  // Evita repetir a mesma missao duas vezes seguidas.
  const others = pool.filter(c => c.name !== previous.name);
  return randomFrom(others.length > 0 ? others : pool);
}

function isSuccessfulOutcome(outcome: BrewOutcome): boolean {
  return outcome.kind !== "challenge-miss" && outcome.kind !== "free-fizzle";
}
