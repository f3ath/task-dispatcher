import { Executor } from "./process-executor";
import { ResultParser } from "./result-parser";
import { ControlledRun } from "./controlled-run";

export class Module {
  constructor(private readonly name: string,
              private readonly suites: string[],
              private readonly parser: ResultParser) {
  }

  hasTestSuite(testSuiteName: string): boolean {
    return this.suites.includes(testSuiteName);
  }

  runTestSuite(testSuiteName: string, executor: Executor): ControlledRun {
    const process = executor.execute('node', [this.name, testSuiteName]);
    return new ControlledRun(process, this.parser);
  }

}