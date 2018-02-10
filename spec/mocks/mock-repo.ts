import { RunRepository } from '../../src/dispatcher/application';
import { TestRun } from '../../src/test-run';
import { ControlledTestRun } from '../../src/controlled-test-run';

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
