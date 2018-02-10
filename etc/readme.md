For this exercise, you will implement a task dispatcher. The dispatcher will run as a service that allows the scheduling and monitoring of a set of tasks, and retrieval of their results.

The tasks will be “test suites” which will be run from a simple javascript project, `simpletestrunner.js`, provided in this repository. Your service will be capable of the following:

* starting a new run of one of the included test suites on request, provided the test suite name
* providing the status of a test run on request, including its runtime
* reporting the results of a completed test run on request, including test failures, pass/fail count, and total runtime for the run
* canceling an active test run, on request.

You will be implementing the task management functionality, and providing an API or command interface for users to initiate the above actions. You may create this project using your programming language of choice, and may utilize libraries or frameworks that you deem suitable for the task.

To run the test suite module, you will need node.js (https://nodejs.org/). The latest stable release (8.9.0 LTS) is recommended. Your service should run test suites by invoking the module with one of the supported suite names, for example `node simpletestrunner testsuite1`. This can be achieved by executing a node.js process from within your program. There are eight supported test suites, named `testsuite1` through `testsuite8`. Consider how to handle different use cases, as the suites exhibit a variety of behaviors.

Completing this exercise should take you around 4-6 hours. When you’re finished, provide your completed program, along with instructions on how to run it. You should also provide example usage for each of the supported actions, along with the expected format for each API or CLI call. Hosting your completed service or project online where it can be accessed and run is appreciated, but not required.