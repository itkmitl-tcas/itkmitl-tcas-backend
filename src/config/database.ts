// PROMISE LIBRARY
import env from './environment';
import { Sequelize } from 'sequelize';

const connectString = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRESS_HOST}:${
  env.POSTGRES_PORT
}/${env.POSTGRES_DB || ''}`;

let sequelize: any;
try {
  sequelize = new Sequelize(connectString, { logging: process.env.NODE_ENV == 'production' ? true : false });
} catch (err) {
  process.exit(1);
}
export const database = sequelize;
