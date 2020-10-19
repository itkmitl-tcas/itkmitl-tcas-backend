// PROMISE LIBRARY
import env from './environment';
import { Sequelize } from 'sequelize';

const connectString = `postgres://${env.getDBUsername()}:${env.getDBPassword()}@${env.getHost()}:${env.getDBPort()}/${
  env.getDBName() || ''
}`;
console.log('stromgthing', connectString);
const sequelize = new Sequelize(connectString);

export const database = sequelize;
