var mysql = require('mysql2');

// create the connection to database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '931013',
    database: 'vasy'
});

// simple query
connection.query(
    'SELECT * FROM a',
    function(err, results, fields) {
        if(err) {
            console.log(err);
        }
        console.log(results); // results contains rows returned by server
    }
);