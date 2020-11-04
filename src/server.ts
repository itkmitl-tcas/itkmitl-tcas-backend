import app from './config/index';
import env from './config/environment';
import fs from 'fs';
import https from 'https';

const PORT = env.APP_PORT;

// const { key, cert } = await (() => {
//   const certdir = fs.readFileSync('/etc/letsencrypt/live')[0];

//   return {
//     key: fs.readFileSync(`/etc/letsencrypt/live/${certdir}/privkey.pem`),
//     cert: fs.readFileSync(`/etc/letsencrypt/live/${certdir}/fullchain.pem`),
//   };
// })();

if (process.env.NODE_ENV == 'production') {
  const server = https.createServer(
    {
      key: fs.readFileSync(`/etc/nginx/ssl/privkey.pem`),
      cert: fs.readFileSync(`/etc/nginx/ssl/fullchain.pem`),
    },
    app,
  );
  server.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT} (${process.env.NODE_ENV || 'local'})`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT} (${process.env.NODE_ENV || 'local'})`);
  });
}

// https://github.com/jpbinith/test-project/tree/master/lib
// http://rsseau.fr/en/programming/2019/06/19/express-typescript.html
// https://wanago.io/2018/12/17/typescript-express-error-handling-validation/
