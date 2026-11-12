import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lexer } from './services/lexer';
import { SyntaxHighlighter } from './services/syntax-highlighter';
import { SyntaxAnalyzer } from './services/syntax-analyzer';
import { Token } from './models/token';
import { AnalysisError } from './models/analysis-error';
import { StructureGraph, StructureRunner } from './services/structure-runner';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  @ViewChildren('graphContainer') graphContainers!: QueryList<ElementRef<HTMLDivElement>>;

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
      this.graphs.forEach((graph) => {
        const url = `https://dreampuf.github.io/GraphvizOnline/#${encodeURIComponent(graph.dot)}`;
        window.open(url, '_blank');
      });
    }

    this.highlightedCode = this.highlighter.highlight(this.text);
    this.activePanel = this.errors.length
      ? 'errors'
      : this.graphs.length
        ? 'graphs'
        : this.consoleMessages.length
          ? 'console'
          : 'tokens';
    if (this.graphs.length) window.setTimeout(() => void this.renderGraphs());
  }

  private async renderGraphs(): Promise<void> {
    const d3 = await import('d3');
    await import('d3-graphviz');
    this.graphContainers.forEach((container, index) => {
      const graph = this.graphs[index];
      if (graph) (d3.select(container.nativeElement) as any).graphviz().renderDot(graph.dot);
    });
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
