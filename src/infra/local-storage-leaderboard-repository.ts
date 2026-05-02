import type { LeaderboardEntry } from "../domain/leaderboard/leaderboard-entry";
import type { LeaderboardRepository } from "../domain/leaderboard/leaderboard-repository";

const STORAGE_KEY = "chemquest_leaderboard_v1";
const MAX_ENTRIES = 50;

export class LocalStorageLeaderboardRepository implements LeaderboardRepository {
  load(): readonly LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed as LeaderboardEntry[];
    } catch (e) {
      console.error("Failed to load leaderboard entries", e);
      return [];
    }
  }

  save(list: readonly LeaderboardEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save leaderboard entries", e);
    }
  }

  add(entry: Omit<LeaderboardEntry, "ts">): void {
    const list = [...this.load()];
    list.push({ ...entry, ts: Date.now() });
    list.sort((a, b) => b.score - a.score);
    this.save(list.slice(0, MAX_ENTRIES));
  }

  clear(): void {
    this.save([]);
  }
}

export const leaderboardRepository: LeaderboardRepository = new LocalStorageLeaderboardRepository();