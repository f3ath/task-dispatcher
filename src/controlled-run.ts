import { Process } from "./process";
import { Run, RunStatus } from "./run";
import { OutputParser } from "./output-parser";
import { RunResult } from "./run-result";

export class ControlledRun implements Run {
  private _status: RunStatus = 'scheduled';
  private _result: RunResult | undefined;

  constructor(private readonly process: Process, parser: OutputParser) {
    process.onStart(() => this._status = 'active');
    process.onExit((code, out, err) => {
      this._status = 'completed';
      this._result = parser.parse(out);
    });
  }

  toStatus(): RunStatus {
    return this._status;
  }

  toRuntime(): number {
    return this.process.toRuntime();
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