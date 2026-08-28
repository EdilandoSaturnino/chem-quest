import type { ChemicalElement, ElementSymbol } from "./element";

export const ELEMENTS: readonly ChemicalElement[] = [
  { num: 1,  sym: "H",  real: "Hidrogênio", hue: 195,
    fact: "É o elemento mais abundante do universo — compõe estrelas e está em toda água." },
  { num: 8,  sym: "O",  real: "Oxigênio", hue: 165,
    fact: "Sem ele não há respiração nem fogo. 21% do ar que você respira é oxigênio." },
  { num: 6,  sym: "C",  real: "Carbono", hue: 28,
    fact: "Está em tudo que vive: DNA, madeira, carvão... e também em diamantes!" },
  { num: 7,  sym: "N",  real: "Nitrogênio", hue: 270,
    fact: "78% do ar é nitrogênio. Plantas dependem dele para crescer." },
  { num: 11, sym: "Na", real: "Sódio", hue: 50,
    fact: "Reage violentamente com água! Combinado com cloro vira o sal de cozinha." },
  { num: 17, sym: "Cl", real: "Cloro", hue: 80,
    fact: "Tóxico puro, mas essencial: limpa piscinas e forma o sal." },
  { num: 19, sym: "K",  real: "Potássio", hue: 285,
    fact: "Bananas têm muito! Essencial para os músculos e o coração." },
  { num: 20, sym: "Ca", real: "Cálcio", hue: 60,
    fact: "Constrói ossos e dentes. Está no leite, queijo e calcário." },
  { num: 12, sym: "Mg", real: "Magnésio", hue: 100,
    fact: "Queima com luz branca brilhantíssima — usado em fogos de artifício!" },
  { num: 26, sym: "Fe", real: "Ferro", hue: 0,
    fact: "Faz seu sangue ser vermelho! Sem ferro, não há hemoglobina nem aço." },
  { num: 29, sym: "Cu", real: "Cobre", hue: 150,
    fact: "Conduz eletricidade quase como ouro — está em todos os fios da sua casa." },
  { num: 16, sym: "S",  real: "Enxofre", hue: 45,
    fact: "Cheira a ovo podre. Está em proteínas como as do cabelo e da cebola." },
] as const;


export function findElementBySymbol(sym: ElementSymbol): ChemicalElement | undefined {
  return ELEMENTS.find(e => e.sym === sym);
}