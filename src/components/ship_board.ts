export default function generateShipBoard(): HTMLDivElement {
  const shipBoard: HTMLDivElement = document.createElement("div");
  shipBoard.classList.add("ship-board");
  for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
      const cell: HTMLDivElement = document.createElement("div");
      cell.classList.add("ship-board__cell");
      cell.dataset.position = [rowIndex, columnIndex].join(",");

      shipBoard.append(cell);
    }
  }
  return shipBoard;
}
