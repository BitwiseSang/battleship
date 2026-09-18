import { describe, test, expect, beforeEach } from "vitest";

import GameBoard from "../board/game_board.ts";
import Ship from "../ship/ship.ts";
import Player from "./player.ts";

let player: Player;
let board: GameBoard;

beforeEach(() => {
  board = new GameBoard();
  player = new Player(board);
});

describe("Initialization", () => {
  test("Accepts a board on initialization", () => {
    expect(player.board).toMatchObject(board);
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

      player.placeShip({
        ship,
        positions: [
          [0, 0],
          [0, 1],
        ],
      });

      expect(player.receiveAttack([0, 0])).toMatchObject({ type: "hit" });
      expect(ship.hits).toEqual(1);
    });
  });
});
