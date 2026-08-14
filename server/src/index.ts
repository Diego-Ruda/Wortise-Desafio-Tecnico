import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { connectDB } from './db.js';

const app = new Hono();

// Ruta de prueba para verificar que la API responde
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Servidor Hono esta funcionando correctamente' });
});

const port = Number(process.env.PORT) || 3000;

// Conectamos a MongoDB y luego levantamos el servidor Hono
connectDB().then(() => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
});