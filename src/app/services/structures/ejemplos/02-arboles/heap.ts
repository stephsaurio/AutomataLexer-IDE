// MinHeap: el menor elemento siempre queda en la raiz.
export class MinHeap {
  private values: number[] = [];

  insert(value: number): void {
    this.values.push(value);
    this.bubbleUp(this.values.length - 1);
  }

  peek(): number | undefined {
    return this.values[0];
  }

  extractMin(): number | undefined {
    if (this.values.length === 0) return undefined;
    if (this.values.length === 1) return this.values.pop();

    const minimum = this.values[0];
    this.values[0] = this.values.pop()!;
    this.sinkDown(0);
    return minimum;
  }

  toArray(): number[] {
    return [...this.values];
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.values[parent] <= this.values[index]) break;

      [this.values[parent], this.values[index]] = [this.values[index], this.values[parent]];
      index = parent;
    }
  }

  private sinkDown(index: number): void {
    const length = this.values.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.values[left] < this.values[smallest]) smallest = left;
      if (right < length && this.values[right] < this.values[smallest]) smallest = right;
      if (smallest === index) return;

      [this.values[index], this.values[smallest]] = [this.values[smallest], this.values[index]];
      index = smallest;
    }
  }
}
