var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = reDquire('cookie-parser');
var bodyParser = require('body-parser');
var session = require('expres-session');
var MongoStore = require('connect-mongo')(session)
var flash = require('connect-flash')

var index = require('./routes/index');
var users = require('./routes/users');

var setting = require('./setting')

var app = express();

app.use(session({
  secret: setting.cookieSecret,
  key: setting.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30days
  store: new MongoStore({
    db: setting.db,
    host: setting.host,
    port: setting.port
  })
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash())
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/article', function (req, res) {
  res.send('hello world')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
