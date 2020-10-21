import { Application } from 'express';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';
import ValidationMiddleware from '../middleware//ValidateMiddleware';
import { CreateUserDto } from '../modules/users/user.dto';
import { SignInDto } from '../modules/users/user.dto';

export class UserRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application): void {
    // app.get('/user', (req: Request, res: Response) => {
    //   this.user_controller.index;
    // });
    app.route('/user/:apply_id').get(this.user_controller.get);
    app.route('/user').post(ValidationMiddleware(CreateUserDto, false), this.user_controller.create);
    app.route('/user').patch(ValidationMiddleware(CreateUserDto, true), this.user_controller.update);
    app.route('/user').delete(this.user_controller.delete);
  }
}

export class AuthRoutes {
  private auth_controller: AuthController = new AuthController();

  public route(app: Application): void {
    app.route('/auth').get(this.auth_controller.healthy);
    app.route('/auth').post(ValidationMiddleware(SignInDto, false), this.auth_controller.signIn);
    // app.route('/user/index').get(this.user_controller.index);
    // app.route('/user').post(ValidationMiddleware(CreateUserDto, false), this.user_controller.create);
    // app.route('/user').patch(ValidationMiddleware(CreateUserDto, true), this.user_controller.update);
    // app.route('/user').delete(this.user_controller.delete);
  }
}
