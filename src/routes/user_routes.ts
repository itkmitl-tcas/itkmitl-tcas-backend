import { Application } from 'express';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';
import ValidationMiddleware from '../middleware/ValidateMiddleware';
import AuthMiddleware from '../middleware/AuthMiddleware';
import { CreateUserDto } from '../modules/users/user.dto';
import { SignInDto, SignInTDto } from '../modules/users/user.dto';
import { User } from '../modules/users/model';
import { successResponse, failureResponse, notFoundResponse, mismatchResponse } from '../exceptions/HttpExceptions';

export class UserRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application): void {
    app.route('/user').get(this.user_controller.healthy);

    app
      .get('/user/:apply_id', AuthMiddleware(2), this.user_controller.get)
      .post('/user', AuthMiddleware(3), ValidationMiddleware(CreateUserDto, false), this.user_controller.create)
      .patch('/user', AuthMiddleware(1), ValidationMiddleware(CreateUserDto, true), this.user_controller.update)
      .delete('/user', AuthMiddleware(3), this.user_controller.delete);
  }
}

export class AuthRoutes {
  private auth_controller: AuthController = new AuthController();

  public route(app: Application): void {
    app.route('/auth').get(this.auth_controller.healthy);
    app.route('/auth').post(AuthMiddleware(1), this.auth_controller.verify);
    app.route('/auth/signin').post(ValidationMiddleware(SignInDto, false), this.auth_controller.signIn);
    app.route('/auth/signout').post(AuthMiddleware(1), this.auth_controller.signOut);
    app.route('/auth/signin/teacher').post(ValidationMiddleware(SignInTDto, false), this.auth_controller.signInTeacher);
    // maybe change password?
  }
}

export class HealthyRoutes {
  public route(app: Application): void {
    app.route('/').get((req, res) => {
      User.findAll()
        .then(() => successResponse('Api healthy.', null, res))
        .catch(() => process.exit(1));
    });
  }
}
