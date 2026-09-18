import type {
  Attack,
  Attacks,
  AttackResult,
  Positions,
  Position,
  Board,
  ShipObject,
  Ships,
  ShipInformation,
  PlacementResult,
  ReadOnlyBoard,
} from "./types.ts";

export default class GameBoard {
  #board: Board;
  readonly ships: Ships;
  readonly attacks: Attacks;

  constructor() {
    this.#board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => undefined),
    );

    this.ships = [];
    this.attacks = [];
  }

  placeShip({ ship, positions }: ShipInformation): PlacementResult {
    // If positions are not equal to the ship's length.

    if (positions === undefined)
      return {
        type: "invalid",
        reason: "diagonal",
      };

    if (
      positions.some(
        (position) => !this.#validateCoordinates(position[0], position[1]),
      )
    )
      return { type: "invalid", reason: "out-of-bounds" };

    if (positions.length !== ship.length)
      return {
        type: "invalid",
        reason: "wrong-length",
        expected: ship.length,
        actual: positions.length,
      };

    // If any of the ship's position is already occupied by a ship already.
    if (
      positions.some((position: Position): boolean => {
        const [row, col] = position;
        return this.board[row][col] !== undefined;
      })
    )
      return {
        type: "invalid",
        reason: "occupied",
      };

    positions.forEach((position: Position): void => {
      const [row, col] = position;
      this.#board[row][col] = ship;
    });

    const shipPositions: Positions = positions.map(([row, col]: Position) => [
      row,
      col,
    ]);

    this.ships.push({ ship, position: shipPositions });

    return { type: "placed" };
  }

  get hits(): Positions {
    return this.attacks
      .filter((attack) => attack.hit)
      .map((attack) => attack.position);
  }

  get misses(): Positions {
    return this.attacks
      .filter((attack) => !attack.hit)
      .map((attack) => attack.position);
  }

  get board(): ReadOnlyBoard {
    return this.#board;
  }

  #validateCoordinates(row: number, col: number): boolean {
    if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
      return true;
    }
    return false;
  }

  receiveAttack(position: Position): AttackResult {
    const [row, col] = position;

    if (!this.#validateCoordinates(row, col))
      return { type: "invalid", reason: "invalid-coordinates" };

    if (this.#hasBeenAttacked(row, col))
      return { type: "invalid", reason: "attacked" };

    const shipPresent = this.board[row][col] !== undefined;

    this.attacks.push({ position: [row, col], hit: shipPresent });

    const shipObject = this.#getShip(row, col);

    if (shipObject) shipObject.ship.hit();

    return shipObject
      ? { type: "hit", ship: shipObject.ship }
      : { type: "miss" };
  }

  allShipsSunk(): boolean {
    return this.ships.every((shipObject: ShipObject): boolean =>
      shipObject.ship.isSunk(),
    );
  }

  #getShip(row: number, col: number): ShipObject | undefined {
    return this.ships.find((ship: ShipObject): boolean =>
      ship.position.some(
        ([shipRow, shipColumn]: Position): boolean =>
          shipRow === row && shipColumn === col,
      ),
    );
  }

  #hasBeenAttacked(row: number, col: number): boolean {
    return this.attacks.some(
      (attack: Attack): boolean =>
        attack.position[0] === row && attack.position[1] === col,
    );
  }
}
