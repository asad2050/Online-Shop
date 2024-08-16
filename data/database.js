const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  database = client.db(process.env.DB_NAME);
}

function getDb() {
  if (!database) {
    throw new Error('You must connect first!');
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
};