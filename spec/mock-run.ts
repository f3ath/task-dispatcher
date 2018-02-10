import { TestRun, TestRunResult, TestRunStatus } from '../src/test-run';

export class MockRun implements TestRun {
  constructor(private status: TestRunStatus, private runtime: number, private result?: TestRunResult) {
  }

  toStatus(): TestRunStatus {
    return this.status;
  }

  toRuntime(): number {
    return this.runtime;
  }

  toResult(): TestRunResult | undefined {
    return this.result;
  }

  cancel(): void {
  }
}
