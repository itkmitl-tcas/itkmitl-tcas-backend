enum Environments {
  local_environment = 'local',
  dev_environment = 'development',
  prod_environment = 'production',
}

class Environment {
  private environment: string;

  constructor(environment: string) {
    this.environment = environment;
  }

  getPort(): number {
    return this.environment === Environments.prod_environment ? +process.env.APP_PORT : 3000;
  }

  getHost(): string {
    return this.environment === Environments.prod_environment ? process.env.DB_HOST : '127.0.0.1';
  }

  getDBName(): string {
    return this.environment === Environments.prod_environment ? process.env.DB_NAME : '';
  }

  getDBPort(): number {
    return this.environment === Environments.prod_environment ? +process.env.DB_PORT : 5432;
  }

  getDBUsername(): string {
    return this.environment === Environments.prod_environment ? process.env.DB_USERNAME : 'postgres';
  }

  getDBPassword(): string {
    return this.environment === Environments.prod_environment ? process.env.DB_PASSWORD : '14577';
  }
}

export default new Environment(process.env.NODE_ENV);
