var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin
var PostModel = require('../models/posts')

// Get /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
//   res.send(req.flash())
    res.render('posts')
})
// POST /posts 发表一篇文章
router.post('/', checkLogin, function (req, res, next) {
    var author = req.session.user._id
    var title = req.fields.title
    var content = req.fields.content
    try {
      if(!title.length) {
        throw new Error('请填写标题')
      }
      if(!content.length) {
        throw new Error('请填写内容')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    var post = {
      author: author,
      title: title,
      content: content,
      pv: 0
    }
    // PostModel.create(post)
    //   .then(result => {
    //     post  = result.ops[0]
    //     console.log('post', post)
    //     req.flash('success', '发表成功')
    //     res.redirect(`/posts/${post._id}`)
    //   })
    PostModel.create(post)
      .then(function (result) {
        post  = result.ops[0]
        console.log('post', post)
        req.flash('success', '发表成功')
        res.redirect(`/posts/${post._id}`)
      })
})

router.get('/create', checkLogin, function (req, res, next) {
    res.render('create')
})

router.get('/:postId', function (req, res, next) {
    res.send(req.flash())
})

router.get('/:postId/edit', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

router.post('/:postId/edit', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

router.get('/:postId/remove', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

router.post('/:postId/comment', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
    res.send(req.flash())
})

module.exports = router