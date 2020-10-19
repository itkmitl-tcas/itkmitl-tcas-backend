'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.database = void 0;
// PROMISE LIBRARY
const environment_1 = __importDefault(require('../environment'));
const sequelize_1 = require('sequelize');
const connectString = `postgres://${environment_1.default.getDBUsername()}:${environment_1.default.getDBPassword()}@${environment_1.default.getHost()}:${environment_1.default.getDBPort()}/${environment_1.default.getDBName()}`;
const sequelize = new sequelize_1.Sequelize(connectString);
exports.database = sequelize;
//# sourceMappingURL=database.js.map
