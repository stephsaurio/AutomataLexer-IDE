import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import { LexicalError } from '../models/lexical-error';

//automaton states
enum LexerState {
  A, //start
  B, //identifier
  C, //number
  D, //line comment
  E, //block comment
  F, //string
}

@Injectable({
  providedIn: 'root',
})
export class Lexer {
  //tokens and lexical errors
  errors: LexicalError[] = [];
  tokens: Token[] = [];

  //reserved words
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
    'FRESITA'
  ];

  //lexical analysis
  analyze(text: string): void {
    this.tokens = [];
    this.errors = [];

    //initial state
    let estado = LexerState.A;

    //line and column position
    let fila = 1;
    let columna = 0;

    //current token
    let token: Token | null = null;

    //read text character by character
    const caracteres = [...text, '\n'];

    for (let i = 0; i < caracteres.length; i++) {
      const c = caracteres[i];

      //get ASCII code
      const codigo = c.charCodeAt(0);

      columna++;

      //check current automaton state
      switch (estado) {
        //state A: start
        case LexerState.A:
          switch (codigo) {
            case 32: //32 = space
            case 9: //9 = tab
            case 13: //13 = carriage return
              break;

            case 10: //10 = line break
              fila++;
              columna = 0;
              break;

            case 34: //34 = "
              token = this.llenarToken('Cadena', '"', fila, columna);

              //A -> F
              estado = LexerState.F;
              break;

            //47 = /
            case 47:
              //47 = / -> line comment //
              if (caracteres[i + 1]?.charCodeAt(0) === 47) {
                token = this.llenarToken('Comentario', '//', fila, columna);

                i++;
                columna++;

                //A -> D
                estado = LexerState.D;

                //42 = * -> block comment /*
              } else if (caracteres[i + 1]?.charCodeAt(0) === 42) {
                token = this.llenarToken('Comentario', '/*', fila, columna);

                i++;
                columna++;

                //A -> E
                estado = LexerState.E;

                //47 = / -> division operator
              } else {
                this.tokens.push(this.llenarToken('Operador', '/', fila, columna));
              }

              break;

            case 61: //61 = =
            case 43: //43 = +
            case 45: //45 = -
            case 42: //42 = *
            case 37: //37 = %
            case 60: //60 = <
            case 62: //62 = >
              this.tokens.push(this.llenarToken('Operador', c, fila, columna));

              break;

            case 44: //44 = ,
            case 59: //59 = ;
            case 40: //40 = (
            case 41: //41 = )
            case 123: //123 = {
            case 125: //125 = }
            case 91: //91 = [
            case 93: //93 = ]
              this.tokens.push(this.llenarToken('Simbolo', c, fila, columna));

              break;

            default:
              //65-90 = A-Z
              //97-122 = a-z
              //95 = _
              if (
                (codigo >= 65 && codigo <= 90) ||
                (codigo >= 97 && codigo <= 122) ||
                codigo === 95
              ) {
                token = this.llenarToken('Identificador', c, fila, columna);

                //A -> B
                estado = LexerState.B;

                //48-57 = 0-9
              } else if (codigo >= 48 && codigo <= 57) {
                token = this.llenarToken('Numero', c, fila, columna);

                //A -> C
                estado = LexerState.C;

                //unknown character
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

        //state B: identifier
        case LexerState.B:
          switch (codigo) {
            case 48: //48 = 0
            case 49: //49 = 1
            case 50: //50 = 2
            case 51: //51 = 3
            case 52: //52 = 4
            case 53: //53 = 5
            case 54: //54 = 6
            case 55: //55 = 7
            case 56: //56 = 8
            case 57: //57 = 9
              token!.lexeme += c;
              break;

            default:
              //65-90 = A-Z
              //97-122 = a-z
              if (
                (codigo >= 65 && codigo <= 90) ||
                (codigo >= 97 && codigo <= 122) ||
                codigo === 95 //95 = _
              ) {
                token!.lexeme += c;

                //identifier finished
              } else {
                //check reserved word
                if (this.reservedWords.includes(token!.lexeme)) {
                  token!.type = token!.lexeme;
                }

                this.tokens.push(token!);

                token = null;

                //B -> A
                estado = LexerState.A;

                //process current character again
                i--;
                columna--;
              }

              break;
          }

          break;

        //state C: number
        case LexerState.C:
          switch (codigo) {
            case 48: //48 = 0
            case 49: //49 = 1
            case 50: //50 = 2
            case 51: //51 = 3
            case 52: //52 = 4
            case 53: //53 = 5
            case 54: //54 = 6
            case 55: //55 = 7
            case 56: //56 = 8
            case 57: //57 = 9
              token!.lexeme += c;
              break;

            //number finished
            default:
              this.tokens.push(token!);

              token = null;

              //C -> A
              estado = LexerState.A;

              //process current character again
              i--;
              columna--;

              break;
          }

          break;

        //state D: line comment
        case LexerState.D:
          switch (codigo) {
            //10 = line break
            case 10: //10 = line break
              this.tokens.push(token!);

              token = null;

              fila++;
              columna = 0;

              //D -> A
              estado = LexerState.A;

              break;

            //continue comment
            default:
              token!.lexeme += c;
              break;
          }

          break;

        //state E: block comment
        case LexerState.E:
          switch (codigo) {
            case 42: //42 = *
              if (caracteres[i + 1]?.charCodeAt(0) === 47) {
                //47 = / -> */
                token!.lexeme += '*/';

                i++;
                columna++;

                this.tokens.push(token!);

                token = null;

                //E -> A
                estado = LexerState.A;
              } else {
                token!.lexeme += c;
              }

              break;

            case 10: //10 = line break
              token!.lexeme += '\n';

              fila++;
              columna = 0;

              break;

            //continue comment
            default:
              token!.lexeme += c;
              break;
          }

          break;

        //state F: string
        case LexerState.F:
          switch (codigo) {
            case 34: //34 = "
              token!.lexeme += c;

              this.tokens.push(token!);

              token = null;

              //F -> A
              estado = LexerState.A;

              break;

            case 10: //10 = line break -> unclosed string
              this.errors.push({
                message: 'Unclosed string',
                line: token!.line,
                column: token!.column,
              });

              token = null;

              fila++;
              columna = 0;

              //F -> A
              estado = LexerState.A;

              break;

            //continue string
            default:
              token!.lexeme += c;
              break;
          }

          break;
      }
    }
  }

  //create token
  private llenarToken(type: string, lexeme: string, line: number, column: number): Token {
    return {
      type,
      lexeme,
      line,
      column,
    };
  }
}
