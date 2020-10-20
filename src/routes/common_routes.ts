import { Application, Request, Response } from 'express';
import { CommonController } from '../controllers/CommonController';

export class CommonRoutes {
  private common_controller: CommonController = new CommonController();

  public route(app: Application) {
    // Mismatch URL
    app.all('*', function (req: Request, res: Response) {
      this.common_controller.unavaliable();
    });

    app.route('/').get(this.common_controller.healthy);
  }
}
