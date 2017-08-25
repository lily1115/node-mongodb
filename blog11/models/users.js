// const Mongolass = require('mongolass')
// const mongolass = new Mongolass('mongodb://localhost:27017/test')

var User = require('../lib/mongo').User

module.exports = {
  create: function create(user) {
    return User.create(user).exec()
  }
}

// User
//   .inserOne({ name: 'lily', age: 12})
//   .exec()
//   .then(console.log)
//   .catch(function (e) {
//     console.error(e)
//     console.error(e.stack)
//   })