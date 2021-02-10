import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';
import Sequelize from 'sequelize';

export class Audit extends Model {
  id?: number;
  student_id: number;
  teacher_id: number;
  score?: number;
}

export interface IAudit {
  id?: number;
  student_id: number;
  teacher_id: number;
  score?: number;
}

Audit.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'user',
        key: 'apply_id',
      },
    },
    teacher_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'apply_id',
      },
    },
    score: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'audit',
    modelName: 'audit',
    sequelize: database, // this bit is important
  },
);

Audit.sync({ alter: true });
