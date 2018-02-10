import { RunResult } from "./run-result";

export interface ResultParser {
  parse(code: number, stdout: string, stderr: string): RunResult;
}