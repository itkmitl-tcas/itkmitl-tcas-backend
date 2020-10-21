import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { UserRoutes, AuthRoutes } from '../routes/user_routes';

class App {
  public app: express.Application;

  private user_routes: UserRoutes = new UserRoutes();
  private auth_routes: AuthRoutes = new AuthRoutes();

  constructor() {
    this.app = express();
    this.config();
    // this.common_routes.route(this.app);
    this.user_routes.route(this.app);
    this.auth_routes.route(this.app);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }
}
export default new App().app;
