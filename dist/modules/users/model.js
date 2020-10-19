'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const sequelize_1 = require('sequelize');
const database_1 = require('../../config/database');
class User extends sequelize_1.Model {}
exports.User = User;
User.init(
  {
    _id: {
      type: sequelize_1.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    apply_id: {
      type: sequelize_1.DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    apply_type: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: true,
    },
    /* --------------------------------- Default Info -------------------------------- */
    prefix: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
    },
    surname: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
    },
    /* ------------------------------- School Info ------------------------------ */
    school: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
    },
    gpax: {
      type: new sequelize_1.DataTypes.FLOAT(1, 1),
      allowNull: false,
    },
    gpax_match: {
      type: new sequelize_1.DataTypes.FLOAT(1, 1),
      allowNull: true,
    },
    gpax_eng: {
      type: new sequelize_1.DataTypes.FLOAT(1, 1),
      allowNull: true,
    },
    gpax_com: {
      type: new sequelize_1.DataTypes.FLOAT(1, 1),
      allowNull: true,
    },
    credit_total: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: true,
    },
    study_field: {
      type: new sequelize_1.DataTypes.STRING(128),
      allowNull: false,
    },
    /* --------------------------------- System --------------------------------- */
    step: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    pay: {
      type: sequelize_1.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'user',
    modelName: 'user',
    sequelize: database_1.database,
  },
);
User.sync({ alter: true }).then(() => console.log('User table created'));
//# sourceMappingURL=model.js.map
