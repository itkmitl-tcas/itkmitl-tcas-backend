import { Request, Response } from 'express';
import { failureResponse, mismatchResponse, notFoundResponse, successResponse } from '../exceptions/HttpExceptions';
import { IRequestWithUser, ITokenData } from '../modules/users/interface';
import { checkReqBody, checkMappingTarget, createMappingPayload } from './helper';
import { Audit, IAudit } from '../modules/audit';
import { User } from '../modules/users/model';

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
      include: User,
    })
      .then((nodes: IAudit[]) => {
        if (nodes.length) {
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
}
