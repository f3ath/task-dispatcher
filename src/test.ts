export interface TestResults {
  passed: number,
  failed: number,
  errors: string
}

export class Command {
  constructor(readonly command: string, readonly args: string[] = []) {
  }
}

export interface TestModule {

  has(suiteName: string): boolean;

  makeRunCommand(suite: string): Command;

  decodeResult(stdout: string, stderr: string): TestResults;
}

export class NodeTestModule implements TestModule {
  constructor(private readonly name: string, private readonly suites: string[]) {

  }

  has(suiteName: string): boolean {
    return this.suites.includes(suiteName);
  }

  makeRunCommand(suiteName: string): Command {
    return new Command('node', [this.name, suiteName]);
  }

  decodeResult(stdout: string, stderr: string): TestResults {
    const lines = stdout.split('\n').filter(line => line.length > 0);
    const lastLine = lines.pop();
    if (!lastLine) {
      throw new Error('Empty stdout');
    }
    const matches = lastLine.match(/^Passed: (\d+)( Failed: (\d+))?/);
    if (matches) {
      return {
        passed: parseInt(matches[1], 10),
        failed: matches[3] ? parseInt(matches[3], 10) : 0,
        errors: lines.join('\n')
      };
    }
    throw new Error('Pass/fail line not found');
  }
}