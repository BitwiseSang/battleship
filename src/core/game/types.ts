import type { Ship } from "../ship/types.ts";

export type Board = Array<Array<Ship | undefined>>;

export type ShipObject = {
  ship: Ship;
  name: string;
  position: number[][];
};

export type Position = Array<number>;

export type Positions = Array<Position> | undefined;

export type Attack = {
  position: Position;
  hit: boolean;
};

export type Ships = Array<ShipObject>;

export type Attacks = Array<Attack>;

export type ShipInformation = {
  name: string;
  startPosition: string;
  endPosition: string;
  ship: Ship;
};
