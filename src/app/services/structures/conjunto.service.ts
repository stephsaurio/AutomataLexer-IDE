
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConjuntoService {

  add(values: Set<string>, value: string): void {
    values.add(value);
  }

  delete(values: Set<string>, value: string): void {
    values.delete(value);
  }

}
