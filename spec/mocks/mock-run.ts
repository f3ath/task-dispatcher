import { Run, RunStatus } from "../../src/run";
import { RunResult } from "../../src/run-result";

export class MockRun implements Run {
  constructor(private status: RunStatus, private runtime: number, private result?: RunResult) {
  }

  toStatus(): RunStatus {
    return this.status;
  }

  toRuntime(): number {
    return this.runtime;
  }

  toResult(): RunResult | undefined {
    return this.result;
  }

  cancel(): void {
  }
}