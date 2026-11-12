// Conjunto: almacena valores unicos.
export class Conjunto<T> {
  private values = new Set<T>();

  add(value: T): void {
    this.values.add(value);
  }

  delete(value: T): boolean {
    return this.values.delete(value);
  }

  has(value: T): boolean {
    return this.values.has(value);
  }

  union(other: Conjunto<T>): Conjunto<T> {
    const result = new Conjunto<T>();
    for (const value of this.values) result.add(value);
    for (const value of other.values) result.add(value);
    return result;
  }

  intersection(other: Conjunto<T>): Conjunto<T> {
    const result = new Conjunto<T>();
    for (const value of this.values) {
      if (other.has(value)) result.add(value);
    }
    return result;
  }

  difference(other: Conjunto<T>): Conjunto<T> {
    const result = new Conjunto<T>();
    for (const value of this.values) {
      if (!other.has(value)) result.add(value);
    }
    return result;
  }

  toArray(): T[] {
    return [...this.values];
  }
}
