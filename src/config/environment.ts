enum EName {
  local = 'local',
  stag = 'development',
  prod = 'production',
}

const Environment = {
  HTTP_ONLY: process.env.NODE_ENV == EName.prod ? true : false, // optional not use now
  FRONT_HOST: process.env.FRONT_HOST ? process.env.FRONT_HOST : 'http://localhost',
  FRONT_PORT: process.env.FRONT_PORT ? process.env.FRONT_PORT : '8080',
  APP_HOST: process.env.APP_HOST ? process.env.APP_HOST : 'http://localhost', // optional not use now
  APP_PORT: process.env.APP_PORT ? process.env.APP_PORT : '3001',
  POSTGRES_HOST: process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : 'localhost',
  POSTGRES_USER: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : '14577',
  POSTGRES_PORT: process.env.POSTGRES_PORT ? process.env.POSTGRES_PORT : 5432,
  POSTGRES_DB: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'postgres', // not use now postgres replace db name with user
  JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret',
};

export default Environment;
