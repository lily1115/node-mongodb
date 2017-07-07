var mongodb = require('db')
function User(user) {
    this.name = user.name
    this.password = user.password
    this.email = user.email
}

module.exports = User
// 存储用户信息
User.prototype.save = function (callback) {
    // 要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    }
    // 打开数据库
    mongodb.open(function(err, db) {
        if(err) {
            return callback(err) // 错误，返回err信息
        }
        // 读取users集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close()
                return callback(err)
            }
            collection.insert(user, {
                safe: true
            }, function(err, user){
                mongodb.close()
                if(err) {
                    return callback(err)
                }
                callback(null ,user[0])
            })
        })
    })
}
    // 读取数据库

// 存储用户信息
User.get = function (callback) {
    // 打开数据库
    mongodb.open(function(err, db) {
        if(err) {
            return callback(err) // 错误，返回err信息
        }
        // 读取users集合
        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close()
                return callback(err)
            }
            collection.findOne({
                name: name
            }, function(err, user){
                mongodb.close()
                if(err) {
                    return callback(err)
                }
                callback(null ,user)
            })
        })
    })
}
