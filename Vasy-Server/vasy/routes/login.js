const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const DB = require('../models');
const tokenUtil = require('../utils')
const {isLoggedIn, isNotLoggedIn} = require('./check-login-middlewares');

var router = express.Router();

/**
 * login 페이지 요청
 */
router.get('/', (req, res) => {
    res.render('home');
});

/**
 * login 요청
 * 실패 - {check : false}
 * 성공 - {check : true, accessToken, refreshToken}
 */
router.post('/login', (req, res) => {
    DB.selectLocalUser(checkLogin, req.body.email);

    function checkLogin(err, user) {
        const result = {};
        if (err) {                  // 등록되지 않은 이메일 또는 서버 에러
            console.log(err);
            result.check = false;
            return res.json(result);
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {    // 비밀번호 불일치
            result.check = false;
            return res.json(result);
        }

        var token = tokenUtil.TokenGenerator(req.body.email);   // token 생성

        result.check = true;
        result.accessToken = token.accessToken;
        result.refreshToken = token.refreshToken;
        res.json(result);
    }
});

/*
 * register 요청
 * 이메일 중복 검사 후 회원 가입 실행.
 * {result : Boolean} 성공 - true / 실패, 에러 - false
 */
router.post('/register', (req, res) => {
    DB.isLocalUser(isAvailableEmail, req.body.email);

    function isAvailableEmail(err, result) {
        if(err || !result) {
            console.log(err);
            return res.json({"result" : false});
        }
        DB.insertLocalUser(registerResult, req.body);
    }

    function registerResult(err, result){
        if(err) {
            console.log(err);
            return res.json({"result" : false});
        }
        return res.json({"result" : result});
    }
});

/**
 * logout 요청 (사용 고민 중)
 */
router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

// login 요청(passport)
// router.post('/passport', isNotLoggedIn, (req, res, next) => {
//     // passport
//     passport.authenticate('local', (authError, user, info) => {
//         if (authError) {
//             console.log(authError);
//             return next(authError);
//         }
//         if (!user) {
//             // req.flash('Login Error', info.message);
//             return res.redirect('/');
//         }
//         return req.login(user, (loginError) => {
//             if (loginError) {
//                 console.error(loginError);
//                 return next(loginError);
//             } else {
//                 // req.flash('Login', info.message);
//                 return res.redirect('/');
//             }
//         });
//     })(req, res, next);
// });

module.exports = router;