import { RunRepository } from './application';
import { Run } from '../test';

export class InMemoryRunRepository implements RunRepository {
  private id = 0;
  private readonly map = new Map<string, Run>();

  register(run: Run): string {
    const id = this.nextId();
    this.map.set(id, run);
    return id;
  }

  getRun(id: string): Run | undefined {
    return this.map.get(id);
  }

  private nextId() {
    return (++this.id).toString();
  }
}
