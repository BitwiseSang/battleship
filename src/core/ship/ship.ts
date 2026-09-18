export default class Ship {
  #length: number;
  #hits: number;
  #name: string;

  constructor(length: number, name: string) {
    this.#length = length;
    this.#name = name;
    this.#hits = 0;
  }

  hit(): void {
    if (this.#hits < this.#length) this.#hits += 1;
  }

  isSunk(): boolean {
    return this.#hits === this.#length;
  }

  get length(): number {
    return this.#length;
  }

  get name(): string {
    return this.#name;
  }

  get hits(): number {
    return this.#hits;
  }
}
