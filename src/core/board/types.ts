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
  "00"?: boolean;
  "01"?: boolean;
  "02"?: boolean;
  "03"?: boolean;
  "04"?: boolean;
  "05"?: boolean;
  "06"?: boolean;
  "07"?: boolean;
  "08"?: boolean;
  "09"?: boolean;
  "10"?: boolean;
  "11"?: boolean;
  "12"?: boolean;
  "13"?: boolean;
  "14"?: boolean;
  "15"?: boolean;
  "16"?: boolean;
  "17"?: boolean;
  "18"?: boolean;
  "19"?: boolean;
  "20"?: boolean;
  "21"?: boolean;
  "22"?: boolean;
  "23"?: boolean;
  "24"?: boolean;
  "25"?: boolean;
  "26"?: boolean;
  "27"?: boolean;
  "28"?: boolean;
  "29"?: boolean;
  "30"?: boolean;
  "31"?: boolean;
  "32"?: boolean;
  "33"?: boolean;
  "34"?: boolean;
  "35"?: boolean;
  "36"?: boolean;
  "37"?: boolean;
  "38"?: boolean;
  "39"?: boolean;
  "40"?: boolean;
  "41"?: boolean;
  "42"?: boolean;
  "43"?: boolean;
  "44"?: boolean;
  "45"?: boolean;
  "46"?: boolean;
  "47"?: boolean;
  "48"?: boolean;
  "49"?: boolean;
  "50"?: boolean;
  "51"?: boolean;
  "52"?: boolean;
  "53"?: boolean;
  "54"?: boolean;
  "55"?: boolean;
  "56"?: boolean;
  "57"?: boolean;
  "58"?: boolean;
  "59"?: boolean;
  "60"?: boolean;
  "61"?: boolean;
  "62"?: boolean;
  "63"?: boolean;
  "64"?: boolean;
  "65"?: boolean;
  "66"?: boolean;
  "67"?: boolean;
  "68"?: boolean;
  "69"?: boolean;
  "70"?: boolean;
  "71"?: boolean;
  "72"?: boolean;
  "73"?: boolean;
  "74"?: boolean;
  "75"?: boolean;
  "76"?: boolean;
  "77"?: boolean;
  "78"?: boolean;
  "79"?: boolean;
  "80"?: boolean;
  "81"?: boolean;
  "82"?: boolean;
  "83"?: boolean;
  "84"?: boolean;
  "85"?: boolean;
  "86"?: boolean;
  "87"?: boolean;
  "88"?: boolean;
  "89"?: boolean;
  "90"?: boolean;
  "91"?: boolean;
  "92"?: boolean;
  "93"?: boolean;
  "94"?: boolean;
  "95"?: boolean;
  "96"?: boolean;
  "97"?: boolean;
  "98"?: boolean;
  "99"?: boolean;
};
