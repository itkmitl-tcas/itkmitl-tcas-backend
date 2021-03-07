import { AuditController } from '../../src/controllers/auditController';
import { IRequestWithUser, ITokenData } from '../../src/modules/users/interface';

const auditController: AuditController = new AuditController();

// init mockup
const mockUser = { apply_id: '', permission: '' };
const mockBody = { student_id: '', teacher_id: '' };

const mockRequest = (user = mockUser, body = mockBody) => {
  return {
    user: user,
    body: body,
  };
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Test checkMappingTarget', () => {
  const teacher_id = 10050001;
  describe('when user permission 3', () => {
    it('should return teacher_id', () => {
      expect(
        auditController.checkMappingTarget(
          {
            apply_id: 60070157,
            permission: 3,
          },
          teacher_id,
        ),
      ).toEqual(teacher_id);
    });
  });
  describe('when user permission 2 and owner of teacher_id', () => {
    it('should return teacher_id', () => {
      expect(
        auditController.checkMappingTarget(
          {
            apply_id: 10050001,
            permission: 2,
          },
          teacher_id,
        ),
      ).toEqual(teacher_id);
    });
  });
  describe('when user permission 2 and not owner of teacher_id', () => {
    it('should return teacher_id', () => {
      expect(
        auditController.checkMappingTarget(
          {
            apply_id: 60070157,
            permission: 2,
          },
          teacher_id,
        ),
      ).toEqual(false);
    });
  });
});

describe('Test createMappingPayload', () => {
  const student_id = [10070001, 10070002];
  const target = 60070157;
  describe('when pass student_id: number[]', () => {
    it('should return Record<string: number>[]', () => {
      expect(auditController.createMappingPayload(student_id, target)).toEqual([
        {
          student_id: 10070001,
          teacher_id: 60070157,
        },
        {
          student_id: 10070002,
          teacher_id: 60070157,
        },
      ]);
    });
  });
});

describe('Test mapping', () => {
  test('should 400 if req.user is empty', async () => {
    const req: any = mockRequest(
      { apply_id: '', permission: '' },
      { student_id: '60070158, 60070159', teacher_id: '10050001' },
    );
    const res = mockResponse();
    await auditController.mapping(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should 400 if req.body is empty', async () => {
    const req: any = mockRequest({ apply_id: '60070157', permission: '3' }, { student_id: '', teacher_id: '' });
    const res = mockResponse();
    await auditController.mapping(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should 400 if req.user, req.body is empty', async () => {
    const req: any = mockRequest({ apply_id: '', permission: '' }, { student_id: '', teacher_id: '' });
    const res = mockResponse();
    await auditController.mapping(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should 401 if req.user.permission not equal 3 and not owner teacher_id', async () => {
    const req: any = mockRequest(
      { apply_id: '60070157', permission: '2' },
      { student_id: '60070158 60070159', teacher_id: '60070158' },
    );
    const res = mockResponse();
    await auditController.mapping(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // test('should 200 if req.user.permission not equal 3 and owner teacher_id', async () => {
  //   const req: any = mockRequest(
  //     { apply_id: '60070157', permission: '2' },
  //     { student_id: '60070158, 631001294', teacher_id: '60070157' },
  //   );
  //   const res = mockResponse();
  //   await auditController.mapping(req, res, true);
  //   expect(res.status).toHaveBeenCalledWith(200);
  // });
});
