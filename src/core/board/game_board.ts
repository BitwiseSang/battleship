import type Ship from "../ship/ship.ts";
import type {
  Attacks,
  Attacked,
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

interface RandomPositionInfo {
  staticValue: number;
  dynamicValue: number;
  length: number;
  isRowStatic: boolean;
}

export default class GameBoard {
  #board: Board;
  ships: Ships;
  attacks: Attacks;
  readonly #attacked: Attacked;

  constructor() {
    this.#board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => undefined),
    );

    this.ships = [];
    this.attacks = [];
    this.#attacked = {};
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

  get attacked(): Attacked {
    return this.#attacked;
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
      positions.some((position: Position): boolean =>
        this.#hasBeenOccupiedWithBuffer(position[0], position[1]),
      )
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

    const sortedShipPositions: Positions = shipPositions.toSorted(
      (a: Position, b: Position) => {
        if (a[0] != b[0]) {
          return a[0] - b[0];
        }
        return a[1] - b[1];
      },
    );

    this.ships.push({ ship, position: sortedShipPositions });

    return { type: "placed" };
  }

  placeShipRandomly(ship: Ship): PlacementResult {
    let positions: Positions;
    const length: number = ship.length;

    while (
      positions === undefined ||
      positions.some((position) => {
        const [row, col] = position;
        return this.#hasBeenOccupiedWithBuffer(row, col);
      })
    ) {
      const [row, col] = this.#getRandomCoordinates();

      const isRowStatic: boolean = Boolean(Math.round(Math.random()));
      const staticValue: number = isRowStatic ? row : col;
      const dynamicValue: number = !isRowStatic ? row : col;

      positions = this.#getRandomPositions({
        staticValue,
        dynamicValue,
        length,
        isRowStatic,
      });
    }

    return this.placeShip({ ship, positions });
  }

  receiveAttack(position: Position): AttackResult {
    const [row, col] = position;

    if (!this.#validateCoordinates(row, col))
      return { type: "invalid", reason: "invalid-coordinates" };

    if (this.#hasBeenAttacked(row, col))
      return { type: "invalid", reason: "attacked" };

    const shipPresent = this.board[row][col] !== undefined;

    this.attacks.push({ position: [row, col], hit: shipPresent });

    this.#attacked[`${row}${col}`] = true;

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

  resetBoard(): void {
    this.#board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => undefined),
    );

    this.ships = [];
    this.attacks = [];
  }

  hasValidFleet(): boolean {
    const allShipsHaveValidNames = this.ships.every((shipInfo) =>
      [
        "Destroyer",
        "Submarine",
        "Patrol Ship",
        "Carrier",
        "Battleship",
      ].includes(shipInfo.ship.name),
    );
    const allShipsHaveValidLength = this.ships.every((shipInfo) =>
      [5, 4, 3, 2].includes(shipInfo.ship.length),
    );
    const hasTwoShipsOfLengthThree =
      this.ships.filter((shipInfo) => shipInfo.ship.length === 3).length === 2;
    const hasFourUniqueLengthValues =
      new Set(this.ships.map((shipInfo) => shipInfo.ship.length)).size === 4;

    return (
      this.ships.length === 5 &&
      allShipsHaveValidNames &&
      allShipsHaveValidLength &&
      hasTwoShipsOfLengthThree &&
      hasFourUniqueLengthValues
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
    return this.#attacked[`${row}${col}`] === true;
  }

  #validateCoordinates(row: number, col: number): boolean {
    if (row >= 0 && row <= 9 && col >= 0 && col <= 9) {
      return true;
    }

    return false;
  }

  #hasBeenOccupied(row: number, col: number): boolean {
    return this.#board[row][col] !== undefined;
  }

  #hasBeenOccupiedWithBuffer(row: number, col: number): boolean {
    const buffer: number = 1;
    const possiblePositions = [
      [row, col],
      [row + buffer, col + buffer],
      [row - buffer, col - buffer],
      [row + buffer, col - buffer],
      [row - buffer, col + buffer],
      [row + buffer, col],
      [row - buffer, col],
      [row, col + buffer],
      [row, col - buffer],
    ];
    const validPositions = possiblePositions.filter((position) =>
      this.#validateCoordinates(position[0], position[1]),
    );

    return validPositions.some((position) =>
      this.#hasBeenOccupied(position[0], position[1]),
    );
  }

  #getRandomPositions({
    staticValue,
    dynamicValue,
    length,
    isRowStatic,
  }: RandomPositionInfo): Positions {
    const max = 9;
    const positions: Positions = [];
    let increment: number = dynamicValue + length > max ? -1 : 1;

    for (let i = 0; i < length; i++) {
      const row = isRowStatic ? staticValue : dynamicValue;
      const col = isRowStatic ? dynamicValue : staticValue;

      positions.push([row, col]);
      dynamicValue += increment;
    }

    return positions;
  }

  generateNeighboringPosition(position: Position): Positions {
    const [row, col] = position;

    const possiblePositions: Positions = [
      [row, col - 1],
      [row, col + 1],
      [row + 1, col],
      [row - 1, col],
    ];

    const possibleValidPositions = possiblePositions
      // Check if the coordinates are in range
      .filter((pos: Position): boolean =>
        this.#validateCoordinates(pos[0], pos[1]),
      )
      // Check if the coordinates have not been attacked
      .filter(
        (pos: Position): boolean => !this.#hasBeenAttacked(pos[0], pos[1]),
      )
      .map((pos: Position): Position => [pos[0], pos[1]]);

    return possibleValidPositions;
  }

  #getRandomCoordinates(): Position {
    const max = 9;
    const row = Math.floor(Math.random() * max);
    const col = Math.floor(Math.random() * max);
    return [row, col];
  }
}
