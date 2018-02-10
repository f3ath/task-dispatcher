import { ResultParser } from "../../src/result-parser";
import { RunResult } from "../../src/run-result";

export class MockResultParser implements ResultParser {
  result: RunResult = {
    exitCode: 0,
    runtime: 3.14,
    failCount: 2,
    passCount: 3,
    errors: ['crash', 'boom', 'bang']
  };

  parse(code: number, stdout: string, stderr: string): RunResult {
    return this.result;
  }
}