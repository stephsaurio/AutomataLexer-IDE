export function parse(input: string): unknown;

export class SyntaxError extends Error {
  found?: string | null;
  expected?: Array<{
    type: string;
    text?: string;
    description?: string;
  }>;
  location: {
    start: {
      offset: number;
      line: number;
      column: number;
    };
  };
}
