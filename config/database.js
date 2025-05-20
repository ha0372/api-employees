const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'employeeDB';

let client;
let db;

async function connect() {
  if (db) return db;
  
  client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado exitosamente a MongoDB');
    
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('¡Debe conectarse primero a la base de datos!');
  }
  return db;
}

function close() {
  if (client) {
    client.close();
    console.log('Conexión a MongoDB cerrada');
  }
}

module.exports = {
  connect,
  getDb,
  close
};