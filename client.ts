import request = require("request");
import { Response } from "request";

const command = process.argv[2];
const arg = process.argv[3];

function displayHelpMessage() {
  console.error([
    'Commands:',
    'start <suite name>',
    'show <run id>',
    'cancel <run id>',
    ''
  ].join('\n'));
}

if (!command || !arg) {
  displayHelpMessage();
  process.exit();
}

const r = request.defaults({
  baseUrl: 'http://localhost:4200',
  followAllRedirects: true
});

function displayResponse(err: any, res: Response, body: any) {
  console.log(JSON.stringify(JSON.parse(body), null, 2));
}

switch (command) {
  case 'start':
    r.post(`/start/${encodeURIComponent(arg)}`, displayResponse);
    break;
  case 'show':
    r.get(`/run/${encodeURIComponent(arg)}`, displayResponse);
    break;
  case 'cancel':
    r.delete(`/run/${encodeURIComponent(arg)}`, displayResponse);
    break;
  default:
    displayHelpMessage();
    process.exit();
}