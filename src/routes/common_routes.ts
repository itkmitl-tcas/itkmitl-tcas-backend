import { Application } from 'express';
import { SettingController } from '../controllers/settingControlles';
import AuthMiddleware from '../middleware/AuthMiddleware';

export class CommonRoutes {
  private setting_controller: SettingController = new SettingController();

  public route(app: Application) {
    app.route('/setting').get(this.setting_controller.get);
    app.route('/setting').post(AuthMiddleware(2), this.setting_controller.update);
  }
}
