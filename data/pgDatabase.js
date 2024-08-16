const { Pool } = require('pg');



  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Optionally, you can test the connection here
//   await pool.connect();
  // console.log(await pool.query('SELECT NOW()'));


// function getPool() {
//   if (!pool) {

//     throw new Error('You must connect first!');
//   }

//   return pool;
// }




module.exports = {
  // connectToDatabase,
  // getPool
  pool
};
