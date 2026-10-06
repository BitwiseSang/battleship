import { attackPosition } from "../helpers/event_listeners.ts";

export default function generateGameBoard(
  addEventListener: boolean,
): HTMLDivElement {
  const gameBoard: HTMLDivElement = document.createElement("div");
  gameBoard.classList.add("game-board");
  for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
      const cell: HTMLDivElement = document.createElement("div");
      cell.classList.add("game-board__cell");
      cell.dataset.position = [rowIndex, columnIndex].join(",");

      if (addEventListener) cell.addEventListener("click", attackPosition);

      gameBoard.append(cell);
    }
  }
  return gameBoard;
}
