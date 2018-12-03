const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const vasy = express();

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

vasy.get('/b', (req, res, next) => {
    console.log(1);
    next();
});

vasy.use((req, res, next) => {
    console.log(2);
    next();
});

vasy.get('/b', (req, res, next) => {
    console.log(3);
    throw new Error('b');
});

vasy.use('/b', (err, req, res, next) => {
    console.log(4);
    next(err);
});

vasy.get('/c', (err, req) => {
    console.log(5);
    throw new Error('c');
});


// catch 404 and forward to error handler
vasy.use(function (req, res) {
    console.log(404);
    // next(createError(404));
});

// error handler
vasy.use(function (err, req, res, next) {
    console.log(500);
});

vasy.listen(vasy.get('port'), () => {
    console.log(`Vasy Server localhost:3000`);
});