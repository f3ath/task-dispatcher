import { Process } from './process';

export interface ProcessExecutor {
  execute(command: string, args?: string[]): Process;
}
