import { Request, Response } from 'express';
import { User } from '../modules/users/model';
import { IUser } from '../modules/users/interface';
import { successResponse, failureResponse } from '../modules/common/service';

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
}
