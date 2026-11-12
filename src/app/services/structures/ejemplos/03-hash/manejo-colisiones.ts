// Tabla hash con direccionamiento abierto y sondeo lineal.
// Cuando una posicion esta ocupada, prueba la siguiente posicion disponible.
type Entry<V> = { key: string; value: V };
type Slot<V> = Entry<V> | null | 'DELETED';

export class TablaHashSondeoLineal<V> {
  private slots: Slot<V>[];
  private count = 0;

  constructor(private capacity = 11) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('La capacidad debe ser un entero mayor que cero.');
    }
    this.slots = Array.from({ length: capacity }, () => null);
  }

  private hash(key: string): number {
    let total = 0;
    for (const character of key) total = (total * 31 + character.charCodeAt(0)) % this.capacity;
    return total;
  }

  set(key: string, value: V): boolean {
    if (this.count >= this.capacity) return false;

    const start = this.hash(key);
    let firstDeleted = -1;

    for (let step = 0; step < this.capacity; step++) {
      const index = (start + step) % this.capacity;
      const slot = this.slots[index];

      if (slot === 'DELETED') {
        if (firstDeleted < 0) firstDeleted = index;
        continue;
      }

      if (slot === null) {
        const target = firstDeleted >= 0 ? firstDeleted : index;
        this.slots[target] = { key, value };
        this.count++;
        return true;
      }

      if (slot.key === key) {
        this.slots[index] = { key, value };
        return true;
      }
    }

    if (firstDeleted >= 0) {
      this.slots[firstDeleted] = { key, value };
      this.count++;
      return true;
    }

    return false;
  }

  get(key: string): V | undefined {
    const index = this.findIndex(key);
    if (index < 0) return undefined;

    const slot = this.slots[index];
    return slot && slot !== 'DELETED' ? slot.value : undefined;
  }

  delete(key: string): boolean {
    const index = this.findIndex(key);
    if (index < 0) return false;

    this.slots[index] = 'DELETED';
    this.count--;
    return true;
  }

  private findIndex(key: string): number {
    const start = this.hash(key);

    for (let step = 0; step < this.capacity; step++) {
      const index = (start + step) % this.capacity;
      const slot = this.slots[index];

      if (slot === null) return -1;
      if (slot !== 'DELETED' && slot.key === key) return index;
    }

    return -1;
  }
}
