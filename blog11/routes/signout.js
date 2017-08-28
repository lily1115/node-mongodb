var express = require('express')
var Router = express.Router()

router.get('/', checkLogin, function (req, res, next) {
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/posts')
})
module.exports = router