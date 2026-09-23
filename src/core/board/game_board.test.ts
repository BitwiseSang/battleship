import { beforeEach, describe, test, expect } from "vitest";

import { extrapolatePositions } from "../../utils/extrapolate-positions.ts";
import notationToPosition from "../../utils/notation-converter.ts";
import Ship from "../ship/ship.ts";
import GameBoard from "./game_board.ts";
import type { Attack, Positions, ShipInformation } from "./types.ts";

let gameBoard: GameBoard;

function fillEntireBoard(): void {
  const carrier: Ship = new Ship(5, "Carrier");
  const battleship: Ship = new Ship(4, "Battleship");
  const destroyer: Ship = new Ship(3, "Destroyer");
  const submarine: Ship = new Ship(3, "Submarine");
  const patrolShip: Ship = new Ship(2, "Patrol Ship");

  [
    { ship: carrier, start: "A6", end: "A10" },
    { ship: battleship, start: "C1", end: "F1" },
    { ship: destroyer, start: "C6", end: "C8" },
    { ship: submarine, start: "A4", end: "C4" },
    { ship: patrolShip, start: "A1", end: "A2" },
  ].forEach((ship) =>
    gameBoard.placeShip({
      ship: ship.ship,
      positions: extrapolatePositions(
        notationToPosition(ship.start),
        notationToPosition(ship.end),
      ),
    }),
  );
}

beforeEach(() => {
  gameBoard = new GameBoard();
});

describe("Initialization", () => {
  test("Creates an empty  grid array", () => {
    expect(gameBoard.board).toMatchObject(
      Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => undefined),
      ),
    );
  });

  test("Creates an empty ship array of objects", () => {
    expect(gameBoard.ships).toMatchObject([]);
  });

  test("Creates an empty attacks array", () => {
    expect(gameBoard.attacks).toMatchObject([]);
  });
});

