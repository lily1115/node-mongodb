var redis = require('redis');
var uuid = require('node-uuid');
// var poolModule = require('generic-pool');
var GenericPool = require('generic-pool');
const factory = {
  create: function () {
    return new Promise(function (resolve, reject) {
      var client = redis.createClient()
      client.on('connected', function () {
        resolve(client)
      })
    })
  },
  destroy: function (client) {
    return new Promise (function (resolve) {
      client.on('end', function () {
        resolve()
      })
      client.quit()
    })
  }
}
var opts = {
  max: 100,
  min: 5, 
  idleTimeoutMillis: 30000,
  log: true
}
var pool = GenericPool.createPool(factory, opts)
// var pool = poolModule.Pool({
//   name: 'redisPool',
//   create: function (callback) {
//     var client = redis.createClient();
//     callback(null, client);
//   },
//   destroy: function (client) {
//     client.quit();
//   },
//   max: 100,
//   min: 5,
//   idleTimeoutMillis: 30000,
//   log: true
// });

// 扔一个瓶子
function throwOneBottle(bottle, callback) {
  bottle.time = bottle.time || Date.now();
  // 为每个漂流瓶随机生成一个 id
  var bottleId = uuid.v4();
  var type = { male: 0, female: 1 };
  pool.acquire(function (err, client) {
    if (err) {
      return callback({ code: 0, msg: err });
    }
    client.SELECT(type[bottle.type], function () {
      // 以 hash 类型保存漂流瓶对象
      client.hmset(bottleId, bottle, function (err, result) {
        if (err) {
          return callback({ code: 0, msg: "过会儿再试试吧！" });
        }
        // 设置漂流瓶生存期
        client.EXPIRE(bottleId, 86400, function () {
          // 释放连接
          pool.release(client);
        });
        // 返回结果，成功时返回 OK
        callback({ code: 1, msg: result });
      });
    });
  });
  const priority = 2
  pool.acquire(priority).then((resolve, reject) => {
    client.SELECT(type[bottle.type], function () {
      // 以 hash 类型保存漂流瓶对象
      client.HMSET(bottleId, bottle, function (err, result) {
        if (err) {
          return callback({ code: 0, msg: "过会儿再试试吧！" });
        }
        // 设置漂流瓶生存期
        client.EXPIRE(bottleId, 86400, function () {
          // 释放连接
          pool.release(client);
        });
        // 返回结果，成功时返回 OK
        resolve({ code: 1, msg: result });
      });
    }); 
  })
}

// 捡一个瓶子
function pickOneBottle(info, callback) {
  console.log(11222, info)
  var type = { all: Math.round(Math.random()), male: 0, female: 1 };
  info.type = info.type || 'all';
  const priority = 2
  pool.acquire(priority).then((resolve, reject) => {
    // 根据请求的瓶子类型到不同的数据库中取
    client.get(type[info.type], function () {
      // 随机返回一个漂流瓶 id
      client.RANDOMKEY(function (err, bottleId) {
        if (err) {
          return callback({ code: 0, msg: err });
        }
        console.log(111, bottleId)
        if (!bottleId) {
          return callback({ code: 0, msg: "大海空空如也..." });
        }
        // 根据漂流瓶 id 取到漂流瓶完整信息
        client.HGETALL(bottleId, function (err, bottle) {
          if (err) {
            return callback({ code: 0, msg: "漂流瓶破损了..." });
          }
          // 从 Redis 中删除该漂流瓶
          client.DEL(bottleId, function () {
            // 释放连接
            pool.release(client);
          });
          // 返回结果，成功时包含捡到的漂流瓶信息
          resolve({ code: 1, msg: bottle });
        })
      })
    })
  })
}

  // pool.acquire(function (err, client) {
  //   if (err) {
  //     return callback({ code: 0, msg: err });
  //   }
    
  // })

exports.pick = function (info, callback) {
  pickOneBottle(info, function (result) {
    callback(result);
  });
}

exports.throw = function (bottle, callback) {
  throwOneBottle(bottle, function (result) {
    callback(result);
  });
}