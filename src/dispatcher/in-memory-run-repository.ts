import { RunRepository } from './application';
import { TestRun } from '../test-run';

export class InMemoryRunRepository implements RunRepository {
  private id = 0;
  private readonly map = new Map<string, TestRun>();

  register(run: TestRun): string {
    const id = this.nextId();
    this.map.set(id, run);
    return id;
  }

  getRun(id: string): TestRun | undefined {
    return this.map.get(id);
  }

  private nextId() {
    return (++this.id).toString();
  }
}
