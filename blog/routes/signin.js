var express = require('express')
var sha1 = require('sha1')
var router = express.Router()
var UserModels = require('../models/users')
var checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/', checkNotLogin, function (req, res, next) {
  // res.send(req.flash())
  res.render('signin')
})

router.post('/', checkNotLogin, function (req, res, next) {
  var name = req.fields.name
  var password = req.fields.password
  UserModels.getUserByName(name)
    .then(function (user) {
      if (!user) {
        res.flash('error', '用户不存在')
        return res.redirect('back')
      }
      if(sha1(password) !== user.password){
        res.flash('error', '密码错误')
        return res.redirect('back')
      }
      req.flash('success', '登录成功')
      delete user.password
      req.session.user = user
      res.redirect('/posts')
    })
    .catch(next)
})

module.exports = router;