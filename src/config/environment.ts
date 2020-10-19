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
    return this.environment === Environments.prod_environment ? process.env.POSTGRES_HOST : 'localhost';
  }

  getDBName(): string {
    return this.environment === Environments.prod_environment ? process.env.POSTGRES_NAME : '';
  }

  getDBPort(): number {
    return this.environment === Environments.prod_environment ? +process.env.POSTGRES_PORT : 5432;
  }

  getDBUsername(): string {
    return this.environment === Environments.prod_environment ? process.env.POSTGRES_USER : 'postgres';
  }

  getDBPassword(): string {
    return this.environment === Environments.prod_environment ? process.env.POSTGRES_PASSWORD : 'password';
  }
}

export default new Environment(process.env.NODE_ENV);
