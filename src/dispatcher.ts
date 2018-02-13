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

  /**
   * Start a new test run, return run id
   */
  start(suite: string): string {
    if (this.module.has(suite)) {
      return this.startNewRun(suite);
    }
    throw new NotFound(suite);
  }

  /**
   * Get status of existing test run
   */
  getStatus(id: string): { suite: string, status: string, runtime: number, error ?: Error, result ?: TestResult } {
    const run = this.runList.get(id);
    if (!run) {
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

  /**
   * Cancel test run
   */
  cancel(id: string) {
    const run = this.runList.get(id);
    if (!run) {
      throw new NotFound(id);
    }
    run.cancel();
  }

  private startNewRun(suite: string) {
    const id = this.generateId();
    const run = this.runner.run(this.module, suite);
    this.runList.set(id, run);
    return id;
  }

  private generateId(): string {
    return (this.nextId++).toString();
  }
}
