
import { Injectable } from '@angular/core';
import { TreeNode } from '../../models/structure';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  root(value: string): TreeNode {
    return { value };
  }

  left(node: TreeNode, parent: string, value: string): boolean {
    const target = this.findNode(node, parent);

    if (!target) return false;

    target.left = { value };
    return true;
  }

  right(node: TreeNode, parent: string, value: string): boolean {
    const target = this.findNode(node, parent);

    if (!target) return false;

    target.right = { value };
    return true;
  }

  private findNode(node: TreeNode | undefined, value: string): TreeNode | undefined {
    if (!node) return undefined;

    if (node.value === value) return node;

    return this.findNode(node.left, value)
      ?? this.findNode(node.right, value);
  }
}
