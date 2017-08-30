var Comment = require('../lib/mongo.js').Comment
var marked = require('marked')

Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(comment){
      comment.content = marked(comment.content)
      return comment
    }
  },
  afterFindOne: function (comment) {
    if (comment) {
      comment.content = marked(comment.content)
      return comment
    }
  }
})