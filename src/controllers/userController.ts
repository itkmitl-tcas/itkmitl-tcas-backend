import { Request, Response, NextFunction } from 'express';
import { fn, col } from 'sequelize';
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
import { Portfolio, PortfolioType } from '../modules/portfolio/model';
import url from 'url';
import Sequelize from 'sequelize';
import { upsert } from './helper';
import bcrypt from 'bcrypt';

export class UserController {
  /* -------------------------------- Healthly -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('User api healthy.', null, res);
  }

  /* ------------------------------- Get Teacher ------------------------------ */
  public async getTeacher(req: IRequestWithUser, res: Response, next: NextFunction) {
    const Op = Sequelize.Op;
    await User.findAll({
      where: {
        permission: {
          [Op.gte]: 2,
        },
      },
      attributes: { exclude: ['password'] },
    })
      .then((nodes) => {
        if (nodes.length) successResponse('Get teacher', nodes, res);
        else notFoundResponse('get teacher', res);
      })
      .catch((err) => {
        failureResponse('get teacher', err.message, res);
      });
  }
  /* ------------------------------- Get Teacher ------------------------------ */
  public async getStudent(req: IRequestWithUser, res: Response, next: NextFunction) {
    const Op = Sequelize.Op;
    const query = url.parse(req.url, true);

    const year = query.query.year
      ? Sequelize.where(Sequelize.cast(Sequelize.col('user.createdAt'), 'varchar'), {
          [Op.iLike]: `%${query.query.year}%`,
        })
      : null;
    const step = query.query.step ? { step: +query.query.step } : null;
    const audit_step = query.query.audit_step ? { audit_step: +query.query.audit_step } : null;
    await User.findAll({
      where: {
        [Op.and]: [
          { permission: 1 },
          {
            [Op.or]: [
              Sequelize.where(Sequelize.cast(Sequelize.col('user.apply_id'), 'varchar'), {
                [Op.iLike]: `%${query.query.search}%`,
              }),
              {
                name: {
                  [Op.like]: `%${query.query.search}%`,
                },
              },
              {
                surname: {
                  [Op.like]: `%${query.query.search}%`,
                },
              },
              {
                apply_type: {
                  [Op.like]: `%${query.query.search}%`,
                },
              },
            ],
          },
          year,
          step,
          audit_step,
        ],
      },
      attributes: {
        exclude: ['password'],
      },
    })
      .then((nodes) => {
        if (nodes.length) successResponse('Get student', nodes, res);
        else notFoundResponse('student', res);
      })
      .catch((err) => {
        console.log(err);
        failureResponse('teacher', err.message, res);
      });
  }

  /* ----------------------------- Get User By ID ----------------------------- */
  public get(req: IRequestWithUser, res: Response, next: NextFunction) {
    // failureResponse('get user', null, res);
    const apply_id = req.body.apply_id;
    const auth_permission = req.user.permission;
    const auth_apply_id = req.user.apply_id;
    const where = auth_permission > 1 ? { apply_id: apply_id } : { apply_id: auth_apply_id };
    User.findOne({
      where: where,
      attributes: {
        exclude: ['password'],
      },
      include: [
        Docs,
        {
          model: Portfolio,
          include: [PortfolioType],
        },
      ],
    })
      .then((node) => {
        if (node) successResponse(apply_id, node, res);
        else next(notFoundResponse(apply_id, res));
      })
      .catch((err) => {
        console.log(err);
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

  /* ----------------------------- Upsert Teacher ----------------------------- */
  public async upsertTeacher(req: Request, res: Response) {
    const payload = req.body;
    payload['permission'] = 2;
    await upsert(payload, { email: payload.email }, User)
      .then((resp: any) => {
        createdResponse(`${payload.email}`, resp, res);
      })
      .catch((err: any) => {
        insufficientParameters(err.errors[0].message, res);
      });
  }

  public async createTeacher(req: Request, res: Response) {
    const payload = req.body;

    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
    await User.create(payload)
      .then((resp: any) => {
        createdResponse(`${payload.email}`, resp, res);
      })
      .catch((err: any) => {
        insufficientParameters(err.errors[0].message, res);
      });
  }

  public async deleteTeacher(req: Request, res: Response) {
    const payload = req.params;
    const target = payload.apply_id;
    await User.destroy({
      where: {
        apply_id: target,
      },
    })
      .then((resp) => {
        // 1 success delete
        if (resp) deletedResponse(`${target}`, resp, res);
        // 0 not found
        else failureResponse(`${target}`, `not found resource ${target}`, res, 504);
      })
      // any error
      .catch((err) => {
        failureResponse(`${target}`, err.message || 'delete teacher failed', res);
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
