import { RunResult } from "./run-result";

export interface OutputParser {
  parse(stdout: string): RunResult;
}