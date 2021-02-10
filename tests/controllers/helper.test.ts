import { checkReqBody } from '../../src/controllers/helper';

describe('Test checkReqBody', () => {
  describe('when pass array data', () => {
    const student_id = '60070157';
    const teacher_id = '10050001';
    const body = [student_id, teacher_id];
    it('should return true', () => {
      const data = checkReqBody(body);
      expect(data).toEqual(true);
    });
  });
  describe('when pass array empty data', () => {
    const student_id = '';
    const teacher_id = '';
    const body = [student_id, teacher_id];
    it('should return false', () => {
      const data = checkReqBody(body);
      expect(data).toEqual(false);
    });
  });

  describe('when pass some array empty data', () => {
    const student_id = '';
    const teacher_id = '10050001';
    const body = [student_id, teacher_id];
    it('should return false', () => {
      const data = checkReqBody(body);
      expect(data).toEqual(false);
    });
  });
});
