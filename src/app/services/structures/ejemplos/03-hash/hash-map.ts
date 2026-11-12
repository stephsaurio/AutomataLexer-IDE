// Envoltura didactica de Map: guarda pares llave-valor.
export class HashMap<K, V> {
  private values = new Map<K, V>();

  set(key: K, value: V): void {
    this.values.set(key, value);
  }

  get(key: K): V | undefined {
    return this.values.get(key);
  }

  has(key: K): boolean {
    return this.values.has(key);
  }

  delete(key: K): boolean {
    return this.values.delete(key);
  }

  entries(): [K, V][] {
    return [...this.values.entries()];
  }

  size(): number {
    return this.values.size;
  }
}
