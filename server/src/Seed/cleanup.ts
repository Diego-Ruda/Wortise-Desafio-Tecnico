import { connectDB } from "../db";

async function cleanup() {
  try {
    const db = await connectDB();
    console.log("Limpiando base de datos...");

    const collections = [
      "user",
      "articles",
      "account",
      "session",
      "verification",
    ];

    for (const collectionName of collections) {
      const result = await db.collection(collectionName).deleteMany({});
      console.log(
        `${collectionName}: ${result.deletedCount} documentos eliminados`,
      );
    }

    console.log("\nBase de datos limpiada correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al limpiar:", error);
    process.exit(1);
  }
}

cleanup();
