import type { Position } from "../core/board/types.ts";
import { gameManager } from "../main.ts";

export function startGameEventHandler(e: MouseEvent): void {
  if (!(e.target instanceof HTMLElement)) {
    return;
  }

  const app: HTMLDivElement = e.target.closest<HTMLDivElement>("#app")!;
  const actionButtonsContainer: HTMLDivElement = app.querySelector(
    ".action-buttons-container",
  )!;
  actionButtonsContainer.replaceChildren();

  const restartButton: HTMLButtonElement = document.createElement("button");
  restartButton.classList.add("action-button-container__restart-game-btn");
  restartButton.textContent = "Restart Game";

  restartButton.addEventListener("click", restartGameEventHandler);

  actionButtonsContainer.appendChild(restartButton);

  gameManager.startGame();
}

export function restartGameEventHandler(e: MouseEvent) {
  if (!(e.target instanceof HTMLElement)) {
    return;
  }

  gameManager.restartGame();
}

export function attackPosition(e: MouseEvent): void {
  if (!(e.target instanceof HTMLElement)) {
    return;
  }

  const element = e.target;

  const coordinates = element.dataset.position?.split(",").map(Number);

  if (
    !coordinates ||
    coordinates.length !== 2 ||
    coordinates.some(Number.isNaN)
  ) {
    return;
  }

  const position: Position = [coordinates[0], coordinates[1]];
  const playerBoard = e.target.closest<HTMLElement>(".player-board-container");

  if (!playerBoard) {
    return;
  }

  const playerId = playerBoard.dataset.playerId;

  if (!playerId) {
    return;
  }

  if (gameManager.attackOpponent({ position, playerId, element }))
    element.removeEventListener("click", attackPosition);
}
