import { Request, Response } from 'express';
import {
  deletedResponse,
  failureResponse,
  mismatchResponse,
  notFoundResponse,
  successResponse,
} from '../exceptions/HttpExceptions';
import { IRequestWithUser, ITokenData } from '../modules/users/interface';
import { checkReqBody, checkMappingTarget, createMappingPayload } from './helper';
import { Audit, IAudit } from '../modules/audit';
import { User } from '../modules/users/model';
import { findQuartile, findPercentile, findPercentileValue } from './helper';
import Sequelize from 'sequelize';
import xlsx from 'xlsx';
import * as fs from 'fs';
export class AuditController {
  public healthy(req: Request, res: Response) {
    successResponse('Audit api healthy.', null, res);
  }

  public async get(req: IRequestWithUser, res: Response) {
    const user: ITokenData = req.user;
    const teacher_id: any = req.params.teacher_id;

    /**
     * - permission 2 user can view only owner audit student
     * - permission 3 user can view all teacher
     */
    const target = checkMappingTarget(user, teacher_id);
    if (!target) return mismatchResponse(401, `teacher_id ${teacher_id} permission denind.`, res);

    /**
     * - query, response
     */
    await Audit.findAll({
      where: {
        teacher_id: teacher_id,
      },
      include: ['audit_student'],
    })
      .then((nodes: IAudit[]) => {
        if (nodes.length) {
          nodes = nodes.filter((item: any) => item.audit_student.audit_step < 2);
          return successResponse(`Mapping`, nodes, res);
        } else {
          return notFoundResponse(teacher_id, res);
        }
      })
      .catch((err) => {
        failureResponse(`mapping`, `${err.message}`, res);
      });
  }

  /**
   * Mapping between list of student and target teacher
   * @return res
   * @param user ITokenData - *user session
   * @param student_id number[] - *from req.body.student_id
   * @param teacher_id number - *from req.body.teacher_id
   */
  public async mapping(req: IRequestWithUser, res: Response) {
    const user: ITokenData = req.user;
    const studentRaw: string = req.body.student_id;
    const teacherRaw: number = req.body.teacher_id;
    const student_id: number[] = studentRaw.split(',').map((student: string) => +student);
    const teacher_id = +teacherRaw;

    // ! *it's validate by middleware
    // if (!checkReqBody([student_id, teacher_id]) || !user.apply_id)
    //   return insufficientParameters('student_id, teacher_id', res);

    /**
     * - permission 2 user can only mapping oneself with student
     * - permission 3 user can mapping other teacher with student
     */
    const target = checkMappingTarget(user, teacher_id);
    if (!target) return mismatchResponse(401, `teacher_id ${teacher_id} permission denind.`, res);

    /**
     * - create payload, query, response
     */
    const payload = createMappingPayload(student_id, target);
    await Audit.bulkCreate(payload, { returning: ['student_id'] })
      .then((nodes) => {
        User.update(
          {
            audit_step: 1,
          },
          {
            where: {
              apply_id: student_id,
            },
          },
        );
        return successResponse(`Mapping`, nodes, res);
      })
      .catch((err) => {
        if (err.errors) {
          failureResponse(`mapping`, `${err.errors[0].message} [${err.errors.map((item: any) => item.value)}]`, res);
        } else {
          failureResponse(`mapping`, `${err.message}`, res);
        }
      });
  }

  public async delete(req: IRequestWithUser, res: Response) {
    const student_id: any = req.params.student_id;

    await Audit.destroy({
      where: {
        student_id: student_id,
      },
    })
      .then((resp) => {
        User.update(
          {
            audit_step: 0,
          },
          {
            where: {
              apply_id: student_id,
            },
          },
        );
        return deletedResponse(`${student_id}`, resp, res);
      })
      .catch((err) => {
        failureResponse(`delete mapping`, `${err.message}`, res);
      });
  }

