export function pickNUniqueRandom<T>(items: T[], n: number): T[] {
  if (n <= 0) return [];
  if (n >= items.length) return [...items];
  const indices = new Set<number>();
  while (indices.size < n) {
    indices.add(Math.floor(Math.random() * items.length));
  }
  return Array.from(indices).map((i) => items[i]);
}