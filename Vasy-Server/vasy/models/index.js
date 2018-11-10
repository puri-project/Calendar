const mysql = require('mysql2');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

// create connection pools
var pool = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    connectionLimit: 5,
    queueLimit: 0
});

// 보안 필요...
// console.log(pool)의 경우 config 데이터 모두 출력...

// 테이블 명도 숨겨야 할까?
module.exports = {
    selectLocalUser: (nickname, callback) => {
        pool.getConnection((err, con) => {
            var sql = `SELECT nickname, password FROM user_info WHERE nickname = ?`;
            con.query(sql, nickname, (err, result, fields) => {
                con.release();
                // 서버 에러.
                if (err) {
                    return callback("server error");
                }
                // 데이터 검색 결과 없음.
                if (result.length === 0) {
                    return callback("unregistered ID");
                }
                // 데이터가 존재.
                else {
                    const data = {};
                    data.nickname = result[0].nickname;
                    data.password = result[0].password;
                    callback(null, data);
                }
            });
        });
    }
};