const mysql = require('mysql2');

let db = mysql.createConnection({
    host: '107.182.25.49',
    port: 3306,
    user: 'project1',
    password: 'll666888',
    database: 'project1'
})

module.exports = db;
