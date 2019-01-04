import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

const isProduction = process.env.NODE_ENV === 'production';

// import { send } from './functions/send-mail';

const app = express();
const db = require('./db'); 

// esto para que asigne correctamente los headers
app.use(cors());

// Configs de express
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.message = '404';
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('en dev');
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
} else { 
  console.log('en prod');
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

exports.app = functions.https.onRequest(app);

// exports.sendMail = functions.database
// .ref('/queo/queries/{pushId}')
// .onCreate(send);