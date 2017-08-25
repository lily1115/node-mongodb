var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var crypto = require("crypto")
var md5 = crypto.createHash('md5')

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var flash = require('connect-flash')
var settings = require('./setting')


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

app.use(session({
  secret: settings.cookieSecret,
  saveUninitialized: false, // don't create session until something stored 
  resave: false, //don't save session if unmodified 
  cookie: {
    maxAge: 1000*60*60*24*30 // 30days
  },
  store: new MongoStore({
    url: 'mongodb://localhost/myblog'
  })
}))

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
