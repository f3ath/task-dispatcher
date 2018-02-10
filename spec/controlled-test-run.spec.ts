import { ControlledTestRun } from '../src/controlled-test-run';
import { MockProcess } from './mocks/mock-process';

describe('TestRun', () => {
  let process: MockProcess;
  let run: ControlledTestRun;
  beforeEach(() => {
    process = new MockProcess();
    run = new ControlledTestRun(process);
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
    process.start!();
    process.exit!(0, '', '');
    run.cancel();
    expect(process.terminate).not.toHaveBeenCalled();
  })

});
