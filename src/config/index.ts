import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { UserRoutes, AuthRoutes } from '../routes/user_routes';
import { DocRoutes } from '../routes/docs_routes';

class App {
  public app: express.Application;
  private user_routes: UserRoutes = new UserRoutes();
  private auth_routes: AuthRoutes = new AuthRoutes();
  private docs_routes: DocRoutes = new DocRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.initSentryIO();
    this.user_routes.route(this.app);
    this.auth_routes.route(this.app);
    this.docs_routes.route(this.app);

    this.app.get('/debug-sentry', function mainHandler(req, res) {
      throw new Error('My first Sentry error!');
    });
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
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
    // The error handler must be before any other error middleware
    app.use(Sentry.Handlers.errorHandler());
  }
}
export default new App().app;
