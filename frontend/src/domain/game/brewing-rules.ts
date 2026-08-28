import type { Compound, Difficulty } from "../compounds/compound";
import { findCompoundBySymbols } from "../compounds/compound-catalog";
import type { ElementSymbol } from "../elements/element";
import {
  CONSOLATION_POINTS,
  POINTS_BY_CHALLENGE,
  POINTS_BY_DISCOVERY,
  type ChallengeMode,
} from "./game-mode";

export type BrewOutcome =
  | { kind: "challenge-hit";       compound: Compound; points: number }
  | { kind: "challenge-off";       compound: Compound; target: Compound; points: number }
  | { kind: "challenge-miss";      target: Compound;   points: 0 }
  | { kind: "discovery";           compound: Compound; points: number }
  | { kind: "free-potion";         points: number }
  | { kind: "free-fizzle";         points: 0 };


function magicPotionChance(numElements: number): number {
  return Math.max(0.10, 1 - (numElements - 1) * 0.18);
}


export function evaluateChallengeBrew(
  mode: ChallengeMode,
  syms: readonly ElementSymbol[],
  target: Compound,
): BrewOutcome {
  const made = findCompoundBySymbols(syms);

  if (made && made.formula === target.formula) {
    return { kind: "challenge-hit", compound: made, points: POINTS_BY_CHALLENGE[mode] };
  }
  if (made) {
    return {
      kind: "challenge-off", compound: made, target,
      points: CONSOLATION_POINTS,
    };
  }
  return { kind: "challenge-miss", target, points: 0 };
}


export function evaluateFreeBrew(syms: readonly ElementSymbol[]): BrewOutcome {
  const made = findCompoundBySymbols(syms);
  if (made) {
    const points = POINTS_BY_DISCOVERY[made.diff as Difficulty];
    return { kind: "discovery", compound: made, points };
  }

  if (Math.random() < magicPotionChance(syms.length)) {
    return { kind: "free-potion", points: syms.length * 30 };
  }
  return { kind: "free-fizzle", points: 0 };
}


export function shouldLoseLife(outcome: BrewOutcome): boolean {
  return outcome.kind === "challenge-off" || outcome.kind === "challenge-miss";
}