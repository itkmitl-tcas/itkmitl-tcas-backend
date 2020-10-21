import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/users/model';
import { IUser } from '../modules/users/interface';
import {
  successResponse,
  failureResponse,
  notFoundResponse,
  createdResponse,
  insufficientParameters,
  updatedResponse,
  deletedResponse,
} from '../exceptions/HttpExceptions';

export class UserController {
  // index to show list of nodes
  public index(req: Request, res: Response) {
    User.findAll<User>({})
      .then((nodes: Array<User>) => successResponse('Users index', nodes, res))
      .catch((err: Error) => failureResponse('Failed to get user index.', err, res));
  }

  public async create(req: Request, res: Response) {
    const params: IUser = req.body;

    await User.create<User>(params)
      .then((node: User) => createdResponse(params.apply_id, node, res))
      .catch((err) => {
        const errors = err.errors.map((item: any) => item.message);
        insufficientParameters(errors, res);
      });
  }

  public get(req: Request, res: Response, next: NextFunction) {
    const apply_id = req.params.apply_id;
    User.findAll({
      where: {
        apply_id: apply_id,
      },
    })
      .then((nodes: Array<User>) => {
        if (nodes.length) successResponse(apply_id, nodes, res);
        else next(notFoundResponse(apply_id, res));
      })
      .catch((err) => {
        const errors = err.errors.map((item: any) => item.message);
        failureResponse('get user', errors, res);
      });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const params: IUser = req.body;
    const apply_id = params.apply_id;

    User.update(params, {
      where: { apply_id: apply_id },
    })
      .then((node) => {
        if (node[0]) updatedResponse(apply_id, node, res);
        else return next(notFoundResponse(apply_id, res));
      })
      .catch((err) => {
        const errors = err.errors.map((item: any) => item.message);
        failureResponse('update user', errors, res);
      });
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    interface IDelete {
      apply_id: string;
    }
    const params: IDelete = req.body;
    const apply_id = params.apply_id;

    User.destroy({
      where: { apply_id: apply_id },
    })
      .then((node) => {
        if (node) deletedResponse(apply_id, node, res);
        else return next(notFoundResponse(apply_id, res));
      })
      .catch((err) => {
        const errors = err.errors.map((item: any) => item.message);
        failureResponse('delete user', errors, res);
      });
  }
}
