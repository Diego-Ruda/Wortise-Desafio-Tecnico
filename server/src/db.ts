import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-db';
const client = new MongoClient(uri);

let dbInstance: Db;

export async function connectDB(): Promise<Db> {
  if (!dbInstance) {
    try {
      await client.connect();
      console.log('Conectado a MongoDB');
      dbInstance = client.db();
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      process.exit(1);
    }
  }
  return dbInstance;
}