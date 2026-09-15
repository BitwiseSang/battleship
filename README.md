# BATTLESHIP

This is a classic game where two opponents play against each other with the aim
to sink all your opponent ships before they sink yours.

Each player in Battleship has a battleship box, each of which contains two
grids: Target Grid and Ocean Grid. Each player secretly arranges their 5 ships
on the Ocean Grid. The rules for arranging ships on the Ocean grid as as
follows:

- All ships should be arranged either vertically or horizontally.
- No diagonal ship arrangement is allowed.
- Ships should not overlap each other.

There are also 5 types of ships available to each player:

|     | Name        | Size |
| --- | ----------- | ---- |
| 1   | Carrier     | 5    |
| 2   | Battleship  | 4    |
| 3   | Destroyer   | 3    |
| 4   | Submarine   | 3    |
| 5   | Patrol Boat | 2    |

The size in the above table dictates how many squares in the grid each ship takes.

The game grid is as follows:

![Battleship Grid Image](https://cdn.madisonpaper.com/images/large/printable-battleship-game.png)

To identify a specific cell, you need to use a row-column pair to name
individual cells, for example `A1` denotes the top left cell.

## Gameplay

After the ships have been positioned, the game proceeds in a series of rounds.
In each round, each player takes a turn to announce a target square in the
opponent's grid which is to be shot at. The opponent announces whether or not
the square is occupied by a ship. If it is a "hit", the player who is hit marks
this on their own "ocean" or grid (with a red peg in the pegboard version), and
announces what ship was hit. The attacking player marks the hit or miss on their
own "tracking" or "target" grid with a pencil marking in the paper version of
the game, or the appropriate color peg in the pegboard version (red for "hit",
white for "miss"), in order to build up a picture of the opponent's fleet.

When all of the squares of a ship have been hit, the ship's owner announces the
sinking of the Carrier, Submarine, Cruiser/Destroyer/Patrol Boat, or the titular
Battleship. If all of a player's ships have been sunk, the game is over and
their opponent wins
