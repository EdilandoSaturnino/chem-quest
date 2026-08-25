import { useCallback, useState } from "react";
import type { ChemicalElement } from "../../domain/elements/element";
import { ELEMENTS } from "../../domain/elements/element-catalog";
import type { Compound } from "../../domain/compounds/compound";
import {
  type BrewOutcome,
  evaluateChallengeBrew,
  evaluateFreeBrew,
  shouldLoseLife,
} from "../../domain/game/brewing-rules";
import { randomFrom } from "../../domain/game/random";
import { compoundsByDifficulty } from "../../domain/compounds/compound-catalog";
import {
  MAX_ELEMENTS_BY_CHALLENGE, type ChallengeMode,
  type PlayableMode,
} from "../../domain/game/game-mode";

interface UsePlaySessionParams {
  mode: PlayableMode;
  onScoreGained: (delta: number) => void;
  onLifeLost: () => void;
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
}: UsePlaySessionParams): UsePlaySessionReturn {
  const isChallenge = mode !== "livre";
  const maxElements = isChallenge
    ? MAX_ELEMENTS_BY_CHALLENGE[mode as ChallengeMode]
    : undefined;

  const [target, setTarget] = useState<Compound | null>(() =>
    isChallenge ? pickTarget(mode as ChallengeMode) : null,
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [brewing, setBrewing] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<BrewOutcome | null>(null);
  const [attemptedToExceedLimit, setAttemptedToExceedLimit] = useState(false);

  const selectedElements = selectedIndices.map(i => ELEMENTS[i]!);

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
    await new Promise(resolve => setTimeout(resolve, 1400));

    const syms = selectedIndices.map(i => ELEMENTS[i]!.sym);
    const outcome: BrewOutcome = isChallenge && target
      ? evaluateChallengeBrew(mode as ChallengeMode, syms, target)
      : evaluateFreeBrew(syms);

    if (outcome.points > 0) onScoreGained(outcome.points);
    if (shouldLoseLife(outcome)) onLifeLost();

    setLastOutcome(outcome);
    setBrewing(false);
  }, [selectedIndices, brewing, isChallenge, target, mode, onScoreGained, onLifeLost]);

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