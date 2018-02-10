export interface Process {
  terminate(): void;

  toRuntime(): number;

  onStart(start: () => {}): void;

  onExit(exit: (code: number, stdout: string, stderr: string) => {}): void;
}
