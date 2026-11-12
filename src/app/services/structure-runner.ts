import { Injectable } from '@angular/core';
import { parse } from '../grammar/language-parser.js';

import { Instruction, StructureData, StructureRunResult } from '../models/structure';

//mantiene disponible StructureGraph para los componentes que lo importan desde este servicio
export type { StructureGraph } from '../models/structure';

import { StackService } from './structures/stack.service';
import { QueueService } from './structures/queue.service';
import { ListService } from './structures/list.service';
import { HashService } from './structures/hash.service';
import { TreeService } from './structures/tree.service';
import { ConjuntoService } from './structures/conjunto.service';
import { GraphService } from './graph.service';
import { ArbolAVL } from './structures/ejemplos/02-arboles/arbol-avl';
import { ArbolBinarioBusqueda } from './structures/ejemplos/02-arboles/arbol-binario-busqueda';
import { MinHeap } from './structures/ejemplos/02-arboles/heap';

@Injectable({
  providedIn: 'root',
})
export class StructureRunner {
  constructor(
    private stackService: StackService,
    private queueService: QueueService,
    private listService: ListService,
    private hashService: HashService,
    private treeService: TreeService,
    private conjuntoService: ConjuntoService,
    private graphService: GraphService,
  ) {}

  run(text: string): StructureRunResult {
    //peggy reconoce las instrucciones del programa
    const instructions = parse(text) as Instruction[];

    //guarda las estructuras durante la ejecucion
    const structures = new Map<string, StructureData>();
    const graphs: StructureRunResult['graphs'] = [];
    const consoleMessages: string[] = [];


    //recorre las instrucciones en el orden en que aparecen
    for (const item of instructions) {
      //declara una nueva estructura
      if (item.kind === 'declare') {
        switch (item.structure) {
          case 'STACK':
            structures.set(item.name, { kind: 'STACK', values: [] });
            break;

          case 'QUEUE':
            structures.set(item.name, { kind: 'QUEUE', values: [] });
            break;

          case 'LIST':
            structures.set(item.name, { kind: 'LIST', values: [] });
            break;

          case 'HASH':
            structures.set(item.name, { kind: 'HASH', values: new Map() });
            break;

          case 'TREE':
            structures.set(item.name, { kind: 'TREE', root: null });
            break;

          case 'ARRAY':
            structures.set(item.name, { kind: 'ARRAY', values: [] });
            break;

          case 'CONJUNTO':
            structures.set(item.name, { kind: 'CONJUNTO', values: new Set<string>()
            });
            break;

          case 'DEQUE':
            structures.set(item.name, { kind: 'DEQUE', values: [] });
            break;

          case 'BST':
            structures.set(item.name, { kind: 'BST', tree: new ArbolBinarioBusqueda(), root: null });
            break;

          case 'AVL':
            structures.set(item.name, { kind: 'AVL', tree: new ArbolAVL(), root: null });
            break;

          case 'HEAP':
            structures.set(item.name, { kind: 'HEAP', heap: new MinHeap() });
            break;

          case 'GRAPH_LIST':
            structures.set(item.name, { kind: 'GRAPH_LIST', adjacency: new Map() });
            break;

          case 'GRAPH_MATRIX':
            structures.set(item.name, { kind: 'GRAPH_MATRIX', vertices: [], matrix: [] });
            break;
        }

        continue;
      }

      //busca la estructura indicada en la instruccion
      const structure = structures.get(item.name);

      if (!structure) {
        if (item.kind === 'CONSOLE_POP') {
          consoleMessages.push(`No existe la estructura ${item.name}.`);
        }

        continue;
      }

      //genera la grafica con el estado actual de la estructura
      if (item.kind === 'GRAPH') {
        graphs.push({
          name: item.name,
          dot: this.graphService.toDot(structure),
        });

        continue;
      }

      //consulta y elimina un elemento de la pila para mostrarlo en consola
      if (item.kind === 'CONSOLE_POP') {
        if (structure.kind !== 'STACK') {
          consoleMessages.push(`${item.name} no es una pila.`);
          continue;
        }

        const removedValue = this.stackService.pop(structure.values);

        consoleMessages.push(
          removedValue === undefined ? `${item.name}: pila vacía` : `${item.name}: ${removedValue}`,
        );

        continue;
      }

      //operaciones de pila
      if (structure.kind === 'STACK') {
        if (item.kind === 'PUSH' && item.value !== undefined) {
          this.stackService.push(structure.values, item.value);
        }

        if (item.kind === 'POP') {
          this.stackService.pop(structure.values);
        }

        continue;
      }

      //operaciones de cola
      if (structure.kind === 'QUEUE') {
        if (item.kind === 'ENQUEUE' && item.value !== undefined) {
          this.queueService.enqueue(structure.values, item.value);
        }

        if (item.kind === 'DEQUEUE') {
          this.queueService.dequeue(structure.values);
        }

        continue;
      }

      //operaciones de lista
      if (structure.kind === 'LIST') {
        if (item.kind === 'INSERT' && item.value !== undefined) {
          this.listService.insert(structure.values, item.value);
        }

        if (item.kind === 'REMOVE' && item.value !== undefined) {
          this.listService.remove(structure.values, item.value);
        }

        continue;
      }

      //operaciones de tabla hash
      if (structure.kind === 'HASH') {
        if (item.kind === 'SET' && item.key !== undefined && item.value !== undefined) {
          this.hashService.set(structure.values, item.key, item.value);
        }

        if (item.kind === 'GET' && item.key !== undefined) {
          this.hashService.get(structure.values, item.key);
        }

        continue;
      }

      //operaciones de arbol binario
      if (structure.kind === 'TREE') {
        if (item.kind === 'ROOT' && item.value !== undefined) {
          structure.root = this.treeService.root(item.value);
        } else if (structure.root && item.parent !== undefined && item.value !== undefined) {
          if (item.kind === 'LEFT') {
            this.treeService.left(structure.root, item.parent, item.value);
          }

          if (item.kind === 'RIGHT') {
            this.treeService.right(structure.root, item.parent, item.value);
          }
        }

        continue;
      }

      //operacion de arreglo
      if (
        structure.kind === 'ARRAY' &&
        item.kind === 'INDEX' &&
        item.index !== undefined &&
        item.value !== undefined
      ) {
        structure.values[item.index] = item.value;
      }
      //operaciones de conjunto
   //operaciones de conjunto
if (structure.kind === 'CONJUNTO') {
  if (item.kind === 'ADD' && item.value !== undefined) {
    this.conjuntoService.add(structure.values, item.value);
  }

  if (item.kind === 'DELETE' && item.value !== undefined) {
    this.conjuntoService.delete(structure.values, item.value);
  }

  continue;
}

      if (structure.kind === 'DEQUE') {
        if (item.kind === 'ADD_FRONT' && item.value !== undefined) structure.values.unshift(item.value);
        if (item.kind === 'ADD_BACK' && item.value !== undefined) structure.values.push(item.value);
        if (item.kind === 'REMOVE_FRONT') structure.values.shift();
        if (item.kind === 'REMOVE_BACK') structure.values.pop();
        continue;
      }

      if (structure.kind === 'BST' || structure.kind === 'AVL') {
        if (item.kind === 'INSERT' && item.value !== undefined) {
          const value = Number(item.value);
          if (Number.isFinite(value)) {
            structure.tree.insert(value);
            structure.root = structure.tree.root;
          }
        }
        if (structure.kind === 'BST' && item.kind === 'REMOVE' && item.value !== undefined) {
          const value = Number(item.value);
          if (Number.isFinite(value)) {
            structure.tree.remove(value);
            structure.root = structure.tree.root;
          }
        }
        continue;
      }

      if (structure.kind === 'HEAP') {
        if (item.kind === 'INSERT' && item.value !== undefined) {
          const value = Number(item.value);
          if (Number.isFinite(value)) structure.heap.insert(value);
        }
        if (item.kind === 'EXTRACT_MIN') structure.heap.extractMin();
        continue;
      }

      if (structure.kind === 'GRAPH_LIST') {
        if (item.kind === 'ADD_VERTEX' && item.value !== undefined) {
          if (!structure.adjacency.has(item.value)) structure.adjacency.set(item.value, new Set());
        }
        if ((item.kind === 'ADD_EDGE' || item.kind === 'REMOVE_EDGE') && item.parent !== undefined && item.value !== undefined) {
          const ensure = (vertex: string) => {
            if (!structure.adjacency.has(vertex)) structure.adjacency.set(vertex, new Set());
          };
          if (item.kind === 'ADD_EDGE') {
            ensure(item.parent);
            ensure(item.value);
            structure.adjacency.get(item.parent)!.add(item.value);
            structure.adjacency.get(item.value)!.add(item.parent);
          } else {
            structure.adjacency.get(item.parent)?.delete(item.value);
            structure.adjacency.get(item.value)?.delete(item.parent);
          }
        }
        continue;
      }

      if (structure.kind === 'GRAPH_MATRIX') {
        if (item.kind === 'ADD_VERTEX' && item.value !== undefined) {
          if (!structure.vertices.includes(item.value)) {
            structure.vertices.push(item.value);
            structure.matrix.forEach((row) => row.push(0));
            structure.matrix.push(Array(structure.vertices.length).fill(0));
          }
        }
        if ((item.kind === 'ADD_EDGE' || item.kind === 'REMOVE_EDGE') && item.parent !== undefined && item.value !== undefined) {
          if (item.kind === 'ADD_EDGE') {
            for (const vertex of [item.parent, item.value]) {
              if (!structure.vertices.includes(vertex)) {
                structure.vertices.push(vertex);
                structure.matrix.forEach((row) => row.push(0));
                structure.matrix.push(Array(structure.vertices.length).fill(0));
              }
            }
          }
          const from = structure.vertices.indexOf(item.parent);
          const to = structure.vertices.indexOf(item.value);
          if (from >= 0 && to >= 0) {
            const edge = item.kind === 'ADD_EDGE' ? 1 : 0;
            structure.matrix[from][to] = edge;
            structure.matrix[to][from] = edge;
          }
        }
        continue;
      }
    }

    //devuelve las graficas y los mensajes para el IDE
    return {
      graphs,
      consoleMessages,
    };
  }
}
