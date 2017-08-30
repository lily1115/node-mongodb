var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin
var PostModel = require('../models/posts')

// Get /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
    var author = req.query.author

    PostModel.getPosts(author)
      .then(function (posts) {
        res.render('posts', {
          posts: posts
        })
      })
      .catch(next)
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

    PostModel.create(post)
      .then(result => {
        post  = result.ops[0]
        console.log('post', post, result)
        req.flash('success', '发表成功')
        res.redirect(`/posts/${post._id}`)
      })
      .catch(next)
})

router.get('/create', checkLogin, function (req, res, next) {
    res.render('create')
})

router.get('/:postId', function (req, res, next) {
  var postId = req.params.postId
  Promise.all([
    PostModel.getPostById(postId),
    PostModel.incPv(postId)
  ])
  .then(result => {
    var post = result[0]
    if (!post) {
      throw new Error('文章不存在')
    }
    res.render('post', {
      post: post
    })
  })
  .catch(next)
})

router.get('/:postId/edit', checkLogin, function (req, res, next) {
    var postId = req.params.postId
    var author = req.session.user._id
    PostModel.getPostById(postId)
      .then((post) => {
        if (!post) {
          throw new Error('该文章不存在')
        }
        if (author.toString() !== post.author._id.toString()) {
          throw new Error('权限不足')
        }
        res.render('edit', {
          post: post
        })
      })
      .catch(next)
})

router.post('/:postId/edit', checkLogin, function (req, res, next) {
    var postId = req.params.postId
    var author = req.session.user._id
    var title = req.fields.title
    var content = req.fields.content
    PostModel.updatePostById(author, postId, {title: title, content: content})
      .then(() => {
        req.flash('success', '编辑成功')
        res.redirect(`/posts/${postId}`)
      })
      .catch(next)

})

router.get('/:postId/remove', checkLogin, function (req, res, next) {
    var postId = req.params.postId
    var author = req.session.user._id
    PostModel.delPostById(author, postId)
      .then(() => {
        req.flash('success', '删除文章成功')
        res.redirect('/posts')
      })
      .catch(next)
})

// 添加一条新留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
    var author = req.session.user._id
    var postId = req.params.postId
    var content = req.fields.content
    var comment = {
      author: author,
      postId: postId,
      content: content
    }
    CommentModel.create(comment)
      .then(() => {
        req.flash('succes', '留言成功')
        res.redirect('back')
      })
})

// 删除留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
    var author = req.session.user._id
    var postId = req.params.postId
    CommentModel.delCommentById(commentId, author)
      .then(() => {
        req.flash('success', '删除留言成功')
        res.redirect('back')
      })
      .catch(next)
})

module.exports = router