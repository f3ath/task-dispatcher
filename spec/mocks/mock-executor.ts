import { Process} from '../../src/process';
import { Executor } from '../../src/process';

export class MockExecutor implements Executor {
  process?: Process;

  execute(): Process {
    return this.process!;
  }

}
