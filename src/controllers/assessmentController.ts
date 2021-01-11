import Sequelize, { Association } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import { IRequestWithUser } from '../modules/users/interface';
import { User } from '../modules/users/model';
import { Assessment } from '../modules/assessment';
import { IUser } from '../modules/users/interface';
import { Portfolio, PortfolioType } from '../modules/portfolio/model';
import {
  successResponse,
  createdResponse,
  insufficientParameters,
  failureResponse,
  notFoundResponse,
  deletedResponse,
} from '../exceptions/HttpExceptions';

export class AssessmentController {
  /* --------------------------------- Healthy -------------------------------- */
  public healthy(req: Request, res: Response) {
    successResponse('Assessment Controller api healthy.', null, res);
  }

  public async save(req: IRequestWithUser, res: Response) {
    const assessor_id = req.user.apply_id;
    const score = req.body.score;
    const assessee_id = req.body.assessee_id;

    await Assessment.update(
      { score: score },
      {
        where: { assessee_id: assessee_id },
      },
    );
    return successResponse('Success update', null, res);
  }

  public async get(req: IRequestWithUser, res: Response) {
    const assessor_id = req.user.apply_id;
    const Op = Sequelize.Op;

    // get assessee id
    let assessee: any = await Assessment.findAll({
      order: [['id', 'DESC']],
      where: {
        [Op.and]: [{ assessor_id: assessor_id }],
      },
      raw: true,
    });
    assessee = assessee.map((data: any) => data.assessee_id);

    // get assessee data
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        apply_id: {
          [Op.in]: assessee,
        },
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        Assessment,
        {
          model: Portfolio,
          include: [PortfolioType],
        },
      ],
    });

    return successResponse('Success get assessments', users, res);
  }

  public async start(req: IRequestWithUser, res: Response) {
    const assessor_id = req.user.apply_id;
    const amount = req.body.amount;
    const Op = Sequelize.Op;

    // check assessor already start
    const check = await Assessment.findOne({
      where: {
        assessor_id: assessor_id,
      },
    });

    if (check) return successResponse('Success.', null, res);

    let assessments: any = await Assessment.findAll();
    assessments = assessments.map((data: any) => data.assessee_id);

    const users = await User.findAll({
      limit: amount,
      where: {
        [Op.and]: [
          {
            apply_id: { [Op.notIn]: assessments },
          },
          {
            permission: { [Op.lt]: 2 },
          },
          {
            step: 4,
          },
        ],
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Portfolio,
          include: [PortfolioType],
        },
      ],
    });

    const bulk = [];
    for (const k in users) {
      const user = users[k];
      const assessee_id = user.apply_id;

      bulk.push({
        assessor_id: assessor_id,
        assessee_id: assessee_id,
      });
    }
    await Assessment.bulkCreate(bulk);
    return successResponse('Success create', users, res);
  }
}
