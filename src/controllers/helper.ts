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

// export function findQuartile(min: number, max: number, val: number) {
//   const percentile = (arr: any[], val: number) =>
//     (100 * arr.reduce((acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0), 0)) / arr.length;

//   const arr = Array.from({ length: max }, (_, i) => i + min);
//   const pertile = percentile(arr, val);

//   if (pertile >= 0 && pertile < 25) return 2;
//   else if (pertile >= 25 && pertile < 50) return 3;
//   else if (pertile >= 50 && pertile < 75) return 4;
//   else if (pertile >= 75 && pertile <= 100) return 5;
//   else return 0;
// }

export function findPercentileValue(data: number[], value: number) {
  // get position of dataset
  let index = 0;
  while (1) {
    if (data[index] >= value) {
      data.splice(index, 0, value);
      break;
    }
    index += 1;
  }

  return Math.round((index / data.length) * 100);
}

export function findQuartile(value: number) {
  if (value >= 0 && value < 25) return 2;
  else if (value >= 25 && value < 50) return 3;
  else if (value >= 50 && value < 75) return 4;
  else if (value >= 75 && value <= 100) return 5;
  else return 0;
}

export function findPercentile(value: number) {
  if (value >= 0 && value < 10) return 1;
  else if (value >= 10 && value < 20) return 2;
  else if (value >= 20 && value < 30) return 3;
  else if (value >= 30 && value < 40) return 4;
  else if (value >= 40 && value < 50) return 5;
  else if (value >= 50 && value < 60) return 6;
  else if (value >= 60 && value < 70) return 7;
  else if (value >= 70 && value < 80) return 8;
  else if (value >= 80 && value < 90) return 9;
  else if (value >= 90 && value <= 100) return 10;
  else return 0;
}
