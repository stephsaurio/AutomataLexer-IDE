import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lexer } from './services/lexer';
import { SyntaxHighlighter } from './services/syntax-highlighter';
import { SyntaxAnalyzer } from './services/syntax-analyzer';
import { Token } from './models/token';
import { AnalysisError } from './models/analysis-error';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  text = '';
  highlightedCode = '';

  tokens: Token[] = [];
  errors: AnalysisError[] = [];

  activePanel: 'errors' | 'tokens' = 'errors';

  constructor(
    private lexer: Lexer,
    private highlighter: SyntaxHighlighter,
    private syntaxAnalyzer: SyntaxAnalyzer,
  ) {}

  analyze(): void {
    this.lexer.analyze(this.text);
    this.tokens = this.lexer.tokens;

    const lexicalErrors: AnalysisError[] = this.lexer.errors.map(({ message, line, column }) => ({
      type: 'Lexical',
      message,
      line,
      column,
    }));

    this.errors = lexicalErrors.length
      ? lexicalErrors
      : this.syntaxAnalyzer.analyze(this.text);
    this.highlightedCode = this.highlighter.highlight(this.text);
    this.activePanel = this.errors.length ? 'errors' : 'tokens';
  }

  updateHighlight(): void {
    this.highlightedCode = this.highlighter.highlight(this.text);
  }

  syncScroll(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    const lineNumbers = document.querySelector('.line-number-list') as HTMLElement;

    const highlightedCode = document.querySelector('.highlighted-code') as HTMLElement;

    lineNumbers.style.transform = `translateY(-${textarea.scrollTop}px)`;

    highlightedCode.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
  }
}
