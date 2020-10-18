"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const userController_1 = require("../controllers/userController");
class UserRoutes {
    constructor() {
        this.user_controller = new userController_1.UserController();
    }
    route(app) {
        // app.get('/user', (req: Request, res: Response) => {
        //   this.user_controller.index;
        // });
        app.route('/users').get(this.user_controller.index);
        app.route('/users').post(this.user_controller.create);
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=user_routes.js.map