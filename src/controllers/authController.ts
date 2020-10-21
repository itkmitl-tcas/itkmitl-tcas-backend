import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { IUserSignIn } from '../modules/users/interface';
import { successResponse, failureResponse, notFoundResponse } from '../exceptions/HttpExceptions';
// import { User } from '../modules/users/model';

export class AuthController {
  public healthy(req: Request, res: Response) {
    successResponse('Auth api healthy.', null, res);
  }
  public async signIn(request: Request, res: Response, next: NextFunction) {
    const signInParams: IUserSignIn = request.body;

    // reg request
    const reg_res = await axios
      .get(`https://reg.kmitl.ac.th/TCAS/service_IT/users/${signInParams.apply_id}`)
      .then((res) => res.data)
      .catch(() => false);

    // validate reg response
    if (!reg_res) return next(failureResponse('REG', null, res));
    if (!reg_res.apply_id) return next(notFoundResponse('User', res));
    // User.findOne({
    //   where: {
    //     apply_id: signInParams.apply_id,
    //     name: signInParams.name,
    //     surname: signInParams.surname,
    //   },
    // }).then((node: User) => {
    //   if (!node) return next(new UserNotFoundException(signInParams.apply_id));
    //   if (node) successResponse('Sign In.', node, res);
    // });
  }
}
