
export function randomFrom<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("randomFrom called with empty array");
  return arr[Math.floor(Math.random() * arr.length)]!;
}