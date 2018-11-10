const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');
const DB = require('../models');

// 비밀번호 암호화 필요
module.exports = (passport) => {
    // 여기서부터 왜 안넘어갈까...
    passport.use(new LocalStrategy({
            usernameField: 'nickname',
            passwordField: 'password',
        },
        async (nickname, password, done) => {
            try {
                await DB.selectLocalUser(nickname, (err, result) => {
                    if (err === "server error") {
                        console.log(err);
                        return done(err);
                    }
                    if (err === "unregistered ID") {
                        console.log(err);
                        return done(null, false, {message: "unregistered ID"});
                    } else {
                        var isValid = (password === result.password);
                        if (isValid) {
                            //
                            console.log("ok");
                            return done(null, result, {message: "login success"});
                        } else {
                            //
                            console.log("wrong password");
                            return done(null, false, {message: "wrong password"});
                        }
                    }
                });
            } catch (err) {
                done(err);
            }
        }));
};