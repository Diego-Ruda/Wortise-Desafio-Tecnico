import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { ObjectId } from 'mongodb';
import { db } from '../db';
import { createArticleSchema, updateArticleSchema } from './articles.schema';
import { requireAuth } from '../auth/auth-middleware';

//Le decimos a Hono qué variables guarda el contexto 'c'. En este caso la variable user(con id,name,email) y session
type Env = {
  Variables: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    session: any;
  };
};

// Le pasamos <Env> al instanciar la app de Hono 
// cada vez que dentro de una ruta escribas c.get('user'), 
// TypeScript va a saber exactamente qué propiedades tiene user y no va a tirar error
export const articlesRoutes = new Hono<Env>();

//! ======================
// ! ---RUTAS PUBLICA---
//! ======================
// --- BUSCADOR PUBLICO DE ARTICULOS -GET ---
articlesRoutes.get('/public/search', async (c) => {// escucha la peticion GET
  //guadamos en query lo que el usuario excribio en el buscador
  const query = c.req.query('q') || '';

  //usamos un operador ternario para ver si query tiene un texto, osea si el usuario escribio algo
  const filter = query
    ? { 
        $or: [ //traermos los articulos que almenos cumpla estas 3 condiciones
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { authorName: { $regex: query, $options: 'i' } },
        ],
      }
    : {}; // sino escrbio nada no va a filtrar nada
  
  // consultamos con la DB sobre los articulos, con el filtro que el usuario escribio, luego ordernar los resultado en orden decreciente, y convertir la respuesta en un array
  const articles = await db
    .collection('articles')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  // como nos devolvio en un array los articulos lo retornamos en formato json
  return c.json(articles);
});

// --- LISTA PUBLICA DE AUTORES Y CANTIDAD DE ARTICULOS ---
articlesRoutes.get('/public/authors', async (c) => { // escucha la peticion GET

  const authors = await db
    // Usamos .aggregate() para procesar los artículos de la DB
    // usamos $group para junta todos los artículos por el ID de autor y cuenta cuántos hay
    // usamos $project para darle un formato limpio a la respuesta final y lo devolvemos en una array 
    .collection('articles')
    .aggregate([
      {
        $group: {
          _id: '$authorId',
          authorName: { $first: '$authorName' },
          totalArticles: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          authorId: '$_id',
          authorName: 1,
          totalArticles: 1,
        },
      },
    ])
    .toArray();

  return c.json(authors);
});

//! ======================
//! ---RUTAS PRIVADA---
//! ======================

// Aplicamos el requireAuth de autenticación a todas las rutas de artículos, para saber si el usuario esta logueado
articlesRoutes.use('*', requireAuth);

//---CREAR UN ARTÍCULO-POST----
articlesRoutes.post('/', zValidator('json', createArticleSchema), async (c) => { //valida los datos recibidos
  const user = c.get('user');
  const body = c.req.valid('json');

  const newArticle = {
    ...body,
    authorId: user.id,
    authorName: user.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('articles').insertOne(newArticle);

  return c.json(
    {
      message: 'Artículo creado exitosamente',
      article: { _id: result.insertedId, ...newArticle },
    },
    201
  );
});

//-----OBTENER ARTÍCULOS PROPIOS-GET----
articlesRoutes.get('/', async (c) => {
  const user = c.get('user');

  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 5;
  const skip = (page - 1) * limit;

  //define la id para luego buscar con el mongoDB.
  const query = { authorId: user.id }; 

  // consulta a mongodb
  const [articles, total] = await Promise.all([
    db
      .collection('articles')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection('articles').countDocuments(query),
  ]);

  //retorna los articulos y la informacion de la paginacion
  return c.json({
    articles,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ----OBTENER EL DETALLE DE UN ARTÍCULO-GET----
articlesRoutes.get('/:id', async (c) => {
  // extraemos la id
  const id = c.req.param('id');

  //validamos la id
  if (!ObjectId.isValid(id)) {
    return c.json({ error: 'ID de artículo inválido' }, 400);
  }

  //buscamos el articulo en la DB
  const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });

  //cuando terminamos de buscar el artcilo lo validamos si existe el articulo
  if (!article) {
    return c.json({ error: 'Artículo no encontrado' }, 404);
  }

  //retornamos el articulo
  return c.json(article);
});

//---EDITAR UN ARTÍCULO PROPIO-PUT---
articlesRoutes.put('/:id', zValidator('json', updateArticleSchema), async (c) => { //validamos los datos y la URL
  const user = c.get('user');
  const id = c.req.param('id');  // extraemos los 3 datos 
  const body = c.req.valid('json');

  //validamos el articulo
  if (!ObjectId.isValid(id)) {
    return c.json({ error: 'ID de artículo inválido' }, 400);
  }

  const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });

  if (!article) {
    return c.json({ error: 'Artículo no encontrado' }, 404);
  }

  //comparamos el id del autor y de la persona que esta realizando la peticion, sino coinciden, la API lo bloquea devolviendo un 403 
  if (article.authorId !== user.id) {
    return c.json({ error: 'No tienes permiso para editar este artículo' }, 403);
  }

  //actualizamos los datos y la fecha 
  const updatedArticle = {
    ...body,
    updatedAt: new Date(),
  };

  // guardamos en el DB, y retorna un mensaje del articulo actualizado correctamente
  await db.collection('articles').updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedArticle }
  );

  return c.json({ message: 'Artículo actualizado correctamente' });
});

//---ELIMINAR UN ARTÍCULO PROPIO--DELETE--
articlesRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');// extraemos los datos

  //validamos el id 
  if (!ObjectId.isValid(id)) {
    return c.json({ error: 'ID de artículo inválido' }, 400);
  }
  //buscamos si el articulo existe en el DB
  const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });

  if (!article) {
    return c.json({ error: 'Artículo no encontrado' }, 404);
  }

  //comparamos el id del autor y de la persona que esta realizando la peticion, sino coinciden, la API lo bloquea devolviendo un 403 
  if (article.authorId !== user.id) {
    return c.json({ error: 'No tienes permiso para eliminar este artículo' }, 403);
  }

  //eliminamos el articulo de DB y luego retornamos un mensaje de exito
  await db.collection('articles').deleteOne({ _id: new ObjectId(id) });

  return c.json({ message: 'Artículo eliminado correctamente' });
});