import { Process } from "./process";
import { Run, RunStatus } from "./run";
import { ResultParser } from "./result-parser";
import { RunResult } from "./run-result";

export class ControlledRun implements Run {
  private _status: RunStatus = 'scheduled';
  private _result: RunResult | undefined;

  constructor(private readonly process: Process, parser: ResultParser) {
    process.onStart(() => this._status = 'active');
    process.onExit((code, out, err) => {
      this._status = 'completed';
      this._result = parser.parse(code, out, err);
    });
  }

  toStatus(): RunStatus {
    return this._status;
  }

  toRuntime(): number {
    if (this.isActive()) {
      return this.process.toRuntime();
    }
    if (this._result) {
      return this._result.runtime
    }
    return 0
  }

  toResult() {
    return undefined;
  }

  cancel(): void {
    if (this.isActive()) {
      this.process.terminate();
    }
  }

  private isActive() {
    return this._status === 'active';
  }
}