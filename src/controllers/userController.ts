import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/users/model';
import { IUser } from '../modules/users/interface';
import { IRequestWithUser } from '../modules/users/interface';
import {
  successResponse,
  failureResponse,
  notFoundResponse,
  createdResponse,
  insufficientParameters,
  updatedResponse,
  deletedResponse,
  mismatchResponse,
} from '../exceptions/HttpExceptions';
import { Docs } from '../modules/document/model';

export class UserController {
  /* -------------------------------- Healthly -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('User api healthy.', null, res);
  }

  /* ----------------------------- Get User By ID ----------------------------- */
  public get(req: Request, res: Response, next: NextFunction) {
    const apply_id = req.params.apply_id;
    User.findAll({
      where: {
        apply_id: apply_id,
      },
      include: { model: Docs },
    })
      .then((nodes: Array<User>) => {
        if (nodes.length) successResponse(apply_id, nodes, res);
        else next(notFoundResponse(apply_id, res));
      })
      .catch((err) => {
        // const errors = err.errors.map((item: any) => item.message);
        failureResponse('get user', err, res);
      });
  }

  // index to show list of nodes
  public index(req: Request, res: Response) {
    User.findAll<User>({})
      .then((nodes: Array<User>) => successResponse('Users index', nodes, res))
      .catch((err: Error) => failureResponse('Failed to get user index.', err, res));
  }

  /* ------------------------------- Create User ------------------------------ */
  public async create(req: Request, res: Response) {
    const params: IUser = req.body;

    await User.create<User>(params)
      .then((node: User) => createdResponse(`${params.apply_id}`, node, res))
      .catch((err) => {
        try {
          const errors = err.errors.map((item: any) => item.message);
          insufficientParameters(errors, res);
        } catch (err) {
          failureResponse('create user', err, res);
        }
      });
  }

  /* ------------------------------- Update User ------------------------------ */
  public async update(req: IRequestWithUser, res: Response, next: NextFunction) {
    const params: IUser = req.body;
    const apply_id = params.apply_id;
    let allowUpdate = false;
    const user = await User.findByPk(req.user.apply_id);

    // 404 if user not found
    if (!user) return notFoundResponse(`${params.apply_id}`, res);

    if (user.permission >= 3) {
      // permission 3 or above can update all data & permission
      allowUpdate = true;
    } else if (user.permission == 2) {
      // permisison 2 can update all except permission
      allowUpdate = true;
      delete params.permission;
    } else if (user.apply_id == params.apply_id) {
      // permisison 1 can only update study_field, gpax_[match, eng, com], step
      allowUpdate = true;
      delete params.permission; // prevent update
      delete params.prename;
      delete params.name;
      delete params.surname;
      delete params.email;
      delete params.mobile;
      delete params.credit_total;
      delete params.pay;
      delete params.password;
      delete params.gpax;
    }

    // update data
    if (allowUpdate) {
      User.update(params, {
        where: { apply_id: apply_id },
      })
        .then((node) => {
          if (node[0]) updatedResponse(`${params.apply_id}`, params, res);
          else return next(notFoundResponse(`${params.apply_id}`, res));
        })
        .catch((err) => {
          const errors = err.errors.map((item: any) => item.message);
          failureResponse('update user', errors, res);
        });
    } else {
      mismatchResponse(401, `${apply_id} permission denied `, res);
    }
  }

  /* ------------------------------- Delete User ------------------------------ */
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
        failureResponse('delete user', err.message, res);
      });
  }
}
