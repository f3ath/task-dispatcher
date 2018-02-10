export interface Process {
  terminate(): void;

  toRuntime(): number;

  onStart(start: () => void): void;

  onExit(exit: (code: number, stdout: string, stderr: string) => void): void;
}

