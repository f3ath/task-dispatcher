# Simple node task dispatcher
## Install
Just run `npm i` to install. I used node v9.5.0, but I hope v8 should be enough.
## The Server
Run `npm start` to start the dispatcher server on port 4200. The following requests are supported.
### Start a new test run
#### Request
`POST /start/<suite name>`
#### Response
A redirect to the new test run (`/run/<run id>`)
### Show test run status
#### Request
`GET /run/<run id>`
#### Response 

A successful test run
```json
{
  "id": "2",
  "suite": "testSuite1",
  "status": "completed",
  "runtime": 5079,
  "results": {
    "passed": 10,
    "failed": 0,
    "errors": ""
  }
}
```
### Cancel a test run
#### Request
`DELETE /run/<run id>`
#### Response 
A redirect to the test run (`/run/<run id>`)
## The Client
To start the client app run `npm run client`. The app supports 3 commands:

- `start <suite name>` starts a new test run. E.g. `npm run client start testSuite4`
- `show <run id>` shows the status on the rest run. E.g. `npm run client show 1`
- `cancel <run id>` cancels an active test run. E.g. `npm run client cancel 1`

