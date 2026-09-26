import type GameBoard from "../board/game_board";
import type {
  Attacks,
  AttackResult,
  PlacementResult,
  Position,
  ShipInformation,
} from "../board/types";
import Ship from "../ship/ship.ts";
import type { Fleet } from "./types.ts";

export default class Player {
  readonly #id: string;
  readonly #board: GameBoard;
  readonly #fleet: Fleet;

  // oxlint-disable-next-line prefer-readonly-parameter-types
  constructor(gameBoard: GameBoard) {
    this.#id = crypto.randomUUID();
    this.#board = gameBoard;
    this.#fleet = this.#createFleet();
  }

  placeShip(shipInformation: ShipInformation): PlacementResult {
    return this.#board.placeShip(shipInformation);
  }

  randomizeBoard(): void {
    this.#fleet.forEach((ship) => this.#board.placeShipRandomly(ship));
  }

  receiveAttack(position: Position): AttackResult {
    return this.#board.receiveAttack(position);
  }

  hasLost(): boolean {
    return this.#board.allShipsSunk();
  }

  isReady(): boolean {
    return this.#board.hasValidFleet();
  }

  reset(): void {
    this.#board.resetBoard();
  }

  get id(): string {
    return this.#id;
  }

  get board(): GameBoard {
    return this.#board;
  }

  get attacks(): Attacks {
    return this.#board.attacks;
  }

  get fleet(): Fleet {
    return this.#fleet;
  }

  #createFleet(): Fleet {
    const carrier: Ship = new Ship(5, "Carrier");
    const battleship: Ship = new Ship(4, "Battleship");
    const destroyer: Ship = new Ship(3, "Destroyer");
    const submarine: Ship = new Ship(3, "Submarine");
    const patrolShip: Ship = new Ship(2, "Patrol Ship");

    const ships: Fleet = [
      carrier,
      battleship,
      destroyer,
      submarine,
      patrolShip,
    ];

    return ships;
  }
}
