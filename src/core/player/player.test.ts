import { vi, describe, test, expect, beforeEach } from "vitest";

import GameBoard from "../board/game_board.ts";
import Ship from "../ship/ship.ts";
import Player from "./player.ts";

let player: Player;
let board: GameBoard;

beforeEach(() => {
  board = new GameBoard();
  player = new Player(board);
});

const carrier: Ship = new Ship(5, "Carrier");
const battleship: Ship = new Ship(4, "Battleship");
const destroyer: Ship = new Ship(3, "Destroyer");
const submarine: Ship = new Ship(3, "Submarine");
const patrolShip: Ship = new Ship(2, "Patrol Ship");

const fleet = [carrier, battleship, destroyer, submarine, patrolShip];

describe("Initialization", () => {
  test("Accepts a board on initialization", () => {
    expect(player.board).toMatchObject(board);
  });

  test("Creates a fleet of ships", () => {
    expect(player.fleet).toMatchObject(fleet);
  });

  test("Creates player id", () => {
    expect(player.id).toBeDefined();
  });
});

describe("Instance methods", () => {
  describe(".placeShip()", () => {
    test("It places a ship at the desired position", () => {
      const ship = new Ship(2, "Patrol Ship");

      expect(
        player.placeShip({
          ship,
          positions: [
            [0, 0],
            [0, 1],
          ],
        }),
      ).toMatchObject({
        type: "placed",
      });

      expect(player.board).toMatchObject(board);
    });
  });

  describe(".receiveAttack()", () => {
    test("Registers a miss if a ship is absent", () => {
      expect(player.receiveAttack([0, 0])).toMatchObject({ type: "miss" });
    });

    test("Registers a hit if a ship is present in the frame", () => {
      const ship = new Ship(2, "Patrol Ship");
      const spy = vi.spyOn(ship, "hit");

      player.placeShip({
        ship,
        positions: [
          [0, 0],
          [0, 1],
        ],
      });

      expect(player.receiveAttack([0, 0])).toMatchObject({ type: "hit" });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(".hasLost()", () => {
    let ship;

    beforeEach(() => {
      ship = new Ship(2, "Patrol Ship");

      player.placeShip({
        ship,
        positions: [
          [0, 0],
          [0, 1],
        ],
      });
    });

    test("returns true if all ships are sunk", () => {
      expect(player.receiveAttack([0, 0])).toMatchObject({ type: "hit" });
      expect(player.receiveAttack([0, 1])).toMatchObject({ type: "hit" });

      expect(player.hasLost()).toBeTruthy();
    });

    test("returns false if all ships are not sunk", () => {
      expect(player.hasLost()).toBeFalsy();
    });
  });

  describe(".randomizeBoard()", () => {
    test("puts each ship in the fleet to a random position on the board", () => {
      const spy = vi.spyOn(board, "placeShipRandomly");

      player.randomizeBoard();
      expect(spy).toHaveBeenCalledTimes(5);
      expect(spy).toHaveReturnedWith({ type: "placed" });
    });
  });

  describe(".isReady()", () => {
    test("returns true if all the ships are placed on the board", () => {
      player.randomizeBoard();
      expect(player.isReady()).toBeTruthy();
    });

    test("returns true if all the ships are placed on the board", () => {
      const ship = new Ship(2, "Patrol Ship");
      player.placeShip({
        ship,
        positions: [
          [0, 0],
          [0, 1],
        ],
      });
      expect(player.isReady()).toBeFalsy();
    });
  });

  describe(".reset()", () => {
    test("resets the board to initial state", () => {
      const spy = vi.spyOn(board, "resetBoard");
      player.reset();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe(".randomAttack()", () => {
    let playerTwo: Player;
    let playerTwoBoard: GameBoard;

    beforeEach(() => {
      playerTwoBoard = new GameBoard();
      playerTwo = new Player(playerTwoBoard);
    });

    test("gives of a valid random attack", () => {
      const [row, col] = player.randomAttack(playerTwo);
      const isRowValid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(row);
      const isColValid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(col);

      expect(isRowValid && isColValid).toBeTruthy();
    });

    describe("Intelligent random attack", () => {
      test("returns neighboring coordinates if the last attack was an hit", () => {
        const ship = new Ship(2, "Patrol Ship");
        playerTwoBoard.placeShip({
          ship,
          positions: [
            [5, 5],
            [5, 6],
          ],
        });

        playerTwo.receiveAttack([5, 5]);

        const randomPosition = player.randomAttack(playerTwo);

        const isNeighboringAttack = [
          [4, 5],
          [5, 4],
          [5, 6],
          [6, 5],
        ].some((neighboringPosition) => {
          const [neighborRow, neighborCol] = neighboringPosition;
          const [row, col] = randomPosition;
          return neighborRow === row && neighborCol === col;
        });

        expect(isNeighboringAttack).toBeTruthy();
      });

      test("doesn't return an attacked position", () => {
        const ship = new Ship(2, "Patrol Ship");
        playerTwoBoard.placeShip({
          ship,
          positions: [
            [5, 5],
            [5, 6],
          ],
        });

        playerTwo.receiveAttack([4, 5]);
        playerTwo.receiveAttack([6, 5]);
        playerTwo.receiveAttack([5, 5]);

        const [row, col] = player.randomAttack(playerTwo);

        const isNeighboringAttack = [
          [5, 4],
          [5, 6],
        ].some((neighboringPosition) => {
          const [neighborRow, neighborCol] = neighboringPosition;
          return neighborRow === row && neighborCol === col;
        });

        const includesAttackedPositions: boolean = [
          [4, 5],
          [6, 5],
        ].some((attackedPosition) => {
          const [attackedRow, attackedCol] = attackedPosition;
          return attackedRow === row && attackedCol === col;
        });

        expect(isNeighboringAttack).toBeTruthy();
        expect(includesAttackedPositions).toBeFalsy();
      });
    });
  });
});
