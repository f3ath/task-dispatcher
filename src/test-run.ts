import { Process } from './process';

export type TestRunStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface TestRun {
  toStatus(): TestRunStatus;

  toRuntime(): number;

  toResult(): TestRunResult | undefined;

  cancel(): void;
}

export class TestRunResult {
  constructor(readonly runtime: number,
              readonly exitCode: number,
              readonly passCount: number,
              readonly failCount: number,
              readonly errors: string[]) {
    Object.freeze(this);
  }
}

export class ControlledTestRun implements TestRun {

  constructor(private readonly proc: Process) {

  }

  toStatus(): TestRunStatus {
    return 'scheduled';
  }

  toRuntime(): number {
    return 0
  }

  toResult() {
    return undefined;
  }

  cancel(): void {
  }
}
