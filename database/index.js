const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'saitama',
    password: 'abc123',
    database: 'instagrin',
    port: 3306
});

module.exports = conn;