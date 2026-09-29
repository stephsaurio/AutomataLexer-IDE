import { Injectable } from '@angular/core';

//highlighting states
enum HighlightState {
  START, //initial state
  IDENTIFIER, //identifier state
  NUMBER, //number state
  STRING, //string state
  LINE_COMMENT, //line comment state
  BLOCK_COMMENT, //block comment state
}

@Injectable({
  providedIn: 'root',
})
export class SyntaxHighlighter {
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
    'cout',
    'cin',
  ];

  //highlight source text
  highlight(text: string): string {
    let result = '';
    let i = 0;
    let state = HighlightState.START;

    let lexeme = '';

    //read text character by character
    while (i < text.length) {
      const character = text[i];

      if (state === HighlightState.START) {
        //detect line comments
        if (text.startsWith('//', i)) {
          state = HighlightState.LINE_COMMENT;
          lexeme = '//';
          i += 2;
          continue;
        }

        //detect block comments
        if (text.startsWith('/*', i)) {
          state = HighlightState.BLOCK_COMMENT;
          lexeme = '/*';
          i += 2;
          continue;
        }

        //detect strings
        if (character === '"') {
          state = HighlightState.STRING;
          lexeme = '"';
          i++;
          continue;
        }

        //detect identifiers
        if (/[a-zA-Z_]/.test(character)) {
          state = HighlightState.IDENTIFIER;
          lexeme = character;
          i++;
          continue;
        }

        //detect numbers
        if (/[0-9]/.test(character)) {
          state = HighlightState.NUMBER;
          lexeme = character;
          i++;
          continue;
        }

        //detect <<
        if (character === '<' && text[i + 1] === '<') {
          result += `<span class="IO"> << </span>`;
          i += 2;
          continue;
        }
        //detect >>
        if (character === '>' && text[i + 1] === '>') {
          result += `<span class="EO"> >> </span>`;
          i += 2;
          continue;
        }
        //detect operators
        if ('=,;()'.includes(character)) {
          result += `<sp5an class="operator">${this.escapeHtml(character)}</span>`;
          i++;
          continue;
        }

        result += this.escapeHtml(character);
        i++;
        continue;
      }

      if (state === HighlightState.IDENTIFIER) {
        //continue identifier
        if (/[a-zA-Z0-9_]/.test(character)) {
          lexeme += character;
          i++;
          continue;
        }

        //check reserved word

        if (this.reservedWords.includes(lexeme)) {
          if (lexeme === 'cout') {
            result += `<span class="cout">${this.escapeHtml(lexeme)}</span>`;
          } else if (lexeme === 'cin') {
            result += `<span class="cin">${this.escapeHtml(lexeme)}</span>`;
          } else {
            result += `<span class="reserved">${this.escapeHtml(lexeme)}</span>`;
          }
        } else {
          result += `<span class="identifier">${this.escapeHtml(lexeme)}</span>`;
        }

        state = HighlightState.START;
        continue;
      }
      if (state === HighlightState.NUMBER) {
        //continue number
        if (/[0-9]/.test(character)) {
          lexeme += character;
          i++;
          continue;
        }

        result += `<span class="number">${lexeme}</span>`;

        lexeme = '';
        state = HighlightState.START;
        continue;
      }

      if (state === HighlightState.STRING) {
        //close string
        if (character === '"') {
          lexeme += '"';

          result += `<span class="string">${this.escapeHtml(lexeme)}</span>`;

          lexeme = '';
          state = HighlightState.START;

          i++;
          continue;
        }

        //stop at line break
        if (character === '\n' || character === '\r') {
          result += `<span class="string">${this.escapeHtml(lexeme)}</span>`;

          lexeme = '';
          state = HighlightState.START;

          continue;
        }

        lexeme += character;
        i++;
        continue;
      }

      if (state === HighlightState.LINE_COMMENT) {
        //finish line comment
        if (character === '\n') {
          result += `<span class="comment">${this.escapeHtml(lexeme)}</span>`;

          lexeme = '';
          state = HighlightState.START;

          continue;
        }

        lexeme += character;
        i++;
        continue;
      }

      if (state === HighlightState.BLOCK_COMMENT) {
        //close block comment
        if (text.startsWith('*/', i)) {
          lexeme += '*/';

          result += `<span class="comment">${this.escapeHtml(lexeme)}</span>`;

          lexeme = '';
          state = HighlightState.START;

          i += 2;
          continue;
        }

        lexeme += character;
        i++;
      }
    }

    //finish pending identifier
    if (state === HighlightState.IDENTIFIER) {
      if (this.reservedWords.includes(lexeme)) {
        if (lexeme === 'cout') {
          result += `<span class="cout">${this.escapeHtml(lexeme)}</span>`;
        } else if (lexeme === 'cin') {
          result += `<span class="cin">${this.escapeHtml(lexeme)}</span>`;
        } else {
          result += `<span class="reserved">${this.escapeHtml(lexeme)}</span>`;
        }
      } else {
        result += `<span class="identifier">${this.escapeHtml(lexeme)}</span>`;
      }
    }

    //finish pending number
    if (state === HighlightState.NUMBER) {
      result += `<span class="number">${lexeme}</span>`;
    }

    //finish pending string
    if (state === HighlightState.STRING) {
      result += `<span class="string">${this.escapeHtml(lexeme)}</span>`;
    }

    //finish pending line comment
    if (state === HighlightState.LINE_COMMENT) {
      result += `<span class="comment">${this.escapeHtml(lexeme)}</span>`;
    }

    //finish pending block comment
    if (state === HighlightState.BLOCK_COMMENT) {
      result += `<span class="comment">${this.escapeHtml(lexeme)}</span>`;
    }

    return result;
  }

  //escape html characters
  private escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
