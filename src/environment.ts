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
    return this.environment === Environments.prod_environment ? 3000 : 3000;
  }

  getHost(): string {
    return this.environment === Environments.prod_environment ? '' : '127.0.0.1';
  }

  getDBName(): string {
    return this.environment === Environments.prod_environment ? '' : '';
  }

  getDBPort(): number {
    return this.environment === Environments.prod_environment ? 5432 : 5432;
  }

  getDBUsername(): string {
    return this.environment === Environments.prod_environment ? '' : 'postgres';
  }

  getDBPassword(): string {
    return this.environment === Environments.prod_environment ? '' : '14577';
  }
}

export default new Environment(process.env.NODE_ENV);
