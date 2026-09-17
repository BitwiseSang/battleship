import type {
  Attack,
  Attacks,
  Positions,
  Position,
  Board,
  ShipObject,
  Ships,
  ShipInformation,
} from "./types.ts";
import Ship from "../ship/ship.ts";
import notationToPosition from "../../utils/notation-converter.ts";

export default class GameBoard {
  board: Board;
  ships: Ships;
  attacks: Attacks;

  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => undefined),
    );

    this.ships = [];
    this.attacks = [];
  }

  placeShip({
    name,
    startPosition,
    endPosition,
    ship,
  }: ShipInformation): boolean {
    const positions: Positions = this.#extrapolatePositions(
      startPosition,
      endPosition,
    );

    // If positions is on diagonals OR
    // If positions are not equal to the ship's length.
    if (!positions || positions.length !== ship.length) return false;

    // If any of the ship's position is already occupied by a ship already.
    if (
      positions.some((position: Position): Ship | undefined => {
        const [row, col] = position;
        return this.board[row][col];
      })
    )
      return false;

    positions.forEach((position: number[]): void => {
      const [row, col] = position;
      this.board[row][col] = ship;
    });

    this.ships.push({ name, ship, position: positions });

    return true;
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

  // #isEmpty(row: number, col: number): boolean {
  //   return this.board[row][col] ? false : true;
  // }

  #extrapolatePositions(
    startPosition: string,
    endPosition: string,
  ): Positions | undefined {
    const [startRow, startCol] = notationToPosition(startPosition);
    const [endRow, endCol] = notationToPosition(endPosition);

    let positions;

    if (
      Math.abs(endRow - startRow) === 0 &&
      Math.abs(endCol - startCol) !== 0
    ) {
      positions = Array.from(
        { length: endCol - startCol + 1 },
        (_: undefined, i: number): Position => {
          const minimumColumnValue: number = Math.min(startCol, endCol);
          return [startRow, minimumColumnValue + i];
        },
      );
    } else if (Math.abs(endCol - startCol) === 0) {
      positions = Array.from(
        { length: endRow - startRow + 1 },
        (_: undefined, i: number): Position => {
          const minimumRowValue: number = Math.min(startRow, endRow);
          return [minimumRowValue + i, startCol];
        },
      );
    } else {
      positions = undefined;
    }

    return positions;
  }

  #validateCoordinates(row: number, col: number): boolean {
    if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
      return true;
    }
    return false;
  }

  receiveAttack(position: string): ShipObject | boolean {
    const [row, col] = notationToPosition(position);
    if (!this.#validateCoordinates(row, col)) return false;

    if (this.#hasBeenAttacked(row, col)) return false;

    const shipPresent = this.board[row][col] !== undefined;

    this.attacks.push({ position: [row, col], hit: shipPresent });

    const shipObject = this.#getShip(row, col);

    if (shipObject) shipObject.ship.hit();

    return shipObject ? shipObject : true;
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
