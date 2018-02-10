import { Run } from "../run";

export interface RunRepository {
  register(run: Run): string;

  getRun(id: string): Run | undefined;
}