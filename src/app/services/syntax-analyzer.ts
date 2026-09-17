import { Injectable } from '@angular/core';
import { AnalysisError } from '../models/analysis-error';
import { parse } from '../grammar/language-parser.js';

@Injectable({
  providedIn: 'root'
})
export class SyntaxAnalyzer {

  analyze(text: string): AnalysisError[] {
    const errors: AnalysisError[] = [];
    const statements = text.split(';');

    let position = 0;

    for (const statement of statements) {
      const code = statement.trim();

      if (code === '' || this.isOnlyComment(code)) {
        position += statement.length + 1;
        continue;
      }

      try {
        parse(code + ';');
      } catch (error: any) {
        const errorOffset =
          position + (error.location?.start?.offset || 0);

        errors.push({
          type: 'Syntax',
          message: this.formatErrorMessage(error),
          line: this.getLine(text, errorOffset),
          column: this.getColumn(text, errorOffset)
        });
      }

      position += statement.length + 1;
    }

    return errors;
  }

  private isOnlyComment(text: string): boolean {
    let code = text;

    code = code.replace(/\/\/.*$/gm, '');
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');

    return code.trim() === '';
  }

  private formatErrorMessage(error: any): string {
    if (error.found !== undefined && error.expected) {
      const found = error.found
        ? `'${error.found}'`
        : 'end of statement';

      return `Syntax error: Unexpected ${found}.`;
    }

    return error.message || 'Invalid syntax';
  }

  private getLine(text: string, offset: number): number {
    return text.substring(0, offset).split('\n').length;
  }

  private getColumn(text: string, offset: number): number {
    const lines = text.substring(0, offset).split('\n');
    return lines[lines.length - 1].length + 1;
  }
}