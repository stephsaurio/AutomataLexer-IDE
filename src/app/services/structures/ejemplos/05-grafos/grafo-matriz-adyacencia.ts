// Grafo no dirigido representado mediante una matriz de adyacencia.
export class GrafoMatrizAdyacencia {
  private vertices: string[] = [];
  private matrix: number[][] = [];

  addVertex(vertex: string): void {
    if (this.vertices.includes(vertex)) return;

    this.vertices.push(vertex);
    for (const row of this.matrix) row.push(0);
    this.matrix.push(Array(this.vertices.length).fill(0));
  }

  addEdge(a: string, b: string): void {
    this.addVertex(a);
    this.addVertex(b);

    const i = this.vertices.indexOf(a);
    const j = this.vertices.indexOf(b);
    this.matrix[i][j] = 1;
    this.matrix[j][i] = 1;
  }

  removeEdge(a: string, b: string): void {
    const i = this.vertices.indexOf(a);
    const j = this.vertices.indexOf(b);
    if (i < 0 || j < 0) return;

    this.matrix[i][j] = 0;
    this.matrix[j][i] = 0;
  }

  hasEdge(a: string, b: string): boolean {
    const i = this.vertices.indexOf(a);
    const j = this.vertices.indexOf(b);
    return i >= 0 && j >= 0 && this.matrix[i][j] === 1;
  }

  neighbors(vertex: string): string[] {
    const index = this.vertices.indexOf(vertex);
    if (index < 0) return [];

    return this.vertices.filter((_, j) => this.matrix[index][j] === 1);
  }

  getMatrix(): number[][] {
    return this.matrix.map(row => [...row]);
  }

  getVertices(): string[] {
    return [...this.vertices];
  }
}
