export type ChallengeMode  = "easy" | "medium" | "hard";
export type FreeMode       = "livre";
export type PlayableMode   = ChallengeMode | FreeMode;
export type SpecialMode    = "quiz" | "table" | "ranking";
export type GameMode       = PlayableMode | SpecialMode;

export type Screen = "home" | GameMode;

export interface ModeConfig {
  readonly title: string;
  readonly emoji: string;
  readonly desc: string;
  readonly accent: string;
}

export const MODE_CONFIG: Readonly<Record<GameMode, ModeConfig>> = {
  livre:    { title: "Modo Livre",         emoji: "✨", desc: "Misture livremente.",            accent: "#a78bfa" },
  easy:    { title: "Fácil",              emoji: "🌱", desc: "Compostos com 2 elementos.",     accent: "#10d96a" },
  medium:    { title: "Médio",              emoji: "⚔️", desc: "Compostos com 3 elementos.",     accent: "#fbbf24" },
  hard:  { title: "Difícil",            emoji: "💀", desc: "Compostos com 4 elementos.",     accent: "#ef4444" },
  quiz:     { title: "Quiz",               emoji: "📜", desc: "Teste seus conhecimentos.",      accent: "#60a5fa" },
  table:   { title: "Tabela Periódica",   emoji: "🧪", desc: "3 min para acertar o máximo.",   accent: "#f472b6" },
  ranking:  { title: "Hall da Fama",       emoji: "👑", desc: "Veja os melhores.",              accent: "#facc15" },
};


export const MAX_ELEMENTS_BY_CHALLENGE: Readonly<Record<ChallengeMode, number>> = {
  easy:   2,
  medium:   3,
  hard: 4,
};


export const POINTS_BY_CHALLENGE: Readonly<Record<ChallengeMode, number>> = {
  easy:   100,
  medium:   250,
  hard: 500,
};


export const POINTS_BY_DISCOVERY: Readonly<Record<ChallengeMode, number>> = {
  easy:    80,
  medium:   180,
  hard: 350,
};


export const CONSOLATION_POINTS = 40;


export const STARTING_LIVES = 3;