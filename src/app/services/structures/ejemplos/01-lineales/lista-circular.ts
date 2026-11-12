// Lista circular simple: el ultimo nodo apunta otra vez al primero.
export interface NodoCircular<T> {
  value: T;
  next: NodoCircular<T> | null;
}

export class ListaCircular<T> {
  private head: NodoCircular<T> | null = null;
  private tail: NodoCircular<T> | null = null;

  insert(value: T): void {
    const node: NodoCircular<T> = {
      value,
      next: this.head
    };

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }

    // Mantiene el enlace circular incluso cuando solo hay un nodo.
    this.tail!.next = this.head;
  }

  remove(value: T): boolean {
    if (!this.head || !this.tail) return false;

    let current = this.head;
    let previous = this.tail;

    do {
      if (current.value === value) {
        // Caso: solo existe un nodo.
        if (this.head === this.tail) {
          this.head = null;
          this.tail = null;
        } else {
          previous.next = current.next;

          if (current === this.head) this.head = current.next;
          if (current === this.tail) this.tail = previous;

          this.tail!.next = this.head;
        }

        return true;
      }

      previous = current;
      current = current.next!;
    } while (current !== this.head);

    return false;
  }

  toArray(): T[] {
    const result: T[] = [];
    if (!this.head) return result;

    let current = this.head;
    do {
      result.push(current.value);
      current = current.next!;
    } while (current !== this.head);

    return result;
  }
}
