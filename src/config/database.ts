// PROMISE LIBRARY
import env from './environment';
import { Sequelize } from 'sequelize';

const connectString = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRESS_HOST}:${
  env.POSTGRES_PORT
}/${env.POSTGRES_DB || ''}`;
const sequelize = new Sequelize(connectString, { logging: process.env.NODE_ENV == 'production' ? true : false });
export const database = sequelize;
