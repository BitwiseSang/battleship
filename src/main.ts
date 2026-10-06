import "./style.css";
import GameBoard from "./core/board/game_board.ts";
import Player from "./core/player/player.ts";
import * as eventListeners from "./helpers/event_listeners.ts";
import GameManager from "./helpers/game_manager.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

const title: HTMLHeadingElement = document.createElement("h1");
title.innerText = "BATTLESHIP";

const actionButtonsContainer: HTMLDivElement = document.createElement("div");
actionButtonsContainer.classList.add("action-buttons-container");
const startGameButton: HTMLButtonElement = document.createElement("button");
startGameButton.classList.add("action-buttons-container__new-game-btn");
startGameButton.classList.add("action-buttons");
startGameButton.innerText = "Start New Game";

actionButtonsContainer.append(startGameButton);

startGameButton.addEventListener("click", eventListeners.startGameEventHandler);

app.appendChild(title);
app.append(actionButtonsContainer);

const playerOneBoard = new GameBoard();
const aiPlayerBoard = new GameBoard();

const playerOne = new Player(playerOneBoard);
const aiPlayer = new Player(aiPlayerBoard);

export const toastsContainerElement: HTMLDivElement =
  document.createElement("div");
toastsContainerElement.classList.add("toasts-container");

app.append(toastsContainerElement);

export const gameManager = new GameManager({ app, playerOne, aiPlayer });
