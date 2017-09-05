var Comment = require('../lib/mongo.js').Comment
var marked = require('marked')

Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map((comment) => {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  create: function create (comment) {
    return Comment.create(comment).exec()
  },
  // 通过用户ID 和留言ID 删除留言
  delCommentById: function delCommentById (commentId, author) {
    return Comment.remove({author: author, _id: commentId}).exec()
  },
  // 通过文章ID 删除文章下面的所以留言
  delCommentByPostId: function delCommentByPostId (postId) {
    return Comment.remove({postId: postId}).exec()
  },
  // 根据文章ID 获取评论 并升序排列
  getComments: function getComments (postId) {
    return Comment
      .find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 获取评论数
  getCommentsCount: function getCommentsCount (postId) {
    return Comment.count({postId: postId}).exec()

  }
}