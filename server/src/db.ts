import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/blog-db";
export const client = new MongoClient(uri);

// Exportamos la referencia de la base de datos para que auth.ts y articles.routes.ts la puedan importar
export const db: Db = client.db();

let isConnected = false;

export async function connectDB(): Promise<Db> {
  if (!isConnected) {
    try {
      await client.connect();
      console.log("Conectado a MongoDB");
      isConnected = true;
    } catch (error) {
      console.error("Error al conectar a MongoDB:", error);
      process.exit(1);
    }
  }
  return db;
}