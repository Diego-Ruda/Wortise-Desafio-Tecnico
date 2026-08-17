import { authClient } from '../api/client'

// Hook provisto por Better Auth para consultar la sesión actual
export function useSession() {
  return authClient.useSession()
}

// Funciones helpers para Login, Registro y Logout
export async function loginUser(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  })
  if (error) {
    throw new Error(error.message || 'Error al iniciar sesión')
  }
  return data
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await authClient.signUp.email({
    email,
    password,
    name,
  })

  if (response.error) {
    throw new Error(response.error.message || 'Error al registrar usuario')
  }

  return response.data
}

export async function logoutUser() {
  await authClient.signOut()
}