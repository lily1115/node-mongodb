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
var pkg = require('./package.json')
var config = require('config-lite')(__dirname)
var routes = require('./routes')

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
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/images'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

app.use(session({
  name: config.session.key, // 设置cookie中保存session_id的字段名称
  secret: config.session.secret,
  saveUninitialized: false, // don't create session until something stored 
  resave: true, // 强制更新 session
  cookie: {
    maxAge: config.session.maxAge // 30days
  },
  store: new MongoStore({
    url: config.mongodb
  })
}))

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
//   res.locals.message = err.message;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
routes(app)


app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
})
module.exports = app;
