// Lista doblemente enlazada: cada nodo apunta al siguiente y al anterior.
export interface NodoDoble<T> {
  value: T;
  next: NodoDoble<T> | null;
  prev: NodoDoble<T> | null;
}

export class ListaDoble<T> {
  private head: NodoDoble<T> | null = null;
  private tail: NodoDoble<T> | null = null;

  insert(value: T): void {
    const node: NodoDoble<T> = {
      value,
      next: null,
      prev: this.tail
    };

    if (this.tail) this.tail.next = node;
    else this.head = node;

    this.tail = node;
  }

  remove(value: T): boolean {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (current.prev) current.prev.next = current.next;
        else this.head = current.next;

        if (current.next) current.next.prev = current.prev;
        else this.tail = current.prev;

        return true;
      }

      current = current.next;
    }

    return false;
  }

  toArrayForward(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  toArrayBackward(): T[] {
    const result: T[] = [];
    let current = this.tail;

    while (current) {
      result.push(current.value);
      current = current.prev;
    }

    return result;
  }
}
