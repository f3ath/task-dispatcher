import * as cp from "child_process";
import { ChildProcess } from "child_process";
import { TestModule, TestResult } from "./test";
import { TestRun, TestRunner } from "./dispatcher";

export class LocalRun implements TestRun {
  private readonly started: Date;
  private readonly process: ChildProcess;
  private finished?: Date;
  private result?: TestResult;
  private error?: Error;

  constructor(testModule: TestModule, private readonly suite: string) {
    const cmd = testModule.makeRunCommand(suite);
    this.process = cp.execFile(cmd.command, cmd.args, (error, stdout, stderr) => {
      if (error) {
        this.fail(error);
        return;
      }
      if (!stdout && stderr) {
        this.fail(new Error(stderr));
        return;
      }
      try {
        this.complete(testModule.decodeResult(stdout));
      } catch (e) {
        this.fail(e);
      }
    });
    this.started = new Date();
  }

  cancel() {
    this.process.kill();
  }

  toStatus(): string {
    if (!this.finished) {
      return 'active';
    }
    if (this.result) {
      return 'completed';
    }
    if (this.process.killed) {
      return 'cancelled';
    }
    return 'error';
  }

  toSuiteName() {
    return this.suite;
  }

  toError() {
    return this.error;
  }

  toResult() {
    return this.result;
  }

  toRuntime() {
    return (this.finished || new Date()).getTime() - this.started.getTime();
  }

  private fail(error: Error) {
    this.error = error;
    this.finish();
  }

  private complete(result: TestResult) {
    this.result = result;
    this.finish();
  }

  private finish() {
    this.finished = new Date();
  }
}

export class LocalRunner implements TestRunner {
  run(testModule: TestModule, suit: string): TestRun {
    return new LocalRun(testModule, suit);
  }
}