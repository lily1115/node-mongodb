var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
  name: { type: 'string'},
  password: { type: 'string'},
  avatar: { type: 'string'},
  gender: { type: 'string', enum: ['x', 'f', 'm']},
  bio: { type: 'string'}
})
// 根据用户名找到用户，用户名全局唯一
exports.User.index({ name: 1}, {unique: true}).exec()

var moment = require('moment')
var objectIdToTimestamp = require('objectid-to-timestamp')
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function(item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if(result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

exports.Post = mongolass.model('Post', {
  author: {type: Mongolass.Types.ObjectId},
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
})
// descending ranking
exports.Post.index({author: 1, _id: -1}).exec()