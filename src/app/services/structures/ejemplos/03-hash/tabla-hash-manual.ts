// Tabla hash implementada manualmente con encadenamiento separado.
// Cada posicion del arreglo contiene una lista de pares llave-valor.
export class TablaHashManual<V> {
  private buckets: Array<Array<[string, V]>>;

  constructor(private capacity = 10) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('La capacidad debe ser un entero mayor que cero.');
    }
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: string): number {
    let total = 0;
    for (const character of key) total += character.charCodeAt(0);
    return total % this.capacity;
  }

  set(key: string, value: V): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const existing = bucket.findIndex(([storedKey]) => storedKey === key);

    if (existing >= 0) bucket[existing] = [key, value];
    else bucket.push([key, value]);
  }

  get(key: string): V | undefined {
    const bucket = this.buckets[this.hash(key)];
    return bucket.find(([storedKey]) => storedKey === key)?.[1];
  }

  delete(key: string): boolean {
    const bucket = this.buckets[this.hash(key)];
    const index = bucket.findIndex(([storedKey]) => storedKey === key);

    if (index < 0) return false;
    bucket.splice(index, 1);
    return true;
  }

  entries(): Array<[string, V]> {
    return this.buckets.flatMap(bucket => [...bucket]);
  }
}
