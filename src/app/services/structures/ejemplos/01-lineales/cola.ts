// Cola: el primer elemento que entra es el primero que sale (FIFO).
export class Cola<T> {
  private values: T[] = [];

  enqueue(value: T): void {
    this.values.push(value);
  }

  dequeue(): T | undefined {
    return this.values.shift();
  }

  peek(): T | undefined {
    return this.values[0];
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }

  size(): number {
    return this.values.length;
  }

  toArray(): T[] {
    return [...this.values];
  }
}
