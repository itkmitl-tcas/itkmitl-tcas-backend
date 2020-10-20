import { Application } from 'express';
import { CommonController } from '../controllers/CommonController';

export class CommonRoutes {
  private common_controller: CommonController = new CommonController();

  public route(app: Application) {
    app.route('/').get(this.common_controller.healthy);
  }
}
