import { RunStatus } from "../run";

export interface TestRun {
  readonly status: RunStatus;
  readonly runtime: number;
  readonly test?: {
    readonly passCount: number;
    readonly failCount: number;
    readonly errors: string[];
  }
}