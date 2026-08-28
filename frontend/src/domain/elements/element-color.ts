import type { ChemicalElement } from "./element";

export interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface BottleColors {
  readonly left: RgbColor;
  readonly right: RgbColor;
  readonly middle: RgbColor;
}

export const OFF_COLOR: RgbColor = { r: 0, g: 0, b: 0 };

export function getSelectedElementsLiquidHue(
  selectedElements: readonly ChemicalElement[],
): number {
  if (selectedElements.length === 0) return 220;
  const sum = selectedElements.reduce((acc, el) => acc + el.hue, 0);
  return Math.round(sum / selectedElements.length);
}

export function hueToRgb(hue: number): RgbColor {
  return hslToRgb(hue, 80, 50);
}

export function getSelectedElementsBottleColors(
  selectedElements: readonly ChemicalElement[],
): BottleColors {
  const leftElements = selectedElements.filter((_, index) => index % 2 === 0);
  const rightElements = selectedElements.filter((_, index) => index % 2 === 1);

  return {
    left: colorFor(leftElements),
    right: colorFor(rightElements),
    middle: colorFor(selectedElements),
  };
}

function colorFor(elements: readonly ChemicalElement[]): RgbColor {
  if (elements.length === 0) return OFF_COLOR;
  return hueToRgb(getSelectedElementsLiquidHue(elements));
}

function hslToRgb(hue: number, saturationPercent: number, lightnessPercent: number): RgbColor {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const saturation = saturationPercent / 100;
  const lightness = lightnessPercent / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = normalizedHue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = lightness - chroma / 2;

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
}
