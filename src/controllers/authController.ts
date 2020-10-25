import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { IUserSignIn, IToken, ITokenData, IUser, IRequestWithUser } from '../modules/users/interface';
import { successResponse, failureResponse, notFoundResponse, mismatchResponse } from '../exceptions/HttpExceptions';
import { User } from '../modules/users/model';
import env from '../config/environment';
import jwt from 'jsonwebtoken';
import { SignInTDto } from '../modules/users/user.dto';

export class AuthController {
  /* --------------------------------- Healthy -------------------------------- */

  public healthy(req: Request, res: Response) {
    successResponse('Auth api healthy.', null, res);
  }

  /* --------------------------------- Verify --------------------------------- */
  public async verify(req: IRequestWithUser, res: Response, next: NextFunction) {
    if (req.user) return successResponse('verify token', true, res);
    else return mismatchResponse(401, 'verify token', res);
  }

  /* --------------------------------- Sign In -------------------------------- */
  public async signIn(request: Request, res: Response, next: NextFunction) {
    const signInParams: IUserSignIn = request.body;

    // reg request
    const reg_res: IUserSignIn = await axios
      .get(`https://reg.kmitl.ac.th/TCAS/service_IT/users/${signInParams.apply_id}`)
      .then((res) => res.data)
      .catch(() => false);

    // validate reg response
    if (!reg_res) return next(failureResponse('REG', null, res));
    if (!reg_res.apply_id) return next(notFoundResponse(`${signInParams.apply_id}`, res));
    if (
      +reg_res.apply_id !== signInParams.apply_id ||
      reg_res.name !== signInParams.name ||
      reg_res.surname !== signInParams.surname
    )
      return next(mismatchResponse(401, `${signInParams.apply_id}`, res));

    // define payload for create
    const payload = {
      apply_id: reg_res.apply_id,
      name: reg_res.name,
      surname: reg_res.surname,
      email: reg_res.email,
      mobile: reg_res.mobile,
      gpax: parseFloat(reg_res.gpax),
      credit_total: parseFloat(reg_res.credit_total),
      pay: reg_res.pay == '1' ? true : false,
      prename: reg_res.prename,
      school_name: reg_res.school_name,
    };
    // save to db
    const result: any = await User.findOrCreate<User>({
      where: {
        apply_id: payload.apply_id,
      },
      defaults: payload,
    })
      .then((result) => result)
      .catch((err) => {
        return failureResponse('create user', err, res);
      });

    if (!result) return;

    const user: IUser = result[0];
    const tokenPayload: any = { apply_id: user.apply_id, permission: user.permission };
    const tokenData = await AuthController.createToken(tokenPayload);
    tokenPayload['token'] = tokenData;
    res.setHeader('Set-Cookie', [AuthController.createCookie(tokenData)]);
    successResponse('Sign in', tokenPayload, res);
  }

  /* ----------------------------- Sign In Teacher ---------------------------- */
  public async signInTeacher(request: Request, res: Response, next: NextFunction) {
    const signInParams: SignInTDto = request.body;

    // save to db
    const user: IUser = await User.findOne({
      where: {
        apply_id: signInParams.apply_id,
        password: signInParams.password,
      },
    });

    if (!user) return next(mismatchResponse(401, `${signInParams.apply_id}`, res));
    if (user.permission < 2) return next(mismatchResponse(401, `${signInParams.apply_id} permission denind`, res));

    const tokenPayload: any = { apply_id: user.apply_id, permission: user.permission };
    const tokenData = await AuthController.createToken(tokenPayload);
    tokenPayload['token'] = tokenData;
    // res.setHeader('Set-Cookie', [AuthController.createCookie(tokenData)]);
    successResponse('Sign in', tokenPayload, res);
  }

  /* -------------------------------- Sign Out -------------------------------- */
  public async signOut(request: Request, res: Response) {
    res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    successResponse('Sign out', null, res);
  }

  /* ----------------------------------- JWT ---------------------------------- */
  static createToken(user: ITokenData): any {
    const expiresIn = 60 * 60; // an hour
    const secret = env.JWT_SECRET;
    const dataStoredInToken: ITokenData = {
      apply_id: user.apply_id,
      permission: user.permission,
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
