export interface AnalysisError {
  type: 'Lexical' | 'Syntax';
  message: string;
  line: number;
  column: number;
}