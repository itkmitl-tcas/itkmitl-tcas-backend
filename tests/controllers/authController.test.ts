import typeorm from 'typeorm';
import mockAxios from 'axios';
import { IToken, IUser, IUserSignIn } from '../../src/modules/users/interface';
import { AuthController } from '../../src/controllers//authController';
import App from '../../src/config/index';

describe('The AuthenticationService', () => {
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const tokenData: IToken = {
        token: '',
        expiresIn: 1,
      };
      expect(typeof AuthController.createCookie(tokenData)).toEqual('string');
    });
  });

  describe('when registering a user', () => {
    describe('if the apply_id is not exist in REG', () => {
      it('apply_id should return empty string', async () => {
        const userData: IUser = {
          apply_id: '60070157',
          name: 'วศิน',
          surname: 'เสริมสัมพันธ์',
        };
        const reg_res: IUserSignIn = await mockAxios
          .get(`https://reg.kmitl.ac.th/TCAS/service_IT/users/${userData.apply_id}`)
          .then((res) => res.data);
        expect(reg_res.apply_id == '');
        expect(typeof reg_res.apply_id == 'string');
      });
    });
  });

  // describe('POST /auth/signin', () => {
  //   describe('response should be Set-Cookie header with Authorization token', () => {
  //     const userData: IUser = {
  //       apply_id: '631001452',
  //       name: '???????',
  //       surname: '????????????????',
  //     };
  //     process.env.JWT_SECRET = 'jwt_secret';
  //     (typeorm as any).getRepository.mockReturnValue({
  //       findOne: () => Promise.resolve(userData),
  //       create: () => ({
  //         ...userData,
  //         _id: 0,
  //       }),
  //       save: () => Promise.resolve(),
  //     });
  //     const auth_controller: AuthController = new AuthController();
  //     // const app = new App([auth_controller]);
  //   });
  // });
});
