
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  insert(values: string[], value: string): void {
    values.push(value);
  }

  remove(values: string[], value: string): void {
    const index = values.indexOf(value);

    if (index >= 0) {
      values.splice(index, 1);
    }
  }
}
