import { TestModule } from "./test";
import * as cp from 'child_process';

export class NotFound extends Error {
}

interface Result {
  passed: number,
  failed: number,
  errors: string
}

type Dated<T> = { date: Date, value: T };

function makeDated<T>(v: T): Dated<T> {
  return {date: new Date(), value: v};
}

export class Dispatcher {
  private readonly processList = new Map<string, Dated<cp.ChildProcess>>();
  private readonly errorList = new Map<string, Dated<Error>>();
  private readonly resultList = new Map<string, Dated<Result>>();

  private nextId = 1;

  constructor(private readonly module: TestModule) {
  }

  start(suite: string): string {
    if (this.module.has(suite)) {
      const id = this.generateId();
      const cmd = this.module.makeRunCommand(suite);
      const process = cp.execFile(cmd.command, cmd.args, (error, stdout, stderr) => {
        if (error) {
          this.errorList.set(id, makeDated(error));
          return;
        }
        if (!stdout && stderr) {
          this.errorList.set(id, makeDated(new Error(stderr)));
          return;
        }
        try {
          const result = this.module.decodeResult(stdout, stderr);
          this.resultList.set(id, makeDated(result));
        } catch (e) {
          this.errorList.set(id, makeDated(e));
          return;
        }
      });
      this.processList.set(id, makeDated(process));
      return id;
    }
    throw new NotFound(suite);
  }

  getStatus(id: string): { status: string, runtime: number, error?: Error, result?: Result } {
    const run = this.processList.get(id);
    if (run === undefined) {
      throw new NotFound(id);
    }
    const error = this.errorList.get(id);
    if (error) {
      return {
        status: run.value.killed ? 'cancelled' : 'error',
        runtime: error.date.getTime() - run.date.getTime(),
        error: error.value
      }
    }
    const result = this.resultList.get(id);
    if (result) {
      return {
        status: 'completed',
        runtime: result.date.getTime() - run.date.getTime(),
        result: result.value
      }
    }
    return {
      status: 'active',
      runtime: (new Date()).getTime() - run.date.getTime()
    }
  }

  cancel(id: string) {
    const proc = this.processList.get(id);
    if (!proc) {
      throw new NotFound(id);
    }
    proc.value.kill();
  }

  private generateId(): string {
    return (this.nextId++).toString();
  }
}