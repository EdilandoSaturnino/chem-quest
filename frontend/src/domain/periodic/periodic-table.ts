export type PeriodicCategory =
  | "alcalino"
  | "alcalinoterroso"
  | "transicao"
  | "posmetal"
  | "semimetal"
  | "naometal"
  | "halogenio"
  | "nobre"
  | "lantanideo"
  | "actinideo";

export interface PeriodicElement {
  readonly num: number;
  readonly sym: string;
  readonly name: string;        
  readonly row: number;         
  readonly col: number;         
  readonly cat: PeriodicCategory;
}

export const PERIODIC_ELEMENTS: readonly PeriodicElement[] = [
  { num: 1,  sym: "H",  name: "Hidrogênio",    row: 1, col: 1,  cat: "naometal" },
  { num: 2,  sym: "He", name: "Hélio",         row: 1, col: 18, cat: "nobre" },
  { num: 3,  sym: "Li", name: "Lítio",         row: 2, col: 1,  cat: "alcalino" },
  { num: 4,  sym: "Be", name: "Berílio",       row: 2, col: 2,  cat: "alcalinoterroso" },
  { num: 5,  sym: "B",  name: "Boro",          row: 2, col: 13, cat: "semimetal" },
  { num: 6,  sym: "C",  name: "Carbono",       row: 2, col: 14, cat: "naometal" },
  { num: 7,  sym: "N",  name: "Nitrogênio",    row: 2, col: 15, cat: "naometal" },
  { num: 8,  sym: "O",  name: "Oxigênio",      row: 2, col: 16, cat: "naometal" },
  { num: 9,  sym: "F",  name: "Flúor",         row: 2, col: 17, cat: "halogenio" },
  { num: 10, sym: "Ne", name: "Neônio",        row: 2, col: 18, cat: "nobre" },
  { num: 11, sym: "Na", name: "Sódio",         row: 3, col: 1,  cat: "alcalino" },
  { num: 12, sym: "Mg", name: "Magnésio",      row: 3, col: 2,  cat: "alcalinoterroso" },
  { num: 13, sym: "Al", name: "Alumínio",      row: 3, col: 13, cat: "posmetal" },
  { num: 14, sym: "Si", name: "Silício",       row: 3, col: 14, cat: "semimetal" },
  { num: 15, sym: "P",  name: "Fósforo",       row: 3, col: 15, cat: "naometal" },
  { num: 16, sym: "S",  name: "Enxofre",       row: 3, col: 16, cat: "naometal" },
  { num: 17, sym: "Cl", name: "Cloro",         row: 3, col: 17, cat: "halogenio" },
  { num: 18, sym: "Ar", name: "Argônio",       row: 3, col: 18, cat: "nobre" },
  { num: 19, sym: "K",  name: "Potássio",      row: 4, col: 1,  cat: "alcalino" },
  { num: 20, sym: "Ca", name: "Cálcio",        row: 4, col: 2,  cat: "alcalinoterroso" },
  { num: 21, sym: "Sc", name: "Escândio",      row: 4, col: 3,  cat: "transicao" },
  { num: 22, sym: "Ti", name: "Titânio",       row: 4, col: 4,  cat: "transicao" },
  { num: 23, sym: "V",  name: "Vanádio",       row: 4, col: 5,  cat: "transicao" },
  { num: 24, sym: "Cr", name: "Cromo",         row: 4, col: 6,  cat: "transicao" },
  { num: 25, sym: "Mn", name: "Manganês",      row: 4, col: 7,  cat: "transicao" },
  { num: 26, sym: "Fe", name: "Ferro",         row: 4, col: 8,  cat: "transicao" },
  { num: 27, sym: "Co", name: "Cobalto",       row: 4, col: 9,  cat: "transicao" },
  { num: 28, sym: "Ni", name: "Níquel",        row: 4, col: 10, cat: "transicao" },
  { num: 29, sym: "Cu", name: "Cobre",         row: 4, col: 11, cat: "transicao" },
  { num: 30, sym: "Zn", name: "Zinco",         row: 4, col: 12, cat: "transicao" },
  { num: 31, sym: "Ga", name: "Gálio",         row: 4, col: 13, cat: "posmetal" },
  { num: 32, sym: "Ge", name: "Germânio",      row: 4, col: 14, cat: "semimetal" },
  { num: 33, sym: "As", name: "Arsênio",       row: 4, col: 15, cat: "semimetal" },
  { num: 34, sym: "Se", name: "Selênio",       row: 4, col: 16, cat: "naometal" },
  { num: 35, sym: "Br", name: "Bromo",         row: 4, col: 17, cat: "halogenio" },
  { num: 36, sym: "Kr", name: "Criptônio",     row: 4, col: 18, cat: "nobre" },
  { num: 37, sym: "Rb", name: "Rubídio",       row: 5, col: 1,  cat: "alcalino" },
  { num: 38, sym: "Sr", name: "Estrôncio",     row: 5, col: 2,  cat: "alcalinoterroso" },
  { num: 39, sym: "Y",  name: "Ítrio",         row: 5, col: 3,  cat: "transicao" },
  { num: 40, sym: "Zr", name: "Zircônio",      row: 5, col: 4,  cat: "transicao" },
  { num: 41, sym: "Nb", name: "Nióbio",        row: 5, col: 5,  cat: "transicao" },
  { num: 42, sym: "Mo", name: "Molibdênio",    row: 5, col: 6,  cat: "transicao" },
  { num: 43, sym: "Tc", name: "Tecnécio",      row: 5, col: 7,  cat: "transicao" },
  { num: 44, sym: "Ru", name: "Rutênio",       row: 5, col: 8,  cat: "transicao" },
  { num: 45, sym: "Rh", name: "Ródio",         row: 5, col: 9,  cat: "transicao" },
  { num: 46, sym: "Pd", name: "Paládio",       row: 5, col: 10, cat: "transicao" },
  { num: 47, sym: "Ag", name: "Prata",         row: 5, col: 11, cat: "transicao" },
  { num: 48, sym: "Cd", name: "Cádmio",        row: 5, col: 12, cat: "transicao" },
  { num: 49, sym: "In", name: "Índio",         row: 5, col: 13, cat: "posmetal" },
  { num: 50, sym: "Sn", name: "Estanho",       row: 5, col: 14, cat: "posmetal" },
  { num: 51, sym: "Sb", name: "Antimônio",     row: 5, col: 15, cat: "semimetal" },
  { num: 52, sym: "Te", name: "Telúrio",       row: 5, col: 16, cat: "semimetal" },
  { num: 53, sym: "I",  name: "Iodo",          row: 5, col: 17, cat: "halogenio" },
  { num: 54, sym: "Xe", name: "Xenônio",       row: 5, col: 18, cat: "nobre" },
  { num: 55, sym: "Cs", name: "Césio",         row: 6, col: 1,  cat: "alcalino" },
  { num: 56, sym: "Ba", name: "Bário",         row: 6, col: 2,  cat: "alcalinoterroso" },
  { num: 57, sym: "La", name: "Lantânio",      row: 9, col: 3,  cat: "lantanideo" },
  { num: 58, sym: "Ce", name: "Cério",         row: 9, col: 4,  cat: "lantanideo" },
  { num: 59, sym: "Pr", name: "Praseodímio",   row: 9, col: 5,  cat: "lantanideo" },
  { num: 60, sym: "Nd", name: "Neodímio",      row: 9, col: 6,  cat: "lantanideo" },
  { num: 61, sym: "Pm", name: "Promécio",      row: 9, col: 7,  cat: "lantanideo" },
  { num: 62, sym: "Sm", name: "Samário",       row: 9, col: 8,  cat: "lantanideo" },
  { num: 63, sym: "Eu", name: "Európio",       row: 9, col: 9,  cat: "lantanideo" },
  { num: 64, sym: "Gd", name: "Gadolínio",     row: 9, col: 10, cat: "lantanideo" },
  { num: 65, sym: "Tb", name: "Térbio",        row: 9, col: 11, cat: "lantanideo" },
  { num: 66, sym: "Dy", name: "Disprósio",     row: 9, col: 12, cat: "lantanideo" },
  { num: 67, sym: "Ho", name: "Hólmio",        row: 9, col: 13, cat: "lantanideo" },
  { num: 68, sym: "Er", name: "Érbio",         row: 9, col: 14, cat: "lantanideo" },
  { num: 69, sym: "Tm", name: "Túlio",         row: 9, col: 15, cat: "lantanideo" },
  { num: 70, sym: "Yb", name: "Itérbio",       row: 9, col: 16, cat: "lantanideo" },
  { num: 71, sym: "Lu", name: "Lutécio",       row: 9, col: 17, cat: "lantanideo" },
  { num: 72, sym: "Hf", name: "Háfnio",        row: 6, col: 4,  cat: "transicao" },
  { num: 73, sym: "Ta", name: "Tântalo",       row: 6, col: 5,  cat: "transicao" },
  { num: 74, sym: "W",  name: "Tungstênio",    row: 6, col: 6,  cat: "transicao" },
  { num: 75, sym: "Re", name: "Rênio",         row: 6, col: 7,  cat: "transicao" },
  { num: 76, sym: "Os", name: "Ósmio",         row: 6, col: 8,  cat: "transicao" },
  { num: 77, sym: "Ir", name: "Irídio",        row: 6, col: 9,  cat: "transicao" },
  { num: 78, sym: "Pt", name: "Platina",       row: 6, col: 10, cat: "transicao" },
  { num: 79, sym: "Au", name: "Ouro",          row: 6, col: 11, cat: "transicao" },
  { num: 80, sym: "Hg", name: "Mercúrio",      row: 6, col: 12, cat: "transicao" },
  { num: 81, sym: "Tl", name: "Tálio",         row: 6, col: 13, cat: "posmetal" },
  { num: 82, sym: "Pb", name: "Chumbo",        row: 6, col: 14, cat: "posmetal" },
  { num: 83, sym: "Bi", name: "Bismuto",       row: 6, col: 15, cat: "posmetal" },
  { num: 84, sym: "Po", name: "Polônio",       row: 6, col: 16, cat: "semimetal" },
  { num: 85, sym: "At", name: "Astato",        row: 6, col: 17, cat: "halogenio" },
  { num: 86, sym: "Rn", name: "Radônio",       row: 6, col: 18, cat: "nobre" },
  { num: 87, sym: "Fr", name: "Frâncio",       row: 7, col: 1,  cat: "alcalino" },
  { num: 88, sym: "Ra", name: "Rádio",         row: 7, col: 2,  cat: "alcalinoterroso" },
  { num: 89, sym: "Ac", name: "Actínio",       row: 10, col: 3,  cat: "actinideo" },
  { num: 90, sym: "Th", name: "Tório",         row: 10, col: 4,  cat: "actinideo" },
  { num: 91, sym: "Pa", name: "Protactínio",   row: 10, col: 5,  cat: "actinideo" },
  { num: 92, sym: "U",  name: "Urânio",        row: 10, col: 6,  cat: "actinideo" },
  { num: 93, sym: "Np", name: "Netúnio",       row: 10, col: 7,  cat: "actinideo" },
  { num: 94, sym: "Pu", name: "Plutônio",      row: 10, col: 8,  cat: "actinideo" },
  { num: 95, sym: "Am", name: "Amerício",      row: 10, col: 9,  cat: "actinideo" },
  { num: 96, sym: "Cm", name: "Cúrio",         row: 10, col: 10, cat: "actinideo" },
  { num: 97, sym: "Bk", name: "Berquélio",     row: 10, col: 11, cat: "actinideo" },
  { num: 98, sym: "Cf", name: "Califórnio",    row: 10, col: 12, cat: "actinideo" },
  { num: 99, sym: "Es", name: "Einstênio",     row: 10, col: 13, cat: "actinideo" },
  { num: 100, sym: "Fm", name: "Férmio",       row: 10, col: 14, cat: "actinideo" },
  { num: 101, sym: "Md", name: "Mendelévio",   row: 10, col: 15, cat: "actinideo" },
  { num: 102, sym: "No", name: "Nobélio",      row: 10, col: 16, cat: "actinideo" },
  { num: 103, sym: "Lr", name: "Laurêncio",    row: 10, col: 17, cat: "actinideo" },
  { num: 104, sym: "Rf", name: "Rutherfórdio", row: 7, col: 4,  cat: "transicao" },
  { num: 105, sym: "Db", name: "Dúbnio",       row: 7, col: 5,  cat: "transicao" },
  { num: 106, sym: "Sg", name: "Seabórgio",    row: 7, col: 6,  cat: "transicao" },
  { num: 107, sym: "Bh", name: "Bóhrio",       row: 7, col: 7,  cat: "transicao" },
  { num: 108, sym: "Hs", name: "Hássio",       row: 7, col: 8,  cat: "transicao" },
  { num: 109, sym: "Mt", name: "Meitnério",    row: 7, col: 9,  cat: "transicao" },
  { num: 110, sym: "Ds", name: "Darmstádio",   row: 7, col: 10, cat: "transicao" },
  { num: 111, sym: "Rg", name: "Roentgênio",   row: 7, col: 11, cat: "transicao" },
  { num: 112, sym: "Cn", name: "Copernício",   row: 7, col: 12, cat: "transicao" },
  { num: 113, sym: "Nh", name: "Nihônio",      row: 7, col: 13, cat: "posmetal" },
  { num: 114, sym: "Fl", name: "Fleróvio",     row: 7, col: 14, cat: "posmetal" },
  { num: 115, sym: "Mc", name: "Moscóvio",     row: 7, col: 15, cat: "posmetal" },
  { num: 116, sym: "Lv", name: "Livermório",   row: 7, col: 16, cat: "posmetal" },
  { num: 117, sym: "Ts", name: "Tenessino",    row: 7, col: 17, cat: "halogenio" },
  { num: 118, sym: "Og", name: "Oganessônio",  row: 7, col: 18, cat: "nobre" },
];

export const CATEGORY_HUE: Readonly<Record<PeriodicCategory, number>> = {
  alcalino:        0,
  alcalinoterroso: 30,
  transicao:       50,
  posmetal:        200,
  semimetal:       280,
  naometal:        165,
  halogenio:       100,
  nobre:           230,
  lantanideo:      320,
  actinideo:       340,
};


export function normalizeText(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function buildPeriodicLookup(): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of PERIODIC_ELEMENTS) {
    m.set(e.sym.toLowerCase(), e.num);
    m.set(normalizeText(e.name), e.num);
  }
  return m;
}