
import type { ArbolAVL } from '../services/structures/ejemplos/02-arboles/arbol-avl';
import type { ArbolBinarioBusqueda } from '../services/structures/ejemplos/02-arboles/arbol-binario-busqueda';
import type { MinHeap } from '../services/structures/ejemplos/02-arboles/heap';


// Tipos de estructuras que reconoce el programa.
export type StructureKind =
  | 'STACK'
  | 'QUEUE'
  | 'LIST'
  | 'HASH'
  | 'TREE'
  | 'ARRAY'
  | 'CONJUNTO'
  | 'DEQUE'
  | 'BST'
  | 'AVL'
  | 'HEAP'
  | 'GRAPH_LIST'
  | 'GRAPH_MATRIX';

// Tipos de instrucciones del lenguaje.
export type InstructionKind =
  | 'declare'
  | 'PUSH'
  | 'POP'
  | 'ENQUEUE'
  | 'DEQUEUE'
  | 'INSERT'
  | 'REMOVE'
  | 'SET'
  | 'GET'
  | 'ROOT'
  | 'LEFT'
  | 'RIGHT'
  | 'GRAPH'
  | 'CONSOLE_POP'
  | 'INDEX'
  | 'ADD'
  | 'DELETE'
  | 'ADD_FRONT'
  | 'ADD_BACK'
  | 'REMOVE_FRONT'
  | 'REMOVE_BACK'
  | 'EXTRACT_MIN'
  | 'ADD_VERTEX'
  | 'ADD_EDGE'
  | 'REMOVE_EDGE';

// Información que Peggy devuelve por cada instrucción.
export interface Instruction {
  kind: InstructionKind;
  structure?: StructureKind;
  name: string;
  value?: string;
  key?: string;
  parent?: string;
  index?: number;
}

// Nodo del árbol binario.
export interface TreeNode {
  value: string;
  left?: TreeNode;
  right?: TreeNode;
}

// Datos que puede contener cada estructura.
export type StructureData =
  | {
      kind: 'STACK' | 'QUEUE' | 'LIST' ;
      values: string[];
    }
  | {
      kind: 'ARRAY';
      values: (string | undefined)[];
    }
  | {
      kind: 'HASH';
      values: Map<string, string>;
    }
  | {
      kind: 'TREE';
      root: TreeNode | null;
    }
     | {
      kind: 'CONJUNTO';
      values: Set<string>;
    }
    | { kind: 'DEQUE'; values: string[] }
    | { kind: 'BST'; tree: ArbolBinarioBusqueda; root: NumericTreeNode | null }
    | { kind: 'AVL'; tree: ArbolAVL; root: NumericTreeNode | null }
    | { kind: 'HEAP'; heap: MinHeap }
    | { kind: 'GRAPH_LIST'; adjacency: Map<string, Set<string>> }
    | { kind: 'GRAPH_MATRIX'; vertices: string[]; matrix: number[][] };

export interface NumericTreeNode {
  value: number;
  left: NumericTreeNode | null;
  right: NumericTreeNode | null;
  height?: number;
}

// Información de cada gráfica.
export interface StructureGraph {
  name: string;
  dot: string;
}

// Resultado que recibe el IDE.
export interface StructureRunResult {
  graphs: StructureGraph[];
  consoleMessages: string[];
}


