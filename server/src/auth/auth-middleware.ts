import { Context, Next } from 'hono';
import { auth } from './auth.js';

export async function requireAuth(c: Context, next: Next) {
  //Le pedimos a Better Auth que verifique la sesión recibida
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  // Si no hay sesión válida o expiro mandamos un mensaje con un error 401
  if (!session) {
    return c.json({ error: 'No autorizado.Tenes que iniciar sesión para realizar esta acción.' }, 401);
  }

  //Guardamos los datos del usuario y la sesión en el contexto de Hono "c" 
  c.set('user', session.user);
  c.set('session', session.session);

  await next();
}