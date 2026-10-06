import generateGameBoard from "../components/board.ts";

export default function generateBoard(
  addEventListener: boolean,
): HTMLDivElement {
  const gameBoard = generateGameBoard(addEventListener);

  return gameBoard;
}
