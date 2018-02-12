const path = require('path');

class TestSuite {
  constructor(resultFn, runtime) {
    this.resultFn = resultFn;
    this.runtime = runtime;
  }

  run() {
    setTimeout(this.resultFn, this.runtime);
  }
}

class TestFailure {
  constructor(testName, exceptionType, reason) {
    this.testName = testName;
    this.exceptionType = exceptionType;
    this.reason = reason;
  }

  print() {
    console.log(`Test ${this.testName} failed with ${this.exceptionType}.\n\tReason: ${this.reason}.`);
  }
}

function randomInt(lowerOrUpperBound, upperBound) {
  const _lowerBound = upperBound === undefined ? 0 : lowerOrUpperBound;
  const _upperBound = upperBound === undefined ? lowerOrUpperBound : upperBound;

  return Math.floor(Math.random() * (_upperBound - _lowerBound) + _lowerBound);
}

function printPassFailCount(numPassed, numFailed, testFailures) {
  if (testFailures) {
    testFailures.forEach(failure => failure.print());
  }
  console.log('Passed: ' + numPassed + (numFailed ? ' Failed: ' + numFailed : ''));
}

const testSuiteDefs = {
  testSuite1: {
    fn: () => printPassFailCount(10, 0),
    runtime: 100
  },
  testSuite2: {
    failureCount: 5,
    fn: () => printPassFailCount(8, 2, [
      new TestFailure('\'UsernameCannotExceed64Bytes\'', 'TestAssertionException', 'Profile creation succeeded, but should have failed'),
      new TestFailure('\'ModifyUsernameForExistingProfile\'', 'ArrayIndexOutOfBoundsException', 'Index: 2 Length: 2')
    ]),
    runtime: 100
  },
  testSuite3: {
    fn: () => printPassFailCount(0, 6, [
      new TestFailure('\'CreateSocialGraphEmptyUserTable\'', 'DbConnectionException', 'Failed to establish socket connection to magnetoDb (127.0.0.1:5121)'),
      new TestFailure('\'CreateSocialGraphSparseUserTable\'', 'DbConnectionException', 'Failed to establish socket connection to magnetoDb (127.0.0.1:5121)'),
      new TestFailure('\'CreateSocialGraphFullUserTable\'', 'DbConnectionException', 'Failed to establish socket connection to magnetoDb (127.0.0.1:5121)'),
      new TestFailure('\'RecalcSocialGraphEmptyUserTable\'', 'DbConnectionException', 'Failed to establish socket connection to magnetoDb (127.0.0.1:5121)'),
      new TestFailure('\'RecalcSocialGraphSparseUserTable\'', 'DbConnectionException', 'Failed to establish socket connection to magnetoDb (127.0.0.1:5121)'),
      new TestFailure('\'RecalcSocialGraphFullUserTable\'', 'DbConnectionException', 'Failed to establish socket connection to magnetoDb (127.0.0.1:5121)')
    ]),
    runtime: 100
  },
  testSuite4: {
    fn: () => printPassFailCount(9, 1, [
      new TestFailure('\'InitializeWithEmptyUserTable\'', 'TimeoutException', 'Test ran longer than 60000ms')
    ]),
    runtime: 100
  },
  testSuite5: {
    fn: () => {
      const BlinkmothApi = {};
      BlinkmothApi.disconnect();
    },
    runtime: 100
  },
  testSuite6: {
    fn: () => {
      try {
        const dbCredentials = Object.freeze({user: 'someuser', password: 'somepassword'});
        dbCredentials = new Object();
      } catch (e) {
        console.error(`Unable to initialize test 'ReindexGraphTable':\n${e.stack}`);
      }
    },
    runtime: 100
  },
  testSuite7: {
    fn: () => printPassFailCount(0, 0),
    runtime: 1000
  },
  testSuite8: {
    fn: () => printPassFailCount(5, 1),
    runtime: 100
  }
}

const testSuites = Object.keys(testSuiteDefs).reduce((suites, key) => {
    const def = testSuiteDefs[key];
    suites[key] = new TestSuite(def.fn, def.runtime, def.testFailures);
    return suites;
  },
  {});

const scriptName = path.basename(process.argv[1]);

const testSuite = process.argv[2];
if (testSuite === undefined) {
  const usage = `usage: ${scriptName} test_suite`;
  const testSuiteList = Object.keys(testSuites).reduce((list, suiteName) => {
    return list + (list.length > 0 ? ', ' : '') + suiteName;
  }, '');
  console.log(usage + '\navailable result suites:\n\t' + testSuiteList);
} else if (testSuites[testSuite] === undefined) {
  console.log(`${scriptName}: test suite 'testSuite' not recongnized`);
} else {
  testSuites[testSuite].run();
}