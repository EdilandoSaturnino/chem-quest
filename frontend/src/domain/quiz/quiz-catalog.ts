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

  {
    q: "O BICARBONATO que faz o bolo crescer carrega qual metal?",
    options: ["K", "Ca", "Mg", "Na"], correct: 3,
    explain: "Sódio (Na). No forno ele solta gás carbônico e infla a massa por dentro.",
  },
  {
    q: "A SODA CÁUSTICA usada para fabricar sabão tem qual metal?",
    options: ["Ca", "Mg", "K", "Na"], correct: 3,
    explain: "Sódio (Na). Corrói a pele em segundos, mas com gordura vira sabão.",
  },
  {
    q: "Qual elemento dá a cor avermelhada às MOEDAS de 5 centavos?",
    options: ["Fe", "Mg", "Cu", "Ca"], correct: 2,
    explain: "Cobre (Cu). A moeda é de aço revestido por uma fina camada de cobre.",
  },
  {
    q: "O GIZ escolar é carbonato de qual elemento?",
    options: ["Mg", "Na", "K", "Ca"], correct: 3,
    explain: "Cálcio (Ca). O mesmo carbonato de cálcio das conchas e do mármore.",
  },
  {
    q: "O VINAGRE é feito de hidrogênio, oxigênio e qual outro elemento?",
    options: ["N", "S", "C", "Ca"], correct: 2,
    explain: "Carbono (C). O ácido acético é orgânico — e toda molécula orgânica tem carbono.",
  },
  {
    q: "Misturar água sanitária com amônia libera GÁS TÓXICO por causa de qual elemento?",
    options: ["Cl", "C", "Mg", "Fe"], correct: 0,
    explain: "Cloro (Cl). A mistura forma cloraminas — nunca junte produtos de limpeza.",
  },
  {
    q: "O AÇÚCAR é formado por hidrogênio, oxigênio e qual elemento?",
    options: ["N", "S", "C", "Ca"], correct: 2,
    explain: "Carbono (C). Por isso açúcar queimado deixa aquela crosta preta: sobra carbono.",
  },
  {
    q: "A cabeça do PALITO DE FÓSFORO acende graças a qual elemento amarelo?",
    options: ["S", "C", "Na", "Cl"], correct: 0,
    explain: "Enxofre (S). Ele pega fogo com pouquíssimo atrito e inicia a chama.",
  },
  {
    q: "Cozinhar em PANELA DE FERRO ajuda contra anemia porque libera qual elemento?",
    options: ["Ca", "Cu", "K", "Fe"], correct: 3,
    explain: "Ferro (Fe). Um pouco migra para a comida e ajuda a repor o estoque do corpo.",
  },
  {
    q: "O SAL LIGHT troca parte do sódio por qual outro metal?",
    options: ["Mg", "Ca", "K", "Fe"], correct: 2,
    explain: "Potássio (K). O cloreto de potássio salga sem elevar tanto a pressão.",
  },
  {
    q: "O que faz a ÁGUA COM GÁS borbulhar é um gás de qual elemento?",
    options: ["O", "N", "C", "H"], correct: 2,
    explain: "Carbono (C). É gás carbônico dissolvido sob pressão; ao abrir, ele escapa.",
  },
  {
    q: "A falta de qual elemento costuma causar CÃIBRA muscular?",
    options: ["Fe", "Cu", "Mg", "N"], correct: 2,
    explain: "Magnésio (Mg). Ele relaxa a fibra muscular; sem ele, o músculo trava.",
  },
  {
    q: "O SORO FISIOLÓGICO repõe principalmente qual elemento?",
    options: ["K", "Ca", "Na", "Mg"], correct: 2,
    explain: "Sódio (Na). É cloreto de sódio na mesma concentração do seu sangue.",
  },
  {
    q: "O ácido que digere a comida no seu ESTÔMAGO é feito com qual elemento?",
    options: ["S", "Cl", "N", "C"], correct: 1,
    explain: "Cloro (Cl). Ácido clorídrico, forte o bastante para dissolver metal.",
  },
  {
    q: "Qual elemento trabalha com o sódio para transmitir sinais nos NEURÔNIOS?",
    options: ["K", "Fe", "Cu", "Ca"], correct: 0,
    explain: "Potássio (K). A dupla sódio-potássio gera o impulso elétrico dos nervos.",
  },
  {
    q: "O cheiro de CABELO QUEIMADO vem de qual elemento da queratina?",
    options: ["N", "S", "C", "Cl"], correct: 1,
    explain: "Enxofre (S). São as pontes de enxofre que deixam o cabelo liso ou cacheado.",
  },
  {
    q: "Qual elemento está em TODA proteína e por isso é indispensável na dieta?",
    options: ["N", "Fe", "Ca", "Mg"], correct: 0,
    explain: "Nitrogênio (N). É ele que diferencia proteína de gordura e carboidrato.",
  },
  {
    q: "Em excesso no sangue, qual elemento pode PARAR o coração?",
    options: ["Na", "Mg", "K", "Ca"], correct: 2,
    explain: "Potássio (K). Em dose alta ele interrompe o batimento cardíaco.",
  },
  {
    q: "A hemoglobina pega qual elemento no pulmão e entrega às células?",
    options: ["C", "N", "O", "H"], correct: 2,
    explain: "Oxigênio (O). Na volta, ela carrega gás carbônico para ser expirado.",
  },
  {
    q: "Qual foi o PRIMEIRO metal que a humanidade aprendeu a fundir?",
    options: ["Fe", "Mg", "Ca", "Cu"], correct: 3,
    explain: "Cobre (Cu). A Idade do Cobre veio antes do Bronze e muito antes do Ferro.",
  },
  {
    q: "O CARVÃO que moveu as locomotivas a vapor é quase todo qual elemento?",
    options: ["C", "S", "Fe", "H"], correct: 0,
    explain: "Carbono (C). A Revolução Industrial inteira rodou queimando carbono.",
  },
  {
    q: "Qual elemento VULCANIZA a borracha e permitiu inventar o pneu?",
    options: ["C", "N", "S", "Cl"], correct: 2,
    explain: "Enxofre (S). Sem ele a borracha derrete no calor e racha no frio.",
  },
  {
    q: "PNEUS DE AVIÃO são inflados com qual gás para não pegar fogo no pouso?",
    options: ["O", "N", "H", "C"], correct: 1,
    explain: "Nitrogênio (N). Ele não alimenta chama e quase não varia com a temperatura.",
  },
  {
    q: "Qual gás inflava o dirigível HINDENBURG e causou o desastre de 1937?",
    options: ["H", "N", "O", "C"], correct: 0,
    explain: "Hidrogênio (H). Barato e leve — e absurdamente inflamável.",
  },
  {
    q: "Qual elemento é a matéria-prima do ÁCIDO mais produzido do mundo?",
    options: ["S", "N", "Cl", "C"], correct: 0,
    explain: "Enxofre (S). O consumo de ácido sulfúrico chega a medir a economia de um país.",
  },
  {
    q: "A fabricação de CIMENTO despeja no ar enormes quantidades de gás com qual elemento?",
    options: ["N", "S", "C", "O"], correct: 2,
    explain: "Carbono (C). Sozinho, o cimento responde por cerca de 8% do CO₂ do planeta.",
  },
  {
    q: "A ESTÁTUA DA LIBERDADE ficou verde porque é revestida de qual metal?",
    options: ["Fe", "Mg", "Ca", "Cu"], correct: 3,
    explain: "Cobre (Cu). O ar marinho o oxidou e criou a pátina verde característica.",
  },
  {
    q: "Qual metal é o MAIS RECICLADO do mundo, presente em latas, carros e prédios?",
    options: ["Cu", "Mg", "Na", "Fe"], correct: 3,
    explain: "Ferro (Fe). Como aço, é reciclado mais que todos os outros materiais somados.",
  },
  {
    q: "A atmosfera escaldante de VÊNUS é quase toda gás de qual elemento?",
    options: ["N", "O", "C", "S"], correct: 2,
    explain: "Carbono (C). O efeito estufa do CO₂ mantém a superfície acima de 460 °C.",
  },
  {
    q: "As nuvens de VÊNUS são feitas de ácido de qual elemento?",
    options: ["Cl", "N", "C", "S"], correct: 3,
    explain: "Enxofre (S). Chove ácido sulfúrico lá — mas evapora antes de tocar o chão.",
  },
  {
    q: "Além do sódio, qual elemento deixa a água do MAR salgada?",
    options: ["Cl", "S", "Ca", "K"], correct: 0,
    explain: "Cloro (Cl). Sódio + cloro = o sal de cozinha dissolvido no oceano inteiro.",
  },
  {
    q: "Os CORAIS constroem seu esqueleto retirando qual elemento da água?",
    options: ["Mg", "Fe", "Na", "Ca"], correct: 3,
    explain: "Cálcio (Ca). Recifes inteiros são carbonato de cálcio erguido por bichinhos.",
  },
  {
    q: "Bactérias 'fixadoras' capturam qual elemento do ar e entregam às plantas?",
    options: ["C", "O", "N", "S"], correct: 2,
    explain: "Nitrogênio (N). Sem elas, a planta não consegue usar os 78% de N do ar.",
  },
  {
    q: "As ESTALACTITES das cavernas são feitas de carbonato de qual elemento?",
    options: ["Mg", "Na", "Fe", "Ca"], correct: 3,
    explain: "Cálcio (Ca). Uma gota por vez, levam milhares de anos para se formar.",
  },
  {
    q: "O cheiro característico de VULCÃO e fonte termal vem de qual elemento?",
    options: ["Cl", "N", "C", "S"], correct: 3,
    explain: "Enxofre (S). São os gases sulfurosos que dão aquele odor inconfundível.",
  },
  {
    q: "Qual elemento compõe a maior parte da massa de JÚPITER?",
    options: ["H", "O", "C", "N"], correct: 0,
    explain: "Hidrogênio (H). Júpiter é quase uma estrela que não conseguiu acender.",
  },
  {
    q: "Os METEORITOS metálicos que caem na Terra são feitos sobretudo de qual elemento?",
    options: ["Cu", "Mg", "Ca", "Fe"], correct: 3,
    explain: "Ferro (Fe). Povos antigos forjaram lâminas com ferro vindo do espaço.",
  },
  {
    q: "Depois do hidrogênio, qual elemento é o mais abundante nos OCEANOS?",
    options: ["Cl", "O", "Na", "S"], correct: 1,
    explain: "Oxigênio (O). Cada molécula de água tem um átomo dele — e o mar é quase só água.",
  },
  {
    q: "Qual elemento forma a maior parte do NÚCLEO da Terra?",
    options: ["Fe", "Mg", "Ca", "Cu"], correct: 0,
    explain: "Ferro (Fe). É esse ferro girando que cria o campo magnético do planeta.",
  },
  {
    q: "A chama do fogão fica AZUL quando qual elemento queima completamente?",
    options: ["C", "S", "N", "H"], correct: 0,
    explain: "Carbono (C). Chama amarela é sinal de queima incompleta e fuligem.",
  },
  {
    q: "Qual metal é tão reativo que NUNCA aparece puro na natureza?",
    options: ["Cu", "Fe", "C", "Na"], correct: 3,
    explain: "Sódio (Na). Só existe combinado — em sal, em rocha, na água do mar.",
  },
  {
    q: "Alimentos são congelados a -196 °C usando qual elemento líquido?",
    options: ["O", "N", "C", "H"], correct: 1,
    explain: "Nitrogênio (N). Líquido e barato, congela um morango em poucos segundos.",
  },
  {
    q: "Qual elemento tem símbolo herdado do latim FERRUM?",
    options: ["Fe", "Cu", "Na", "K"], correct: 0,
    explain: "Ferro (Fe). Os romanos já o extraíam praticamente em escala industrial.",
  },
  {
    q: "Qual elemento ocupa a posição de NÚMERO 1 na tabela periódica?",
    options: ["O", "H", "C", "N"], correct: 1,
    explain: "Hidrogênio (H). Um próton, um elétron — o átomo mais simples que existe.",
  },
  {
    q: "Entre os 12 elementos do seu laboratório, qual tem o MAIOR número atômico?",
    options: ["Fe", "Ca", "K", "Cu"], correct: 3,
    explain: "Cobre (Cu), número 29. Ferro é 26, cálcio 20 e potássio 19.",
  },
  {
    q: "A PÓLVORA usa carvão, enxofre e um sal de qual metal?",
    options: ["Na", "Ca", "Mg", "K"], correct: 3,
    explain: "Potássio (K). O salitre é nitrato de potássio, o oxidante da mistura.",
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
