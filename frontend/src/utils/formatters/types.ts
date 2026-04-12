export interface Formatter<TOutput = string, TInput = string> {
  format: (value: string | number) => string;
  parse: (value: TInput) => TOutput;
}
