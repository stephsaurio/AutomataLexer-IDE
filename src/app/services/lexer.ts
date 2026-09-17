import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { LexicalError } from '../models/lexical-error';

enum LexerState {
  A,
  B,
  C,
  D,
  E,
  F
}

@Injectable({
  providedIn: 'root'
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
    'GRAPH'
  ];

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
              token = this.llenarToken(
                'Cadena',
                '"',
                fila,
                columna
              );

              estado = LexerState.F;
              break;

            case 47:

              if (
                caracteres[i + 1]?.charCodeAt(0) === 47
              ) {

                token = this.llenarToken(
                  'Comentario',
                  '//',
                  fila,
                  columna
                );

                i++;
                columna++;

                estado = LexerState.D;

              } else if (
                caracteres[i + 1]?.charCodeAt(0) === 42
              ) {

                token = this.llenarToken(
                  'Comentario',
                  '/*',
                  fila,
                  columna
                );

                i++;
                columna++;

                estado = LexerState.E;

              } else {

                this.tokens.push(
                  this.llenarToken(
                    'Operador',
                    '/',
                    fila,
                    columna
                  )
                );
              }

              break;

            case 61:
            case 43:
            case 45:
            case 42:
            case 37:
            case 60:
            case 62:

              this.tokens.push(
                this.llenarToken(
                  'Operador',
                  c,
                  fila,
                  columna
                )
              );

              break;

            case 44:
            case 59:
            case 40:
            case 41:
            case 123:
            case 125:
            case 91:
            case 93:

              this.tokens.push(
                this.llenarToken(
                  'Simbolo',
                  c,
                  fila,
                  columna
                )
              );

              break;

            default:

              if (
                (codigo >= 65 && codigo <= 90) ||
                (codigo >= 97 && codigo <= 122) ||
                codigo === 95
              ) {

                token = this.llenarToken(
                  'Identificador',
                  c,
                  fila,
                  columna
                );

                estado = LexerState.B;

              } else if (
                codigo >= 48 &&
                codigo <= 57
              ) {

                token = this.llenarToken(
                  'Numero',
                  c,
                  fila,
                  columna
                );

                estado = LexerState.C;

              } else {

                this.errors.push({
                  message: `Unrecognized symbol: ${c}`,
                  line: fila,
                  column: columna
                });
              }

              break;
          }

          break;

        case LexerState.B:

          switch (codigo) {

            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:

              token!.lexeme += c;
              break;

            default:

              if (
                (codigo >= 65 && codigo <= 90) ||
                (codigo >= 97 && codigo <= 122) ||
                codigo === 95
              ) {

                token!.lexeme += c;

              } else {

                if (
                  this.reservedWords.includes(token!.lexeme)
                ) {
                  token!.type = token!.lexeme;
                }

                this.tokens.push(token!);

                token = null;
                estado = LexerState.A;

                i--;
                columna--;
              }

              break;
          }

          break;

        case LexerState.C:

          switch (codigo) {

            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:

              token!.lexeme += c;
              break;

            default:

              this.tokens.push(token!);

              token = null;
              estado = LexerState.A;

              i--;
              columna--;

              break;
          }

          break;

        case LexerState.D:

          switch (codigo) {

            case 10:

              this.tokens.push(token!);

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

              if (
                caracteres[i + 1]?.charCodeAt(0) === 47
              ) {

                token!.lexeme += '*/';

                i++;
                columna++;

                this.tokens.push(token!);

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
                column: token!.column
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
      }
    }
  }

  private llenarToken(
    type: string,
    lexeme: string,
    line: number,
    column: number
  ): Token {

    return {
      type,
      lexeme,
      line,
      column
    };
  }
}