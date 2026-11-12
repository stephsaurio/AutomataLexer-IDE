
import { Injectable } from '@angular/core';
import { StructureData, TreeNode, StructureKind } from '../models/structure';

@Injectable({
  providedIn: 'root',
})
export class GraphService {

  //convierte una estructura en codigo DOT para Graphviz
  toDot(structure: StructureData): string {

    //inicia el grafo con el nombre de la estructura
    const lines = [`digraph ${this.graphName(structure.kind)} {`];

    //crea los nodos con sus respectivos valores
    const addNodes = (values: (string | undefined)[]) => {
      values.forEach((value, index) => {
        lines.push(`n${index + 1} [label="${this.escape(value)}"];`);
      });
    };

    //conecta los nodos consecutivos
    //si bidirectional es true, agrega una conexion en ambos sentidos
    const addConnections = (length: number, bidirectional = false) => {
      for (let index = 1; index < length; index++) {
        lines.push(`n${index} -> n${index + 1};`);

        if (bidirectional) {
          lines.push(`n${index + 1} -> n${index};`);
        }
      }
    };

    //representacion grafica de una PILA
    if (structure.kind === 'STACK') {
      lines.push('rankdir=TB;');

      //invierte los elementos para mostrar primero el ultimo insertado
      const values = [...structure.values].reverse();

      addNodes(values);
      addConnections(values.length);

      if (!values.length) lines.push('empty [label="empty"];');

    //representacion grafica de una COLA o LISTA
    } else if (structure.kind === 'QUEUE' || structure.kind === 'LIST') {
      lines.push('rankdir=LR;');

      addNodes(structure.values);

      //la lista conecta los nodos en ambas direcciones
      addConnections(
        structure.values.length,
        structure.kind === 'LIST'
      );

      if (!structure.values.length) lines.push('empty [label="empty"];');

    //representacion grafica de un ARREGLO
    } else if (structure.kind === 'ARRAY') {
      lines.push('rankdir=LR;');

      //descarta las posiciones que no tienen valor
      const values = structure.values.filter(value => value !== undefined);

      addNodes(values);
      addConnections(values.length);

      if (!values.length) lines.push('empty [label="empty"];');

    //representacion grafica de una TABLA HASH
    } else if (structure.kind === 'HASH') {
      //utiliza registros para mostrar cada llave con su valor
      lines.push('node [shape=record];');

      const entries = [...structure.values.entries()];

      //convierte las entradas en registros de llave y valor
      const rows = entries.map(
        ([key, value]) => `{${this.escapeRecord(key)}|${this.escapeRecord(value)}}`
      );

      lines.push(`tabla [label="${rows.length ? rows.join('|') : '{empty}'}"];`);

    //representacion grafica de un ARBOL BINARIO
    } else if (structure.kind === 'TREE') {
      if (structure.root) {
        this.addTreeNodes(lines, structure.root, { value: 0 });
      } else {
        lines.push('empty [label="empty"];');
      }

    //representacion grafica de un CONJUNTO
    } else if (structure.kind === 'CONJUNTO') {
      lines.push('rankdir=LR;');

      //convierte el Set en un arreglo para recorrer sus elementos
      const values = [...structure.values];

      addNodes(values);

      if (!values.length) lines.push('empty [label="empty"];');

    //representacion grafica de un DEQUE
    } else if (structure.kind === 'DEQUE') {
      lines.push('rankdir=LR;');

      addNodes(structure.values);
      addConnections(structure.values.length, true);

      if (!structure.values.length) lines.push('empty [label="empty"];');

    //representacion grafica de BST y AVL
    } else if (structure.kind === 'BST' || structure.kind === 'AVL') {
      if (structure.root) {
        this.addNumericTreeNodes(lines, structure.root, { value: 0 });
      } else {
        lines.push('empty [label="empty"];');
      }

    //representacion grafica de un HEAP
    } else if (structure.kind === 'HEAP') {
      const values = structure.heap.toArray();

      addNodes(values.map(String));

      //conecta cada nodo con sus hijos segun su posicion
      values.forEach((_, index) => {
        const left = index * 2 + 1;
        const right = index * 2 + 2;

        if (left < values.length) {
          lines.push(`n${index + 1} -> n${left + 1};`);
        }

        if (right < values.length) {
          lines.push(`n${index + 1} -> n${right + 1};`);
        }
      });

      if (!values.length) lines.push('empty [label="empty"];');

    //representacion grafica de un GRAFO con lista de adyacencia
    } else if (structure.kind === 'GRAPH_LIST') {
      for (const [vertex, neighbors] of structure.adjacency) {
        lines.push(`"${this.escape(vertex)}";`);

        for (const neighbor of neighbors) {
          //evita generar dos veces la misma conexion
          if (vertex <= neighbor) {
            lines.push(`"${this.escape(vertex)}" -> "${this.escape(neighbor)}" [dir=none];`);
          }
        }
      }

      if (!structure.adjacency.size) lines.push('empty [label="empty"];');

    //representacion grafica de un GRAFO con matriz de adyacencia
    } else if (structure.kind === 'GRAPH_MATRIX') {
      structure.vertices.forEach(vertex => {
        lines.push(`"${this.escape(vertex)}";`);
      });

      //recorre la matriz para encontrar las conexiones existentes
      structure.matrix.forEach((row, from) => {
        row.forEach((edge, to) => {
          //solo utiliza una mitad de la matriz para evitar duplicados
          if (edge && from <= to) {
            const a = this.escape(structure.vertices[from]);
            const b = this.escape(structure.vertices[to]);

            lines.push(`"${a}" -> "${b}" [dir=none];`);
          }
        });
      });

      if (!structure.vertices.length) lines.push('empty [label="empty"];');
    }

    //cierra el grafo y devuelve el codigo DOT
    return [...lines, '}'].join('\n');
  }

