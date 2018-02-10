import { RunRepository } from '../src/app/app';
import { ControlledTestRun, TestRun } from '../src/test-run';

export class MockRepo implements RunRepository {
  run: TestRun | undefined;

  register(run: ControlledTestRun): string {
    this.run = run;
    return 'mock_id';
  }

  getRun(id: string): TestRun | undefined {
    return (id === 'mock_id') ? this.run : undefined;
  }
}
