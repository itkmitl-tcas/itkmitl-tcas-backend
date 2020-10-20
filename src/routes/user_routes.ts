import { Application } from 'express';
import { UserController } from '../controllers/userController';
import ValidationMiddleware from '../middleware//ValidateMiddleware';
import CreateUserDto from '../modules/users/createUser.dto';

export class UserRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application): void {
    // app.get('/user', (req: Request, res: Response) => {
    //   this.user_controller.index;
    // });
    app.route('/user/index').get(this.user_controller.index);
    app.route('/user').post(ValidationMiddleware(CreateUserDto, false), this.user_controller.create);
    app.route('/user').patch(ValidationMiddleware(CreateUserDto, true), this.user_controller.update);
    app.route('/user').delete(this.user_controller.delete);
  }
}
