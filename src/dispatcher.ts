import { TestModule, TestResult } from "./test";

export class NotFound extends Error {
}

export interface TestRun {
  cancel(): void;

  toStatus(): string;

  toSuiteName(): string;

  toError(): void;

  toResult(): void;

  toRuntime(): number;
}

export interface TestRunner {
  run(m: TestModule, suit: string): TestRun;
}
export class Dispatcher {
  private readonly runList = new Map<string, TestRun>();

  private nextId = 1;

  constructor(private readonly module: TestModule,
              private readonly runner: TestRunner) {
  }

  start(suite: string): string {
    if (!this.module.has(suite)) {
      throw new NotFound(suite);
    }
    const id = this.generateId();

    this.runList.set(id, this.runner.run(this.module, suite));
    return id;
  }

  getStatus(id: string): {
    suite: string, status: string, runtime: number, error ?: Error, result ?: TestResult
  } {
    const run = this.runList.get(id);
    if (run === undefined) {
      throw new NotFound(id);
    }
    const dto = {
      suite: run.toSuiteName(),
      status: run.toStatus(),
      runtime: run.toRuntime()
    };
    const error = run.toError();
    if (error) {
      return Object.assign(dto, {error: error});
    }
    const result = run.toResult();
    if (result) {
      return Object.assign(dto, {result: result});
    }
    return dto;
  }

  cancel(run_id: string) {
    const run = this.runList.get(run_id);
    if (!run) {
      throw new NotFound(run_id);
    }
    run.cancel();
  }

  private generateId(): string {
    return (this.nextId++).toString();
  }
}