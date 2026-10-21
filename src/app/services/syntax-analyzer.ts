import { Injectable } from '@angular/core';
import { parse, SyntaxError } from '../grammar/language-parser.js';
import { AnalysisError } from '../models/analysis-error';

@Injectable({ providedIn: 'root' })
export class SyntaxAnalyzer {
  analyze(text: string): AnalysisError[] {
    if (!text.trim()) return [];

    try {
      parse(text);
      return [];
    } catch (error) {
      const syntaxError = error as SyntaxError & {
        found?: string | null;
        expected?: Array<{ type?: string; text?: string; description?: string }>;
      };
      const offset = syntaxError.location?.start?.offset ?? 0;
      const found = syntaxError.found ?? 'EOF';
      const expected = [
        ...new Set(
          (syntaxError.expected ?? []).map((item) => {
            if (item.type === 'literal') return `'${item.text ?? ''}'`;
            if (item.type === 'other') return item.description ?? 'valid input';
            if (item.type === 'end') return 'end of input';
            if (item.type === 'any') return 'a character';
            return 'a valid character';
          }),
        ),
      ];
      const expectation = expected.length ? `Expected ${expected.join(' or ')}.` : 'Syntax error.';

      return [
        {
          type: 'Syntax',
          found: found === 'EOF' ? 'EOF' : `'${found}'`,
          message: expectation,
          line: this.getLine(text, offset),
          column: this.getColumn(text, offset),
        },
      ];
    }
  }

  private getLine(text: string, offset: number): number {
    return text.slice(0, offset).split('\n').length;
  }

  private getColumn(text: string, offset: number): number {
    return text.slice(0, offset).split('\n').at(-1)!.length + 1;
  }
}
