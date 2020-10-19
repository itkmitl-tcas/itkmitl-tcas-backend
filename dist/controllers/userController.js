'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserController = void 0;
const model_1 = require('../modules/users/model');
class UserController {
  // index to show list of nodes
  index(req, res) {
    model_1.User.findAll({})
      .then((nodes) => res.json(nodes))
      .catch((err) => res.status(500).json(err));
  }
  create(req, res) {
    const params = req.body;
    model_1.User.create(params)
      .then((node) => res.status(201).json(node))
      .catch((err) => res.status(500).json(err));
  }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map
