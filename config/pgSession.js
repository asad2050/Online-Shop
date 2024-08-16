const session = require('express-session');
const genFunc = require('connect-pg-simple')


function createSessionStore(){
  
const PostgresqlStore = genFunc(session);

const sessionStore = new PostgresqlStore({
  conString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});
return sessionStore
}

function createSessionConfig(){
  return{

  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 2*24*60*60*1000
} , // define cookieOptions
  store: createSessionStore()
  }
  }
  module.exports = createSessionConfig;