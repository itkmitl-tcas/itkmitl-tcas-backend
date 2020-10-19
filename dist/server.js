'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const index_1 = __importDefault(require('./config/index'));
const environment_1 = __importDefault(require('./environment'));
const PORT = environment_1.default.getPort();
index_1.default.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});
// https://github.com/jpbinith/test-project/tree/master/lib
// http://rsseau.fr/en/programming/2019/06/19/express-typescript.html
//# sourceMappingURL=server.js.map
