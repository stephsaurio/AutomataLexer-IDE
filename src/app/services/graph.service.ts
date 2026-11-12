import { Injectable } from '@angular/core';
import { StructureData, TreeNode, StructureKind } from '../models/structure';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  // Convierte una estructura de datos en código DOT para Graphviz.
  toDot(structure: StructureData): string {
    // Inicia el código DOT con el nombre del tipo de estructura.
    const lines = [`digraph ${this.graphName(structure.kind)} {`];

    // Crea los nodos de una estructura.
    // Cada nodo recibe un identificador (n1, n2, n3...)
    // y una etiqueta con el valor que contiene.
    const addNodes = (values: (string | undefined)[]) => {
      values.forEach((value, index) => {
        lines.push(`n${index + 1} [label="${this.escape(value)}"];`);
      });
    };

    // Representación gráfica de una PILA.
    if (structure.kind === 'STACK') {
      // TB significa Top to Bottom: los elementos se muestran de arriba hacia abajo.
      lines.push('rankdir=TB;');

      // Se invierte el arreglo para mostrar primero el último elemento insertado.
      const values = [...structure.values].reverse();

      // Se crean los nodos de la pila.
      addNodes(values);

      // Se conectan los elementos mediante flechas.
      values.slice(1).forEach((_, index) => {
        lines.push(`n${index + 1} -> n${index + 2};`);
      });

      // Si la pila no tiene elementos, se muestra un nodo vacío.
      if (!values.length) lines.push('empty [label="empty"];');

      // Representación gráfica de una COLA o una LISTA.
    } else if (structure.kind === 'QUEUE' || structure.kind === 'LIST') {
      // LR significa Left to Right: los elementos se muestran de izquierda a derecha.
      lines.push('rankdir=LR;');

      // Se crean los nodos con los valores de la estructura.
      addNodes(structure.values);

      // Se conectan los elementos consecutivos.
      structure.values.slice(1).forEach((_, index) => {
        // Conexión del elemento actual con el siguiente.
        lines.push(`n${index + 1} -> n${index + 2};`);

        // La lista tiene enlaces en ambas direcciones.
        // La cola solamente tiene enlaces hacia adelante.
        if (structure.kind === 'LIST') {
          lines.push(`n${index + 2} -> n${index + 1};`);
        }
      });

      // Si no existen elementos, se muestra un nodo vacío.
      if (!structure.values.length) lines.push('empty [label="empty"];');

      // Representación gráfica de un ARREGLO.
    } else if (structure.kind === 'ARRAY') {
      lines.push('rankdir=LR;');

      // Se descartan las posiciones que todavía no tienen un valor.
      const values = structure.values.filter((value) => value !== undefined);

      // Se crean los nodos.
      addNodes(values);

      // Se conectan las posiciones consecutivas.
      values.slice(1).forEach((_, index) => {
        lines.push(`n${index + 1} -> n${index + 2};`);
      });

      if (!values.length) lines.push('empty [label="empty"];');

      // Representación gráfica de una TABLA HASH.
    } else if (structure.kind === 'HASH') {
      // Indica a Graphviz que los nodos deben tener forma de registro.
      lines.push('node [shape=record];');

      // Se obtienen las llaves y sus valores de la tabla HASH.
      const entries = [...structure.values.entries()];

      // Cada registro contiene una llave y su valor.
      const rows = entries.map(
        ([key, value]) => `{${this.escapeRecord(key)}|${this.escapeRecord(value)}}`,
      );

      // Se genera el registro con todas las entradas.
      // Si la tabla está vacía, se muestra la etiqueta empty.
      lines.push(`tabla [label="${rows.length ? rows.join('|') : '{empty}'}"];`);

      // Representación gráfica de un ÁRBOL BINARIO.
    } else if (structure.kind === 'TREE') {
      // Se comprueba si el árbol tiene una raíz.
      if (structure.root) {
        // Se inicia el recorrido desde la raíz.
        // El contador comienza en cero para generar los identificadores.
        this.addTreeNodes(lines, structure.root, { value: 0 });
      } else {
        // Si no existe raíz, el árbol está vacío.
        lines.push('empty [label="empty"];');
      }

      //representacion grafica de un CONJUNTO
    } else if (structure.kind === 'CONJUNTO') {
      lines.push('rankdir=LR;');

      //convierte el Set en un arreglo para recorrer sus elementos
      const values = [...structure.values];

      //crea un nodo por cada elemento del conjunto
      addNodes(values);

      //si no tiene elementos, muestra un nodo vacio
      if (!values.length) lines.push('empty [label="empty"];');
    } else if (structure.kind === 'DEQUE') {
      lines.push('rankdir=LR;');
      addNodes(structure.values);
      structure.values.slice(1).forEach((_, index) => {
        lines.push(`n${index + 1} -> n${index + 2};`);
        lines.push(`n${index + 2} -> n${index + 1};`);
      });
      if (!structure.values.length) lines.push('empty [label="empty"];');
    } else if (structure.kind === 'BST' || structure.kind === 'AVL') {
      if (structure.root) this.addNumericTreeNodes(lines, structure.root, { value: 0 });
      else lines.push('empty [label="empty"];');
    } else if (structure.kind === 'HEAP') {
      const values = structure.heap.toArray();
      addNodes(values.map(String));
      values.forEach((_, index) => {
        const left = index * 2 + 1;
        const right = index * 2 + 2;
        if (left < values.length) lines.push(`n${index + 1} -> n${left + 1};`);
        if (right < values.length) lines.push(`n${index + 1} -> n${right + 1};`);
      });
      if (!values.length) lines.push('empty [label="empty"];');
    } else if (structure.kind === 'GRAPH_LIST') {
      for (const [vertex, neighbors] of structure.adjacency) {
        lines.push(`"${this.escape(vertex)}";`);
        for (const neighbor of neighbors) {
          if (vertex <= neighbor) lines.push(`"${this.escape(vertex)}" -> "${this.escape(neighbor)}" [dir=none];`);
        }
      }
      if (!structure.adjacency.size) lines.push('empty [label="empty"];');
    } else if (structure.kind === 'GRAPH_MATRIX') {
      for (const vertex of structure.vertices) lines.push(`"${this.escape(vertex)}";`);
      structure.matrix.forEach((row, from) => row.forEach((edge, to) => {
        if (edge && from <= to) {
          const a = this.escape(structure.vertices[from]);
          const b = this.escape(structure.vertices[to]);
          lines.push(`"${a}" -> "${b}" [dir=none];`);
        }
      }));
      if (!structure.vertices.length) lines.push('empty [label="empty"];');
    }

    // Cierra el código DOT y devuelve todas las instrucciones como texto.
    return [...lines, '}'].join('\n');
  }

  // Recorre el árbol binario para generar sus nodos y conexiones.
  private addTreeNodes(lines: string[], node: TreeNode, sequence: { value: number }): void {
    // Genera un identificador único para el nodo actual.
    const id = `n${++sequence.value}`;

    // Agrega el nodo con el valor que contiene.
    lines.push(`${id} [label="${this.escape(node.value)}"];`);

    // Revisa los dos posibles hijos: izquierdo y derecho.
    for (const child of [node.left, node.right]) {
      // Si el hijo no existe, continúa con el siguiente.
      if (!child) continue;

      // Calcula el identificador que tendrá el siguiente nodo.
      const childId = `n${sequence.value + 1}`;

      // Conecta el nodo actual con su hijo.
      lines.push(`${id} -> ${childId};`);

      // Llama nuevamente al método para revisar los hijos de ese nodo.
      // Esto permite recorrer todos los niveles del árbol.
      this.addTreeNodes(lines, child, sequence);
    }
  }

  private addNumericTreeNodes(
    lines: string[],
    node: NonNullable<Extract<StructureData, { kind: 'BST' | 'AVL' }>['root']>,
    sequence: { value: number },
  ): void {
    const id = `n${++sequence.value}`;
    lines.push(`${id} [label="${node.value}"];`);
    for (const child of [node.left, node.right]) {
      if (!child) continue;
      const childId = `n${sequence.value + 1}`;
      lines.push(`${id} -> ${childId};`);
      this.addNumericTreeNodes(lines, child, sequence);
    }
  }

  // Devuelve el nombre que Graphviz utilizará para cada tipo de estructura.
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

  // Limpia caracteres especiales para evitar errores en las etiquetas DOT.
  private escape(value: string | undefined): string {
    return String(value)
      .replace(/\\/g, '\\\\') // Escapa las barras invertidas.
      .replace(/"/g, '\\"') // Escapa las comillas dobles.
      .replace(/\n/g, '\\n'); // Representa los saltos de línea.
  }

  // Limpia caracteres especiales propios de los registros HASH.
  private escapeRecord(value: string): string {
    return this.escape(value).replace(/[{}|<>]/g, '\\$&');
  }
}