  //recorre el arbol binario y genera sus nodos y conexiones
  private addTreeNodes(
    lines: string[],
    node: TreeNode,
    sequence: { value: number }
  ): void {

    const id = `n${++sequence.value}`;

    lines.push(`${id} [label="${this.escape(node.value)}"];`);

    //revisa los hijos izquierdo y derecho
    for (const child of [node.left, node.right]) {
      if (!child) continue;

      const childId = `n${sequence.value + 1}`;

      lines.push(`${id} -> ${childId};`);

      //continua recorriendo los niveles del arbol
      this.addTreeNodes(lines, child, sequence);
    }
  }

  //recorre los nodos de un BST o AVL
  private addNumericTreeNodes(
    lines: string[],
    node: NonNullable<Extract<StructureData, { kind: 'BST' | 'AVL' }>['root']>,
    sequence: { value: number }
  ): void {

    const id = `n${++sequence.value}`;

    lines.push(`${id} [label="${node.value}"];`);

    //revisa los dos posibles hijos
    for (const child of [node.left, node.right]) {
      if (!child) continue;

      const childId = `n${sequence.value + 1}`;

      lines.push(`${id} -> ${childId};`);

      this.addNumericTreeNodes(lines, child, sequence);
    }
  }

  //devuelve el nombre que Graphviz utiliza para cada estructura
  private graphName(kind: StructureKind): string {
    return {
      STACK: 'Stack',
      QUEUE: 'Queue',
      LIST: 'Lista',
      HASH: 'HashTable',
      TREE: 'Tree',
      ARRAY: 'Array',
      CONJUNTO: 'Conjunto',
      DEQUE: 'Deque',
      BST: 'BST',
      AVL: 'AVL',
      HEAP: 'MinHeap',
      GRAPH_LIST: 'GraphList',
      GRAPH_MATRIX: 'GraphMatrix',
    }[kind];
  }

  //limpia caracteres que pueden causar errores en las etiquetas DOT
  private escape(value: string | undefined): string {
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
  }

  //limpia caracteres especiales de los registros HASH
  private escapeRecord(value: string): string {
    return this.escape(value).replace(/[{}|<>]/g, '\\$&');
  }
}
