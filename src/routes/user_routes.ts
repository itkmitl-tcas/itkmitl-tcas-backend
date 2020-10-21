import { Application } from 'express';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';
import ValidationMiddleware from '../middleware/ValidateMiddleware';
import AuthMiddelware from '../middleware/AuthMiddleware';
import { CreateUserDto } from '../modules/users/user.dto';
import { SignInDto, SignInTDto } from '../modules/users/user.dto';

export class UserRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application): void {
    app.route('/user').get(this.user_controller.healthy);

    app
      .get('/user/:apply_id', AuthMiddelware(2), this.user_controller.get)
      .post('/user', AuthMiddelware(3), ValidationMiddleware(CreateUserDto, false), this.user_controller.create)
      .patch('/user', AuthMiddelware(3), ValidationMiddleware(CreateUserDto, true), this.user_controller.update)
      .delete('/user', AuthMiddelware(3), this.user_controller.delete);
  }
}

export class AuthRoutes {
  private auth_controller: AuthController = new AuthController();

  public route(app: Application): void {
    app.route('/auth').get(this.auth_controller.healthy);
    app.route('/auth/signin').post(ValidationMiddleware(SignInDto, false), this.auth_controller.signIn);
    app.route('/auth/signout').post(AuthMiddelware(1), this.auth_controller.signOut);
    app.route('/auth/signin/teacher').post(ValidationMiddleware(SignInTDto, false), this.auth_controller.signInTeacher);
    // maybe change password?
  }
}
