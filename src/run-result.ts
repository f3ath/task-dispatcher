export interface RunResult {
  readonly passCount: number;
  readonly failCount: number;
  readonly errors: string[];
}