import { Process} from './process';
import { ProcessExecutor } from './process-executor';

export class TestModule {
  constructor(private readonly name: string, private readonly suites: string[]) {
  }

  hasTestSuite(testSuiteName: string): boolean {
    return this.suites.includes(testSuiteName);
  }

  runTestSuite(testSuiteName: string, executor: ProcessExecutor): Process {
    return executor.execute('node', [this.name, testSuiteName]);
  }

}
