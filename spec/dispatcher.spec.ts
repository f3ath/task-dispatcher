import { Dispatcher, NotFound } from "../src/dispatcher";
import { NodeTestModule } from "../src/test";

describe('Dispatcher', () => {
  const timeout = 500;
  const tests: { [name: string]: (id: string) => (done: () => any) => void } = {
    'testSuite1': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('completed');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.result!.passed).toBe(10);
        expect(run.result!.failed).toBe(0);
        expect(run.result!.errors).toBe('');
        done();
      }, timeout);
    },

    'testSuite2': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('completed');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.result!.passed).toBe(8);
        expect(run.result!.failed).toBe(2);
        expect(run.result!.errors).toContain("Test 'UsernameCannotExceed64Bytes' failed with TestAssertionException.");
        expect(run.result!.errors).toContain("Test 'ModifyUsernameForExistingProfile' failed with ArrayIndexOutOfBoundsException.");
        done();
      }, timeout);
    },

    'testSuite3': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('completed');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.result!.passed).toBe(0);
        expect(run.result!.failed).toBe(6);
        expect(run.result!.errors).toContain("Test 'CreateSocialGraphEmptyUserTable' failed with DbConnectionException");
        expect(run.result!.errors).toContain("Test 'RecalcSocialGraphFullUserTable' failed with DbConnectionException.");
        done();
      }, timeout);
    },

    'testSuite4': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('completed');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.result!.passed).toBe(9);
        expect(run.result!.failed).toBe(1);
        expect(run.result!.errors).toContain("Test 'InitializeWithEmptyUserTable' failed with TimeoutException.");
        done();
      }, timeout);
    },

    'testSuite5': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('error');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.error!.message).toContain("TypeError: BlinkmothApi.disconnect is not a function");
        done();
      }, timeout);
    },

    'testSuite6': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('error');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.error!.message).toContain("Unable to initialize test 'ReindexGraphTable'");
        done();
      }, timeout);
    },

    'testSuite7': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('completed');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.result!.passed).toBe(0);
        expect(run.result!.failed).toBe(0);
        done();
      }, timeout);
    },

    'testSuite8': (id: string) => (done: () => any) => {
      setTimeout(() => {
        const run = dispatcher.getStatus(id);
        expect(run.status).toEqual('completed');
        expect(run.runtime).toBeGreaterThan(0);
        expect(run.result!.passed).toBe(5);
        expect(run.result!.failed).toBe(1);
        done();
      }, timeout);
    },
  };

  const dispatcher = new Dispatcher(
    new NodeTestModule(
      [__dirname, 'example-test-module'].join('/'),
      Object.keys(tests)
    )
  );

  Object.keys(tests)
    .map(testName => {
      const id = dispatcher.start(testName);
      const makeTestBody = tests[testName];
      const testBody = makeTestBody(id);
      it(testName, testBody)
    });

  it('throws NotFound if test suite not found', () => {
    expect(() => dispatcher.start('invalid_suite')).toThrow(new NotFound('invalid_suite'))
  });

  it('throws NotFound if test run not found', () => {
    expect(() => dispatcher.getStatus('invalid_id')).toThrow(new NotFound('invalid_id'))
    expect(() => dispatcher.cancel('invalid_id')).toThrow(new NotFound('invalid_id'))
  });

  it('shows active status when test runs', () => {
    const id = dispatcher.start('testSuite1');
    const run = dispatcher.getStatus(id);
    expect(run.status).toBe('active');
  });

  it('cancels an active test run', (done) => {
    const id = dispatcher.start('testSuite1');
    expect(dispatcher.getStatus(id).status).toBe('active');
    dispatcher.cancel(id);
    setTimeout(() => {
      expect(dispatcher.getStatus(id).status).toBe('cancelled');
      done();
    }, timeout);
  });
});