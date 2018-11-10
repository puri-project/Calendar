const local = require('./localStrategy');
const DB = require('../models');

module.exports = (passport) => {
    // req.session에 데이터 저장.
    // user는 LocalStrategy 객체에서 done(null,result)에 의해 리턴된 값
    passport.serializeUser((user, done) => {
        done(null, user.nickname);
    });

    // 안될 수도 있음
    // ======================
    // 로그인이 되어있고 다른 페이지로 이동시마다 발생.
    // 페이지 접근마다 사용자 정보를 session에서 읽어온 후 확인.
    passport.deserializeUser((nickname, done) => {
        DB.selectLocalUser(nickname, (err, result) => {
            if (err) {
                done(err);
            } else {
                done(null, result);
            }
        });
    });

    local(passport);
};