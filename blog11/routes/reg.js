var fs = require('fs')
var path = require('path')
var sha1 = require('sha1')
var express = require('express')
var router = express.Router()

var UserModel = require('../models/users')
var checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup');
});