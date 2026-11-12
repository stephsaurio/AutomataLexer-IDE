// Arbol binario de busqueda (BST): menores a la izquierda, mayores a la derecha.
export interface NodoBST {
  value: number;
  left: NodoBST | null;
  right: NodoBST | null;
}

export class ArbolBinarioBusqueda {
  root: NodoBST | null = null;

  insert(value: number): void {
    const node: NodoBST = { value, left: null, right: null };

    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) return; // No inserta duplicados.

      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return;
        }
        current = current.right;
      }
    }
  }

  search(value: number): NodoBST | null {
    let current = this.root;

    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }

    return null;
  }

  inOrder(node: NodoBST | null = this.root, result: number[] = []): number[] {
    if (!node) return result;
    this.inOrder(node.left, result);
    result.push(node.value);
    this.inOrder(node.right, result);
    return result;
  }

  remove(value: number): void {
    this.root = this.removeNode(this.root, value);
  }

  private removeNode(node: NodoBST | null, value: number): NodoBST | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    }

    if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    }

    // Caso 1: no tiene hijos.
    if (!node.left && !node.right) return null;

    // Caso 2: tiene un solo hijo.
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    // Caso 3: tiene dos hijos. Busca el menor del subarbol derecho.
    let successor = node.right;
    while (successor.left) successor = successor.left;

    node.value = successor.value;
    node.right = this.removeNode(node.right, successor.value);
    return node;
  }
}
