var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
//const promises = require('bluebird');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const init = require('./init')
const conf = require('./config')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));

app.use(express.static(path.join(__dirname, 'public')));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
//passport.use(new LocalStrategy(Account.createStrategy()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

let db_uri = 'mongodb://localhost/prachy';

// Connect mongoose
mongoose.Promise = global.Promise;
/*
old way with DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead
mongoose.connect(db_uri, function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});*/
// START of new way - resolves: DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead
mongoose.connect(db_uri, {
  useMongoClient: true,
  promiseLibrary: global.Promise
})

const db = mongoose.connection
 
db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  console.log('DB is now open')
  init.initializeSchemas(conf.appConfig)
})
// END of new way

// Register routes
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
console.log('... not found - 404 ...')
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
console.log('... dev 500 ...')
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
console.log('... 500 ...')
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
