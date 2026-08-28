import type { ElementSymbol } from "../elements/element";

export type Difficulty = "easy" | "medium" | "hard";

export interface Compound {
  readonly name: string;
  readonly formula: string;
  readonly els: readonly ElementSymbol[];
  readonly diff: Difficulty;
  readonly hints: readonly string[];      
  readonly fact: string;                  
}