import { Request, Response, NextFunction } from 'express';
import {
  successResponse,
  createdResponse,
  insufficientParameters,
  failureResponse,
  notFoundResponse,
  deletedResponse,
} from '../exceptions/HttpExceptions';
import { Docs } from '../modules/document/model';
import { CreateDocsDto } from '../modules/document/docs.dto';
import { User } from '../modules/users/model';
import { IRequestWithUser } from '../modules/users/interface';
import { upsert } from './helper';

export class DocsController {
  /* --------------------------------- Healthy -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('Document api healthy.', null, res);
  }

  /* --------------------------------- Create --------------------------------- */
  public async create(req: IRequestWithUser, res: Response) {
    const payload: CreateDocsDto = req.body;
    const permission = (await User.findByPk(req.user.apply_id)).permission;
    let apply_id: number;

    // validate permission
    if (permission <= 2) {
      // permission 1 can create(update) own document
      apply_id = req.user.apply_id;
    } else if (permission >= 3) {
      // permission 3 above can create(update) other document
      apply_id = req.body.apply_id || null;
    }

    // update document
    upsert(payload, { apply_id: apply_id }, Docs)
      .then(() => {
        createdResponse(`${apply_id}`, payload, res);
      })
      .catch((err: { message: any }) => {
        insufficientParameters(err.message, res);
      });
  }

  /* ----------------------------------- Get ---------------------------------- */
  public async get(req: IRequestWithUser, res: Response, next: NextFunction) {
    let result: Docs[];
    const docs_id = req.body.docs_id;
    const user = await User.findByPk(req.user.apply_id);
    const apply_id = user.apply_id;
    const permission = user.permission;

    // permission 1 can only get own docs
    if (permission == 1) {
      result = await Docs.findAll({
        where: {
          apply_id: apply_id,
          docs_id: docs_id,
        },
      });
    } else if (permission >= 2) {
      // permission 3 above can create(update) other document
      result = await Docs.findAll({
        where: {
          docs_id: docs_id,
        },
      });
    }

    if (result.length) successResponse(`Get document ${docs_id}`, result, res);
    else notFoundResponse(`Document ${docs_id}`, res);

    // permission 2 above can get all docs

    // Docs.findByPk(docs_id, {
    //   include: User,
    // })
    //   .then((node: Docs) => {
    //     if (node) successResponse(`Get document ${docs_id}`, node, res);
    //     else next(notFoundResponse(`document ${docs_id}`, res));
    //   })
    //   .catch((err) => {
    //     failureResponse('get document', err.message, res);
    //   });
  }
  /* --------------------------------- Delete --------------------------------- */
  public async delete(req: Request, res: Response, next: NextFunction) {
    interface IDelete {
      docs_id: string;
    }
    const params: IDelete = req.body;
    const docs_id = params.docs_id;

    Docs.destroy({
      where: { docs_id: docs_id },
    })
      .then((node) => {
        if (node) deletedResponse(docs_id, node, res);
        else return next(notFoundResponse(docs_id, res));
      })
      .catch((err) => {
        failureResponse('delete user', err.message, res);
      });
  }
}
