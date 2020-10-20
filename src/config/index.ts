import express from 'express';
import bodyParser from 'body-parser';
import { UserRoutes } from '../routes/user_routes';
import { CommonRoutes } from '../routes/common_routes';

class App {
  public app: express.Application;

  private common_routes: CommonRoutes = new CommonRoutes();
  private user_routes: UserRoutes = new UserRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.user_routes.route(this.app);
    this.common_routes.route(this.app);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}
export default new App().app;
