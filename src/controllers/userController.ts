import { Request, Response } from 'express';
import { User } from '../modules/users/model';
import { IUser } from '../modules/users/interface';

export class UserController {
  // index to show list of nodes
  public index(req: Request, res: Response) {
    User.findAll<User>({})
      .then((nodes: Array<User>) => res.json(nodes))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: IUser = req.body;

    User.create<User>(params)
      .then((node: User) => res.status(201).json(node))
      .catch((err: Error) => res.status(500).json(err));
  }
}
