import { Injectable } from '@angular/core';

enum HighlightState {
  START,
  IDENTIFIER,
  NUMBER,
  STRING,
  LINE_COMMENT,
  BLOCK_COMMENT,
}

@Injectable({
  providedIn: 'root',
})
export class SyntaxHighlighter {
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
    'FRESITA',
  ];

  highlight(text: string): string {
    let result = '';
    let i = 0;
    let state = HighlightState.START;

    let lexeme = '';

    while (i < text.length) {
      const character = text[i];

      if (state === HighlightState.START) {
        if (text.startsWith('//', i)) {
          state = HighlightState.LINE_COMMENT;
          lexeme = '//';
          i += 2;
          continue;
        }

        if (text.startsWith('/*', i)) {
          state = HighlightState.BLOCK_COMMENT;
          lexeme = '/*';
          i += 2;
          continue;
        }

        if (character === '"') {
          state = HighlightState.STRING;
          lexeme = '"';
          i++;
          continue;
        }

        if (/[a-zA-Z_]/.test(character)) {
          state = HighlightState.IDENTIFIER;
          lexeme = character;
          i++;
          continue;
        }

        if (/[0-9]/.test(character)) {
          state = HighlightState.NUMBER;
          lexeme = character;
          i++;
          continue;
        }

        if ('=,;()'.includes(character)) {
          result += `<span class="operator">${this.escapeHtml(character)}</span>`;
          i++;
          continue;
        }

        result += this.escapeHtml(character);
        i++;
        continue;
      }

      if (state === HighlightState.IDENTIFIER) {
        if (/[a-zA-Z0-9_]/.test(character)) {
          lexeme += character;
          i++;
          continue;
        }

        if (this.reservedWords.includes(lexeme)) {
          if (lexeme === 'FRESITA') {
            result += `<span class="fresita">${this.escapeHtml(lexeme)}</span>`;
          } else {
            result += `<span class="reserved">${this.escapeHtml(lexeme)}</span>`;
          }
        } else {
          result += `<span class="identifier">${this.escapeHtml(lexeme)}</span>`;
        }

        lexeme = '';
        state = HighlightState.START;
        continue;
      }

      if (state === HighlightState.NUMBER) {
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
        if (character === '"') {
          lexeme += '"';

          result += `<span class="string">${this.escapeHtml(lexeme)}</span>`;

          lexeme = '';
          state = HighlightState.START;

          i++;
          continue;
        }

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

    if (state === HighlightState.IDENTIFIER) {
      if (this.reservedWords.includes(lexeme)) {
        if (lexeme === 'FRESITA') {
          result += `<span class="fresita">${this.escapeHtml(lexeme)}</span>`;
        } else {
          result += `<span class="reserved">${this.escapeHtml(lexeme)}</span>`;
        }
      } else {
        result += `<span class="identifier">${this.escapeHtml(lexeme)}</span>`;
      }
    }

    if (state === HighlightState.NUMBER) {
      result += `<span class="number">${lexeme}</span>`;
    }

    if (state === HighlightState.STRING) {
      result += `<span class="string">${this.escapeHtml(lexeme)}</span>`;
    }

    if (state === HighlightState.LINE_COMMENT) {
      result += `<span class="comment">${this.escapeHtml(lexeme)}</span>`;
    }

    if (state === HighlightState.BLOCK_COMMENT) {
      result += `<span class="comment">${this.escapeHtml(lexeme)}</span>`;
    }

    return result;
  }

  private escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
