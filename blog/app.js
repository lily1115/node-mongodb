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

var winston = require('winston'),
    expressWinston = require('express-winston');

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
// flash 中间件，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/images'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

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

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
 // express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));
    
routes(app)
// app.use(router); // notice how the router goes after the logger.

app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  })
})

const port = process.env.PORT || config.port
app.listen(port, function () {
  console.log(`${pkg.name} listening on port ${port}`)
})
// app.listen(config.port, function () {
//     console.log(`${pkg.name} listening on port ${config.port}`)
// })

// if (module.parent) {
//   module.exports = app;
// } else {
//   // 监听端口，启动程序
//   app.listen(config.port, function () {
//     console.log(`${pkg.name} listening on port ${config.port}`);
//   });
// }
module.exports = app;