describe("Instance methods", () => {
  describe(".placeShip() method", () => {
    let ship: Ship;
    let shipData: ShipInformation;

    beforeEach(() => {
      ship = new Ship(2, "Patrol Boat");
      shipData = {
        ship,
        positions: extrapolatePositions(
          notationToPosition("A1"),
          notationToPosition("A2"),
        ),
      };
    });

    test("Places a ship at A1 position", () => {
      expect(gameBoard.placeShip(shipData)).toMatchObject({ type: "placed" });

      expect(gameBoard.board[0][0]).toMatchObject(ship);
      expect(gameBoard.board[0][1]).toMatchObject(ship);
    });

    test("Cannot place a ship if the position is occupied", () => {
      expect(gameBoard.placeShip(shipData)).toMatchObject({
        type: "placed",
      });

      expect(gameBoard.placeShip(shipData)).toMatchObject({
        type: "invalid",
        reason: "occupied",
      });
    });

    test("Cannot place ships on diagonals", () => {
      expect(
        gameBoard.placeShip({
          ship,
          positions: extrapolatePositions(
            notationToPosition("A1"),
            notationToPosition("B2"),
          ),
        }),
      ).toMatchObject({
        type: "invalid",
        reason: "diagonal",
      });

      expect(gameBoard.board[0][0]).toBeUndefined();
      expect(gameBoard.board[1][1]).toBeUndefined();
    });

    test("Cannot place ship if the positions exceed ship length", () => {
      expect(
        gameBoard.placeShip({
          ship,
          positions: extrapolatePositions(
            notationToPosition("A1"),
            notationToPosition("A3"),
          ),
        }),
      ).toMatchObject({
        type: "invalid",
        reason: "wrong-length",
        expected: 2,
        actual: 3,
      });

      expect(gameBoard.board[0][0]).toBeUndefined();
      expect(gameBoard.board[0][1]).toBeUndefined();
      expect(gameBoard.board[0][3]).toBeUndefined();
    });

    test("Cannot place ship if the positions are less than ship length", () => {
      ship = new Ship(3, "Submarine");

      expect(
        gameBoard.placeShip({
          ship,
          positions: extrapolatePositions(
            notationToPosition("A1"),
            notationToPosition("A2"),
          ),
        }),
      ).toMatchObject({
        type: "invalid",
        reason: "wrong-length",
        expected: 3,
        actual: 2,
      });

      expect(gameBoard.board[0][0]).toBeUndefined();
      expect(gameBoard.board[0][1]).toBeUndefined();
    });

    test("Providing out of bounds coordinates returns out of bounds placement result", () => {
      expect(
        gameBoard.placeShip({
          ship,

          positions: extrapolatePositions(
            notationToPosition("A1"),
            notationToPosition("X1"),
          ),
        }),
      ).toMatchObject({
        type: "invalid",
        reason: "out-of-bounds",
      });
    });
  });

  describe(".receiveAttack() method", () => {
    beforeEach(() => {
      fillEntireBoard();
    });

    test("Records the attack in the attacks array", () => {
      expect(gameBoard.receiveAttack(notationToPosition("A3"))).toBeTruthy();
      expect(gameBoard.attacks).toHaveLength(1);
    });

    test("Records a hit if there is a ship in the cell", () => {
      expect(gameBoard.receiveAttack(notationToPosition("A1"))).toBeTruthy();
      const attack: Attack = gameBoard.attacks.pop()!;

      expect(attack.hit).toBeTruthy();
    });

    test("Records a miss if no ship is present in the cell", () => {
      expect(gameBoard.receiveAttack(notationToPosition("B1"))).toBeTruthy();
      const attack: Attack = gameBoard.attacks.pop()!;

      expect(attack.hit).toBeFalsy();
    });

    test("Successfully increments the hits counter on the ship object for each hit", () => {
      const result = gameBoard.receiveAttack(notationToPosition("C1"));

      expect(result).toEqual({
        type: "hit",
        ship: expect.any(Ship),
      });

      if (result.type === "hit") {
        expect(result.ship.hits).toEqual(1);
      }
    });

    test("Doesn't attack the same cell twice", () => {
      expect(gameBoard.receiveAttack(notationToPosition("C1"))).toBeTruthy();
      expect(gameBoard.receiveAttack(notationToPosition("C1"))).toMatchObject({
        type: "invalid",
        reason: "attacked",
      });
    });

    test("Returns error message object if you provide incorrect notation", () => {
      expect(gameBoard.receiveAttack(notationToPosition("ZX"))).toMatchObject({
        type: "invalid",
        reason: "invalid-coordinates",
      });
    });
  });

  describe(".hits() and .misses() getter methods", () => {
    beforeEach(() => {
      const ship = new Ship(2, "Patrol Ship");
      gameBoard.placeShip({
        ship,
        positions: extrapolatePositions(
          notationToPosition("A1"),
          notationToPosition("A2"),
        ),
      });
    });

    test(".hits() returns only the hits, if present", () => {
      gameBoard.receiveAttack(notationToPosition("A1"));
      const currentHits: Positions = gameBoard.hits;

      expect(currentHits).toHaveLength(1);
    });

    test(".hits() returns an empty array if there are no misses", () => {
      gameBoard.receiveAttack(notationToPosition("B1"));
      gameBoard.receiveAttack(notationToPosition("B2"));

      const currentHits: Positions = gameBoard.hits;

      expect(currentHits).toMatchObject([]);
    });

    test(".misses() returns only the misses", () => {
      gameBoard.receiveAttack(notationToPosition("C1"));
      const currentMisses: Positions = gameBoard.misses;

      expect(currentMisses).toHaveLength(1);
    });

    test(".misses() returns an empty array if there are no misses", () => {
      gameBoard.receiveAttack(notationToPosition("A1"));
      gameBoard.receiveAttack(notationToPosition("A2"));
      const currentMisses: Positions = gameBoard.misses;

      expect(currentMisses).toMatchObject([]);
    });
  });

  describe(".allShipsSunk() method", () => {
    beforeEach(() => {
      fillEntireBoard();
    });

    test("Return false if none of the ships are sunk", () => {
      expect(gameBoard.allShipsSunk()).toBeFalsy();
    });

    test("Returns false if some of the ships are sunk", () => {
      const attacks: string[] = [
        "c1",
        "d1",
        "e1",
        "f1",
        "c6",
        "c7",
        "c8",
        "a4",
        "b4",
        "c4",
        "a1",
        "a2",
      ];
      attacks.forEach((attack) =>
        gameBoard.receiveAttack(notationToPosition(attack)),
      );

      expect(gameBoard.allShipsSunk()).toBeFalsy();
    });

    test("Returns true if all ships are sunk", () => {
      const attacks: string[] = [
        "a6",
        "a7",
        "a8",
        "a9",
        "a10",
        "c1",
        "d1",
        "e1",
        "f1",
        "c6",
        "c7",
        "c8",
        "a4",
        "b4",
        "c4",
        "a1",
        "a2",
      ];
      attacks.forEach((attack) =>
        gameBoard.receiveAttack(notationToPosition(attack)),
      );

      expect(gameBoard.allShipsSunk()).toBeTruthy();
    });
  });

  describe(".placeShipRandomly() method", () => {
    test("Places one ship on a random location", () => {
      const ship = new Ship(2, "Patrol Ship");
      expect(gameBoard.placeShipRandomly(ship)).toMatchObject({
        type: "placed",
      });

      expect(gameBoard.ships).toHaveLength(1);
    });

    test("Can place a fleet of ships randomly", () => {
      const carrier: Ship = new Ship(5, "Carrier");
      const battleship: Ship = new Ship(4, "Battleship");
      const destroyer: Ship = new Ship(3, "Destroyer");
      const submarine: Ship = new Ship(3, "Submarine");
      const patrolShip: Ship = new Ship(2, "Patrol Ship");

      [carrier, battleship, destroyer, submarine, patrolShip].forEach(
        (ship) => {
          expect(gameBoard.placeShipRandomly(ship)).toMatchObject({
            type: "placed",
          });
        },
      );

      expect(gameBoard.ships).toHaveLength(5);
    });
  });

  // This method goes through the ships and board to check if all required ships exist to start the game and whether all the ships are placed correctly.
  describe(".hasValidFleet() method", () => {
    test("returns true if you place 5 valid ships", () => {
      fillEntireBoard();
      expect(gameBoard.hasValidFleet()).toBeTruthy();
    });

    test("returns false if you place less than 5 ships", () => {
      const carrier: Ship = new Ship(5, "Carrier");
      const battleship: Ship = new Ship(4, "Battleship");
      gameBoard.placeShip({
        ship: carrier,
        positions: extrapolatePositions([0, 0], [0, 4]),
      });
      gameBoard.placeShip({
        ship: battleship,
        positions: extrapolatePositions([1, 1], [1, 4]),
      });

      expect(gameBoard.hasValidFleet()).toBeFalsy();
    });

    test("returns false if you place 5 invalid ships", () => {
      const carrier: Ship = new Ship(5, "Carrier");
      const battleship: Ship = new Ship(4, "craft");
      const destroyer: Ship = new Ship(3, "ex");
      const submarine: Ship = new Ship(3, "pr");
      const patrolShip: Ship = new Ship(2, "csdf");

      [
        { ship: carrier, start: "A6", end: "A10" },
        { ship: battleship, start: "C1", end: "F1" },
        { ship: destroyer, start: "C6", end: "C8" },
        { ship: submarine, start: "A4", end: "C4" },
        { ship: patrolShip, start: "A1", end: "A2" },
      ].forEach((ship) =>
        gameBoard.placeShip({
          ship: ship.ship,
          positions: extrapolatePositions(
            notationToPosition(ship.start),
            notationToPosition(ship.end),
          ),
        }),
      );

      expect(gameBoard.hasValidFleet()).toBeFalsy();
    });
  });

  describe(".resetBoard() method", () => {
    beforeEach(() => {
      fillEntireBoard();
    });

    test("it removes all ships", () => {
      gameBoard.resetBoard();
      expect(gameBoard.ships).toHaveLength(0);
    });

    test("it resets all attacks", () => {
      expect(gameBoard.receiveAttack(notationToPosition("A3"))).toBeTruthy();
      expect(gameBoard.attacks).toHaveLength(1);

      gameBoard.resetBoard();
      expect(gameBoard.attacks).toHaveLength(0);
    });

    test("it resets the board to initial state", () => {
      gameBoard.resetBoard();
      const allUndefined: boolean = gameBoard.board.every((row) =>
        row.every((cell) => cell === undefined),
      );
      expect(allUndefined).toBeTruthy();
    });
  });
});
