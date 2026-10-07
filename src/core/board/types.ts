import type { Ship } from "../ship/types.ts";

export type Board = Array<Array<Ship | undefined>>;
export type ReadOnlyBoard = readonly (readonly (Ship | undefined)[])[];

export type ShipObject = {
  ship: Ship;
  position: readonly Position[];
};

export type Position = readonly [number, number];

export type Positions = Array<Position> | undefined;

export type Attack = {
  readonly position: Position;
  readonly hit: boolean;
};

export type Ships = Array<ShipObject>;
export type ReadOnlyShips = readonly ShipObject[];

export type Attacks = Attack[];

export type ShipInformation = {
  positions: Positions;
  ship: Ship;
};

export type AttackResult =
  | {
      type: "invalid";
      reason: "invalid-coordinates" | "attacked";
    }
  | {
      type: "hit";
      ship: Ship;
    }
  | {
      type: "miss";
    };

export type PlacementResult =
  | {
      type: "placed";
    }
  | {
      type: "invalid";
      reason: "diagonal" | "out-of-bounds" | "occupied";
    }
  | {
      type: "invalid";
      reason: "wrong-length";
      expected: number;
      actual: number;
    };

export type Attacked = {
  [key: `${number}${number}`]: boolean;
};
