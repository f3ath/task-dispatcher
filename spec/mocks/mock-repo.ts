import { RunRepository } from '../../src/dispatcher/application';
import { Run } from '../../src/test';
import { ControlledRun } from '../../src/test';

export class MockRepo implements RunRepository {
  run: Run | undefined;

  register(run: ControlledRun): string {
    this.run = run;
    return 'mock_id';
  }

  getRun(id: string): Run | undefined {
    return (id === 'mock_id') ? this.run : undefined;
  }
}
