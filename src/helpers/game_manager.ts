import type { AttackResult, Position } from "../core/board/types.ts";
import Game from "../core/game/game";
import Player from "../core/player/player";
import generateBoard from "../ui/generate_board";
import generateShipOverlay from "../ui/generate_ship_overlay";
import * as Toast from "./toast.ts";

interface constructorProps {
  app: HTMLDivElement;
  playerOne: Player;
  aiPlayer: Player;
}
interface AttackArgs {
  position: Position;
  element: HTMLElement;
  playerId: string;
}

export default class GameManager {
  #playerOne: Player;
  #aiPlayer: Player;
  #game: Game;
  #app: HTMLDivElement;

  constructor({ app, playerOne, aiPlayer }: constructorProps) {
    this.#app = app;
    this.#playerOne = playerOne;
    this.#aiPlayer = aiPlayer;
    this.#game = new Game(this.#playerOne, this.#aiPlayer);
  }

  startGame(): void {
    this.#game.randomizeAll();

    if (this.#game.startGame()) {
      const gameBoardContainerElement: HTMLDivElement =
        document.createElement("div");
      gameBoardContainerElement.classList.add("game-board-container");

      const playerOneBoardContainer: HTMLDivElement =
        document.createElement("div");
      playerOneBoardContainer.classList.add("player-board-container");

      const aiPlayerBoardContainer: HTMLDivElement =
        document.createElement("div");
      aiPlayerBoardContainer.classList.add("player-board-container");

      const playerOneBoardElement = generateBoard(false);
      const playerOneShipOverlay = generateShipOverlay(this.#playerOne);

      const aiPlayerBoardElement = generateBoard(true);

      playerOneBoardContainer.append(
        playerOneBoardElement,
        playerOneShipOverlay,
      );
      playerOneBoardContainer.dataset.playerId = this.#playerOne.id;

      aiPlayerBoardContainer.append(aiPlayerBoardElement);
      aiPlayerBoardContainer.dataset.playerId = this.#aiPlayer.id;

      gameBoardContainerElement.append(
        aiPlayerBoardContainer,
        playerOneBoardContainer,
      );

      this.#app.appendChild(gameBoardContainerElement);
    } else {
      Toast.failure("Unable to start", "Set up your fleet first");
    }
  }

  restartGame(): void {
    this.#app.querySelector(".game-board-container")?.remove();

    if (this.#game.resetGame()) {
      Toast.success("Reset successful");
      this.startGame();
    } else {
      Toast.failure(
        "Reset Error",
        "An error occured while resetting the game, please try again.",
      );
    }
  }

  attackOpponent({ position, playerId, element }: AttackArgs): boolean {
    if (this.#game.state === 0) {
      Toast.failure("Failed to attack", "Not all players are ready");
      return false;
    } else if (this.#game.state === 2) {
      Toast.failure("Failed to attack", "Game is over");
      return false;
    }

    if (playerId === this.#game.currentPlayer.id) {
      Toast.failure("Failed to attack", "Can't attack yourself");
      return false;
    } else {
      const result = this.#game.placeAttack(position);
      const type = result.type;

      switch (type) {
        case "hit":
          element.classList.add("cell-disabled", "cell-hit");
          break;
        case "miss":
          element.classList.add("cell-disabled", "cell-miss");
          break;
        case "invalid":
          break;
      }

      this.#checkWin();
    }

    return true;
  }

  #nextRound() {
    this.#game.nextRound();

    if (this.#game.currentPlayer === this.#aiPlayer) {
      this.#aiAttack();
    }
  }

  #aiAttack() {
    const position: Position = this.#aiPlayer.randomAttack(this.#playerOne);
    const attackResult: AttackResult = this.#game.placeAttack(position);

    const cell = this.#app
      .querySelector(`[data-player-id="${this.#playerOne.id}"]`)
      ?.querySelector(".ship-board")
      ?.querySelector(`[data-position="${position.join(",")}"]`);

    switch (attackResult.type) {
      case "hit":
        cell!.classList.add("cell-hit");
        break;
      case "miss":
        cell!.classList.add("cell-miss");
        break;
      case "invalid":
        this.#aiAttack();
    }

    this.#checkWin();
  }

  #displayWinner(playerHasWon: boolean): void {
    const displayText: string = playerHasWon
      ? "You have won the game"
      : "You have lost the game";

    const winnerDialog: HTMLDialogElement = document.createElement("dialog");
    winnerDialog.id = "winner-dialog";

    const displayParagraph: HTMLParagraphElement = document.createElement("p");
    displayParagraph.textContent = displayText;
    displayParagraph.classList.add("winner-dialog__text");

    const closeButton: HTMLButtonElement = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.commandForElement = winnerDialog;
    closeButton.command = "close";

    closeButton.classList.add("winner-dialog__close-btn");

    winnerDialog.appendChild(displayParagraph);
    winnerDialog.appendChild(closeButton);

    this.#app.appendChild(winnerDialog);

    winnerDialog.showModal();

    closeButton.addEventListener("click", () => winnerDialog.remove());
  }

  #checkWin(): void {
    if (this.#game.state === 2) {
      const playerHasWon: boolean = this.#game.winner === this.#playerOne;
      this.#displayWinner(playerHasWon);
    } else {
      this.#nextRound();
    }
  }
}
