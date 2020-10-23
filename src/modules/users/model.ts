import { Model, DataTypes } from 'sequelize';
import { database } from '../../config/database';
import { Docs } from '../document/model';

export class User extends Model {
  apply_id: number;
  prename?: string;
  name?: string;
  surname?: string;
  email?: string;
  mobile?: string;
  school_name?: string;
  pay?: boolean;
  gpax?: number;
  gpax_match?: number;
  gpax_eng?: number;
  gpax_com?: number;
  credit_total?: number;
  study_field?: string;
  apply_type?: string;
  permission?: number;
  static Docs: any;
}

User.init(
  {
    apply_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },

    apply_type: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    /* --------------------------------- Default Info -------------------------------- */
    prename: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    /* ------------------------------- School Info ------------------------------ */
    school_name: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    gpax: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    gpax_match: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    gpax_eng: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    gpax_com: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    credit_total: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    study_field: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    pay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    /* --------------------------------- System --------------------------------- */
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '<3',
    },
    permission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'user',
    modelName: 'user',
    sequelize: database, // this bit is important
  },
);

User.hasOne(Docs, {
  sourceKey: 'apply_id',
  foreignKey: 'apply_id',
});
Docs.belongsTo(User, {
  targetKey: 'apply_id',
  foreignKey: 'apply_id',
});

User.sync({ alter: true });
