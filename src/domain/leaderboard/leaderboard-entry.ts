import type { GameMode } from "../game/game-mode";

export interface LeaderboardEntry {
  readonly name: string;
  readonly score: number;
  readonly mode: GameMode;
  readonly ts: number;        
}