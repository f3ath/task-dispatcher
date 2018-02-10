import { RunResult } from "./run-result";

export type RunStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Run {
  toStatus(): RunStatus;

  toRuntime(): number;

  toResult(): RunResult | undefined;

  cancel(): void;
}