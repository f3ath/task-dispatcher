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

