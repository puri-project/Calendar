const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const flash = require('connect-flash');
require('dotenv').config();

const vasy = express();
passportConfig(passport);

// 라우터 추가
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

// view engine, static 및 port 설정
vasy.set('port', process.env.PORT || 3000)
    .engine('handlebars', handlebars({defaultLayout: 'main'}))
    .set('view engine', 'handlebars')
    .set('views', path.join(__dirname, 'views'))
    .use(express.static(path.join(__dirname, 'public')));

// 쿠키 암호화 생성, 세션 설정.
vasy.use(express.json())
    .use(express.urlencoded({extended: false}))
    .use(cookieParser(process.env.COOKIE_SECRET))
    .use(session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        }
    }));

// 모듈 활성화
vasy.use(flash())
    .use(passport.initialize())
    .use(passport.session());

// 라우터 연결
vasy.use('/', loginRouter);
vasy.use('/register', registerRouter);

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