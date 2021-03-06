import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { IUserSignIn, IToken, ITokenData, IUser, IRequestWithUser } from '../modules/users/interface';
import { successResponse, failureResponse, notFoundResponse, mismatchResponse } from '../exceptions/HttpExceptions';
import { User } from '../modules/users/model';
import env from '../config/environment';
import jwt from 'jsonwebtoken';
import { SignInTDto } from '../modules/users/user.dto';
import { upsert } from './helper';
import bcrypt from 'bcrypt';
import * as Sentry from '@sentry/node';

export class AuthController {
  /* --------------------------------- Healthy -------------------------------- */

  public healthy(req: Request, res: Response) {
    successResponse('Auth api healthy.', null, res);
  }

  /* --------------------------------- Verify --------------------------------- */
  public async verify(req: IRequestWithUser, res: Response, next: NextFunction) {
    const user = await User.findOne({
      where: {
        apply_id: req.user.apply_id,
      },
    });
    const payload = {
      apply_id: user.apply_id,
      permission: user.permission,
      step: user.step,
    };
    if (req.user) return successResponse('verify token', payload, res);
    else return mismatchResponse(401, 'verify token', res);
  }

  /* --------------------------------- Sign In -------------------------------- */
  public async signIn(request: Request, res: Response, next: NextFunction) {
    const signInParams: IUserSignIn = request.body;

    // reg request
    const reg_res: IUserSignIn = await axios
      .get(`https://reg.kmitl.ac.th/TCAS/service_IT/users/${signInParams.apply_id}`)
      .then((res) => res.data)
      .catch((err) => {
        Sentry.captureException(err);
        return false;
      });

    if (reg_res.pay == '0') return mismatchResponse(406, `${signInParams.apply_id} please pay`, res); // not accept

    // validate reg response
    if (!reg_res) return next(failureResponse('REG', null, res));
    if (!reg_res.apply_id) return next(notFoundResponse(`${signInParams.apply_id}`, res));
    if (
      +reg_res.apply_id !== signInParams.apply_id ||
      reg_res.name !== signInParams.name ||
      reg_res.surname !== signInParams.surname
    )
      return next(mismatchResponse(404, `${signInParams.apply_id}`, res)); // bad request

    // define payload for create
    const payload = {
      apply_id: reg_res.apply_id,
      name: reg_res.name,
      surname: reg_res.surname,
      email: reg_res.email,
      mobile: reg_res.mobile,
      gpax: parseFloat(reg_res.gpax) || '0',
      credit_total: parseFloat(reg_res.credit_total) || '0',
      pay: reg_res.pay == '1' ? true : false,
      prename: reg_res.prename,
      school_name: reg_res.school_name,
      apply_type: reg_res.type,
    };
    // save to db
    const result: IUser = await upsert(payload, { apply_id: payload.apply_id }, User)
      .then((result: IUser) => result)
      .catch((err: Error) => {
        Sentry.captureException(err);
        return failureResponse('create user', err.message, res);
      });

    if (!result) return;

    const user: IUser = result;
    const tokenPayload: any = { apply_id: user.apply_id, permission: user.permission, step: user.step };
    const tokenData = await AuthController.createToken(tokenPayload);
    tokenPayload['token'] = tokenData;
    res.setHeader('Set-Cookie', [AuthController.createCookie(tokenData)]);
    successResponse('Sign in', tokenPayload, res);
  }

  /* ----------------------------- Sign In Teacher ---------------------------- */
  public async signInTeacher(request: Request, res: Response, next: NextFunction) {
    const signInParams: SignInTDto = request.body;

    // get user
    const user: IUser = await User.findOne({
      where: {
        email: signInParams.email,
      },
    });

    if (!user) return next(mismatchResponse(401, `${signInParams.email}`, res));

    // compare password
    const check = await bcrypt.compare(signInParams.password, user.password);

    if (!check) return next(mismatchResponse(401, `${signInParams.email}`, res));
    if (user.permission < 2) return next(mismatchResponse(401, `${signInParams.email} permission denind`, res));

    const tokenPayload: any = { apply_id: user.apply_id, permission: user.permission, step: user.step };
    const tokenData = await AuthController.createToken(tokenPayload);
    tokenPayload['token'] = tokenData;
    res.setHeader('Set-Cookie', [AuthController.createCookie(tokenData)]);
    successResponse('Sign in', tokenPayload, res);
  }

  /* -------------------------------- Sign Out -------------------------------- */
  public async signOut(request: Request, res: Response) {
    res.setHeader('Set-Cookie', ['Authorization=; Path=/; Max-age=0']);
    successResponse('Sign out', null, res);
  }

  /* ----------------------------------- JWT ---------------------------------- */
  static createToken(user: ITokenData): any {
    const expiresIn = 60 * 720; // an hour
    const secret = env.JWT_SECRET;
    const dataStoredInToken: ITokenData = {
      apply_id: user.apply_id,
      permission: user.permission,
      step: user.step,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  static createCookie(tokenData: IToken) {
    return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}`;
  }
}
