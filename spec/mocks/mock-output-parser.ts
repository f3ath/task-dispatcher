import { OutputParser } from "../../src/output-parser";
import { RunResult } from "../../src/run-result";

export class MockOutputParser implements OutputParser {
  result: RunResult = {
    passCount: 0,
    failCount: 0,
    errors: []
  };

  parse(stdout: string) {
    return this.result;
  }
}