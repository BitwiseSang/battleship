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
      (player.placeShip({
        ship,
        positions: [
          [0, 0],
          [0, 1],
        ],
      }),
        expect(player.isReady()).toBeFalsy());
    });
  });

  describe(".reset()", () => {
    test("resets the board to initial state", () => {
      const spy = vi.spyOn(board, "resetBoard");
      player.reset();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
