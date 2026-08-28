import type { Compound, Difficulty } from "./compound";
import type { ElementSymbol } from "../elements/element";

/**
 * ATENÇÃO ao adicionar compostos:
 * `findCompoundBySymbols` casa pelo CONJUNTO de elementos ordenado, então dois
 * compostos com o mesmo conjunto colidem e um deles fica inalcançável no jogo.
 * Ex.: H₂O e H₂O₂ são ambos {H, O} — só um dos dois pode existir no catálogo.
 *
 * Além disso:
 * - só existem 12 elementos no jogo: H O C N Na Cl K Ca Mg Fe Cu S;
 * - `els` precisa ter exatamente 2 (easy), 3 (medium) ou 4 (hard) elementos
 *   distintos, para bater com MAX_ELEMENTS_BY_CHALLENGE.
 */
export const COMPOUNDS: readonly Compound[] = [

  // ─────────────────────────── FÁCIL (2 elementos) ───────────────────────────

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
    name: "Pirita", formula: "FeS₂", els: ["Fe", "S"], diff: "easy",
    hints: [
      "Conhecida como 'ouro de tolo'.",
      "Brilha dourada em cubos perfeitos e engana garimpeiro.",
      "O metal do sangue + o que cheira a ovo podre.",
    ],
    fact: "Cresce em cubos tão perfeitos que parecem lapidados à mão — mas não valem quase nada.",
  },
  {
    name: "Óxido de Cobre", formula: "CuO", els: ["Cu", "O"], diff: "easy",
    hints: [
      "Aparece quando você aquece um fio de cobre no fogo.",
      "É um pó preto, apesar de vir de um metal alaranjado.",
      "O metal dos fios + o que respiramos.",
    ],
    fact: "Cuidado com o mito: o verde da Estátua da Liberdade NÃO é ele, e sim outro composto de cobre com carbono e enxofre.",
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
    name: "Gás Carbônico", formula: "CO₂", els: ["C", "O"], diff: "easy",
    hints: [
      "Você o expira a cada respiração.",
      "É ele que faz o refrigerante borbulhar.",
      "O do carvão + o que respiramos.",
    ],
    fact: "As plantas o transformam em açúcar usando luz do sol — é assim que toda a comida do planeta começa.",
  },
  {
    name: "Metano", formula: "CH₄", els: ["C", "H"], diff: "easy",
    hints: [
      "É o gás do fogão de muitas casas.",
      "Vacas produzem toneladas dele arrotando.",
      "O do carvão + o elemento mais leve.",
    ],
    fact: "Uma única vaca solta cerca de 100 kg dele por ano — por isso o gado pesa no aquecimento global.",
  },
  {
    name: "Amônia", formula: "NH₃", els: ["N", "H"], diff: "easy",
    hints: [
      "Aquele cheiro forte de produto de limpeza.",
      "Também aparece em caixa de areia de gato.",
      "O gás do ar + o mais leve de todos.",
    ],
    fact: "Fabricá-la em escala industrial permitiu alimentar bilhões de pessoas — metade do nitrogênio do seu corpo passou por essa reação.",
  },
  {
    name: "Gás Sulfídrico", formula: "H₂S", els: ["H", "S"], diff: "easy",
    hints: [
      "O cheiro que denuncia um ovo estragado.",
      "Sai de vulcões e de pântanos.",
      "O mais leve + o que fede.",
    ],
    fact: "Em concentração alta ele paralisa o olfato — a pessoa para de sentir o cheiro justo quando fica perigoso.",
  },
  {
    name: "Óxido de Magnésio", formula: "MgO", els: ["Mg", "O"], diff: "easy",
    hints: [
      "A cinza branquinha que sobra de uma luz ofuscante.",
      "Reveste fornos que passam de mil graus.",
      "O dos fogos de artifício + o que respiramos.",
    ],
    fact: "Só derrete acima de 2800 °C — por isso forra o interior de fornos de siderúrgica.",
  },
  {
    name: "Ferrugem", formula: "Fe₂O₃", els: ["Fe", "O"], diff: "easy",
    hints: [
      "A praga alaranjada dos portões velhos.",
      "É ela que pinta um planeta inteiro de vermelho.",
      "O metal do sangue + o que respiramos.",
    ],
    fact: "Marte é vermelho porque seu solo está literalmente enferrujado.",
  },
  {
    name: "Ácido Clorídrico", formula: "HCl", els: ["H", "Cl"], diff: "easy",
    hints: [
      "Seu estômago fabrica isso todo dia.",
      "Vendido em loja de construção como ácido muriático.",
      "O mais leve + o da piscina.",
    ],
    fact: "Seu estômago é ácido o bastante para atacar metal — e refaz o próprio revestimento a cada poucos dias para não se digerir.",
  },
  {
    name: "Dióxido de Enxofre", formula: "SO₂", els: ["S", "O"], diff: "easy",
    hints: [
      "Sai das chaminés e das crateras de vulcões.",
      "Principal culpado da chuva ácida.",
      "O que fede + o que respiramos.",
    ],
    fact: "Em doses minúsculas conserva vinho e frutas secas há séculos.",
  },
  {
    name: "Gás Hilariante", formula: "N₂O", els: ["N", "O"], diff: "easy",
    hints: [
      "Já foi usado por dentistas para acalmar pacientes.",
      "É também o gás da lata de chantilly.",
      "O gás do ar + o que respiramos.",
    ],
    fact: "Descoberto em 1772, virou atração de festas da alta sociedade décadas antes de alguém pensar em usá-lo na medicina.",
  },
  {
    name: "Cloreto de Cálcio", formula: "CaCl₂", els: ["Ca", "Cl"], diff: "easy",
    hints: [
      "Espalhado nas ruas para derreter neve.",
      "É o saquinho que suga a umidade do armário.",
      "O dos ossos + o da piscina.",
    ],
    fact: "Derrete gelo até -50 °C e ainda esquenta ao dissolver — o mesmo truque das bolsas térmicas.",
  },
  {
    name: "Cloreto de Magnésio", formula: "MgCl₂", els: ["Mg", "Cl"], diff: "easy",
    hints: [
      "Depois do sal comum, é o que mais existe no mar.",
      "É ele que coalha a soja e vira tofu.",
      "O dos fogos de artifício + o da piscina.",
    ],
    fact: "Chamado de nigari no Japão, transforma leite de soja em tofu em poucos minutos.",
  },
  {
    name: "Cloreto de Ferro III", formula: "FeCl₃", els: ["Fe", "Cl"], diff: "easy",
    hints: [
      "Na eletrônica é chamado de percloreto.",
      "Devora cobre e desenha circuitos em placas.",
      "O metal do sangue + o da piscina.",
    ],
    fact: "É com ele que se fabricam placas de circuito caseiras — ele come o cobre e deixa só as trilhas.",
  },
  {
    name: "Carbureto", formula: "CaC₂", els: ["Ca", "C"], diff: "easy",
    hints: [
      "Molhado, solta um gás que pega fogo.",
      "Iluminava capacetes de mineradores e lamparinas antigas.",
      "O dos ossos + o do carvão.",
    ],
    fact: "Antes das lanternas a pilha, mineiros carregavam pedras dele e pingavam água para ter luz.",
  },
  {
    name: "Cementita", formula: "Fe₃C", els: ["Fe", "C"], diff: "easy",
    hints: [
      "É o que separa ferro comum de uma espada de verdade.",
      "Uns poucos átomos de carbono deixam o metal muito mais duro.",
      "O metal do sangue + o do carvão.",
    ],
    fact: "A diferença entre ferro mole e aço é menos de 2% de carbono — uma pitada muda um império.",
  },
  {
    name: "Cloreto de Cobre", formula: "CuCl₂", els: ["Cu", "Cl"], diff: "easy",
    hints: [
      "Cristais esverdeados que somem na água.",
      "Jogado no fogo, pinta a chama de azul-esverdeado.",
      "O metal dos fios + o da piscina.",
    ],
    fact: "É ele que dá o azul-turquesa dos fogos de artifício e das lareiras de chama colorida.",
  },
  {
    name: "Covelita", formula: "CuS", els: ["Cu", "S"], diff: "easy",
    hints: [
      "Um mineral azul-índigo quase preto.",
      "Dele se extrai o metal dos fios elétricos.",
      "O metal dos fios + o que cheira a ovo podre.",
    ],
    fact: "Minérios como este são a origem de praticamente todo o cobre dos seus eletrônicos.",
  },

  // ─────────────────────────── MÉDIO (3 elementos) ───────────────────────────

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
      "Pó esbranquiçado que fica azul só de sentir umidade.",
      "Usado em piscinas para evitar algas.",
      "Junta cobre, enxofre e oxigênio.",
    ],
    fact: "Seco ele é quase branco; basta uma gota d'água para o azul aparecer — é assim que se detecta umidade escondida.",
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
    name: "Água Sanitária", formula: "NaClO", els: ["Na", "Cl", "O"], diff: "medium",
    hints: [
      "O cheiro de um banheiro recém-limpo.",
      "Tira mancha de roupa branca — e mata a colorida.",
      "Sódio + o da piscina + o que respiramos.",
    ],
    fact: "Derrubou as mortes por infecção em hospitais no século XIX, muito antes de existirem antibióticos.",
  },
  {
    name: "Cloro de Piscina", formula: "Ca(ClO)₂", els: ["Ca", "Cl", "O"], diff: "medium",
    hints: [
      "Vem em pastilha ou em pó branco.",
      "Mantém a água azul e sem algas.",
      "O dos ossos + o da piscina + o que respiramos.",
    ],
    fact: "Uma pastilha trata milhares de litros — e aquele 'cheiro de cloro' forte é sinal de água suja, não limpa.",
  },
  {
    name: "Sulfato de Magnésio", formula: "MgSO₄", els: ["Mg", "S", "O"], diff: "medium",
    hints: [
      "Pó branco vendido em farmácia.",
      "Jardineiros o usam para deixar as folhas mais verdes.",
      "O dos fogos + o que fede + o que respiramos.",
    ],
    fact: "Funciona como adubo porque o magnésio é justamente o átomo no centro da clorofila.",
  },
  {
    name: "Leite de Magnésia", formula: "Mg(OH)₂", els: ["Mg", "O", "H"], diff: "medium",
    hints: [
      "Aquele líquido branco e leitoso do armário de remédios.",
      "Combate azia e queimação.",
      "O dos fogos de artifício + água.",
    ],
    fact: "Também funciona como desodorante natural — neutraliza o ácido que as bactérias produzem na pele.",
  },
  {
    name: "Barrilha", formula: "Na₂CO₃", els: ["Na", "C", "O"], diff: "medium",
    hints: [
      "Sem ela não existiria vidro moderno.",
      "Amacia a água e reforça o sabão em pó.",
      "Sódio + o do carvão + o que respiramos.",
    ],
    fact: "Os egípcios a colhiam de lagos secos e usavam para mumificar — e para fazer o primeiro vidro da história.",
  },
  {
    name: "Glicose", formula: "C₆H₁₂O₆", els: ["C", "H", "O"], diff: "medium",
    hints: [
      "É o combustível que seu cérebro está queimando agora.",
      "As plantas a fabricam com luz do sol.",
      "Carbono + hidrogênio + oxigênio.",
    ],
    fact: "Seu cérebro é 2% do seu peso mas consome cerca de 20% dela — pensar dá fome de verdade.",
  },
  {
    name: "Ácido Nítrico", formula: "HNO₃", els: ["H", "N", "O"], diff: "medium",
    hints: [
      "Os alquimistas o chamavam de 'água-forte'.",
      "Dissolve prata e cobre, mas não encosta no ouro.",
      "Hidrogênio + o gás do ar + o que respiramos.",
    ],
    fact: "Alquimistas separavam ouro de prata com ele. Só misturado ao ácido clorídrico o ouro finalmente cede.",
  },
  {
    name: "Potassa Cáustica", formula: "KOH", els: ["K", "O", "H"], diff: "medium",
    hints: [
      "Prima mais forte da soda cáustica.",
      "Faz sabão líquido e move as pilhas do controle remoto.",
      "O da banana + água.",
    ],
    fact: "É o que está dentro das pilhas 'alcalinas' — o nome da pilha vem justamente dela.",
  },
  {
    name: "Sulfato de Sódio", formula: "Na₂SO₄", els: ["Na", "S", "O"], diff: "medium",
    hints: [
      "Boa parte da caixa do seu sabão em pó é ele.",
      "Serve de enchimento barato em detergentes.",
      "Sódio + o que fede + o que respiramos.",
    ],
    fact: "É um dos produtos químicos mais fabricados do mundo — e muito dele só serve para dar volume à embalagem de sabão.",
  },
  {
    name: "Sulfato Ferroso", formula: "FeSO₄", els: ["Fe", "S", "O"], diff: "medium",
    hints: [
      "Receitado para quem está com anemia.",
      "Cristais de um verde bem claro.",
      "O metal do sangue + o que fede + o que respiramos.",
    ],
    fact: "É a base da tinta ferrogálica, com que foram escritos manuscritos que sobrevivem há mais de mil anos.",
  },
  {
    name: "Anidrita", formula: "CaSO₄", els: ["Ca", "S", "O"], diff: "medium",
    hints: [
      "É o gesso antes de encontrar água.",
      "Rocha branca de desertos e minas de sal.",
      "O dos ossos + o que fede + o que respiramos.",
    ],
    fact: "Basta absorver água para virar gesso e inchar — o que já rachou túneis inteiros por dentro.",
  },
  {
    name: "Sulfato de Potássio", formula: "K₂SO₄", els: ["K", "S", "O"], diff: "medium",
    hints: [
      "Fertilizante para lavouras que não toleram cloro.",
      "Deixa frutas mais doces e firmes.",
      "O da banana + o que fede + o que respiramos.",
    ],
    fact: "Foi descrito já no século XIV, muito antes de a palavra 'química' existir.",
  },
  {
    name: "Potassa", formula: "K₂CO₃", els: ["K", "C", "O"], diff: "medium",
    hints: [
      "Extraída das cinzas da lareira.",
      "Fazia sabão e vidro antes de existir indústria.",
      "O da banana + o do carvão + o que respiramos.",
    ],
    fact: "O nome 'potássio' nasceu aqui: cinza fervida em POTES virava 'pot-ash'.",
  },
  {
    name: "Magnesita", formula: "MgCO₃", els: ["Mg", "C", "O"], diff: "medium",
    hints: [
      "O pó branco na mão de escaladores e ginastas.",
      "Também vira tijolo de forno que aguenta calor escaldante.",
      "O dos fogos + o do carvão + o que respiramos.",
    ],
    fact: "É o 'carbonato de magnésio' do saquinho de giz: seca o suor e melhora a pegada na barra.",
  },
  {
    name: "Siderita", formula: "FeCO₃", els: ["Fe", "C", "O"], diff: "medium",
    hints: [
      "Um minério pardo de onde se tira ferro.",
      "Seu nome vem do grego para 'ferro'.",
      "O metal do sangue + o do carvão + o que respiramos.",
    ],
    fact: "Antes de saber fundir minério, a humanidade tirava ferro de meteoritos — que os gregos chamavam pela mesma raiz.",
  },
  {
    name: "Clorato de Potássio", formula: "KClO₃", els: ["K", "Cl", "O"], diff: "medium",
    hints: [
      "Está na cabeça do fósforo e na lateral da caixinha.",
      "Aquecido, libera oxigênio puro.",
      "O da banana + o da piscina + o que respiramos.",
    ],
    fact: "As máscaras que caem no avião não vêm de um cilindro: uma reação química parecida gera o oxigênio na hora.",
  },
  {
    name: "Salitre do Chile", formula: "NaNO₃", els: ["Na", "N", "O"], diff: "medium",
    hints: [
      "Um deserto inteiro já foi disputado por causa dele.",
      "Fertilizante e conservante de carnes.",
      "Sódio + o gás do ar + o que respiramos.",
    ],
    fact: "Bolívia, Chile e Peru foram à guerra em 1879 por este pó — e a Bolívia perdeu sua saída para o mar.",
  },
  {
    name: "Sal Amoníaco", formula: "NH₄Cl", els: ["N", "H", "Cl"], diff: "medium",
    hints: [
      "Faz a pilha comum funcionar.",
      "Na Escandinávia vira bala preta salgada.",
      "O gás do ar + hidrogênio + o da piscina.",
    ],
    fact: "Era extraído perto de templos egípcios do deus Amon — daí o nome 'amoníaco'.",
  },
  {
    name: "Calcopirita", formula: "CuFeS₂", els: ["Cu", "Fe", "S"], diff: "medium",
    hints: [
      "Dourada o bastante para enganar garimpeiro.",
      "É de onde vem a maior parte do cobre do mundo.",
      "O metal dos fios + o do sangue + o que fede.",
    ],
    fact: "Cerca de 70% de todo o cobre do planeta sai dela — inclusive o dos fios da sua casa.",
  },
  {
    name: "Hidróxido de Ferro", formula: "Fe(OH)₃", els: ["Fe", "O", "H"], diff: "medium",
    hints: [
      "A lama alaranjada de rios contaminados por mineração.",
      "É o passo intermediário até a ferrugem.",
      "O metal do sangue + água.",
    ],
    fact: "Ele gruda nas impurezas e afunda levando tudo junto — por isso é usado para clarear água em estações de tratamento.",
  },
  {
    name: "Azul da Prússia", formula: "Fe₄[Fe(CN)₆]₃", els: ["Fe", "C", "N"], diff: "medium",
    hints: [
      "O primeiro pigmento sintético da era moderna.",
      "Pintou a Grande Onda de Kanagawa.",
      "O metal do sangue + o do carvão + o gás do ar.",
    ],
    fact: "Criado por acidente em 1706, é usado até hoje como remédio contra envenenamento por metais pesados.",
  },
  {
    name: "Nitrato de Cobre", formula: "Cu(NO₃)₂", els: ["Cu", "N", "O"], diff: "medium",
    hints: [
      "Cristais azuis que atacam o papel.",
      "No fogo, dá chamas verdes e azuis.",
      "O metal dos fios + o gás do ar + o que respiramos.",
    ],
    fact: "Papel embebido nele esquenta ao secar e pode pegar fogo sozinho — o velho truque da 'carta em chamas'.",
  },

  // ────────────────────────── DIFÍCIL (4 elementos) ──────────────────────────

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
  {
    name: "Vitríolo Azul", formula: "CuSO₄·5H₂O", els: ["Cu", "S", "O", "H"], diff: "hard",
    hints: [
      "Cristais azul-safira que dá para cultivar dentro de um copo.",
      "Perde a cor no calor e recupera com uma gota d'água.",
      "Cobre + enxofre + oxigênio + hidrogênio.",
    ],
    fact: "Aquecido vira pó branco; pingue água e o azul renasce na hora — é o teste clássico de umidade escondida.",
  },
  {
    name: "Sal de Epsom", formula: "MgSO₄·7H₂O", els: ["Mg", "S", "O", "H"], diff: "hard",
    hints: [
      "Vendido para banho de imersão nos pés.",
      "Cristais transparentes que parecem sal grosso.",
      "Magnésio + enxofre + oxigênio + hidrogênio.",
    ],
    fact: "Descoberto numa fonte de água amarga na Inglaterra, quando notaram que as vacas se recusavam a beber dela.",
  },
  {
    name: "Vitríolo Verde", formula: "FeSO₄·7H₂O", els: ["Fe", "S", "O", "H"], diff: "hard",
    hints: [
      "Cristais verdes que os alquimistas adoravam.",
      "Com ele se escreveu boa parte da Idade Média.",
      "Ferro + enxofre + oxigênio + hidrogênio.",
    ],
    fact: "Misturado a extrato de noz virava a tinta preta dos manuscritos medievais — e de constituições inteiras.",
  },
  {
    name: "Sulfato de Amônio", formula: "(NH₄)₂SO₄", els: ["N", "H", "S", "O"], diff: "hard",
    hints: [
      "O adubo mais usado em lavouras de arroz.",
      "Também combate incêndio florestal.",
      "Nitrogênio + hidrogênio + enxofre + oxigênio.",
    ],
    fact: "O pó vermelho que aviões despejam sobre incêndios florestais é feito à base dele.",
  },
  {
    name: "Cremor de Tártaro", formula: "KC₄H₅O₆", els: ["K", "C", "H", "O"], diff: "hard",
    hints: [
      "Cristaliza sozinho dentro de barris de vinho.",
      "Faz clara em neve virar merengue firme.",
      "Potássio + carbono + hidrogênio + oxigênio.",
    ],
    fact: "É subproduto da fabricação do vinho — e metade do fermento em pó da sua cozinha.",
  },
  {
    name: "Sal de Glauber", formula: "Na₂SO₄·10H₂O", els: ["Na", "S", "O", "H"], diff: "hard",
    hints: [
      "Descoberto numa fonte de água em 1625.",
      "Seu descobridor o batizou de 'sal maravilhoso'.",
      "Sódio + enxofre + oxigênio + hidrogênio.",
    ],
    fact: "Derrete a 32 °C guardando muito calor — paredes recheadas com ele climatizam casas quase sem gastar energia.",
  },
  {
    name: "Dolomita", formula: "CaMg(CO₃)₂", els: ["Ca", "Mg", "C", "O"], diff: "hard",
    hints: [
      "Uma cordilheira italiana inteira leva seu nome.",
      "Corrige solo ácido em plantações.",
      "Cálcio + magnésio + carbono + oxigênio.",
    ],
    fact: "Os Alpes Dolomitas são feitos dela — e ninguém conseguiu ainda reproduzir sua formação natural em laboratório.",
  },
  {
    name: "Ferrocianeto de Potássio", formula: "K₄[Fe(CN)₆]", els: ["K", "Fe", "C", "N"], diff: "hard",
    hints: [
      "Está escondido no seu sal de cozinha.",
      "Impede que o sal empedre dentro do saleiro.",
      "Potássio + ferro + carbono + nitrogênio.",
    ],
    fact: "Apesar do nome assustador, o ferro prende o cianeto com tanta força que ele é inofensivo — é aditivo alimentar aprovado.",
  },
  {
    name: "Bicarbonato de Cálcio", formula: "Ca(HCO₃)₂", els: ["Ca", "H", "C", "O"], diff: "hard",
    hints: [
      "Só existe dissolvido na água, nunca em pó.",
      "Constrói estalactites gota a gota.",
      "Cálcio + hidrogênio + carbono + oxigênio.",
    ],
    fact: "Uma estalactite cresce cerca de 1 cm por século — a do teto de uma caverna é mais velha que a escrita.",
  },
  {
    name: "Bicarbonato de Magnésio", formula: "Mg(HCO₃)₂", els: ["Mg", "H", "C", "O"], diff: "hard",
    hints: [
      "Responsável pela 'água dura' que entope chuveiro.",
      "Ferver a água o destrói e deixa crosta branca.",
      "Magnésio + hidrogênio + carbono + oxigênio.",
    ],
    fact: "É a crosta branca no fundo da chaleira: o calor o quebra e o sólido se deposita.",
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
