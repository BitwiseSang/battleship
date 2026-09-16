export default class Ship {
  length: number;
  hits: number;

  constructor(length: number) {
    this.length = length;
    this.hits = 0;
  }

  hit(): void {
    if (this.hits < this.length) this.hits += 1;
  }

  isSunk(): boolean {
    return this.hits === this.length ? true : false;
  }
}
