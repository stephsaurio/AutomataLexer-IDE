// Pila: el ultimo elemento que entra es el primero que sale (LIFO).
export class Pila<T> {
  private values: T[] = [];

  push(value: T): void {
    this.values.push(value);
  }

  pop(): T | undefined {
    return this.values.pop();
  }

  peek(): T | undefined {
    return this.values[this.values.length - 1];
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
