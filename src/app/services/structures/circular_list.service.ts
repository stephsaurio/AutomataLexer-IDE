
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CircularListService {

  add(values: Set<string>, value: string): void {
    values.add(value);
  }

  delete(values: Set<string>, value: string): void {
    values.delete(value);
  }

}
