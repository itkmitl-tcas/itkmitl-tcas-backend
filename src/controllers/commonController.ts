import { Request, Response } from 'express';
import { successResponse, unavailableResponse } from '../modules/common/service';

export class CommonController {
  public healthy(req: Request, res: Response) {
    successResponse('Healthy', null, res);
  }

  public unavaliable(req: Request, res: Response) {
    unavailableResponse(res);
  }
}
