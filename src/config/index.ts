import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { UserRoutes, AuthRoutes } from '../routes/user_routes';

class App {
  public app: express.Application;
  private user_routes: UserRoutes = new UserRoutes();
  private auth_routes: AuthRoutes = new AuthRoutes();

  constructor() {
    this.app = express();
    this.initSentryIO();
    this.config();
    this.user_routes.route(this.app);
    this.auth_routes.route(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json()); // support application/json type post data
    this.app.use(bodyParser.urlencoded({ extended: false })); //support application/x-www-form-urlencoded post data
    this.app.use(cookieParser());
  }

  private initSentryIO(): void {
    const app = this.app;
    Sentry.init({
      dsn: 'https://d71ca48982ed499d983acfcb6cf8441d@o465173.ingest.sentry.io/5477407',
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
      ],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
    });

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());
  }
}
export default new App().app;
