import app from './config/index';
import env from './config/environment';

const PORT = env.getPort();

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log(
    `postgres://${env.getDBUsername()}:${env.getDBPassword()}@${env.getHost()}:${env.getDBPort()}/${
      env.getDBName() || ''
    }`,
  );
  console.log('Express server listening on port ' + PORT);
});

// https://github.com/jpbinith/test-project/tree/master/lib
// http://rsseau.fr/en/programming/2019/06/19/express-typescript.html
// https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
