export function findOverlap(a: string, b: string): string {
  if (b.length === 0) return '';
  else if (a.endsWith(b)) return b;
  else if (a.includes(b)) return b;
  else return findOverlap(a, b.slice(0, Math.max(0, b.length - 1)));
}
