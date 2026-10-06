import type { Position, AttackResult } from "../board/types.ts";
import type Player from "../player/player";
import type { Players } from "./types.ts";

export default class Game {
  readonly #players: Players;
  #currentPlayer: Player;
  #winner: Player | undefined;
  #state: number;

  constructor(playerOne: Player, playerTwo: Player) {
    this.#players = [playerOne, playerTwo];
    this.#currentPlayer = this.#players[0];
    this.#winner = undefined;
    this.#state = 0;
  }

  get players(): Players {
    return this.#players;
  }

  get currentPlayer(): Player {
    return this.#currentPlayer;
  }

  get state(): number {
    return this.#state;
  }

  get winner(): Player | undefined {
    return this.#winner;
  }

  startGame(): boolean {
    if (this.#state !== 0) return false;

    if (this.#players.every((player) => player.isReady())) {
      this.#state = 1;
      return true;
    } else {
      return false;
    }
  }

  resetGame(): boolean {
    if (this.#state === 0) return false;

    this.#players.forEach((player: Player): void => player.reset());

    this.#currentPlayer = this.#players[0];
    this.#state = 0;
    this.#winner = undefined;

    return true;
  }

  randomizeAll(): void {
    this.#players.forEach((player) => player.randomizeBoard());
  }

  placeAttack(position: Position): AttackResult {
    const opponent: Player = this.#players.find(
      (player: Player): boolean => player.id !== this.#currentPlayer.id,
    )!;

    const result: AttackResult = opponent.receiveAttack(position);

    if (this.hasWonGame()) {
      this.#state = 2;
      this.#winner = this.#currentPlayer;
    }

    return result;
  }

  nextRound(): void {
    if (this.#state !== 1) return;

    this.#currentPlayer = this.#players.find(
      (player) => player.id !== this.#currentPlayer.id,
    )!;
  }

  hasWonGame(): boolean {
    if (this.#state === 0) return false;
    if (this.#state === 2) return true;

    return this.#players
      .filter((player: Player): boolean => player !== this.#currentPlayer)
      .some((player: Player): boolean => player.hasLost());
  }
}
