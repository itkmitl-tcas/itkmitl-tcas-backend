import { Request } from 'express';

export interface IUser {
  apply_id: string;
  prename?: string;
  name?: string;
  surname?: string;
  email?: string;
  mobile?: string;
  school_name?: string;
  pay?: boolean;
  gpax?: number;
  gpax_match?: number;
  gpax_eng?: number;
  gpax_com?: number;
  credit_total?: number;
  study_field?: string;
  apply_type?: string;
  permission?: number;
}

export interface IUserSignIn {
  apply_id: string;
  prename: string;
  name: string;
  surname: string;
  email: string;
  mobile: string;
  school_name: string;
  pay: string;
  gpax: string;
  gpax_match: string;
  gpax_eng: string;
  gpax_com: string;
  credit_total: string;
  study_field: string;
  apply_type: string;
}

export interface IToken {
  token: string;
  expiresIn: number;
}

export interface ITokenData {
  apply_id: string;
  permission: number;
}

export interface IRequestWithUser extends Request {
  user: IUser;
}
