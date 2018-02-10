import { Process, Executor } from "./process";

export type RunStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface RunResult {
  readonly runtime: number;
  readonly exitCode: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly errors: string[];
}

export interface Run {
  toStatus(): RunStatus;

  toRuntime(): number;

  toResult(): RunResult | undefined;

  cancel(): void;
}

export interface ResultParser {
  parse(code: number, stdout: string, stderr: string): RunResult;
}

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

export class Module {
  constructor(private readonly name: string,
              private readonly suites: string[],
              private readonly parser: ResultParser) {
  }

  hasTestSuite(testSuiteName: string): boolean {
    return this.suites.includes(testSuiteName);
  }

  runTestSuite(testSuiteName: string, executor: Executor): ControlledRun {
    const process = executor.execute('node', [this.name, testSuiteName]);
    return new ControlledRun(process, this.parser);
  }

}
