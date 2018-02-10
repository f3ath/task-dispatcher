import { Application, NotFound } from '../src/dispatcher/application';
import { Module } from '../src/module';
import { MockExecutor } from './mocks/mock-executor';
import { MockRun } from "./mocks/mock-run";
import { MockResultParser } from "./mocks/mock-result-parser";
import { MockRepo } from "./mocks/mock-repo";
import { MockProcess } from "./mocks/mock-process";

describe('Application', () => {
  let app: Application;
  let repo: MockRepo;
  let executor: MockExecutor;

  beforeEach(() => {
    executor = new MockExecutor();
    repo = new MockRepo();
    app = new Application(new Module('my_module_name', ['foo', 'bar'], new MockResultParser()), repo, executor);
  });

  it('throws an error if test suite is not found', () => {
    expect(() => app.startNewTestRun('does_not_exist'))
      .toThrow(new NotFound('does_not_exist'));
  });

  it('creates and registers a new TestRun, returns its id', () => {
    spyOn(executor, 'execute').and.returnValue(new MockProcess());
    const id = app.startNewTestRun('foo');
    expect(id).toBe('mock_id');
    expect(executor.execute).toHaveBeenCalledWith('node', ['my_module_name', 'foo']);
  });

  it('throws an error if test run is not found', () => {
    expect(() => app.getTestRun('does_not_exist'))
      .toThrow(new NotFound('does_not_exist'));
  });

  it('provides the status of a test run on request, including its runtime', () => {
    repo.run = new MockRun(
      'completed',
      5,
      {
        runtime: 3.14,
        failCount: 2,
        passCount: 3,
        exitCode: 0,
        errors: ['crash', 'boom', 'bang']
      }
    );
    expect(app.getTestRun('mock_id'))
      .toEqual({
        status: 'completed',
        runtime: 3.14,
        failCount: 2,
        passCount: 3,
        exitCode: 0,
        errors: ['crash', 'boom', 'bang']
      });

    repo.run = new MockRun(
      'active',
      3.14
    );
    expect(app.getTestRun('mock_id'))
      .toEqual({
        status: 'active',
        runtime: 3.14,
      });
  });

  it('cancels an active test run on request', () => {
    repo.run = new MockRun('active', 123);
    spyOn(repo.run, 'cancel');
    app.cancelTestRun('mock_id');
    expect(repo.run.cancel).toHaveBeenCalled();
  });

  it('throws an error if run not found', () => {
    expect(() => app.cancelTestRun('invalid_id')).toThrow(new NotFound('invalid_id'));
  });
});
