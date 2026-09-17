import { beforeEach, describe, test, expect } from "vitest";
import GameBoard from "./game_board.ts";
import Ship from "../ship/ship.ts";

import type { Attack, ShipObject, Positions } from "./types.ts";

let gameBoard: GameBoard;

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

    beforeEach(() => {
      ship = new Ship(2);
    });

    test("Places a ship at A1 position", () => {
      expect(
        gameBoard.placeShip({
          ship,
          name: "Patrol Boat",
          startPosition: "A1",
          endPosition: "A2",
        }),
      ).toBeTruthy();
      expect(gameBoard.board[0][0]).toMatchObject(ship);
      expect(gameBoard.board[0][1]).toMatchObject(ship);
    });

    test("Cannot place a ship if the position is occupied", () => {
      expect(
        gameBoard.placeShip({
          ship,
          name: "Patrol Boat",
          startPosition: "A1",
          endPosition: "A2",
        }),
      ).toBeTruthy();

      expect(
        gameBoard.placeShip({
          ship,
          name: "Patrol Boat",
          startPosition: "A1",
          endPosition: "A2",
        }),
      ).toBeFalsy();
    });

    test("Cannot place ships on diagonals", () => {
      expect(
        gameBoard.placeShip({
          ship,
          name: "Patrol Boat",
          startPosition: "A1",
          endPosition: "B2",
        }),
      ).toBeFalsy();

      expect(gameBoard.board[0][0]).toBeUndefined();
      expect(gameBoard.board[1][1]).toBeUndefined();
    });

    test("Cannot place ship if the positions exceed ship length", () => {
      expect(
        gameBoard.placeShip({
          ship,
          name: "Patrol Boat",
          startPosition: "A1",
          endPosition: "A3",
        }),
      ).toBeFalsy();

      expect(gameBoard.board[0][0]).toBeUndefined();
      expect(gameBoard.board[0][1]).toBeUndefined();
      expect(gameBoard.board[0][3]).toBeUndefined();
    });

    test("Cannot place ship if the positions are less than ship length", () => {
      ship = new Ship(3);

      expect(
        gameBoard.placeShip({
          ship,
          name: "Destroyer",
          startPosition: "A1",
          endPosition: "A2",
        }),
      ).toBeFalsy();

      expect(gameBoard.board[0][0]).toBeUndefined();
      expect(gameBoard.board[0][1]).toBeUndefined();
    });

    test("Providing invalid coordinate notation (Xt -> PM) doesn't break the game", () => {
      expect(
        gameBoard.placeShip({
          ship,
          name: "Destroyer",
          startPosition: "Xt",
          endPosition: "PM",
        }),
      ).toBeFalsy();
    });
  });

  describe(".receiveAttack() method", () => {
    beforeEach(() => {
      const carrier: Ship = new Ship(5);
      const battleship: Ship = new Ship(4);
      const destroyer: Ship = new Ship(3);
      const submarine: Ship = new Ship(3);
      const patrolShip: Ship = new Ship(2);

      [
        { ship: carrier, name: "carrier", start: "A6", end: "A10" },
        { ship: battleship, name: "battleship", start: "C1", end: "F1" },
        { ship: destroyer, name: "destroyer", start: "C6", end: "C8" },
        { ship: submarine, name: "submarine", start: "A4", end: "C4" },
        { ship: patrolShip, name: "patrol ship", start: "A1", end: "A2" },
      ].forEach((ship) =>
        gameBoard.placeShip({
          name: ship.name,
          startPosition: ship.start,
          endPosition: ship.end,
          ship: ship.ship,
        }),
      );
    });

    test("Records the attack in the attacks array", () => {
      expect(gameBoard.receiveAttack("A3")).toBeTruthy();
      expect(gameBoard.attacks).toHaveLength(1);
    });

    test("Records a hit if there is a ship in the cell", () => {
      expect(gameBoard.receiveAttack("A1")).toBeTruthy();
      const attack: Attack = gameBoard.attacks.pop()!;

      expect(attack.hit).toBeTruthy();
    });

    test("Records a miss if no ship is present in the cell", () => {
      expect(gameBoard.receiveAttack("B1")).toBeTruthy();
      const attack: Attack = gameBoard.attacks.pop()!;

      expect(attack.hit).toBeFalsy();
    });

    test("Successfully increments the hits counter on the ship object for each hit", () => {
      const shipObject = gameBoard.receiveAttack("C1") as ShipObject;
      expect(shipObject.ship.hits).toEqual(1);
    });

    test("Doesn't attack the same cell twice", () => {
      expect(gameBoard.receiveAttack("C1")).toBeTruthy();
      expect(gameBoard.receiveAttack("C1")).toBeFalsy();
    });

    test("Returns false if you provide incorrect notation", () => {
      expect(gameBoard.receiveAttack("ZX")).toBeFalsy();
    });
  });

  describe(".hits() and .misses() getter methods", () => {
    beforeEach(() => {
      const ship = new Ship(2);
      gameBoard.placeShip({
        ship,
        name: "Patrol Ship",
        startPosition: "A1",
        endPosition: "A2",
      });
    });

    test(".hits() returns only the hits, if present", () => {
      gameBoard.receiveAttack("A1");
      const currentHits: Positions = gameBoard.hits;

      expect(currentHits).toHaveLength(1);
    });

    test(".hits() returns an empty array if there are no misses", () => {
      gameBoard.receiveAttack("B1");
      gameBoard.receiveAttack("B2");

      const currentHits: Positions = gameBoard.hits;

      expect(currentHits).toMatchObject([]);
    });

    test(".misses() returns only the misses", () => {
      gameBoard.receiveAttack("C1");
      const currentMisses: Positions = gameBoard.misses;

      expect(currentMisses).toHaveLength(1);
    });

    test(".misses() returns an empty array if there are no misses", () => {
      gameBoard.receiveAttack("A1");
      gameBoard.receiveAttack("A2");
      const currentMisses: Positions = gameBoard.misses;

      expect(currentMisses).toMatchObject([]);
    });
  });

  describe(".allShipsSunk() method", () => {
    beforeEach(() => {
      const carrier: Ship = new Ship(5);
      const battleship: Ship = new Ship(4);
      const destroyer: Ship = new Ship(3);
      const submarine: Ship = new Ship(3);
      const patrolShip: Ship = new Ship(2);

      [
        { ship: carrier, name: "carrier", start: "A6", end: "A10" },
        { ship: battleship, name: "battleship", start: "C1", end: "F1" },
        { ship: destroyer, name: "destroyer", start: "C6", end: "C8" },
        { ship: submarine, name: "submarine", start: "A4", end: "C4" },
        { ship: patrolShip, name: "patrol ship", start: "A1", end: "A2" },
      ].forEach((ship) =>
        gameBoard.placeShip({
          name: ship.name,
          startPosition: ship.start,
          endPosition: ship.end,
          ship: ship.ship,
        }),
      );
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
      attacks.forEach((attack) => gameBoard.receiveAttack(attack));

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
      attacks.forEach((attack) => gameBoard.receiveAttack(attack));

      expect(gameBoard.allShipsSunk()).toBeTruthy();
    });
  });
});
