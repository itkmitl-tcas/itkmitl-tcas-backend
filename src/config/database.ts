// PROMISE LIBRARY
import env from './environment';
import { Sequelize } from 'sequelize';

const connectString = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
const sequelize = new Sequelize(connectString, {
  logging: process.env.NODE_ENV == 'production' ? true : false,
  omitNull: true,
});
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database', error);
  process.exit(1);
}
export const database = sequelize;
