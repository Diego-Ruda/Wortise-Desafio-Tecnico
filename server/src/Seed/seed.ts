import { connectDB } from "../db.js";
import { auth } from "../auth/auth.js";
import { sampleUsers, sampleArticles } from "./seedData.js";

async function seed() {
  try {
    const db = await connectDB();
    console.log("Conectado a MongoDB para seed...");

    const articlesCollection = db.collection("articles");
    const usersCollection = db.collection("user");
    const accountsCollection = db.collection("account");
    const sessionsCollection = db.collection("session");

    // Limpiar colecciones
    await articlesCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await accountsCollection.deleteMany({});
    await sessionsCollection.deleteMany({});
    console.log("Colecciones limpiadas.");

    // Crear usuarios
    const createdUsers = [];
    for (const user of sampleUsers) {
      const res = await auth.api.signUpEmail({
        body: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });

      if (res?.user) {
        createdUsers.push({ id: res.user.id, name: res.user.name });
        console.log(`Usuario creado via Better Auth: ${user.name} (${user.email})`);
      }
    }

    // Crear los 25 artículos
    for (let i = 0; i < sampleArticles.length; i++) {
      const article = sampleArticles[i];
      // Asigna usuario de forma rotativa (Alice, Bob, Carol, Alice...)
      const author = createdUsers[i % createdUsers.length];

      await articlesCollection.insertOne({
        title: article.title,
        content: article.content,
        imageUrl: article.image,
        authorId: author.id,
        authorName: author.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Creado [${i + 1}/${sampleArticles.length}]: "${article.title}"`);
    }

    console.log("\nSeed completado con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
}

seed();