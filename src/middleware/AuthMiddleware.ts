import { NextFunction, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/environment';
import { IRequestWithUser, ITokenData, IUser } from '../modules/users/interface';
import { mismatchResponse } from '../exceptions/HttpExceptions';
import { User } from '../modules/users/model';
import * as Sentry from '@sentry/node';

export default function AuthMiddleware<T>(permission = 1): RequestHandler {
  return async (request: IRequestWithUser, res: Response, next: NextFunction) => {
    const cookies = request.cookies;
    if (cookies && cookies.Authorization) {
      const secret = env.JWT_SECRET;
      try {
        const verificationResponse = jwt.verify(cookies.Authorization, secret) as ITokenData;
        const apply_id = verificationResponse.apply_id;
        const user: IUser = await User.findOne({
          where: {
            apply_id: apply_id,
          },
        });
        if (user) {
          if (user.permission < permission) {
            mismatchResponse(401, `credentials permission denied (${user.permission}|${permission})`, res);
          } else {
            request.user = verificationResponse;
            Sentry.setUser({ apply_id: verificationResponse.apply_id });
            next();
          }
        } else {
          mismatchResponse(401, 'credentials', res);
        }
      } catch (err) {
        mismatchResponse(401, 'credentials token expired', res);
      }
    } else {
      mismatchResponse(401, 'credentials no token', res);
    }
  };
}
