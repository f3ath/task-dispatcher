import { Process } from './process';
import { TestRun, TestRunStatus } from './test-run';

export class ControlledTestRun implements TestRun {
  private _status: TestRunStatus = 'scheduled';

  constructor(private readonly process: Process) {
    process.onStart(() => this._status = 'active');
    process.onExit(() => this._status = 'completed');
  }

  toStatus(): TestRunStatus {
    return this._status;
  }

  toRuntime(): number {
    return 0
  }

  toResult() {
    return undefined;
  }

  cancel(): void {
    if (this.toStatus() === 'active') {
      this.process.terminate();
    }
  }
}
