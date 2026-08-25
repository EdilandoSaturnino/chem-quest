export type ElementSymbol = string;

export interface ChemicalElement {
  readonly num: number;
  readonly sym: ElementSymbol;
  readonly real: string;
  readonly hue: number;
  readonly fact: string;
}