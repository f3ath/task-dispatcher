import { RunRepository } from "../../src/dispatcher/run-repository";
import { Run } from "../../src/run";
import { ControlledRun } from "../../src/controlled-run";

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