  public async gradeAudit(req: IRequestWithUser, res: Response) {
    const user: ITokenData = req.user;
    const studentRaw: string = req.body.student_id;
    const student_id: number = +studentRaw;
    const apply_type = req.body.apply_type;
    const student = await User.findAll({ where: { apply_id: student_id } });

    const where = Sequelize.where(Sequelize.cast(Sequelize.col('user.createdAt'), 'varchar'), {
      [Sequelize.Op.iLike]: `%${new Date().getFullYear()}%`,
    });

    const student_math: number = +student[0].gpax_match;
    const student_eng: number = +student[0].gpax_eng;
    const student_gpax: number = +student[0].gpax;

    const gpax_datas = await User.findAll({ attributes: ['gpax', 'gpax_match', 'gpax_eng'], where: where });
    const gpax_math = gpax_datas
      .map((item) => item.gpax_match)
      .filter((item) => item !== null)
      .sort();
    const gpax_eng = gpax_datas
      .map((item) => item.gpax_eng)
      .filter((item) => item !== null)
      .sort();
    const gpax_all = gpax_datas
      .map((item) => item.gpax)
      .filter((item) => item !== null)
      .sort();

    const math_percentileVal = findPercentileValue(gpax_math, student_math);
    const math_quartilePos = findQuartile(math_percentileVal);
    // const math_percnetilePos = findPercentile(math_percentileVal);

    const eng_percentileVal = findPercentileValue(gpax_eng, student_eng);
    const eng_quartilePos = findQuartile(eng_percentileVal);
    // const eng_percnetilePos = findPercentile(eng_percentileVal);

    const all_percentileVal = findPercentileValue(gpax_all, student_gpax);
    const all_percnetilePos = findPercentile(all_percentileVal);

    return successResponse(
      'Audit grade',
      {
        math: math_quartilePos,
        eng: eng_quartilePos,
        all: all_percnetilePos,
      },
      res,
    );
  }

  public async submitAudit(req: IRequestWithUser, res: Response) {
    const user: ITokenData = req.user;
    const teacher_id: number = +user.apply_id;
    const student_id: number = +req.body.student_id;
    const score = +req.body.score;

    try {
      const resp = await Audit.update(
        {
          score: score,
        },
        {
          where: {
            student_id: student_id,
            teacher_id: teacher_id,
          },
        },
      );

      await User.update(
        {
          audit_step: 2,
        },
        {
          where: {
            apply_id: student_id,
          },
        },
      );
      return successResponse('Submit audit', resp, res);
    } catch (err) {
      return failureResponse('submit audit', err.message, res);
    }
  }

  public async exportAudit(req: Request, res: any) {
    await Audit.findAll({
      raw: true,
      where: {
        score: {
          [Sequelize.Op.gt]: 0,
        },
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: User,
          as: 'audit_student',
          attributes: {
            exclude: ['password', 'apply_id', 'pay', 'permission', 'audit_step', 'step', 'createdAt', 'updatedAt'],
          },
        },
      ],
    })
      .then((nodes) => {
        if (nodes.length) {
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
          const filename = 'export.xlsx';
          const heading = [
            [
              'id',
              'รหัสนักศึกษา (student_id)',
              'รหัสผู้ตรวจ (teacher_id)',
              'คะแนน (score)',
              'ประเภทการสมัคร (apply_type)',
              'คำนำหน้า (prename)',
              'ชื่อต้น (name)',
              'นามสกุล (surname)',
              'อีเมลล์ (email)',
              'เบอร์โทร (tel)',
              'โรงเรียน (school)',
              'gpax รวม (gpax_all)',
              'gpax คณิตศาสตร์ (gpax_math)',
              'gpax ภาษาอังกฤษ (gpax_eng)',
              'gpax คอมพิวเตอร์ (gpax_com)',
              'หน่วยกิตรวม (credit_total)',
              'แผนการเรียน (study_field)',
            ],
          ];
          const wb = xlsx.utils.book_new();
          const ws = xlsx.utils.json_to_sheet(nodes, { skipHeader: true });
          ws['!cols'] = [
            { wch: 5 },
            { wch: 10 },
            { wch: 10 },
            { wch: 5 },
            { wch: 50 },
            { wch: 10 },
            { wch: 10 },
            { wch: 15 },
            { wch: 25 },
            { wch: 15 },
            { wch: 30 },
            { wch: 5 },
            { wch: 5 },
            { wch: 5 },
            { wch: 5 },
            { wch: 10 },
            { wch: 20 },
          ];
          xlsx.utils.sheet_add_aoa(ws, heading);
          xlsx.utils.book_append_sheet(wb, ws);
          xlsx.writeFile(wb, filename, { bookType: 'xlsx', type: 'binary' });
          const stream = fs.createReadStream(filename);
          stream.pipe(res);

          // successResponse('Export audit', nodes, res);
        } else notFoundResponse('audit', res);
      })
      .catch((err) => {
        failureResponse('export audit', err.message, res);
      });
  }
}
