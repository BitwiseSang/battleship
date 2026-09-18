import { beforeEach, describe, test, expect } from "vitest";

import Ship from "./ship.ts";

let newShip: Ship;
let length: number;

beforeEach(() => {
  length = 2;
  newShip = new Ship(length, "test");
});

describe("Initialization", () => {
  test("Initializes length to parameter passsed", () => {
    expect(newShip.length).toEqual(length);
  });

  test("Initializes hits to 0", () => {
    expect(newShip.hits).toEqual(0);
  });
});

describe("Ship Methods", () => {
  describe(".hit() method", () => {
    test("increments hits by 1", () => {
      newShip.hit();
      expect(newShip.hits).toEqual(1);
    });

    test("Doesn't increment hits past it's length", () => {
      newShip.hit();
      newShip.hit();
      newShip.hit();

      expect(newShip.hits).toBeLessThanOrEqual(2);
      expect(newShip.hits).toEqual(2);
    });
  });

  describe(".isSunk() method", () => {
    test("return false if hits is less than length", () => {
      newShip.hit();
      expect(newShip.isSunk()).toBeFalsy();
    });

    test("returns true if hits is equal to length", () => {
      newShip.hit();
      newShip.hit();

      expect(newShip.isSunk()).toBeTruthy();
    });
  });
});
