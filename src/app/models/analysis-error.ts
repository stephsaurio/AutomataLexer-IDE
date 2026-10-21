export interface AnalysisError {
  type: 'Lexical' | 'Syntax';
  found?: string;
  message: string;
  line: number;
  column: number;
}
