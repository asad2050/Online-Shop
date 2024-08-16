const mongoDbStore = require('connect-mongodb-session');
const session= require('express-session');

function createSessionStore(){
    const MongoDbStore = mongoDbStore(session);

    const store= new MongoDbStore({
        uri:process.env.SESSION_STORE_URL,
        databaseName:process.env.DB_NAME,
        collection:'sessions',
    });
    return store;
}
function createSessionConfig(){
    return{
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:false,
        store:createSessionStore(),
        cookie:{
            maxAge: 2*24*60*60*1000
        }
    };

}


module.exports=createSessionConfig;