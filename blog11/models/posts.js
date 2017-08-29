var Post = require('../lib/mongo').Post

module.exports = {
  create: function create(post) {
    return Post.create(post).exec()
  }
  // getUserByName: function getUserByName (name) {
  //     return User
  //       .findOne({ name: name})
  //       .addCreatedAt()
  //       .exec()
  // }
}