import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { IUserSignIn } from '../modules/users/interface';
import { successResponse, failureResponse, notFoundResponse, mismatchResponse } from '../exceptions/HttpExceptions';
import { User } from '../modules/users/model';
import { IUser } from '../modules/users/interface';

export class AuthController {
  public healthy(req: Request, res: Response) {
    successResponse('Auth api healthy.', null, res);
  }
  public async signIn(request: Request, res: Response, next: NextFunction) {
    const signInParams: IUserSignIn = request.body;

    // reg request
    const reg_res: IUserSignIn = await axios
      .get(`https://reg.kmitl.ac.th/TCAS/service_IT/users/${signInParams.apply_id}`)
      .then((res) => res.data)
      .catch(() => false);

    // validate reg response
    if (!reg_res) return next(failureResponse('REG', null, res));
    if (!reg_res.apply_id) return next(notFoundResponse(signInParams.apply_id, res));
    if (
      reg_res.apply_id !== signInParams.apply_id ||
      reg_res.name !== signInParams.name ||
      reg_res.surname !== signInParams.surname
    )
      return next(mismatchResponse(401, signInParams.apply_id, res));

    // define payload for create
    const payload = {
      apply_id: reg_res.apply_id,
      name: reg_res.surname,
      surname: reg_res.surname,
      email: reg_res.email,
      mobile: reg_res.mobile,
      gpax: parseInt(reg_res.gpax),
      credit_total: parseInt(reg_res.credit_total),
      pay: reg_res.pay == '1' ? true : false,
      prename: reg_res.prename,
      school_name: reg_res.school_name,
    };
    // save to db
    User.findOrCreate<User>({
      where: {
        apply_id: payload.apply_id,
      },
      defaults: payload,
    })
      .then(() => successResponse('Sign in', reg_res, res))
      .catch((err) => {
        console.log(err);
        failureResponse('create user', err, res);
      });
  }
}
