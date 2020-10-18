"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Environments;
(function (Environments) {
    Environments["local_environment"] = "local";
    Environments["dev_environment"] = "development";
    Environments["prod_environment"] = "production";
})(Environments || (Environments = {}));
class Environment {
    constructor(environment) {
        this.environment = environment;
    }
    getPort() {
        return this.environment === Environments.prod_environment ? 3000 : 3000;
    }
    getHost() {
        return this.environment === Environments.prod_environment ? '' : '127.0.0.1';
    }
    getDBName() {
        return this.environment === Environments.prod_environment ? '' : '';
    }
    getDBPort() {
        return this.environment === Environments.prod_environment ? 5432 : 5432;
    }
    getDBUsername() {
        return this.environment === Environments.prod_environment ? '' : 'postgres';
    }
    getDBPassword() {
        return this.environment === Environments.prod_environment ? '' : '14577';
    }
}
exports.default = new Environment(process.env.NODE_ENV);
//# sourceMappingURL=environment.js.map