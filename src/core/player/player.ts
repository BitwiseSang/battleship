import type GameBoard from "../board/game_board";
import type {
  Attacks,
  AttackResult,
  PlacementResult,
  Position,
  ShipInformation,
} from "../board/types";

export default class Player {
  #board: GameBoard;

  // oxlint-disable-next-line prefer-readonly-parameter-types
  constructor(gameBoard: GameBoard) {
    this.#board = gameBoard;
  }

  placeShip(shipInformation: ShipInformation): PlacementResult {
    return this.#board.placeShip(shipInformation);
  }

  receiveAttack(position: Position): AttackResult {
    return this.#board.receiveAttack(position);
  }

  get board(): GameBoard {
    return this.#board;
  }

  get attacks(): Attacks {
    return this.#board.attacks;
  }
}
