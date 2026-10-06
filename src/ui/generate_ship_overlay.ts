import generateShipBoard from "../components/ship_board";
import type Player from "../core/player/player";

export default function generateShipOverlay(player: Player): HTMLDivElement {
  const shipBoard = generateShipBoard();

  if (player.board.ships.length > 1) {
    player.board.ships.forEach((ship) => {
      const shipPositions = ship.position;

      shipPositions.forEach((position, positionIndex) => {
        const isVert = shipPositions[0][1] === shipPositions[1][1];

        const htmlElement = shipBoard.querySelector(
          `[data-position="${position.join(",")}"]`,
        );
        const shipElement: HTMLDivElement = document.createElement("div");
        shipElement.classList.add("ship-board__cell__ship");

        let className: string;

        if (positionIndex === 0) {
          className = isVert
            ? "ship-board__cell__ship-vertical-start"
            : "ship-board__cell__ship-horizontal-start";
        } else if (positionIndex === shipPositions.length - 1) {
          className = isVert
            ? "ship-board__cell__ship-vertical-end"
            : "ship-board__cell__ship-horizontal-end";
        } else {
          className = isVert
            ? "ship-board__cell__ship-vertical-middle"
            : "ship-board__cell__ship-horizontal-middle";
        }
        shipElement.classList.add(className);

        htmlElement?.append(shipElement);
      });
    });
  }

  return shipBoard;
}
