import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Grafica } from './grafica/grafica';
import { Lexer } from './services/lexer';
import { SyntaxHighlighter } from './services/syntax-highlighter';
import { SyntaxAnalyzer } from './services/syntax-analyzer';
import { Token } from './models/token';
import { AnalysisError } from './models/analysis-error';
import { StructureGraph, StructureRunner } from './services/structure-runner';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Grafica],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  text = '';
  highlightedCode = '';

  tokens: Token[] = [];
  errors: AnalysisError[] = [];
  graphs: StructureGraph[] = [];
  consoleMessages: string[] = [];

  activePanel: 'errors' | 'tokens' | 'graphs' | 'console' = 'errors';

  constructor(
    private lexer: Lexer,
    private highlighter: SyntaxHighlighter,
    private syntaxAnalyzer: SyntaxAnalyzer,
    private structureRunner: StructureRunner,
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

    this.errors = lexicalErrors.length ? lexicalErrors : this.syntaxAnalyzer.analyze(this.text);
    this.graphs = [];
    this.consoleMessages = [];

    if (this.errors.length === 0 && this.text.trim()) {
      const result = this.structureRunner.run(this.text);
      this.graphs = result.graphs;
      this.consoleMessages = result.consoleMessages;
    }

    this.highlightedCode = this.highlighter.highlight(this.text);
    this.activePanel = this.errors.length
      ? 'errors'
      : this.graphs.length
        ? 'graphs'
        : this.consoleMessages.length
          ? 'console'
          : 'tokens';
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
