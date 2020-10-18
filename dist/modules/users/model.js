"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../config/database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id: {
        type: sequelize_1.DataTypes.STRING(128),
    },
    prefix: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    first_name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    last_name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    phone_number: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    school: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    gpax: {
        type: new sequelize_1.DataTypes.FLOAT(1, 1),
        allowNull: false,
    },
    step: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    // *
    field: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    m_gpax: {
        type: new sequelize_1.DataTypes.FLOAT(1, 1),
        allowNull: false,
    },
    e_gpax: {
        type: new sequelize_1.DataTypes.FLOAT(1, 1),
        allowNull: false,
    },
    c_gpax: {
        type: new sequelize_1.DataTypes.FLOAT(1, 1),
        allowNull: false,
    },
    test: {
        type: new sequelize_1.DataTypes.FLOAT(1, 1),
        allowNull: false,
    },
    something: {
        type: new sequelize_1.DataTypes.FLOAT(1, 1),
        allowNull: false,
    },
}, {
    tableName: 'user',
    modelName: 'user',
    sequelize: database_1.database,
});
User.sync({ alter: true }).then(() => console.log('User table created'));
//# sourceMappingURL=model.js.map