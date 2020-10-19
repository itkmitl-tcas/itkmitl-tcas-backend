import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { UserRoutes } from '../routes/user_routes';

class App {
  public app: express.Application;

  private user_routes: UserRoutes = new UserRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.user_routes.route(this.app);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}
export default new App().app;
