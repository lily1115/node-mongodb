var express = require('express')
var bodyParser = require('body-parser')
var redis = require('./models/redis.js')

var app = express()
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// 捡漂流瓶 get  /?user=xxx[&type=xx]
app.get('/', function (req, res) {
  console.log('get', req.query)
  if(!req.query.user){
    return  res.json({code: 0, msg: '信息不完整'})
  }
  if(req.query.type && ['male', 'female', 'all'].indexOf(req.query.type) === -1) {
     return res.json({code: 0, msg: '类型错误'})
  }
  redis.pick(req.query, function (result) {
    return res.json(result)
  })
})
// 扔漂流瓶 post owner=xx&type=xxx&content=xxx[&time=xxx]
// 当是“扔回”的时候，time 参数是必需的
app.post('/', function (req, res) {
  console.log(111, req)
  if(!(req.body.owner && req.body.type && req.body.content)){
    return res.json({code: 0, msg: '信息不完整'})
  }
  if(req.query.type && ['male', 'female', 'all'].indexOf(req.query.type) === -1) {
    return res.json({code: 0, msg: '类型错误'})
  }
  redis.throw(req.body, function (result) {
    res.json(result)
  })
})
var port = 3000
app.listen(port, function () {
  console.log(`app is listening at ${port}`);
});