import { Injectable } from '@angular/core';
import { parse } from '../grammar/language-parser.js';

type Statement = {
  kind: string;
  name: string;
  structure?: string;
  value?: string;
  key?: string;
  parent?: string;
};

type TreeNode = {
  value: string;
  left?: TreeNode;
  right?: TreeNode;
};

type Structure =
  | { kind: 'STACK' | 'QUEUE' | 'LIST'; values: string[] }
  | { kind: 'HASH'; values: Map<string, string> }
  | { kind: 'TREE'; root?: TreeNode };

export interface StructureGraph {
  name: string;
  dot: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class StructureRunner {
  run(text: string): StructureGraph[] {
    const statements = parse(text) as Statement[];
    const structures = new Map<string, Structure>();
    const graphs: StructureGraph[] = [];

    for (const statement of statements) {
      if (statement.kind === 'declare') {
        if (statement.structure === 'HASH') {
          structures.set(statement.name, { kind: 'HASH', values: new Map() });
        } else if (statement.structure === 'TREE') {
          structures.set(statement.name, { kind: 'TREE' });
        } else {
          structures.set(statement.name, {
            kind: statement.structure as 'STACK' | 'QUEUE' | 'LIST',
            values: [],
          });
        }
        continue;
      }

      const structure = structures.get(statement.name);
      if (!structure) continue;

      if (statement.kind === 'GRAPH') {
        const dot = this.toDot(statement.name, structure);
        graphs.push({
          name: statement.name,
          dot,
          url: `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(dot)}`,
        });
        continue;
      }

      if (structure.kind === 'HASH') {
        if (statement.kind === 'SET' && statement.key !== undefined && statement.value !== undefined) {
          structure.values.set(statement.key, statement.value);
        } else if (statement.kind === 'GET' && statement.key !== undefined) {
          structure.values.delete(statement.key);
        }
        continue;
      }

      if (structure.kind === 'TREE') {
        this.updateTree(structure, statement);
        continue;
      }

      if (statement.kind === 'PUSH' || statement.kind === 'ENQUEUE' || statement.kind === 'INSERT') {
        if (statement.value !== undefined) structure.values.push(statement.value);
      } else if (statement.kind === 'POP' && structure.kind === 'STACK') {
        structure.values.pop();
      } else if (statement.kind === 'DEQUEUE' && structure.kind === 'QUEUE') {
        structure.values.shift();
      } else if (statement.kind === 'REMOVE' && structure.kind === 'LIST') {
        const index = structure.values.indexOf(statement.value ?? '');
        if (index >= 0) structure.values.splice(index, 1);
      }
    }

    return graphs;
  }

  private updateTree(tree: Extract<Structure, { kind: 'TREE' }>, statement: Statement): void {
    if (statement.kind === 'ROOT' && statement.value !== undefined) {
      tree.root = { value: statement.value };
      return;
    }

    if (!tree.root || statement.parent === undefined || statement.value === undefined) return;
    const parent = this.findNode(tree.root, statement.parent);
    if (!parent) return;

    if (statement.kind === 'LEFT') parent.left = { value: statement.value };
    if (statement.kind === 'RIGHT') parent.right = { value: statement.value };
  }

  private findNode(node: TreeNode, value: string): TreeNode | undefined {
    if (node.value === value) return node;
    return (node.left && this.findNode(node.left, value)) || (node.right && this.findNode(node.right, value));
  }

  private toDot(name: string, structure: Structure): string {
    if (structure.kind === 'STACK') {
      const values = [...structure.values].reverse();
      const lines = ['digraph Stack {', 'rankdir=TB;'];
      values.forEach((value, index) => lines.push(`nodo${index + 1} [label="${this.escape(value)}"];`));
      values.slice(1).forEach((_, index) => lines.push(`nodo${index + 1} -> nodo${index + 2};`));
      if (!values.length) lines.push('empty [label="empty"];');
      return [...lines, '}'].join('\n');
    }

    if (structure.kind === 'QUEUE' || structure.kind === 'LIST') {
      const type = structure.kind === 'QUEUE' ? 'Queue' : 'Lista';
      const lines = [`digraph ${type} {`, 'rankdir=LR;'];
      structure.values.forEach((value, index) => lines.push(`n${index + 1} [label="${this.escape(value)}"];`));
      structure.values.slice(1).forEach((_, index) => {
        lines.push(`n${index + 1} -> n${index + 2};`);
        if (structure.kind === 'LIST') lines.push(`n${index + 2} -> n${index + 1};`);
      });
      if (!structure.values.length) lines.push('empty [label="empty"];');
      return [...lines, '}'].join('\n');
    }

    if (structure.kind === 'HASH') {
      const entries = [...structure.values.entries()];
      const rows = entries.map(([key, value]) => `{${this.escapeRecord(key)}|${this.escapeRecord(value)}}`);
      const label = rows.length ? rows.join('|') : '{empty}';
      return `digraph HashTable {\nnode [shape=record];\ntabla [label="${label}"];\n}`;
    }

    const lines = ['digraph Tree {'];
    if (structure.kind === 'TREE' && structure.root) this.addTreeEdges(lines, structure.root);
    else lines.push('empty [label="empty"];');
    return [...lines, '}'].join('\n');
  }

  private addTreeEdges(lines: string[], node: TreeNode): void {
    lines.push(`"${this.escape(node.value)}" [label="${this.escape(node.value)}"];`);
    for (const child of [node.left, node.right]) {
      if (!child) continue;
      lines.push(`"${this.escape(node.value)}" -> "${this.escape(child.value)}";`);
      this.addTreeEdges(lines, child);
    }
  }

  private escape(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }

  private escapeRecord(value: string): string {
    return this.escape(value).replace(/[{}|<>]/g, '\\$&');
  }
}
