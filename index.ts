import { NodeTestModule } from "./src/test";
import { Dispatcher, NotFound } from "./src/dispatcher";
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { LocalRunner } from "./src/local-run";

const dispatcher = new Dispatcher(
  new NodeTestModule(
    [__dirname, '/etc/test-module.js'].join('/'),
    ['testSuite1', 'testSuite2', 'testSuite3', 'testSuite4', 'testSuite5', 'testSuite6', 'testSuite7', 'testSuite8']
  ),
  new LocalRunner()
);
const app = express();

app.post('/start/:suite', (req: Request, res: Response) => {
  const id = dispatcher.start(req.params.suite);
  res.redirect(`/run/${encodeURIComponent(id)}`);
});

app.delete('/run/:id', (req: Request, res: Response) => {
  dispatcher.cancel(req.params.id);
  res.redirect(`/run/${encodeURIComponent(req.params.id)}`);
});

app.get('/run/:id', (req: Request, res: Response) => {
    const run = dispatcher.getStatus(req.params.id);
    const dto = {
      status: run.status,
      runtime: run.runtime
    };
    if (run.result) {
      res.json(Object.assign(dto, {
        results: {
          passed: run.result.passed,
          failed: run.result.failed,
          errors: run.result.errors
        }
      }))
    } else if (run.error) {
      res.json(Object.assign(dto, {
        message: run.error.message
      }));
    } else {
      res.json(dto);
    }
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NotFound) {
    res.status(404).json({error: 'Not Found'});
  } else {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.listen(4200);
