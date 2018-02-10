import { TestModule } from '../test-module';
import { ControlledTestRun, TestRun, TestRunStatus } from '../test-run';
import { MockExecutor } from '../../spec/mock-executor';

export interface RunRepository {
  register(run: TestRun): string;

  getRun(id: string): TestRun | undefined;
}

export interface TestRunDTO {
  readonly status: TestRunStatus;
  readonly runtime: number;
  readonly exitCode?: number;
  readonly passCount?: number;
  readonly failCount?: number;
  readonly errors?: string[];
}

export class Application {
  constructor(private readonly module: TestModule,
              private readonly repo: RunRepository,
              private readonly executor: MockExecutor) {
  }

  startNewTestRun(suiteName: string): string {
    if (this.module.hasTestSuite(suiteName)) {
      return this.repo.register(
        new ControlledTestRun(
          this.module.runTestSuite(suiteName, this.executor)
        )
      );
    }
    throw new NotFound(suiteName);
  }

  getTestRun(id: string): TestRunDTO {
    const run = this.repo.getRun(id);
    if (run === undefined) {
      throw new NotFound(id);
    }
    const dto = {
      status: run.toStatus(),
      runtime: run.toRuntime(),
    };
    const result = run.toResult();
    return result ? Object.assign(dto, result) : dto;
  }

  cancelTestRun(id: string) {
    const run = this.repo.getRun(id);
    if (run) {
      run.cancel();
    }
  }
}

export class NotFound extends Error {
}
