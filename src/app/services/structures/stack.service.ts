import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StackService {
  push(values: string[], value: string): void {
    values.push(value);
  }

  pop(values: string[]): string | undefined {
    return values.pop();
  }
}
