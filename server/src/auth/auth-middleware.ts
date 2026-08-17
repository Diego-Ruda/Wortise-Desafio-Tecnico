import { Context, Next } from 'hono';
import { ZodSchema, ZodError } from 'zod';
import { auth } from './auth.js';

export async function requireAuth(c: Context, next: Next) {
  //Le pedimos a Better Auth que verifique la sesión recibida
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  // Si no hay sesión válida o expiro mandamos un mensaje con un error 401
  if (!session) {
    return c.json({ error: 'No autorizado. Tenes que iniciar sesión para realizar esta acción.' }, 401);
  }

  //Guardamos los datos del usuario y la sesión en el contexto de Hono "c" 
  c.set('user', session.user);
  c.set('session', session.session);

  await next();
}

// Middleware genérico para validar el body con Zod en Hono
export function validateBody(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      schema.parse(body);
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            error: 'Datos de entrada inválidos',
            details: error.issues.map((e) => e.message),
          },
          400
        );
      }
      return c.json({ error: 'Error al procesar la solicitud' }, 400);
    }
  };
}