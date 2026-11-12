import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HashService {

  set(values: Map<string, string>, key: string, value: string): void {
    values.set(key, value);
  }

  get(values: Map<string, string>, key: string): void {
    values.delete(key);
  }
}