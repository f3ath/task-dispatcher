import { Process } from "./process";

export interface Executor {
  execute(command: string, args?: string[]): Process;
}