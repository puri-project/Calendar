const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const DB = require('../models');
const tokenUtil = require('../utils')
const {isLoggedIn, isNotLoggedIn} = require('./check-login-middlewares');

var router = express.Router();

/**
 * user_info
 * +----------+--------------+------+-----+---------+----------------+
 * | Field    | Type         | Null | Key | Default | Extra          |
 * +----------+--------------+------+-----+---------+----------------+
 * | id       | int(11)      | NO   | PRI | NULL    | auto_increment |
 * | nickname | varchar(20)  | NO   |     | NULL    |                |
 * | email    | varchar(40)  | NO   | UNI | NULL    |                |
 * | password | varchar(100) | YES  |     | NULL    |                |
 * | provider | varchar(10)  | NO   |     | local   |                |
 * | sns_id   | varchar(30)  | YES  |     | NULL    |                |
 * +----------+--------------+------+-----+---------+----------------+
 */

// login 페이지
router.get('/', (req, res) => {
    res.render('home');
});

/**
 * 로그인 요청
 * 실패 시 check : false
 * 성공 시 check : true, accessToken, refreshToken
 */
router.post('/signin', (req, res) => {
    DB.selectLocalUser(checkLogin, req.body.email);

    function checkLogin(err, user) {
        // 결과로 보낼 객체
        const result = {};

        // 등록되지 않은 이메일 또는 서버 에러
        if (err) {
            console.log(err);
            result.check = false;

            return res.json(result);
        }

        // 비밀번호 불일치
        if(! bcrypt.compareSync(req.body.password, user.password)) {
            result.check = false;
            return res.json(result);
        }

        // 토큰 생성
        var token = tokenUtil.TokenGenerator(req.body.email);

        result.check = true;
        result.accessToken = token.accessToken;
        result.refreshToken = token.refreshToken;

        res.json(result);
    }
})

// login 요청(passport)
router.post('/login', isNotLoggedIn, (req, res, next) => {
    // passport
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.log(authError);
            return next(authError);
        }
        if (!user) {
            // req.flash('Login Error', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            } else {
                // req.flash('Login', info.message);
                return res.redirect('/');
            }
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;