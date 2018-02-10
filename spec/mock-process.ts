import { Process } from '../src/process';

export class MockProcess implements Process {
  start?: () => {};
  exit?: (code: number, stdout: string, stderr: string) => {};
  runtime = 0;

  terminate(): void {
  }

  toRuntime(): number {
    return this.runtime;
  }

  onStart(start: () => {}): void {
    this.start = start;
  }

  onExit(exit: (code: number, stdout: string, stderr: string) => {}): void {
    this.exit = exit;
  }

}
