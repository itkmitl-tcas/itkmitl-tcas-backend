import { Request, Response, NextFunction } from 'express';
import { Setting } from '../modules/setting';
import {
  successResponse,
  createdResponse,
  insufficientParameters,
  failureResponse,
  notFoundResponse,
  deletedResponse,
} from '../exceptions/HttpExceptions';
export class SettingController {
  /* ------------------------------- Get Setting ------------------------------ */
  public async get(req: Request, res: Response) {
    Setting.findOne({})
      .then((resp) => {
        return successResponse('Get setting', resp, res);
      })
      .catch((err) => {
        return notFoundResponse('setting', res);
      });
  }

  /* ----------------------------- Update Setting ----------------------------- */
  public async update(req: Request, res: Response) {
    const payload: Setting = req.body;
    const where = {
      where: {
        name: payload.name,
      },
    };

    // check exist
    const setting = await Setting.findOne({
      where: {
        name: payload.name,
      },
    });
    if (!setting) return notFoundResponse(`${payload.name}`, res);

    // update
    Setting.update(payload, {
      where: {
        name: payload.name,
      },
    })
      .then((resp) => {
        return successResponse('Update setting', resp, res);
      })
      .catch((err) => {
        return failureResponse('update setting', err.message, res);
      });
  }
}
