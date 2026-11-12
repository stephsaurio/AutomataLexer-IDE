// Lista simplemente enlazada: cada nodo apunta al siguiente.
export interface NodoSimple<T> {
  value: T;
  next: NodoSimple<T> | null;
}

export class ListaSimple<T> {
  private head: NodoSimple<T> | null = null;
  private tail: NodoSimple<T> | null = null;

  insert(value: T): void {
    const node: NodoSimple<T> = { value, next: null };

    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }

    this.tail!.next = node;
    this.tail = node;
  }

  remove(value: T): boolean {
    let current = this.head;
    let previous: NodoSimple<T> | null = null;

    while (current) {
      if (current.value === value) {
        if (previous) previous.next = current.next;
        else this.head = current.next;

        if (current === this.tail) this.tail = previous;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  }

  find(value: T): NodoSimple<T> | null {
    let current = this.head;

    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }
}
