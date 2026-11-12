// Arbol AVL: BST que actualiza alturas y realiza rotaciones para mantener equilibrio.
export interface NodoAVL {
  value: number;
  height: number;
  left: NodoAVL | null;
  right: NodoAVL | null;
}

export class ArbolAVL {
  root: NodoAVL | null = null;

  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }

  inOrder(node: NodoAVL | null = this.root, result: number[] = []): number[] {
    if (!node) return result;
    this.inOrder(node.left, result);
    result.push(node.value);
    this.inOrder(node.right, result);
    return result;
  }

  private height(node: NodoAVL | null): number {
    return node ? node.height : 0;
  }

  private updateHeight(node: NodoAVL): void {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  private balance(node: NodoAVL): number {
    return this.height(node.left) - this.height(node.right);
  }

  private rotateRight(y: NodoAVL): NodoAVL {
    const x = y.left!;
    const subtree = x.right;

    x.right = y;
    y.left = subtree;

    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  private rotateLeft(x: NodoAVL): NodoAVL {
    const y = x.right!;
    const subtree = y.left;

    y.left = x;
    x.right = subtree;

    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  private insertNode(node: NodoAVL | null, value: number): NodoAVL {
    if (!node) return { value, height: 1, left: null, right: null };

    if (value < node.value) node.left = this.insertNode(node.left, value);
    else if (value > node.value) node.right = this.insertNode(node.right, value);
    else return node; // Ignora valores repetidos.

    this.updateHeight(node);
    const balance = this.balance(node);

    // Caso izquierda-izquierda.
    if (balance > 1 && value < node.left!.value) return this.rotateRight(node);

    // Caso derecha-derecha.
    if (balance < -1 && value > node.right!.value) return this.rotateLeft(node);

    // Caso izquierda-derecha.
    if (balance > 1 && value > node.left!.value) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Caso derecha-izquierda.
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }
}
