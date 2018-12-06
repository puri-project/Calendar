const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

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
var pool = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    connectionLimit: 5,
    queueLimit: 0
});

module.exports = {
    isLocalUser: (callback, email) => {
        pool.getConnection((err, con) => {
            con.query(`SELECT email FROM user_info WHERE email = ?`, email, (err, result, fields) => {
                con.release();
                if (err) {
                    return callback(`정보조회 실패`);
                }
                // 조회된 정보가 없어야 함.
                return callback(null, (result.length == 0));
            })
        })
    },

    insertLocalUser: (callback, userData) => {
        console.log(userData.name, userData.email, userData.password);
        pool.getConnection((err, con) => {
            const sql = `INSERT INTO user_info VALUES (null, ?, ?, ?, 'local', null)`;
            con.query(sql, [userData.name, userData.email, bcrypt.hashSync(userData.password, 12)], (err, result, fields) => {
                con.release();

                if (err) {
                    return callback(`회원가입 실패`);
                }
                return callback(null, (result.length != 0));    // 성공 정보가 있어야 함.
            })
        })
    },

    selectLocalUser: (callback, email) => {
        console.log(email);
        pool.getConnection((err, con) => {
            const sql = `SELECT nickname, email, password FROM user_info WHERE email = ?`;
            con.query(sql, email, (err, result, fields) => {
                con.release();

                if (err) {
                    return callback("정보조회 실패");
                }
                if (result.length === 0) {  // 데이터 검색 결과 없음.
                    return callback("등록되지 않은 이메일");
                }

                // 데이터가 존재할 경우.
                const userInfo = {};
                userInfo.nickname = result[0].nickname;
                userInfo.email = result[0].email;
                userInfo.password = result[0].password;
                callback(null, userInfo);
            });
        });
    }
};