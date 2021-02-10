import { IAudit } from 'src/modules/audit';
import { ITokenData } from '../modules/users/interface';

export function upsert(values: any, condition: any, model: any) {
  return model
    .findOne({ where: condition })
    .then(function (obj: any) {
      // update
      if (obj) return obj.update(values);
      // insert
      return model.create(values);
    })
    .catch((err: any) => err);
}

export function checkReqBody(params: any[]) {
  const empty = params.filter((param) => param);
  return empty.length == params.length ? true : false;
}

/**
 * @return teacher_id
 * @param user ITokenData - auth session
 * @param teacher_id number - teacher to mapping
 */
export function checkMappingTarget(user: ITokenData, teacher_id: number): number | false {
  return user.permission == 3 // me permission 3?
    ? teacher_id
    : user.apply_id == teacher_id // me is equal to teacher target
    ? teacher_id
    : false;
}

/**
 * @return IAudit[]
 * @param student_id number[] - list of student_id to mapping
 * @param target number - teacher to mapping
 */
export function createMappingPayload(student_id: number[], target: number): IAudit[] {
  return student_id.map(
    (id): IAudit => {
      return {
        student_id: id,
        teacher_id: target,
      };
    },
  );
}
