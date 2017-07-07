var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Movie = require('./models/movie');
var _ = require('underscore');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var port = process.env.PORT || 3000;
var app = express();
// 加载路径处理模块
// 该模块能规范的输出模块路径
// 这里主要是兼容多服务端的路径访问
// 没有此模块也能正常运行
var path = require('path');

mongoose.connect('mongodb://localhost:27017/imooc');
mongoose.connection.on('connected', function(){
    console.log('Connection success!');
});
mongoose.connection.on('error', function(err){
    console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Connection disconnected');
});


app.set('views','./views/pages');
app.set('view engine','jade');
app.use(serveStatic('bower_components')); //指定静态文件资源库
app.use( express.static( path.join(__dirname, 'public') ) );

//中间件:获取body数据
app.use(bodyParser.urlencoded({extended: true}));   // extended默认为false,只能接受字符串或数组
//app.use(bodyParser.json()); // 把返回值转成json格式

app.locals.moment = require('moment');
app.get('/',function(req,res){
	Movie.fetch(function (err,movies) {
		if (err) {console.log(err);};
		res.render('index',{
		    title:'imooc 首页',
		    movies: movies
		});
	})
    
} );

//detail page
app.get('/movie/:id', function(req, res) {
	var id= req.params.id;
	Movie.findById(id,function  (err,movie)	 {
		if (err) console.log(err);
		res.render('detail', {
		    title: 'imooc'+movie.title,
		    movie: movie
		})
	})
    
})

//admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})


//admin update movie
app.get('/admin/update/:id',function (req, res) {
    var id= req.params.id;

    if (id) {
        Movie.findById(id, function (err,movie) {
            res.render('admin',{
                title:'imooc 后台更新页',
                movie:movie
            })

        })
    }
})

//admin post movie
app.post('/admin/movie/new',function(req,res){
	console.log(req.body.movie);
	var id = req.body.movie._id;

	var movieObj = req.body.movie;
	var _movie;
	if (id !== undefined && id !== null && id!== "") {
		Movie.findById(id,function (err,movie) {
			if (err) console.log(err)

            console.log(movie + "这里是100行c")
			_movie = _.extend(movie,movieObj);
			_movie.save(function (err,_movie) {
				if (err) console.log(err)
				res.redirect('/movie/'+_movie._id)
			})
		})
	}else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash,
		})
		console.log(_movie);
		_movie.save(function (err,_movie) {
			if (err) {
			       console.log('保存失败')
			}
			console.log('meow');
        	res.redirect('/movie/'+_movie._id);
		})

	}
})
//list page
app.get('/admin/list', function(req, res) {
	 Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }

        res.render('list',{
            title:'imooc 列表页',
            movies: movies
        });
    });
})

// 接收删除请求
app.delete('/admin/list',function(req, res) {
  // req.query 主要获取到客户端提交过来的键值对
  // '/admin/list?id=12'，这里就会获取到12
  var id = req.query.id;
  console.log(id);

  if(id) {
    Movie.remove({_id: id}, function(err) {
      if( err ) {
        console.log(err);
      }else{
        res.json({success: 1});
      }
    });
  }

});
//设置端口号
app.listen(port, function () {
    console.log('项目启动成功, 端口号: ' + port);
});