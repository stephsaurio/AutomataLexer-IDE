import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { LexicalError } from '../models/lexical-error';
enum LexerState {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
}

@Injectable({
  providedIn: 'root',
})
export class Lexer {
  errors: LexicalError[] = [];
  tokens: Token[] = [];
  reservedWords = [
    'STACK',
    'QUEUE',
    'LIST',
    'HASH',
    'TREE',
    'PUSH',
    'POP',
    'ENQUEUE',
    'DEQUEUE',
    'INSERT',
    'REMOVE',
    'SET',
    'GET',
    'ADDNODE',
    'ROOT',
    'LEFT',
    'RIGHT',
    'PRINT',
    'GRAPH',
    'CLEAR',
    'cout',
    'cin',
  ];

  // Tokeniza el texto de entrada
  analyze(text: string): void {
    this.tokens = [];
    this.errors = [];
    let estado = LexerState.A;
    let fila = 1;
    let columna = 0;
    let token: Token | null = null;
    const caracteres = [...text, '\n'];

    for (let i = 0; i < caracteres.length; i++) {
      const c = caracteres[i];
      const codigo = c.charCodeAt(0);

      columna++;
      switch (estado) {
        case LexerState.A:
          switch (codigo) {
            case 32:
            case 9:
            case 13:
              break;

            case 10:
              fila++;
              columna = 0;
              break;

            case 34:
              token = this.llenarToken('STRING', '"', fila, columna);
              estado = LexerState.F;
              break;
            case 47:
              if (caracteres[i + 1]?.charCodeAt(0) === 47) {
                token = this.llenarToken('COMMENT', '//', fila, columna);

                i++;
                columna++;
                estado = LexerState.D;
              } else if (caracteres[i + 1]?.charCodeAt(0) === 42) {
                token = this.llenarToken('COMMENT', '/*', fila, columna);

                i++;
                columna++;
                estado = LexerState.E;
              } else {
                this.tokens.push(this.llenarToken('OPERATOR', '/', fila, columna));
              }

              break;

            case 60:
              token = this.llenarToken('OPERATOR', '<', fila, columna);

              estado = LexerState.G;

              break;
            case 62:
              token = this.llenarToken('OPERATOR', '>', fila, columna);

              estado = LexerState.H;

              break;
            case 43:
            case 45:
            case 42:
            case 37:
              this.tokens.push(this.llenarToken(c, c, fila, columna));

              break;

            case 44:
            case 59:
            case 40:
            case 41:
            case 123:
            case 125:
            case 91:
            case 93:
              this.tokens.push(this.llenarToken(c, c, fila, columna));

              break;

            default:
              if (
                (codigo >= 65 && codigo <= 90) ||
                (codigo >= 97 && codigo <= 122) ||
                codigo === 95
              ) {
                token = this.llenarToken('ID', c, fila, columna);
                estado = LexerState.B;
              } else if (codigo >= 48 && codigo <= 57) {
                token = this.llenarToken('NUMBER', c, fila, columna);
                estado = LexerState.C;
              } else {
                this.errors.push({
                  message: `Unrecognized symbol: ${c}`,
                  line: fila,
                  column: columna,
                });
              }

              break;
          }

          break;
        case LexerState.B:
          if (/[a-zA-Z0-9_]/.test(c)) {
            token!.lexeme += c;
          } else {
            if (token!.lexeme === 'cout') {
              token!.type = 'Character output';
            } else if (token!.lexeme === 'cin') {
              token!.type = 'Character input';
            } else if (this.reservedWords.includes(token!.lexeme)) {
              token!.type = token!.lexeme;
            }
            this.tokens.push(token!);
            token = null;
            estado = LexerState.A;
            i--;
            columna--;
          }
          break;
        case LexerState.C:
          if (/[0-9]/.test(c)) {
            token!.lexeme += c;
          } else {
            this.tokens.push(token!);
            token = null;
            estado = LexerState.A;
            i--;
            columna--;
          }
          break;
        case LexerState.D:
          switch (codigo) {
            case 10:
              token = null;

              fila++;
              columna = 0;
              estado = LexerState.A;

              break;
            default:
              token!.lexeme += c;
              break;
          }

          break;
        case LexerState.E:
          switch (codigo) {
            case 42:
              if (caracteres[i + 1]?.charCodeAt(0) === 47) {
                token!.lexeme += '*/';

                i++;
                columna++;

                token = null;
                estado = LexerState.A;
              } else {
                token!.lexeme += c;
              }

              break;

            case 10:
              token!.lexeme += '\n';

              fila++;
              columna = 0;

              break;
            default:
              token!.lexeme += c;
              break;
          }

          break;
        case LexerState.F:
          switch (codigo) {
            case 34:
              token!.lexeme += c;

              this.tokens.push(token!);

              token = null;
              estado = LexerState.A;

              break;

            case 10:
              this.errors.push({
                message: 'Unclosed string',
                line: token!.line,
                column: token!.column,
              });

              token = null;

              fila++;
              columna = 0;
              estado = LexerState.A;

              break;
            default:
              token!.lexeme += c;
              break;
          }

          break;

        case LexerState.G:
          if (codigo === 60) {
            token!.lexeme += c;
            token!.type = 'Insertion operator';
            this.tokens.push(token!);
            token = null;
            estado = LexerState.A;
          } else {
            this.tokens.push(token!);
            token = null;
            estado = LexerState.A;
            i--;
            columna--;
          }
          break;
        case LexerState.H:
          if (codigo === 62) {
            token!.lexeme += c;
            token!.type = 'Extraction operator';
            this.tokens.push(token!);
            token = null;
            estado = LexerState.A;
          } else {
            this.tokens.push(token!);
            token = null;
            estado = LexerState.A;
            i--;
            columna--;
          }
          break;
      }
    }
  }
  private llenarToken(type: string, lexeme: string, line: number, column: number): Token {
    return {
      type,
      lexeme,
      line,
      column,
    };
  }
}
