import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';
import { User } from '../users/model';

export class Docs extends Model {
  doc_id: number;
  transcript: string;
  identity_card: string;
  student_card: string;
  name_change: string;
  state?: boolean;
  static User: any;
}

Docs.init(
  {
    docs_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    apply_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'user',
        key: 'apply_id',
      },
    },
    transcript: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identity_card: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_card: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_change: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_portfolio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'document',
    modelName: 'document',
    sequelize: database, // this bit is important
  },
);

Docs.sync({ alter: true });
