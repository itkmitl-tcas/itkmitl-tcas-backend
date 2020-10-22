// PROMISE LIBRARY
import env from './environment';
import { Sequelize } from 'sequelize';

const connectString = `postgres://${env.getDBUsername()}:${env.getDBPassword()}@${env.getHost()}:${env.getDBPort()}/${
  env.getDBName() || ''
}`;
const sequelize = new Sequelize(connectString, { logging: process.env.NODE_ENV == 'production' ? true : false });
export const database = sequelize;
