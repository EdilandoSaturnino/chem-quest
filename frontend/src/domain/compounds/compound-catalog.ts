import type { Compound, Difficulty } from "./compound";
import type { ElementSymbol } from "../elements/element";

export const COMPOUNDS: readonly Compound[] = [

  {
    name: "Sal de Cozinha", formula: "NaCl", els: ["Na", "Cl"], diff: "easy",
    hints: [
      "Está na sua mesa todo dia.",
      "Combina um metal explosivo com um gás tóxico.",
      "Vem do mar ou de minas de pedra.",
    ],
    fact: "Era tão valioso que pagava soldados — a palavra 'salário' vem dele!",
  },
  {
    name: "Água", formula: "H₂O", els: ["H", "O"], diff: "easy",
    hints: [
      "O líquido da vida.",
      "60% do seu corpo é feito dela.",
      "O elemento mais abundante + o que respiramos.",
    ],
    fact: "A molécula da vida. Sem ela, nenhum ser vivo conhecido existiria.",
  },
  {
    name: "Cal Viva", formula: "CaO", els: ["Ca", "O"], diff: "easy",
    hints: [
      "Usada na construção há milênios.",
      "Reage com água liberando muito calor.",
      "O elemento dos ossos + o que respiramos.",
    ],
    fact: "Usada em argamassa, tinta branca e até para preservar mumificações antigas.",
  },
  {
    name: "Sulfeto de Ferro", formula: "FeS", els: ["Fe", "S"], diff: "easy",
    hints: [
      "Conhecido como 'ouro de tolo'.",
      "Pode confundir garimpeiros.",
      "O metal do sangue + o que cheira a ovo podre.",
    ],
    fact: "Forma a 'pirita' — o famoso 'ouro de tolo' que enganou muitos garimpeiros.",
  },
  {
    name: "Óxido de Cobre", formula: "CuO", els: ["Cu", "O"], diff: "easy",
    hints: [
      "Aquela camada esverdeada nas estátuas antigas.",
      "Acontece quando o metal envelhece no ar.",
      "O metal dos fios + o que respiramos.",
    ],
    fact: "Por isso a Estátua da Liberdade é verde — é cobre oxidado pelo ar marinho!",
  },
  {
    name: "Cloreto de Potássio", formula: "KCl", els: ["K", "Cl"], diff: "easy",
    hints: [
      "Sal alternativo, sem sódio.",
      "Para dietas com pressão alta.",
      "O da banana + o da piscina.",
    ],
    fact: "Substituto do sal para quem precisa reduzir sódio na alimentação.",
  },


  {
    name: "Soda Cáustica", formula: "NaOH", els: ["Na", "O", "H"], diff: "medium",
    hints: [
      "Limpa entupimentos.",
      "Cuidado: corrói pele em segundos.",
      "Sódio + água, basicamente.",
    ],
    fact: "Limpa entupimentos e fabrica sabão. Usada desde a antiguidade!",
  },
  {
    name: "Calcário", formula: "CaCO₃", els: ["Ca", "C", "O"], diff: "medium",
    hints: [
      "A pedra das montanhas.",
      "Cascas de ovo são feitas dele.",
      "Reage com vinagre fazendo bolhas.",
    ],
    fact: "A pedra das montanhas, conchas e cascas de ovo. Forma estalactites em cavernas!",
  },
  {
    name: "Sulfato de Cobre", formula: "CuSO₄", els: ["Cu", "S", "O"], diff: "medium",
    hints: [
      "Cristais azuis lindíssimos.",
      "Usado em piscinas contra algas.",
      "Junta cobre, enxofre e oxigênio.",
    ],
    fact: "Cristais azul-celeste! Usado em piscinas para evitar algas.",
  },
  {
    name: "Ácido Sulfúrico", formula: "H₂SO₄", els: ["H", "S", "O"], diff: "medium",
    hints: [
      "O ácido mais produzido do mundo.",
      "Está nas baterias do seu carro.",
      "Hidrogênio + enxofre + oxigênio.",
    ],
    fact: "O ácido mais produzido do mundo. Está nas baterias do seu carro!",
  },
  {
    name: "Salitre", formula: "KNO₃", els: ["K", "N", "O"], diff: "medium",
    hints: [
      "Componente da pólvora!",
      "Também é fertilizante.",
      "Conserva carnes (presunto, salame).",
    ],
    fact: "Componente da pólvora! Mudou o curso de guerras desde a Idade Média.",
  },
  {
    name: "Cal Hidratada", formula: "Ca(OH)₂", els: ["Ca", "O", "H"], diff: "medium",
    hints: [
      "A 'cal' da tinta de parede.",
      "Neutraliza solo ácido em plantações.",
      "O dos ossos + água.",
    ],
    fact: "A 'cal' da tinta de parede. Pinta muros há séculos!",
  },


  {
    name: "Bicarbonato", formula: "NaHCO₃", els: ["Na", "H", "C", "O"], diff: "hard",
    hints: [
      "Faz o bolo crescer no forno.",
      "Neutraliza azia no estômago.",
      "Sódio + hidrogênio + carbono + oxigênio.",
    ],
    fact: "Faz o bolo crescer, neutraliza azia e até apaga incêndios pequenos!",
  },
  {
    name: "Ureia", formula: "CO(NH₂)₂", els: ["C", "O", "N", "H"], diff: "hard",
    hints: [
      "Você produz ela sem perceber.",
      "Está no xixi de todo mundo.",
      "Carbono, oxigênio, nitrogênio e hidrogênio.",
    ],
    fact: "Você produz no seu xixi! Também é fertilizante e ingrediente de cremes.",
  },
  {
    name: "Gesso", formula: "CaSO₄·2H₂O", els: ["Ca", "S", "O", "H"], diff: "hard",
    hints: [
      "Imobiliza ossos quebrados.",
      "Faz o teto da sua casa.",
      "Cálcio + enxofre + oxigênio + hidrogênio.",
    ],
    fact: "Imobiliza ossos quebrados e faz o teto da sua casa.",
  },
  {
    name: "Acetato de Cobre", formula: "Cu(CH₃COO)₂", els: ["Cu", "C", "O", "H"], diff: "hard",
    hints: [
      "Pigmento verde-azulado antigo.",
      "Usado para conservar madeira.",
      "Cobre + carbono + oxigênio + hidrogênio.",
    ],
    fact: "Pigmento verde-azulado usado por artistas e na conservação de madeira.",
  },
];


function symbolsKey(syms: readonly ElementSymbol[]): string {
  return [...syms].sort().join("|");
}


export function findCompoundBySymbols(syms: readonly ElementSymbol[]): Compound | null {
  const key = symbolsKey(syms);
  return COMPOUNDS.find(c => symbolsKey(c.els) === key) ?? null;
}


export function compoundsByDifficulty(diff: Difficulty): readonly Compound[] {
  return COMPOUNDS.filter(c => c.diff === diff);
}