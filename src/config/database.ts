// PROMISE LIBRARY
import env from './environment';
import { Sequelize } from 'sequelize';

const connectString = `postgres://${env.getDBUsername()}:${env.getDBPassword()}@${env.getHost()}:${env.getDBPort()}/${
  env.getDBName() || ''
}`;
const sequelize = new Sequelize(connectString);

export const database = sequelize;
