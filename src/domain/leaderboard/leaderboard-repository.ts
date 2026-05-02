import type { LeaderboardEntry } from "./leaderboard-entry";

export interface LeaderboardRepository {
  load(): readonly LeaderboardEntry[];
  save(list: readonly LeaderboardEntry[]): void;
  add(entry: Omit<LeaderboardEntry, "ts">): void;
  clear(): void;
}