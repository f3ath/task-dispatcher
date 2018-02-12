import { TestModule, TestResult } from "./test";
import * as cp from 'child_process';
import { ChildProcess } from 'child_process';

export class NotFound extends Error {
}

class LocalRun {
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

export class Dispatcher {
  private readonly runList = new Map<string, LocalRun>();

  private nextId = 1;

  constructor(private readonly module: TestModule) {
  }

  start(suite: string): string {
    if (!this.module.has(suite)) {
      throw new NotFound(suite);
    }
    const id = this.generateId();

    this.runList.set(id, new LocalRun(this.module, suite));
    return id;
  }

  getStatus(id: string): {
    suite: string, status: string, runtime: number, error ?: Error, result ?: TestResult
  } {
    const run = this.runList.get(id);
    if (run === undefined) {
      throw new NotFound(id);
    }
    const dto = {
      suite: run.toSuiteName(),
      status: run.toStatus(),
      runtime: run.toRuntime()
    };
    const error = run.toError();
    if (error) {
      return Object.assign(dto, {error: error});
    }
    const result = run.toResult();
    if (result) {
      return Object.assign(dto, {result: result});
    }
    return dto;
  }

  cancel(run_id: string) {
    const run = this.runList.get(run_id);
    if (!run) {
      throw new NotFound(run_id);
    }
    run.cancel();
  }

  private generateId(): string {
    return (this.nextId++).toString();
  }
}