export interface RunResult {
  readonly runtime: number;
  readonly exitCode: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly errors: string[];
}