
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  enqueue(values: string[], value: string): void {
    values.push(value);
  }

  dequeue(values: string[]): string | undefined {
    return values.shift();
  }
}
