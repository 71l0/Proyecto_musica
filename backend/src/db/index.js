const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

//Pool de conexiones

console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});


//Probar conexion
pool.connect()
    .then(() => console.log('Conectado a la base de datos'))
    .catch((err) => console.error('Error de conexión', err.stack));

module.exports = {
  query: (text, params) => pool.query(text, params)
};