import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';
import Sequelize from 'sequelize';
import { User } from '../users/model';

export class Assessment extends Model {
  id: number;
  assessor_id: number;
  assessee_id: number;
  score?: number;
}

Assessment.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assessor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'assessment',
    modelName: 'assessment',
    sequelize: database, // this bit is important
  },
);

Assessment.sync({ alter: true });
