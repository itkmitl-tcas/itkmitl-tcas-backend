import app from './config/index';
import env from './config/environment';

const PORT = env.APP_PORT;

const server = app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT} (${process.env.NODE_ENV || 'local'})`);
});

// https://github.com/jpbinith/test-project/tree/master/lib
// http://rsseau.fr/en/programming/2019/06/19/express-typescript.html
// https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
