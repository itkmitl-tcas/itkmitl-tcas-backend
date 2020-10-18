import { Application } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application): void {
    // app.get('/user', (req: Request, res: Response) => {
    //   this.user_controller.index;
    // });
    app.route('/users').get(this.user_controller.index);
    app.route('/users').post(this.user_controller.create);
  }
}
