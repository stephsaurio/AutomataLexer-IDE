// Deque: permite insertar y eliminar por ambos extremos.
export class Deque<T> {
  private values: T[] = [];

  addFront(value: T): void {
    this.values.unshift(value);
  }

  addBack(value: T): void {
    this.values.push(value);
  }

  removeFront(): T | undefined {
    return this.values.shift();
  }

  removeBack(): T | undefined {
    return this.values.pop();
  }

  peekFront(): T | undefined {
    return this.values[0];
  }

  peekBack(): T | undefined {
    return this.values[this.values.length - 1];
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }

  toArray(): T[] {
    return [...this.values];
  }
}
