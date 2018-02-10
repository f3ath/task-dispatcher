import { ControlledRun, ResultParser, RunResult } from '../src/test';
import { MockProcess } from './mocks/mock-process';

class MockResultParser implements ResultParser {
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

describe('ControlledRun', () => {

  let process: MockProcess;
  let parser: ResultParser;
  let run: ControlledRun;
  beforeEach(() => {
    parser = new MockResultParser();
    process = new MockProcess();
    run = new ControlledRun(process, parser);
  });

  it('calls terminate() when cancelled', () => {
    spyOn(process, 'terminate');
    process.start!();
    run.cancel();
    expect(process.terminate).toHaveBeenCalled()
  });

  it('does not call terminate() if not started', () => {
    spyOn(process, 'terminate');
    run.cancel();
    expect(process.terminate).not.toHaveBeenCalled();
  });

  it('does not call terminate() if completed', () => {
    spyOn(process, 'terminate');
    process.start();
    process.exit(0, '', '');
    run.cancel();
    expect(process.terminate).not.toHaveBeenCalled();
  });

  it('returns 0 runtime when not started', () => {
    expect(run.toRuntime()).toBe(0);
  });

  it('gets runtime from the process after start', () => {
    spyOn(process, 'toRuntime').and.returnValue(3.14);
    process.start();
    expect(run.toRuntime()).toBe(3.14);
    expect(process.toRuntime).toHaveBeenCalled();
  });

  it('parses process output', () => {
    process.start();
    process.exit(0, 'std output', 'std errors');
    expect(run.toStatus()).toBe('completed');
    expect(run.toRuntime()).toBe(3.14);
  })
});
