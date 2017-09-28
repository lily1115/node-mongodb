var express = require('express')
var router = express.Router()
var Model = require('../models/redis')

// 捡漂流瓶 get  /?user=xxx[&type=xx]
router.get('/', function (req, res) {
    if(!req.query.user){
        res.json({code: 0, msg: '信息不完整'})
    }
    if(req.query.type && ['male', 'female', 'all'].indexOf(req.query.type) === -1) {
        res.json({code: 0, msg: '类型错误'})
    }
    Model.pick(req.body, function (result) {
        res.json(result)
    })
})
// 扔漂流瓶 post owner=xx&type=xxx&content=xxx[&time=xxx]
router.post('/', function (req, res) {
    if(!(req.body.owner && req.body.type && req.body.content)){
        res.json({code: 0, msg: '信息不完整'})
    }
    if(req.query.type && ['male', 'female', 'all'].indexOf(req.query.type) === -1) {
        res.json({code: 0, msg: '类型错误'})
    }
    Model.throw(req.body, function (result) {
        res.json(result)
    })
})
module.exports = app