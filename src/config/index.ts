import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { UserRoutes, AuthRoutes, HealthyRoutes } from '../routes/user_routes';
import { DocRoutes } from '../routes/docs_routes';
import { PortfolioRoutes } from '../routes//portfolio_routes';
import { CommonRoutes } from '../routes/common_routes';
import env from './environment';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

class App {
  public app: express.Application;
  private user_routes: UserRoutes = new UserRoutes();
  private auth_routes: AuthRoutes = new AuthRoutes();
  private docs_routes: DocRoutes = new DocRoutes();
  private portfolio_routes: PortfolioRoutes = new PortfolioRoutes();
  private common_routes: CommonRoutes = new CommonRoutes();
  private healthy_routes: HealthyRoutes = new HealthyRoutes();

  constructor() {
    this.app = express();
    this.config();
    if (process.env.NODE_ENV == 'production') {
      this.app.use(cors({ origin: `${env.FRONT_HOST}`, credentials: true }));
    } else {
      this.app.use(cors({ origin: `${env.FRONT_HOST}:${env.FRONT_PORT}`, credentials: true }));
    }

    Sentry.init({
      dsn: 'https://700449d2e66c4d74a2a4c58837d546a5@o465173.ingest.sentry.io/5565637',
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
      ],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1,
    });

    this.app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    this.app.use(Sentry.Handlers.tracingHandler());

    this.healthy_routes.route(this.app);
    this.user_routes.route(this.app);
    this.auth_routes.route(this.app);
    this.docs_routes.route(this.app);
    this.common_routes.route(this.app);
    this.portfolio_routes.route(this.app);
  }

  private config(): void {
    this.app.use(cookieParser());
    this.app.use(bodyParser.json()); // support application/json type post data
    this.app.use(bodyParser.urlencoded({ extended: true })); //support application/x-www-form-urlencoded post data
  }
}
export default new App().app;
