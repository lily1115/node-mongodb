var Post = require('../lib/mongo').Post
var commentModel = require('./comments')
var marked = require('marked')

Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
      return post
    }
  }
})
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map((post) => {
      return commentModel.getCommentsCount(post._id).then((commentsCount) => {
        post.commentsCount = commentsCount
        return post
      })
    }))
  },
  afterFindOne: function (post) {
    if (post) {
      return commentModel.getCommentsCount(post._id).then((commentsCount) => {
        post.commentsCount = commentsCount
        return post
      })
    }
  }
})
module.exports = {
  // 创建一篇文章
  create: function create(post) {
    return Post.create(post).exec()
  },
  // 通过文字ID获取一篇文章
  getPostById: function getPostById(postId){
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },
  // 按照降序获取所有用户文章或者某个特定用户的所有文章
  getPosts: function getPosts(author) {
    var query = {}
    if(author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },
  // 给文章加pv
  incPv: function incPv(postId) {
    return Post
      .update({_id: postId}, { $inc: {pv: 1}})
      .exec()
  },
  // 通过文章id 获取一篇原生文章
  getPostById: function getPostById (postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .exec()
  },
  //  通过用户id 和 文章id 更新一篇文章
  updatePostById: function updatePostById (author, postId, data) {
    return Post
      .update({ author: author, _id: postId}, { $set: data })
      .exec()
  },
  // 通过用户id和文章id删除文章
  delPostById: function delPostById (author, postId) {
    return Post.remove({ author: author, _id: postId })
      .exec()
      .then((res) => {
        if (res.result.ok && res.result.n > 0) {
          return commentModel.delCommentByPostId(postId)
        }
      })
  }
  // getUserByName: function getUserByName (name) {
  //     return User
  //       .findOne({ name: name})
  //       .addCreatedAt()
  //       .exec()
  // }
}