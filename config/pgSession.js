const session = require("express-session");
const genFunc = require("connect-pg-simple");

// function createSessionStore() {
//   // use this if running locally only
//   // const PostgresqlStore = genFunc(session);
//   // const sessionStore = new PostgresqlStore({
//   //   conString: `postgres://${process.env.USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
//   // });
//   // return sessionStore
//   // }
//   const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
//   // use this for production with hosted database
//   const PostgresqlStore = genFunc(session);
//   const sessionStore = new PostgresqlStore({
//     conString: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
//   });
//   return sessionStore;
// }
const { pool } = require('../data/pgDatabase'); // Import the pool

function createSessionStore() {
  const PostgresqlStore = genFunc(session);
  const sessionStore = new PostgresqlStore({
    pool: pool, // Use the pool instead of conString
    tableName: 'session', // Optional: specify a custom table name
  });

  return sessionStore;
}

function createSessionConfig() {
  return {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly:true,
      secure:true,
      sameSite:'strict',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    }, // define cookieOptions
    store: createSessionStore(),
  };
}
module.exports = createSessionConfig;
