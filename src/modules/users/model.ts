import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';

export class User extends Model {}

User.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    apply_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    apply_type: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    /* --------------------------------- Default Info -------------------------------- */
    prename: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    surname: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    /* ------------------------------- School Info ------------------------------ */
    school_name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    gpax: {
      type: new DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
    gpax_match: {
      type: new DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    gpax_eng: {
      type: new DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    gpax_com: {
      type: new DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    credit_total: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    study_field: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    /* --------------------------------- System --------------------------------- */
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    pay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'user',
    modelName: 'user',
    sequelize: database, // this bit is important
  },
);

User.sync({ alter: true });
