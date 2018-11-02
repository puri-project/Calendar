var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var data = require('./models');
var vasy = express();

console.log(data);

// view engine setup
vasy.set('port', process.env.PORT || 3000)
    .engine('handlebars', handlebars({defaultLayout: 'main'}))
    .set('view engine', 'handlebars')
    .set(express.static(__dirname + '/public'));

// json 분석을 위해 body parser 사용
vasy.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}));

vasy.get('/', (req, res) => {
    console.log("visit phone");
    res.render('home');
});

// 통신 test
vasy.post('/data', (req, res) => {
    console.log("data");
    var data = JSON.stringify({
        "a": "1",
        "b": {"a": "s", "b": "c"},
        "c": ["1", "2", "3", "4"]
    })
    console.log(req.body);
    res.json(data);
});

// catch 404 and forward to error handler
vasy.use(function (req, res, next) {
    next(createError(404));
});

// error handler
vasy.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

vasy.listen(vasy.get('port'), () => {
    console.log(`Vasy Server localhost:3000`);
});