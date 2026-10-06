import { beforeEach, describe, test, expect, vi } from "vitest";

import GameBoard from "../board/game_board.ts";
import Player from "../player/player.ts";
import Game from "./game.ts";

let playerOne: Player, playerTwo: Player, game: Game;

beforeEach(() => {
  playerOne = new Player(new GameBoard());
  playerTwo = new Player(new GameBoard());
  game = new Game(playerOne, playerTwo);
});

describe("Game", () => {
  describe("constructor", () => {
    test("accepts two players", () => {
      expect(game.players).toMatchObject([playerOne, playerTwo]);
    });

    test("sets the first player as the current player", () => {
      expect(game.currentPlayer).toMatchObject(playerOne);
    });

    test("initializes the game in its initial state", () => {
      expect(game.state).toEqual(0);
    });
  });

  describe("Instance methods", () => {
    describe(".startGame()", () => {
      test("starts when both players are ready", () => {
        playerOne.randomizeBoard();
        playerTwo.randomizeBoard();

        expect(game.startGame()).toBeTruthy();
      });

      test("doesn't start if any of the players are not ready", () => {
        playerOne.randomizeBoard();

        expect(game.startGame()).toBeFalsy();
      });

      test("changes the current state to active if both players are ready", () => {
        playerOne.randomizeBoard();
        playerTwo.randomizeBoard();

        expect(game.startGame()).toBeTruthy();
        expect(game.state).toEqual(1);
      });
    });

    describe(".resetGame()", () => {
      test("resets the game if game has started", () => {
        playerOne.randomizeBoard();
        playerTwo.randomizeBoard();

        game.startGame();
        expect(game.resetGame()).toBeTruthy();
      });

      test("doesn't reset the game if it hasn't started", () => {
        expect(game.resetGame()).toBeFalsy();
      });

      test("resets game state to 0", () => {
        game.randomizeAll();
        game.startGame();

        game.resetGame();
        expect(game.state).toEqual(0);
      });

      test("resets currentPlayer to player one", () => {
        game.randomizeAll();
        game.startGame();
        game.nextRound();

        game.resetGame();
        expect(game.currentPlayer).toEqual(playerOne);
      });

      test("sets winner to the current player", () => {
        game.randomizeAll();
        game.startGame();

        const spy = vi.spyOn(playerTwo, "hasLost");
        spy.mockReturnValue(true);

        game.placeAttack([0, 0]);

        expect(game.winner).toEqual(playerOne);
      });

      test("resets winner to undefined", () => {
        game.randomizeAll();
        game.startGame();
        game.nextRound();

        const spy = vi.spyOn(playerTwo, "hasLost");
        spy.mockReturnValue(true);

        game.placeAttack([0, 0]);

        game.resetGame();

        expect(game.winner).toBeUndefined();
      });
    });

    describe(".randomizeAll()", () => {
      test("randomizes ship placement for both players", () => {
        game.randomizeAll();
        expect(playerOne.isReady()).toBeTruthy();
        expect(playerTwo.isReady()).toBeTruthy();
      });

      test("can start the game after randomizing ship placement", () => {
        game.randomizeAll();
        expect(game.startGame()).toBeTruthy();
      });
    });

    describe(".placeAttack()", () => {
      test("attacks the opponent if you provide a position", () => {
        expect(game.placeAttack([0, 0])).toMatchObject({ type: "miss" });
      });
    });

    describe(".hasWonGame()", () => {
      test("returns false if the game has not started", () => {
        expect(game.hasWonGame()).toBeFalsy();
      });

      test("returns true if all the opponents ships have sunk", () => {
        game.randomizeAll();
        game.startGame();

        const spy = vi.spyOn(playerTwo, "hasLost");
        spy.mockReturnValue(true);
        expect(game.hasWonGame()).toBeTruthy();
      });

      test("returns false if all opponents ships have not sunk", () => {
        game.randomizeAll();
        game.startGame();

        const spy = vi.spyOn(playerTwo, "hasLost");
        spy.mockReturnValue(false);
        expect(game.hasWonGame()).toBeFalsy();
      });
    });

    describe(".nextRound()", () => {
      test("changes the current player to the other player", () => {
        game.randomizeAll();
        game.startGame();
        game.nextRound();
        expect(game.currentPlayer).toEqual(playerTwo);
      });

      test("does not work if the game has not started", () => {
        game.randomizeAll();

        game.nextRound();
        expect(game.currentPlayer).toEqual(playerOne);
      });

      test("does not work if the game has ended", () => {
        const spy = vi.spyOn(game, "hasWonGame");
        spy.mockReturnValue(true);

        game.randomizeAll();
        game.startGame();

        game.nextRound();
        expect(game.currentPlayer).toEqual(playerOne);
      });
    });
  });
});
