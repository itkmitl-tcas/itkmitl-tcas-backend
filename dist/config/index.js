'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const body_parser_1 = __importDefault(require('body-parser'));
const user_routes_1 = require('../routes/user_routes');
class App {
  constructor() {
    this.user_routes = new user_routes_1.UserRoutes();
    this.app = express_1.default();
    this.config();
    this.user_routes.route(this.app);
  }
  config() {
    // support application/json type post data
    this.app.use(body_parser_1.default.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(body_parser_1.default.urlencoded({ extended: false }));
  }
}
exports.default = new App().app;
//# sourceMappingURL=index.js.map
