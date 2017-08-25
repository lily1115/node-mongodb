var express = require('express');
var router = express.Router();
var crypto = require('crypto');
User = require('../models/user.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录'})
})
router.post('/login', function(req, res, next){
  
})

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: '注册'})
})
router.post('/reg', function(req, res, next){
})
router.get('/post', function(req, res, next) {
  res.render('post', { title: '发布'})
})
router.post('/post', function(req, res, next){
})
router.post('/logout', function(req, res, next){
})
module.exports = router;
