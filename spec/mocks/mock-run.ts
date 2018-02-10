import { RunStatus } from '../../src/test';
import {RunResult} from "../../src/test";
import {Run} from "../../src/test";

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
