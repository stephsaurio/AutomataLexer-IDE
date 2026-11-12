import { Injectable } from '@angular/core';
import { parse } from '../grammar/language-parser.js';

export interface StructureGraph {
  name: string;
  dot: string;
}

export interface StructureRunResult {
  graphs: StructureGraph[];
  consoleMessages: string[];
}

@Injectable({ providedIn: 'root' })
export class StructureRunner {
  run(text: string): StructureRunResult {
    return parse(text) as StructureRunResult;
  }
}
