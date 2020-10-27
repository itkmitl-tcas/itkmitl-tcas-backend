import Busboy from 'busboy';
import fs from 'fs';
import env from '../config/environment';
import { Request, Response, NextFunction } from 'express';
import { IPortfolioType, IPortfolio } from '../modules/portfolio/model';
import { Portfolio, PortfolioType } from '../modules/portfolio/model';
import { IRequestWithUser } from '../modules/users/interface';
import { CreatePortfolioDto } from '../modules/portfolio/model.dto';
import { upsert } from './helper';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
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
    })
      .then((nodes: IPortfolio[]) => {
        if (nodes.length) successResponse('Get portfolio types', nodes, res);
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
        const base_uri = `${env.APP_HOST}:${env.APP_PORT}/portfolio`;
        body['file'] = `${base_uri}/${field}/${apply_id}`;
        file.pipe(fs.createWriteStream(saveTo));
      }
    });
    busboy.on('field', (field, val) => {
      body[field] = val;
    });
    busboy.on('finish', async () => {
      console.log(body);
      await validate(plainToClass(CreatePortfolioDto, body), { skipMissingProperties: false }).then(
        (errors: ValidationError[]) => {
          if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => Object.values(error.constraints)[0]);
            errorStack = errorStack.concat(message);
          }
        },
      );
      if (!body.file) errorStack.push('file should not be empty');
      if (errorStack.length) return insufficientParameters(errorStack, res);
      body['apply_id'] = apply_id;
      upsert(body, { port_id: body.port_id || null }, Portfolio)
        .then(() => {
          createdResponse(`${apply_id}`, body, res);
        })
        .catch((err: { message: any }) => {
          insufficientParameters(err.message, res);
        });
    });
    req.pipe(busboy);
  }
}

export class PortfolioTypeController {
  /* --------------------------------- Healthy -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('Portfolio types api healthy.', null, res);
  }
  /* ----------------------------------- Get ---------------------------------- */
  public getAll(req: Request, res: Response): void {
    PortfolioType.findAll({ attributes: { exclude: ['score', 'createdAt', 'updatedAt'] } })
      .then((nodes: IPortfolio[]) => {
        successResponse('Get portfolio types', nodes, res);
      })
      .catch((err: Error) => {
        failureResponse('get portfolio types', err.message, res);
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
        failureResponse('create portfolio type', err.message, res);
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
        failureResponse('create portfolio type', err.message, res);
      });
  }
}
