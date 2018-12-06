const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../.env'}); // 경로 설정해줄 것.

const TokenGenerator = (data) => {
    var token = {};
    var tokenData = {email: data};
    token.accessToken = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '1s'});
    token.refreshToken = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: '90d'});

    console.log(token.accessToken);
    return token;
}

const isValidToken = (token, callback) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        const exp = new Date(decode.exp * 1000);
        const now = Date.now();
        const week = 7 * 60 * 60 * 24 * 1000;

        if (exp < now) {    // 기간 만료
            return false;
        } else if (exp < (now + week)) {    // 만료 1주일 전 (새로운 토큰 발급)
            return TokenGenerator(decode.email);
        } else {
            return true;
        }

    });
}

module.exports = {
    TokenGenerator,
    isValidToken
}