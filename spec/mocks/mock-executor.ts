import { Process} from '../../src/process';
import { ProcessExecutor } from '../../src/process-executor';

export class MockExecutor implements ProcessExecutor {
  process?: Process;

  execute(): Process {
    return this.process!;
  }

}
