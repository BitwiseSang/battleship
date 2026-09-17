export default function notationToPosition(notation: string): [number, number] {
  notation = notation.toUpperCase();

  const row: number = notation.charCodeAt(0) - 65;
  const column: number = parseInt(notation.slice(1)) - 1;

  return [row, column];
}
