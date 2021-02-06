import Busboy from 'busboy';
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
import multer, { MulterError } from 'multer';
import fs from 'fs';
import env from '../config/environment';
import multiparty from 'multiparty';
import * as Sentry from '@sentry/node';

export class DocsController {
  /* --------------------------------- Healthy -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('Document api healthy.', null, res);
  }

  /* ---------------------------------- Read ---------------------------------- */
  public async view(req: IRequestWithUser, res: Response) {
    // https://stackoverflow.com/q/11598274/10483617

    let target_id: number;
    const user_id = req.user.apply_id;
    const user_permission = req.user.permission;
    const params_id = req.params.apply_id;
    const type = req.params.type;

    if (!params_id) {
      target_id = user_id;
    } else if (user_permission >= 2 || user_id == parseInt(params_id)) {
      target_id = +params_id;
    } else {
      notFoundResponse(`${type}`, res);
    }

    const path = `upload/${target_id}/${type}.pdf`;

    try {
      const file = fs.readFileSync(path);
      const stat = fs.statSync(path);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${type}.pdf`);
      res.send(file);
    } catch (err) {
      console.log(err.message);
      notFoundResponse(`${type}`, res);
    }
  }

  /* --------------------------------- Create --------------------------------- */
  public async create(req: any, res: Response) {
    // // https://stackoverflow.com/a/35850052
    const apply_id = req.user.apply_id;
    const busboy = new Busboy({ headers: req.headers });
    const body: Record<string, any> = {};

    busboy.on('file', (field, file, name, encoding, mime) => {
      fs.mkdirSync(`upload/${apply_id}`, { recursive: true });
      const saveTo = `upload/${apply_id}/${field}.pdf`;
      file.pipe(fs.createWriteStream(saveTo));
      const base_uri = `${env.APP_HOST}:${env.APP_PORT}/docs`;
      body[field] = `${base_uri}/${field}/${apply_id}`;
    });
    busboy.on('finish', () => {
      body['apply_id'] = apply_id;
      upsert(body, { apply_id: apply_id }, Docs)
        .then(async () => {
          const user_data = await User.findOne({ attributes: ['step'], where: { apply_id: apply_id } });
          if (user_data.step !== 4) {
            User.update(
              {
                step: 3,
              },
              {
                where: {
                  apply_id: apply_id,
                },
              },
            )
              .then(() => {
                createdResponse(`${apply_id}`, body, res);
              })
              .catch((err: { message: any }) => {
                insufficientParameters(err.message, res);
              });
          } else {
            createdResponse(`${apply_id}`, body, res);
          }
        })
        .catch((err: { message: any }) => {
          Sentry.captureException(err);
          insufficientParameters(err.message, res);
        });
    });
    req.pipe(busboy);
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
