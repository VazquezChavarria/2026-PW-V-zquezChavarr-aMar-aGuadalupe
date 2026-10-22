const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Lupita.14',
    database: 'cecyt9_local',
    dateStrings: true,
});
module.exports = pool;