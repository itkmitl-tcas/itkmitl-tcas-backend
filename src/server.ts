import app from './config/index';
import env from './environment';

const PORT = env.getPort();

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

// https://github.com/jpbinith/test-project/tree/master/lib
// http://rsseau.fr/en/programming/2019/06/19/express-typescript.html
