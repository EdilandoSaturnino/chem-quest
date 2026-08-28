import type { ElementSymbol } from "../elements/element";

export interface QuizQuestion {
  readonly q: string;
  readonly options: readonly ElementSymbol[];
  readonly correct: number;
  readonly explain: string;
}

/**
 * A tela do quiz renderiza cada opção como SÍMBOLO gigante + nome do elemento,
 * então a resposta de toda pergunta precisa ser um dos 12 elementos do jogo
 * (H O C N Na Cl K Ca Mg Fe Cu S) e `options` precisa ter exatamente 4 deles.
 * `correct` é o índice da resposta certa dentro de `options`.
 */
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

  // ───────────────────────── corpo humano e saúde ─────────────────────────

  {
    q: "Qual elemento representa 65% da MASSA do seu corpo?",
    options: ["C", "H", "O", "N"], correct: 2,
    explain: "Oxigênio (O) — porque você é feito principalmente de água, e o oxigênio é a parte pesada dela.",
  },
  {
    q: "Qual elemento é o mais abundante em NÚMERO DE ÁTOMOS no corpo humano?",
    options: ["H", "O", "C", "N"], correct: 0,
    explain: "Hidrogênio (H)! São 2 átomos dele para cada 1 de oxigênio na água: vence na contagem, perde no peso.",
  },
  {
    q: "Qual elemento é o SEGUNDO em massa no corpo humano, atrás só do oxigênio?",
    options: ["H", "C", "N", "Ca"], correct: 1,
    explain: "Carbono (C), com cerca de 18% da sua massa. Você é literalmente uma criatura de carbono.",
  },
  {
    q: "A falta de qual elemento na alimentação causa ANEMIA?",
    options: ["Fe", "Ca", "Na", "C"], correct: 0,
    explain: "Ferro (Fe). Sem ele a hemoglobina não se forma e o sangue carrega menos oxigênio.",
  },
  {
    q: "Qual elemento em EXCESSO na comida aumenta a pressão arterial?",
    options: ["Na", "K", "Mg", "Ca"], correct: 0,
    explain: "Sódio (Na). Ele retém água no corpo e obriga o coração a bombear contra mais volume.",
  },
  {
    q: "Qual elemento é essencial tanto para a COAGULAÇÃO do sangue quanto para a contração muscular?",
    options: ["Fe", "Ca", "Cu", "S"], correct: 1,
    explain: "Cálcio (Ca). Além de construir ossos, ele dispara a contração de cada fibra muscular sua.",
  },
  {
    q: "Os antiácidos como o leite de magnésia combatem a AZIA usando qual elemento?",
    options: ["Na", "Cl", "K", "Mg"], correct: 3,
    explain: "Magnésio (Mg). O hidróxido de magnésio neutraliza o ácido clorídrico do estômago.",
  },
  {
    q: "Qual elemento dá o cheiro forte da CEBOLA e do alho?",
    options: ["N", "C", "S", "Cl"], correct: 2,
    explain: "Enxofre (S). É um composto sulfurado volátil que faz você chorar ao cortar cebola.",
  },
  {
    q: "O sangue do POLVO é azul por causa de qual elemento?",
    options: ["Cu", "Fe", "Mg", "K"], correct: 0,
    explain: "Cobre (Cu)! Polvos e lulas usam hemocianina, com cobre, no lugar da nossa hemoglobina com ferro.",
  },

  // ───────────────────────── natureza e planeta ─────────────────────────

  {
    q: "Qual elemento é o MAIS ABUNDANTE da crosta terrestre?",
    options: ["Fe", "Ca", "C", "O"], correct: 3,
    explain: "Oxigênio (O)! Quase metade das rochas é oxigênio preso dentro de minerais.",
  },
  {
    q: "Qual elemento deixa o solo de MARTE vermelho?",
    options: ["Cu", "S", "Fe", "C"], correct: 2,
    explain: "Ferro (Fe). O planeta inteiro está coberto de poeira enferrujada.",
  },
  {
    q: "Qual elemento a CLOROFILA guarda bem no centro da molécula?",
    options: ["Fe", "Cu", "Ca", "Mg"], correct: 3,
    explain: "Magnésio (Mg)! A estrutura é quase idêntica à da nossa hemoglobina, que usa ferro no mesmo lugar.",
  },
  {
    q: "Qual elemento as plantas RETIRAM DO AR para fazer fotossíntese?",
    options: ["C", "O", "N", "H"], correct: 0,
    explain: "Carbono (C), na forma de gás carbônico. A massa de uma árvore vem quase toda do ar, não do solo!",
  },
  {
    q: "Qual elemento as plantas DEVOLVEM para o ar na fotossíntese?",
    options: ["N", "H", "C", "O"], correct: 3,
    explain: "Oxigênio (O). Quase todo o oxigênio que você respira já passou por uma planta ou uma alga.",
  },
  {
    q: "Qual elemento os fertilizantes fornecem em MAIOR quantidade às plantas?",
    options: ["Fe", "Cl", "N", "Cu"], correct: 2,
    explain: "Nitrogênio (N). Ele é 78% do ar, mas as plantas não conseguem usá-lo direto da atmosfera.",
  },
  {
    q: "Qual elemento é o PRINCIPAL causador da chuva ácida?",
    options: ["N", "S", "C", "Cl"], correct: 1,
    explain: "Enxofre (S). Queimado, vira dióxido de enxofre, que reage com a água da chuva e forma ácido sulfúrico.",
  },
  {
    q: "Qual elemento forma 21% do ar e sem ele NENHUM fogo queima?",
    options: ["N", "C", "H", "O"], correct: 3,
    explain: "Oxigênio (O). Toda combustão precisa dele — por isso abafar as chamas apaga o fogo.",
  },
  {
    q: "Qual elemento alimenta a FUSÃO NUCLEAR dentro do Sol?",
    options: ["O", "C", "Fe", "H"], correct: 3,
    explain: "Hidrogênio (H). O Sol funde cerca de 600 milhões de toneladas dele por segundo.",
  },
  {
    q: "Qual elemento é o mais LEVE de toda a tabela periódica?",
    options: ["H", "C", "N", "O"], correct: 0,
    explain: "Hidrogênio (H). Um próton e um elétron — mais simples que isso, impossível.",
  },
  {
    q: "Qual elemento vira DIAMANTE sob pressão extrema?",
    options: ["S", "C", "Ca", "Fe"], correct: 1,
    explain: "Carbono (C). É o mesmo material do grafite do lápis — muda só o arranjo dos átomos.",
  },

  // ───────────────────────── indústria e cotidiano ─────────────────────────

  {
    q: "Qual elemento é a base do AÇO, o metal mais usado do planeta?",
    options: ["Cu", "Mg", "Fe", "Ca"], correct: 2,
    explain: "Ferro (Fe). Basta menos de 2% de carbono para transformá-lo em aço.",
  },
  {
    q: "Qual elemento é o metal estrutural mais LEVE, usado em ligas de aviões?",
    options: ["Fe", "Cu", "Mg", "Ca"], correct: 2,
    explain: "Magnésio (Mg). É cerca de um terço mais leve que o alumínio.",
  },
  {
    q: "Qual elemento trata a ÁGUA DA PISCINA?",
    options: ["O", "Cl", "S", "N"], correct: 1,
    explain: "Cloro (Cl). Ele destrói bactérias e algas — e o cheiro forte é sinal de sujeira reagindo, não de limpeza.",
  },
  {
    q: "Qual metal presente no sal de cozinha EXPLODE ao cair na água?",
    options: ["Fe", "Cu", "Na", "Mg"], correct: 2,
    explain: "Sódio (Na). Puro, ele pega fogo na água — mas ligado ao cloro vira o sal do seu almoço.",
  },
  {
    q: "O gás de cozinha é feito de hidrogênio e qual outro elemento?",
    options: ["O", "N", "C", "S"], correct: 2,
    explain: "Carbono (C). O metano é um átomo de carbono cercado por quatro de hidrogênio.",
  },
  {
    q: "O gás carbônico que apaga incêndios é oxigênio combinado com qual elemento?",
    options: ["S", "N", "C", "H"], correct: 2,
    explain: "Carbono (C). Por ser mais pesado que o ar, ele afunda e sufoca as chamas.",
  },
  {
    q: "Qual elemento INERTE enche o saquinho de salgadinho para ele não estragar?",
    options: ["O", "Cl", "H", "N"], correct: 3,
    explain: "Nitrogênio (N). O pacote estufado não tem ar: com oxigênio dentro, o salgadinho ficaria rançoso.",
  },
  {
    q: "Qual elemento dá a cor rosada ao PRESUNTO e conserva embutidos?",
    options: ["N", "S", "Cl", "K"], correct: 0,
    explain: "Nitrogênio (N), na forma de nitrito. Sem ele o presunto ficaria cinza como carne cozida.",
  },

  // ───────────────────────── teste de chama ─────────────────────────

  {
    q: "No teste de chama, qual elemento pinta o fogo de AMARELO intenso?",
    options: ["K", "Cu", "Ca", "Na"], correct: 3,
    explain: "Sódio (Na). É a mesma luz amarela dos antigos postes de iluminação pública.",
  },
  {
    q: "No teste de chama, qual elemento produz a cor VERDE-AZULADA?",
    options: ["Cu", "Fe", "Na", "Mg"], correct: 0,
    explain: "Cobre (Cu). É o segredo dos fogos de artifício azuis e das lareiras de chama colorida.",
  },
  {
    q: "No teste de chama, qual elemento produz a cor VIOLETA?",
    options: ["Ca", "K", "Na", "Cu"], correct: 1,
    explain: "Potássio (K). A cor é tão delicada que o amarelo do sódio a esconde com facilidade.",
  },

  // ───────────────────────── história e curiosidades ─────────────────────────

  {
    q: "Qual elemento, além do carvão e do salitre, compõe a PÓLVORA?",
    options: ["S", "Mg", "Fe", "Cl"], correct: 0,
    explain: "Enxofre (S). A receita chinesa do século IX é praticamente a mesma até hoje.",
  },
  {
    q: "Qual elemento os EGÍPCIOS usavam para mumificar seus mortos?",
    options: ["Na", "Ca", "S", "Cl"], correct: 0,
    explain: "Sódio (Na), no natrão — a mistura de sais que secava o corpo por completo.",
  },
  {
    q: "Qual elemento tem símbolo herdado do latim NATRIUM?",
    options: ["N", "Na", "K", "Mg"], correct: 1,
    explain: "Sódio (Na). O nome vem do natrão, o mesmo sal dos embalsamadores egípcios.",
  },
  {
    q: "Qual elemento tem símbolo herdado do latim KALIUM?",
    options: ["C", "Ca", "K", "Cu"], correct: 2,
    explain: "Potássio (K). Vem do árabe 'al-qalī', a cinza vegetal — a mesma raiz da palavra 'alcalino'.",
  },
  {
    q: "Qual elemento tem símbolo herdado de CUPRUM, o nome romano da ilha de Chipre?",
    options: ["Ca", "C", "Cl", "Cu"], correct: 3,
    explain: "Cobre (Cu). Chipre abrigava a maior mina do Império Romano.",
  },
  {
    q: "Na alquimia, qual metal era associado ao planeta VÊNUS e ao espelho?",
    options: ["Cu", "Fe", "Na", "Ca"], correct: 0,
    explain: "Cobre (Cu). Cada metal tinha seu planeta: o ferro era Marte, o cobre era Vênus.",
  },
  {
    q: "Qual elemento é a base de TODA a vida na Terra, do DNA ao diamante?",
    options: ["N", "S", "Ca", "C"], correct: 3,
    explain: "Carbono (C). Ele se liga a si mesmo em cadeias praticamente infinitas — nenhum outro elemento faz isso tão bem.",
  },
];


export function pickRandomQuestions(n: number): readonly QuizQuestion[] {
  // Fisher-Yates: `sort(() => Math.random() - 0.5)` é enviesado e, com um pool
  // grande, faz parte das perguntas quase nunca aparecer.
  const pool = [...QUIZ_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, n);
}
