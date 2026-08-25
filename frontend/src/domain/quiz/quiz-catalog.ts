import type { ElementSymbol } from "../elements/element";

export interface QuizQuestion {
  readonly q: string;
  readonly options: readonly ElementSymbol[];
  readonly correct: number;        
  readonly explain: string;
}

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    q: "Qual elemento é o principal componente do AR que respiramos?",
    options: ["O", "N", "H", "C"], correct: 1,
    explain: "Surpresa! 78% do ar é nitrogênio (N). Oxigênio é só 21%.",
  },
  {
    q: "Qual elemento queima com chama branca brilhantíssima e é usado em FOGOS DE ARTIFÍCIO?",
    options: ["S", "Mg", "K", "Fe"], correct: 1,
    explain: "Magnésio (Mg) queima tão intenso que machuca os olhos se olhar direto!",
  },
  {
    q: "Qual elemento conduz eletricidade tão bem que está em todos os FIOS da sua casa?",
    options: ["Cu", "Fe", "H", "Mg"], correct: 0,
    explain: "Cobre (Cu)! Só perde para ouro e prata em condutividade — mas é bem mais barato.",
  },
  {
    q: "Qual elemento faz seu SANGUE ser vermelho?",
    options: ["Cu", "Fe", "Mg", "Ca"], correct: 1,
    explain: "Ferro (Fe). Ele liga ao oxigênio na hemoglobina e dá a cor vermelha.",
  },
  {
    q: "Qual elemento constrói os OSSOS do seu corpo?",
    options: ["Mg", "K", "Ca", "Na"], correct: 2,
    explain: "Cálcio (Ca)! Por isso leite e queijos são importantes na infância.",
  },
  {
    q: "Qual elemento cheira a OVO PODRE?",
    options: ["S", "Cl", "C", "N"], correct: 0,
    explain: "Enxofre (S). Compostos de enxofre são responsáveis por vários cheiros fortes.",
  },
  {
    q: "Qual elemento é o MAIS ABUNDANTE do universo?",
    options: ["O", "C", "H", "N"], correct: 2,
    explain: "Hidrogênio (H)! Compõe estrelas e é o tijolo básico do cosmos.",
  },
  {
    q: "BANANAS são ricas em qual elemento?",
    options: ["Mg", "K", "Na", "Ca"], correct: 1,
    explain: "Potássio (K)! Por isso atletas comem banana — ajuda os músculos.",
  },
];


export function pickRandomQuestions(n: number): readonly QuizQuestion[] {
  return [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, n);
}