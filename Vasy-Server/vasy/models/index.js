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

const db = {};

// async await 변환 필요...
pool.getConnection((err, conn) => {
    conn.query("show databases", (err, results, fields) => {
        if (!err) {
            console.log('testing');
            db.result = JSON.stringify(results);
        } else {
            console.error(err);
        }
        // 커넥션 반납
        if (conn != null) {
            pool.releaseConnection(conn);
        }
    });
});

// 동기화된 결과를 보내야함.
module.exports = db;