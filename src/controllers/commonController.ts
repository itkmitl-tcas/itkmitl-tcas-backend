import { NextFunction, Request, Response } from 'express';
import ServiceNotFoundException from '../exceptions/HttpException';
import { successResponse, unavailableResponse } from '../modules/common/service';

export class CommonController {
  public healthy(req: Request, res: Response, next: NextFunction) {
    next(new ServiceNotFoundException(50, 'message'));
    // successResponse('Healthy', null, res);
  }

  public unavaliable(req: Request, res: Response) {
    unavailableResponse(res);
  }
}
