// Arbol binario de insercion manual: se indica si el hijo va a la izquierda o derecha.
export interface NodoBinario<T> {
  value: T;
  left: NodoBinario<T> | null;
  right: NodoBinario<T> | null;
}

export class ArbolBinario<T> {
  root: NodoBinario<T> | null = null;

  setRoot(value: T): void {
    this.root = { value, left: null, right: null };
  }

  insertLeft(parentValue: T, value: T): boolean {
    const parent = this.root ? this.findNode(this.root, parentValue) : null;
    if (!parent) return false;

    parent.left = { value, left: null, right: null };
    return true;
  }

  insertRight(parentValue: T, value: T): boolean {
    const parent = this.root ? this.findNode(this.root, parentValue) : null;
    if (!parent) return false;

    parent.right = { value, left: null, right: null };
    return true;
  }

  findNode(node: NodoBinario<T> | null, value: T): NodoBinario<T> | null {
    if (!node) return null;
    if (node.value === value) return node;

    return this.findNode(node.left, value)
      ?? this.findNode(node.right, value);
  }

  // Recorrido: raiz, izquierda, derecha.
  preOrder(node: NodoBinario<T> | null = this.root, result: T[] = []): T[] {
    if (!node) return result;
    result.push(node.value);
    this.preOrder(node.left, result);
    this.preOrder(node.right, result);
    return result;
  }

  // Recorrido: izquierda, raiz, derecha.
  inOrder(node: NodoBinario<T> | null = this.root, result: T[] = []): T[] {
    if (!node) return result;
    this.inOrder(node.left, result);
    result.push(node.value);
    this.inOrder(node.right, result);
    return result;
  }

  // Recorrido: izquierda, derecha, raiz.
  postOrder(node: NodoBinario<T> | null = this.root, result: T[] = []): T[] {
    if (!node) return result;
    this.postOrder(node.left, result);
    this.postOrder(node.right, result);
    result.push(node.value);
    return result;
  }
}
