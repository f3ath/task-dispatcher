import { Module, Run, RunStatus } from '../test';
import { Executor } from "../process";

export interface RunRepository {
  register(run: Run): string;

  getRun(id: string): Run | undefined;
}

export interface TestRun {
  readonly status: RunStatus;
  readonly runtime: number;
  readonly exitCode?: number;
  readonly passCount?: number;
  readonly failCount?: number;
  readonly errors?: string[];
}

export class Application {
  constructor(private readonly module: Module,
              private readonly repo: RunRepository,
              private readonly executor: Executor) {
  }

  startNewTestRun(suiteName: string): string {
    if (this.module.hasTestSuite(suiteName)) {
      const run = this.module.runTestSuite(suiteName, this.executor);
      return this.repo.register(run);
    }
    throw new NotFound(suiteName);
  }

  getTestRun(id: string): TestRun {
    const run = this.getRunOrThrowNotFound(id);
    return this.createDTO(run);
  }

  private createDTO(run: Run): TestRun {
    const dto = {
      status: run.toStatus(),
      runtime: run.toRuntime(),
    };
    const result = run.toResult();
    return result ? Object.assign(dto, result) : dto;
  }

  cancelTestRun(id: string) {
    this.getRunOrThrowNotFound(id).cancel();
  }

  private getRunOrThrowNotFound(id: string): Run {
    const run = this.repo.getRun(id);
    if (run) {
      return run;
    }
    throw new NotFound(id);
  }
}

export class NotFound extends Error {
}
