import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/users/model';
import { IUser } from '../modules/users/interface';
import { successResponse, failureResponse, insufficientParameters } from '../modules/common/service';
import HttpException from '../exceptions/HttpException';
import UserNotFoundExpcetion from '../exceptions/UserNotFoundException';

export class UserController {
  // index to show list of nodes
  public index(req: Request, res: Response) {
    User.findAll<User>({})
      .then((nodes: Array<User>) => successResponse('Users index', nodes, res))
      .catch((err: Error) => failureResponse('Failed to get user index.', err, res));
  }

  public create(req: Request, res: Response) {
    const params: IUser = req.body;

    User.create<User>(params)
      .then((node: User) => successResponse('Created user.', node, res))
      .catch((err: Error) => failureResponse('Failed to create user.', err, res));
  }

  public get(req: Request, res: Response, next: NextFunction) {
    const apply_id = req.params.id;

    User.findAll({
      where: {
        apply_id: apply_id,
      },
    })
      .then((nodes: Array<User>) => {
        if (nodes.length) res.send(nodes);
        else next(new UserNotFoundExpcetion(apply_id));
      })
      .catch((err: Error) => failureResponse('Failed to get user index.', err, res));
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const params: IUser = req.body;

    User.update(params, {
      where: { apply_id: params.apply_id },
    })
      .then((node) => {
        if (node[0]) successResponse('Updated', node, res);
        else next(new UserNotFoundExpcetion(params.apply_id));
      })
      .catch((err: Error) => failureResponse('Update failed', err, res));
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    interface IDelete {
      apply_id: string;
    }
    const params: IDelete = req.body;

    User.destroy({
      where: { apply_id: params.apply_id },
    })
      .then((node) => {
        console.log(node);
        if (node) successResponse('Delete', node, res);
        else next(new UserNotFoundExpcetion(params.apply_id));
      })
      .catch((err: Error) => next(new HttpException(500, 'Something went wrong', err)));
  }
}
