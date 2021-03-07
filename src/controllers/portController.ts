import Busboy from 'busboy';
import fs from 'fs';
import env from '../config/environment';
import { Request, Response, NextFunction } from 'express';
import { IPortfolioType, IPortfolio } from '../modules/portfolio/model';
import { Portfolio, PortfolioType } from '../modules/portfolio/model';
import { User } from '../modules/users/model';
import { IRequestWithUser } from '../modules/users/interface';
import { CreatePortfolioDto } from '../modules/portfolio/model.dto';
import { upsert } from './helper';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as Sentry from '@sentry/node';
import {
  successResponse,
  createdResponse,
  insufficientParameters,
  failureResponse,
  notFoundResponse,
  deletedResponse,
} from '../exceptions/HttpExceptions';

export class PortfolioController {
  /* --------------------------------- Healthy -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('Portfolio api healthy.', null, res);
  }

  /* --------------------------------- Get All -------------------------------- */
  public getAll(req: IRequestWithUser, res: Response) {
    successResponse('get all portfolio', null, res);
  }

  /* ---------------------------------- View ---------------------------------- */
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

    const path = `upload/${target_id}/portfolio/${type}.pdf`;

    try {
      const file = fs.readFileSync(path);
      const stat = fs.statSync(path);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${target_id}(${type}).pdf`);
      res.send(file);
    } catch (err) {
      notFoundResponse(`${type}`, res);
    }
  }
  /* ----------------------------------- Get ---------------------------------- */
  public get(req: IRequestWithUser, res: Response) {
    const permission = req.user.permission;
    const user_apply_id: number = req.user.apply_id;
    const body_apply_id: number = +req.params.apply_id;
    let apply_id: number;

    // apply_id is not number
    if (isNaN(body_apply_id)) return insufficientParameters(['apply_id should be number'], res);

    /**
    / permission 1 can get own data
    / permission >2 can get all data
    */
    if (permission == 1) apply_id = user_apply_id;
    else apply_id = body_apply_id;

    // find portfolio
    Portfolio.findAll({
      where: { apply_id: apply_id },
      include: PortfolioType,
      raw: true,
      nest: true,
    })
      .then(async (nodes: IPortfolio[]) => {
        const customSort = function (a: any, b: any) {
          return Number(a.order.match(/(\d+)/g)[0]) - Number(b.order.match(/(\d+)/g)[0]);
        };

        for (const i in nodes) {
          const item = nodes[i].file.split('/')[5];
          nodes[i].order = item;
        }

        const nodes_sort = nodes.sort(customSort);
        if (nodes.length) successResponse('Get portfolio types', nodes_sort, res);
        else notFoundResponse(`portfolio ${apply_id}`, res);
      })
      .catch((err: Error) => {
        failureResponse('get portfolio types', err.message, res);
      });
  }

  /* --------------------------------- Create --------------------------------- */
  public async create(req: IRequestWithUser, res: Response) {
    const apply_id = req.user.apply_id;
    let busboy;
    try {
      busboy = new Busboy({ headers: req.headers });
    } catch (err) {
      return failureResponse('create portfolio', err.message, res);
    }
    const body: Record<string, any> = {};
    let errorStack: string[] = [];

    busboy.on('file', (field, file, name, encoding, mime) => {
      if (!name) {
        // errorStack.push('file should not be empty');
        file.resume();
      } else {
        fs.mkdirSync(`upload/${apply_id}/portfolio`, { recursive: true });
        const saveTo = `upload/${apply_id}/portfolio/${field}.pdf`;
        const base_uri = `${env.APP_HOST}:${env.APP_PORT}/portfolio/view`;
        body['file'] = `${base_uri}/${field}/${apply_id}`;
        file.pipe(fs.createWriteStream(saveTo));
      }
    });
    busboy.on('field', (field, val) => {
      body[field] = val;
    });
    busboy.on('finish', async () => {
      await validate(plainToClass(CreatePortfolioDto, body), { skipMissingProperties: false }).then(
        (errors: ValidationError[]) => {
          if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => Object.values(error.constraints)[0]);
            errorStack = errorStack.concat(message);
            Sentry.captureException(errorStack);
          }
        },
      );
      if (!body.file) errorStack.push('file should not be empty');
      if (errorStack.length) return insufficientParameters(errorStack, res);
      body['apply_id'] = apply_id;
      await upsert(body, { port_id: body.port_id || null }, Portfolio)
        .then(async (resp: any) => {
          const user_data = await User.findOne({ attributes: ['step'], where: { apply_id: apply_id } });
          if (user_data.step !== 4) {
            User.update(
              {
                step: 4,
              },
              {
                where: {
                  apply_id: apply_id,
                },
              },
            )
              .then(() => {
                createdResponse(`${apply_id}`, resp, res);
              })
              .catch((err: { message: any }) => {
                Sentry.captureException(err);
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

  /* --------------------------------- Delete --------------------------------- */

  public async delete(req: IRequestWithUser, res: Response) {
    // permisison 1 can remove own data
    // permission 2 can remove every data

    const user_permission = req.user.permission;
    const user_id = req.user.apply_id;
    let port_id: number | null = null;

    // check current user port_id
    let user_port: any = await Portfolio.findAll({ where: { apply_id: user_id } });
    user_port = user_port.map((i: any) => i.port_id);

    // validate permission
    if (user_permission >= 2) {
      port_id = req.body.port_id;
    } else {
      if (user_port.includes(+req.body.port_id)) {
        port_id = +req.body.port_id;
      } else {
        return notFoundResponse(`port_id ${req.body.port_id}`, res);
      }
    }

    const apply_id = await Portfolio.findOne({ where: { port_id: port_id } }).then((resp) => {
      return resp.apply_id;
    });

    // delete portfolio
    await Portfolio.destroy({
      where: {
        port_id: port_id,
      },
    });

    // remove portfolio path
    const path = `upload/${apply_id}/portfolio/${req.body.field}.pdf`;

    try {
      fs.unlinkSync(path);
      deletedResponse(`portfolio ${port_id}`, null, res);
    } catch (err) {
      failureResponse('remove portfolio file \n' + err.message, err.message, res);
    }
  }
}

export class PortfolioTypeController {
  /* --------------------------------- Healthy -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('Portfolio types api healthy.', null, res);
  }
  /* ----------------------------------- Get ---------------------------------- */
  public getAll(req: IRequestWithUser, res: Response): void {
    const permission = req.user.permission;
    PortfolioType.findAll({ attributes: { exclude: [permission >= 2 ? '' : 'score', 'createdAt', 'updatedAt'] } })
      .then((nodes: IPortfolio[]) => {
        successResponse('Get portfolio types', nodes, res);
      })
      .catch((err: Error) => {
        failureResponse('get portfolio types \n' + err.message, err.message, res);
      });
  }

  /* ---------------------------- Create or Update ---------------------------- */
  public create(req: Request, res: Response): void {
    const bodyData: IPortfolioType = req.body;

    upsert(bodyData, { name: bodyData.name }, PortfolioType)
      .then((node: IPortfolioType) => {
        createdResponse(`${bodyData.name}`, node, res);
      })
      .catch((err: Error) => {
        failureResponse('create portfolio type \n' + err.message, err.message, res);
      });
  }

  /* --------------------------------- Delete --------------------------------- */
  public delete(req: Request, res: Response): void {
    const bodyData: IPortfolioType = req.body;
    PortfolioType.destroy({
      where: {
        name: bodyData.name,
      },
    })
      .then((node: number) => {
        deletedResponse(`${bodyData.name}`, node, res);
      })
      .catch((err: Error) => {
        failureResponse('create portfolio type' + err.message, err.message, res);
      });
  }
}
