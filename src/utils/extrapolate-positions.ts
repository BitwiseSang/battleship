import type { Position, Positions } from "../core/game/types";

export function extrapolatePositions(
  start: Position,
  end: Position,
): Positions | undefined {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  let positions;

  if (Math.abs(endRow - startRow) === 0 && Math.abs(endCol - startCol) !== 0) {
    const length = Math.abs(endCol - startCol) + 1;
    const minimumColumnValue = Math.min(startCol, endCol);

    positions = Array.from({ length }, (_: undefined, i: number): Position => {
      return [startRow, minimumColumnValue + i];
    });
  } else if (Math.abs(endCol - startCol) === 0) {
    const length = Math.abs(endRow - startRow) + 1;
    const minimumRowValue = Math.min(startRow, endRow);

    positions = Array.from({ length }, (_, i): Position => [
      minimumRowValue + i,
      startCol,
    ]);
  } else {
    positions = undefined;
  }

  return positions;
}
