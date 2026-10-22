// Lee los datos de conexión del archivo .env (que NO se sube a GitHub).
// Copia .env.example como .env y escribe ahí tu contraseña de MySQL.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'cecyt9_local',
    dateStrings: true,
});

module.exports = pool;
