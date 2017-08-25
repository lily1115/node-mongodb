var settings = require('../setting')
var Db = require('mongodb').Db
var Connection = require('mongodb').Connection
var Server = require('mongodb').Server
module.exports = new Db(settings.Db, new Server(settings.host, settings.port), {safe: true})