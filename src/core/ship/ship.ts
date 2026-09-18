export default class Ship {
  readonly length: number;
  hits: number;
  readonly name: string;

  constructor(length: number, name: string) {
    this.length = length;
    this.name = name;
    this.hits = 0;
  }

  hit(): void {
    if (this.hits < this.length) this.hits += 1;
  }

  isSunk(): boolean {
    return this.hits === this.length;
  }
}
