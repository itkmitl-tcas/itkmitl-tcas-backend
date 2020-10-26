import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { UserRoutes, AuthRoutes, HealthyRoutes } from '../routes/user_routes';
import { DocRoutes } from '../routes/docs_routes';
import env from './environment';

class App {
  public app: express.Application;
  private user_routes: UserRoutes = new UserRoutes();
  private auth_routes: AuthRoutes = new AuthRoutes();
  private docs_routes: DocRoutes = new DocRoutes();
  private healthy_routes: HealthyRoutes = new HealthyRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.app.use(cors({ origin: `${env.FRONT_HOST}:${env.FRONT_PORT}`, credentials: true }));
    this.healthy_routes.route(this.app);
    this.user_routes.route(this.app);
    this.auth_routes.route(this.app);
    this.docs_routes.route(this.app);
  }

  private config(): void {
    this.app.use(cookieParser());
    this.app.use(bodyParser.json()); // support application/json type post data
    this.app.use(bodyParser.urlencoded({ extended: true })); //support application/x-www-form-urlencoded post data
  }
}
export default new App().app;
