export function parse(input: string): unknown;

export class SyntaxError extends Error {
  location: {
    start: {
      line: number;
      column: number;
    };
  };
}
//npx peggy --format es --dts --output src/app/grammar/language-parser.js src/app/grammar/language.peggy