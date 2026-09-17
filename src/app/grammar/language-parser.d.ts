export function parse(input: string): unknown;

export class SyntaxError extends Error {
  location: {
    start: {
      line: number;
      column: number;
    };
  };
}