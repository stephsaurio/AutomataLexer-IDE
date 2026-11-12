// Grafo no dirigido representado mediante listas de adyacencia.
export class GrafoListaAdyacencia {
  private adjacency = new Map<string, Set<string>>();

  addVertex(vertex: string): void {
    if (!this.adjacency.has(vertex)) this.adjacency.set(vertex, new Set());
  }

  addEdge(a: string, b: string): void {
    this.addVertex(a);
    this.addVertex(b);
    this.adjacency.get(a)!.add(b);
    this.adjacency.get(b)!.add(a);
  }

  removeEdge(a: string, b: string): void {
    this.adjacency.get(a)?.delete(b);
    this.adjacency.get(b)?.delete(a);
  }

  neighbors(vertex: string): string[] {
    return [...(this.adjacency.get(vertex) ?? [])];
  }

  breadthFirstSearch(start: string): string[] {
    if (!this.adjacency.has(start)) return [];

    const visited = new Set<string>([start]);
    const queue = [start];
    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      for (const neighbor of this.neighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return result;
  }

  depthFirstSearch(start: string): string[] {
    if (!this.adjacency.has(start)) return [];

    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (vertex: string): void => {
      visited.add(vertex);
      result.push(vertex);

      for (const neighbor of this.neighbors(vertex)) {
        if (!visited.has(neighbor)) visit(neighbor);
      }
    };

    visit(start);
    return result;
  }
}
